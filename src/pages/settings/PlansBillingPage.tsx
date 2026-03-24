import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function PlansBillingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Plans &amp; Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription, invoices, and payment methods.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1.2fr)]">
        <Card className="border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle>Current plan</CardTitle>
              <CardDescription>
                You are currently on the <span className="font-medium">Pro</span> plan.
              </CardDescription>
            </div>
            <Badge>Active</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Pro</p>
                  <p className="text-xs text-muted-foreground">
                    Best for small teams running a single ecommerce store.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold">$29</p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
              <Separator className="my-3" />
              <ul className="grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                <li>Up to 5 admin users</li>
                <li>Unlimited products</li>
                <li>All reporting dashboards</li>
                <li>Email support</li>
              </ul>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <p>Next invoice on <span className="font-medium">May 1, 2026</span>.</p>
              <Button size="sm" variant="outline">
                Change plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Billing details</CardTitle>
            <CardDescription>Invoices and payment methods for this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Payment method</p>
              <p className="text-muted-foreground">
                No payment method on file. Connect Stripe or add a card in your backend integration.
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="font-medium">Invoices</p>
              <p className="text-muted-foreground">
                When connected to the ecommerce backend&apos;s Stripe configuration, invoices will appear here.
              </p>
            </div>
            <Separator />
            <Button variant="outline" size="sm" disabled className="w-full">
              Connect billing (backend required)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

