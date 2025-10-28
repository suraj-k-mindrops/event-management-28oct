import { useState } from "react";
import { FileText, Plus, Edit, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useContentPages, useMediaItems } from "@/hooks/useLocalData";
import { ContentPageDialog } from "@/components/ContentPageDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ContentPage, MediaItem } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function ContentManagement() {
  const { data: pages, add: addPage, update: updatePage, remove: removePage } = useContentPages();
  const { data: media, add: addMedia, remove: removeMedia } = useMediaItems();
  const { toast } = useToast();
  
  // Page management
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [deletePageDialogOpen, setDeletePageDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<ContentPage | null>(null);

  // Media management
  const [deleteMediaDialogOpen, setDeleteMediaDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [currentPagePages, setCurrentPagePages] = useState(1);
  const [currentPageMedia, setCurrentPageMedia] = useState(1);
  const itemsPerPage = 10;

  const handleAddPage = () => {
    setEditingPage(null);
    setPageDialogOpen(true);
  };

  const handleEditPage = (page: ContentPage) => {
    setEditingPage(page);
    setPageDialogOpen(true);
  };

  const handleDeletePage = (page: ContentPage) => {
    setPageToDelete(page);
    setDeletePageDialogOpen(true);
  };

  const handleSavePage = (pageData: Omit<ContentPage, 'id'>) => {
    if (editingPage) {
      updatePage(editingPage.id, pageData);
      toast({
        title: "Success",
        description: "Page updated successfully",
      });
    } else {
      addPage(pageData);
      toast({
        title: "Success",
        description: "Page added successfully",
      });
    }
  };

  const confirmDeletePage = () => {
    if (pageToDelete) {
      removePage(pageToDelete.id);
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    }
  };

  const handleDeleteMedia = (mediaItem: MediaItem) => {
    setMediaToDelete(mediaItem);
    setDeleteMediaDialogOpen(true);
  };

  const confirmDeleteMedia = () => {
    if (mediaToDelete) {
      removeMedia(mediaToDelete.id);
      toast({
        title: "Success",
        description: "Media deleted successfully",
      });
    }
  };

  const handleUploadMedia = () => {
    // For now, just show a placeholder message
    toast({
      title: "Upload Feature",
      description: "File upload functionality would be implemented here",
    });
  };

  // Pagination logic for pages
  const totalPagesPages = Math.ceil(pages.length / itemsPerPage);
  const paginatedPages = pages.slice((currentPagePages - 1) * itemsPerPage, currentPagePages * itemsPerPage);

  // Pagination logic for media
  const totalPagesMedia = Math.ceil(media.length / itemsPerPage);
  const paginatedMedia = media.slice((currentPageMedia - 1) * itemsPerPage, currentPageMedia * itemsPerPage);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground">Manage your content and resources</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={handleAddPage}>
              <Plus className="h-4 w-4" />
              New Page
            </Button>
          </div>
          <div className="grid gap-4">
            {paginatedPages.map((page) => (
              <Card key={page.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Last modified: {page.lastModified}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={page.status === "Published" ? "default" : "secondary"}>
                        {page.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditPage(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeletePage(page)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={handleUploadMedia}>
              <Image className="h-4 w-4" />
              Upload Media
            </Button>
          </div>
          <div className="grid gap-4">
            {paginatedMedia.map((item) => (
              <Card key={item.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.uploaded}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteMedia(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          {totalPagesPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPagePages(Math.max(1, currentPagePages - 1))}
                      className={currentPagePages === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPagesPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPagePages(page)}
                        isActive={page === currentPagePages}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPagePages(Math.min(totalPagesPages, currentPagePages + 1))}
                      className={currentPagePages === totalPagesPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={handleUploadMedia}>
              <Image className="h-4 w-4" />
              Upload Media
            </Button>
          </div>
          <div className="grid gap-4">
            {paginatedMedia.map((item) => (
              <Card key={item.id} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.uploaded}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMedia(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          {totalPagesMedia > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPageMedia(Math.max(1, currentPageMedia - 1))}
                      className={currentPageMedia === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPagesMedia }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPageMedia(page)}
                        isActive={page === currentPageMedia}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPageMedia(Math.min(totalPagesMedia, currentPageMedia + 1))}
                      className={currentPageMedia === totalPagesMedia ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ContentPageDialog
        open={pageDialogOpen}
        onOpenChange={setPageDialogOpen}
        page={editingPage}
        onSave={handleSavePage}
        title={editingPage ? "Edit Page" : "Add New Page"}
        description={editingPage ? "Update page content" : "Create a new content page"}
      />

      <ConfirmDialog
        open={deletePageDialogOpen}
        onOpenChange={setDeletePageDialogOpen}
        onConfirm={confirmDeletePage}
        title="Delete Page"
        description={`Are you sure you want to delete "${pageToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={deleteMediaDialogOpen}
        onOpenChange={setDeleteMediaDialogOpen}
        onConfirm={confirmDeleteMedia}
        title="Delete Media"
        description={`Are you sure you want to delete "${mediaToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
