import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export function useAuthApi() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          apiClient.setToken(token);
          const userData = await apiClient.verifyToken();
          setAuthState({
            user: userData.user,
            isAuthenticated: true,
            isLoading: false,
            token,
          });
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await apiClient.login(email, password);
      
      apiClient.setToken(result.token);
      
      // Handle both 'user' and 'data' response structures
      const userData = result.user || (result as any).data || null;
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        token: result.token,
      });

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      return result;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      const message = error instanceof ApiError ? error.message : 'Login failed';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  // Register function
  const register = useCallback(async (userData: { name: string; email: string; password: string; role?: string }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await apiClient.register(userData);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });

      return result;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      const message = error instanceof ApiError ? error.message : 'Registration failed';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.setToken(null);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });

      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    }
  }, [toast]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const result = await apiClient.refreshToken();
      apiClient.setToken(result.token);
      
      setAuthState(prev => ({
        ...prev,
        token: result.token,
      }));

      return result.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  }, [logout]);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
  };
}
