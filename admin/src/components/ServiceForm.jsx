import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useServices } from '@/hooks/useApiData';

export default function ServiceForm() {
  const { data: services, add, update, remove, isCreating, isUpdating, isDeleting } = useServices();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({ name: '', category: '' });

  const onAdd = async (e) => {
    e.preventDefault();
    const trimmedName = (name || '').trim();
    const trimmedCategory = (category || '').trim();
    if (!trimmedName || !trimmedCategory) return;
    const exists = (services || []).some((s) => (s.name || '').trim().toLowerCase() === trimmedName.toLowerCase());
    if (exists) return;
    await add({ name: trimmedName, category: trimmedCategory });
    setName('');
    setCategory('');
  };

  const onEdit = (s) => {
    setEditingId(s.id);
    setEditing({ name: s.name || '', category: s.category || '' });
  };

  const onSave = async (id) => {
    const trimmedName = (editing.name || '').trim();
    const trimmedCategory = (editing.category || '').trim();
    if (!trimmedName || !trimmedCategory) return;
    await update(id, { name: trimmedName, category: trimmedCategory });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Name</Label>
              <Input id="service-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-category">Category</Label>
              <Input id="service-category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isCreating}>Add</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {(services || []).map((s) => (
              <li key={s.id} className="py-3 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                {editingId === s.id ? (
                  <>
                    <Input value={editing.name} onChange={(e) => setEditing((st) => ({ ...st, name: e.target.value }))} />
                    <Input value={editing.category} onChange={(e) => setEditing((st) => ({ ...st, category: e.target.value }))} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => onSave(s.id)} disabled={isUpdating}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-muted-foreground">{s.category}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onEdit(s)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(s.id)} disabled={isDeleting}>Delete</Button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {!services?.length ? (
              <li className="py-3 text-sm text-muted-foreground">No services yet.</li>
            ) : null}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


