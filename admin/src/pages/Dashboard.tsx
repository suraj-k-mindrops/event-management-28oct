import { Users, Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVenues, useEventTypes, useVendors, useNewsItems } from "@/hooks/useApiData";

export default function Dashboard() {
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const { data: eventTypes, isLoading: eventTypesLoading } = useEventTypes();
  const { data: vendors, isLoading: vendorsLoading } = useVendors();
  const { data: newsItems, isLoading: newsLoading } = useNewsItems();

  // Calculate stats from real data
  const totalFields = venues?.length || 0;
  const activeFields = venues?.filter(venue => venue.rating && venue.rating > 0).length || 0;
  const totalEventTypes = eventTypes?.length || 0;
  const activeEventTypes = eventTypes?.length || 0; // All event types are considered active
  const totalVendors = vendors?.length || 0;
  const activeVendors = vendors?.length || 0;
  const totalNews = newsItems?.length || 0;
  const publishedNews = newsItems?.filter(news => news.status === 'Published').length || 0;
  const totalEvents = 0; // This would need to be calculated from actual events
  const totalBookings = 0; // This would need to be calculated from actual bookings

  const stats = [
    {
      title: "Total Fields",
      value: totalFields.toString(),
      icon: Users,
      trend: { value: 12, isPositive: true },
      description: `${activeFields} active`,
      isLoading: venuesLoading,
    },
    {
      title: "Event Types",
      value: totalEventTypes.toString(),
      icon: CheckCircle,
      trend: { value: 8, isPositive: true },
      description: `${activeEventTypes} active`,
      isLoading: eventTypesLoading,
    },
    {
      title: "Total Events",
      value: totalEvents.toString(),
      icon: Calendar,
      trend: { value: 15, isPositive: true },
      description: `${totalBookings} bookings`,
      isLoading: false,
    },
    {
      title: "News Articles",
      value: totalNews.toString(),
      icon: FileText,
      description: `${publishedNews} published`,
      isLoading: newsLoading,
    },
  ];

  // Generate upcoming events based on event types (mock data)
  const allUpcomingEvents = (eventTypes || []).slice(0, 5).map((type, index) => ({
    id: type.event_type_id || type.id,
    name: `${type.name} Conference`,
    date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    attendees: Math.floor(Math.random() * 300) + 50,
  }));

  // Generate recent events based on event types (mock data)
  const allRecentEvents = (eventTypes || []).slice(0, 5).map((type, index) => ({
    id: type.event_type_id || type.id,
    name: `${type.name} Workshop`,
    date: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "Completed",
  }));

  const upcomingEvents = allUpcomingEvents;
  const recentEvents = allRecentEvents;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor your event management system performance
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">Next 30 days schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventTypesLoading
                ? [...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 rounded border border-border">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 w-40 bg-muted rounded" />
                        <div className="h-3 w-28 bg-muted rounded" />
                      </div>
                    </div>
                  ))
                : upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{event.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{event.attendees}</p>
                        <p className="text-[10px] text-muted-foreground">guests</p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Completed Events</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-xs">Recent completions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventTypesLoading
                ? [...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 rounded border border-border">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 w-40 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                  ))
                : recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 rounded border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{event.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-semibold">
                        {event.status}
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
