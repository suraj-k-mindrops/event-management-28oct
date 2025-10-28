import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/events.routes.js';
import eventTypeRoutes from './routes/eventTypes.routes.js';
import venueRoutes from './routes/venues.routes.js';
import vendorRoutes from './routes/vendors.routes.js';
import studentRoutes from './routes/students.routes.js';
import serviceRoutes from './routes/services.routes.js';
import fieldRoutes from './routes/fields.routes.js';
import providerRoutes from './routes/providers.routes.js';
import contentPageRoutes from './routes/contentPages.routes.js';
import mediaItemRoutes from './routes/mediaItems.routes.js';
import newsItemRoutes from './routes/newsItems.routes.js';
import eventPackageRoutes from './routes/eventPackages.routes.js';
import directoryRoutes from './routes/directory.routes.js';
import prisma from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Enhanced CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',') 
  : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS: Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Log CORS requests in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin || 'none'}`);
    next();
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Mindrops Event Management API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      events: '/api/events',
      venues: '/api/venues',
      vendors: '/api/vendors',
      services: '/api/services',
      providers: '/api/providers',
      students: '/api/students',
      eventTypes: '/api/event-types',
      eventPackages: '/api/event-packages',
      directory: '/api/directory',
      contentPages: '/api/content-pages',
      mediaItems: '/api/media-items',
      newsItems: '/api/news-items',
      fields: '/api/fields'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/content-pages', contentPageRoutes);
app.use('/api/media-items', mediaItemRoutes);
app.use('/api/news-items', newsItemRoutes);
app.use('/api/event-packages', eventPackageRoutes);
app.use('/api/directory', directoryRoutes);
// Alias to support student frontend expecting /directory-entries
app.use('/api/directory-entries', directoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    message: err.message,
    status: err.status || 500,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    status: 404
  });
});

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  
  // Test database connection
  try {
    await prisma.$connect();
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
  }
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server gracefully...`);
  
  server.close(async () => {
    console.log('HTTP server closed.');
    
    // Disconnect Prisma
    try {
      await prisma.$disconnect();
      console.log('✓ Database connection closed.');
      process.exit(0);
    } catch (error) {
      console.error('Error closing database connection:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;

