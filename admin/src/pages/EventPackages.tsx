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
import { Plus, Search, Filter, Calendar, Users, MapPin, Eye, User, Building, Award, Briefcase, Truck, FileText, Image as ImageIcon, Video, CheckCircle } from "lucide-react";

interface EventPackage {
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
  successMetrics: string;
  totalAttended: string;
  feedback: string;
  rating: string;
}

const STORAGE_KEY = "admin_eve_packages";

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

// Consistent gradient for all events - Dark Blue to Black
const eventBannerGradient = "from-blue-900 via-blue-950 to-black";

const defaultEntry: EventPackage = {
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
  successMetrics: "",
  totalAttended: "",
  feedback: "",
  rating: "5",
};

const completedEvents: EventPackage[] = [
  {
    id: "1",
    typeOfEvent: "Conference",
    nameOfEvent: "Tech Innovation Summit 2023",
    venueLocation: "International Convention Center, Tech Park",
    dateOfEvent: "2023-11-10",
    organizerName: "Jennifer Williams",
    teamsDepartmentsWorkprofile: "Tech Team, Marketing Team, Logistics Team, Speaker Management, Registration Team",
    targetAudience: "650 tech professionals, developers, CTOs, startup founders, investors",
    theme: "AI & Cloud Revolution - Building Tomorrow's Tech",
    eventCompany: "TechEvents Global Inc.",
    sponsors: "Microsoft, AWS, Google Cloud, IBM, Oracle, Salesforce",
    vendors: "Premium AV Solutions, Stage Design Masters, Event Tech Rentals, Catering Excellence",
    manpowerRequired: "60 staff members, 25 volunteers, 12 tech support specialists",
    logisticsServiceProvider: "Swift Event Logistics & Management",
    miscellaneous: "VIP lounge with private meetings, Speaker green rooms, Live Q&A sessions, Product demo booths, Networking reception",
    mediaPhotos: "500+ professional event photos, Speaker headshots, Booth coverage, Networking sessions, Award ceremony",
    mediaVideos: "Full event live stream (50K+ views), All session recordings, Highlights reel (2.5M views), Speaker interviews, Attendee testimonials",
    successMetrics: "650 attendees (130% of target), 95% satisfaction rate, 12 keynote sessions, 25 sponsor activations, Generated $2M in partnerships",
    totalAttended: "650 professionals",
    feedback: "Outstanding event organization, Excellent speaker lineup, Great networking opportunities, Professional execution",
    rating: "4.8",
  },
  {
    id: "2",
    typeOfEvent: "Wedding",
    nameOfEvent: "Royal Garden Wedding - Johnson & Smith",
    venueLocation: "Luxury Garden Estate, Hillside Resort",
    dateOfEvent: "2023-09-23",
    organizerName: "Alexandra Kim",
    teamsDepartmentsWorkprofile: "Wedding Planning Team, Decoration Team, Catering Team, Photography Team, Guest Services",
    targetAudience: "250 wedding guests - family members, close friends, colleagues",
    theme: "Enchanted Garden Romance with Royal Elegance",
    eventCompany: "Elegant Weddings & Events Co.",
    sponsors: "Luxury Bridal House, Premium Jewelry Studio, Wedding Magazine Partnership",
    vendors: "Royal Floral Designs, Gourmet Catering Excellence, Symphony Orchestra, Custom Cake Studio",
    manpowerRequired: "35 staff members, 18 professional servers, 6 valet attendants, 4 coordinators",
    logisticsServiceProvider: "Premium Wedding Logistics",
    miscellaneous: "Champagne welcome, Children's activity corner, Custom wedding favors, Fireworks finale, Late-night snack bar",
    mediaPhotos: "800+ wedding photos including ceremony, reception, portraits, candid moments, detail shots",
    mediaVideos: "Full ceremony & reception videography (4K), Cinematic highlight film, Drone aerial footage, Photo booth videos, Same-day edit screening",
    successMetrics: "Perfect weather, Zero delays, 100% guest satisfaction, Viral social media posts (500K+ engagements)",
    totalAttended: "250 guests",
    feedback: "Absolutely magical wedding, Perfect execution, Beautiful decorations, Exceptional service, Memorable experience",
    rating: "5.0",
  },
  {
    id: "3",
    typeOfEvent: "Festival",
    nameOfEvent: "Summer Beats Music Festival 2023",
    venueLocation: "Riverfront Park Amphitheater, Waterfront District",
    dateOfEvent: "2023-07-15",
    organizerName: "Marcus Rodriguez",
    teamsDepartmentsWorkprofile: "Entertainment Booking Team, Logistics Coordination, Security Management, Marketing & PR, Artist Relations, Food & Beverage",
    targetAudience: "3500+ music lovers, festival enthusiasts aged 18-50, families",
    theme: "Summer Vibes - Music, Food & Fun Under the Stars",
    eventCompany: "Festival Productions International",
    sponsors: "Spotify, Red Bull, Corona, Bose, Local Radio Stations, Music Brands",
    vendors: "MegaStage Builders, ProSound Systems, Gourmet Food Trucks, Craft Beer Suppliers, Merchandise Vendors",
    manpowerRequired: "120 crew members, 60 security personnel, 40 volunteers, 20 medical staff, 15 stage crew",
    logisticsServiceProvider: "Major Events Logistics & Transport",
    miscellaneous: "3 stages with 40+ artists, Craft beer garden, Food truck village, Art installations, Merchandise marketplace, VIP lounge area, Camping options",
    mediaPhotos: "1000+ concert photos, Artist backstage moments, Crowd atmosphere shots, Sponsor brand activations, Aerial festival shots",
    mediaVideos: "Live stream (100K+ concurrent viewers), Full artist performances, Festival recap video (5M+ views), Artist interviews, Behind-the-scenes content",
    successMetrics: "3500 tickets sold out, 40 performing artists, 15 food vendors, $450K revenue, 98% attendee satisfaction, Media reach 10M+",
    totalAttended: "3500 attendees",
    feedback: "Amazing artist lineup, Well-organized, Great atmosphere, Excellent food options, Best summer festival",
    rating: "4.7",
  },
  {
    id: "4",
    typeOfEvent: "Corporate",
    nameOfEvent: "Annual Leadership Excellence Summit",
    venueLocation: "Executive Conference Center, Business Bay",
    dateOfEvent: "2023-10-12",
    organizerName: "Robert Chen",
    teamsDepartmentsWorkprofile: "Training & Development Team, Content Creation Team, HR Department, Technical Support",
    targetAudience: "200 C-level executives, VPs, senior managers from Fortune 500 companies",
    theme: "Leadership in Digital Transformation Era",
    eventCompany: "Corporate Excellence Institute",
    sponsors: "McKinsey & Company, Harvard Business School, Leadership Foundations, Tech Giants",
    vendors: "Executive Training Materials, Premium Tech Equipment, Luxury Catering, Branded Merchandise",
    manpowerRequired: "12 world-class facilitators, 8 support staff, 5 tech coordinators, 6 hospitality team",
    logisticsServiceProvider: "Executive Events Logistics",
    miscellaneous: "Personalized certificates, Executive networking dinner, One-on-one coaching sessions, Digital resources library, Follow-up mentorship program",
    mediaPhotos: "Professional session photography, Executive portraits, Group networking photos, Certificate presentations, Speaker moments",
    mediaVideos: "Conference session recordings (exclusive access), Key insights compilation, Executive testimonials, Networking highlights",
    successMetrics: "200 executives attended, 95% would recommend, 15 fortune 500 companies represented, $180K in follow-up consultations booked",
    totalAttended: "200 executives",
    feedback: "Transformational content, World-class speakers, Valuable networking, Professional organization, Exceeded expectations",
    rating: "4.9",
  },
  {
    id: "5",
    typeOfEvent: "Exhibition",
    nameOfEvent: "Innovation & Technology Expo 2023",
    venueLocation: "Metropolitan Exhibition Center, Halls 1-4",
    dateOfEvent: "2023-08-20",
    organizerName: "Dr. Sarah Mitchell",
    teamsDepartmentsWorkprofile: "Academic Coordination, Student Leadership, Research Showcase Team, IT Infrastructure, Visitor Services",
    targetAudience: "2500+ students, researchers, industry professionals, investors, general public",
    theme: "Future Innovation - Science Meets Technology",
    eventCompany: "Innovation Expo Organizers Ltd.",
    sponsors: "NASA, SpaceX, Tech Corporations, University Research Grants, Innovation Foundations",
    vendors: "Modular Exhibition Booths, Interactive Display Tech, Professional Lighting, Audio Systems, Demo Equipment",
    manpowerRequired: "50 staff coordinators, 150 student volunteers, 30 technical support, 20 security personnel",
    logisticsServiceProvider: "Exhibition Logistics Specialists",
    miscellaneous: "100+ innovation projects displayed, Startup pitch competition, Industry panel discussions, Career networking fair, Innovation awards ceremony",
    mediaPhotos: "1200+ exhibition photos, Project demonstrations, Award ceremonies, Industry interactions, Innovation showcase",
    mediaVideos: "Live stream coverage (75K+ viewers), Project demo videos, Researcher presentations, Winner interviews, Virtual exhibition tour",
    successMetrics: "2500+ visitors, 100 projects showcased, 25 companies recruited students, $500K in research grants awarded, Featured in 15 media outlets",
    totalAttended: "2500 visitors",
    feedback: "Impressive innovation showcase, Well-organized, Inspiring projects, Great for networking, Educational and engaging",
    rating: "4.6",
  },
  {
    id: "6",
    typeOfEvent: "Gala",
    nameOfEvent: "Hope Foundation Charity Gala 2023",
    venueLocation: "Grand Imperial Ballroom, Downtown Plaza",
    dateOfEvent: "2023-10-28",
    organizerName: "Maria Garcia",
    teamsDepartmentsWorkprofile: "Fundraising Strategy Team, Event Planning, Donor Relations, Volunteer Coordination, Entertainment Management",
    targetAudience: "500 philanthropists, corporate donors, community leaders, celebrities, media personalities",
    theme: "Together for Change - Building Brighter Futures",
    eventCompany: "Hope Foundation Events Division",
    sponsors: "Major Corporations, Family Foundations, High-Net-Worth Donors, Media Sponsors, Luxury Brands",
    vendors: "5-Star Catering, Premium Event Decor, Professional Entertainment, Luxury Rentals, Floral Designers",
    manpowerRequired: "45 event staff, 25 volunteers, 15 professional servers, 8 registration team, 10 valet service",
    logisticsServiceProvider: "Luxury Events Logistics",
    miscellaneous: "Live auction (30 premium items), Silent auction, Celebrity performances, Keynote by renowned philanthropist, VIP champagne reception, Donation matching program",
    mediaPhotos: "Professional gala photography, Red carpet arrivals, Auction moments, Donor recognition, Celebrity appearances, Awards presentation",
    mediaVideos: "Event highlight reel, Celebrity messages, Beneficiary testimonials, Live social media streaming, Thank you video for all donors",
    successMetrics: "$850,000 raised (170% of goal), 500 attendees, 100% of auction items sold, Featured on national news, 30 new recurring donors",
    totalAttended: "500 guests",
    feedback: "Incredibly moving event, Exceptional organization, Beautiful venue, Inspiring cause, Professional execution",
    rating: "4.9",
  },
  {
    id: "7",
    typeOfEvent: "Concert",
    nameOfEvent: "Summer Symphony Orchestra Concert",
    venueLocation: "City Center Performance Hall",
    dateOfEvent: "2023-06-18",
    organizerName: "David Park",
    teamsDepartmentsWorkprofile: "Music Direction Team, Event Coordination, Ticketing & Sales, Marketing, Hospitality Services",
    targetAudience: "1200 classical music enthusiasts, season ticket holders, families, students",
    theme: "Classical Masterpieces - A Journey Through Time",
    eventCompany: "City Symphony Foundation",
    sponsors: "Arts Council, Corporate Sponsors, Music Foundations, Cultural Patrons",
    vendors: "Concert Staging, Professional Audio Systems, Program Printing, Reception Catering",
    manpowerRequired: "100 orchestra members, 20 event staff, 15 ushers, 8 hospitality team",
    logisticsServiceProvider: "Arts Events Logistics",
    miscellaneous: "Pre-concert talk by conductor, Meet the artists reception, Program notes and commentary, Special student pricing, Post-concert autograph session",
    mediaPhotos: "Professional concert photography, Orchestra performance shots, Conductor moments, Audience engagement, Behind-the-scenes rehearsal",
    mediaVideos: "Full concert recording, Highlight reel, Conductor interview, Musician spotlights, Patron testimonials",
    successMetrics: "1200 seats sold (100% capacity), Standing ovation, 50 new season subscriptions, $125K revenue, Excellent reviews",
    totalAttended: "1200 attendees",
    feedback: "Breathtaking performance, Perfect acoustics, World-class musicians, Moving experience, Exceptional program selection",
    rating: "5.0",
  },
  {
    id: "8",
    typeOfEvent: "Sports Event",
    nameOfEvent: "National Marathon Championship 2023",
    venueLocation: "Downtown to Riverside - 26.2 mile IAAF certified course",
    dateOfEvent: "2023-05-14",
    organizerName: "Coach Michael Torres",
    teamsDepartmentsWorkprofile: "Sports Coordination, Medical & Safety Team, Volunteer Management, Route Security, Timing Technology, Athlete Services",
    targetAudience: "8000 marathon runners (elite to amateur), 25,000+ spectators, families, fitness community",
    theme: "Run Your Best - Achieve Your Dreams",
    eventCompany: "National Athletics Federation",
    sponsors: "Nike, Gatorade, Garmin, Sports Medicine Centers, Energy Bar Brands, Running Magazines",
    vendors: "Professional Timing Systems, Medical Support Services, Hydration Stations, Portable Facilities, Medal & Trophy Supplier",
    manpowerRequired: "300 trained volunteers, 60 medical professionals (EMTs, doctors, nurses), 100 route marshals, 40 registration staff, 30 finish line crew",
    logisticsServiceProvider: "Marathon Events Logistics International",
    miscellaneous: "Elite athlete prize money, Age group awards, Finisher medals for all, Post-race recovery area, Pasta party night before, Expo with 50+ vendors, Live tracking app",
    mediaPhotos: "2000+ race photos, Start line energy, Mile markers, Finish line celebrations, Medal ceremonies, Elite athlete coverage, Spectator moments",
    mediaVideos: "Live broadcast on Sports Network (200K+ viewers), Drone coverage of full course, Finish line streaming, Winner interviews, Race highlight documentary, Training journey stories",
    successMetrics: "8000 registered runners, 7850 finishers (98%), New course record set, $950K raised for charity, Zero major incidents, Featured in Runner's World magazine",
    totalAttended: "8000 runners, 25,000+ spectators",
    feedback: "Perfectly organized, Excellent course support, Great atmosphere, Well-marked route, Amazing volunteer support",
    rating: "4.8",
  },
  {
    id: "9",
    typeOfEvent: "Wedding",
    nameOfEvent: "Elegant Beach Wedding 2024",
    venueLocation: "Seaside Resort, Coastal District",
    dateOfEvent: "2024-06-22",
    organizerName: "Alexandra Kim",
    teamsDepartmentsWorkprofile: "Wedding Planning, Beach Setup, Catering, Photography & Videography",
    targetAudience: "180 guests including family and close friends",
    theme: "Romantic Sunset Beach Wedding",
    eventCompany: "Elegant Weddings & Events Co.",
    sponsors: "Bridal Boutique, Jewelry Designers, Wedding Magazine",
    vendors: "Beach Setup Specialists, Gourmet Catering, Live Musicians, Professional Photographers",
    manpowerRequired: "25 staff, 12 servers, 4 valets, 3 coordinators",
    logisticsServiceProvider: "Coastal Wedding Logistics",
    miscellaneous: "Beach ceremony setup, Cocktail hour, Reception dinner, Dancing under the stars, Wedding favors",
    mediaPhotos: "600+ wedding photos, Sunset ceremony shots, Reception moments, Couple portraits, Guest candids",
    mediaVideos: "Full wedding film (4K), Highlight reel (10 min), Drone beach footage, Ceremony & reception coverage",
    successMetrics: "Perfect weather, 180 guests attended, 100% positive feedback, Featured on wedding blog, Vendor referrals generated",
    totalAttended: "180 guests",
    feedback: "Perfect beach wedding, Beautiful setup, Amazing food, Great coordination, Unforgettable experience",
    rating: "5.0",
  },
  {
    id: "10",
    typeOfEvent: "Corporate",
    nameOfEvent: "Annual Business Summit 2024",
    venueLocation: "Grand Hotel Conference Center",
    dateOfEvent: "2024-04-18",
    organizerName: "Michael Chen",
    teamsDepartmentsWorkprofile: "Event Management, Speaker Coordination, Marketing, Registration, Tech Support",
    targetAudience: "450 business professionals, executives, entrepreneurs",
    theme: "Innovation & Growth Strategies",
    eventCompany: "Corporate Excellence Institute",
    sponsors: "Fortune 500 Companies, Business Magazines, Tech Giants",
    vendors: "AV Equipment, Stage Design, Catering Services, Registration Systems",
    manpowerRequired: "40 staff, 15 volunteers, 10 tech support, 8 registration team",
    logisticsServiceProvider: "Corporate Event Solutions",
    miscellaneous: "Keynote speeches, Panel discussions, Networking sessions, Exhibition booths, Certificate distribution",
    mediaPhotos: "400+ event photos, Speaker presentations, Networking moments, Booth coverage",
    mediaVideos: "Full summit recording, Keynote highlights, Interview series, Social media clips",
    successMetrics: "450 attendees (110% of target), 92% satisfaction rate, 15 keynotes, $180K in partnerships",
    totalAttended: "450 professionals",
    feedback: "Excellent speakers, Great networking, Professional organization, Valuable insights, Highly recommended",
    rating: "4.7",
  },
  {
    id: "11",
    typeOfEvent: "Festival",
    nameOfEvent: "Spring Arts & Culture Festival 2024",
    venueLocation: "City Park & Cultural Center",
    dateOfEvent: "2024-05-10",
    organizerName: "Liam Johnson",
    teamsDepartmentsWorkprofile: "Arts Coordination, Vendor Management, Entertainment, Security, Marketing",
    targetAudience: "3000+ families, art enthusiasts, community members",
    theme: "Celebrating Arts, Culture & Community",
    eventCompany: "Cultural Arts Collective",
    sponsors: "Arts Council, Local Businesses, Cultural Foundations, Media Partners",
    vendors: "40 Art Vendors, Food Trucks, Entertainment Providers, Setup Equipment",
    manpowerRequired: "70 staff, 50 volunteers, 30 security personnel, 15 medical staff",
    logisticsServiceProvider: "Festival Events Logistics",
    miscellaneous: "Art exhibitions, Live performances, Food court, Kids activities, Art workshops, Cultural demonstrations",
    mediaPhotos: "800+ festival photos, Performance shots, Vendor coverage, Family moments, Art displays",
    mediaVideos: "Festival highlights (15 min), Performance recordings, Vendor interviews, Community testimonials",
    successMetrics: "3200 attendees, 40 vendors, 15 performances, $85K revenue, Zero incidents, Featured in local news",
    totalAttended: "3200 attendees",
    feedback: "Wonderful family event, Great variety, Well organized, Amazing performances, Community spirit",
    rating: "4.6",
  },
  {
    id: "12",
    typeOfEvent: "Workshop",
    nameOfEvent: "Professional Development Workshop Series 2024",
    venueLocation: "Business Training Center",
    dateOfEvent: "2024-03-15",
    organizerName: "James Wilson",
    teamsDepartmentsWorkprofile: "Training Team, Content Development, Participant Services, Logistics",
    targetAudience: "120 mid-level managers and team leaders",
    theme: "Leadership Excellence in Modern Workplace",
    eventCompany: "Executive Training Solutions",
    sponsors: "Management Consultancies, Business Schools, Corporate Sponsors",
    vendors: "Training Materials, Tech Equipment, Catering Services, Accommodation",
    manpowerRequired: "8 expert trainers, 6 support staff, 4 tech coordinators",
    logisticsServiceProvider: "Professional Development Logistics",
    miscellaneous: "Interactive sessions, Group activities, Case studies, Networking dinner, Certification",
    mediaPhotos: "Workshop documentation, Group activities, Certificate ceremony, Trainer portraits",
    mediaVideos: "Training highlights, Participant testimonials, Key takeaways compilation",
    successMetrics: "120 participants, 98% completion rate, 94% satisfaction, 40 companies represented, $75K revenue",
    totalAttended: "120 managers",
    feedback: "Transformational training, Practical insights, Excellent facilitators, Great networking, Highly valuable",
    rating: "4.8",
  },
  {
    id: "13",
    typeOfEvent: "Seminar",
    nameOfEvent: "Healthcare Innovation Summit 2024",
    venueLocation: "Medical College Auditorium",
    dateOfEvent: "2024-02-20",
    organizerName: "Dr. Sarah Mitchell",
    teamsDepartmentsWorkprofile: "Academic Committee, Research Team, Event Management, Medical Affairs",
    targetAudience: "500 healthcare professionals, researchers, medical students",
    theme: "Future of Healthcare - Technology & Innovation",
    eventCompany: "Innovation Expo Organizers Ltd.",
    sponsors: "Pharmaceutical Companies, Medical Device Manufacturers, Research Institutes",
    vendors: "Medical Exhibition Displays, AV Equipment, Conference Materials, Catering",
    manpowerRequired: "30 staff, 20 student volunteers, 15 technical support",
    logisticsServiceProvider: "Medical Events Logistics",
    miscellaneous: "Research presentations, Product demonstrations, CME credits, Poster sessions, Networking reception",
    mediaPhotos: "Conference photography, Speaker sessions, Exhibition coverage, Networking moments",
    mediaVideos: "Conference recordings, Research presentation highlights, Expert interviews",
    successMetrics: "520 attendees, 45 presentations, 25 exhibitors, 100% CME accreditation, Featured in medical journals",
    totalAttended: "520 professionals",
    feedback: "Cutting-edge content, Excellent speakers, Great networking, Well organized, Highly informative",
    rating: "4.7",
  },
  {
    id: "14",
    typeOfEvent: "Concert",
    nameOfEvent: "Rock Festival 2024",
    venueLocation: "Outdoor Amphitheater, Riverside",
    dateOfEvent: "2024-07-20",
    organizerName: "Marcus Rodriguez",
    teamsDepartmentsWorkprofile: "Entertainment Booking, Stage Production, Security, Vendor Coordination, Marketing",
    targetAudience: "4500 rock music fans, festival goers aged 18-50",
    theme: "Rock Legends Live - Summer Concert Series",
    eventCompany: "Festival Productions International",
    sponsors: "Music Brands, Beverage Companies, Radio Stations, Equipment Manufacturers",
    vendors: "Stage Builders, Sound Systems, Lighting Equipment, Food & Beverage, Merchandise",
    manpowerRequired: "100 crew, 60 security, 35 volunteers, 20 medical staff, 15 stage crew",
    logisticsServiceProvider: "Concert Events Logistics",
    miscellaneous: "5 bands performing, VIP area, Food court, Merchandise booths, Meet & greet sessions",
    mediaPhotos: "1200+ concert photos, Band performances, Crowd atmosphere, Backstage moments",
    mediaVideos: "Full concert recordings, Highlight reel (20 min), Band interviews, Fan reactions, Social media content",
    successMetrics: "4500 tickets sold out, 5 bands, $320K revenue, 96% satisfaction, Zero major incidents",
    totalAttended: "4500 attendees",
    feedback: "Amazing lineup, Great sound, Perfect venue, Well organized, Unforgettable concert",
    rating: "4.9",
  },
  {
    id: "15",
    typeOfEvent: "Exhibition",
    nameOfEvent: "Technology & Innovation Expo 2024",
    venueLocation: "Convention Center, Tech Park",
    dateOfEvent: "2024-09-05",
    organizerName: "Jennifer Williams",
    teamsDepartmentsWorkprofile: "Expo Management, Exhibitor Services, Marketing, Registration, Technical Support",
    targetAudience: "2800+ tech professionals, startups, investors, students",
    theme: "Shaping Tomorrow's Technology Today",
    eventCompany: "TechEvents Global Inc.",
    sponsors: "Tech Giants, Venture Capitalists, Innovation Funds, Tech Media",
    vendors: "Exhibition Booths, Demo Equipment, Registration Systems, Catering Services",
    manpowerRequired: "55 staff, 80 student volunteers, 25 technical support, 20 security",
    logisticsServiceProvider: "Tech Expo Logistics",
    miscellaneous: "120 exhibitors, Startup pitches, Product launches, Networking zones, Innovation awards",
    mediaPhotos: "900+ expo photos, Booth coverage, Product demos, Award ceremony, Networking sessions",
    mediaVideos: "Expo highlights, Product demos, Startup pitches, Expert panels, Attendee testimonials",
    successMetrics: "2850 attendees, 120 exhibitors, 25 startups pitched, $420K in deals, Featured in tech news",
    totalAttended: "2850 attendees",
    feedback: "Excellent expo, Great innovations, Perfect for networking, Well organized, Highly professional",
    rating: "4.8",
  },
];

