import { Router } from 'express';
<<<<<<< HEAD
import { createRoom, getRoom, joinRoom, closeRoom, getRoomToken } from '../controllers/room.controller';
=======
import { createRoom, getRoom, joinRoom, closeRoom } from '../controllers/room.controller';
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All room routes require authentication
router.use(authenticate);

router.post('/create', createRoom);
router.get('/:id', getRoom);
router.post('/:id/join', joinRoom);
router.delete('/:id', closeRoom);
<<<<<<< HEAD
router.get('/:id/token', getRoomToken);
=======
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f

export default router;
