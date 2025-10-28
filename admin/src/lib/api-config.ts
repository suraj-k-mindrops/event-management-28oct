// API Configuration
export const API_CONFIG = {
  // Backend API URL
  BACKEND_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Next.js API routes URL
  NEXT_API_URL: '/api',
  
  // Default request timeout
  TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Auth token key in localStorage
  TOKEN_KEY: 'auth_token',
  
  // Refresh token key in localStorage
  REFRESH_TOKEN_KEY: 'refresh_token',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify',
      REFRESH: '/auth/refresh',
    },
    EVENTS: {
      BASE: '/events',
      TYPES: '/event-types',
    },
    VENUES: {
      BASE: '/venues',
    },
    VENDORS: {
      BASE: '/vendors',
    },
    STUDENTS: {
      BASE: '/students',
    },
    CONTENT: {
      PAGES: '/content-pages',
      MEDIA: '/media-items',
      NEWS: '/news-items',
    },
  },
} as const;

// Environment configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  API_URL: import.meta.env.VITE_API_URL,
} as const;
