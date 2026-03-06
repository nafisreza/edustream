import { Router } from 'express';
import { register, login, verifyToken, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/verify', authenticate, verifyToken);
router.post('/logout', logout);

export default router;
