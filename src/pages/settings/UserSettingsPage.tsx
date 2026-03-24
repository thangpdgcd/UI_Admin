import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function UserSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">User Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal profile information used across the admin dashboard.
        </p>
      </div>

      <Card className="w-full border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>
            Basic information about you that may be visible to other admins and staff.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Short bio to show in your profile."
              disabled
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" disabled>
              Cancel
            </Button>
            <Button size="sm" disabled>
              Save changes
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Profile editing is available in the Account Settings page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

