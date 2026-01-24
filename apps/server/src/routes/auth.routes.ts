import { Router } from 'express';
import { 
  register, 
  login, 
  verifyToken, 
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword 
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/verify', authenticate, verifyToken);
router.post('/logout', logout);

export default router;
