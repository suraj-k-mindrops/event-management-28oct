import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventType } from '@/lib/storage';

const colorOptions = [
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-rose-500', label: 'Rose' },
  { value: 'bg-cyan-500', label: 'Cyan' },
  { value: 'bg-teal-500', label: 'Teal' },
  { value: 'bg-violet-500', label: 'Violet' },
  { value: 'bg-lime-500', label: 'Lime' },
];

interface EventTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventType?: EventType | null;
  onSave: (eventType: Omit<EventType, 'id'>) => void;
  title: string;
  description: string;
}

export function EventTypeDialog({ open, onOpenChange, eventType, onSave, title, description }: EventTypeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: 'bg-blue-500',
    events: '',
    active: true,
    description: '',
  });

  useEffect(() => {
    if (eventType) {
      setFormData({
        name: eventType.name,
        color: eventType.color,
        events: eventType.events.toString(),
        active: eventType.active,
        description: eventType.description || '',
      });
    } else {
      setFormData({
        name: '',
        color: 'bg-blue-500',
        events: '',
        active: true,
        description: '',
      });
    }
  }, [eventType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      color: formData.color,
      events: parseInt(formData.events) || 0,
      active: formData.active,
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
            <Label htmlFor="name">Event Type Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-8 w-8 rounded ${color.value} border-2 ${
                    formData.color === color.value ? 'border-black' : 'border-transparent'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  title={color.label}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="events">Total Events</Label>
            <Input
              id="events"
              type="number"
              value={formData.events}
              onChange={(e) => setFormData(prev => ({ ...prev, events: e.target.value }))}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Active</Label>
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
