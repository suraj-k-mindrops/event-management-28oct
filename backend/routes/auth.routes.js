import express from 'express';
import prisma from '../config/database.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.util.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, email, and password are required',
        status: 400
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 6 characters',
        status: 400
      });
    }

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User with this email already exists',
        status: 400
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with student profile if role is STUDENT
    let user;
    if ((role || 'STUDENT') === 'STUDENT') {
      // Create user and student profile in a transaction
      user = await prisma.$transaction(async (tx) => {
        // Create user
        const newUser = await tx.users.create({
          data: {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'STUDENT'
          }
        });

        // Create student profile linked to user
        await tx.students.create({
          data: {
            name: name.trim(),
            email: normalizedEmail,
            user_id: newUser.id
          }
        });

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        };
      });
    } else {
      // For non-student roles, just create user
      user = await prisma.users.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: role || 'STUDENT'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true
        }
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      data: user,
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user',
      status: 500,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // DEBUG: Log incoming request
    console.log('=== LOGIN DEBUG ===');
    console.log('Received email:', email);
    console.log('Received password length:', password ? password.length : 0);
    console.log('Email type:', typeof email);
    console.log('Password type:', typeof password);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required',
        status: 400
      });
    }

    // Find user - normalize email to lowercase for consistency
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
    
    console.log('Normalized email:', normalizedEmail);
    
    if (!normalizedEmail) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid email format',
        status: 400
      });
    }
    const user = await prisma.users.findUnique({
      where: { email: normalizedEmail }
    });

    console.log('User found:', user ? 'YES' : 'NO');

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
        status: 401
      });
    }

    // Check password
    console.log('Stored password hash length:', user.password ? user.password.length : 0);
    const isPasswordValid = await comparePassword(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
        status: 401
      });
    }

    // Generate tokens
    console.log('Generating token for user:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('Login successful, returning user data:', userData);

    res.json({
      data: {
        user: userData,
        token,
        refreshToken
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login',
      status: 500,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout (client-side token removal, server logs if needed)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});

// Verify token
router.get('/verify', authenticate, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
        status: 404
      });
    }

    res.json({
      data: user,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify token',
      status: 500,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Refresh token
router.post('/refresh', authenticate, (req, res) => {
  try {
    const newToken = generateToken(req.user);
    res.json({
      data: { token: newToken },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to refresh token',
      status: 500,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

