import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header or Bearer token missing');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
        status: 401
      });
    }

    const token = authHeader.substring(7);
    console.log('Token received:', token ? `${token.substring(0, 20)}...` : 'none');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      status: 401
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Authorization failed: No user in request');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
        status: 401
      });
    }

    console.log('Authorization check - User role:', req.user.role, 'Required roles:', roles);
    
    if (!roles.includes(req.user.role)) {
      console.log('Authorization failed: User role', req.user.role, 'not in allowed roles:', roles);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        status: 403
      });
    }

    console.log('Authorization successful');
    next();
  };
};

