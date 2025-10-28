const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('auth_token');

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

export const api = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }
    
    return response.json();
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: 'STUDENT' }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed: ${response.status}`);
    }
    
    return response.json();
  },

  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    return response.json();
  },

  // Student Profile
  getStudent: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  updateStudent: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Directory Entries (Student's Events)
  getMyEvents: async (organizerName: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/directory-entries?organizerName=${encodeURIComponent(organizerName)}`,
        { headers: getAuthHeaders() }
      );
      
      // Handle 404 or other errors gracefully
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Get events error response:', errorData);
        if (response.status === 404) {
          console.log('No events found for user (404) - returning empty array');
          return [];
        }
        if (response.status === 500) {
          console.error('Server error:', errorData.message || errorData.error);
        }
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      const result = await response.json();
      // Extract data field from response
      return result.data || result || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  createEvent: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/directory-entries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create event: ${response.status}`);
    }
    
    return response.json();
  },

  updateEvent: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/directory-entries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update event: ${response.status}`);
    }
    
    return response.json();
  },

  deleteEvent: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/directory-entries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete event: ${response.status}`);
    }
    
    return response.json();
  },

  // Event Packages (Approved Events)
  getEventPackages: async () => {
    const response = await fetch(`${API_BASE_URL}/event-packages`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Venues
  getVenues: async () => {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Providers
  getProviders: async (category?: string) => {
    let url = `${API_BASE_URL}/providers`;
    if (category) url += `?category=${encodeURIComponent(category)}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  },

  // Event Types
  getEventTypes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/event-types`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch event types: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching event types:', error);
      return [];
    }
  },
};
