import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Package, Sparkles, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: events = [], isError } = useQuery({
    queryKey: ['my-events', user?.name],
    queryFn: async () => {
      try {
        const response = await api.getMyEvents(user?.name || '');
        // Handle different response formats
        if (Array.isArray(response)) {
          return response;
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        // If error or invalid format, return empty array
        return [];
      } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
      }
    },
    enabled: !!user?.name,
    retry: false, // Don't retry on 404
  });

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      description: 'Events submitted',
      color: 'from-primary to-primary',
    },
    {
      title: 'Pending Review',
      value: events.filter((e: any) => e.status === 'Pending').length,
      icon: TrendingUp,
      description: 'Awaiting approval',
      color: 'from-primary to-primary',
    },
    {
      title: 'Approved',
      value: events.filter((e: any) => e.status === 'Approved').length,
      icon: Package,
      description: 'Successfully approved',
      color: 'from-success to-emerald-500',
    },
  ];

  const recentEvents = events.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Ready to manage your events and showcase your work?
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigate('/events')}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Event
            </Button>
            <Button
              onClick={() => navigate('/portfolio')}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              View Portfolio
            </Button>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-2`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Your latest event submissions</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/events')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first event submission
              </p>
            <Button onClick={() => navigate('/events')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-4 rounded-lg border hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => navigate('/events')}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{event.nameOfEvent}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.typeOfEvent} • {new Date(event.dateOfEvent).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Approved'
                        ? 'bg-success/10 text-success'
                        : event.status === 'Pending'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {event.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
