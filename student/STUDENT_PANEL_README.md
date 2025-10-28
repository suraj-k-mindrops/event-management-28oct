# StudentHub - Student Panel

A modern, beautiful student panel for managing events, building portfolios, and showcasing achievements.

## 🌟 Features

### 🔐 Authentication
- **Login/Register** - Secure authentication with JWT tokens
- Split-screen design with beautiful hero image
- Input validation and error handling
- Automatic redirect for logged-in users

### 📊 Dashboard
- Overview of all events (total, pending, approved)
- Recent events list
- Quick actions to create events or view portfolio
- Beautiful gradient hero section

### 📅 Event Management
- **Create Events** - Add new event submissions with detailed information
- **Edit Events** - Update your event details
- **Delete Events** - Remove events you no longer need
- **Search** - Quickly find events by name or type
- Grid/Card view with status badges
- Support for media (photos/videos)

### ✨ Portfolio Builder
- Showcase all your approved events
- Beautiful card-based layout with images
- Statistics: total events, approved events, success rate
- **PDF Download** - Export your portfolio as a professional resume
- Responsive design optimized for all devices

### 👤 Profile Management
- View and edit personal information
- Add portfolio website link
- Update contact details (phone, address, organization)
- Clean, organized profile view

### 📦 Event Packages
- Browse all approved and completed events
- View success metrics and ratings
- See feedback and attendance numbers
- Filter and search functionality

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Backend API running at `http://localhost:5000/api` (or configure custom URL)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
Create a `.env` file in the root directory:
```bash
VITE_API_URL=http://localhost:5000/api
```

3. **Start Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production
```bash
npm run build
```

## 🎨 Design System

The app uses a modern, vibrant design system:

- **Primary Color**: Purple gradient (inspiring, modern)
- **Secondary Color**: Blue (trust, professionalism)
- **Accent Color**: Orange/Amber (energy, action)
- **Success Color**: Green (achievements)

### Key Design Elements
- Gradient backgrounds and buttons
- Glass morphism effects
- Smooth animations and transitions
- Card-based layouts with elevation
- Responsive grid system
- Modern typography

## 📱 Pages

### `/auth` - Authentication
Login and registration with beautiful split-screen design

### `/dashboard` - Dashboard
Overview of your events and quick access to key features

### `/events` - My Events
Manage all your event submissions

### `/portfolio` - Portfolio
Showcase your work and download as PDF

### `/profile` - Profile
Manage your personal information

### `/packages` - Event Packages
Browse approved events from all students

## 🔗 API Integration

The app integrates with the existing backend API:

- **Base URL**: `${VITE_API_URL}/api`
- **Authentication**: JWT tokens stored in localStorage
- **Headers**: Bearer token authentication

### Key Endpoints Used
- `POST /auth/login` - Student login
- `POST /auth/register` - Student registration
- `GET /auth/verify` - Verify token
- `GET /students/:id` - Get student profile
- `PUT /students/:id` - Update student profile
- `GET /directory-entries` - Get student's events
- `POST /directory-entries` - Create event
- `PUT /directory-entries/:id` - Update event
- `DELETE /directory-entries/:id` - Delete event
- `GET /event-packages` - Get approved events

## 🛠️ Technology Stack

- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - State management
- **React Router** - Navigation
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **Sonner** - Toast notifications

## 🎯 Key Features

### Portfolio PDF Download
The portfolio page includes a professional PDF download feature that:
- Generates a beautifully formatted resume
- Includes all approved events
- Shows event details, dates, venues, and themes
- Professional layout with headers and footers
- Automatic page breaks for long content

### Responsive Design
- Mobile-first approach
- Adaptive navigation (hamburger menu on mobile)
- Touch-friendly interface
- Optimized for all screen sizes

### User Experience
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for actions
- Intuitive navigation
- Clean, modern interface

## 📝 Usage Tips

1. **Creating Events**
   - Click "Add Event" button on Events page
   - Fill in all required fields
   - Add media URLs for photos and videos
   - Click "Create Event" to submit

2. **Building Portfolio**
   - Navigate to Portfolio page
   - Your approved events will automatically appear
   - Click "Download PDF" to export as resume
   - Share the PDF with potential employers

3. **Updating Profile**
   - Go to Profile page
   - Click "Edit Profile"
   - Update your information
   - Click "Save Changes"

## 🔒 Security

- JWT-based authentication
- Protected routes
- Secure token storage
- Input validation
- API error handling

## 📄 License

This project is part of the StudentHub ecosystem.

## 🤝 Support

For issues or questions, please contact the development team.
