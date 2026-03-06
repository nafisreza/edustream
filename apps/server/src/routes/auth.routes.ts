import { Router } from 'express';
<<<<<<< HEAD
import { 
  register, 
  login, 
  verifyToken, 
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword 
} from '../controllers/auth.controller';
=======
import { register, login, verifyToken, logout } from '../controllers/auth.controller';
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
<<<<<<< HEAD
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
=======
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f

// Protected routes
router.get('/verify', authenticate, verifyToken);
router.post('/logout', logout);

export default router;
