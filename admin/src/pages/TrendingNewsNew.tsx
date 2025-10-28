import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNewsItems } from "@/hooks/useLocalData";
import { NewsViewDialog } from "@/components/NewsViewDialog";
import { NewsItem } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Eye, 
  Calendar, 
  TrendingUp, 
  Newspaper, 
  Globe, 
  Users, 
  Filter,
  Clock,
  BookOpen,
  MessageSquare
} from "lucide-react";
// Form editor removed from this page per request

export default function TrendingNewsNew() {
  const { data: newsData, update } = useNewsItems();
  const { toast } = useToast();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");
  const itemsPerPage = 9;
  

  const handleToggleStatus = (news: NewsItem) => {
    const newStatus = news.status === "Published" ? "Draft" : "Published";
    update(news.id, { ...news, status: newStatus });
    toast({
      title: "Success",
      description: `News ${newStatus.toLowerCase()} successfully`,
    });
  };

  const handleNewsClick = (news: NewsItem) => {
    setSelectedNews(news);
    setDialogOpen(true);
  };

  // Filter and search logic
  const filteredNews = useMemo(() => {
    return newsData.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           news.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || news.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [newsData, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate stats
  const publishedCount = newsData.filter(news => news.status === "Published").length;
  const draftCount = newsData.filter(news => news.status === "Draft").length;
  const totalViews = newsData.reduce((sum, news) => sum + news.views, 0);
  const avgViews = newsData.length > 0 ? Math.round(totalViews / newsData.length) : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">News & Updates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage news articles and announcements
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Total Articles</p>
                <p className="text-2xl font-bold text-foreground mt-1">{newsData.length}</p>
              </div>
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Published</p>
                <p className="text-2xl font-bold text-foreground mt-1">{publishedCount}</p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Drafts</p>
                <p className="text-2xl font-bold text-foreground mt-1">{draftCount}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Avg Views</p>
                <p className="text-2xl font-bold text-foreground mt-1">{avgViews}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("All")}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            All
          </Button>
          <Button
            variant={statusFilter === "Published" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("Published")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            Published
          </Button>
          <Button
            variant={statusFilter === "Draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("Draft")}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Drafts
          </Button>
        </div>
      </div>

      {/* News Cards Grid */}
      {filteredNews.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center">
              <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                {searchQuery || statusFilter !== "All" 
                  ? "No articles match your search criteria." 
                  : "No news articles found."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.map((news) => (
            <Card 
              key={news.id} 
              className="group hover:shadow-lg transition-all border border-border cursor-pointer bg-card overflow-hidden"
              onClick={() => handleNewsClick(news)}
            >
              {/* News Header with Gradient */}
              <div className="relative h-32 bg-gradient-to-br from-blue-900 via-blue-950 to-black">
                <div className="w-full h-full flex items-center justify-center">
                  <Newspaper className="h-12 w-12 text-white/70" />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={`${
                    news.status === "Published" 
                      ? "bg-green-500/90 text-white border-0" 
                      : "bg-orange-500/90 text-white border-0"
                  } shadow-md font-semibold text-xs`}>
                    {news.status}
                  </Badge>
                </div>

                {/* Views Counter */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Eye className="h-3 w-3 text-white" />
                  <span className="text-white text-xs font-medium">{news.views} views</span>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="font-bold text-base text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
                    {news.title}
                  </h3>

                  {/* Content Preview */}
                  <div className="bg-muted/30 p-3 rounded border border-border min-h-[80px]">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {news.content}
                    </p>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{news.date}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-white transition-all text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(news);
                      }}
                    >
                      {news.status === "Published" ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      

      <NewsViewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        news={selectedNews}
      />
    </div>
  );
}
