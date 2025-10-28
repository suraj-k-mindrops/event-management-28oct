// API Helper functions for form submissions
// VITE-SPECIFIC VERSION
// Copy this file and replace apiHelpers.ts with this content if you're using Vite

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage or context
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * API request wrapper with authentication
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers as HeadersInit,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

/**
 * Submit Provider form data
 */
export const submitProviderForm = async (data: any): Promise<any> => {
  const response = await apiRequest('/providers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create provider');
  }

  return result;
};

/**
 * Submit Event Type form data
 */
export const submitEventTypeForm = async (data: any): Promise<any> => {
  const response = await apiRequest('/event-types', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create event type');
  }

  return result;
};

/**
 * Submit Venue form data
 */
export const submitVenueForm = async (data: any): Promise<any> => {
  const response = await apiRequest('/venues', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create venue');
  }

  return result;
};

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }

  // Store token
  if (result.token) {
    setAuthToken(result.token);
  }

  return result;
};

/**
 * Register new user
 */
export const register = async (name: string, email: string, password: string, role: string = 'STUDENT'): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Registration failed');
  }

  return result;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  removeAuthToken();
};

