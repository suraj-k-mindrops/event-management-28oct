import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVenues } from '@/hooks/useApiData';

export default function VenueForm() {
  const { data: venues, add, update, remove, isCreating, isUpdating, isDeleting } = useVenues();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({ name: '', location: '', capacity: '' });

  const onAdd = async (e) => {
    e.preventDefault();
    const trimmedName = (name || '').trim();
    const trimmedLocation = (location || '').trim();
    const cap = Number(capacity);
    if (!trimmedName) return;
    if (!trimmedLocation) return;
    if (!Number.isFinite(cap) || cap < 1) return; // capacity must be > 0
    // Optional dedupe: prevent exact duplicate name+location
    const exists = (venues || []).some((v) => (v.name || '').trim().toLowerCase() === trimmedName.toLowerCase() && (v.location || '').trim().toLowerCase() === trimmedLocation.toLowerCase());
    if (exists) return;
    await add({ name: trimmedName, location: trimmedLocation, capacity: cap });
    setName('');
    setLocation('');
    setCapacity('');
  };

  const onEdit = (v) => {
    setEditingId(v.id);
    setEditing({ name: v.name || '', location: v.location || '', capacity: String(v.capacity || '') });
  };

  const onSave = async (id) => {
    const trimmedName = (editing.name || '').trim();
    const trimmedLocation = (editing.location || '').trim();
    const cap = Number(editing.capacity);
    if (!trimmedName || !trimmedLocation || !Number.isFinite(cap) || cap < 1) return;
    await update(id, { name: trimmedName, location: trimmedLocation, capacity: cap });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Venue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue-name">Name</Label>
              <Input id="venue-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-location">Location</Label>
              <Input id="venue-location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-capacity">Capacity</Label>
              <Input id="venue-capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="1" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isCreating}>Add</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {(venues || []).map((v) => (
              <li key={v.id} className="py-3 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                {editingId === v.id ? (
                  <>
                    <Input value={editing.name} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))} />
                    <Input value={editing.location} onChange={(e) => setEditing((s) => ({ ...s, location: e.target.value }))} />
                    <Input type="number" value={editing.capacity} onChange={(e) => setEditing((s) => ({ ...s, capacity: e.target.value }))} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => onSave(v.id)} disabled={isUpdating}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium">{v.name}</div>
                    <div className="text-sm text-muted-foreground">{v.location}</div>
                    <div className="text-sm">Cap: {v.capacity}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onEdit(v)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(v.id)} disabled={isDeleting}>Delete</Button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {!venues?.length ? (
              <li className="py-3 text-sm text-muted-foreground">No venues yet.</li>
            ) : null}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


