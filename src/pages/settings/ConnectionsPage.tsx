import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Connections</h2>
        <p className="text-muted-foreground">
          Manage integrations with external services and developer APIs.
        </p>
      </div>

      <Card className="max-w-3xl border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect the ecommerce backend to analytics, email, and payment providers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
            <div>
              <p className="font-medium">Stripe</p>
              <p className="text-xs text-muted-foreground">
                Use Stripe for secure card payments in your ecommerce API.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Configured in backend</Badge>
              <Button size="sm" variant="outline">
                View docs
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
            <div>
              <p className="font-medium">SMTP / Email</p>
              <p className="text-xs text-muted-foreground">
                Configure email sender details via environment variables.
              </p>
            </div>
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </div>
          <Separator />
          <div className="space-y-1">
            <p className="font-medium">API access</p>
            <p className="text-xs text-muted-foreground">
              This admin dashboard communicates with the Node.js ecommerce API over HTTPS using JWT.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

