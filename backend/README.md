# Mindrops Backend API

Backend API for Mindrops Event Management System built with Express.js, Prisma, and MySQL.

## Features

- 🔐 JWT-based authentication
- 📊 Complete CRUD operations for all modules
- 👥 Role-based access control (STUDENT, ADMIN, ORGANIZER)
- 🎯 Event management system
- 📍 Venue and field management
- 👨‍💼 Vendor and provider management
- 👨‍🎓 Student management
- 📄 Content management system
- 📰 News management
- 📦 Event packages
- 📁 Directory management
- 🖼️ Media management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Authentication**: JWT + bcrypt

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindrops-27-oct-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**
   ```env
   DATABASE_URL="mysql://root:1234@localhost:3306/event-db-27oct"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="24h"
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:8080"
   ```

5. **Create the database**
   ```sql
   CREATE DATABASE mindrops_db;
   ```

6. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

7. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/refresh` - Refresh token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Event Types
- `GET /api/event-types` - Get all event types
- `GET /api/event-types/:id` - Get single event type
- `POST /api/event-types` - Create event type
- `PUT /api/event-types/:id` - Update event type
- `DELETE /api/event-types/:id` - Delete event type

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get single vendor
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Fields
- `GET /api/fields` - Get all fields
- `GET /api/fields/:id` - Get single field
- `POST /api/fields` - Create field
- `PUT /api/fields/:id` - Update field
- `DELETE /api/fields/:id` - Delete field

### Providers
- `GET /api/providers` - Get all providers
- `GET /api/providers/:id` - Get single provider
- `POST /api/providers` - Create provider
- `PUT /api/providers/:id` - Update provider
- `DELETE /api/providers/:id` - Delete provider

### Content Pages
- `GET /api/content-pages` - Get all content pages
- `GET /api/content-pages/:id` - Get single content page
- `POST /api/content-pages` - Create content page
- `PUT /api/content-pages/:id` - Update content page
- `DELETE /api/content-pages/:id` - Delete content page

### Media Items
- `GET /api/media-items` - Get all media items
- `GET /api/media-items/:id` - Get single media item
- `POST /api/media-items` - Create media item
- `PUT /api/media-items/:id` - Update media item
- `DELETE /api/media-items/:id` - Delete media item

### News Items
- `GET /api/news-items` - Get all news items
- `GET /api/news-items/:id` - Get single news item
- `POST /api/news-items` - Create news item
- `PUT /api/news-items/:id` - Update news item
- `DELETE /api/news-items/:id` - Delete news item

### Event Packages
- `GET /api/event-packages` - Get all event packages
- `GET /api/event-packages/:id` - Get single event package
- `POST /api/event-packages` - Create event package
- `PUT /api/event-packages/:id` - Update event package
- `DELETE /api/event-packages/:id` - Delete event package

### Directory
- `GET /api/directory` - Get all directory entries
- `GET /api/directory/:id` - Get single directory entry
- `POST /api/directory` - Create directory entry
- `PUT /api/directory/:id` - Update directory entry
- `DELETE /api/directory/:id` - Delete directory entry

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

- **STUDENT**: Can create/edit their own events, view public data
- **ADMIN**: Full access to all endpoints
- **ORGANIZER**: Can manage events and related data

## Database Management

### Open Prisma Studio
```bash
npm run prisma:studio
```

This will open a GUI where you can view and manage your database.

### Reset Database
```bash
npx prisma migrate reset
```

### Create New Migration
```bash
npm run prisma:migrate
```

## Project Structure

```
mindrops-27-oct-backend/
├── config/
│   └── database.js          # Prisma client configuration
├── middleware/
│   └── auth.middleware.js   # Authentication middleware
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── events.routes.js     # Event routes
│   ├── venues.routes.js     # Venue routes
│   └── ...                  # Other route files
├── utils/
│   ├── bcrypt.util.js       # Password hashing utilities
│   └── jwt.util.js          # JWT utilities
├── prisma/
│   └── schema.prisma        # Database schema
├── server.js                # Main server file
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## Error Handling

The API returns errors in the following format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "status": 500
}
```

## Development

### Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode with nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

## Testing

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

## Production Deployment

1. Set `NODE_ENV=production` in your `.env` file
2. Use a process manager like PM2
3. Enable HTTPS
4. Set up proper database backups
5. Configure rate limiting
6. Set up logging and monitoring

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure MySQL is running
- Check that the database exists

### JWT Issues
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration settings

### CORS Issues
- Verify `FRONTEND_URL` in `.env` matches your frontend URL

## License

ISC

## Support

For issues and questions, please contact the development team.

