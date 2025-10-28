import { useState, useEffect, useCallback } from 'react';
import { LocalStorage, STORAGE_KEYS, Field, EventType, Vendor, ContentPage, MediaItem, NewsItem, Student } from '@/lib/storage';

// Generic hook for local data management
function useLocalData<T extends { id: number }>(key: string, defaultValue: T[]) {
  const [data, setData] = useState<T[]>(() => {
    const stored = LocalStorage.getItem(key, []);
    return stored.length >= defaultValue.length ? stored : defaultValue;
  });

  useEffect(() => {
    LocalStorage.setItem(key, data);
  }, [key, data]);

  const add = useCallback((item: Omit<T, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now() + Math.random(), // Simple ID generation
    } as T;
    setData(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const update = useCallback((id: number, updates: Partial<T>) => {
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const remove = useCallback((id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  const getById = useCallback((id: number) => {
    return data.find(item => item.id === id);
  }, [data]);

  return {
    data,
    setData,
    add,
    update,
    remove,
    getById,
  };
}

// Specific hooks for each data type
export function useFields() {
  const defaultValue: Field[] = [
    { id: 1, name: "Grand Ballroom", capacity: 500, location: "Downtown", status: "Active", bookings: 12 },
    { id: 2, name: "Garden Pavilion", capacity: 200, location: "Westside", status: "Active", bookings: 8 },
    { id: 3, name: "Conference Hall A", capacity: 150, location: "Business District", status: "Active", bookings: 15 },
    { id: 4, name: "Rooftop Terrace", capacity: 100, location: "Downtown", status: "Maintenance", bookings: 0 },
    { id: 5, name: "Banquet Hall", capacity: 300, location: "Eastside", status: "Active", bookings: 10 },
  ];

  return useLocalData<Field>(STORAGE_KEYS.FIELDS, defaultValue);
}

export function useEventTypes() {
  const defaultValue: EventType[] = [
    { id: 1, name: "Weddings", description: "Typical Indian or global wedding sequence", color: "bg-pink-500", events: 0, active: true, subEvents: ["Engagement Ceremony", "Mehendi", "Sangeet", "Wedding Ceremony", "Reception", "Bachelor / Bachelorette Party", "Haldi Ceremony"] },
    { id: 2, name: "Corporate", description: "Company or business-oriented events", color: "bg-blue-600", events: 0, active: true, subEvents: ["Product Launch", "Annual Day Celebration", "Corporate Party", "Team Building Activity", "Press Conference", "Business Dinner", "Award Ceremony"] },
    { id: 3, name: "Exhibition", description: "Industry or themed exhibitions", color: "bg-purple-600", events: 0, active: true, subEvents: ["Art Exhibition", "Product Expo", "Industrial Showcase", "Tech Expo", "Auto Show", "Real Estate Expo"] },
    { id: 4, name: "Birthday", description: "Based on age group or theme", color: "bg-yellow-500", events: 0, active: true, subEvents: ["Kids Birthday", "Teen Birthday", "Adult Birthday", "Surprise Party", "Themed Birthday Party"] },
    { id: 5, name: "Anniversary", description: "Milestone-based celebrations", color: "bg-red-500", events: 0, active: true, subEvents: ["Wedding Anniversary", "Company Anniversary", "Silver Jubilee", "Golden Jubilee", "Renewal of Vows"] },
    { id: 6, name: "Seminar / Conference", description: "Professional knowledge-sharing sessions", color: "bg-indigo-600", events: 0, active: true, subEvents: ["Educational Seminar", "Business Seminar", "Academic Conference", "Panel Discussion", "Workshop", "Training Session"] },
    { id: 7, name: "Educational", description: "School or college-based events", color: "bg-green-600", events: 0, active: true, subEvents: ["School Annual Day", "College Fest", "Convocation", "Debate / Quiz", "Cultural Night", "Science Fair"] },
    { id: 8, name: "Cultural / Festival", description: "Religious or seasonal celebrations", color: "bg-orange-600", events: 0, active: true, subEvents: ["Diwali Celebration", "Christmas Carnival", "Holi Party", "Eid Gathering", "Navratri / Garba Night", "New Year Party"] },
    { id: 9, name: "Concert / Artist", description: "Entertainment and performance events", color: "bg-rose-600", events: 0, active: true, subEvents: ["Music Concert", "DJ Night", "Comedy Show", "Live Band Performance", "Celebrity Appearance", "Open Mic Night"] },
    { id: 10, name: "Sports", description: "Sporting or competitive events", color: "bg-cyan-600", events: 0, active: true, subEvents: ["Cricket Match", "Football Tournament", "Marathon / Run", "Indoor Games Event", "E-sports Tournament", "Award Ceremony"] },
    { id: 11, name: "Charity", description: "Social cause–based gatherings", color: "bg-emerald-600", events: 0, active: true, subEvents: ["Fundraiser Gala", "Donation Drive", "Awareness Walk / Run", "Blood Donation Camp", "NGO Event"] },
    { id: 12, name: "Trade Shows", description: "B2B / B2C trade networking events", color: "bg-violet-600", events: 0, active: true, subEvents: ["Business Expo", "Startup Showcase", "Franchise Fair", "Industry Meet-up", "Vendor Fair"] },
    { id: 13, name: "Community Events", description: "Small-scale or local group gatherings", color: "bg-teal-600", events: 0, active: true, subEvents: ["Local Fair / Mela", "Religious Gathering", "Club Meetup", "Neighborhood Party", "Town Festival", "Social Meetup"] },
  ];

  return useLocalData<EventType>(STORAGE_KEYS.EVENT_TYPES, defaultValue);
}

export function useVendors() {
  const defaultValue: Vendor[] = [
    { id: 1, name: "Elite Catering", category: "Catering", contact: "+1 234 567 8900", email: "info@elitecatering.com", address: "123 Main St, New York, NY" },
    { id: 2, name: "Soundwave Audio", category: "Audio/Visual", contact: "+1 234 567 8901", email: "hello@soundwave.com", address: "456 Elm St, Los Angeles, CA" },
    { id: 3, name: "Floral Dreams", category: "Decoration", contact: "+1 234 567 8902", email: "contact@floraldreams.com", address: "789 Oak Ave, Chicago, IL" },
    { id: 4, name: "LightUp Productions", category: "Lighting", contact: "+1 234 567 8903", email: "info@lightup.com", address: "101 Pine Rd, Houston, TX" },
    { id: 5, name: "Perfect Photos Studio", category: "Photography", contact: "+1 234 567 8904", email: "book@perfectphotos.com", address: "202 Maple Ln, Phoenix, AZ" },
    { id: 6, name: "Transport Pro", category: "Transportation", contact: "+1 234 567 8905", email: "service@transportpro.com", address: "303 Cedar St, Philadelphia, PA" },
    { id: 7, name: "Event Masters", category: "Event Planning", contact: "+1 234 567 8906", email: "contact@eventmasters.com", address: "404 Birch Blvd, San Antonio, TX" },
    { id: 8, name: "Royal Decor", category: "Decoration", contact: "+1 234 567 8907", email: "info@royaldecor.com", address: "505 Spruce Way, San Diego, CA" },
    { id: 9, name: "Mega Sound", category: "Audio/Visual", contact: "+1 234 567 8908", email: "hello@megasound.com", address: "606 Willow Dr, Dallas, TX" },
    { id: 10, name: "Wedding Bells", category: "Photography", contact: "+1 234 567 8909", email: "book@weddingbells.com", address: "707 Ash St, San Jose, CA" },
    { id: 11, name: "Luxury Limos", category: "Transportation", contact: "+1 234 567 8910", email: "service@luxurylimos.com", address: "808 Poplar Ave, Austin, TX" },
    { id: 12, name: "Cake Creations", category: "Catering", contact: "+1 234 567 8911", email: "info@cakecreations.com", address: "909 Fir Ln, Jacksonville, FL" },
    { id: 13, name: "Stage Lights", category: "Lighting", contact: "+1 234 567 8912", email: "contact@stagelights.com", address: "1010 Redwood Rd, Fort Worth, TX" },
    { id: 14, name: "Video Pros", category: "Photography", contact: "+1 234 567 8913", email: "book@videopros.com", address: "1111 Sequoia St, Columbus, OH" },
    { id: 15, name: "Party Rentals", category: "Equipment", contact: "+1 234 567 8914", email: "rentals@partyrentals.com", address: "1212 Palm Dr, Charlotte, NC" },
    { id: 16, name: "DJ Beats", category: "Entertainment", contact: "+1 234 567 8915", email: "dj@djbeats.com", address: "1313 Magnolia Blvd, Indianapolis, IN" },
  ];

  const [data, setData] = useState<Vendor[]>(() => {
    const stored = LocalStorage.getItem(STORAGE_KEYS.VENDORS, []);
    const initialData = stored.length >= defaultValue.length ? stored : defaultValue;
    // Migrate to ensure address is present
    const migratedData = initialData.map(vendor => ({ ...vendor, address: vendor.address || '123 Default St, City, State' }));
    return migratedData;
  });

  useEffect(() => {
    LocalStorage.setItem(STORAGE_KEYS.VENDORS, data);
  }, [data]);

  const add = useCallback((item: Omit<Vendor, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now() + Math.random(),
    } as Vendor;
    setData(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const update = useCallback((id: number, updates: Partial<Vendor>) => {
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const remove = useCallback((id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  const getById = useCallback((id: number) => {
    return data.find(item => item.id === id);
  }, [data]);

  return {
    data,
    setData,
    add,
    update,
    remove,
    getById,
  };
}

export function useContentPages() {
  const defaultValue: ContentPage[] = [
    { id: 1, title: "Home Page", content: "Welcome to our event management platform...", status: "Published", lastModified: "2025-10-08", slug: "home" },
    { id: 2, title: "About Us", content: "Learn more about our company...", status: "Published", lastModified: "2025-10-07", slug: "about" },
    { id: 3, title: "Services", content: "Our comprehensive event services...", status: "Draft", lastModified: "2025-10-06", slug: "services" },
  ];

  return useLocalData<ContentPage>(STORAGE_KEYS.CONTENT_PAGES, defaultValue);
}

export function useMediaItems() {
  const defaultValue: MediaItem[] = [
    { id: 1, name: "event-banner.jpg", type: "Image", size: "2.4 MB", uploaded: "2025-10-08" },
    { id: 2, name: "venue-photo.png", type: "Image", size: "1.8 MB", uploaded: "2025-10-07" },
    { id: 3, name: "brochure.pdf", type: "Document", size: "3.2 MB", uploaded: "2025-10-06" },
  ];

  return useLocalData<MediaItem>(STORAGE_KEYS.MEDIA_ITEMS, defaultValue);
}

export function useNewsItems() {
  const defaultValue: NewsItem[] = [
    { id: 1, title: "New Event Venue Opens Downtown", content: "A new state-of-the-art venue has opened in the heart of downtown, featuring cutting-edge technology and modern design. This venue offers flexible spaces for various event types including weddings, corporate meetings, and exhibitions. With state-of-the-art audio-visual equipment and professional staff, it's set to become a premier destination for event organizers.", status: "Published", date: "2025-10-08", views: 1243 },
    { id: 2, title: "Top 10 Wedding Trends for 2025", content: "Discover the latest wedding trends that are shaping the industry in 2025. From sustainable practices to innovative decor ideas, couples are embracing new ways to celebrate their special day. Key trends include eco-friendly materials, personalized ceremonies, and interactive elements that engage guests throughout the celebration.", status: "Published", date: "2025-10-07", views: 2156 },
    { id: 3, title: "Corporate Events: Best Practices", content: "Learn about corporate event planning best practices that can elevate your company's image and achieve business objectives. Successful corporate events require careful planning, clear communication, and attention to detail. From venue selection to post-event follow-up, every aspect contributes to the overall success of the gathering.", status: "Draft", date: "2025-10-06", views: 0 },
    { id: 4, title: "Exhibition Planning Checklist", content: "Complete guide to exhibition planning with our comprehensive checklist. Whether you're organizing a trade show or product launch, proper preparation is key to success. This guide covers everything from booth design and logistics to marketing strategies and attendee engagement techniques that will make your exhibition memorable.", status: "Published", date: "2025-10-05", views: 876 },
    { id: 5, title: "Sustainable Event Management", content: "The future of event management lies in sustainability. Learn how to reduce environmental impact while creating memorable experiences. From waste reduction strategies to energy-efficient practices, discover practical ways to make your events more eco-friendly and cost-effective.", status: "Published", date: "2025-10-04", views: 543 },
    { id: 6, title: "Virtual Event Technology", content: "Virtual events are revolutionizing how we connect and engage audiences. Explore the latest technology trends in virtual event management, including interactive platforms, immersive experiences, and hybrid solutions that combine in-person and online elements for maximum reach and engagement.", status: "Draft", date: "2025-10-03", views: 234 },
  ];

  return useLocalData<NewsItem>(STORAGE_KEYS.NEWS_ITEMS, defaultValue);
}

export function useStudents() {
  const defaultValue: Student[] = [
    { id: 1, name: "Sarah Anderson", email: "sarah.anderson@eventmail.com", phone: "+1 555 101 2001", status: "Active", portfolioLink: "https://portfolio.sarahanderson.com", address: "New York, USA", organisation: "Marketing & Events Dept" },
    { id: 2, name: "Michael Chen", email: "michael.chen@eventmail.com", phone: "+1 555 102 2002", status: "Active", portfolioLink: "https://michaelchen.events", address: "San Francisco, USA", organisation: "Corporate Events Team" },
    { id: 3, name: "Emma Rodriguez", email: "emma.rodriguez@eventmail.com", phone: "+1 555 103 2003", status: "Active", portfolioLink: "https://emmarodriguez.events", address: "Miami, USA", organisation: "Festival & Entertainment" },
    { id: 4, name: "James Wilson", email: "james.wilson@eventmail.com", phone: "+1 555 104 2004", status: "Active", portfolioLink: "https://jameswilson.events", address: "Boston, USA", organisation: "Training & Development" },
    { id: 5, name: "Olivia Thompson", email: "olivia.thompson@eventmail.com", phone: "+1 555 105 2005", status: "Active", portfolioLink: "https://oliviathompson.com", address: "Chicago, USA", organisation: "Academic Affairs" },
    { id: 6, name: "Sophia Martinez", email: "sophia.martinez@eventmail.com", phone: "+1 555 106 2006", status: "Active", portfolioLink: "https://sophiamartinez.events", address: "Los Angeles, USA", organisation: "Fundraising & Events" },
    { id: 7, name: "Liam Johnson", email: "liam.johnson@eventmail.com", phone: "+1 555 107 2007", status: "Active", portfolioLink: "https://liamjohnson.events", address: "Seattle, USA", organisation: "Arts & Culture Dept" },
    { id: 8, name: "Noah Brown", email: "noah.brown@eventmail.com", phone: "+1 555 108 2008", status: "Active", portfolioLink: "https://noahbrown.events", address: "Austin, USA", organisation: "Sports & Athletics" },
    { id: 9, name: "Jennifer Williams", email: "jennifer.williams@eventmail.com", phone: "+1 555 109 2009", status: "Active", portfolioLink: "https://jenniferwilliams.com", address: "Dallas, USA", organisation: "Tech & Innovation" },
    { id: 10, name: "Alexandra Kim", email: "alexandra.kim@eventmail.com", phone: "+1 555 110 2010", status: "Active", portfolioLink: "https://alexandrakim.events", address: "Portland, USA", organisation: "Wedding & Celebrations" },
    { id: 11, name: "Marcus Rodriguez", email: "marcus.rodriguez@eventmail.com", phone: "+1 555 111 2011", status: "Active", portfolioLink: "https://marcusrodriguez.events", address: "Denver, USA", organisation: "Music & Entertainment" },
    { id: 12, name: "Robert Chen", email: "robert.chen@eventmail.com", phone: "+1 555 112 2012", status: "Active", portfolioLink: "https://robertchen.events", address: "Philadelphia, USA", organisation: "Leadership Programs" },
    { id: 13, name: "Dr. Sarah Mitchell", email: "sarah.mitchell@eventmail.com", phone: "+1 555 113 2013", status: "Active", portfolioLink: "https://drsarahmitchell.com", address: "Boston, USA", organisation: "Research & Innovation" },
    { id: 14, name: "Maria Garcia", email: "maria.garcia@eventmail.com", phone: "+1 555 114 2014", status: "Active", portfolioLink: "https://mariagarcia.events", address: "Phoenix, USA", organisation: "Community Outreach" },
    { id: 15, name: "David Park", email: "david.park@eventmail.com", phone: "+1 555 115 2015", status: "Active", portfolioLink: "https://davidpark.events", address: "San Diego, USA", organisation: "Arts Foundation" },
    { id: 16, name: "Coach Michael Torres", email: "michael.torres@eventmail.com", phone: "+1 555 116 2016", status: "Active", portfolioLink: "https://coachtorres.events", address: "Atlanta, USA", organisation: "Athletics Department" },
    { id: 17, name: "Priya Sharma", email: "priya.sharma@eventmail.com", phone: "+91 98765 43210", status: "Active", portfolioLink: "https://priyasharma.in", address: "Mumbai, India", organisation: "Corporate Events India" },
    { id: 18, name: "Rahul Mehta", email: "rahul.mehta@eventmail.com", phone: "+91 99887 77665", status: "Active", portfolioLink: "https://rahulmehta.events", address: "Delhi, India", organisation: "Wedding Planners" },
    { id: 19, name: "Aiko Tanaka", email: "aiko.tanaka@eventmail.com", phone: "+81 90 1234 5678", status: "Active", portfolioLink: "https://aikotanaka.jp", address: "Tokyo, Japan", organisation: "Tokyo Event Creators" },
    { id: 20, name: "Isabella Rossi", email: "isabella.rossi@eventmail.com", phone: "+39 333 123 4567", status: "Active", portfolioLink: "https://isabellarossi.it", address: "Rome, Italy", organisation: "Italian Event Designers" },
    { id: 21, name: "Mohammed Ali", email: "mohammed.ali@eventmail.com", phone: "+971 50 123 4567", status: "Inactive", portfolioLink: "https://ali-organiser.com", address: "Dubai, UAE", organisation: "Dubai Expo Team" },
    { id: 22, name: "Lucas Martin", email: "lucas.martin@eventmail.com", phone: "+33 6 12 34 56 78", status: "Active", portfolioLink: "https://lucasmartin.fr", address: "Paris, France", organisation: "Paris Event Designers" },
    { id: 23, name: "Chen Wei", email: "chen.wei@eventmail.com", phone: "+86 138 1234 5678", status: "Active", portfolioLink: "https://chenwei.cn", address: "Beijing, China", organisation: "Beijing Event Experts" },
    { id: 24, name: "Amara Okafor", email: "amara.okafor@eventmail.com", phone: "+234 701 234 5678", status: "Active", portfolioLink: "https://amaraokafor.ng", address: "Lagos, Nigeria", organisation: "Lagos Event Pros" },
    { id: 25, name: "Carlos Rivera", email: "carlos.rivera@eventmail.com", phone: "+34 600 123 456", status: "Active", portfolioLink: "https://carlosrivera.events", address: "Madrid, Spain", organisation: "Madrid Event Planners" },
  ];

  return useLocalData<Student>(STORAGE_KEYS.STUDENTS, defaultValue);
}
