# Quick Setup Guide

This guide will help you set up the Event Management System quickly.

## ⚡ Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) 18 or higher
- [MySQL](https://www.mysql.com/) 8.0 or higher
- Git

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/suraj-k-mindrops/event-management-28oct.git
cd event-management-28oct
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/event_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

Replace:
- `YOUR_PASSWORD` with your MySQL root password
- `JWT_SECRET` with a secure random string

### 4. Set Up Database

```bash
# Create the database
mysql -u root -p
CREATE DATABASE event_db;
exit;

# Run migrations
npm run prisma:migrate
```

### 5. Install Admin Panel Dependencies

```bash
cd ../admin
npm install
```

### 6. Configure Admin Panel Environment

Create a `.env` file in the `admin` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 7. Install Student Panel Dependencies

```bash
cd ../student
npm install
```

### 8. Configure Student Panel Environment

Create a `.env` file in the `student` directory:

```env
VITE_API_URL=http://localhost:5000
```

## ▶️ Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will start at `http://localhost:5000`

### Start Admin Panel (Terminal 2)

```bash
cd admin
npm run dev
```

Admin panel will start at `http://localhost:5173`

### Start Student Panel (Terminal 3)

```bash
cd student
npm run dev
```

Student panel will start at `http://localhost:8080`

## 👤 Creating Admin User

### Option 1: Using Registration API

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

### Option 2: Using Prisma Studio

```bash
cd backend
npm run prisma:studio
```

Then:
1. Navigate to `users` table
2. Click "Add record"
3. Fill in:
   - name: "Admin User"
   - email: "admin@example.com"
   - password: (plain text, will be hashed automatically)
   - role: "ADMIN"
4. Click "Save 1 change"

### Option 3: Using MySQL Command Line

```bash
mysql -u root -p event_db
```

```sql
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES ('Admin User', 'admin@example.com', '$2a$10$YourHashedPassword', 'ADMIN', NOW(), NOW());
```

## 🔍 Verifying Installation

1. **Check Backend**: Visit `http://localhost:5000/api/auth/verify`
2. **Check Admin Panel**: Visit `http://localhost:5173`
3. **Check Student Panel**: Visit `http://localhost:8080`

## 🐛 Troubleshooting

### MySQL Connection Issues

```bash
# Check if MySQL is running
mysql -u root -p -e "SELECT 1"

# Check database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'event_db'"
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

### Prisma Client Not Generated

```bash
cd backend
npm run prisma:generate
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL:

```env
FRONTEND_URL="http://localhost:5173"  # Admin panel
```

## 📦 Building for Production

### Build Admin Panel

```bash
cd admin
npm run build
# Output in dist/ folder
```

### Build Student Panel

```bash
cd student
npm run build
# Output in dist/ folder
```

### Start Backend in Production

```bash
cd backend
NODE_ENV=production npm start
```

## 🎯 Next Steps

1. Read the main [README.md](README.md) for detailed documentation
2. Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
3. Review API documentation in `backend/README.md`
4. Explore the Postman collection at `backend/Mindrops_API_Collection.postman_collection.json`

---

**Happy Coding! 🚀**

