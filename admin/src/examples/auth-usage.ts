// Example usage of the real backend API via apiClient
import { apiClient } from '@/lib/api';

// Example 1: Login
export async function exampleLogin() {
  const result = await apiClient.login('user@example.com', 'password123');
  console.log('Login successful:', result.user);
  apiClient.setToken(result.token);
}

// Example 2: Register
export async function exampleRegister() {
  const result = await apiClient.register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'STUDENT'
  });
  console.log('Registration successful:', result.user);
}

// Example 3: Logout
export async function exampleLogout() {
  await apiClient.logout();
  apiClient.setToken(null);
  console.log('Logout successful');
}

// Example 4: Verify Token
export async function exampleVerifyToken() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.error('No token found');
    return;
  }
  apiClient.setToken(token);
  const result = await apiClient.verifyToken();
  console.log('Token is valid:', result.user);
}

// Example 5: Refresh Token
export async function exampleRefreshToken() {
  const result = await apiClient.refreshToken();
  apiClient.setToken(result.token);
  console.log('Token refreshed successfully');
}

// Example 6: Using in a React component
export function useAuthExample() {
  const login = async (email: string, password: string) => {
    const result = await apiClient.login(email, password);
    apiClient.setToken(result.token);
    return result;
  };

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    const result = await apiClient.register(userData);
    return result;
  };

  const logout = async () => {
    await apiClient.logout();
    apiClient.setToken(null);
  };

  return { login, register, logout };
}
