# Quick Setup Guide for Backend Developer

## Overview
This guide provides step-by-step instructions for implementing the Mindrops API backend that will integrate with the existing React frontend.

## Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Git

## 1. Database Setup

### Step 1: Create Database
```sql
CREATE DATABASE mindrops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Import Schema
```bash
mysql -u your_username -p mindrops_db < database_schema.sql
```

### Step 3: Verify Tables
```sql
USE mindrops_db;
SHOW TABLES;
```

## 2. Backend Implementation

### Technology Stack
- **Framework**: Express.js or Next.js API routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Joi or similar

### Step 1: Initialize Project
```bash
mkdir mindrops-backend
cd mindrops-backend
npm init -y
```

### Step 2: Install Dependencies
```bash
npm install express mysql2 prisma @prisma/client bcryptjs jsonwebtoken cors helmet morgan
npm install -D nodemon @types/node typescript
```

### Step 3: Setup Prisma
```bash
npx prisma init
```

### Step 4: Configure Environment
Create `.env` file:
```env
DATABASE_URL="mysql://root:1234@localhost:3306/event-db-27oct"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
NODE_ENV=development
```

### Step 5: Generate Prisma Client
```bash
npx prisma generate
npx prisma db push
```

## 3. API Implementation Priority

### Phase 1: Core Authentication (Day 1)
1. User registration endpoint
2. User login endpoint  
3. JWT token verification
4. Password hashing with bcrypt

### Phase 2: Basic CRUD Operations (Day 2-3)
1. Events management
2. Event types management
3. Venues management
4. Basic error handling

### Phase 3: Extended Features (Day 4-5)
1. Vendors management
2. Students management
3. Content management (pages, media, news)
4. Pagination and search

### Phase 4: Complex Features (Day 6-7)
1. Provider management (multi-category system)
2. Services management
3. Fields management
4. Event packages
5. Directory management

## 4. Key Implementation Notes

### Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### Error Handling
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};
```

### Pagination Helper
```javascript
const paginate = (page, limit) => {
  const offset = (page - 1) * limit;
  return { offset, limit: parseInt(limit) };
};
```

## 5. Testing

### Using Postman
1. Import `API_TEST_COLLECTION.json` into Postman
2. Set base URL to `http://localhost:3000/api`
3. Run authentication tests first
4. Test all endpoints systematically

### Manual Testing Checklist
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Protected routes require authentication
- [ ] CRUD operations work for all entities
- [ ] Pagination works correctly
- [ ] Search and filtering work
- [ ] Error handling is proper
- [ ] JSON fields are handled correctly

## 6. Frontend Integration

### Update API Base URL
In the frontend, update `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3000/api'; // Your backend URL
```

### Test Frontend Integration
1. Start backend server
2. Start frontend development server
3. Test login/registration
4. Test data creation/editing
5. Verify all forms work with API

## 7. Production Deployment

### Environment Variables
```env
DATABASE_URL="mysql://prod_user:prod_password@prod_host:3306/mindrops_prod"
JWT_SECRET="production-secret-key"
PORT=3000
NODE_ENV=production
```

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure JWT secret
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Set up database backups

## 8. Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Configure CORS middleware
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
```

### Issue: Database Connection
**Solution**: Check DATABASE_URL format and credentials

### Issue: JWT Token Errors
**Solution**: Ensure JWT_SECRET is set and consistent

### Issue: JSON Field Handling
**Solution**: Use JSON.stringify() for storage, JSON.parse() for retrieval

## 9. Performance Optimization

### Database Indexes
- Add indexes on frequently queried fields
- Use composite indexes for common filter combinations

### Caching
- Consider Redis for session storage
- Cache frequently accessed data

### Query Optimization
- Use proper JOIN strategies
- Implement pagination efficiently
- Use database query optimization

## 10. Monitoring & Logging

### Logging
```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Error Tracking
Consider integrating Sentry or similar service for production error tracking.

## 11. Documentation

### API Documentation
- Use Swagger/OpenAPI for API documentation
- Document all endpoints with examples
- Include authentication requirements

### Code Documentation
- Comment complex business logic
- Document database relationships
- Maintain README with setup instructions

## 12. Contact & Support

For questions about the frontend implementation:
- Check existing frontend code in `src/lib/api.ts`
- Review component implementations in `src/pages/`
- Refer to the detailed specification in `BACKEND_DEVELOPER_SPEC.md`

## Success Criteria

The implementation is complete when:
1. All API endpoints return correct data
2. Frontend can successfully create, read, update, delete data
3. Authentication works properly
4. All forms in the frontend work with the API
5. Pagination and search work correctly
6. Error handling is comprehensive
7. Performance is acceptable
8. Code is production-ready

## Timeline Estimate

- **Setup & Authentication**: 1 day
- **Core CRUD Operations**: 2-3 days  
- **Extended Features**: 2-3 days
- **Testing & Integration**: 1-2 days
- **Total**: 6-9 days

This should provide a complete, working backend that integrates seamlessly with the existing frontend application.
