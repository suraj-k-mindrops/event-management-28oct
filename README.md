# Event Management System

A comprehensive event management platform with separate admin and student interfaces, powered by a robust backend API.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Express](https://img.shields.io/badge/Express-4.18-000000)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Quick Start Guide](#quick-start-guide)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

This is a full-stack event management system designed to help organizations manage events, student submissions, venues, vendors, and service providers. The system consists of three main components:

1. **Backend API** - RESTful API built with Node.js, Express, and MySQL
2. **Admin Panel** - Management interface for administrators
3. **Student Panel** - Student-facing interface for event submissions and portfolio building

The platform supports role-based access control (RBAC) with three user roles: `ADMIN`, `STUDENT`, and `ORGANIZER`.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Backend API                               │
│                  (Node.js + Express + MySQL)                      │
│  • JWT Authentication                                            │
│  • Role-Based Access Control (RBAC)                              │
│  • RESTful API Endpoints                                         │
│  • Prisma ORM                                                    │
└──────────────────────────────────────────────────────────────────┘
                        ↙                    ↘
            ┌──────────────────┐      ┌──────────────────┐
            │   Admin Panel    │      │  Student Panel   │
            │   (React/TS)     │      │   (React/TS)     │
            │                  │      │                  │
            │  • Full CRUD     │      │  • Submit events │
            │  • Approve data  │      │  • View portfolio│
            │  • Dashboard     │      │  • Browse venues │
            │  • User mgmt     │      │  • Edit profile  │
            └──────────────────┘      └──────────────────┘
```

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, STUDENT, ORGANIZER)
- Protected routes and API endpoints
- Token refresh mechanism
- Secure password hashing with bcrypt

### 📊 Admin Panel
- **Dashboard** - Comprehensive statistics and overview
- **Event Directory** - Manage all events
- **Event Packages** - View completed and approved events
- **Student Management** - Manage student profiles and portfolios
- **Venues Management** - CRUD operations for venues
- **Providers Management** - Manage service providers (Catering, Logistics, Security, DJ, Photographers, etc.)
- **Vendors Management** - Manage vendor information
- **News Management** - Create and manage news articles
- **Event Types** - Configure event categories
- **Field Management** - Manage event fields and sports facilities
- **Content Management** - Manage static pages
- **Profile & Settings** - User account management

### 🎓 Student Panel
- **Authentication** - Secure login/register with beautiful UI
- **Dashboard** - Personal overview and statistics
- **My Events** - Submit, edit, and delete personal events
- **Portfolio Builder** - Showcase approved events
- **PDF Export** - Download portfolio as professional resume
- **Event Packages** - Browse approved events (read-only)
- **Profile Management** - Update personal information and portfolio link
- **Responsive Design** - Mobile-optimized interface

### 🗄️ Backend Features
- **RESTful API** - Clean, organized API endpoints
- **Database Management** - Prisma ORM with MySQL
- **Authentication Middleware** - Secure route protection
- **Data Validation** - Input validation and sanitization
- **Error Handling** - Comprehensive error management
- **Postman Collection** - Complete API documentation for testing

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **ORM**: Prisma 5.7
- **Database**: MySQL 8.0
- **Authentication**: JWT + bcrypt
- **Validation**: Built-in validation middleware

### Frontend (Admin & Student)
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 5.4
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4
- **State Management**: TanStack React Query
- **Routing**: React Router DOM 6.30
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PDF Export**: jsPDF (Student Panel)

## 📁 Project Structure

```
event-management/
├── backend/              # Backend API
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API route handlers
│   ├── utils/           # Utility functions
│   ├── prisma/          # Prisma schema and migrations
│   └── server.js        # Main server file
│
├── admin/               # Admin Panel (Frontend)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # API client and utilities
│   │   └── context/     # Auth context
│   └── package.json
│
└── student/             # Student Panel (Frontend)
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── hooks/       # Custom hooks
    │   ├── lib/         # API client and utilities
    │   └── contexts/    # Auth context
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MySQL** 8.0 or higher
- **npm** or **yarn** package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suraj-k-mindrops/event-management-28oct.git
   cd event-management-28oct
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Admin Panel Dependencies**
   ```bash
   cd ../admin
   npm install
   ```

4. **Install Student Panel Dependencies**
   ```bash
   cd ../student
   npm install
   ```

### Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/event_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

#### Frontend Environment Variables
Create a `.env` file in both `admin` and `student` directories:

```env
VITE_API_URL=http://localhost:5000
```

### Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE event_db;
   ```

2. **Generate Prisma Client**
   ```bash
   cd backend
   npm run prisma:generate
   ```

3. **Run Database Migrations**
   ```bash
   npm run prisma:migrate
   ```

4. **Optional: Open Prisma Studio**
   ```bash
   npm run prisma:studio
   ```

## 🏃 Quick Start Guide

### Starting the Development Servers

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run at `http://localhost:5000`

2. **Start Admin Panel** (in a new terminal)
   ```bash
   cd admin
   npm run dev
   ```
   Admin Panel will run at `http://localhost:5173`

3. **Start Student Panel** (in a new terminal)
   ```bash
   cd student
   npm run dev
   ```
   Student Panel will run at `http://localhost:8080`

### Creating Your First Admin User

1. Open Prisma Studio:
   ```bash
   cd backend
   npm run prisma:studio
   ```

2. Navigate to the `users` table
3. Create a new user with:
   - `role`: `ADMIN`
   - `email`: your email
   - `password`: (will be hashed automatically)
   - `name`: your name

4. Or use the registration endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "admin123",
       "name": "Admin User",
       "role": "ADMIN"
     }'
   ```

## 📖 Usage

### Admin Panel

1. Navigate to `http://localhost:5173`
2. Login with admin credentials
3. Access the dashboard to view statistics
4. Use the sidebar to navigate to different sections:
   - **Dashboard** - Overview and statistics
   - **Event Directory** - Manage all events
   - **Event Packages** - View completed events
   - **Student Management** - Manage students
   - **Venues** - Manage venues
   - **Providers** - Manage service providers
   - **Vendors** - Manage vendors
   - **News** - Manage news articles
   - **Event Types** - Configure event categories
   - **Fields** - Manage event fields
   - **Profile** - Update profile

