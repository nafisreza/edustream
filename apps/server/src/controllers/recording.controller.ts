import { Response } from 'express';
import { EgressClient, EncodedFileType, EncodedFileOutput } from 'livekit-server-sdk';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Room } from '../models/Room.model';
import { Recording } from '../models/Recording.model';

const livekitHost = process.env.LIVEKIT_URL || 'http://localhost:7880';
const livekitApiKey = process.env.LIVEKIT_API_KEY || 'devkey';
const livekitApiSecret = process.env.LIVEKIT_API_SECRET || 'devkey';

// Path where the server reads recorded files (host side of the bind mount).
// __dirname = apps/server/src/controllers — go up 4 levels to reach the repo root.
const recordingsDir =
  process.env.RECORDINGS_DIR ||
  path.resolve(__dirname, '../../../../recordings');

// Path inside the Egress container where files are written (always /recordings).
const egressRecordingsPath = '/recordings';

const getEgressClient = () =>
  new EgressClient(livekitHost, livekitApiKey, livekitApiSecret);

// Start recording a room
export const startRecording = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.userId;
    const userName = req.user?.name || 'Host';

    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      res.status(404).json({ message: 'Room not found or inactive' });
      return;
    }

    if (room.hostId !== userId) {
      res.status(403).json({ message: 'Only the host can start recording' });
      return;
    }

    // Prevent duplicate active recordings
    const active = await Recording.findOne({ roomId, status: 'recording' });
    if (active) {
      res.status(400).json({ message: 'A recording is already in progress', recordingId: active.recordingId });
      return;
    }

    // Ensure the local recordings directory exists (for download reads)
    fs.mkdirSync(recordingsDir, { recursive: true });

    const recordingId = crypto.randomUUID();
    const filename = `${roomId}-${recordingId}.mp4`;
    // filepath passed to Egress = path inside the egress container
    const egressFilepath = `${egressRecordingsPath}/${filename}`;

    const egressClient = getEgressClient();
    const egressInfo = await egressClient.startRoomCompositeEgress(
      roomId,
      new EncodedFileOutput({
        filepath: egressFilepath,
        fileType: EncodedFileType.MP4,
      }),
    );

    const recording = new Recording({
      recordingId,
      roomId,
      roomName: room.name,
      hostId: userId,
      hostName: userName,
      egressId: egressInfo.egressId,
      status: 'recording',
      startedAt: new Date(),
      filePath: filename,
    });

    await recording.save();

    res.status(201).json({
      message: 'Recording started',
      recording: {
        recordingId,
        status: 'recording',
        startedAt: recording.startedAt,
      },
    });
  } catch (error) {
    console.error('Start recording error:', error);
    res.status(500).json({
      message: 'Failed to start recording. Ensure the egress service is running.',
    });
  }
};

// Stop an active recording
export const stopRecording = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    if (room.hostId !== userId) {
      res.status(403).json({ message: 'Only the host can stop recording' });
      return;
    }

    const recording = await Recording.findOne({ roomId, status: 'recording' });
    if (!recording) {
      res.status(404).json({ message: 'No active recording found for this room' });
      return;
    }

    const egressClient = getEgressClient();
    await egressClient.stopEgress(recording.egressId);

    const endedAt = new Date();
    const duration = Math.round((endedAt.getTime() - recording.startedAt.getTime()) / 1000);

    // Try to read file size after egress finishes writing
    let fileSize: number | undefined;
    if (recording.filePath) {
      const safeName = path.basename(recording.filePath);
      const fullPath = path.join(recordingsDir, safeName);
      try {
        fileSize = fs.statSync(fullPath).size;
      } catch {
        // file may still be flushing; size will be missing
      }
    }

    recording.status = 'completed';
    recording.endedAt = endedAt;
    recording.duration = duration;
    if (fileSize !== undefined) recording.fileSize = fileSize;
    await recording.save();

    res.status(200).json({
      message: 'Recording stopped',
      recording: {
        recordingId: recording.recordingId,
        status: 'completed',
        duration,
        endedAt,
      },
    });
  } catch (error) {
    console.error('Stop recording error:', error);
    res.status(500).json({ message: 'Failed to stop recording' });
  }
};

// Get active recording status for a room
export const getRecordingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const recording = await Recording.findOne({ roomId, status: 'recording' });
    res.status(200).json({
      isRecording: !!recording,
      recording: recording
        ? { recordingId: recording.recordingId, startedAt: recording.startedAt }
        : null,
    });
  } catch (error) {
    console.error('Get recording status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List all completed recordings owned by the authenticated user
export const listRecordings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const recordings = await Recording.find({ hostId: userId })
      .sort({ startedAt: -1 })
      .limit(100)
      .select('-__v -egressId');

    res.status(200).json({ recordings });
  } catch (error) {
    console.error('List recordings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download a recording file
export const downloadRecording = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { recordingId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const recording = await Recording.findOne({ recordingId });
    if (!recording) {
      res.status(404).json({ message: 'Recording not found' });
      return;
    }

    if (recording.hostId !== userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (!recording.filePath) {
      res.status(404).json({ message: 'Recording file not available' });
      return;
    }

    // Use path.basename to prevent path traversal
    const safeName = path.basename(recording.filePath);
    const fullPath = path.join(recordingsDir, safeName);

    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ message: 'Recording file not found on disk' });
      return;
    }

    const downloadName = `${recording.roomName.replace(/[^a-z0-9]/gi, '_')}-${recording.recordingId}.mp4`;
    res.download(fullPath, downloadName);
  } catch (error) {
    console.error('Download recording error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
