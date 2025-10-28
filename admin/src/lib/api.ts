const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-token-changed', { detail: { token } }));
      }
    } else {
      localStorage.removeItem('auth_token');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-token-changed', { detail: { token: null } }));
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token && !skipAuth) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText || 'Request failed' };
      }
      console.error('API Error:', errorData);
      
      // Auto-logout on auth failures
      if (response.status === 401 || response.status === 403) {
        this.setToken(null);
      }
      throw new ApiError(response.status, errorData.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    // Skip authentication header for login request
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, true); // skipAuth = true to not send token header
    
    // Backend returns: { data: { user: {...}, token: "...", refreshToken: "..." }, message: "..." }
    // Extract from response.data
    const token = response?.data?.token;
    const user = response?.data?.user;
    
    // Return in the format expected by AuthContext
    return {
      token,
      user,
      message: response.message
    };
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    // Skip authentication header for register request
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, true); // skipAuth = true to not send token header
    
    // Backend returns: { data: { user: {...}, token: "..." }, message: "..." }
    // Extract from response.data
    const token = response?.data?.token;
    const user = response?.data?.user;
    
    return {
      token,
      user,
      message: response.message
    };
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken() {
    return this.request<{ user: any }>(`/auth/verify`, {
      method: 'GET',
    });
  }

  async refreshToken() {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Event Types
  async getEventTypes() {
    const response = await this.request<any>('/event-types');
    // Backend returns { data: [...], message: "..." }
    return response.data || response || [];
  }

  async createEventType(data: any) {
    return this.request<any>('/event-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEventType(id: number, data: any) {
    return this.request<any>(`/event-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEventType(id: number) {
    return this.request<{ message: string }>(`/event-types/${id}`, {
      method: 'DELETE',
    });
  }

  // Venues
  async getVenues() {
    return this.request<any[]>('/venues');
  }

  async createVenue(data: any) {
    return this.request<any>('/venues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVenue(id: number, data: any) {
    return this.request<any>(`/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVenue(id: number) {
    return this.request<{ message: string }>(`/venues/${id}`, {
      method: 'DELETE',
    });
  }

  // Vendors
  async getVendors() {
    return this.request<any[]>('/vendors');
  }

  async createVendor(data: any) {
    return this.request<any>('/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVendor(id: number, data: any) {
    return this.request<any>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVendor(id: number) {
    return this.request<{ message: string }>(`/vendors/${id}`, {
      method: 'DELETE',
    });
  }

  // Students
  async getStudents() {
    const response = await this.request<any>('/students');
    // Return the response as-is since backend returns { data: [...], message: "..." }
    return response;
  }

  async createStudent(data: any) {
    return this.request<any>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: number, data: any) {
    return this.request<any>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: number) {
    return this.request<{ message: string }>(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Directory Entries
  async getDirectoryEntries(organizerName?: string) {
    const url = organizerName 
      ? `/directory-entries?organizerName=${encodeURIComponent(organizerName)}`
      : '/directory-entries';
    const response = await this.request<any>(url);
    return response;
  }

  // Event Packages
  async getEventPackages(organizerName?: string) {
    const url = organizerName
      ? `/event-packages?organizerName=${encodeURIComponent(organizerName)}`
      : '/event-packages';
    const response = await this.request<any>(url);
    return response;
  }

  // Providers
  async getProviders(category?: string, status?: string) {
    let url = '/providers';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await this.request<any>(url);
    return response;
  }

  async getProviderCounts() {
    return this.request<any>('/providers/counts/by-category');
  }

  async getProviderStats() {
    return this.request<any>('/providers/stats/overview');
  }

  async getProvider(id: number) {
    return this.request<any>(`/providers/${id}`);
  }

  async createProvider(data: any) {
    return this.request<any>('/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProvider(id: number, data: any) {
    return this.request<any>(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProvider(id: number) {
    return this.request<{ message: string }>(`/providers/${id}`, {
      method: 'DELETE',
    });
  }

  // Content Pages
  async getContentPages() {
    return this.request<any[]>('/content-pages');
  }

  async createContentPage(data: any) {
    return this.request<any>('/content-pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContentPage(id: number, data: any) {
    return this.request<any>(`/content-pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContentPage(id: number) {
    return this.request<{ message: string }>(`/content-pages/${id}`, {
      method: 'DELETE',
    });
  }

  // Media Items
  async getMediaItems() {
    return this.request<any[]>('/media-items');
  }

  async createMediaItem(data: any) {
    return this.request<any>('/media-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMediaItem(id: number, data: any) {
    return this.request<any>(`/media-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMediaItem(id: number) {
    return this.request<{ message: string }>(`/media-items/${id}`, {
      method: 'DELETE',
    });
  }

  // News Items
  async getNewsItems() {
    return this.request<any[]>('/news-items');
  }

  async createNewsItem(data: any) {
    return this.request<any>('/news-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNewsItem(id: number, data: any) {
    return this.request<any>(`/news-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNewsItem(id: number) {
    return this.request<{ message: string }>(`/news-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Events
  async getEvents() {
    return this.request<any[]>('/events');
  }

  async createEvent(data: any) {
    return this.request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: number, data: any) {
    return this.request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: number) {
    return this.request<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Services
  async getServices() {
    return this.request<any[]>('/services');
  }

  async createService(data: any) {
    return this.request<any>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: number, data: any) {
    return this.request<any>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: number) {
    return this.request<{ message: string }>(`/services/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { ApiError };

