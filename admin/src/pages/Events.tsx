import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/EventForm.jsx';
import { useEvents } from '@/hooks/useApiData';

export default function Events() {
  const { data: events, isLoading, error, refetch } = useEvents();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => refetch()} disabled={isLoading}>Refresh</Button>
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Hide form' : 'Add Event'}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-600">{(error as any)?.message || 'Failed to load events'}</p>
      ) : null}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <EventForm
              onCreated={() => {
                setShowForm(false);
                refetch();
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
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <ul className="divide-y">
              {(events || []).map((ev) => (
                <li key={ev.id || ev.name + ev.date} className="py-3">
                  <div className="font-medium">{ev.name}</div>
                  <div className="text-sm text-muted-foreground">{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</div>
                </li>
              ))}
              {!events?.length ? (
                <li className="py-3 text-sm text-muted-foreground">No events yet.</li>
              ) : null}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


