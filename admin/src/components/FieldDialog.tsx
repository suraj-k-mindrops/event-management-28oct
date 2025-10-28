import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/lib/storage';

interface FieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field?: Field | null;
  onSave: (field: Omit<Field, 'id'>) => void;
  title: string;
  description: string;
}

export function FieldDialog({ open, onOpenChange, field, onSave, title, description }: FieldDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
    status: 'Active' as Field['status'],
    bookings: '',
    description: '',
  });

  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name,
        capacity: field.capacity.toString(),
        location: field.location,
        status: field.status,
        bookings: field.bookings.toString(),
        description: field.description || '',
      });
    } else {
      setFormData({
        name: '',
        capacity: '',
        location: '',
        status: 'Active',
        bookings: '',
        description: '',
      });
    }
  }, [field]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      capacity: parseInt(formData.capacity) || 0,
      location: formData.location,
      status: formData.status,
      bookings: parseInt(formData.bookings) || 0,
      description: formData.description,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Field Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Field['status']) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookings">Total Bookings</Label>
            <Input
              id="bookings"
              type="number"
              value={formData.bookings}
              onChange={(e) => setFormData(prev => ({ ...prev, bookings: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
