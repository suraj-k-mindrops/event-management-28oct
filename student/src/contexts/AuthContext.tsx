import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await api.verifyToken();
        if (response.data) {
          setUser(response.data);
        } else if (response.user) {
          setUser(response.user);
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      setUser(response.data.user);
      toast.success('Welcome back!');
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register(name, email, password);
    if (response.data && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      setUser(response.data.user);
      toast.success('Account created successfully!');
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
