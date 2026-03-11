import { Router } from 'express';
import {
  startRecording,
  stopRecording,
  getRecordingStatus,
  listRecordings,
  downloadRecording,
} from '../controllers/recording.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// List all recordings for the current user
router.get('/', listRecordings);

// Get active recording status for a room
router.get('/rooms/:roomId/status', getRecordingStatus);

// Start recording a room
router.post('/rooms/:roomId/start', startRecording);

// Stop recording a room
router.post('/rooms/:roomId/stop', stopRecording);

// Download a specific recording
router.get('/:recordingId/download', downloadRecording);

export default router;
