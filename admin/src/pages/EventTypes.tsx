import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

const initialCategories = [
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

export default function EventCategoryAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [targetCategoryIndex, setTargetCategoryIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch event types from API
  const { data: eventTypes = [], isLoading } = useQuery({
    queryKey: ['event-types'],
    queryFn: async () => {
      try {
        const data = await apiClient.getEventTypes();
        return data || [];
      } catch (error) {
        console.error('Error fetching event types:', error);
        return [];
      }
    },
    retry: false,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Map event types to category format
  const categories = React.useMemo(() => {
    if (!eventTypes || eventTypes.length === 0) {
      // Fallback to initial categories if no data
      try {
        const raw = localStorage.getItem('admin_eve_event_categories_simple');
        if (raw) return JSON.parse(raw);
      } catch {}
      return initialCategories;
    }

    // Group by category if the data structure supports it
    return eventTypes;
  }, [eventTypes]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (eventType: any) => {
      return await apiClient.createEventType(eventType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
      setAddCategoryOpen(false);
      setAddSubOpen(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiClient.updateEventType(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiClient.deleteEventType(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] });
    },
  });

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.subEvents.some((sub) => sub.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const onAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.some(c => c.name?.toLowerCase() === name.toLowerCase())) return;
    
    // Initialize with empty subEvents array
    createMutation.mutate({
      name,
      category: name,
      color: '#6366f1', // Default color
      description: '',
      subEvents: [], // Initialize with empty array
      active: true,
    });
    
    setNewCategoryName("");
  };

  const onAddSub = () => {
    if (targetCategoryIndex === null) return;
    const name = newSubName.trim();
    if (!name) return;
    
    const targetCategory = categories[targetCategoryIndex];
    const existingSubEvents = Array.isArray(targetCategory.subEvents) ? targetCategory.subEvents : [];
    const updatedSubEvents = [...existingSubEvents, name];
    
    console.log('Updating category:', targetCategory.name, 'with subEvents:', updatedSubEvents);
    
    updateMutation.mutate({
      id: targetCategory.id,
      data: {
        name: targetCategory.name,
        category: targetCategory.category || targetCategory.name,
        color: targetCategory.color || '#6366f1',
        description: targetCategory.description || '',
        subEvents: updatedSubEvents,
        active: targetCategory.active !== undefined ? targetCategory.active : true,
      },
    });
    
    setNewSubName("");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Event Category Management</h1>
        <Button className="flex items-center gap-2" onClick={() => setAddCategoryOpen(true)}>
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCategories.map((category, index) => (
          <Card key={index} className="shadow-md border rounded-2xl relative">
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => { return; }}><Edit2 size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => {
                if (confirm('Are you sure you want to delete this event type?')) {
                  deleteMutation.mutate(category.id);
                }
              }}><Trash2 size={16} /></Button>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-2">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.subEvents.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-1"
                >
                  <span>{sub}</span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => { return; }}><Edit2 size={14} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      if (confirm('Are you sure you want to delete this sub-event?')) {
                        const targetCategory = categories[index];
                        const updatedSubEvents = targetCategory.subEvents?.filter((_, si) => si !== i) || [];
                        console.log('Deleting sub-event from:', targetCategory.name, 'updated:', updatedSubEvents);
                        updateMutation.mutate({
                          id: targetCategory.id,
                          data: {
                            name: targetCategory.name,
                            category: targetCategory.category || targetCategory.name,
                            color: targetCategory.color || '#6366f1',
                            description: targetCategory.description || '',
                            subEvents: updatedSubEvents,
                            active: targetCategory.active !== undefined ? targetCategory.active : true,
                          },
                        });
                      }
                    }}><Trash2 size={14} /></Button>
                  </div>
                </div>
              ))}
              {/* Plus button after the last sub-event */}
              <div className="flex items-center justify-between border-b pb-1 border-dashed border-gray-300">
                <span className="text-gray-500 text-sm">Add new sub-event</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => { setTargetCategoryIndex(index); setNewSubName(""); setAddSubOpen(true); }}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <Button className="w-full mt-2" variant="outline" onClick={() => { setTargetCategoryIndex(index); setNewSubName(""); setAddSubOpen(true); }}>
                <Plus size={14} className="mr-1" /> Add Sub-Event
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add More Card */}
        <div className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-2xl p-10 bg-white hover:bg-gray-100 transition cursor-pointer" onClick={() => setAddCategoryOpen(true)}>
          <Plus size={30} className="text-gray-600 mb-2" />
          <span className="text-gray-600 font-medium">Add More</span>
        </div>
      </div>

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
      <CategoryDialogs
        addCategoryOpen={addCategoryOpen}
        setAddCategoryOpen={setAddCategoryOpen}
        addSubOpen={addSubOpen}
        setAddSubOpen={setAddSubOpen}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newSubName={newSubName}
        setNewSubName={setNewSubName}
        categories={categories}
        targetCategoryIndex={targetCategoryIndex}
        onAddCategory={onAddCategory}
        onAddSub={onAddSub}
      />
    </div>
  );
}

// Dialogs mounted at root via portals
function CategoryDialogs({
  addCategoryOpen,
  setAddCategoryOpen,
  addSubOpen,
  setAddSubOpen,
  newCategoryName,
  setNewCategoryName,
  newSubName,
  setNewSubName,
  categories,
  targetCategoryIndex,
  onAddCategory,
  onAddSub,
}: {
  addCategoryOpen: boolean;
  setAddCategoryOpen: (v: boolean) => void;
  addSubOpen: boolean;
  setAddSubOpen: (v: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (v: string) => void;
  newSubName: string;
  setNewSubName: (v: string) => void;
  categories: { name: string; subEvents: string[] }[];
  targetCategoryIndex: number | null;
  onAddCategory: () => void;
  onAddSub: () => void;
}) {
  return (
    <>
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new event category.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="catName">Category Name</Label>
            <Input id="catName" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g., Social Events" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>Cancel</Button>
            <Button onClick={onAddCategory}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addSubOpen} onOpenChange={setAddSubOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Sub-Event</DialogTitle>
            <DialogDescription>{targetCategoryIndex !== null ? categories[targetCategoryIndex]?.name : "Select a card first"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="subName">Sub-Event Name</Label>
            <Input id="subName" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} placeholder="e.g., Wedding" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubOpen(false)}>Cancel</Button>
            <Button onClick={onAddSub} disabled={targetCategoryIndex === null}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
