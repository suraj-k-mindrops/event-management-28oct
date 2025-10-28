import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Eye, User, Tag } from 'lucide-react';
import { NewsItem } from '@/lib/storage';

interface NewsViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsItem | null;
}

export function NewsViewDialog({ open, onOpenChange, news }: NewsViewDialogProps) {
  if (!news) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">{news.title}</DialogTitle>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>By {news.author || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{news.date}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{news.views} views</span>
            </div>
            <Badge variant={news.status === "Published" ? "default" : "secondary"} className="ml-auto">
              {news.status}
            </Badge>
          </div>
        </DialogHeader>
        <Separator />
        <div className="space-y-6">
          {news.imageUrl && (
            <div className="w-full">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-auto rounded-lg object-cover shadow-md"
              />
            </div>
          )}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Content</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{news.content}</p>
            </div>
          </div>
          {news.tags && news.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="hover:bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
