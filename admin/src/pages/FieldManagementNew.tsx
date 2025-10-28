import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, Search, MapPin, Phone, Building2, Users, Package, Truck, UtensilsCrossed, Shield, Gift, Music, Camera } from "lucide-react";

const STORAGE_KEY = "admin_eve_providers";

const fieldCategories = [
	{ id: "Venues", name: "Venues", icon: Building2, color: "text-blue-600" },
	{ id: "Logistics", name: "Logistics Service Providers", icon: Truck, color: "text-green-600" },
	{ id: "Catering", name: "Catering Service", icon: UtensilsCrossed, color: "text-orange-600" },
	{ id: "Security", name: "Security Agencies", icon: Shield, color: "text-red-600" },
	{ id: "Gifts", name: "Gift Shops", icon: Gift, color: "text-pink-600" },
	{ id: "DJ", name: "DJ Services", icon: Music, color: "text-purple-600" },
	{ id: "Photographers", name: "Photographers", icon: Camera, color: "text-indigo-600" },
];

const sampleData = {
	"Venues": [
		{ name: "Grand Ballroom", contact: "+91 98765 43210", address: "123 MG Road, Bangalore", description: "Luxury ballroom perfect for weddings and corporate events" },
		{ name: "Garden Paradise", contact: "+91 98765 43211", address: "456 Whitefield, Bangalore", description: "Beautiful outdoor venue with garden settings" },
		{ name: "Sky Lounge", contact: "+91 98765 43212", address: "789 Koramangala, Bangalore", description: "Rooftop venue with stunning city views" },
		{ name: "Heritage Palace", contact: "+91 98765 43213", address: "321 Indiranagar, Bangalore", description: "Traditional palace for royal wedding celebrations" },
		{ name: "Modern Convention Center", contact: "+91 98765 43214", address: "654 HSR Layout, Bangalore", description: "State-of-the-art facility for conferences and exhibitions" },
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

export default function FieldManagementNew() {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 9;

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

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}, [data]);

	const currentData = selectedCategory ? data[selectedCategory] || [] : [];

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

	// Calculate stats
	const totalProviders = Object.values(data).reduce((sum: number, arr: any) => sum + arr.length, 0);

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
										<p className="text-2xl font-bold text-foreground mt-1">{totalProviders}</p>
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
							const count = data[category.id]?.length || 0;
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
			) : (
				<>
					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={`Search ${selectedCategory.toLowerCase()}...`}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 h-10"
						/>
					</div>

					{/* Providers Grid */}
					{filteredData.length === 0 ? (
						<Card className="border border-border">
							<CardContent className="p-12 flex items-center justify-center">
								<p className="text-muted-foreground text-sm">No providers found.</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{paginatedData.map((provider: any, idx: number) => {
								const categoryInfo = getCategoryIcon(selectedCategory);
								const Icon = categoryInfo.icon;
								return (
									<Card key={idx} className="border border-border bg-card hover:shadow-md transition-all">
										<CardHeader className="pb-3">
											<div className="flex items-start gap-3">
												<div className={`h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0`}>
													<Icon className={`h-6 w-6 ${categoryInfo.color}`} />
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-bold text-base text-foreground leading-tight">{provider.name}</h3>
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="space-y-2">
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<Phone className="h-3.5 w-3.5 text-primary shrink-0" />
													<span className="truncate">{provider.contact}</span>
												</div>
												<div className="flex items-start gap-2 text-xs text-muted-foreground">
													<MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
													<span className="line-clamp-2">{provider.address}</span>
												</div>
												<div className="flex items-start gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
													<Building2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
													<span className="line-clamp-3">{provider.description}</span>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
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
				</>
			)}
		</div>
	);
}

