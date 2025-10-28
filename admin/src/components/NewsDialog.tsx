import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsItem } from '@/lib/storage';

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news?: NewsItem | null;
  onSave: (news: Omit<NewsItem, 'id'>) => void;
  title: string;
  description: string;
}

export function NewsDialog({ open, onOpenChange, news, onSave, title, description }: NewsDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'Draft' as NewsItem['status'],
    author: '',
    tags: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        status: news.status,
        author: news.author || '',
        tags: news.tags?.join(', ') || '',
        imageUrl: news.imageUrl || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        status: 'Draft',
        author: '',
        tags: '',
        imageUrl: '',
      });
    }
  }, [news]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      content: formData.content,
      status: formData.status,
      date: news ? news.date : new Date().toISOString().split('T')[0],
      views: news ? news.views : 0,
      author: formData.author,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      imageUrl: formData.imageUrl,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">News Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: NewsItem['status']) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Separate tags with commas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[200px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Image URL</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-2">
                <Input
                  placeholder="Enter image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </TabsContent>
              <TabsContent value="upload" className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFormData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
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
