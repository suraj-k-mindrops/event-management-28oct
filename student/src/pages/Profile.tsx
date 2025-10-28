import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Building, Globe, MapPin, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: studentProfile, isLoading } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: () => api.getStudent(user?.id || 0),
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateStudent(user?.id || 0, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const profileData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      portfolioLink: formData.get('portfolioLink') as string,
      address: formData.get('address') as string,
      organisation: formData.get('organisation') as string,
    };

    updateMutation.mutate(profileData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Student
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      defaultValue={studentProfile?.name || user?.name}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={studentProfile?.phone}
                      className="pl-10"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organisation">Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="organisation"
                      name="organisation"
                      defaultValue={studentProfile?.organisation}
                      className="pl-10"
                      placeholder="University or Company"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioLink">Portfolio Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="portfolioLink"
                      name="portfolioLink"
                      type="url"
                      defaultValue={studentProfile?.portfolioLink}
                      className="pl-10"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    name="address"
                    defaultValue={studentProfile?.address}
                    className="pl-10 min-h-[80px]"
                    placeholder="Your full address"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium">{user?.email}</p>
                </div>
                {studentProfile?.phone && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>Phone</span>
                    </div>
                    <p className="font-medium">{studentProfile.phone}</p>
                  </div>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {studentProfile?.organisation && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>Organization</span>
                    </div>
                    <p className="font-medium">{studentProfile.organisation}</p>
                  </div>
                )}
                {studentProfile?.portfolioLink && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Portfolio</span>
                    </div>
                    <a
                      href={studentProfile.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      View Portfolio
                    </a>
                  </div>
                )}
              </div>

              {studentProfile?.address && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Address</span>
                  </div>
                  <p className="font-medium">{studentProfile.address}</p>
                </div>
              )}

              {!studentProfile?.phone &&
                !studentProfile?.organisation &&
                !studentProfile?.portfolioLink &&
                !studentProfile?.address && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No additional information provided yet.</p>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      Add Information
                    </Button>
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
