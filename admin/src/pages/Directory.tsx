import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Search, Filter, Calendar, Users, MapPin, Eye, User, Building, Award, Briefcase, Truck, FileText, Image as ImageIcon, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface DirectoryEntry {
  id: string;
  typeOfEvent: string;
  nameOfEvent: string;
  venueLocation: string;
  dateOfEvent: string;
  teamsDepartmentsWorkprofile: string;
  targetAudience: string;
  theme: string;
  eventCompany: string;
  sponsors: string;
  vendors: string;
  manpowerRequired: string;
  logisticsServiceProvider: string;
  miscellaneous: string;
  mediaPhotos: string;
  mediaVideos: string;
  organizerName: string;
}

const STORAGE_KEY = "admin_eve_directory";

const eventTypes = [
  "Conference",
  "Wedding", 
  "Corporate",
  "Festival",
  "Workshop",
  "Gala",
  "Concert",
  "Exhibition",
  "Seminar",
  "Party",
  "Sports Event",
  "Charity Event"
];

const categories = [
  "Social Events",
  "Corporate Events",
  "Cultural Events",
  "Educational Events",
  "Sports Events"
];

// Consistent gradient for all events - Dark Blue to Black
const eventBannerGradient = "from-blue-900 via-blue-950 to-black";

const defaultEntry: DirectoryEntry = {
  id: "",
  typeOfEvent: "",
  nameOfEvent: "",
  venueLocation: "",
  dateOfEvent: "",
  teamsDepartmentsWorkprofile: "",
  targetAudience: "",
  theme: "",
  eventCompany: "",
  sponsors: "",
  vendors: "",
  manpowerRequired: "",
  logisticsServiceProvider: "",
  miscellaneous: "",
  mediaPhotos: "",
  mediaVideos: "",
  organizerName: "",
};

