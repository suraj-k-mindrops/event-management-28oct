# Frontend Forms for Mindrops Backend

This directory contains React form components for submitting data to the Mindrops backend API.

## 📁 Files Overview

### Provider Forms
1. **LogisticsProviderForm.tsx** - Form for Logistics Service Providers
2. **CateringProviderForm.tsx** - Form for Catering Service Providers
3. **SecurityProviderForm.tsx** - Form for Security Agencies
4. **GiftsProviderForm.tsx** - Form for Gift Shops
5. **DJProviderForm.tsx** - Form for DJ Services
6. **PhotographersProviderForm.tsx** - Form for Photographers

### General Forms
7. **EventTypesForm.tsx** - Form for Event Types
8. **VenuesForm.tsx** - Form for Venues

### Helper Files
- **apiHelpers.ts** - API integration functions
- **UsageExample.tsx** - Complete usage example
- **README.md** - This file

## 🚀 Quick Start

### 1. Copy Files to Your Frontend Project

Copy all the form files to your React frontend project:

```bash
cp frontend-forms/*.tsx /path/to/your/frontend/src/components/forms/
cp frontend-forms/apiHelpers.ts /path/to/your/frontend/src/services/
```

### 2. Install Dependencies (if needed)

Make sure you have React and TypeScript installed in your project:

```bash
npm install react react-dom typescript
```

### 3. Set Environment Variables

Create a `.env` file in your frontend project:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 4. Use in Your Application

See `UsageExample.tsx` for a complete example, or follow this pattern:

```tsx
import React from 'react';
import LogisticsProviderForm from './components/forms/LogisticsProviderForm';
import { submitProviderForm } from './services/apiHelpers';

function MyComponent() {
  const handleSubmit = async (data: any) => {
    try {
      const response = await submitProviderForm(data);
      console.log('Success:', response);
      alert('Provider added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add provider');
    }
  };

  return (
    <LogisticsProviderForm 
      onSubmit={handleSubmit} 
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

## 📋 Form Features

### Common Features
- ✅ Form validation
- ✅ Error handling
- ✅ Required field indicators (*)
- ✅ Responsive design (mobile-friendly)
- ✅ Tailwind CSS styling
- ✅ TypeScript support

### Provider-Specific Fields

Each provider category includes fields relevant to that type:

#### Logistics Provider
- Logistics ID
- Service Type
- Vehicle Types Available
- Equipment Types
- Capacity Handling
- Available Locations

#### Catering Provider
- Cuisine Types
- Menu Categories
- Serving Capacity
- Equipment Available
- Staff Count
- Halal Certified (checkbox)
- Vegetarian Options (checkbox)

#### Security Agency
- Security License
- Security Services
- Staff Qualifications
- Equipment Provided
- Response Time
- Patrol Areas

#### Gift Shop
- Gift Categories
- Price Range
- Customization Available (checkbox)
- Delivery Available (checkbox)
- Bulk Discounts (checkbox)

#### DJ Service
- Equipment Owned
- Music Genres
- Years of Experience
- Event Types Handled
- Sound System Power
- Lighting Available (checkbox)

#### Photographers
- Photography Style
- Equipment Used
- Years of Experience
- Event Types Handled
- Portfolio Link
- Editing Services (checkbox)
- Drone Photography (checkbox)

### Event Types Form
- Name (required)
- Color (with color picker)
- Category
- Description
- Sub-Events (array with add/remove)
- Active status (checkbox)

### Venues Form
- Name (required)
- Location (required)
- Capacity (required, number)
- Description
- Status (dropdown: Active, Maintenance, Inactive)
- Amenities (array with add/remove)

## 🔧 API Integration

The forms connect to these backend endpoints:

- **Providers**: `POST /api/providers`
- **Event Types**: `POST /api/event-types`
- **Venues**: `POST /api/venues`

### Authentication

All API calls require JWT authentication. The `apiHelpers.ts` file automatically handles:
- Adding the Authorization header
- Storing tokens in localStorage
- Handling authentication errors

### Example API Response

```json
{
  "data": {
    "id": 1,
    "name": "ABC Logistics",
    "email": "contact@abclogistics.com",
    ...
  },
  "message": "Provider created successfully"
}
```

## 🎨 Styling

The forms use Tailwind CSS classes. Make sure Tailwind CSS is set up in your project:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📝 Required Fields

All forms require these base fields for providers:
- **name** (string) - Provider name
- **contact** (string) - Contact number
- **email** (string) - Email address
- **category** (enum) - LOGISTICS, CATERING, SECURITY, GIFTS, DJ, PHOTOGRAPHERS

All other fields are optional.

## 🔍 Backend Schema Reference

The forms match the Prisma schema fields in `prisma/schema.prisma`:

```prisma
model providers {
  id                      Int                @id @default(autoincrement())
  name                    String             @db.VarChar(255)
  contact                 String             @db.VarChar(50)
  email                   String             @db.VarChar(255)
  category                providers_category
  
  // Plus category-specific fields...
}

enum providers_category {
  LOGISTICS
  CATERING
  SECURITY
  GIFTS
  DJ
  PHOTOGRAPHERS
}
```

## 🚨 Error Handling

Forms handle errors in two ways:

1. **Client-side validation** - Shows inline errors for required fields
2. **Server-side errors** - Displays error messages from API responses

Example error handling:

```tsx
const handleSubmit = async (data: any) => {
  try {
    const response = await submitProviderForm(data);
    // Success handling
  } catch (error) {
    // Error handling
    console.error('Error:', error);
  }
};
```

## 🧪 Testing

To test the forms:

1. Make sure your backend is running on `http://localhost:5000`
2. Authenticate to get a JWT token
3. Use the forms to submit test data
4. Check the database to verify data was saved

## 📦 Integration Steps

1. Copy form files to your frontend project
2. Import forms where needed
3. Handle form submission with API calls
4. Add loading states and success/error messages
5. Test with your backend

## ⚡ Advanced Usage

### Custom Validation
Add custom validation in the `validateForm` function:

```tsx
const validateForm = (): boolean => {
  // Add custom validation logic
  if (formData.contact.length < 10) {
    setErrors({ contact: 'Contact number must be at least 10 digits' });
    return false;
  }
  return true;
};
```

### Pre-fill Form Data
Pass initial data to pre-fill forms:

```tsx
const [formData, setFormData] = useState({
  name: existingProvider?.name || '',
  email: existingProvider?.email || '',
  // ...
});
```

## 🐛 Troubleshooting

### Issue: Forms don't submit
- Check if authentication token is valid
- Verify API endpoint URL
- Check browser console for errors

### Issue: Validation errors
- Ensure required fields are filled
- Check data format (email, URLs, etc.)

### Issue: CORS errors
- Verify CORS is configured in backend
- Check `FRONTEND_URL` in backend `.env`

## 📞 Support

For backend API documentation, see:
- `BACKEND_API_SPECIFICATION.md`
- `POSTMAN_TESTING_GUIDE.md`

## 📄 License

Part of the Mindrops Event Management System.

