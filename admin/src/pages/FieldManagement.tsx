import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, Search, MapPin, Phone, Building2, Users, Package, Truck, UtensilsCrossed, Shield, Gift, Music, Camera, Calendar, Plus, Edit2, Trash2, Save, X, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

const STORAGE_KEY = "admin_eve_providers";

const fieldCategories = [
	{ id: "Events", name: "Event Types", icon: Calendar, color: "text-purple-600" },
	{ id: "Venues", name: "Venues", icon: Building2, color: "text-blue-600" },
	{ id: "Logistics", name: "Logistics Service Providers", icon: Truck, color: "text-green-600" },
	{ id: "Catering", name: "Catering Service", icon: UtensilsCrossed, color: "text-orange-600" },
	{ id: "Security", name: "Security Agencies", icon: Shield, color: "text-red-600" },
	{ id: "Gifts", name: "Gift Shops", icon: Gift, color: "text-pink-600" },
	{ id: "DJ", name: "DJ Services", icon: Music, color: "text-purple-600" },
	{ id: "Photographers", name: "Photographers", icon: Camera, color: "text-indigo-600" },
];

const initialEventCategories = [
	{
		name: "Social Events",
		subEvents: [
			"Wedding",
			"Engagement Party",
			"Anniversary Celebration",
			"Birthday Party",
			"Baby Shower",
			"Housewarming",
			"Farewell Party",
			"Reunion",
			"Private Dinner / Gathering",
			"Naming Ceremony",
		],
	},
	{
		name: "Corporate Events",
		subEvents: [
			"Product Launch",
			"Annual Day Celebration",
			"Corporate Party",
			"Team Building Activity",
			"Seminar / Conference",
			"Workshop / Training",
			"Press Conference",
			"Award Ceremony",
			"Board Meeting / AGM",
			"Networking Event",
		],
	},
	{
		name: "Cultural Events",
		subEvents: [
			"Festival Celebration",
			"Music Concert",
			"Dance Show",
			"Theatre / Drama",
			"Fashion Show",
			"Art Exhibition",
			"Cultural Night",
			"Open Mic / Talent Show",
			"Film Premiere / Screening",
		],
	},
	{
		name: "Educational Events",
		subEvents: [
			"Annual Day",
			"College Fest / Cultural Fest",
			"Seminar / Symposium",
			"Workshop / Training Program",
			"Convocation Ceremony",
			"Science / Tech Exhibition",
			"Debate / Quiz Competition",
			"Orientation / Induction",
			"Parent-Teacher Meeting (PTM)",
		],
	},
	{
		name: "Public Events",
		subEvents: [
			"Trade Show / Expo",
			"Sports Event / Marathon",
			"Charity / Fundraiser",
			"Political Rally / Campaign",
			"Community Festival / Mela",
			"Food Festival",
			"Health Camp / Awareness Drive",
			"Public Concert / Fair",
			"Environmental Drive",
		],
	},
];

// Event types data for dropdowns
const eventTypesData = initialEventCategories;

