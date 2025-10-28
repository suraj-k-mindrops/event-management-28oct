import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Package, Star, Users } from 'lucide-react';

export default function Packages() {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['event-packages'],
    queryFn: api.getEventPackages,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Event Packages</h1>
        <p className="text-muted-foreground">Browse approved and completed events</p>
      </div>

      {/* Packages Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No event packages yet</h3>
            <p className="text-muted-foreground">
              Approved event packages will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg: any) => (
            <Card key={pkg.id} className="transition-all hover:shadow-md overflow-hidden">
              {pkg.mediaPhotos && (
                <div className="h-48 bg-primary/10 relative overflow-hidden">
                  <img
                    src={pkg.mediaPhotos}
                    alt={pkg.nameOfEvent}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{pkg.nameOfEvent}</CardTitle>
                    <CardDescription className="mt-1">{pkg.typeOfEvent}</CardDescription>
                  </div>
                  {pkg.rating && (
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      {pkg.rating}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(pkg.dateOfEvent).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {pkg.venueLocation}
                  </div>
                  {pkg.totalAttended && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      {pkg.totalAttended} attendees
                    </div>
                  )}
                </div>

                {pkg.theme && (
                  <div className="pt-2 border-t">
                    <p className="text-sm">
                      <span className="font-semibold">Theme:</span> {pkg.theme}
                    </p>
                  </div>
                )}

                {pkg.successMetrics && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {pkg.successMetrics}
                    </p>
                  </div>
                )}

                {pkg.feedback && (
                  <div className="pt-2 border-t">
                    <p className="text-xs italic text-muted-foreground line-clamp-3">
                      "{pkg.feedback}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
