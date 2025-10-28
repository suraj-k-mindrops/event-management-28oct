import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Mail, Phone, Globe, Calendar, MapPin, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function Portfolio() {
  const { user } = useAuth();

  const { data: events = [] } = useQuery({
    queryKey: ['my-events', user?.name],
    queryFn: async () => {
      try {
        const response = await api.getMyEvents(user?.name || '');
        if (Array.isArray(response)) {
          return response;
        }
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
      }
    },
    enabled: !!user?.name,
    retry: false,
  });

  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: () => api.getStudent(user?.id || 0),
    enabled: !!user?.id,
  });

  const approvedEvents = events.filter((e: any) => e.status === 'Approved');

  const handleDownloadPDF = async () => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Header with gradient effect
      doc.setFillColor(147, 51, 234); // Primary color
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text(user?.name || 'Student Portfolio', 20, 25);
      
      doc.setFontSize(12);
      doc.text(user?.email || '', 20, 33);
      
      // Reset colors
      doc.setTextColor(0, 0, 0);
      
      let yPos = 55;
      
      // Profile Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Profile', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      if (studentProfile?.phone) {
        doc.text(`Phone: ${studentProfile.phone}`, 20, yPos);
        yPos += 7;
      }
      if (studentProfile?.organisation) {
        doc.text(`Organization: ${studentProfile.organisation}`, 20, yPos);
        yPos += 7;
      }
      if (studentProfile?.portfolioLink) {
        doc.text(`Portfolio: ${studentProfile.portfolioLink}`, 20, yPos);
        yPos += 7;
      }
      
      yPos += 10;
      
      // Events Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Events Organized', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      if (approvedEvents.length === 0) {
        doc.text('No approved events yet.', 20, yPos);
      } else {
        approvedEvents.forEach((event: any, index: number) => {
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${event.nameOfEvent}`, 20, yPos);
          yPos += 7;
          
          doc.setFont('helvetica', 'normal');
          doc.text(`Type: ${event.typeOfEvent}`, 25, yPos);
          yPos += 6;
          doc.text(`Date: ${new Date(event.dateOfEvent).toLocaleDateString()}`, 25, yPos);
          yPos += 6;
          doc.text(`Venue: ${event.venueLocation}`, 25, yPos);
          yPos += 6;
          
          if (event.theme) {
            doc.text(`Theme: ${event.theme}`, 25, yPos);
            yPos += 6;
          }
          
          if (event.targetAudience) {
            const audience = doc.splitTextToSize(
              `Audience: ${event.targetAudience}`,
              170
            );
            doc.text(audience, 25, yPos);
            yPos += 6 * audience.length;
          }
          
          yPos += 5;
        });
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Generated from StudentHub - Page ${i} of ${pageCount}`,
          20,
          287
        );
      }
      
      doc.save(`${user?.name?.replace(/\s+/g, '_')}_Portfolio.pdf`);
      toast.success('Portfolio downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </div>
                {studentProfile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {studentProfile.phone}
                  </div>
                )}
                {studentProfile?.portfolioLink && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a
                      href={studentProfile.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Portfolio Website
                    </a>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download PDF
            </Button>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-success">{approvedEvents.length}</p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold">
                  {events.length > 0
                    ? Math.round((approvedEvents.length / events.length) * 100)
                    : 0}
                  %
                </p>
              </div>
              <Award className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Showcase */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Event Showcase</h2>
        {approvedEvents.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No approved events yet</h3>
              <p className="text-muted-foreground">
                Your approved events will appear here to showcase your work
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {approvedEvents.map((event: any) => (
              <Card key={event.id} className="transition-all hover:shadow-md overflow-hidden">
                {event.mediaPhotos && (
                  <div className="h-48 bg-primary/10 relative overflow-hidden">
                    <img
                      src={event.mediaPhotos}
                      alt={event.nameOfEvent}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{event.nameOfEvent}</h3>
                    <p className="text-sm text-muted-foreground">{event.typeOfEvent}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(event.dateOfEvent).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.venueLocation}
                    </div>
                  </div>

                  {event.theme && (
                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="font-semibold">Theme:</span> {event.theme}
                      </p>
                    </div>
                  )}

                  {event.targetAudience && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">
                        {event.targetAudience}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