const sampleEvents: DirectoryEntry[] = [
  {
    id: "1",
    typeOfEvent: "Conference",
    nameOfEvent: "Annual Tech Summit 2024",
    venueLocation: "Grand Convention Center, Downtown",
    dateOfEvent: "2025-12-15",
    organizerName: "Sarah Anderson",
    teamsDepartmentsWorkprofile: "Tech Team, Marketing Team, Logistics Team, Registration Team",
    targetAudience: "500+ tech professionals, developers, CTOs, startup founders",
    theme: "Innovation & Future Technology",
    eventCompany: "TechEvents Global Inc.",
    sponsors: "Microsoft, Google, Amazon, Intel, Oracle",
    vendors: "AV Solutions Pro, Stage Design Co., Event Furniture Rentals",
    manpowerRequired: "50 staff members, 20 volunteers, 10 tech support",
    logisticsServiceProvider: "Swift Event Logistics",
    miscellaneous: "VIP lounge setup, Speaker green room, Live Q&A sessions, Networking areas",
    mediaPhotos: "Professional event photography, Headshots for speakers, Booth coverage",
    mediaVideos: "Live streaming on YouTube and LinkedIn, Session recordings, Highlights reel",
      },
      {
        id: "2",
    typeOfEvent: "Wedding",
    nameOfEvent: "Elegant Garden Wedding Celebration",
    venueLocation: "Sunset Garden Resort, Lake View Estate",
    dateOfEvent: "2025-11-20",
    organizerName: "Michael Chen",
    teamsDepartmentsWorkprofile: "Wedding Planning Team, Decoration Team, Catering Team, Photography Team",
    targetAudience: "300 wedding guests including family and friends",
    theme: "Romantic Garden Paradise with Floral Elegance",
    eventCompany: "Dream Weddings Inc.",
    sponsors: "Luxury Bridal Boutique, Jewelry House, Wedding Magazine",
    vendors: "Elegant Floral Designs, Gourmet Catering Co., Live Band Productions, Cake Studio",
    manpowerRequired: "30 staff members, 15 servers, 5 valet attendants",
    logisticsServiceProvider: "Wedding Logistics Pro",
    miscellaneous: "Guest shuttle service, Children's activity area, Wedding favors, Custom signage",
    mediaPhotos: "Professional wedding photography package, Drone aerial shots, Photo booth with props",
    mediaVideos: "Full ceremony and reception videography, Highlight film, Drone video coverage",
      },
      {
        id: "3",
    typeOfEvent: "Festival",
    nameOfEvent: "Summer Music Festival 2024",
    venueLocation: "Riverside Park Amphitheater, Waterfront District",
    dateOfEvent: "2025-08-10",
    organizerName: "Emma Rodriguez",
    teamsDepartmentsWorkprofile: "Entertainment Team, Logistics Team, Security Team, Marketing Team, Artist Relations",
    targetAudience: "2000+ music lovers, festival goers aged 18-45",
    theme: "Summer Vibes & Good Music Under the Stars",
    eventCompany: "Festival Productions Ltd.",
    sponsors: "Spotify, Red Bull, Local Breweries, Music Equipment Brands, Food Brands",
    vendors: "Stage Builders Inc., Sound Systems Pro, Food Vendor Alliance, Craft Beer Suppliers",
    manpowerRequired: "100 crew members, 50 security personnel, 30 volunteers, 15 medical staff",
    logisticsServiceProvider: "Major Events Logistics & Transportation",
    miscellaneous: "Food truck area, Craft beer garden, Art installations, Merchandise booths, Camping facilities",
    mediaPhotos: "Concert photography, Artist backstage shots, Crowd atmosphere photos, Sponsor coverage",
    mediaVideos: "Live streaming on YouTube and Instagram, Professional concert filming, Artist interviews, Festival highlights",
      },
      {
        id: "4",
    typeOfEvent: "Workshop",
    nameOfEvent: "Executive Leadership Workshop Series",
    venueLocation: "Business Excellence Center, Corporate District",
    dateOfEvent: "2025-10-05",
    organizerName: "James Wilson",
    teamsDepartmentsWorkprofile: "Training Team, Content Development Team, HR Department",
    targetAudience: "150 C-level executives and senior managers",
    theme: "Leading in the Digital Age - Transform or Perish",
    eventCompany: "Executive Training Solutions",
    sponsors: "Corporate Leadership Institute, Top Business Schools, Management Consulting Firms",
    vendors: "Training Materials Inc., Tech Equipment Rentals, Stationery Suppliers",
    manpowerRequired: "10 expert facilitators, 5 support staff, 3 tech coordinators",
    logisticsServiceProvider: "Corporate Events Logistics",
    miscellaneous: "Networking lunch, Certificate distribution, Executive lounge, Take-home materials",
    mediaPhotos: "Professional photography of sessions, Group photos, Certificate presentations",
    mediaVideos: "Conference recording for participants, Key takeaways video, Testimonial interviews",
      },
      {
        id: "5",
    typeOfEvent: "Exhibition",
    nameOfEvent: "Science & Innovation Expo 2024",
    venueLocation: "University Main Campus, Science Building Halls 1-3",
    dateOfEvent: "2025-09-15",
    organizerName: "Olivia Thompson",
    teamsDepartmentsWorkprofile: "Academic Team, Student Council, Research Team, IT Department, Faculty Advisors",
    targetAudience: "1000+ students, faculty members, researchers, industry professionals, high school students",
    theme: "Future of Science & Innovation - Tomorrow Starts Today",
    eventCompany: "University Events Department",
    sponsors: "National Science Foundation, Tech Companies, Research Institutes, Science Journals, Corporate Partners",
    vendors: "Exhibition Booth Builders, AV Equipment Suppliers, Interactive Display Systems, Printing Services",
    manpowerRequired: "40 staff members, 100 student volunteers, 20 technical assistants, 15 setup crew",
    logisticsServiceProvider: "Campus Logistics & Facilities Management",
    miscellaneous: "Research poster presentations, Innovation competition with prizes, Networking sessions, Career fair, Industry panel discussions",
    mediaPhotos: "Exhibition photography, Project documentation photos, Award ceremony coverage, Student presentations, Industry partner interactions",
    mediaVideos: "University website live stream, Project demonstration videos, Researcher interviews, Highlights compilation, Virtual tour for remote attendees",
      },
      {
        id: "6",
    typeOfEvent: "Gala",
    nameOfEvent: "Annual Charity Gala Evening",
    venueLocation: "Metropolitan Grand Ballroom, City Center Plaza",
    dateOfEvent: "2025-11-30",
    organizerName: "Sophia Martinez",
    teamsDepartmentsWorkprofile: "Fundraising Team, Event Coordination Team, Volunteer Management, Donor Relations, Marketing Team",
    targetAudience: "400 philanthropists, major donors, community leaders, celebrities, media representatives",
    theme: "Hope & Giving - Building Better Communities Together",
    eventCompany: "Charity Events Foundation",
    sponsors: "Philanthropic Organizations, Corporate Donors, Local Businesses, Media Partners, Foundation Grants",
    vendors: "Premium Catering Services, Luxury Decor Co., Audio Visual Specialists, Live Entertainment, Florist",
    manpowerRequired: "35 event staff, 20 volunteers, 12 professional servers, 5 registration staff, 8 valet attendants",
    logisticsServiceProvider: "Elite Events Logistics & Coordination",
    miscellaneous: "Silent auction with luxury items, Live musical performances, Keynote speeches by community leaders, VIP meet & greet, Pledge cards and donation stations",
    mediaPhotos: "Professional event photography, Red carpet arrival photos, Donor recognition photos, Candid moments, Auction item photography",
    mediaVideos: "Event highlights video package, Testimonial videos from beneficiaries, Live social media coverage on Instagram/Facebook, Thank you video for donors",
      },
      {
        id: "7",
    typeOfEvent: "Exhibition",
    nameOfEvent: "Contemporary Art & Culture Exhibition",
    venueLocation: "City Museum of Modern Art, Gallery Wings A & B",
    dateOfEvent: "2025-10-20",
    organizerName: "Liam Johnson",
    teamsDepartmentsWorkprofile: "Arts Curation Team, Marketing Team, Gallery Management, Installation Team, Education Department",
    targetAudience: "800+ art enthusiasts, collectors, students, artists, general public, school groups",
    theme: "Modern Expressions - Art Reimagined for the Digital Age",
    eventCompany: "Cultural Arts Collective & Museum Foundation",
    sponsors: "Art Galleries, Cultural Foundations, Art Collectors Association, Corporate Art Programs, City Arts Council",
    vendors: "Gallery Display Systems, Professional Lighting Specialists, Art Insurance Provider, Security Systems",
    manpowerRequired: "15 expert curators, 25 gallery assistants, 10 security personnel, 8 education guides",
    logisticsServiceProvider: "Fine Art Transport & Installation Services",
    miscellaneous: "Artist talks and Q&A sessions, Guided gallery tours, Opening reception with wine and cheese, Exhibition catalog sales, Virtual gallery tour access",
    mediaPhotos: "High-resolution artwork photography, Exhibition installation shots, Opening night event coverage, Artist portraits, Visitor engagement photos",
    mediaVideos: "360° virtual tour video, Artist interview series, Exhibition walkthrough with curator commentary, Behind-the-scenes installation footage, Visitor testimonials",
      },
      {
        id: "8",
    typeOfEvent: "Sports Event",
    nameOfEvent: "City Marathon Championship 2024",
    venueLocation: "City Center to Riverside Park - Official 26.2 mile certified course",
    dateOfEvent: "2025-09-25",
    organizerName: "Noah Brown",
    teamsDepartmentsWorkprofile: "Sports Coordination Team, Safety & Medical Team, Volunteer Management, Route Management, Registration Team, Timing Systems",
    targetAudience: "5000+ marathon runners (all skill levels), 10,000+ spectators, families, fitness enthusiasts",
    theme: "Run for Health - Challenge Yourself, Transform Your Life",
    eventCompany: "City Sports Federation & Running Club Alliance",
    sponsors: "Nike, Adidas, Health Organizations, Energy Drink Brands, Sports Nutrition Companies, Local Hospitals",
    vendors: "Medical Tents Provider, Hydration Station Suppliers, Timing Systems Co., Portable Restroom Rentals, Medal Manufacturers",
    manpowerRequired: "200 trained volunteers, 50 medical staff (EMTs & doctors), 75 route marshals, 30 registration team, 25 water station attendants",
    logisticsServiceProvider: "Sports Events Logistics & Safety Management",
    miscellaneous: "Multiple race categories (Full, Half, 10K, 5K), Medal ceremonies for all finishers, Post-race refreshments and recovery area, Professional massage stations, Secure baggage check, Participant expo",
    mediaPhotos: "Professional finish line photography, Action shots throughout the entire route, Medal ceremony coverage, Sponsor activation photos, Pre-race & post-race celebrations",
    mediaVideos: "Live TV coverage on Sports Channel, Drone footage of entire route and participants, Finish line celebration videos, Winner interviews and speeches, Event highlights reel for promotional use",
  },
  {
    id: "9",
    typeOfEvent: "Corporate",
    nameOfEvent: "Digital Marketing Summit 2025",
    venueLocation: "Innovation Hub, Tech District",
    dateOfEvent: "2025-11-08",
    organizerName: "Priya Sharma",
    teamsDepartmentsWorkprofile: "Marketing Team, Content Team, Sponsorship Team",
    targetAudience: "800+ digital marketers, business owners, entrepreneurs",
    theme: "Future of Digital Marketing - AI & Analytics",
    eventCompany: "Digital Marketing Association",
    sponsors: "Google Ads, Facebook, HubSpot, Salesforce",
    vendors: "Tech AV Solutions, Digital Display Rentals, Catering Services",
    manpowerRequired: "45 staff, 20 volunteers, 10 tech support",
    logisticsServiceProvider: "Corporate Events Logistics",
    miscellaneous: "Workshop sessions, Product demos, Networking lunch, Certificate distribution",
    mediaPhotos: "Session photography, Speaker portraits, Networking shots",
    mediaVideos: "Live streaming, Session recordings, Highlight reel",
  },
  {
    id: "10",
    typeOfEvent: "Wedding",
    nameOfEvent: "Royal Palace Wedding 2025",
    venueLocation: "Heritage Palace Hotel, Heritage District",
    dateOfEvent: "2025-10-28",
    organizerName: "Rahul Mehta",
    teamsDepartmentsWorkprofile: "Wedding Planning, Decoration, Catering, Entertainment",
    targetAudience: "500 VIP guests, family members, dignitaries",
    theme: "Royal Heritage Meets Modern Elegance",
    eventCompany: "Royal Weddings India",
    sponsors: "Luxury Jewelry Brands, Designer Boutiques",
    vendors: "Royal Caterers, Palace Decorators, Live Orchestra, Photo Studio",
    manpowerRequired: "60 staff, 25 servers, 10 valets, 8 coordinators",
    logisticsServiceProvider: "Premium Event Logistics",
    miscellaneous: "Royal entrance, Live performances, Fireworks display, Luxury wedding favors",
    mediaPhotos: "Cinematic wedding photography, Aerial shots, Traditional portraits",
    mediaVideos: "4K wedding film, Drone coverage, Same-day highlights",
  },
  {
    id: "11",
    typeOfEvent: "Concert",
    nameOfEvent: "Jazz & Blues Night 2025",
    venueLocation: "Waterfront Music Hall",
    dateOfEvent: "2025-09-15",
    organizerName: "Aiko Tanaka",
    teamsDepartmentsWorkprofile: "Music Events Team, Stage Management, Marketing",
    targetAudience: "1500 jazz enthusiasts, music lovers",
    theme: "Classic Jazz Meets Contemporary Blues",
    eventCompany: "Tokyo Music Productions",
    sponsors: "Musical Instruments Brands, Local Breweries",
    vendors: "Stage Equipment, Sound Systems, Bar Services",
    manpowerRequired: "35 staff, 15 ushers, 10 security",
    logisticsServiceProvider: "Concert Logistics Pro",
    miscellaneous: "VIP lounge, Meet & greet with artists, Merchandise booth",
    mediaPhotos: "Concert photography, Artist portraits, Audience engagement",
    mediaVideos: "Full concert recording, Artist interviews, Behind the scenes",
  },
  {
    id: "12",
    typeOfEvent: "Exhibition",
    nameOfEvent: "Modern Art Showcase 2025",
    venueLocation: "City Art Gallery, Cultural Center",
    dateOfEvent: "2026-01-20",
    organizerName: "Isabella Rossi",
    teamsDepartmentsWorkprofile: "Curation Team, Gallery Management, PR Team",
    targetAudience: "1200+ art collectors, enthusiasts, students",
    theme: "Contemporary Visions - Art of Tomorrow",
    eventCompany: "Italian Art Foundation",
    sponsors: "Art Foundations, Museums, Corporate Sponsors",
    vendors: "Gallery Display Systems, Lighting Specialists, Catering",
    manpowerRequired: "20 curators, 30 gallery assistants, 12 security",
    logisticsServiceProvider: "Art Transport & Logistics",
    miscellaneous: "Opening gala, Artist talks, Guided tours, Catalog publication",
    mediaPhotos: "Artwork documentation, Opening night coverage, Artist portraits",
    mediaVideos: "Gallery walkthrough, Artist interviews, Promotional video",
  },
  {
    id: "13",
    typeOfEvent: "Seminar",
    nameOfEvent: "Blockchain & Crypto Conference 2025",
    venueLocation: "Business Innovation Center",
    dateOfEvent: "2025-08-22",
    organizerName: "Lucas Martin",
    teamsDepartmentsWorkprofile: "Tech Team, Speaker Management, Registration",
    targetAudience: "600 crypto investors, developers, entrepreneurs",
    theme: "Decentralization & The Future of Finance",
    eventCompany: "Blockchain Council Europe",
    sponsors: "Crypto Exchanges, Tech Giants, Investment Firms",
    vendors: "Tech Equipment, Display Systems, Catering Services",
    manpowerRequired: "30 staff, 15 volunteers, 12 tech support",
    logisticsServiceProvider: "Tech Events Logistics",
    miscellaneous: "Panel discussions, Demo booths, Networking sessions",
    mediaPhotos: "Conference photography, Speaker headshots, Booth coverage",
    mediaVideos: "Live stream, Session recordings, Interviews",
  },
  {
    id: "14",
    typeOfEvent: "Festival",
    nameOfEvent: "International Food Festival 2025",
    venueLocation: "Central Park Grounds",
    dateOfEvent: "2025-07-18",
    organizerName: "Chen Wei",
    teamsDepartmentsWorkprofile: "Festival Operations, Vendor Coordination, Marketing",
    targetAudience: "5000+ food lovers, families, tourists",
    theme: "Flavors of the World - A Culinary Journey",
    eventCompany: "Global Food Events Ltd",
    sponsors: "Food Brands, Tourism Board, Restaurant Associations",
    vendors: "50+ Food Stalls, Beverage Suppliers, Entertainment",
    manpowerRequired: "80 staff, 40 volunteers, 25 security, 15 cleaners",
    logisticsServiceProvider: "Festival Logistics International",
    miscellaneous: "Cooking demonstrations, Live music, Kids zone, Cultural performances",
    mediaPhotos: "Food photography, Vendor coverage, Crowd atmosphere",
    mediaVideos: "Festival highlights, Chef interviews, Social media content",
  },
  {
    id: "15",
    typeOfEvent: "Charity Event",
    nameOfEvent: "Hope for Children Gala 2025",
    venueLocation: "Grand Ballroom, Luxury Hotel",
    dateOfEvent: "2025-12-05",
    organizerName: "Amara Okafor",
    teamsDepartmentsWorkprofile: "Fundraising Team, Event Coordination, Volunteer Management",
    targetAudience: "400 philanthropists, donors, community leaders",
    theme: "Building Brighter Futures Together",
    eventCompany: "Hope Foundation Africa",
    sponsors: "Corporate Donors, Family Foundations, NGO Partners",
    vendors: "Premium Catering, Event Decor, Entertainment Services",
    manpowerRequired: "40 staff, 20 volunteers, 15 servers",
    logisticsServiceProvider: "Charity Events Logistics",
    miscellaneous: "Silent auction, Live performances, Donation pledges, VIP reception",
    mediaPhotos: "Gala photography, Donor recognition, Impact stories",
    mediaVideos: "Event highlights, Testimonials, Thank you video",
  },
  {
    id: "16",
    typeOfEvent: "Corporate",
    nameOfEvent: "Startup Pitch Competition 2025",
    venueLocation: "Innovation Theater, Business District",
    dateOfEvent: "2025-10-10",
    organizerName: "Carlos Rivera",
    teamsDepartmentsWorkprofile: "Business Development, Judging Panel, Marketing Team",
    targetAudience: "300 entrepreneurs, investors, business mentors",
    theme: "Innovation & Entrepreneurship Excellence",
    eventCompany: "Startup Accelerator Spain",
    sponsors: "Venture Capital Firms, Banks, Tech Companies",
    vendors: "AV Equipment, Stage Design, Catering",
    manpowerRequired: "25 staff, 10 judges, 8 tech support",
    logisticsServiceProvider: "Business Events Logistics",
    miscellaneous: "Pitch sessions, Networking mixer, Award ceremony, Mentorship sessions",
    mediaPhotos: "Pitch presentations, Award ceremony, Networking moments",
    mediaVideos: "Competition highlights, Winner interviews, Promotional content",
  },
];