// Event Types Dropdown Component
const EventTypesDropdown = ({ 
	selectedEventTypes, 
	onEventTypesChange, 
	selectedSubEventTypes, 
	onSubEventTypesChange,
	label = "Event Types Supported"
}: {
	selectedEventTypes: string[];
	onEventTypesChange: (types: string[]) => void;
	selectedSubEventTypes: string[];
	onSubEventTypesChange: (types: string[]) => void;
	label?: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
	const [isAddSubEventOpen, setIsAddSubEventOpen] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newSubEventName, setNewSubEventName] = useState("");
	const [targetCategoryForSubEvent, setTargetCategoryForSubEvent] = useState<string | null>(null);
	
	const handleEventTypeToggle = (eventType: string) => {
		const newTypes = selectedEventTypes.includes(eventType)
			? selectedEventTypes.filter(type => type !== eventType)
			: [...selectedEventTypes, eventType];
		onEventTypesChange(newTypes);
	};

	const handleSubEventTypeToggle = (subEventType: string) => {
		const newTypes = selectedSubEventTypes.includes(subEventType)
			? selectedSubEventTypes.filter(type => type !== subEventType)
			: [...selectedSubEventTypes, subEventType];
		onSubEventTypesChange(newTypes);
	};

	const handleAddCategory = () => {
		const name = newCategoryName.trim();
		if (!name) return;
		if (eventTypesData.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
		
		// Add to the global eventTypesData
		eventTypesData.push({ name, subEvents: [] });
		setNewCategoryName("");
		setIsAddCategoryOpen(false);
	};

	const handleAddSubEvent = () => {
		const name = newSubEventName.trim();
		if (!name || !targetCategoryForSubEvent) return;
		
		// Find the category and add the sub-event
		const category = eventTypesData.find(c => c.name === targetCategoryForSubEvent);
		if (category && !category.subEvents.includes(name)) {
			category.subEvents.push(name);
		}
		setNewSubEventName("");
		setTargetCategoryForSubEvent(null);
		setIsAddSubEventOpen(false);
	};

	// Get available sub-events based on selected event types
	const availableSubEvents = eventTypesData
		.filter(category => selectedEventTypes.includes(category.name))
		.flatMap(category => category.subEvents);

	return (
		<div className="space-y-4">
			<Label className="text-sm font-medium">{label}</Label>
			
			{/* Event Types Selection */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label className="text-xs text-muted-foreground">Main Event Categories</Label>
					<Button
						size="sm"
						variant="outline"
						className="h-6 px-2 text-xs"
						onClick={() => setIsAddCategoryOpen(true)}
					>
						<Plus className="h-3 w-3 mr-1" />
						Add Category
					</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
					{eventTypesData.map((category) => (
						<div key={category.name} className="flex items-center space-x-2">
							<Checkbox
								id={`event-${category.name}`}
								checked={selectedEventTypes.includes(category.name)}
								onCheckedChange={() => handleEventTypeToggle(category.name)}
							/>
							<Label htmlFor={`event-${category.name}`} className="text-sm">
								{category.name}
							</Label>
						</div>
					))}
				</div>
			</div>

			{/* Sub Event Types Selection */}
			{selectedEventTypes.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-xs text-muted-foreground">Specific Event Types</Label>
						<Button
							size="sm"
							variant="outline"
							className="h-6 px-2 text-xs"
							onClick={() => setIsAddSubEventOpen(true)}
						>
							<Plus className="h-3 w-3 mr-1" />
							Add Sub-Event
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
						{availableSubEvents.map((subEvent) => (
							<div key={subEvent} className="flex items-center space-x-2">
								<Checkbox
									id={`subevent-${subEvent}`}
									checked={selectedSubEventTypes.includes(subEvent)}
									onCheckedChange={() => handleSubEventTypeToggle(subEvent)}
								/>
								<Label htmlFor={`subevent-${subEvent}`} className="text-sm">
									{subEvent}
								</Label>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Selected Summary */}
			{(selectedEventTypes.length > 0 || selectedSubEventTypes.length > 0) && (
				<div className="text-xs text-muted-foreground">
					Selected: {selectedEventTypes.length} categories, {selectedSubEventTypes.length} specific types
				</div>
			)}

			{/* Add Category Dialog */}
			<Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add New Event Category</DialogTitle>
						<DialogDescription>Create a new event category for the venue.</DialogDescription>
					</DialogHeader>
					<div className="space-y-3">
						<Label htmlFor="categoryName">Category Name</Label>
						<Input 
							id="categoryName" 
							value={newCategoryName} 
							onChange={(e) => setNewCategoryName(e.target.value)} 
							placeholder="e.g., Sports Events" 
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
						<Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>Add Category</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add Sub-Event Dialog */}
			<Dialog open={isAddSubEventOpen} onOpenChange={setIsAddSubEventOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add New Sub-Event</DialogTitle>
						<DialogDescription>Add a new sub-event to an existing category.</DialogDescription>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-2">
							<Label htmlFor="categorySelect">Select Category</Label>
							<Select value={targetCategoryForSubEvent || ""} onValueChange={setTargetCategoryForSubEvent}>
								<SelectTrigger>
									<SelectValue placeholder="Choose a category" />
								</SelectTrigger>
								<SelectContent>
									{eventTypesData.map((category) => (
										<SelectItem key={category.name} value={category.name}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="subEventName">Sub-Event Name</Label>
							<Input 
								id="subEventName" 
								value={newSubEventName} 
								onChange={(e) => setNewSubEventName(e.target.value)} 
								placeholder="e.g., Football Match" 
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddSubEventOpen(false)}>Cancel</Button>
						<Button 
							onClick={handleAddSubEvent} 
							disabled={!newSubEventName.trim() || !targetCategoryForSubEvent}
						>
							Add Sub-Event
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

const sampleData = {
	"Events": [], // This will be populated with event categories
	"Venues": [
		{ name: "Grand Ballroom", contact: "+91 98765 43210", address: "123 MG Road, Bangalore", description: "Luxury ballroom perfect for weddings and corporate events", date: "2025-02-15" },
		{ name: "Garden Paradise", contact: "+91 98765 43211", address: "456 Whitefield, Bangalore", description: "Beautiful outdoor venue with garden settings", date: "2025-03-20" },
		{ name: "Sky Lounge", contact: "+91 98765 43212", address: "789 Koramangala, Bangalore", description: "Rooftop venue with stunning city views", date: "2025-04-10" },
		{ name: "Heritage Palace", contact: "+91 98765 43213", address: "321 Indiranagar, Bangalore", description: "Traditional palace for royal wedding celebrations", date: "2025-05-25" },
		{ name: "Modern Convention Center", contact: "+91 98765 43214", address: "654 HSR Layout, Bangalore", description: "State-of-the-art facility for conferences and exhibitions", date: "2025-06-15" },
	],
	"Logistics": [
		{ name: "Swift Logistics Co.", contact: "+91 98765 43220", address: "12 Industrial Area, Bangalore", description: "Full-service logistics provider specializing in event equipment transportation" },
		{ name: "Prime Movers", contact: "+91 98765 43221", address: "34 Peenya, Bangalore", description: "Reliable transportation services for events and exhibitions" },
		{ name: "Event Movers", contact: "+91 98765 43222", address: "56 MG Road, Bangalore", description: "Specialized in moving event equipment and stage setups" },
		{ name: "Quick Transport Solutions", contact: "+91 98765 43223", address: "78 Whitefield, Bangalore", description: "Fast and reliable logistics for corporate events" },
	],
	"Catering": [
		{ name: "Royal Caterers", contact: "+91 98765 43230", address: "56 Indiranagar, Bangalore", description: "Premium catering service offering Indian, Continental, and Chinese cuisines" },
		{ name: "Spice Kitchen", contact: "+91 98765 43231", address: "78 Koramangala, Bangalore", description: "Authentic South Indian and North Indian catering for all occasions" },
		{ name: "Gourmet Delights", contact: "+91 98765 43232", address: "90 HSR Layout, Bangalore", description: "Multi-cuisine catering with customizable menus and live counters" },
		{ name: "Fusion Feast", contact: "+91 98765 43233", address: "12 MG Road, Bangalore", description: "Fusion cuisine combining global flavors" },
	],
	"Security": [
		{ name: "Elite Security Services", contact: "+91 98765 43240", address: "23 Jayanagar, Bangalore", description: "Professional security personnel for events, trained and licensed" },
		{ name: "SafeGuard Security", contact: "+91 98765 43241", address: "45 BTM Layout, Bangalore", description: "Comprehensive event security solutions with CCTV monitoring" },
		{ name: "SecurePro Services", contact: "+91 98765 43242", address: "12 MG Road, Bangalore", description: "Professional security services for high-profile events" },
		{ name: "Guardian Security", contact: "+91 98765 43243", address: "34 Whitefield, Bangalore", description: "Experienced security personnel for all event types" },
	],
	"Gifts": [
		{ name: "Perfect Gifts Store", contact: "+91 98765 43260", address: "34 Commercial Street, Bangalore", description: "Wide range of corporate gifts, return gifts, and customized gift hampers" },
		{ name: "Gift Gallery", contact: "+91 98765 43261", address: "56 Brigade Road, Bangalore", description: "Premium gift items, personalized gifts, and bulk ordering services" },
		{ name: "Elegant Gifts", contact: "+91 98765 43262", address: "12 MG Road, Bangalore", description: "Premium gift items for corporate and personal events" },
		{ name: "The Gift Basket", contact: "+91 98765 43263", address: "78 Indiranagar, Bangalore", description: "Wide range of gift baskets and personalized items" },
	],
	"DJ": [
		{ name: "DJ Beats", contact: "+91 98765 43270", address: "78 Koramangala, Bangalore", description: "Professional DJ services with latest equipment and music library" },
		{ name: "Rhythm Masters", contact: "+91 98765 43271", address: "90 Indiranagar, Bangalore", description: "Experienced DJs for weddings, parties, and corporate events" },
		{ name: "Sound Wave DJs", contact: "+91 98765 43272", address: "12 HSR Layout, Bangalore", description: "Complete DJ setup with lighting and sound systems" },
		{ name: "Beat Masters", contact: "+91 98765 43273", address: "56 Koramangala, Bangalore", description: "Specialized in EDM and club music for events" },
	],
	"Photographers": [
		{ name: "Lens & Light Photography", contact: "+91 98765 43280", address: "34 Jayanagar, Bangalore", description: "Professional event photography and videography services" },
		{ name: "Capture Moments Studio", contact: "+91 98765 43281", address: "56 Whitefield, Bangalore", description: "Wedding and event photography with drone coverage" },
		{ name: "Perfect Frames", contact: "+91 98765 43282", address: "78 Electronic City, Bangalore", description: "Candid photography specialists for all types of events" },
		{ name: "Memories Captured", contact: "+91 98765 43283", address: "90 HSR Layout, Bangalore", description: "Expert in wedding and family event photography" },
	],
};

export default function FieldManagement() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 9;
	const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

	// Category ID to API Category mapping
	const categoryMap: Record<string, string> = {
		"Venues": "VENUES",
		"Logistics": "LOGISTICS",
		"Catering": "CATERING",
		"Security": "SECURITY",
		"Gifts": "GIFTS",
		"DJ": "DJ",
		"Photographers": "PHOTOGRAPHERS"
	};

	// Function to fetch provider counts for all categories
	const fetchAllCounts = async () => {
		try {
			const response = await apiClient.getProviderCounts();
			const apiCounts = response?.data || {};
			
			// Map API categories to frontend categories
			const counts: Record<string, number> = {};
			for (const [frontendId, apiCategory] of Object.entries(categoryMap)) {
				counts[frontendId] = apiCounts[apiCategory] || 0;
			}
			setCategoryCounts(counts);
		} catch (error) {
			console.error('Error fetching provider counts:', error);
			// Fallback to individual fetches
			const counts: Record<string, number> = {};
			for (const [frontendId, apiCategory] of Object.entries(categoryMap)) {
				try {
					const response = await apiClient.getProviders(apiCategory);
					counts[frontendId] = response?.data?.length || 0;
				} catch (err) {
					console.error(`Error fetching count for ${frontendId}:`, err);
					counts[frontendId] = 0;
				}
			}
			setCategoryCounts(counts);
		}
	};

	// Fetch provider counts for all categories on mount
	useEffect(() => {
		fetchAllCounts();
	}, []);

	// Fetch providers from API based on selected category
	const { data: providersResponse, isLoading: isLoadingProviders, refetch: refetchProviders } = useQuery({
		queryKey: ['providers', selectedCategory],
		queryFn: async () => {
			if (!selectedCategory || !categoryMap[selectedCategory]) {
				return { data: [] };
			}
			return apiClient.getProviders(categoryMap[selectedCategory]);
		},
		enabled: !!selectedCategory && !!categoryMap[selectedCategory],
	});

	const providers = providersResponse?.data || [];

	// Set up auto-refresh every 10 seconds
	useQuery({
		queryKey: ['providers-refresh', selectedCategory],
		queryFn: async () => {
			await refetchProviders();
			return true;
		},
		enabled: !!selectedCategory && !!categoryMap[selectedCategory],
		refetchInterval: 10000, // 10 seconds
	});

	// Mutation handlers for provider CRUD operations
	const createProviderMutation = useMutation({
		mutationFn: async (providerData: any) => {
			// Clean the data: convert empty strings to null, remove internal fields
			const cleanedData = Object.keys(providerData).reduce((acc: any, key: string) => {
				const value = providerData[key];
				
				// Skip created_at and updated_at (database handles these automatically)
				if (key === 'created_at' || key === 'updated_at') {
					return acc;
				}
				
				// Keep boolean values as-is
				if (typeof value === 'boolean') {
					acc[key] = value;
				} 
				// Handle owner_id specifically - should be Int or null, not empty string
				else if (key === 'owner_id') {
					acc[key] = value && value !== "" ? Number(value) : null;
				}
				// Convert empty strings to null for nullable fields
				else if (value === "" || value === null || value === undefined) {
					acc[key] = null;
				} 
				// Keep valid values
				else {
					acc[key] = value;
				}
				return acc;
			}, {});
			
			console.log('Creating provider with data:', {
				...cleanedData,
				category: categoryMap[selectedCategory!],
			});
			
			return apiClient.createProvider({
				...cleanedData,
				category: categoryMap[selectedCategory!],
			});
		},
		onSuccess: () => {
			console.log('Provider created successfully');
			queryClient.invalidateQueries({ queryKey: ['providers', selectedCategory] });
			fetchAllCounts(); // Refresh counts
			setIsAddProviderOpen(false);
			resetNewProvider();
		},
		onError: (error: any) => {
			console.error('Failed to create provider:', error);
			alert(`Failed to save provider: ${error.message || 'Unknown error'}`);
		},
	});

	const updateProviderMutation = useMutation({
		mutationFn: async ({ id, data: providerData }: { id: number; data: any }) => {
			return apiClient.updateProvider(id, providerData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['providers', selectedCategory] });
			setIsEditProviderOpen(false);
			setEditProvider(null);
			setActiveProviderIndex(null);
		},
	});

	const deleteProviderMutation = useMutation({
		mutationFn: async (id: number) => {
			return apiClient.deleteProvider(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['providers', selectedCategory] });
			fetchAllCounts(); // Refresh counts
		},
	});

	// Event Types state
	const [eventCategories, setEventCategories] = useState(() => {
		try {
			const stored = localStorage.getItem('admin_eve_event_categories_simple');
			if (stored) return JSON.parse(stored);
		} catch {}
		return initialEventCategories;
	});
	const [addCategoryOpen, setAddCategoryOpen] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(null);
	const [editCategoryValue, setEditCategoryValue] = useState("");
	const [editSubIndex, setEditSubIndex] = useState<{ category: number; sub: number } | null>(null);
	const [editSubValue, setEditSubValue] = useState("");
	const [newSubNameByCategory, setNewSubNameByCategory] = useState<Record<number, string>>({});

	const [data, setData] = useState(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				return sampleData;
			}
		}
		return sampleData;
	});

	// Add Venue dialog state
	const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);
		const [newVenue, setNewVenue] = useState<any>({
			name: "",
			contact: "",
			address: "",
			date: "",
			description: "",
			email: "",
			website: "",
			venue_type: "",
			event_types_supported: [],
			sub_event_types_supported: [],
			capacity: "",
			total_area_sqft: "",
			parking_capacity: "",
			rooms_available: "",
			booking_status: "",
			latitude: "",
			longitude: "",
			status: "Active",
		});

	// View/Edit Venue dialog state
	const [isViewVenueOpen, setIsViewVenueOpen] = useState(false);
	const [isEditVenueOpen, setIsEditVenueOpen] = useState(false);
	const [activeVenueIndex, setActiveVenueIndex] = useState<number | null>(null);
	const [editVenue, setEditVenue] = useState<any | null>(null);

	// Generic Service Provider dialogs (for non-Events, non-Venues)
	const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
	const [isViewProviderOpen, setIsViewProviderOpen] = useState(false);
	const [isEditProviderOpen, setIsEditProviderOpen] = useState(false);
	const [activeProviderIndex, setActiveProviderIndex] = useState<number | null>(null);
	// Comprehensive provider state with all category-specific fields
	const [newProvider, setNewProvider] = useState<any>({
		name: "",
		contact: "",
		address: "",
		description: "",
		email: "",
		website: "",
		status: "ACTIVE",
		// Logistics-specific
		logistics_id: "",
		service_type: "",
		vehicle_types_available: "",
		equipment_types: "",
		capacity_handling: "",
		available_locations: "",
		contact_person: "",
		contact_number: "",
		license_number: "",
		insurance_coverage: "",
		service_radius: "",
		// Catering-specific
		cuisine_types: "",
		menu_categories: "",
		serving_capacity: "",
		equipment_available: "",
		staff_count: "",
		halal_certified: false,
		vegetarian_options: false,
		// Security-specific
		security_license: "",
		security_services: "",
		staff_qualifications: "",
		equipment_provided: "",
		response_time: "",
		patrol_areas: "",
		// Gifts-specific
		gift_categories: "",
		price_range: "",
		customization_available: false,
		delivery_available: false,
		bulk_discounts: false,
		// DJ-specific
		equipment_owned: "",
		music_genres: "",
		experience_years: "",
		event_types_handled: "",
		lighting_available: false,
		sound_system_power: "",
		// Photographers-specific
		photography_style: "",
		equipment_used: "",
		years_experience: "",
		portfolio_link: "",
		editing_services: false,
		drone_photography: false,
		// Common fields
		latitude: "",
		longitude: "",
		owner_id: "",
		created_at: "",
		updated_at: "",
	});
	const [editProvider, setEditProvider] = useState<any | null>(null);

	const resetNewVenue = () => {
		setNewVenue({
			name: "",
			contact: "",
			address: "",
			date: "",
			description: "",
			email: "",
			website: "",
			venue_type: "",
			event_types_supported: [],
			sub_event_types_supported: [],
			capacity: "",
			total_area_sqft: "",
			parking_capacity: "",
			rooms_available: "",
			booking_status: "",
			latitude: "",
			longitude: "",
			status: "Active",
		});
	};

	// Reset provider (including all category fields)
	const resetNewProvider = () => {
		setNewProvider({
			name: "",
			contact: "",
			address: "",
			description: "",
			email: "",
			website: "",
			status: "ACTIVE",
			// Logistics-specific
			logistics_id: "",
			service_type: "",
			vehicle_types_available: "",
			equipment_types: "",
			capacity_handling: "",
			available_locations: "",
			contact_person: "",
			contact_number: "",
			license_number: "",
			insurance_coverage: "",
			service_radius: "",
			// Catering-specific
			cuisine_types: "",
			menu_categories: "",
			serving_capacity: "",
			equipment_available: "",
			staff_count: "",
			halal_certified: false,
			vegetarian_options: false,
			// Security-specific
			security_license: "",
			security_services: "",
			staff_qualifications: "",
			equipment_provided: "",
			response_time: "",
			patrol_areas: "",
			// Gifts-specific
			gift_categories: "",
			price_range: "",
			customization_available: false,
			delivery_available: false,
			bulk_discounts: false,
			// DJ-specific
			equipment_owned: "",
			music_genres: "",
			experience_years: "",
			event_types_handled: "",
			lighting_available: false,
			sound_system_power: "",
			// Photographers-specific
			photography_style: "",
			equipment_used: "",
			years_experience: "",
			portfolio_link: "",
			editing_services: false,
			drone_photography: false,
			// Common fields
			latitude: "",
			longitude: "",
			owner_id: "",
			created_at: "",
			updated_at: "",
		});
	};

	const handleSaveVenue = async () => {
		if (!newVenue.name?.trim() || !newVenue.contact?.trim() || !newVenue.address?.trim()) return;
		
		try {
			// Save venue as a provider in the providers table with category VENUES
			// Backend requires: name, contact, email, category (as enum value)
			const requestBody: any = {
				name: newVenue.name.trim(),
				contact: newVenue.contact.trim(),
				address: newVenue.address.trim() || "",
				description: newVenue.description?.trim() || "",
				email: newVenue.email?.trim() || "noreply@venue.com", // Provide default if empty
				website: newVenue.website?.trim() || "",
				category: "VENUES", // This is an enum value from providers_category
				status: "ACTIVE", // Use enum value, not "Active"
				// Additional venue-specific fields
				latitude: newVenue.latitude || "",
				longitude: newVenue.longitude || "",
			};
			
			console.log('Sending venue data to backend:', requestBody);
			
			const token = localStorage.getItem('auth_token');
			console.log('Auth token present:', !!token);
			console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'none');

			// Use the providers API endpoint
			const response = await fetch('http://localhost:5000/api/providers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(requestBody)
			});

			const responseData = await response.json();
			
			console.log('Backend response status:', response.status);
			console.log('Backend response data:', responseData);
			
			if (!response.ok) {
				console.error('Backend error response:', responseData);
				throw new Error(responseData.message || `Failed to save venue: ${response.status}`);
			}

			console.log('Venue saved successfully:', responseData);
			
			// Refresh providers list
			queryClient.invalidateQueries({ queryKey: ['providers'] });
			
			// Also update local state for immediate UI update
			setData((prev: any) => {
				const next = { ...prev };
				const venues = Array.isArray(next["Venues"]) ? next["Venues"] : [];
				const item = {
					name: newVenue.name.trim(),
					contact: newVenue.contact.trim(),
					address: newVenue.address.trim(),
					description: newVenue.description?.trim() || "",
					date: newVenue.date || new Date().toISOString().slice(0, 10),
					venue_type: newVenue.venue_type,
					event_types_supported: newVenue.event_types_supported.join(", "),
					sub_event_types_supported: newVenue.sub_event_types_supported.join(", "),
					capacity: newVenue.capacity ? Number(newVenue.capacity) : undefined,
					total_area_sqft: newVenue.total_area_sqft ? Number(newVenue.total_area_sqft) : undefined,
					parking_capacity: newVenue.parking_capacity ? Number(newVenue.parking_capacity) : undefined,
					rooms_available: newVenue.rooms_available ? Number(newVenue.rooms_available) : undefined,
					booking_status: newVenue.booking_status,
					latitude: newVenue.latitude ? Number(newVenue.latitude) : undefined,
					longitude: newVenue.longitude ? Number(newVenue.longitude) : undefined,
					status: newVenue.status || "Active",
				};
				next["Venues"] = [...venues, item];
				return next;
			});
			
			setIsAddVenueOpen(false);
			resetNewVenue();
		} catch (error: any) {
			console.error('Error saving venue:', error);
			alert(error.message || 'Failed to save venue to database. Please check backend API.');
		}
	};

	const openViewVenue = (idx: number) => {
		setActiveVenueIndex(idx);
		setIsViewVenueOpen(true);
	};

	const openEditVenue = (idx: number) => {
		setActiveVenueIndex(idx);
		const item = (data?.["Venues"] || [])[idx];
		setEditVenue({
			name: item?.name || "",
			contact: item?.contact || "",
			address: item?.address || "",
			date: item?.date || "",
			description: item?.description || "",
			venue_type: item?.venue_type || "",
			event_types_supported: item?.event_types_supported ? item.event_types_supported.split(", ").filter(Boolean) : [],
			sub_event_types_supported: item?.sub_event_types_supported ? item.sub_event_types_supported.split(", ").filter(Boolean) : [],
			capacity: item?.capacity ?? "",
			total_area_sqft: item?.total_area_sqft ?? "",
			parking_capacity: item?.parking_capacity ?? "",
			rooms_available: item?.rooms_available ?? "",
			booking_status: item?.booking_status || "",
			latitude: item?.latitude ?? "",
			longitude: item?.longitude ?? "",
			status: item?.status || "Active",
		});
		setIsEditVenueOpen(true);
	};

	const handleUpdateVenue = () => {
		if (activeVenueIndex === null || !editVenue) return;
		if (!editVenue.name?.trim() || !editVenue.contact?.trim() || !editVenue.address?.trim()) return;
		setData((prev: any) => {
			const next = { ...prev };
			const venues = Array.isArray(next["Venues"]) ? [...next["Venues"]] : [];
			venues[activeVenueIndex] = {
				...venues[activeVenueIndex],
				name: editVenue.name.trim(),
				contact: editVenue.contact.trim(),
				address: editVenue.address.trim(),
				description: editVenue.description?.trim() || "",
				date: editVenue.date || new Date().toISOString().slice(0, 10),
				venue_type: editVenue.venue_type,
				event_types_supported: editVenue.event_types_supported.join(", "),
				sub_event_types_supported: editVenue.sub_event_types_supported.join(", "),
				capacity: editVenue.capacity !== "" ? Number(editVenue.capacity) : undefined,
				total_area_sqft: editVenue.total_area_sqft !== "" ? Number(editVenue.total_area_sqft) : undefined,
				parking_capacity: editVenue.parking_capacity !== "" ? Number(editVenue.parking_capacity) : undefined,
				rooms_available: editVenue.rooms_available !== "" ? Number(editVenue.rooms_available) : undefined,
				booking_status: editVenue.booking_status,
				latitude: editVenue.latitude !== "" ? Number(editVenue.latitude) : undefined,
				longitude: editVenue.longitude !== "" ? Number(editVenue.longitude) : undefined,
				status: editVenue.status || "Active",
			};
			next["Venues"] = venues;
			return next;
		});
		setIsEditVenueOpen(false);
		setEditVenue(null);
		setActiveVenueIndex(null);
	};

	// Generic providers helpers
	const openViewProvider = (idx: number) => {
		setActiveProviderIndex(idx);
		setIsViewProviderOpen(true);
	};

	const openEditProvider = (idx: number) => {
		if (!selectedCategory) return;
		setActiveProviderIndex(idx);
		const item = providers[idx] || {};
		// For Logistics, include additional fields
		if (selectedCategory === "Logistics") {
			setEditProvider({
				name: item?.name || "",
				contact: item?.contact || "",
				address: item?.address || "",
				description: item?.description || "",
				logistics_id: item?.logistics_id || "",
				service_type: item?.service_type || "",
				vehicle_types_available: item?.vehicle_types_available || "",
				equipment_types: item?.equipment_types || "",
				capacity_handling: item?.capacity_handling || "",
				available_locations: item?.available_locations || "",
				contact_person: item?.contact_person || "",
				contact_number: item?.contact_number || item?.contact || "",
				email: item?.email || "",
				latitude: item?.latitude ?? "",
				longitude: item?.longitude ?? "",
				status: item?.status || "ACTIVE",
				owner_id: item?.owner_id || "",
				created_at: item?.created_at || "",
				updated_at: item?.updated_at || "",
			});
		} else {
			setEditProvider({
				name: item?.name || "",
				contact: item?.contact || "",
				address: item?.address || "",
				description: item?.description || "",
				email: item?.email || "",
				website: item?.website || "",
				status: item?.status || "ACTIVE",
			});
		}
		setIsEditProviderOpen(true);
	};

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}, [data]);

	useEffect(() => {
		localStorage.setItem('admin_eve_event_categories_simple', JSON.stringify(eventCategories));
	}, [eventCategories]);

	// Event Types functions
	const persistEvent = (categories: any) => {
		setEventCategories(categories);
	};

	const handleEditCategory = (index: number) => {
		setEditCategoryIndex(index);
		setEditCategoryValue(eventCategories[index].name);
	};

	const handleSaveCategory = () => {
		if (editCategoryValue.trim()) {
			const updated = [...eventCategories];
			updated[editCategoryIndex!].name = editCategoryValue.trim();
			persistEvent(updated);
		}
		setEditCategoryIndex(null);
		setEditCategoryValue("");
	};

	const handleCancelCategoryEdit = () => {
		setEditCategoryIndex(null);
		setEditCategoryValue("");
	};

	const handleEditSub = (categoryIndex: number, subIndex: number) => {
		setEditSubIndex({ category: categoryIndex, sub: subIndex });
		setEditSubValue(eventCategories[categoryIndex].subEvents[subIndex]);
	};

	const handleSaveSub = () => {
		if (editSubValue.trim() && editSubIndex) {
			const updated = [...eventCategories];
			updated[editSubIndex.category].subEvents[editSubIndex.sub] = editSubValue.trim();
			persistEvent(updated);
		}
		setEditSubIndex(null);
		setEditSubValue("");
	};

	const handleCancelSubEdit = () => {
		setEditSubIndex(null);
		setEditSubValue("");
	};

	const handleAddSubInline = (categoryIndex: number) => {
		const name = (newSubNameByCategory[categoryIndex] || '').trim();
		if (!name) return;
		const next = eventCategories.map((c, idx) => {
			if (idx !== categoryIndex) return c;
			const set = new Set([...(c.subEvents || []), name]);
			return { ...c, subEvents: Array.from(set) };
		});
		persistEvent(next);
		setNewSubNameByCategory((prev) => ({ ...prev, [categoryIndex]: '' }));
	};

	const handleAddCategory = () => {
		if (newCategoryName.trim()) {
			const updated = [...eventCategories, { name: newCategoryName.trim(), subEvents: [] }];
			persistEvent(updated);
			setNewCategoryName("");
			setAddCategoryOpen(false);
		}
	};

	// Use API data instead of localStorage for providers
	const currentData = selectedCategory && categoryMap[selectedCategory] ? providers : [];

	const filteredData = useMemo(() => {
		if (!searchQuery) return currentData;
		return currentData.filter((item: any) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [currentData, searchQuery]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const paginatedData = filteredData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const viewedVenue = (selectedCategory === "Venues" && activeVenueIndex !== null)
		? (providers[activeVenueIndex] || null)
		: null;

	const viewedProvider = (selectedCategory && selectedCategory !== 'Events' && selectedCategory !== 'Venues' && activeProviderIndex !== null)
		? (providers[activeProviderIndex] || null)
		: null;

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedCategory]);

	const handleBack = () => {
		setSelectedCategory(null);
		setSearchQuery("");
	};

	const getCategoryIcon = (categoryId: string) => {
		const cat = fieldCategories.find(c => c.id === categoryId);
		return cat || fieldCategories[0];
	};

	// Calculate stats using API counts
	const totalProviders = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="space-y-6">
			{/* Header */}
            <div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{selectedCategory && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleBack}
							className="gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back
						</Button>
					)}
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							{selectedCategory || "Service Providers"}
						</h1>
						<p className="text-sm text-muted-foreground mt-0.5">
							{selectedCategory
								? `Manage ${selectedCategory.toLowerCase()} directory`
								: "Browse and manage service provider categories"}
						</p>
                </div>
                
            </div>
				</div>

			{!selectedCategory ? (
				<>
					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card className="border border-border bg-card">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs text-muted-foreground font-semibold uppercase">Total Providers</p>
										<p className="text-2xl font-bold text-foreground mt-1">{String(totalProviders)}</p>
									</div>
									<Building2 className="h-8 w-8 text-primary" />
								</div>
							</CardContent>
						</Card>
						<Card className="border border-border bg-card">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-xs text-muted-foreground font-semibold uppercase">Categories</p>
										<p className="text-2xl font-bold text-foreground mt-1">{fieldCategories.length}</p>
						</div>
									<Package className="h-8 w-8 text-primary" />
				</div>
							</CardContent>
						</Card>
						<Card className="border border-border bg-card">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
				<div>
										<p className="text-xs text-muted-foreground font-semibold uppercase">Active Services</p>
										<p className="text-2xl font-bold text-foreground mt-1">{fieldCategories.length}</p>
									</div>
									<Users className="h-8 w-8 text-green-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Categories Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{fieldCategories.map((category) => {
							const Icon = category.icon;
							const count = categoryCounts[category.id] || 0;
							return (
								<Card
									key={category.id}
									className="hover:shadow-lg transition-all cursor-pointer border border-border bg-card group"
									onClick={() => setSelectedCategory(category.id)}
								>
									<CardContent className="p-6">
										<div className="flex flex-col items-center text-center gap-3">
											<div className={`h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
												<Icon className={`h-8 w-8 ${category.color}`} />
											</div>
											<div>
												<h3 className="font-bold text-base text-foreground">{category.name}</h3>
												<p className="text-xs text-muted-foreground mt-1">{count} providers</p>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
                </>
			) : selectedCategory === "Events" ? (
				<>
					{/* Event Types Management */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{eventCategories && eventCategories.length > 0 ? eventCategories.map((category, index) => (
							<Card key={index} className="border border-border relative bg-card">
								<div className="absolute top-3 right-3 flex items-center gap-2">
									<Button size="icon" variant="ghost" onClick={() => handleEditCategory(index)}>
										<Edit2 size={16} />
									</Button>
									<Button size="icon" variant="ghost" onClick={() => {
										const next = eventCategories.filter((_, i) => i !== index);
										persistEvent(next);
									}}>
										<Trash2 size={16} />
									</Button>
								</div>
								<CardHeader>
									<CardTitle className="text-xl font-semibold mb-2">
										{editCategoryIndex === index ? (
											<div className="flex items-center gap-2">
												<Input 
													value={editCategoryValue} 
													onChange={(e) => setEditCategoryValue(e.target.value)} 
													className="text-xl font-semibold" 
												/>
												<Button size="sm" onClick={handleSaveCategory}>
													<Save className="h-4 w-4" />
												</Button>
												<Button size="sm" variant="ghost" onClick={handleCancelCategoryEdit}>
													<X className="h-4 w-4" />
												</Button>
											</div>
										) : (
											category.name
										)}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									{category.subEvents.map((sub, i) => (
										editSubIndex && editSubIndex.category === index && editSubIndex.sub === i ? (
											<div key={i} className="flex items-center justify-between border-b pb-1">
												<Input 
													value={editSubValue} 
													onChange={(e) => setEditSubValue(e.target.value)} 
												/>
												<div className="flex gap-2">
													<Button size="sm" onClick={handleSaveSub}>
														<Save className="h-4 w-4" />
													</Button>
													<Button size="sm" variant="ghost" onClick={handleCancelSubEdit}>
														<X className="h-4 w-4" />
													</Button>
												</div>
											</div>
										) : (
											<div key={i} className="flex items-center justify-between border-b pb-1">
												<span className="text-sm">{sub}</span>
												<div className="flex gap-2">
													<Button size="icon" variant="ghost" onClick={() => handleEditSub(index, i)}>
														<Edit2 size={14} />
													</Button>
													<Button size="icon" variant="ghost" onClick={() => {
														const next = eventCategories.map((c, ci) => 
															ci === index ? { ...c, subEvents: c.subEvents.filter((_, si) => si !== i) } : c
														);
														persistEvent(next);
													}}>
														<Trash2 size={14} />
													</Button>
												</div>
											</div>
										)
									))}
									{/* Inline add sub-event row */}
									<div className="flex items-center justify-between gap-2 border-b pb-1 border-dashed border-border/70">
										<Input
											placeholder="Add new sub-event"
											value={newSubNameByCategory[index] || ""}
											onChange={(e) => setNewSubNameByCategory((prev) => ({ ...prev, [index]: e.target.value }))}
											onKeyDown={(e) => { if (e.key === 'Enter') { handleAddSubInline(index); } }}
											className="h-8"
										/>
										<Button
											size="icon"
											variant="ghost"
											onClick={() => handleAddSubInline(index)}
											disabled={!((newSubNameByCategory[index] || '').trim())}
										>
											<Plus size={16} />
										</Button>
									</div>
								</CardContent>
							</Card>
						)) : (
							<div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
								<Calendar className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold text-foreground mb-2">No Event Categories</h3>
								<p className="text-muted-foreground mb-4">Start by adding your first event category</p>
								<Button onClick={() => setAddCategoryOpen(true)} className="gap-2">
									<Plus className="h-4 w-4" />
									Add First Category
								</Button>
							</div>
						)}
						{/* Add More Card - only show if there are existing categories */}
						{eventCategories && eventCategories.length > 0 && (
							<div 
								className="flex flex-col justify-center items-center border-2 border-dashed border-border rounded p-8 bg-muted/30 hover:bg-muted/50 transition cursor-pointer" 
								onClick={() => setAddCategoryOpen(true)}
							>
								<Plus size={20} className="text-muted-foreground mb-2" />
								<span className="text-foreground text-sm font-medium">Add Category</span>
							</div>
						)}
					</div>

					{/* Add Category Dialog */}
					{addCategoryOpen && (
						<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
							<div className="bg-background p-6 rounded-lg shadow-lg w-96">
								<h3 className="text-lg font-semibold mb-4">Add New Category</h3>
								<Input
									placeholder="Category Name"
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									className="mb-4"
								/>
								<div className="flex gap-2">
									<Button onClick={handleAddCategory}>Add</Button>
									<Button variant="ghost" onClick={() => {
										setAddCategoryOpen(false);
										setNewCategoryName("");
									}}>Cancel</Button>
								</div>
							</div>
						</div>
					)}

                </>
			) : (
				<>
				{/* Search and Add Venue */}
				<div className="relative flex items-center justify-between gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={`Search ${selectedCategory.toLowerCase()}...`}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-10"
						/>
					</div>
					{selectedCategory === "Venues" ? (
						<Button className="gap-2" onClick={() => setIsAddVenueOpen(true)}>
							<Plus className="h-4 w-4" />
							Add Venue
						</Button>
					) : selectedCategory !== "Events" ? (
						<Button className="gap-2" onClick={() => setIsAddProviderOpen(true)}>
							<Plus className="h-4 w-4" />
							Add {selectedCategory}
						</Button>
					) : null}
					</div>

					{/* Providers Table */}
					{filteredData.length === 0 ? (
						<Card className="border border-border">
							<CardContent className="p-12 flex items-center justify-center">
								<p className="text-muted-foreground text-sm">No providers found.</p>
							</CardContent>
						</Card>
					) : (
						<Card className="border border-border bg-card">
							<div className="overflow-auto">
								<table className="w-full table-auto border-collapse">
									<thead className="bg-muted/50 border-b border-border">
										<tr>
											<th className="p-3 text-left text-xs font-semibold uppercase tracking-wide">Name</th>
											<th className="p-3 text-left text-xs font-semibold uppercase tracking-wide">Contact</th>
											<th className="p-3 text-left text-xs font-semibold uppercase tracking-wide">Address</th>
											<th className="p-3 text-left text-xs font-semibold uppercase tracking-wide">Description</th>
								{selectedCategory === "Venues" && <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide">Date</th>}
								{selectedCategory !== "Events" && <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide">Actions</th>}
										</tr>
									</thead>
									<tbody>
										{paginatedData.map((provider: any, idx: number) => (
											<tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
												<td className="p-3">
													<div className="flex items-center gap-3">
														<div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0`}>
															{(() => {
																const categoryInfo = getCategoryIcon(selectedCategory || "");
																const Icon = categoryInfo.icon;
																return <Icon className={`h-5 w-5 ${categoryInfo.color}`} />;
															})()}
														</div>
														<div>
															<p className="font-semibold text-sm text-foreground">{provider.name}</p>
														</div>
													</div>
												</td>
												<td className="p-3">
													<div className="flex items-center gap-2">
														<Phone className="h-4 w-4 text-primary" />
														<span className="text-sm text-foreground">{provider.contact}</span>
													</div>
												</td>
												<td className="p-3">
													<div className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-primary" />
														<span className="text-sm text-foreground max-w-xs truncate">{provider.address}</span>
													</div>
												</td>
												<td className="p-3 max-w-md">
													<span className="text-sm text-muted-foreground line-clamp-2">{provider.description}</span>
												</td>
					{selectedCategory === "Venues" ? (
											<td className="p-3">
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4 text-primary" />
													<span className="text-sm text-foreground">
														{provider?.date ? (() => {
															const d = new Date(provider.date);
															return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
														})() : '-'}
													</span>
												</div>
											</td>
										) : null}
										{/* Actions cell: show venue-specific actions for Venues, otherwise provider actions */}
										{selectedCategory ? (
											selectedCategory === "Venues" ? (
												<td className="p-3">
													<div className="flex items-center gap-2">
														{(() => {
															const globalIdx = (data?.['Venues'] || []).indexOf(provider);
															return (
																<>
																	<Button size="sm" variant="outline" className="h-8 px-2 gap-1" onClick={() => globalIdx >= 0 && openViewVenue(globalIdx)}>
																		<Eye className="h-3.5 w-3.5" /> View
																	</Button>
																	<Button size="sm" className="h-8 px-2 gap-1" onClick={() => globalIdx >= 0 && openEditVenue(globalIdx)}>
																		<Edit2 className="h-3.5 w-3.5" /> Edit
																	</Button>
																</>
															);
														})()}
													</div>
												</td>
											) : (
												<td className="p-3">
													<div className="flex items-center gap-2">
																<>
															<Button size="sm" variant="outline" className="h-8 px-2 gap-1" onClick={() => openViewProvider(idx)}>
																		<Eye className="h-3.5 w-3.5" /> View
																	</Button>
															<Button size="sm" className="h-8 px-2 gap-1" onClick={() => openEditProvider(idx)}>
																		<Edit2 className="h-3.5 w-3.5" /> Edit
																	</Button>
															<Button 
																size="sm" 
																variant="destructive" 
																className="h-8 px-2 gap-1" 
																onClick={() => {
																	if (confirm('Are you sure you want to delete this provider?')) {
																		const providerToDelete = providers[idx];
																		if (providerToDelete?.id) {
																			deleteProviderMutation.mutate(providerToDelete.id);
																		}
																	}
																}}
															>
																<Trash2 className="h-3.5 w-3.5" />
															</Button>
														</>
													</div>
												</td>
											)
										) : null}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>
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
												isActive={currentPage === page}
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

					{/* Add Venue Dialog */}
					{selectedCategory === "Venues" && (
						<Dialog open={isAddVenueOpen} onOpenChange={setIsAddVenueOpen}>
							<DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
								<DialogHeader className="pb-6">
									<DialogTitle className="text-2xl font-bold flex items-center gap-3">
										<Building2 className="h-6 w-6 text-primary" />
										Add New Venue
									</DialogTitle>
									<p className="text-muted-foreground">Fill in the details to add a new venue to your directory</p>
								</DialogHeader>
								
								<div className="space-y-8">
									{/* Basic Information Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Building2 className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Basic Information</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="venue_id" className="text-sm font-medium">Venue ID *</Label>
												<Input 
													id="venue_id" 
													value={newVenue.venue_id} 
													onChange={(e) => setNewVenue({ ...newVenue, venue_id: e.target.value })}
													placeholder="Enter unique venue ID"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="name" className="text-sm font-medium">Venue Name *</Label>
												<Input 
													id="name" 
													value={newVenue.name} 
													onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
													placeholder="Enter venue name"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="contact" className="text-sm font-medium">Contact Number *</Label>
												<Input 
													id="contact" 
													value={newVenue.contact} 
													onChange={(e) => setNewVenue({ ...newVenue, contact: e.target.value })}
													placeholder="+91 98765 43210"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email" className="text-sm font-medium">Email *</Label>
												<Input 
													id="email" 
													type="email"
													value={newVenue.email} 
													onChange={(e) => setNewVenue({ ...newVenue, email: e.target.value })}
													placeholder="venue@example.com"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="website" className="text-sm font-medium">Website</Label>
												<Input 
													id="website" 
													type="url"
													value={newVenue.website} 
													onChange={(e) => setNewVenue({ ...newVenue, website: e.target.value })}
													placeholder="https://venue.com"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="date" className="text-sm font-medium">Date Added</Label>
												<Input 
													id="date" 
													type="date" 
													value={newVenue.date} 
													onChange={(e) => setNewVenue({ ...newVenue, date: e.target.value })}
													className="h-11"
												/>
											</div>
											<div className="md:col-span-1 space-y-2">
												<Label htmlFor="address" className="text-sm font-medium">Address *</Label>
												<Textarea 
													id="address" 
													value={newVenue.address} 
													onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })}
													placeholder="Enter complete venue address"
													className="min-h-[100px] resize-none"
												/>
											</div>
											<div className="md:col-span-1 space-y-2">
												<Label htmlFor="description" className="text-sm font-medium">Description</Label>
												<Textarea 
													id="description" 
													value={newVenue.description} 
													onChange={(e) => setNewVenue({ ...newVenue, description: e.target.value })}
													placeholder="Describe the venue features, amenities, and special characteristics"
													className="min-h-[100px] resize-none"
												/>
											</div>
										</div>
									</div>


									{/* Capacity & Space Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Users className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Capacity & Space</h3>
										</div>
										<div className="grid grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="capacity" className="text-sm font-medium">Capacity</Label>
												<Input 
													id="capacity" 
													type="number" 
													value={newVenue.capacity} 
													onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
													placeholder="e.g., 250"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="total_area_sqft" className="text-sm font-medium">Total Area (sqft)</Label>
												<Input 
													id="total_area_sqft" 
													type="number" 
													value={newVenue.total_area_sqft} 
													onChange={(e) => setNewVenue({ ...newVenue, total_area_sqft: e.target.value })}
													placeholder="e.g., 2000"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="parking_capacity" className="text-sm font-medium">Parking Capacity</Label>
												<Input 
													id="parking_capacity" 
													type="number" 
													value={newVenue.parking_capacity} 
													onChange={(e) => setNewVenue({ ...newVenue, parking_capacity: e.target.value })}
													placeholder="e.g., 100"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="rooms_available" className="text-sm font-medium">Rooms Available</Label>
												<Input 
													id="rooms_available" 
													type="number" 
													value={newVenue.rooms_available} 
													onChange={(e) => setNewVenue({ ...newVenue, rooms_available: e.target.value })}
													placeholder="e.g., 5"
													className="h-11"
												/>
											</div>
										</div>
									</div>

									{/* Amenities Section */}

									{/* Event Support Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Calendar className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Event Support</h3>
										</div>
										<div className="grid grid-cols-1 gap-6">
											<EventTypesDropdown
												selectedEventTypes={newVenue.event_types_supported}
												onEventTypesChange={(types) => setNewVenue({ ...newVenue, event_types_supported: types })}
												selectedSubEventTypes={newVenue.sub_event_types_supported}
												onSubEventTypesChange={(types) => setNewVenue({ ...newVenue, sub_event_types_supported: types })}
												label="Event Types Supported"
											/>
										</div>
									</div>

									{/* Location Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<MapPin className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Location Coordinates</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="latitude" className="text-sm font-medium">Latitude</Label>
												<Input 
													id="latitude" 
													type="number" 
													step="any"
													value={newVenue.latitude} 
													onChange={(e) => setNewVenue({ ...newVenue, latitude: e.target.value })}
													placeholder="e.g., 12.9716"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="longitude" className="text-sm font-medium">Longitude</Label>
												<Input 
													id="longitude" 
													type="number" 
													step="any"
													value={newVenue.longitude} 
													onChange={(e) => setNewVenue({ ...newVenue, longitude: e.target.value })}
													placeholder="e.g., 77.5946"
													className="h-11"
												/>
											</div>
										</div>
									</div>
								</div>

								<DialogFooter className="pt-6 border-t border-border">
									<div className="flex gap-3 w-full">
										<Button 
											variant="outline" 
											onClick={() => { setIsAddVenueOpen(false); resetNewVenue(); }}
											className="flex-1 h-11"
										>
											Cancel
										</Button>
										<Button 
											onClick={handleSaveVenue}
											className="flex-1 h-11 bg-primary hover:bg-primary/90"
										>
											<Building2 className="h-4 w-4 mr-2" />
											Save Venue
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}

					{/* Add Provider Dialog - Category Specific Forms */}
					{selectedCategory !== "Events" && selectedCategory !== "Venues" && (
						<Dialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen}>
							<DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
								<DialogHeader className="pb-6">
									<DialogTitle className="text-2xl font-bold flex items-center gap-3">
										{selectedCategory === "Logistics" && <Truck className="h-6 w-6 text-primary" />}
										{selectedCategory === "Catering" && <UtensilsCrossed className="h-6 w-6 text-primary" />}
										{selectedCategory === "Security" && <Shield className="h-6 w-6 text-primary" />}
										{selectedCategory === "Gifts" && <Gift className="h-6 w-6 text-primary" />}
										{selectedCategory === "DJ" && <Music className="h-6 w-6 text-primary" />}
										{selectedCategory === "Photographers" && <Camera className="h-6 w-6 text-primary" />}
										Add New {selectedCategory}
									</DialogTitle>
									<p className="text-muted-foreground">Fill in the details to add a new {selectedCategory.toLowerCase()} service provider</p>
								</DialogHeader>
								
								<div className="space-y-8">
									{/* Basic Information Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Building2 className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Basic Information</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{selectedCategory === "Logistics" && (
												<div className="space-y-2">
													<Label htmlFor="logistics_id" className="text-sm font-medium">Logistics ID *</Label>
													<Input 
														id="logistics_id" 
														value={newProvider.logistics_id} 
														onChange={(e) => setNewProvider({ ...newProvider, logistics_id: e.target.value })}
														placeholder="Enter unique logistics ID"
														className="h-11"
													/>
												</div>
											)}
											<div className="space-y-2">
												<Label htmlFor="p_name" className="text-sm font-medium">Company/Service Name *</Label>
												<Input 
													id="p_name" 
													value={newProvider.name} 
													onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
													placeholder="Enter company or service name"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="p_contact" className="text-sm font-medium">Contact Number *</Label>
												<Input 
													id="p_contact" 
													value={newProvider.contact} 
													onChange={(e) => setNewProvider({ ...newProvider, contact: e.target.value })}
													placeholder="+91 98765 43210"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
												<Input 
													id="email" 
													type="email"
													value={newProvider.email} 
													onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
													placeholder="contact@company.com"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="website" className="text-sm font-medium">Website</Label>
												<Input 
													id="website" 
													value={newProvider.website} 
													onChange={(e) => setNewProvider({ ...newProvider, website: e.target.value })}
													placeholder="https://www.company.com"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label className="text-sm font-medium">Status</Label>
												<Select value={newProvider.status} onValueChange={(v) => setNewProvider({ ...newProvider, status: v })}>
													<SelectTrigger className="h-11">
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="ACTIVE">Active</SelectItem>
														<SelectItem value="INACTIVE">Inactive</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="md:col-span-1 space-y-2">
												<Label htmlFor="p_address" className="text-sm font-medium">Address *</Label>
												<Textarea 
													id="p_address" 
													value={newProvider.address} 
													onChange={(e) => setNewProvider({ ...newProvider, address: e.target.value })}
													placeholder="Enter complete business address"
													className="min-h-[100px] resize-none"
												/>
											</div>
											<div className="md:col-span-1 space-y-2">
												<Label htmlFor="p_description" className="text-sm font-medium">Description</Label>
												<Textarea 
													id="p_description" 
													value={newProvider.description} 
													onChange={(e) => setNewProvider({ ...newProvider, description: e.target.value })}
													placeholder="Describe your services, specialties, and what makes you unique"
													className="min-h-[100px] resize-none"
												/>
											</div>
										</div>
									</div>

									{/* Category-Specific Sections */}
									{selectedCategory === "Logistics" && (
										<>
											{/* Logistics Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Truck className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Logistics Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label htmlFor="service_type" className="text-sm font-medium">Service Type</Label>
														<Select value={newProvider.service_type} onValueChange={(v) => setNewProvider({ ...newProvider, service_type: v })}>
															<SelectTrigger className="h-11">
																<SelectValue placeholder="Select service type" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="Event Equipment Transport">Event Equipment Transport</SelectItem>
																<SelectItem value="Furniture Moving">Furniture Moving</SelectItem>
																<SelectItem value="Stage Setup">Stage Setup</SelectItem>
																<SelectItem value="General Logistics">General Logistics</SelectItem>
															</SelectContent>
														</Select>
													</div>
													<div className="space-y-2">
														<Label htmlFor="vehicle_types_available" className="text-sm font-medium">Vehicle Types Available</Label>
														<Input 
															id="vehicle_types_available" 
															value={newProvider.vehicle_types_available} 
															onChange={(e) => setNewProvider({ ...newProvider, vehicle_types_available: e.target.value })}
															placeholder="e.g., Trucks, Vans, Pickups"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="equipment_types" className="text-sm font-medium">Equipment Types</Label>
														<Input 
															id="equipment_types" 
															value={newProvider.equipment_types} 
															onChange={(e) => setNewProvider({ ...newProvider, equipment_types: e.target.value })}
															placeholder="e.g., Lifting equipment, Dollies, Straps"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="capacity_handling" className="text-sm font-medium">Capacity Handling</Label>
														<Input 
															id="capacity_handling" 
															value={newProvider.capacity_handling} 
															onChange={(e) => setNewProvider({ ...newProvider, capacity_handling: e.target.value })}
															placeholder="e.g., Up to 1000kg, 50 cubic feet"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="service_radius" className="text-sm font-medium">Service Radius</Label>
														<Input 
															id="service_radius" 
															value={newProvider.service_radius} 
															onChange={(e) => setNewProvider({ ...newProvider, service_radius: e.target.value })}
															placeholder="e.g., 50km radius, City-wide"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="license_number" className="text-sm font-medium">License Number</Label>
														<Input 
															id="license_number" 
															value={newProvider.license_number} 
															onChange={(e) => setNewProvider({ ...newProvider, license_number: e.target.value })}
															placeholder="Enter transport license number"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="insurance_coverage" className="text-sm font-medium">Insurance Coverage</Label>
														<Input 
															id="insurance_coverage" 
															value={newProvider.insurance_coverage} 
															onChange={(e) => setNewProvider({ ...newProvider, insurance_coverage: e.target.value })}
															placeholder="e.g., ₹10 Lakhs coverage"
															className="h-11"
														/>
													</div>
													<div className="md:col-span-2 space-y-2">
														<Label htmlFor="available_locations" className="text-sm font-medium">Available Locations</Label>
														<Input 
															id="available_locations" 
															value={newProvider.available_locations} 
															onChange={(e) => setNewProvider({ ...newProvider, available_locations: e.target.value })}
															placeholder="e.g., Bangalore, Mumbai, Delhi (comma separated)"
															className="h-11"
														/>
													</div>
												</div>
											</div>

											{/* Contact Details Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Phone className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Contact Details</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label htmlFor="contact_person" className="text-sm font-medium">Contact Person</Label>
														<Input 
															id="contact_person" 
															value={newProvider.contact_person} 
															onChange={(e) => setNewProvider({ ...newProvider, contact_person: e.target.value })}
															placeholder="Name of primary contact"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="contact_number" className="text-sm font-medium">Contact Number</Label>
														<Input 
															id="contact_number" 
															value={newProvider.contact_number} 
															onChange={(e) => setNewProvider({ ...newProvider, contact_number: e.target.value })}
															placeholder="+91 98765 43210"
															className="h-11"
														/>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Catering" && (
										<>
											{/* Catering Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<UtensilsCrossed className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Catering Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label htmlFor="cuisine_types" className="text-sm font-medium">Cuisine Types</Label>
														<Input 
															id="cuisine_types" 
															value={newProvider.cuisine_types} 
															onChange={(e) => setNewProvider({ ...newProvider, cuisine_types: e.target.value })}
															placeholder="e.g., Indian, Chinese, Continental, Italian"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="menu_categories" className="text-sm font-medium">Menu Categories</Label>
														<Input 
															id="menu_categories" 
															value={newProvider.menu_categories} 
															onChange={(e) => setNewProvider({ ...newProvider, menu_categories: e.target.value })}
															placeholder="e.g., Appetizers, Main Course, Desserts, Beverages"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="serving_capacity" className="text-sm font-medium">Serving Capacity</Label>
														<Input 
															id="serving_capacity" 
															value={newProvider.serving_capacity} 
															onChange={(e) => setNewProvider({ ...newProvider, serving_capacity: e.target.value })}
															placeholder="e.g., 50-500 people"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="staff_count" className="text-sm font-medium">Staff Count</Label>
														<Input 
															id="staff_count" 
															type="number"
															value={newProvider.staff_count} 
															onChange={(e) => setNewProvider({ ...newProvider, staff_count: e.target.value })}
															placeholder="Number of staff members"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="equipment_available" className="text-sm font-medium">Equipment Available</Label>
														<Input 
															id="equipment_available" 
															value={newProvider.equipment_available} 
															onChange={(e) => setNewProvider({ ...newProvider, equipment_available: e.target.value })}
															placeholder="e.g., Chafing dishes, Serving utensils, Tables"
															className="h-11"
														/>
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="halal_certified" 
															checked={newProvider.halal_certified} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, halal_certified: v })} 
														/>
														<Label htmlFor="halal_certified" className="text-sm font-medium cursor-pointer">Halal Certified</Label>
													</div>
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="vegetarian_options" 
															checked={newProvider.vegetarian_options} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, vegetarian_options: v })} 
														/>
														<Label htmlFor="vegetarian_options" className="text-sm font-medium cursor-pointer">Vegetarian Options Available</Label>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Security" && (
										<>
											{/* Security Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Shield className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Security Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label htmlFor="security_license" className="text-sm font-medium">Security License Number</Label>
														<Input 
															id="security_license" 
															value={newProvider.security_license} 
															onChange={(e) => setNewProvider({ ...newProvider, security_license: e.target.value })}
															placeholder="Enter security license number"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="security_services" className="text-sm font-medium">Security Services Offered</Label>
														<Input 
															id="security_services" 
															value={newProvider.security_services} 
															onChange={(e) => setNewProvider({ ...newProvider, security_services: e.target.value })}
															placeholder="e.g., Event Security, Crowd Control, VIP Protection"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="staff_qualifications" className="text-sm font-medium">Staff Qualifications</Label>
														<Input 
															id="staff_qualifications" 
															value={newProvider.staff_qualifications} 
															onChange={(e) => setNewProvider({ ...newProvider, staff_qualifications: e.target.value })}
															placeholder="e.g., Licensed Security Guards, Ex-Military"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="equipment_provided" className="text-sm font-medium">Equipment Provided</Label>
														<Input 
															id="equipment_provided" 
															value={newProvider.equipment_provided} 
															onChange={(e) => setNewProvider({ ...newProvider, equipment_provided: e.target.value })}
															placeholder="e.g., Walkie-talkies, Metal detectors, CCTV"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="response_time" className="text-sm font-medium">Response Time</Label>
														<Input 
															id="response_time" 
															value={newProvider.response_time} 
															onChange={(e) => setNewProvider({ ...newProvider, response_time: e.target.value })}
															placeholder="e.g., 15 minutes, 30 minutes"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="patrol_areas" className="text-sm font-medium">Patrol Areas</Label>
														<Input 
															id="patrol_areas" 
															value={newProvider.patrol_areas} 
															onChange={(e) => setNewProvider({ ...newProvider, patrol_areas: e.target.value })}
															placeholder="e.g., Venue perimeter, Parking areas, VIP sections"
															className="h-11"
														/>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Gifts" && (
										<>
											{/* Gift Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Gift className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Gift Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label htmlFor="gift_categories" className="text-sm font-medium">Gift Categories</Label>
														<Input 
															id="gift_categories" 
															value={newProvider.gift_categories} 
															onChange={(e) => setNewProvider({ ...newProvider, gift_categories: e.target.value })}
															placeholder="e.g., Corporate Gifts, Wedding Favors, Return Gifts"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="price_range" className="text-sm font-medium">Price Range</Label>
														<Input 
															id="price_range" 
															value={newProvider.price_range} 
															onChange={(e) => setNewProvider({ ...newProvider, price_range: e.target.value })}
															placeholder="e.g., ₹100-₹5000, Budget to Premium"
															className="h-11"
														/>
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="customization_available" 
															checked={newProvider.customization_available} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, customization_available: v })} 
														/>
														<Label htmlFor="customization_available" className="text-sm font-medium cursor-pointer">Customization Available</Label>
													</div>
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="delivery_available" 
															checked={newProvider.delivery_available} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, delivery_available: v })} 
														/>
														<Label htmlFor="delivery_available" className="text-sm font-medium cursor-pointer">Delivery Available</Label>
													</div>
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="bulk_discounts" 
															checked={newProvider.bulk_discounts} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, bulk_discounts: v })} 
														/>
														<Label htmlFor="bulk_discounts" className="text-sm font-medium cursor-pointer">Bulk Discounts</Label>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "DJ" && (
										<>
											{/* DJ Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Music className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">DJ Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label htmlFor="music_genres" className="text-sm font-medium">Music Genres</Label>
														<Input 
															id="music_genres" 
															value={newProvider.music_genres} 
															onChange={(e) => setNewProvider({ ...newProvider, music_genres: e.target.value })}
															placeholder="e.g., Bollywood, EDM, Rock, Pop, Classical"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="experience_years" className="text-sm font-medium">Years of Experience</Label>
														<Input 
															id="experience_years" 
															type="number"
															value={newProvider.experience_years} 
															onChange={(e) => setNewProvider({ ...newProvider, experience_years: e.target.value })}
															placeholder="Number of years"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="event_types_handled" className="text-sm font-medium">Event Types Handled</Label>
														<Input 
															id="event_types_handled" 
															value={newProvider.event_types_handled} 
															onChange={(e) => setNewProvider({ ...newProvider, event_types_handled: e.target.value })}
															placeholder="e.g., Weddings, Corporate Events, Parties"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="sound_system_power" className="text-sm font-medium">Sound System Power</Label>
														<Input 
															id="sound_system_power" 
															value={newProvider.sound_system_power} 
															onChange={(e) => setNewProvider({ ...newProvider, sound_system_power: e.target.value })}
															placeholder="e.g., 2000W, 5000W"
															className="h-11"
														/>
													</div>
													<div className="md:col-span-2 space-y-2">
														<Label htmlFor="equipment_owned" className="text-sm font-medium">Equipment Owned</Label>
														<Input 
															id="equipment_owned" 
															value={newProvider.equipment_owned} 
															onChange={(e) => setNewProvider({ ...newProvider, equipment_owned: e.target.value })}
															placeholder="e.g., DJ Controller, Speakers, Microphones, Mixer"
															className="h-11"
														/>
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="lighting_available" 
															checked={newProvider.lighting_available} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, lighting_available: v })} 
														/>
														<Label htmlFor="lighting_available" className="text-sm font-medium cursor-pointer">Lighting Available</Label>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Photographers" && (
										<>
											{/* Photography Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Camera className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Photography Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-2">
														<Label htmlFor="photography_style" className="text-sm font-medium">Photography Style</Label>
														<Input 
															id="photography_style" 
															value={newProvider.photography_style} 
															onChange={(e) => setNewProvider({ ...newProvider, photography_style: e.target.value })}
															placeholder="e.g., Candid, Traditional, Modern, Documentary"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="years_experience" className="text-sm font-medium">Years of Experience</Label>
														<Input 
															id="years_experience" 
															type="number"
															value={newProvider.years_experience} 
															onChange={(e) => setNewProvider({ ...newProvider, years_experience: e.target.value })}
															placeholder="Number of years"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="equipment_used" className="text-sm font-medium">Equipment Used</Label>
														<Input 
															id="equipment_used" 
															value={newProvider.equipment_used} 
															onChange={(e) => setNewProvider({ ...newProvider, equipment_used: e.target.value })}
															placeholder="e.g., Canon 5D, Sony A7, Professional Lenses"
															className="h-11"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="portfolio_link" className="text-sm font-medium">Portfolio Link</Label>
														<Input 
															id="portfolio_link" 
															value={newProvider.portfolio_link} 
															onChange={(e) => setNewProvider({ ...newProvider, portfolio_link: e.target.value })}
															placeholder="https://portfolio.com"
															className="h-11"
														/>
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="editing_services" 
															checked={newProvider.editing_services} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, editing_services: v })} 
														/>
														<Label htmlFor="editing_services" className="text-sm font-medium cursor-pointer">Photo Editing Services</Label>
													</div>
													<div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-muted/30">
														<Switch 
															id="drone_photography" 
															checked={newProvider.drone_photography} 
															onCheckedChange={(v) => setNewProvider({ ...newProvider, drone_photography: v })} 
														/>
														<Label htmlFor="drone_photography" className="text-sm font-medium cursor-pointer">Drone Photography</Label>
													</div>
												</div>
											</div>
										</>
									)}

									{/* Location Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<MapPin className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Location Coordinates</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="latitude" className="text-sm font-medium">Latitude</Label>
												<Input 
													id="latitude" 
													type="number" 
													step="any"
													value={newProvider.latitude} 
													onChange={(e) => setNewProvider({ ...newProvider, latitude: e.target.value })}
													placeholder="e.g., 12.9716"
													className="h-11"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="longitude" className="text-sm font-medium">Longitude</Label>
												<Input 
													id="longitude" 
													type="number" 
													step="any"
													value={newProvider.longitude} 
													onChange={(e) => setNewProvider({ ...newProvider, longitude: e.target.value })}
													placeholder="e.g., 77.5946"
													className="h-11"
												/>
											</div>
										</div>
									</div>
								</div>

								<DialogFooter className="pt-6 border-t border-border">
									<div className="flex gap-3 w-full">
										<Button 
											variant="outline" 
											onClick={() => { setIsAddProviderOpen(false); resetNewProvider(); }}
											className="flex-1 h-11"
										>
											Cancel
										</Button>
									<Button 
										onClick={() => {
											if (!selectedCategory || !newProvider.name.trim() || !newProvider.contact.trim() || !newProvider.email.trim()) {
												alert('Please fill in all required fields: Name, Contact, and Email are required.');
												return;
											}
											console.log('=== SAVE BUTTON CLICKED ===');
											console.log('newProvider state:', newProvider);
											console.log('selectedCategory:', selectedCategory);
											console.log('categoryMap value:', categoryMap[selectedCategory!]);
											createProviderMutation.mutate(newProvider);
										}}
										className="flex-1 h-11 bg-primary hover:bg-primary/90"
									>
											{selectedCategory === "Logistics" && <Truck className="h-4 w-4 mr-2" />}
											{selectedCategory === "Catering" && <UtensilsCrossed className="h-4 w-4 mr-2" />}
											{selectedCategory === "Security" && <Shield className="h-4 w-4 mr-2" />}
											{selectedCategory === "Gifts" && <Gift className="h-4 w-4 mr-2" />}
											{selectedCategory === "DJ" && <Music className="h-4 w-4 mr-2" />}
											{selectedCategory === "Photographers" && <Camera className="h-4 w-4 mr-2" />}
											Save {selectedCategory}
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}

					{/* Edit Provider Dialog (venue-like layout) */}
					{isEditProviderOpen && (
						<Dialog open={isEditProviderOpen} onOpenChange={setIsEditProviderOpen}>
							<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Edit {selectedCategory}</DialogTitle>
								</DialogHeader>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{selectedCategory === "Logistics" && (
										<div>
											<Label htmlFor="e_logistics_id">Logistics ID</Label>
											<Input id="e_logistics_id" value={editProvider?.logistics_id || ""} onChange={(e) => setEditProvider({ ...editProvider, logistics_id: e.target.value })} />
										</div>
									)}
									<div>
										<Label htmlFor="ep_name">Name</Label>
										<Input id="ep_name" value={editProvider?.name || ''} onChange={(e) => setEditProvider({ ...editProvider, name: e.target.value })} />
									</div>

									<div>
										<Label htmlFor="ep_contact">Contact</Label>
										<Input id="ep_contact" value={editProvider?.contact || ''} onChange={(e) => setEditProvider({ ...editProvider, contact: e.target.value })} />
									</div>
									{selectedCategory === "Logistics" && (
										<>
											<div>
												<Label htmlFor="e_contact_person">Contact Person</Label>
												<Input id="e_contact_person" value={editProvider?.contact_person || ""} onChange={(e) => setEditProvider({ ...editProvider, contact_person: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_contact_number">Contact Number</Label>
												<Input id="e_contact_number" value={editProvider?.contact_number || ""} onChange={(e) => setEditProvider({ ...editProvider, contact_number: e.target.value })} />
											</div>
										</>
									)}

									<div className="md:col-span-2">
										<Label htmlFor="ep_address">Address</Label>
										<Textarea id="ep_address" value={editProvider?.address || ''} onChange={(e) => setEditProvider({ ...editProvider, address: e.target.value })} />
									</div>

									<div className="md:col-span-2">
										<Label htmlFor="ep_description">Description</Label>
										<Textarea id="ep_description" value={editProvider?.description || ''} onChange={(e) => setEditProvider({ ...editProvider, description: e.target.value })} />
									</div>

									{selectedCategory === "Logistics" && editProvider && (
										<>
											<div>
												<Label htmlFor="e_service_type">Service Type</Label>
												<Input id="e_service_type" value={editProvider.service_type || ""} onChange={(e) => setEditProvider({ ...editProvider, service_type: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_vehicle_types_available">Vehicle Types</Label>
												<Input id="e_vehicle_types_available" value={editProvider.vehicle_types_available || ""} onChange={(e) => setEditProvider({ ...editProvider, vehicle_types_available: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_equipment_types">Equipment Types</Label>
												<Input id="e_equipment_types" value={editProvider.equipment_types || ""} onChange={(e) => setEditProvider({ ...editProvider, equipment_types: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_capacity_handling">Capacity Handling</Label>
												<Input id="e_capacity_handling" value={editProvider.capacity_handling || ""} onChange={(e) => setEditProvider({ ...editProvider, capacity_handling: e.target.value })} />
											</div>
											<div className="md:col-span-2">
												<Label htmlFor="e_available_locations">Available Locations</Label>
												<Input id="e_available_locations" value={editProvider.available_locations || ""} onChange={(e) => setEditProvider({ ...editProvider, available_locations: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_email">Email</Label>
												<Input id="e_email" value={editProvider.email || ""} onChange={(e) => setEditProvider({ ...editProvider, email: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_owner_id">Owner ID</Label>
												<Input id="e_owner_id" value={editProvider.owner_id || ""} onChange={(e) => setEditProvider({ ...editProvider, owner_id: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_latitude">Latitude</Label>
												<Input id="e_latitude" type="number" value={editProvider.latitude ?? ""} onChange={(e) => setEditProvider({ ...editProvider, latitude: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_longitude">Longitude</Label>
												<Input id="e_longitude" type="number" value={editProvider.longitude ?? ""} onChange={(e) => setEditProvider({ ...editProvider, longitude: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_created_at">Created At</Label>
												<Input id="e_created_at" type="datetime-local" value={editProvider.created_at || ""} onChange={(e) => setEditProvider({ ...editProvider, created_at: e.target.value })} />
											</div>
											<div>
												<Label htmlFor="e_updated_at">Updated At</Label>
												<Input id="e_updated_at" type="datetime-local" value={editProvider.updated_at || ""} onChange={(e) => setEditProvider({ ...editProvider, updated_at: e.target.value })} />
											</div>
										</>
									)}

									<div className="md:col-span-2">
										<Label>Status</Label>
										<Select value={editProvider?.status || "ACTIVE"} onValueChange={(v) => setEditProvider({ ...editProvider, status: v })}>
											<SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
											<SelectContent>
												<SelectItem value="ACTIVE">Active</SelectItem>
												<SelectItem value="INACTIVE">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter className="mt-4">
									<Button onClick={() => {
										if (!selectedCategory || activeProviderIndex === null || !editProvider) return;
										if (!editProvider.name?.trim()) return;
										const provider = providers[activeProviderIndex];
										if (provider && provider.id) {
											updateProviderMutation.mutate({ id: provider.id, data: editProvider });
										}
									}}>Save</Button>
									<Button variant="ghost" onClick={() => { setIsEditProviderOpen(false); setEditProvider(null); setActiveProviderIndex(null); }}>Cancel</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}

					{/* View Provider Dialog - Category Specific Views */}
					{selectedCategory && selectedCategory !== "Events" && selectedCategory !== "Venues" && isViewProviderOpen && viewedProvider && (
						<Dialog open={isViewProviderOpen} onOpenChange={setIsViewProviderOpen}>
							<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
								<DialogHeader className="pb-6">
									<DialogTitle className="text-2xl font-bold flex items-center gap-3">
										{selectedCategory === "Logistics" && <Truck className="h-6 w-6 text-primary" />}
										{selectedCategory === "Catering" && <UtensilsCrossed className="h-6 w-6 text-primary" />}
										{selectedCategory === "Security" && <Shield className="h-6 w-6 text-primary" />}
										{selectedCategory === "Gifts" && <Gift className="h-6 w-6 text-primary" />}
										{selectedCategory === "DJ" && <Music className="h-6 w-6 text-primary" />}
										{selectedCategory === "Photographers" && <Camera className="h-6 w-6 text-primary" />}
										{selectedCategory} Details
									</DialogTitle>
									<p className="text-muted-foreground">Complete information about this {selectedCategory.toLowerCase()} service provider</p>
								</DialogHeader>
								
								<div className="space-y-6">
									{/* Basic Information Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Building2 className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Basic Information</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
											{selectedCategory === "Logistics" && (
												<div><span className="font-semibold">Logistics ID:</span> {viewedProvider.logistics_id || "-"}</div>
											)}
											<div><span className="font-semibold">Company/Service Name:</span> {viewedProvider.name || "-"}</div>
											<div><span className="font-semibold">Contact Number:</span> {viewedProvider.contact || "-"}</div>
											<div><span className="font-semibold">Email:</span> {viewedProvider.email || "-"}</div>
											<div><span className="font-semibold">Website:</span> {viewedProvider.website || "-"}</div>
											<div><span className="font-semibold">Status:</span> 
												<span className={`ml-2 px-2 py-1 rounded-full text-xs ${
													viewedProvider.status === "ACTIVE" 
														? "bg-green-100 text-green-800" 
														: "bg-red-100 text-red-800"
												}`}>
													{viewedProvider.status === "ACTIVE" ? "Active" : "Inactive"}
												</span>
											</div>
											<div className="md:col-span-2"><span className="font-semibold">Address:</span> {viewedProvider.address || "-"}</div>
											<div className="md:col-span-2"><span className="font-semibold">Description:</span> {viewedProvider.description || "-"}</div>
										</div>
									</div>

									{/* Category-Specific Details */}
									{selectedCategory === "Logistics" && (
										<>
											{/* Logistics Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Truck className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Logistics Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div><span className="font-semibold">Service Type:</span> {viewedProvider.service_type || "-"}</div>
													<div><span className="font-semibold">Vehicle Types:</span> {viewedProvider.vehicle_types_available || "-"}</div>
													<div><span className="font-semibold">Equipment Types:</span> {viewedProvider.equipment_types || "-"}</div>
													<div><span className="font-semibold">Capacity Handling:</span> {viewedProvider.capacity_handling || "-"}</div>
													<div><span className="font-semibold">Service Radius:</span> {viewedProvider.service_radius || "-"}</div>
													<div><span className="font-semibold">License Number:</span> {viewedProvider.license_number || "-"}</div>
													<div><span className="font-semibold">Insurance Coverage:</span> {viewedProvider.insurance_coverage || "-"}</div>
													<div className="md:col-span-2"><span className="font-semibold">Available Locations:</span> {viewedProvider.available_locations || "-"}</div>
												</div>
											</div>

											{/* Contact Details Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Phone className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Contact Details</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div><span className="font-semibold">Contact Person:</span> {viewedProvider.contact_person || "-"}</div>
													<div><span className="font-semibold">Contact Number:</span> {viewedProvider.contact_number || "-"}</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Catering" && (
										<>
											{/* Catering Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<UtensilsCrossed className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Catering Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div><span className="font-semibold">Cuisine Types:</span> {viewedProvider.cuisine_types || "-"}</div>
													<div><span className="font-semibold">Menu Categories:</span> {viewedProvider.menu_categories || "-"}</div>
													<div><span className="font-semibold">Serving Capacity:</span> {viewedProvider.serving_capacity || "-"}</div>
													<div><span className="font-semibold">Staff Count:</span> {viewedProvider.staff_count || "-"}</div>
													<div className="md:col-span-2"><span className="font-semibold">Equipment Available:</span> {viewedProvider.equipment_available || "-"}</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div className="flex items-center gap-2">
														<span className="font-semibold">Halal Certified:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.halal_certified 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.halal_certified ? "Yes" : "No"}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-semibold">Vegetarian Options:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.vegetarian_options 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.vegetarian_options ? "Yes" : "No"}
														</span>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Security" && (
										<>
											{/* Security Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Shield className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Security Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div><span className="font-semibold">Security License:</span> {viewedProvider.security_license || "-"}</div>
													<div><span className="font-semibold">Services Offered:</span> {viewedProvider.security_services || "-"}</div>
													<div><span className="font-semibold">Staff Qualifications:</span> {viewedProvider.staff_qualifications || "-"}</div>
													<div><span className="font-semibold">Equipment Provided:</span> {viewedProvider.equipment_provided || "-"}</div>
													<div><span className="font-semibold">Response Time:</span> {viewedProvider.response_time || "-"}</div>
													<div><span className="font-semibold">Patrol Areas:</span> {viewedProvider.patrol_areas || "-"}</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Gifts" && (
										<>
											{/* Gift Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Gift className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Gift Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div><span className="font-semibold">Gift Categories:</span> {viewedProvider.gift_categories || "-"}</div>
													<div><span className="font-semibold">Price Range:</span> {viewedProvider.price_range || "-"}</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
													<div className="flex items-center gap-2">
														<span className="font-semibold">Customization:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.customization_available 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.customization_available ? "Available" : "Not Available"}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-semibold">Delivery:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.delivery_available 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.delivery_available ? "Available" : "Not Available"}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-semibold">Bulk Discounts:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.bulk_discounts 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.bulk_discounts ? "Available" : "Not Available"}
														</span>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "DJ" && (
										<>
											{/* DJ Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Music className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">DJ Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div><span className="font-semibold">Music Genres:</span> {viewedProvider.music_genres || "-"}</div>
													<div><span className="font-semibold">Experience:</span> {viewedProvider.experience_years ? `${viewedProvider.experience_years} years` : "-"}</div>
													<div><span className="font-semibold">Event Types:</span> {viewedProvider.event_types_handled || "-"}</div>
													<div><span className="font-semibold">Sound System Power:</span> {viewedProvider.sound_system_power || "-"}</div>
													<div className="md:col-span-2"><span className="font-semibold">Equipment Owned:</span> {viewedProvider.equipment_owned || "-"}</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div className="flex items-center gap-2">
														<span className="font-semibold">Lighting Available:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.lighting_available 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.lighting_available ? "Yes" : "No"}
														</span>
													</div>
												</div>
											</div>
										</>
									)}

									{selectedCategory === "Photographers" && (
										<>
											{/* Photography Services Section */}
											<div className="space-y-4">
												<div className="flex items-center gap-2 pb-2 border-b border-border">
													<Camera className="h-5 w-5 text-primary" />
													<h3 className="text-lg font-semibold">Photography Services</h3>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div><span className="font-semibold">Photography Style:</span> {viewedProvider.photography_style || "-"}</div>
													<div><span className="font-semibold">Experience:</span> {viewedProvider.years_experience ? `${viewedProvider.years_experience} years` : "-"}</div>
													<div><span className="font-semibold">Equipment Used:</span> {viewedProvider.equipment_used || "-"}</div>
													<div><span className="font-semibold">Portfolio Link:</span> 
														{viewedProvider.portfolio_link ? (
															<a href={viewedProvider.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
																{viewedProvider.portfolio_link}
															</a>
														) : "-"}
													</div>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
													<div className="flex items-center gap-2">
														<span className="font-semibold">Photo Editing:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.editing_services 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.editing_services ? "Available" : "Not Available"}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-semibold">Drone Photography:</span>
														<span className={`px-2 py-1 rounded-full text-xs ${
															viewedProvider.drone_photography 
																? "bg-green-100 text-green-800" 
																: "bg-gray-100 text-gray-800"
														}`}>
															{viewedProvider.drone_photography ? "Available" : "Not Available"}
														</span>
													</div>
												</div>
											</div>
										</>
									)}

									{/* Location Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<MapPin className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Location Coordinates</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
											<div><span className="font-semibold">Latitude:</span> {viewedProvider.latitude || "-"}</div>
											<div><span className="font-semibold">Longitude:</span> {viewedProvider.longitude || "-"}</div>
										</div>
									</div>
								</div>

								<DialogFooter className="pt-6 border-t border-border">
									<Button onClick={() => setIsViewProviderOpen(false)} className="w-full">
										Close
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}

					{/* View Venue Dialog */}
					{selectedCategory === "Venues" && isViewVenueOpen && viewedVenue && (
						<Dialog open={isViewVenueOpen} onOpenChange={setIsViewVenueOpen}>
							<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
								<DialogHeader className="pb-6">
									<DialogTitle className="text-2xl font-bold flex items-center gap-3">
										<Building2 className="h-6 w-6 text-primary" />
										Venue Details
									</DialogTitle>
									<p className="text-muted-foreground">Complete information about this venue</p>
								</DialogHeader>
								
								<div className="space-y-6">
									{/* Basic Information Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Building2 className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Basic Information</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
											<div><span className="font-semibold">Venue ID:</span> {viewedVenue.venue_id || "-"}</div>
											<div><span className="font-semibold">Venue Name:</span> {viewedVenue.name || "-"}</div>
											<div><span className="font-semibold">Contact Number:</span> {viewedVenue.contact || "-"}</div>
											<div><span className="font-semibold">Date Added:</span> {viewedVenue.date ? new Date(viewedVenue.date).toLocaleDateString("en-US") : "-"}</div>
											<div><span className="font-semibold">Venue Type:</span> {viewedVenue.venue_type || "-"}</div>
											<div><span className="font-semibold">Booking Status:</span> 
												<span className={`ml-2 px-2 py-1 rounded-full text-xs ${
													viewedVenue.booking_status === "Available" 
														? "bg-green-100 text-green-800" 
														: viewedVenue.booking_status === "Booked"
														? "bg-red-100 text-red-800"
														: "bg-yellow-100 text-yellow-800"
												}`}>
													{viewedVenue.booking_status || "-"}
												</span>
											</div>
											<div><span className="font-semibold">Status:</span> 
												<span className={`ml-2 px-2 py-1 rounded-full text-xs ${
													viewedVenue.status === "Active" 
														? "bg-green-100 text-green-800" 
														: "bg-red-100 text-red-800"
												}`}>
													{viewedVenue.status || "-"}
												</span>
											</div>
											<div className="md:col-span-2"><span className="font-semibold">Address:</span> {viewedVenue.address || "-"}</div>
											<div className="md:col-span-2"><span className="font-semibold">Description:</span> {viewedVenue.description || "-"}</div>
										</div>
									</div>


									{/* Capacity & Space Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Users className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Capacity & Space</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
											<div><span className="font-semibold">Capacity:</span> {viewedVenue.capacity ?? "-"}</div>
											<div><span className="font-semibold">Total Area (sqft):</span> {viewedVenue.total_area_sqft ?? "-"}</div>
											<div><span className="font-semibold">Parking Capacity:</span> {viewedVenue.parking_capacity ?? "-"}</div>
											<div><span className="font-semibold">Rooms Available:</span> {viewedVenue.rooms_available ?? "-"}</div>
										</div>
									</div>


									{/* Event Support Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<Calendar className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Event Support</h3>
										</div>
										<div className="grid grid-cols-1 gap-4 text-sm">
											<div>
												<span className="font-semibold">Event Types Supported:</span>
												{viewedVenue.event_types_supported ? (
													<div className="mt-2 flex flex-wrap gap-1">
														{viewedVenue.event_types_supported.split(", ").map((type, index) => (
															<span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
																{type}
															</span>
														))}
													</div>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</div>
											<div>
												<span className="font-semibold">Sub Event Types Supported:</span>
												{viewedVenue.sub_event_types_supported ? (
													<div className="mt-2 flex flex-wrap gap-1">
														{viewedVenue.sub_event_types_supported.split(", ").map((type, index) => (
															<span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
																{type}
															</span>
														))}
													</div>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</div>
										</div>
									</div>

									{/* Location Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 pb-2 border-b border-border">
											<MapPin className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">Location Coordinates</h3>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
											<div><span className="font-semibold">Latitude:</span> {viewedVenue.latitude ?? "-"}</div>
											<div><span className="font-semibold">Longitude:</span> {viewedVenue.longitude ?? "-"}</div>
										</div>
									</div>
								</div>

								<DialogFooter className="pt-6 border-t border-border">
									<Button onClick={() => setIsViewVenueOpen(false)} className="w-full">
										Close
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}

					{/* Edit Venue Dialog */}
					{selectedCategory === "Venues" && isEditVenueOpen && editVenue && (
						<Dialog open={isEditVenueOpen} onOpenChange={setIsEditVenueOpen}>
							<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Edit Venue</DialogTitle>
								</DialogHeader>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="e_venue_id">Venue ID</Label>
										<Input id="e_venue_id" value={editVenue.venue_id} onChange={(e) => setEditVenue({ ...editVenue, venue_id: e.target.value })} />
									</div>
									<div>
										<Label htmlFor="e_name">Name</Label>
										<Input id="e_name" value={editVenue.name} onChange={(e) => setEditVenue({ ...editVenue, name: e.target.value })} />
									</div>
									<div>
										<Label htmlFor="e_contact">Contact</Label>
										<Input id="e_contact" value={editVenue.contact} onChange={(e) => setEditVenue({ ...editVenue, contact: e.target.value })} />
									</div>
									<div className="md:col-span-2">
										<Label htmlFor="e_address">Address</Label>
										<Textarea id="e_address" value={editVenue.address} onChange={(e) => setEditVenue({ ...editVenue, address: e.target.value })} />
									</div>
									<div>
										<Label htmlFor="e_date">Date</Label>
										<Input id="e_date" type="date" value={editVenue.date} onChange={(e) => setEditVenue({ ...editVenue, date: e.target.value })} />
									</div>
									<div className="md:col-span-2">
										<Label htmlFor="e_description">Description</Label>
										<Textarea id="e_description" value={editVenue.description} onChange={(e) => setEditVenue({ ...editVenue, description: e.target.value })} />
									</div>

									<div>
										<Label>Venue Type</Label>
										<Select value={editVenue.venue_type} onValueChange={(v) => setEditVenue({ ...editVenue, venue_type: v })}>
											<SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
											<SelectContent>
												<SelectItem value="Indoor">Indoor</SelectItem>
												<SelectItem value="Outdoor">Outdoor</SelectItem>
												<SelectItem value="Hybrid">Hybrid</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Booking Status</Label>
										<Select value={editVenue.booking_status} onValueChange={(v) => setEditVenue({ ...editVenue, booking_status: v })}>
											<SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
											<SelectContent>
												<SelectItem value="Available">Available</SelectItem>
												<SelectItem value="Booked">Booked</SelectItem>
												<SelectItem value="Maintenance">Maintenance</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label>Status</Label>
										<Select value={editVenue.status} onValueChange={(v) => setEditVenue({ ...editVenue, status: v })}>
											<SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
											<SelectContent>
												<SelectItem value="Active">Active</SelectItem>
												<SelectItem value="Inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="e_capacity">Capacity</Label>
										<Input id="e_capacity" type="number" value={editVenue.capacity} onChange={(e) => setEditVenue({ ...editVenue, capacity: e.target.value })} />
									</div>
									<div>
										<Label htmlFor="e_total_area_sqft">Total Area (sqft)</Label>
										<Input id="e_total_area_sqft" type="number" value={editVenue.total_area_sqft} onChange={(e) => setEditVenue({ ...editVenue, total_area_sqft: e.target.value })} />
									</div>
									<div>
										<Label htmlFor="e_parking_capacity">Parking Capacity</Label>
										<Input id="e_parking_capacity" type="number" value={editVenue.parking_capacity} onChange={(e) => setEditVenue({ ...editVenue, parking_capacity: e.target.value })} />
									</div>

									<div>
										<Label htmlFor="e_rooms_available">Rooms Available</Label>
										<Input id="e_rooms_available" type="number" value={editVenue.rooms_available} onChange={(e) => setEditVenue({ ...editVenue, rooms_available: e.target.value })} />
									</div>


									<div className="md:col-span-2">
										<EventTypesDropdown
											selectedEventTypes={editVenue.event_types_supported}
											onEventTypesChange={(types) => setEditVenue({ ...editVenue, event_types_supported: types })}
											selectedSubEventTypes={editVenue.sub_event_types_supported}
											onSubEventTypesChange={(types) => setEditVenue({ ...editVenue, sub_event_types_supported: types })}
											label="Event Types Supported"
										/>
									</div>

									<div>
										<Label htmlFor="e_latitude">Latitude</Label>
										<Input id="e_latitude" type="number" value={editVenue.latitude} onChange={(e) => setEditVenue({ ...editVenue, latitude: e.target.value })} />
									</div>
									<div>
										<Label htmlFor="e_longitude">Longitude</Label>
										<Input id="e_longitude" type="number" value={editVenue.longitude} onChange={(e) => setEditVenue({ ...editVenue, longitude: e.target.value })} />
									</div>
								</div>

								<DialogFooter className="mt-4">
									<Button onClick={handleUpdateVenue}>Save Changes</Button>
									<Button variant="ghost" onClick={() => { setIsEditVenueOpen(false); setEditVenue(null); setActiveVenueIndex(null); }}>Cancel</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
                </>
			)}
            
		</div>
	);
}

