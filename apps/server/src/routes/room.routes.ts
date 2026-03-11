import { Router } from 'express';
import { createRoom, getRoom, joinRoom, closeRoom, getRoomToken, updateRoomSettings } from '../controllers/room.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All room routes require authentication
router.use(authenticate);

router.post('/create', createRoom);
router.get('/:id', getRoom);
router.post('/:id/join', joinRoom);
router.delete('/:id', closeRoom);
router.get('/:id/token', getRoomToken);
router.patch('/:id/settings', updateRoomSettings);

export default router;