export default function Directory() {
  // Fetch entries from API with auto-refresh every 10 seconds
  const { data: entriesResponse, isLoading } = useQuery({
    queryKey: ['directory-entries'],
    queryFn: async () => {
      return apiClient.getDirectoryEntries();
    },
    refetchInterval: 10000, // 10 seconds
  });

  const entries = entriesResponse?.data || [];

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentViewEntry, setCurrentViewEntry] = useState<DirectoryEntry>(defaultEntry);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = (entry.nameOfEvent || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (entry.organizerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (entry.venueLocation || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || entry.typeOfEvent === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [entries, searchQuery, filterCategory]);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEntries.slice(startIndex, endIndex);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading directory events...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory]);

  // Remove localStorage saves - we're using API now
  useEffect(() => {
    // Removed localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const openViewDialog = (entry: DirectoryEntry) => {
    setCurrentViewEntry(entry);
    setIsViewOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getGradientForIndex = (index: number) => {
    return eventBannerGradient;
  };

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return entries.filter(entry => new Date(entry.dateOfEvent) >= today).length;
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Browse all upcoming events
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Total Events</p>
                <p className="text-2xl font-bold text-foreground mt-1">{entries.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Upcoming Events</p>
                <p className="text-2xl font-bold text-foreground mt-1">{upcomingEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Event Types</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {new Set(entries.map(e => e.typeOfEvent)).size}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Organizers</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {new Set(entries.map(e => e.organizerName)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, organizers, or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-56 h-10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {eventTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Event Cards Grid */}
      {filteredEntries.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-12 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No events match your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEntries.map((entry, index) => (
            <Card 
              key={entry.id} 
              className="group border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => openViewDialog(entry)}
            >
              {/* Banner with Dark Blue to Black Gradient */}
              <div className={`relative h-48 bg-gradient-to-br ${eventBannerGradient}`}>
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-white/70" />
                </div>
                
                {/* Event Type Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/95 text-foreground border-0 shadow-md font-semibold text-xs">
                    {entry.typeOfEvent}
                  </Badge>
                </div>

                {/* Organised By - Bottom Left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <User className="h-3 w-3 text-white" />
                  <span className="text-white text-xs font-medium">
                    Organised by {entry.organizerName}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Event Name */}
                  <h3 className="font-bold text-base text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
                    {entry.nameOfEvent}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate text-xs">
                        {new Date(entry.dateOfEvent).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate text-xs">{entry.venueLocation}</span>
          </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate text-xs">{entry.targetAudience}</span>
              </div>
            </div>

                  {/* Theme */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      <span className="font-semibold">Theme:</span> {entry.theme}
                    </p>
                  </div>

                  {/* View Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 hover:bg-primary hover:text-white transition-all text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewDialog(entry);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
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
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* View Event Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">{currentViewEntry.nameOfEvent}</DialogTitle>
            <DialogDescription className="text-sm mt-1">{currentViewEntry.typeOfEvent}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Event Banner */}
            <div className={`relative h-72 rounded-lg overflow-hidden bg-gradient-to-br ${eventBannerGradient}`}>
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-24 w-24 text-white/70" />
                </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-white text-foreground shadow-lg text-sm font-bold px-4 py-2">
                  {currentViewEntry.typeOfEvent}
                </Badge>
                </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <User className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">
                  Organised by {currentViewEntry.organizerName}
                </span>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Calendar className="h-4 w-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Date of Event</p>
                  </div>
                  <p className="font-bold text-sm text-foreground">
                    {new Date(currentViewEntry.dateOfEvent).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <MapPin className="h-4 w-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Venue/Location</p>
                </div>
                  <p className="font-semibold text-sm text-foreground">{currentViewEntry.venueLocation}</p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Users className="h-4 w-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Target Audience</p>
                </div>
                  <p className="font-semibold text-sm text-foreground">{currentViewEntry.targetAudience}</p>
                </CardContent>
              </Card>
                </div>

            {/* Theme */}
            <Card className="border border-border bg-blue-50">
              <CardContent className="p-5">
                <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground mb-2">Theme</h3>
                <p className="text-base font-semibold text-foreground">{currentViewEntry.theme}</p>
              </CardContent>
            </Card>

            {/* Teams/Departments/Workprofile */}
            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">Teams/Departments/Workprofile</h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{currentViewEntry.teamsDepartmentsWorkprofile || "N/A"}</p>
              </CardContent>
            </Card>

            {/* Event Company & Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Event Company</h3>
                </div>
                  <p className="text-sm font-medium text-foreground">{currentViewEntry.eventCompany || "N/A"}</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Logistics Service Provider</h3>
                </div>
                  <p className="text-sm font-medium text-foreground">{currentViewEntry.logisticsServiceProvider || "N/A"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Manpower Required */}
            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Manpower Required</h3>
                </div>
                <p className="text-sm text-foreground">{currentViewEntry.manpowerRequired || "N/A"}</p>
              </CardContent>
            </Card>

            {/* Sponsors & Vendors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Sponsors</h3>
                </div>
                  <p className="text-sm text-foreground leading-relaxed">{currentViewEntry.sponsors || "N/A"}</p>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Vendors</h3>
                </div>
                  <p className="text-sm text-foreground leading-relaxed">{currentViewEntry.vendors || "N/A"}</p>
                </CardContent>
              </Card>
                </div>

            {/* Miscellaneous */}
            {currentViewEntry.miscellaneous && (
              <Card className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground">Miscellaneous</h3>
                </div>
                  <p className="text-sm text-foreground leading-relaxed">{currentViewEntry.miscellaneous}</p>
                </CardContent>
              </Card>
            )}

            {/* Media - Photos and Videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border bg-purple-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-foreground">Media - Photos</h3>
                      </div>
                  <p className="text-xs text-foreground leading-relaxed">{currentViewEntry.mediaPhotos || "No photos added"}</p>
                    </CardContent>
                  </Card>

              <Card className="border border-border bg-purple-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-xs uppercase tracking-wide text-foreground">Media - Videos/Reels</h3>
                      </div>
                  <p className="text-xs text-foreground leading-relaxed">{currentViewEntry.mediaVideos || "No videos added"}</p>
                    </CardContent>
                  </Card>
              </div>
          </div>

          <DialogFooter className="mt-6">
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
