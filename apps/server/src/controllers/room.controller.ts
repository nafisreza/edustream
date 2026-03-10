import { Request, Response } from 'express';
import { z } from 'zod';
import { createRoomSchema, joinRoomSchema } from '@edustream/types';
import { Room } from '../models/Room.model';
import { generateRoomId } from '../utils/roomId.generator';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { generateLiveKitToken } from '../utils/livekit';

// Create a new room
export const createRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Validate request body with Zod
    const validatedData = createRoomSchema.parse(req.body);
    const { name, description } = validatedData;
      const userId = req.user?.userId;
      const userName = req.user?.name || 'Host';

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      if (req.user?.role !== 'teacher') {
        res.status(403).json({ message: 'Only teachers can create rooms' });
        return;
      }

      // Generate unique room ID
      const roomId = generateRoomId();

      // Create new room
      const room = new Room({
        roomId,
        name,
        description,
        hostId: userId,
        hostName: userName,
        participants: [
          {
            userId,
            name: userName,
            role: 'host',
            status: 'active',
            joinedAt: new Date(),
          },
        ],
        isActive: true,
      });

      await room.save();

      res.status(201).json({
        message: 'Room created successfully',
        room: {
          id: room._id,
          roomId: room.roomId,
          name: room.name,
          description: room.description,
          hostId: room.hostId,
          hostName: room.hostName,
          settings: room.settings,
        },
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message, errors: error.issues });
      return;
    }
    console.error('Room creation error:', error);
    res.status(500).json({ message: 'Server error during room creation' });
  }
};

// Get room details
export const getRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({ roomId: id, isActive: true });

    if (!room) {
      res.status(404).json({ message: 'Room not found or has been closed' });
      return;
    }

    res.status(200).json({
      room: {
        id: room._id,
        roomId: room.roomId,
        name: room.name,
        description: room.description,
        hostId: room.hostId,
        hostName: room.hostName,
        participantCount: room.participants.length,
        settings: room.settings,
        isActive: room.isActive,
      },
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error while fetching room' });
  }
};

// Join a room
export const joinRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Validate request body with Zod
    const validatedData = joinRoomSchema.parse(req.body);
    const { name } = validatedData;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const room = await Room.findOne({ roomId: id, isActive: true });

      if (!room) {
        res.status(404).json({ message: 'Room not found or has been closed' });
        return;
      }

      // Check if room is full
      if (room.participants.length >= room.settings.maxParticipants) {
        res.status(403).json({ message: 'Room is full' });
        return;
      }

      // Check if user already in room
      const existingParticipant = room.participants.find((p) => p.userId === userId);
      if (existingParticipant) {
        res.status(200).json({
          message: existingParticipant.status === 'pending' ? 'Already waiting for host approval' : 'Already in room',
          room: {
            roomId: room.roomId,
            name: room.name,
            hostId: room.hostId,
            waitingRoomEnabled: room.settings.waitingRoomEnabled,
          },
          pending: existingParticipant.status === 'pending',
        });
        return;
      }

      // Add participant to room — pending if waiting room is enabled.
      room.participants.push({
        userId,
        name,
        role: 'participant',
        status: room.settings.waitingRoomEnabled ? 'pending' : 'active',
        joinedAt: new Date(),
      });

      await room.save();

      res.status(200).json({
        message: room.settings.waitingRoomEnabled
          ? 'Join request sent. Waiting for host approval.'
          : 'Joined room successfully',
        room: {
          roomId: room.roomId,
          name: room.name,
          hostId: room.hostId,
          waitingRoomEnabled: room.settings.waitingRoomEnabled,
        },
        pending: room.settings.waitingRoomEnabled,
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message, errors: error.issues });
      return;
    }
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error while joining room' });
  }
};

// Close a room (host only)
export const closeRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const room = await Room.findOne({ roomId: id, isActive: true });

    if (!room) {
      res.status(404).json({ message: 'Room not found or already closed' });
      return;
    }

    // Check if user is the host
    if (room.hostId !== userId) {
      res.status(403).json({ message: 'Only the host can close the room' });
      return;
    }

    room.isActive = false;
    await room.save();

    res.status(200).json({ message: 'Room closed successfully' });
  } catch (error) {
    console.error('Close room error:', error);
    res.status(500).json({ message: 'Server error while closing room' });
  }
};

// Update room settings (host only)
export const updateRoomSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const room = await Room.findOne({ roomId: id, isActive: true });

    if (!room) {
      res.status(404).json({ message: 'Room not found or has been closed' });
      return;
    }

    if (room.hostId !== userId) {
      res.status(403).json({ message: 'Only the host can update room settings' });
      return;
    }

    const { maxParticipants, autoMuteOnJoin, waitingRoomEnabled } = req.body;

    if (maxParticipants !== undefined) {
      const max = Number(maxParticipants);
      if (!Number.isInteger(max) || max < 2 || max > 100) {
        res.status(400).json({ message: 'maxParticipants must be an integer between 2 and 100' });
        return;
      }
      room.settings.maxParticipants = max;
    }
    if (autoMuteOnJoin !== undefined) {
      room.settings.autoMuteOnJoin = Boolean(autoMuteOnJoin);
    }
    if (waitingRoomEnabled !== undefined) {
      room.settings.waitingRoomEnabled = Boolean(waitingRoomEnabled);
    }

    await room.save();

    res.status(200).json({ message: 'Settings updated', settings: room.settings });
  } catch (error) {
    console.error('Update room settings error:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
};

// Get LiveKit access token for a room
export const getRoomToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userName = req.user?.name || 'Anonymous';

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const room = await Room.findOne({ roomId: id, isActive: true });

    if (!room) {
      res.status(404).json({ message: 'Room not found or has been closed' });
      return;
    }

    // Check if user is in the room
    const participant = room.participants.find((p) => p.userId === userId);
    if (!participant) {
      res.status(403).json({ message: 'You must join the room first' });
      return;
    }

    // Participant is still awaiting host approval — return pending flag, no token.
    if (participant.status === 'pending') {
      res.status(200).json({ pending: true });
      return;
    }

    // Generate LiveKit token
    const isHost = room.hostId === userId;
    const token = await generateLiveKitToken(room.roomId, userName, userId, isHost);

    res.status(200).json({
      token,
      url: process.env.LIVEKIT_URL || 'http://localhost:7880',
      roomName: room.roomId,
      participantName: userName,
      isHost,
    });
  } catch (error) {
    console.error('Get room token error:', error);
    res.status(500).json({ message: 'Server error while generating token' });
  }
};