### Student Panel

1. Navigate to `http://localhost:8080`
2. Register a new student account
3. After approval, login with credentials
4. Features available:
   - **Dashboard** - Personal event overview
   - **My Events** - Submit and manage your events
   - **Portfolio** - View and download portfolio as PDF
   - **Event Packages** - Browse approved events
   - **Profile** - Update your information

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/verify` | Verify token |
| POST | `/api/auth/refresh` | Refresh token |

### Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

### Directory Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/directory-entries` | Get directory entries |
| POST | `/api/directory-entries` | Create directory entry |
| PUT | `/api/directory-entries/:id` | Update directory entry |
| DELETE | `/api/directory-entries/:id` | Delete directory entry |

### Other Endpoints

- `/api/students` - Student management
- `/api/venues` - Venue management
- `/api/providers` - Provider management
- `/api/vendors` - Vendor management
- `/api/event-types` - Event type management
- `/api/news-items` - News management
- `/api/event-packages` - Event packages
- `/api/fields` - Field management
- `/api/services` - Service management
- `/api/content-pages` - Content management
- `/api/media-items` - Media management

### Authentication Headers

All protected routes require a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

### Postman Collection

A complete Postman collection is available at:
```
backend/Mindrops_API_Collection.postman_collection.json
```

Import this collection into Postman to test all API endpoints.

## 💻 Development

### Backend Development

```bash
cd backend

# Run in development mode
npm run dev

# Run database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Open Prisma Studio
npm run prisma:studio

# Start production server
npm start
```

### Frontend Development

```bash
# Admin Panel
cd admin
npm run dev
npm run build
npm run preview

# Student Panel
cd student
npm run dev
npm run build
npm run preview
```

### Database Schema

The complete database schema is defined in `backend/prisma/schema.prisma` and includes:

- `users` - User accounts with roles
- `students` - Student profiles
- `events` - Event management
- `directory_entries` - Event directory
- `event_packages` - Completed events
- `venues` - Venue information
- `providers` - Service providers
- `vendors` - Vendor information
- `event_types` - Event categories
- `fields` - Field management
- `news_items` - News articles
- `content_pages` - Static content
- `media_items` - Media files
- `services` - Service catalog

### API Testing

Use the provided Postman collection or test with curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get events (with token)
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎨 Customization

### Styling

Both frontend applications use Tailwind CSS. Customize themes in:
- `admin/tailwind.config.ts`
- `student/tailwind.config.ts`

### Adding New Features

1. **Backend**: Add new routes in `backend/routes/`
2. **Frontend**: Add new pages in `src/pages/`
3. **Database**: Update schema in `backend/prisma/schema.prisma`

### Environment Variables

Adjust API URLs, database connections, and secrets in respective `.env` files.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify MySQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

**Port Already in Use**
- Change ports in `.env` files
- Kill processes using those ports

**CORS Errors**
- Verify FRONTEND_URL in backend `.env`
- Check allowed origins in server configuration

**Authentication Issues**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure token is sent in Authorization header

### Getting Help

1. Check the documentation in each folder:
   - `admin/PROJECT_SUMMARY.md`
   - `admin/QUICK_SETUP_GUIDE.md`
   - `student/STUDENT_PANEL_README.md`
   - `backend/README.md`

2. Review the Prisma schema for database structure

3. Check the Postman collection for API examples

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

## 📄 License

This project is licensed under the ISC License.

---

