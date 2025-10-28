# Mindrops Event Management System - Project Summary

## Overview

This project consists of **two frontend applications** (Admin Panel and Student Panel) that share a **single backend API** and database for event management.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Backend API                           │
│          (Node.js/Express + MySQL Database)              │
│                                                          │
│  • Authentication (JWT-based)                            │
│  • Role-Based Access Control (RBAC)                      │
│  • RESTful API Endpoints                                 │
│  • Database: MySQL                                       │
└──────────────────────────────────────────────────────────┘
         ↓                              ↓
┌──────────────────┐          ┌──────────────────┐
│  Admin Panel     │          │  Student Panel   │
│  (This Repo)     │          │  (To Be Built)   │
│                  │          │                  │
│  Role: ADMIN     │          │  Role: STUDENT   │
│  • Manage all    │          │  • Submit events │
│  • Approve data  │          │  • View own data │
│  • Full CRUD     │          │  • Limited access│
└──────────────────┘          └──────────────────┘
```

---

## Current Project: Admin Panel

### Location
`/D:/mindrops-27-oct-frontend`

### Technology Stack
- **Framework**: React 18.3.1 with TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack React Query 5.83.0
- **Routing**: React Router DOM 6.30.1
- **Forms**: React Hook Form 7.61.1
- **Icons**: Lucide React

### Features
1. **Dashboard** - View statistics and overview
2. **Event Directory** - Manage upcoming events
3. **Event Packages** - View completed events
4. **Student Management** - Manage student profiles
5. **Providers** - Manage venues and service providers
6. **News** - Manage news articles
7. **Field Management** - Manage event types and categories
8. **Profile & Settings** - User account management

### Key Files
- `src/App.tsx` - Main application entry
- `src/components/AdminSidebar.tsx` - Navigation sidebar
- `src/pages/` - All page components
- `src/lib/api.ts` - API client configuration
- `src/context/AuthContext.jsx` - Authentication context
- `src/hooks/useApiData.ts` - Data fetching hooks

### Authentication
- JWT-based authentication
- Token stored in localStorage as `auth_token`
- Role-based routes and access control
- Login/Register functionality
- Auto-logout on token expiry

### API Integration
- Base URL: `http://localhost:5000/api` (configurable via env)
- All endpoints require authentication (except login/register)
- Bearer token in Authorization header
- Comprehensive error handling

---

## Future Project: Student Panel

### Purpose
A frontend application for students to submit and manage their events, view event packages, browse venues and services.

### Requirements
**See**: `STUDENT_PANEL_REQUIREMENTS.md`

### Key Differences from Admin Panel

| Feature | Admin Panel | Student Panel |
|---------|-------------|---------------|
| **Dashboard** | All stats | Student's own stats |
| **Events** | Manage all events | Submit and manage own events |
| **Students** | View/manage all | Only own profile |
| **Event Packages** | Full CRUD | Read-only |
| **Providers** | Full CRUD | Read-only |
| **Approval** | Can approve | Cannot approve |

### Technology Stack
**Same as Admin Panel** - React, TypeScript, Vite, Tailwind, shadcn/ui, etc.

### Key Pages (Student Panel)
1. **Login/Register** - Authentication (STUDENT role)
2. **Dashboard** - Personal overview and activity
3. **My Events** - Submit, view, edit student's own events
4. **Event Packages** - Browse completed events (read-only)
5. **Profile** - Manage student profile
6. **Venues** - Browse available venues (read-only)
7. **Services** - Browse service providers (read-only)

### Development Resources
1. `STUDENT_PANEL_REQUIREMENTS.md` - Complete feature requirements
2. `STUDENT_PANEL_API_REFERENCE.md` - API endpoint documentation
3. `STUDENT_PANEL_QUICK_START.md` - Development setup guide

---

## Database Schema

**See**: `DATABASE_SCHEMA_FOR_BACKEND_DEVELOPER.md`

### Key Tables

1. **users** - User accounts (ADMIN, STUDENT, ORGANIZER roles)
2. **students** - Student profiles with portfolio info
3. **directory_entries** - Events submitted by students
4. **event_packages** - Completed/approved events with metrics
5. **venues** - Event venues
6. **providers** - Service providers (Logistics, Catering, Security, DJ, etc.)
7. **event_types** - Event categories

### Important Notes
- Field names are **exact** (e.g., `typeOfEvent`, not `type_of_event`)
- JSON fields store arrays (e.g., `["Item1", "Item2"]`)
- Role-based filtering throughout

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### Events
- `GET /api/directory-entries` - Get events
- `POST /api/directory-entries` - Create event
- `PUT /api/directory-entries/:id` - Update event
- `DELETE /api/directory-entries/:id` - Delete event

### Students
- `GET /api/students` - Get students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Others
- `GET /api/event-packages` - Get completed events
- `GET /api/venues` - Get venues
- `GET /api/providers` - Get service providers

**See**: `STUDENT_PANEL_API_REFERENCE.md` for complete API documentation

---

## Development Guidelines

### For Backend Developer
1. Implement role-based access control (RBAC)
2. Filter student events by `organizerName` or `userId`
3. Add status field to events (Pending, Approved, Rejected, Completed)
4. Use exact field names from `DATABASE_SCHEMA_FOR_BACKEND_DEVELOPER.md`
5. Store JSON arrays in MySQL as JSON type
6. Implement ownership checks (students can only edit own events)

