# React + Vite Integration Guide

## Your Setup
- **Frontend**: React + Vite running on `http://localhost:8080`
- **Backend**: Express.js running on `http://localhost:5000`
- **Framework**: Separate frontend project (not in backend repo)

## Step 1: Copy Forms to Your Frontend Project

```bash
# Navigate to your frontend project directory
cd /path/to/your/frontend/project

# Copy all form files
cp -r /path/to/mindrops-27-oct-backend/frontend-forms ./src/components/forms

# Or manually copy:
# - Copy all .tsx files to src/components/forms/
# - Copy apiHelpers.ts to src/services/
# - Copy UsageExample.tsx to src/pages/
```

## Step 2: Install Dependencies (if needed)

Your React + Vite project should already have these, but verify:

```bash
npm install axios  # For API calls (optional, or use native fetch)
```

**Note**: The forms use native `fetch()`, so no additional dependencies needed!

## Step 3: Setup Environment Variables

Add to your frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Step 4: Update apiHelpers.ts for Vite

Since you're using Vite, update the API base URL:

```typescript
// In apiHelpers.ts, change:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

Or just use the default if your env var is set.

## Step 5: Use Forms in Your Components

### Example 1: Create a New Page for Adding Providers

Create `src/pages/AddProvider.tsx`:

```tsx
import React from 'react';
import { LogisticsProviderForm } from '../components/forms';
import { submitProviderForm } from '../services/apiHelpers';

const AddProvider = () => {
  const handleSubmit = async (data: any) => {
    try {
      const response = await submitProviderForm(data);
      console.log('Success:', response);
      alert('Provider added successfully!');
      // Optionally redirect or refresh
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add provider');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Logistics Provider</h1>
      <LogisticsProviderForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProvider;
```

### Example 2: Create a Provider Management Page with Form Selection

Use the complete `UsageExample.tsx` that was included. Just import and use it:

```tsx
import React from 'react';
import FormsExample from '../components/forms/UsageExample';

const ProvidersPage = () => {
  return <FormsExample />;
};

export default ProvidersPage;
```

### Example 3: Add to Existing Router (React Router)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddProvider from './pages/AddProvider';
import ProvidersPage from './pages/ProvidersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/providers/add" element={<AddProvider />} />
        <Route path="/providers" element={<ProvidersPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Step 6: Handle Authentication

The forms need a JWT token. Make sure your frontend stores the token after login:

```tsx
// In your login component
const handleLogin = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    // Navigate to dashboard
  }
};
```

The `apiHelpers.ts` already reads from localStorage, so this is all you need!

## Step 7: Configure Tailwind CSS (Required for Styling)

The forms use Tailwind CSS. If your project doesn't have it:

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 8: Test the Integration

1. **Start Backend**:
   ```bash
   cd mindrops-27-oct-backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd your-frontend-project
   npm run dev
   ```

3. **Login** to get JWT token

4. **Navigate** to your form page (e.g., `http://localhost:8080/providers/add`)

5. **Fill and submit** the form

6. **Check database** to verify data was saved:
   ```bash
   npm run prisma:studio
   ```

## Complete File Structure Example

```
your-frontend-project/
├── src/
│   ├── components/
│   │   └── forms/
│   │       ├── LogisticsProviderForm.tsx
│   │       ├── CateringProviderForm.tsx
│   │       ├── SecurityProviderForm.tsx
│   │       ├── GiftsProviderForm.tsx
│   │       ├── DJProviderForm.tsx
│   │       ├── PhotographersProviderForm.tsx
│   │       ├── EventTypesForm.tsx
│   │       ├── VenuesForm.tsx
│   │       ├── UsageExample.tsx
│   │       └── index.ts
│   │   └── ...
│   ├── services/
│   │   └── apiHelpers.ts
│   ├── pages/
│   │   ├── AddProvider.tsx
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── ...
```

## Quick Integration Checklist

- [ ] Copy form files to `src/components/forms/`
- [ ] Copy `apiHelpers.ts` to `src/services/`
- [ ] Add `.env` variable `VITE_API_BASE_URL`
- [ ] Verify Tailwind CSS is installed and configured
- [ ] Create page components that use the forms
- [ ] Add routes to your router (if using React Router)
- [ ] Test with backend running

## Common Issues & Solutions

### Issue: "CORS Error"
**Solution**: Backend already configured for `http://localhost:8080` in your `.env`

### Issue: "401 Unauthorized"
**Solution**: Make sure user is logged in and token is stored in localStorage

### Issue: "Tailwind classes not working"
**Solution**: 
1. Run `npx tailwindcss init -p`
2. Update `tailwind.config.js` content array
3. Add Tailwind directives to your CSS file

### Issue: "Module not found"
**Solution**: Check import paths match your project structure

## Testing Endpoints

All forms submit to these endpoints (already working in your backend):

```bash
# Test provider creation
curl -X POST http://localhost:5000/api/providers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test","contact":"123","email":"test@test.com","category":"LOGISTICS"}'

# Test event type creation
curl -X POST http://localhost:5000/api/event-types \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Workshop","color":"#3B82F6"}'

# Test venue creation
curl -X POST http://localhost:5000/api/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Hall A","location":"Building 1","capacity":100}'
```

## Next Steps

1. Copy the forms to your frontend
2. Set up Tailwind CSS
3. Create a page with form selection
4. Test the flow
5. Customize styling as needed

## Need More Help?

- See `README.md` for detailed documentation
- See `UsageExample.tsx` for complete working example
- Check `QUICK_START.md` for basic usage

---

**Your backend is already configured correctly! Just copy the forms and start using them.**

