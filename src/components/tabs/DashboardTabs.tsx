"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="outline" className="w-full">
      <TabsList className="w-full justify-start rounded-lg border bg-transparent p-0 h-auto flex-wrap gap-0">
        <TabsTrigger
          value="outline"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
        >
          Outline
        </TabsTrigger>
        <TabsTrigger
          value="past-performance"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
        >
          Past Performance (3)
        </TabsTrigger>
        <TabsTrigger
          value="key-personnel"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
        >
          Key Personnel (2)
        </TabsTrigger>
        <TabsTrigger
          value="focus-documents"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
        >
          Focus Documents
        </TabsTrigger>
      </TabsList>
      <TabsContent value="outline" className="mt-4">
        <div className="rounded-xl border border-border/50 bg-card/95 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            Outline content. Add your project overview and key objectives here.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="past-performance" className="mt-4">
        <div className="rounded-xl border border-border/50 bg-card/95 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            Past Performance content. 3 items available.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="key-personnel" className="mt-4">
        <div className="rounded-xl border border-border/50 bg-card/95 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            Key Personnel content. 2 items available.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="focus-documents" className="mt-4">
        <div className="rounded-xl border border-border/50 bg-card/95 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            Focus Documents content.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