### For Student Panel Developer
1. Use same tech stack as Admin Panel
2. Follow `STUDENT_PANEL_REQUIREMENTS.md` for features
3. Reference `STUDENT_PANEL_QUICK_START.md` for setup
4. Reuse UI components from Admin Panel (shadcn/ui)
5. Implement role-based UI (only show student features)
6. Use same authentication pattern as Admin Panel

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture
- Error boundaries for error handling
- Loading states for all async operations
- Toast notifications for user feedback

---

## File Structure

### Admin Panel (Current)
```
mindrops-27-oct-frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AdminSidebar.tsx
│   │   ├── AuthForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Directory.tsx
│   │   ├── EventPackages.tsx
│   │   ├── StudentManagement.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useApiData.ts
│   │   └── useAuthApi.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── context/
│   │   └── AuthContext.jsx
│   └── App.tsx
├── DATABASE_SCHEMA_FOR_BACKEND_DEVELOPER.md
├── STUDENT_PANEL_REQUIREMENTS.md
├── STUDENT_PANEL_API_REFERENCE.md
├── STUDENT_PANEL_QUICK_START.md
└── package.json
```

### Student Panel (Future)
```
student-panel/
├── src/
│   ├── components/
│   │   ├── ui/              # Copy from admin panel
│   │   ├── StudentSidebar.tsx
│   │   ├── EventForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MyEvents.tsx
│   │   ├── EventPackages.tsx
│   │   ├── Profile.tsx
│   │   ├── Venues.tsx
│   │   └── Services.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApiData.ts
│   ├── lib/
│   │   └── api.ts
│   └── context/
│       └── AuthContext.tsx
└── package.json
```

---

## Key Concepts

### 1. Role-Based Access Control (RBAC)
- Users have roles: `ADMIN`, `STUDENT`, `ORGANIZER`
- Different UI and features based on role
- Backend enforces permissions

### 2. Data Ownership
- Students can only access their own events
- Admin can access all data
- Backend filters data based on role and ownership

### 3. Event Status
- **Pending**: Awaiting admin approval
- **Approved**: Admin approved the event
- **Rejected**: Admin rejected the event
- **Completed**: Event finished, moved to packages

### 4. Frontend Separation
- Admin Panel and Student Panel are separate frontend apps
- Both use the same backend API
- Different UIs for different user types

---

## Deployment

### Admin Panel
- **Build**: `npm run build`
- **Output**: `dist/` folder
- **Deploy**: Static hosting (Vercel, Netlify, etc.)

### Student Panel (Future)
- **Build**: `npm run build`
- **Output**: `dist/` folder
- **Deploy**: Static hosting (separate URL)

### Backend API
- Node.js/Express server
- MySQL database
- Deploy to cloud (AWS, Heroku, etc.)

### Environment Variables

**Frontend (.env.local)**:
```
VITE_API_URL=http://localhost:5000
```

**Frontend (Production)**:
```
VITE_API_URL=https://api.yourdomain.com
```

**Backend**:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mindrops_events
JWT_SECRET=your-secret-key
```

---

## Testing

### Admin Panel Tests
- [ ] Login with admin credentials
- [ ] Create, edit, delete events
- [ ] Manage students
- [ ] View statistics
- [ ] All CRUD operations

### Student Panel Tests (Future)
- [ ] Login with student credentials
- [ ] Submit new event
- [ ] Edit own events
- [ ] Delete own events
- [ ] View event packages
- [ ] Browse venues and services
- [ ] Update profile

### Backend Tests
- [ ] Authentication and authorization
- [ ] Role-based access
- [ ] Data filtering by ownership
- [ ] All endpoints

---

## Troubleshooting

### Common Issues

**Frontend: "Cannot connect to API"**
- Check `VITE_API_URL` in `.env.local`
- Ensure backend server is running
- Check CORS configuration in backend

**Frontend: "Unauthorized"**
- Check `auth_token` in localStorage
- Verify token is not expired
- Re-login if token expired

**Backend: "Access denied for role"**
- Check user role in database
- Verify RBAC middleware is working
- Check route permissions

**Database: "Field not found"**
- Verify field names match exactly (case-sensitive)
- Check `DATABASE_SCHEMA_FOR_BACKEND_DEVELOPER.md`
- Ensure database schema is up-to-date

---

## Next Steps

### Immediate
1. ✅ Analyze Admin Panel code
2. ✅ Create Student Panel requirements
3. ✅ Create API reference documentation
4. ✅ Create Quick Start guide

### Future Development
1. Build Student Panel frontend
2. Set up separate hosting for Student Panel
3. Test integration between both panels
4. Deploy to production

---

## Support & Documentation

### Documentation Files
1. **DATABASE_SCHEMA_FOR_BACKEND_DEVELOPER.md** - Database structure
2. **STUDENT_PANEL_REQUIREMENTS.md** - Complete feature requirements
3. **STUDENT_PANEL_API_REFERENCE.md** - API endpoints
4. **STUDENT_PANEL_QUICK_START.md** - Development setup
5. **PROJECT_SUMMARY.md** - This file
6. **QUICK_REFERENCE.md** - Quick commands and tips
7. **README.md** - Project overview

### Key Contacts
- For backend integration: See `DATABASE_SCHEMA_FOR_BACKEND_DEVELOPER.md`
- For frontend development: See `STUDENT_PANEL_REQUIREMENTS.md`
- For API testing: See `STUDENT_PANEL_API_REFERENCE.md`

---

## Conclusion

This project is designed as a **dual-frontend system** where both Admin Panel and Student Panel are separate React applications that share a common backend API and database. The key distinction is **user role** and **feature set**, not the underlying infrastructure.

**Key Takeaway**: Both panels are frontend applications. The Admin Panel manages and approves data, while the Student Panel submits and views data. Both work together to create a complete event management ecosystem.

