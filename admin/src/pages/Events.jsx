import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventForm from '@/components/EventForm.jsx';

export default function Events() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await apiClient.getEvents();
        if (mounted) setEvents(Array.isArray(data) ? data : (data?.events || []));
      } catch (err) {
        if ((err instanceof ApiError && err.status === 401) || err?.message === 'unauthorized') {
          navigate('/login');
        } else {
          setError(err?.message || 'Failed to load events');
          toast({ title: 'Error', description: err?.message || 'Failed to load events', variant: 'destructive' });
        }
      } finally { setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [isAuthenticated, navigate]);

  const refresh = async () => {
    try {
      const data = await apiClient.getEvents();
      setEvents(Array.isArray(data) ? data : (data?.events || []));
    } catch (err) {
      setError(err?.message || 'Failed to refresh events');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Button variant="default" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Hide form' : 'Add Event'}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <EventForm
              onCreated={(ev) => {
                setEvents((prev) => [ev, ...prev]);
                setShowForm(false);
                toast({ title: 'Success', description: 'Event created' });
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <ul className="divide-y">
              {events.map((ev) => (
                <li key={ev.id || ev.name + ev.date} className="py-3">
                  <div className="font-medium">{ev.name}</div>
                  <div className="text-sm text-muted-foreground">{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</div>
                </li>
              ))}
              {events.length === 0 ? (
                <li className="py-3 text-sm text-muted-foreground">No events yet.</li>
              ) : null}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


