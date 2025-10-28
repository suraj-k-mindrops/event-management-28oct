import { useParams, useNavigate } from "react-router-dom";
import { User, ArrowLeft, ExternalLink, Mail, Phone, MapPin, Calendar, GraduationCap, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function EventOrganiserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  const { data: studentsResponse, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      return apiClient.getStudents();
    },
  });

  const students = studentsResponse?.data || [];
  const organiser = students.find(s => s.id === Number(id));

  // Fetch directory entries for this student
  const { data: directoryResponse, isLoading: isLoadingDirectory, refetch: refetchDirectory } = useQuery({
    queryKey: ['directory-entries', organiser?.name],
    queryFn: async () => {
      if (!organiser?.name) return { data: [] };
      return apiClient.getDirectoryEntries(organiser.name);
    },
    enabled: !!organiser?.name,
  });

  // Fetch event packages for this student
  const { data: packagesResponse, isLoading: isLoadingPackages, refetch: refetchPackages } = useQuery({
    queryKey: ['event-packages', organiser?.name],
    queryFn: async () => {
      if (!organiser?.name) return { data: [] };
      return apiClient.getEventPackages(organiser.name);
    },
    enabled: !!organiser?.name,
  });

  // Set up refetch interval to check for updates every 10 seconds
  useQuery({
    queryKey: ['directory-entries-refresh', organiser?.name],
    queryFn: async () => {
      await refetchDirectory();
      return true;
    },
    enabled: !!organiser?.name,
    refetchInterval: 10000, // 10 seconds
  });

  useQuery({
    queryKey: ['event-packages-refresh', organiser?.name],
    queryFn: async () => {
      await refetchPackages();
      return true;
    },
    enabled: !!organiser?.name,
    refetchInterval: 10000, // 10 seconds
  });

  const directoryEvents = directoryResponse?.data || [];
  const eventPackages = packagesResponse?.data || [];
  const isLoading = isLoadingStudents || isLoadingDirectory || isLoadingPackages;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!organiser) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/students")}> <ArrowLeft className="h-4 w-4 mr-2" /> Back to Organisers </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Organiser not found</h1>
          <p className="text-muted-foreground">The requested organiser could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate("/students")}> <ArrowLeft className="h-4 w-4 mr-2" /> Back to Organisers </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">{organiser.name}</h1>
          <p className="text-muted-foreground">Event Organiser Profile</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{organiser.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{organiser.phone}</span>
            </div>
            {organiser.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{organiser.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-medium">Status:</span>
              <Badge variant={organiser.status === "ACTIVE" ? "default" : "secondary"}>
                {organiser.status === "ACTIVE" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {organiser.portfolioLink && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              {/** asChild expects a single child element */}
              <a
                href={organiser.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2 flex items-center"
              >
                <ExternalLink className="h-4 w-4" />
                View Portfolio
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Event Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Event Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-blue-50">
              <div>
                <p className="text-sm text-muted-foreground">Directory Events</p>
                <p className="text-3xl font-bold text-foreground">{directoryEvents.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-50" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-green-50">
              <div>
                <p className="text-sm text-muted-foreground">Event Packages</p>
                <p className="text-3xl font-bold text-foreground">{eventPackages.length}</p>
              </div>
              <Package className="h-8 w-8 text-green-600 opacity-50" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-purple-50">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold text-foreground">{directoryEvents.length + eventPackages.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Events */}
      {directoryEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Directory Events ({directoryEvents.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {directoryEvents.map((event: any) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedEvent({ ...event, type: 'directory' });
                  setIsEventDialogOpen(true);
                }}
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{event.nameOfEvent}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.dateOfEvent).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.venueLocation}
                    </span>
                    <Badge variant="outline">{event.typeOfEvent}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Event Packages */}
      {eventPackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Event Packages ({eventPackages.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventPackages.map((event: any) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedEvent({ ...event, type: 'package' });
                  setIsEventDialogOpen(true);
                }}
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{event.nameOfEvent}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.dateOfEvent).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.venueLocation}
                    </span>
                    <Badge variant="outline">{event.typeOfEvent}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Events Message */}
      {directoryEvents.length === 0 && eventPackages.length === 0 && (
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">This student hasn't created any events.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.nameOfEvent}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.type === 'directory' ? 'Directory Event' : 'Event Package'} • {new Date(selectedEvent?.dateOfEvent || '').toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEvent && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type of Event</p>
                    <p className="text-sm">{selectedEvent.typeOfEvent}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Venue Location</p>
                    <p className="text-sm">{selectedEvent.venueLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Event</p>
                    <p className="text-sm">{new Date(selectedEvent.dateOfEvent).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Organizer</p>
                    <p className="text-sm">{selectedEvent.organizerName}</p>
                  </div>
                </div>

                {selectedEvent.theme && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Theme</p>
                      <p className="text-sm">{selectedEvent.theme}</p>
                    </div>
                  </>
                )}

                {selectedEvent.targetAudience && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Target Audience</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedEvent.targetAudience}</p>
                    </div>
                  </>
                )}

                {selectedEvent.teamsDepartmentsWorkprofile && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Teams/Departments/Work Profile</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedEvent.teamsDepartmentsWorkprofile}</p>
                    </div>
                  </>
                )}

                {selectedEvent.miscellaneous && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Additional Details</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedEvent.miscellaneous}</p>
                    </div>
                  </>
                )}

                {selectedEvent.type === 'package' && selectedEvent.successMetrics && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Success Metrics</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedEvent.successMetrics}</p>
                    </div>
                  </>
                )}

                {selectedEvent.type === 'package' && selectedEvent.feedback && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Feedback</p>
                      <p className="text-sm whitespace-pre-wrap">{selectedEvent.feedback}</p>
                    </div>
                  </>
                )}

                {selectedEvent.mediaPhotos && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Photos</p>
                      <p className="text-sm text-primary break-all">{selectedEvent.mediaPhotos}</p>
                    </div>
                  </>
                )}

                {selectedEvent.mediaVideos && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Videos</p>
                      <p className="text-sm text-primary break-all">{selectedEvent.mediaVideos}</p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEventDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
