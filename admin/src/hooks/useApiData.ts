import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Generic hook for API data management
function useApiData<T extends { id: number }>(
  queryKey: string[],
  fetchFn: () => Promise<T[]>,
  createFn: (data: Omit<T, 'id'>) => Promise<T>,
  updateFn: (id: number, data: Partial<T>) => Promise<T>,
  deleteFn: (id: number) => Promise<{ message: string }>
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: fetchFn,
  });

  const createMutation = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Success",
        description: "Item created successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create item",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<T> }) => updateFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    },
  });

  const add = useCallback((item: Omit<T, 'id'>) => {
    return createMutation.mutateAsync(item);
  }, [createMutation]);

  const update = useCallback((id: number, updates: Partial<T>) => {
    return updateMutation.mutateAsync({ id, data: updates });
  }, [updateMutation]);

  const remove = useCallback((id: number) => {
    return deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const getById = useCallback((id: number) => {
    return data.find(item => item.id === id);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    add,
    update,
    remove,
    getById,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Specific hooks for each data type
export function useEventTypes() {
  return useApiData(
    ['event-types'],
    () => apiClient.getEventTypes(),
    (data) => apiClient.createEventType(data),
    (id, data) => apiClient.updateEventType(id, data),
    (id) => apiClient.deleteEventType(id)
  );
}

export function useVenues() {
  return useApiData(
    ['venues'],
    () => apiClient.getVenues(),
    (data) => apiClient.createVenue(data),
    (id, data) => apiClient.updateVenue(id, data),
    (id) => apiClient.deleteVenue(id)
  );
}

export function useVendors() {
  return useApiData(
    ['vendors'],
    () => apiClient.getVendors(),
    (data) => apiClient.createVendor(data),
    (id, data) => apiClient.updateVendor(id, data),
    (id) => apiClient.deleteVendor(id)
  );
}

export function useStudents() {
  return useApiData(
    ['students'],
    () => apiClient.getStudents(),
    (data) => apiClient.createStudent(data),
    (id, data) => apiClient.updateStudent(id, data),
    (id) => apiClient.deleteStudent(id)
  );
}

export function useContentPages() {
  return useApiData(
    ['content-pages'],
    () => apiClient.getContentPages(),
    (data) => apiClient.createContentPage(data),
    (id, data) => apiClient.updateContentPage(id, data),
    (id) => apiClient.deleteContentPage(id)
  );
}

export function useMediaItems() {
  return useApiData(
    ['media-items'],
    () => apiClient.getMediaItems(),
    (data) => apiClient.createMediaItem(data),
    (id, data) => apiClient.updateMediaItem(id, data),
    (id) => apiClient.deleteMediaItem(id)
  );
}

export function useNewsItems() {
  return useApiData(
    ['news-items'],
    () => apiClient.getNewsItems(),
    (data) => apiClient.createNewsItem(data),
    (id, data) => apiClient.updateNewsItem(id, data),
    (id) => apiClient.deleteNewsItem(id)
  );
}

export function useEvents() {
  return useApiData(
    ['events'],
    () => apiClient.getEvents(),
    (data) => apiClient.createEvent(data),
    (id, data) => apiClient.updateEvent(id, data),
    (id) => apiClient.deleteEvent(id)
  );
}

export function useServices() {
  return useApiData(
    ['services'],
    () => apiClient.getServices(),
    (data) => apiClient.createService(data),
    (id, data) => apiClient.updateService(id, data),
    (id) => apiClient.deleteService(id)
  );
}

export function useDirectoryEntries() {
  return useApiData(
    ['directory-entries'],
    () => apiClient.getDirectoryEntries(),
    (data) => apiClient.request<any>('/directory-entries', { method: 'POST', body: JSON.stringify(data) }),
    (id, data) => apiClient.request<any>(`/directory-entries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    (id) => apiClient.request<{ message: string }>(`/directory-entries/${id}`, { method: 'DELETE' })
  );
}

export function useEventPackagesApi() {
  return useApiData(
    ['event-packages'],
    () => apiClient.getEventPackages(),
    (data) => apiClient.request<any>('/event-packages', { method: 'POST', body: JSON.stringify(data) }),
    (id, data) => apiClient.request<any>(`/event-packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    (id) => apiClient.request<{ message: string }>(`/event-packages/${id}`, { method: 'DELETE' })
  );
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          apiClient.setToken(token);
          const verify = await apiClient.verifyToken();
          setUser(verify.user || { token });
        } catch (_) {
          apiClient.setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  // Listen for auth token changes across components
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { token?: string | null } | undefined;
        const token = detail && 'token' in detail ? detail.token : localStorage.getItem('auth_token');
        if (token) {
          setUser((prev) => prev || { token });
        } else {
          setUser(null);
        }
      } catch {
        const token = localStorage.getItem('auth_token');
        if (token) setUser((prev) => prev || { token }); else setUser(null);
      }
    };
    window.addEventListener('auth-token-changed', handler as EventListener);
    return () => window.removeEventListener('auth-token-changed', handler as EventListener);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.token);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      return response;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const register = useCallback(async (userData: { name: string; email: string; password: string; role?: string }) => {
    try {
      const response = await apiClient.register(userData);
      // If backend returns token, set it; otherwise, auto-login
      if ((response as any)?.token) {
        apiClient.setToken((response as any).token);
        try {
          const verify = await apiClient.verifyToken();
          setUser(verify.user || null);
        } catch {}
      } else {
        await login(userData.email, userData.password);
      }
      toast({ title: "Success", description: "Account created successfully" });
      return response;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const logout = useCallback(() => {
    apiClient.setToken(null);
    setUser(null);
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  }, [toast]);

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}

