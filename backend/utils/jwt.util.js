import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      type: 'refresh'
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

