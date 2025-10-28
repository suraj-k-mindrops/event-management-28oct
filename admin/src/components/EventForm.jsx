import { useState } from 'react';
import { apiClient, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EventForm({ onCreated }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedName = (name || '').trim();
      const isoDate = date ? new Date(date).toISOString() : null;
      if (!trimmedName) {
        throw new Error('Event name is required');
      }
      if (!isoDate || Number.isNaN(new Date(isoDate).getTime())) {
        throw new Error('Valid event date is required');
      }
      const payload = { name: trimmedName, date: isoDate };
      const created = await apiClient.createEvent(payload);
      setName('');
      setDate('');
      if (onCreated) onCreated(created);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : (err?.message || 'Failed to create event');
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Event name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Add Event'}</Button>
    </form>
  );
}


