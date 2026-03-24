"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CalendarEvent, CalendarEventCategory } from "@/types/calendar"

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromDatetimeLocal(s: string): Date {
  return new Date(s)
}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  start: z.date(),
  end: z.date(),
  category: z.enum(["personal", "work", "family"]),
}).refine((data) => data.end > data.start, {
  message: "End must be after start",
  path: ["end"],
})

export type EventFormValues = z.infer<typeof eventSchema>

export interface EventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
  defaultStart?: Date
  onSave: (values: EventFormValues, existingId?: string) => void
  onDelete?: (id: string) => void
}

export function EventModal({
  open,
  onOpenChange,
  event,
  defaultStart,
  onSave,
  onDelete,
}: EventModalProps) {
  const isEdit = !!event
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000),
      category: "work",
    },
  })

  React.useEffect(() => {
    if (open) {
      if (event) {
        form.reset({
          title: event.title,
          description: event.description ?? "",
          start: event.start,
          end: event.end,
          category: event.category,
        })
      } else {
        const start = defaultStart ? new Date(defaultStart) : new Date()
        start.setMinutes(0, 0, 0)
        const end = new Date(start.getTime() + 60 * 60 * 1000)
        form.reset({
          title: "",
          description: "",
          start,
          end,
          category: "work",
        })
      }
    }
  }, [open, event, defaultStart, form])

  const onSubmit = (values: EventFormValues) => {
    onSave(values, isEdit && event ? event.id : undefined)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (isEdit && event && onDelete) {
      onDelete(event.id)
      onOpenChange(false)
    }
  }

  const categoryOptions: { value: CalendarEventCategory; label: string }[] = [
    { value: "personal", label: "Personal" },
    { value: "work", label: "Work" },
    { value: "family", label: "Family" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update event details."
              : "Add a new event to your calendar."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={toDatetimeLocal(field.value)}
                      onChange={(e) =>
                        field.onChange(fromDatetimeLocal(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={toDatetimeLocal(field.value)}
                      onChange={(e) =>
                        field.onChange(fromDatetimeLocal(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {isEdit && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