export default function EventPackages() {
  const [entries, setEntries] = useState<EventPackage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed[0] && parsed[0].nameOfEvent) {
          return parsed;
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(completedEvents));
          return completedEvents;
        }
      } catch {
        return completedEvents;
      }
    }
    return completedEvents;
  });

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentViewEntry, setCurrentViewEntry] = useState<EventPackage>(defaultEntry);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = (entry.nameOfEvent || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (entry.organizerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (entry.venueLocation || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "All" || entry.typeOfEvent === filterType;
      return matchesSearch && matchesType;
    });
  }, [entries, searchQuery, filterType]);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEntries.slice(startIndex, endIndex);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const openViewDialog = (entry: EventPackage) => {
    setCurrentViewEntry(entry);
    setIsViewOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Packages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Completed events portfolio and success stories
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
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Avg Rating</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {entries.length > 0 ? (entries.reduce((sum, e) => sum + parseFloat(e.rating || "0"), 0) / entries.length).toFixed(1) : "0.0"}
                </p>
              </div>
              <Award className="h-8 w-8 text-primary" />
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
            placeholder="Search completed events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
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
          {paginatedEntries.map((entry) => (
            <Card 
              key={entry.id} 
              className="group border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => openViewDialog(entry)}
            >
              {/* Banner with Dark Blue to Black Gradient + Completed Badge */}
              <div className={`relative h-48 bg-gradient-to-br ${eventBannerGradient}`}>
                <div className="w-full h-full flex items-center justify-center">
                  <CheckCircle className="h-16 w-16 text-white/70" />
                </div>
                
                {/* Event Type Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/95 text-foreground border-0 shadow-md font-semibold text-xs">
                    {entry.typeOfEvent}
                  </Badge>
                </div>

                {/* Completed Badge - Top Left */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white border-0 shadow-md font-semibold text-xs">
                    ✓ Completed
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

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(parseFloat(entry.rating || "0")) ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-foreground">{entry.rating}</span>
                  </div>

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
                      <span className="truncate text-xs">{entry.totalAttended}</span>
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
                    View Package
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

      {/* View Event Package Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground pr-4">{currentViewEntry.nameOfEvent}</DialogTitle>
                <DialogDescription className="text-sm mt-1">{currentViewEntry.typeOfEvent}</DialogDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
                ✓ Completed Event
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Event Banner */}
            <div className={`relative h-72 rounded-lg overflow-hidden bg-gradient-to-br ${eventBannerGradient}`}>
              <div className="w-full h-full flex items-center justify-center">
                <CheckCircle className="h-24 w-24 text-white/70" />
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

            {/* Rating & Success */}
            <Card className="border border-border bg-green-50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide text-foreground mb-2">Event Rating</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-2xl ${i < Math.floor(parseFloat(currentViewEntry.rating || "0")) ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-3xl font-bold text-foreground">{currentViewEntry.rating}</span>
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                  </div>
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </CardContent>
            </Card>

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
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Total Attended</p>
                  </div>
                  <p className="font-semibold text-sm text-foreground">{currentViewEntry.totalAttended}</p>
                </CardContent>
              </Card>
            </div>

            {/* Success Metrics */}
            <Card className="border border-border bg-blue-50">
              <CardContent className="p-5">
                <h3 className="font-bold text-sm uppercase tracking-wide text-foreground mb-3">Success Metrics</h3>
                <p className="text-sm text-foreground leading-relaxed">{currentViewEntry.successMetrics || "N/A"}</p>
              </CardContent>
            </Card>

            {/* Theme & Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border">
                <CardContent className="p-5">
                  <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground mb-2">Theme</h3>
                  <p className="text-sm font-medium text-foreground">{currentViewEntry.theme}</p>
                </CardContent>
              </Card>
              <Card className="border border-border">
                <CardContent className="p-5">
                  <h3 className="font-bold text-xs uppercase tracking-wide text-muted-foreground mb-2">Target Audience</h3>
                  <p className="text-sm font-medium text-foreground">{currentViewEntry.targetAudience}</p>
                </CardContent>
              </Card>
            </div>

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

            {/* Feedback */}
            {currentViewEntry.feedback && (
              <Card className="border border-border bg-yellow-50">
                <CardContent className="p-5">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-foreground mb-3">Attendee Feedback</h3>
                  <p className="text-sm text-foreground leading-relaxed italic">"{currentViewEntry.feedback}"</p>
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

