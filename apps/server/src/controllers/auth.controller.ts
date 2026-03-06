import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
<<<<<<< HEAD
import crypto from 'crypto';
import { registerSchema, loginSchema } from '@edustream/types';
import { User } from '../models/User.model';
import { PasswordReset } from '../models/PasswordReset.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendOTPEmail } from '../utils/email';
=======
import { registerSchema, loginSchema } from '@edustream/types';
import { User } from '../models/User.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f

import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/jwt';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body with Zod
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
<<<<<<< HEAD
        { userId: user._id.toString(), email: user.email, role: user.role, name: user.name },
=======
        { userId: user._id.toString(), email: user.email, role: user.role },
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      // Set httpOnly cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message, errors: error.issues });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body with Zod
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
<<<<<<< HEAD
        { userId: user._id.toString(), email: user.email, role: user.role, name: user.name },
=======
        { userId: user._id.toString(), email: user.email, role: user.role },
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      // Set httpOnly cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message, errors: error.issues });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Verify token (protected route)
export const verifyToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // User is already authenticated by middleware
    const user = await User.findById(req.user?.userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'Token is valid',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
};

// Logout user
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Clear the authToken cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
<<<<<<< HEAD

// Request password reset OTP
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      res.status(200).json({ 
        message: 'If an account exists with this email, you will receive an OTP shortly.' 
      });
      return;
    }

    // Delete any existing OTP for this user
    await PasswordReset.deleteMany({ userId: user._id });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create password reset record
    const passwordReset = new PasswordReset({
      userId: user._id,
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await passwordReset.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp, user.name);

    if (!emailSent) {
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
      return;
    }

    res.status(200).json({ 
      message: 'OTP sent to your email address. Please check your inbox.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const passwordReset = await PasswordReset.findOne({
      email: email.toLowerCase(),
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!passwordReset) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Mark OTP as verified
    passwordReset.verified = true;
    await passwordReset.save();

    res.status(200).json({ 
      message: 'OTP verified successfully',
      resetToken: passwordReset._id.toString() 
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      res.status(400).json({ message: 'Reset token and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long' });
      return;
    }

    const passwordReset = await PasswordReset.findOne({
      _id: resetToken,
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!passwordReset) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.findByIdAndUpdate(passwordReset.userId, {
      password: hashedPassword,
    });

    // Delete the password reset record
    await PasswordReset.deleteOne({ _id: resetToken });

    res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};
=======
>>>>>>> d9f5103b5aaa692773845db213209570c94c058f
