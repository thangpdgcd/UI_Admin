import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          Control when and how you receive updates about your store.
        </p>
      </div>

      <Card className="max-w-3xl border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Email notifications</CardTitle>
          <CardDescription>
            Choose which events should trigger an email to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm">
              <Checkbox defaultChecked />
              <div className="space-y-0.5">
                <Label>New orders</Label>
                <p className="text-xs text-muted-foreground">
                  Receive an email each time a new order is created.
                </p>
              </div>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm">
              <Checkbox defaultChecked />
              <div className="space-y-0.5">
                <Label>Failed payments</Label>
                <p className="text-xs text-muted-foreground">
                  Alerts when Stripe or cash payments fail to complete.
                </p>
              </div>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm">
              <Checkbox />
              <div className="space-y-0.5">
                <Label>New reviews</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when customers leave product reviews.
                </p>
              </div>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

