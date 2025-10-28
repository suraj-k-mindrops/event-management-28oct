import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, MapPin, Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Events() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for Select components
  const [formValues, setFormValues] = useState({
    typeOfEvent: '',
    subEvent: '',
    venueLocation: '',
    logisticsServiceProvider: 'none',
    cateringProvider: 'none',
    photographerProvider: 'none',
    djProvider: 'none',
    securityProvider: 'none',
    giftsProvider: 'none',
  });

  // Fetch event types for dropdown
  const { data: eventTypesData, isLoading: eventTypesLoading } = useQuery({
    queryKey: ['event-types'],
    queryFn: async () => {
      try {
        console.log('Fetching event types from API...');
        const response = await api.getEventTypes();
        console.log('Event types response:', response);
        
        // Handle different response formats
        let data = response;
        if (response && response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.warn('Unexpected event types response format:', response);
          data = [];
        }
        
        console.log('Processed event types data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching event types:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });

  // Extract ONLY MAIN EVENT CATEGORIES (not sub-events)
  const getMainEventCategories = (): string[] => {
    console.log('Processing event types data:', eventTypesData);
    if (!eventTypesData || !Array.isArray(eventTypesData)) {
      console.log('No event types data or not an array');
      return [];
    }
    
    // Extract ONLY main event category names (not sub-events)
    const categories: string[] = [];
    eventTypesData.forEach((eventType: any) => {
      if (eventType.name && eventType.active !== false) {
        categories.push(eventType.name);
      }
    });
    
    console.log('Main event categories:', categories);
    return categories.sort();
  };

  const eventTypeOptions = getMainEventCategories();
  console.log('Final eventTypeOptions (Main Categories):', eventTypeOptions);

  // Get sub-events based on selected MAIN EVENT CATEGORY
  const getSubEventsForEventType = (): string[] => {
    console.log('Getting sub-events for:', formValues.typeOfEvent);
    console.log('Event types data:', eventTypesData);
    
    if (!formValues.typeOfEvent || !eventTypesData || !Array.isArray(eventTypesData)) {
      console.log('No event type selected or no data available');
      return [];
    }
    
    // Find the event type object that matches the selected category
    const selectedEventType = eventTypesData.find((et: any) => et.name === formValues.typeOfEvent);
    
    console.log('Selected event type object:', selectedEventType);
    
    if (selectedEventType?.subEvents) {
      // subEvents is stored as JSON, parse it if it's a string
      let subEvents = selectedEventType.subEvents;
      
      if (typeof subEvents === 'string') {
        try {
          subEvents = JSON.parse(subEvents);
        } catch (e) {
          console.error('Failed to parse subEvents:', e);
          subEvents = [];
        }
      }
      
      if (Array.isArray(subEvents) && subEvents.length > 0) {
        console.log('Sub-events found:', subEvents);
        return subEvents;
      }
    }
    
    console.log('No sub-events found for this event type');
    return [];
  };

  const subEventOptions = getSubEventsForEventType();
  console.log('Available sub-event options:', subEventOptions);

  // Fetch providers for dropdowns with error handling
  const { data: venuesData, isLoading: venuesLoading } = useQuery({
    queryKey: ['providers', 'VENUES'],
    queryFn: async () => {
      try {
        console.log('Fetching VENUES from API...');
        const data = await api.getProviders('VENUES');
        console.log('Venues received:', data);
        return data;
      } catch (error) {
        console.error('Error fetching venues:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
  });

  const { data: logisticsData } = useQuery({
    queryKey: ['providers', 'LOGISTICS'],
    queryFn: async () => {
      try {
        console.log('Fetching LOGISTICS from API...');
        const data = await api.getProviders('LOGISTICS');
        console.log('Logistics received:', data);
        return data;
      } catch (error) {
        console.error('Error fetching logistics:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000,
  });

  const { data: cateringData } = useQuery({
    queryKey: ['providers', 'CATERING'],
    queryFn: async () => {
      try {
        return await api.getProviders('CATERING');
      } catch (error) {
        console.error('Error fetching catering:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000,
  });

  const { data: photographersData } = useQuery({
    queryKey: ['providers', 'PHOTOGRAPHERS'],
    queryFn: async () => {
      try {
        return await api.getProviders('PHOTOGRAPHERS');
      } catch (error) {
        console.error('Error fetching photographers:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000,
  });

  const { data: djsData } = useQuery({
    queryKey: ['providers', 'DJ'],
    queryFn: async () => {
      try {
        console.log('Fetching DJ SERVICE from API...');
        const data = await api.getProviders('DJ');
        console.log('DJ Service received:', data);
        return data;
      } catch (error) {
        console.error('Error fetching DJs:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000,
  });

  const { data: securityData } = useQuery({
    queryKey: ['providers', 'SECURITY'],
    queryFn: async () => {
      try {
        console.log('Fetching SECURITY from API...');
        const data = await api.getProviders('SECURITY');
        console.log('Security received:', data);
        return data;
      } catch (error) {
        console.error('Error fetching security:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000,
  });

  const { data: giftsData } = useQuery({
    queryKey: ['providers', 'GIFTS'],
    queryFn: async () => {
      try {
        console.log('Fetching GIFTS from API...');
        const data = await api.getProviders('GIFTS');
        console.log('Gifts received:', data);
        return data;
      } catch (error) {
        console.error('Error fetching gifts:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000,
  });

  // Extract the actual array from the response - handle any data structure
  const getArrayFromData = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const venues = getArrayFromData(venuesData);
  const logistics = getArrayFromData(logisticsData);
  const catering = getArrayFromData(cateringData);
  const photographers = getArrayFromData(photographersData);
  const djs = getArrayFromData(djsData);
  const security = getArrayFromData(securityData);
  const gifts = getArrayFromData(giftsData);

  // Debug logs for dropdown data
  console.log('Dropdown data counts:', {
    eventTypes: eventTypeOptions.length,
    venues: venues.length,
    logistics: logistics.length,
    catering: catering.length,
    photographers: photographers.length,
    djs: djs.length,
    security: security.length,
    gifts: gifts.length,
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['my-events', user?.name],
    queryFn: async () => {
      try {
        console.log('Fetching events for:', user?.name);
        const response = await api.getMyEvents(user?.name || '');
        console.log('Events response:', response);
        if (Array.isArray(response)) {
          console.log(`Returning ${response.length} events`);
          return response;
        }
        if (response?.data && Array.isArray(response.data)) {
          console.log(`Returning ${response.data.length} events from data field`);
          return response.data;
        }
        console.log('No events found in response');
        return [];
      } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
      }
    },
    enabled: !!user?.name,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: api.createEvent,
    onSuccess: async () => {
      // Invalidate and refetch events
      await queryClient.invalidateQueries({ queryKey: ['my-events', user?.name] });
      console.log('Query invalidated, refetching events...');
      toast.success('Event created successfully!');
      setDialogOpen(false);
      // Reset form values
      setFormValues({
        typeOfEvent: '',
        subEvent: '',
        venueLocation: '',
        logisticsServiceProvider: 'none',
        cateringProvider: 'none',
        photographerProvider: 'none',
        djProvider: 'none',
        securityProvider: 'none',
        giftsProvider: 'none',
      });
    },
    onError: (error: any) => {
      console.error('Create event error:', error);
      
      // Handle authentication errors
      if (error?.message?.includes('token') || error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        localStorage.removeItem('auth_token');
        toast.error('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/auth';
        }, 1000);
        return;
      }
      
      toast.error(error?.message || 'Failed to create event');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateEvent(id, data),
    onSuccess: async () => {
      // Invalidate both query keys to ensure real-time updates
      await queryClient.invalidateQueries({ queryKey: ['my-events'] });
      await queryClient.invalidateQueries({ queryKey: ['my-events', user?.name] });
      toast.success('Event updated successfully!');
      setDialogOpen(false);
      setEditingEvent(null);
      // Reset form values
      setFormValues({
        typeOfEvent: '',
        subEvent: '',
        venueLocation: '',
        logisticsServiceProvider: 'none',
        cateringProvider: 'none',
        photographerProvider: 'none',
        djProvider: 'none',
        securityProvider: 'none',
        giftsProvider: 'none',
      });
    },
    onError: (error: any) => {
      console.error('Update event error:', error);
      
      // Handle authentication errors
      if (error?.message?.includes('token') || error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        localStorage.removeItem('auth_token');
        toast.error('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/auth';
        }, 1000);
        return;
      }
      
      toast.error(error?.message || 'Failed to update event');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteEvent,
    onSuccess: async () => {
      // Invalidate both query keys to ensure real-time updates
      await queryClient.invalidateQueries({ queryKey: ['my-events'] });
      await queryClient.invalidateQueries({ queryKey: ['my-events', user?.name] });
      toast.success('Event deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Delete event error:', error);
      toast.error(error?.message || 'Failed to delete event');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Helper function to convert "none" to empty string
    const cleanProviderValue = (value: string) => value === 'none' ? '' : value;
    
    const eventData = {
      typeOfEvent: formValues.typeOfEvent || formData.get('typeOfEvent') as string,
      subEvent: formValues.subEvent || '',
      nameOfEvent: formData.get('nameOfEvent') as string,
      venueLocation: formValues.venueLocation || formData.get('venueLocation') as string,
      dateOfEvent: formData.get('dateOfEvent') as string,
      teamsDepartmentsWorkprofile: formData.get('teamsDepartmentsWorkprofile') as string,
      targetAudience: formData.get('targetAudience') as string,
      theme: formData.get('theme') as string,
      logisticsServiceProvider: cleanProviderValue(formValues.logisticsServiceProvider || ''),
      cateringProvider: cleanProviderValue(formValues.cateringProvider || ''),
      photographerProvider: cleanProviderValue(formValues.photographerProvider || ''),
      djProvider: cleanProviderValue(formValues.djProvider || ''),
      securityProvider: cleanProviderValue(formValues.securityProvider || ''),
      giftsProvider: cleanProviderValue(formValues.giftsProvider || ''),
      mediaPhotos: formData.get('mediaPhotos') as string,
      mediaVideos: formData.get('mediaVideos') as string,
      organizerName: user?.name || '',
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: eventData });
    } else {
      createMutation.mutate(eventData);
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    // Helper to convert empty string to 'none' for provider fields
    const getProviderValue = (value: string) => value || 'none';
    
    setFormValues({
      typeOfEvent: event?.typeOfEvent || '',
      subEvent: event?.subEvent || '',
      venueLocation: event?.venueLocation || '',
      logisticsServiceProvider: getProviderValue(event?.logisticsServiceProvider || ''),
      cateringProvider: getProviderValue(event?.cateringProvider || ''),
      photographerProvider: getProviderValue(event?.photographerProvider || ''),
      djProvider: getProviderValue(event?.djProvider || ''),
      securityProvider: getProviderValue(event?.securityProvider || ''),
      giftsProvider: getProviderValue(event?.giftsProvider || ''),
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !editingEvent) {
      // Reset form when closing without editing
      setFormValues({
        typeOfEvent: '',
        subEvent: '',
        venueLocation: '',
        logisticsServiceProvider: 'none',
        cateringProvider: 'none',
        photographerProvider: 'none',
        djProvider: 'none',
        securityProvider: 'none',
        giftsProvider: 'none',
      });
    }
    setDialogOpen(open);
  };

  const filteredEvents = events.filter((event: any) =>
    event.nameOfEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.typeOfEvent.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Debug logging
  console.log('Current events state:', events);
  console.log('Filtered events:', filteredEvents);
  console.log('Search query:', searchQuery);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground">Manage your event submissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update your event details' : 'Create a new event submission'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nameOfEvent">Event Name</Label>
                  <Input
                    id="nameOfEvent"
                    name="nameOfEvent"
                    defaultValue={editingEvent?.nameOfEvent}
                    placeholder="e.g., Tech Summit 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfEvent">Event Date</Label>
                  <Input
                    id="dateOfEvent"
                    name="dateOfEvent"
                    type="datetime-local"
                    defaultValue={editingEvent?.dateOfEvent?.slice(0, 16)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="typeOfEvent">Event Type</Label>
                  {eventTypeOptions.length > 0 ? (
                    <Select 
                      value={formValues.typeOfEvent} 
                      onValueChange={(value) => {
                        console.log('Event type selected:', value);
                        setFormValues({ ...formValues, typeOfEvent: value, subEvent: '' });
                      }}
                      required
                    >
                      <SelectTrigger id="typeOfEvent" name="typeOfEvent">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypeOptions.map((eventType) => (
                          <SelectItem key={eventType} value={eventType}>
                            {eventType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="typeOfEvent"
                      name="typeOfEvent"
                      value={formValues.typeOfEvent}
                      onChange={(e) => setFormValues({ ...formValues, typeOfEvent: e.target.value, subEvent: '' })}
                      placeholder="e.g., Conference, Workshop"
                      required
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {eventTypeOptions.length > 0 ? 'Select from admin-managed event types' : 'Enter event type'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subEvent">Sub Event Category</Label>
                  {subEventOptions.length > 0 ? (
                    <Select 
                      value={formValues.subEvent} 
                      onValueChange={(value) => setFormValues({ ...formValues, subEvent: value })}
                    >
                      <SelectTrigger id="subEvent" name="subEvent">
                        <SelectValue placeholder="Select sub-event category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subEventOptions.map((subEvent) => (
                          <SelectItem key={subEvent} value={subEvent}>
                            {subEvent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="subEvent"
                      name="subEvent"
                      value={formValues.subEvent}
                      onChange={(e) => setFormValues({ ...formValues, subEvent: e.target.value })}
                      placeholder="Enter sub-event (optional)"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {subEventOptions.length > 0 ? 'Select specific sub-event category' : 'Select event type first to see sub-events'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueLocation">Venue</Label>
                {venues.length > 0 ? (
                  <Select 
                    name="venueLocation" 
                    value={formValues.venueLocation} 
                    onValueChange={(value) => setFormValues({ ...formValues, venueLocation: value })}
                    required
                  >
                    <SelectTrigger id="venueLocation">
                      <SelectValue placeholder="Select a venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue: any) => (
                        <SelectItem key={venue.id} value={venue.name}>
                          {venue.name} {venue.location && `- ${venue.location}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="venueLocation"
                    name="venueLocation"
                    value={formValues.venueLocation}
                    onChange={(e) => setFormValues({ ...formValues, venueLocation: e.target.value })}
                    placeholder="Enter venue name"
                    required
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  {venues.length > 0 ? 'Select from admin-managed venues' : 'No venues available, enter venue name'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logisticsServiceProvider">Logistics Service Provider</Label>
                  {logistics.length > 0 ? (
                    <Select 
                      name="logisticsServiceProvider" 
                      value={formValues.logisticsServiceProvider}
                      onValueChange={(value) => setFormValues({ ...formValues, logisticsServiceProvider: value })}
                    >
                      <SelectTrigger id="logisticsServiceProvider">
                        <SelectValue placeholder="Select logistics provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {logistics.map((log: any) => (
                          <SelectItem key={log.id} value={log.name}>
                            {log.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="logisticsServiceProvider"
                      name="logisticsServiceProvider"
                      value={formValues.logisticsServiceProvider}
                      onChange={(e) => setFormValues({ ...formValues, logisticsServiceProvider: e.target.value })}
                      placeholder="Enter logistics provider"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Input
                    id="theme"
                    name="theme"
                    defaultValue={editingEvent?.theme}
                    placeholder="e.g., Innovation & Technology"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cateringProvider">Catering</Label>
                  {catering.length > 0 ? (
                    <Select 
                      name="cateringProvider" 
                      value={formValues.cateringProvider}
                      onValueChange={(value) => setFormValues({ ...formValues, cateringProvider: value })}
                    >
                      <SelectTrigger id="cateringProvider">
                        <SelectValue placeholder="Select caterer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {catering.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="cateringProvider"
                      name="cateringProvider"
                      value={formValues.cateringProvider}
                      onChange={(e) => setFormValues({ ...formValues, cateringProvider: e.target.value })}
                      placeholder="Enter caterer"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photographerProvider">Photographer</Label>
                  {photographers.length > 0 ? (
                    <Select 
                      name="photographerProvider" 
                      value={formValues.photographerProvider}
                      onValueChange={(value) => setFormValues({ ...formValues, photographerProvider: value })}
                    >
                      <SelectTrigger id="photographerProvider">
                        <SelectValue placeholder="Select photographer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {photographers.map((photo: any) => (
                          <SelectItem key={photo.id} value={photo.name}>
                            {photo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="photographerProvider"
                      name="photographerProvider"
                      value={formValues.photographerProvider}
                      onChange={(e) => setFormValues({ ...formValues, photographerProvider: e.target.value })}
                      placeholder="Enter photographer"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="djProvider">DJ Service</Label>
                  {djs.length > 0 ? (
                    <Select 
                      name="djProvider" 
                      value={formValues.djProvider}
                      onValueChange={(value) => setFormValues({ ...formValues, djProvider: value })}
                    >
                      <SelectTrigger id="djProvider">
                        <SelectValue placeholder="Select DJ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {djs.map((dj: any) => (
                          <SelectItem key={dj.id} value={dj.name}>
                            {dj.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="djProvider"
                      name="djProvider"
                      value={formValues.djProvider}
                      onChange={(e) => setFormValues({ ...formValues, djProvider: e.target.value })}
                      placeholder="Enter DJ service"
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="securityProvider">Security Service</Label>
                  {security.length > 0 ? (
                    <Select 
                      name="securityProvider" 
                      value={formValues.securityProvider}
                      onValueChange={(value) => setFormValues({ ...formValues, securityProvider: value })}
                    >
                      <SelectTrigger id="securityProvider">
                        <SelectValue placeholder="Select security service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {security.map((sec: any) => (
                          <SelectItem key={sec.id} value={sec.name}>
                            {sec.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="securityProvider"
                      name="securityProvider"
                      value={formValues.securityProvider}
                      onChange={(e) => setFormValues({ ...formValues, securityProvider: e.target.value })}
                      placeholder="Enter security service"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="giftsProvider">Gift Shop</Label>
                  {gifts.length > 0 ? (
                    <Select 
                      name="giftsProvider" 
                      value={formValues.giftsProvider}
                      onValueChange={(value) => setFormValues({ ...formValues, giftsProvider: value })}
                    >
                      <SelectTrigger id="giftsProvider">
                        <SelectValue placeholder="Select gift shop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {gifts.map((gift: any) => (
                          <SelectItem key={gift.id} value={gift.name}>
                            {gift.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="giftsProvider"
                      name="giftsProvider"
                      value={formValues.giftsProvider}
                      onChange={(e) => setFormValues({ ...formValues, giftsProvider: e.target.value })}
                      placeholder="Enter gift shop"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  name="targetAudience"
                  defaultValue={editingEvent?.targetAudience}
                  placeholder="e.g., 500 tech professionals, students"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamsDepartmentsWorkprofile">Teams/Departments</Label>
                <Textarea
                  id="teamsDepartmentsWorkprofile"
                  name="teamsDepartmentsWorkprofile"
                  defaultValue={editingEvent?.teamsDepartmentsWorkprofile}
                  placeholder="e.g., Tech Team, Marketing, Design"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mediaPhotos">Photo URL</Label>
                  <Input
                    id="mediaPhotos"
                    name="mediaPhotos"
                    type="url"
                    defaultValue={editingEvent?.mediaPhotos}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mediaVideos">Video URL</Label>
                  <Input
                    id="mediaVideos"
                    name="mediaVideos"
                    type="url"
                    defaultValue={editingEvent?.mediaVideos}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingEvent(null);
                    setFormValues({
                      typeOfEvent: '',
                      subEvent: '',
                      venueLocation: '',
                      logisticsServiceProvider: 'none',
                      cateringProvider: 'none',
                      photographerProvider: 'none',
                      djProvider: 'none',
                      securityProvider: 'none',
                      giftsProvider: 'none',
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'Start by creating your first event'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event: any) => (
            <Card key={event.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{event.nameOfEvent}</CardTitle>
                    <CardDescription className="mt-1">{event.typeOfEvent}</CardDescription>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent`}
                  >
                    Pending Review
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.dateOfEvent).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.venueLocation}
                  </div>
                </div>
                {event.theme && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Theme: {event.theme}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
