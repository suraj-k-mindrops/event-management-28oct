import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your account information
          </p>
        </div>
      </div>
      
      <Card className="border border-border">
        <CardContent className="p-12 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Profile page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
