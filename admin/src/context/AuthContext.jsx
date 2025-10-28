import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
          // Set token in apiClient
          apiClient.setToken(savedToken);
          setToken(savedToken);
          
          // Verify token with backend
          try {
            const userData = await apiClient.verifyToken();
            setUser(userData.user || null);
          } catch (error) {
            console.error('Token verification failed:', error);
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            apiClient.setToken(null);
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth token changes across components
  useEffect(() => {
    const handler = (e) => {
      try {
        const detail = e.detail;
        const token = detail && 'token' in detail ? detail.token : localStorage.getItem('auth_token');
        if (token) {
          setToken(token);
          setUser(prev => prev || { token });
        } else {
          setToken(null);
          setUser(null);
        }
      } catch {
        const token = localStorage.getItem('auth_token');
        if (token) {
          setToken(token);
          setUser(prev => prev || { token });
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };
    
    window.addEventListener('auth-token-changed', handler);
    return () => window.removeEventListener('auth-token-changed', handler);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiClient.login(email, password);
      
      const newToken = data?.token;
      if (!newToken) {
        throw new Error('Invalid login response - no token received');
      }
      
      // Save token to localStorage and apiClient
      apiClient.setToken(newToken);
      setToken(newToken);
      setUser(data?.user || null);
      
      toast({ 
        title: 'Success', 
        description: 'Logged in successfully' 
      });
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Login failed';
      console.error('Login error:', error);
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear token from localStorage and apiClient
    apiClient.setToken(null);
    setToken(null);
    setUser(null);
    
    toast({ 
      title: 'Success', 
      description: 'Logged out successfully' 
    });

    // Redirect to login
    window.location.href = '/login';
  };

  const register = async (userData) => {
    try {
      const data = await apiClient.register(userData);
      const newToken = data?.token;
      
      if (newToken) {
        apiClient.setToken(newToken);
        setToken(newToken);
      }
      
      // Handle both 'user' and 'data' response structures
      const userInfo = data?.user || data?.data || null;
      setUser(userInfo);
      
      toast({ 
        title: 'Success', 
        description: 'Account created successfully' 
      });
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Registration failed';
      console.error('Registration error:', error);
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    logout,
    register,
  }), [token, user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


