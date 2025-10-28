# Contributing to Event Management System

Thank you for your interest in contributing to the Event Management System! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Testing](#testing)

## 🤝 Code of Conduct

- Be respectful and considerate of others
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/event-management-28oct.git
   cd event-management-28oct
   ```
3. **Add the upstream repository** as a remote:
   ```bash
   git remote add upstream https://github.com/suraj-k-mindrops/event-management-28oct.git
   ```
4. **Install dependencies** for all three parts:
   ```bash
   # Backend
   cd backend && npm install && cd ..
   
   # Admin Panel
   cd admin && npm install && cd ..
   
   # Student Panel
   cd student && npm install && cd ..
   ```

## 💻 Development Setup

### Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- Git

### Environment Setup

1. **Backend Environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   npm run prisma:migrate
   ```

2. **Frontend Environments**
   ```bash
   # Admin Panel
   cd admin
   echo "VITE_API_URL=http://localhost:5000" > .env
   
   # Student Panel
   cd student
   echo "VITE_API_URL=http://localhost:5000" > .env
   ```

### Starting Development Servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Admin Panel
cd admin && npm run dev

# Terminal 3 - Student Panel
cd student && npm run dev
```

## 🔨 Making Changes

### Creating a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-description
```

Use descriptive branch names:
- `feature/add-payment-gateway`
- `fix/login-validation-error`
- `docs/update-api-documentation`

### Making Your Changes

1. **Write clear, concise code**
2. **Add comments** for complex logic
3. **Update documentation** if necessary
4. **Follow the existing code style**

### Code Organization

```
backend/
  ├── routes/          # Add new route files here
  ├── middleware/      # Add middleware here
  ├── utils/           # Add utility functions here
  └── prisma/          # Database schema changes here

admin/src/
  ├── pages/           # Add new pages here
  ├── components/      # Add reusable components here
  └── lib/             # Add utilities here

student/src/
  ├── pages/           # Add new pages here
  ├── components/      # Add reusable components here
  └── lib/             # Add utilities here
```

## 📝 Code Style

### TypeScript/JavaScript

- Use **TypeScript** for new files
- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Use **camelCase** for variables and functions
- Use **PascalCase** for components and classes
- Always add **semicolons**
- Use **const/let**, avoid **var**

Example:
```typescript
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};
```

### CSS/Tailwind

- Use **Tailwind CSS** utility classes
- Add custom styles in component files
- Use **kebab-case** for class names
- Avoid inline styles

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(auth): add JWT refresh token functionality

fix(dashboard): correct statistics calculation

docs(readme): update installation instructions

style(events): improve event card layout
```

## 🧪 Testing

### Before Submitting

1. **Test your changes thoroughly**
2. **Check for linting errors**
   ```bash
   npm run lint
   ```
3. **Build the project** to ensure no errors
   ```bash
   npm run build
   ```
4. **Test the application** manually

### Testing Guidelines

- Test all CRUD operations
- Test authentication and authorization
- Test responsive design
- Test error handling
- Test edge cases

## 📤 Submitting Changes

### Before Submitting a Pull Request

1. **Update your branch** from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run linting and tests**:
   ```bash
   npm run lint
   npm run build
   ```

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Creating a Pull Request

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   - Description of changes
   - Related issues
   - Screenshots (if UI changes)
   - Testing notes

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write clear, descriptive titles
- Include detailed descriptions
- Add screenshots for UI changes
- Reference related issues
- Ensure all checks pass

### Review Process

1. Code review by maintainers
2. Address review comments
3. Make necessary changes
4. Re-request review when ready

## 📚 Documentation

### Updating Documentation

If you add new features, update the relevant documentation:

- `README.md` - Main project documentation
- `backend/README.md` - Backend API docs
- `admin/README.md` - Admin panel docs
- `student/README.md` - Student panel docs
- Code comments for complex logic

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up-to-date

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description** of the bug
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** (if applicable)
6. **Environment** (OS, browser, Node version)
7. **Error messages** or logs

## 💡 Feature Requests

When requesting features:

1. **Clear description** of the feature
2. **Use case** and motivation
3. **Possible implementation** approach
4. **Benefits** to the project

## ❓ Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Open a new issue with the `question` label
4. Reach out to maintainers

## 🙏 Thank You

Thank you for contributing to the Event Management System! Your efforts help make this project better for everyone.

