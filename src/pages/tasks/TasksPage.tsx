import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, CheckCircle2, LayoutGrid, List } from "lucide-react";
import { useTasksStore, type Task, type TaskStatus, type TaskPriority } from "@/store/tasksStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ViewMode = "table" | "kanban";

interface TaskFormState {
  id?: string;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
  description?: string;
}

const EMPTY_FORM: TaskFormState = {
  name: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assignedTo: "",
  description: "",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const PRIORITY_BADGE_VARIANT: Record<TaskPriority, string> = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  high: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

function formatDueDate(value?: string) {
  if (!value) return "No due date";
  try {
    return format(new Date(value), "PP");
  } catch {
    return value;
  }
}

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasksStore();
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState<TaskFormState>(EMPTY_FORM);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all" && t.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "all" && t.priority !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const groupedByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    for (const t of filteredTasks) {
      groups[t.status].push(t);
    }
    return groups;
  }, [filteredTasks]);

  const openCreate = () => {
    setFormState(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setFormState({
      id: task.id,
      name: task.name,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? "",
      assignedTo: task.assignedTo ?? "",
      description: task.description ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formState.name.trim()) {
      toast.error("Task name is required");
      return;
    }
    const payload: Omit<Task, "id"> = {
      name: formState.name.trim(),
      status: formState.status,
      priority: formState.priority,
      dueDate: formState.dueDate || undefined,
      assignedTo: formState.assignedTo || undefined,
      description: formState.description || undefined,
    };
    if (formState.id) {
      updateTask(formState.id, payload);
      toast.success("Task updated");
    } else {
      addTask(payload);
      toast.success("Task created");
    }
    setDialogOpen(false);
    setFormState(EMPTY_FORM);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted");
  };

  const handleToggleComplete = (id: string) => {
    toggleComplete(id);
    toast.success("Task status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Lightweight task management for your ecommerce operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border/60 bg-muted/40 p-0.5 text-xs">
            <Button
              type="button"
              size="sm"
              variant={view === "table" ? "secondary" : "ghost"}
              className="h-7 gap-1 px-2"
              onClick={() => setView("table")}
            >
              <List className="h-3 w-3" />
              Table
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "kanban" ? "secondary" : "ghost"}
              className="h-7 gap-1 px-2"
              onClick={() => setView("kanban")}
            >
              <LayoutGrid className="h-3 w-3" />
              Board
            </Button>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New task
          </Button>
        </div>
      </div>

      <Card className="border border-border/60 bg-card/95 shadow-sm backdrop-blur-sm">
        <CardHeader className="gap-4 space-y-0">
          <CardTitle className="text-base">Task list</CardTitle>
          <CardDescription>Track work across your team with statuses and priorities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(v) => setPriorityFilter(v as TaskPriority | "all")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {view === "table" ? (
            <div className="overflow-auto rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due date</TableHead>
                    <TableHead>Assigned to</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        No tasks found. Create your first task to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="max-w-xs">
                          <div className="flex flex-col">
                            <span className="font-medium">{task.name}</span>
                            {task.description && (
                              <span className="truncate text-xs text-muted-foreground">
                                {task.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {STATUS_LABEL[task.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("capitalize border", PRIORITY_BADGE_VARIANT[task.priority])}
                          >
                            {PRIORITY_LABEL[task.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDueDate(task.dueDate)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {task.assignedTo || "Unassigned"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleToggleComplete(task.id)}
                              aria-label="Toggle complete"
                            >
                              <CheckCircle2
                                className={cn(
                                  "h-4 w-4",
                                  task.status === "done"
                                    ? "text-emerald-500"
                                    : "text-muted-foreground"
                                )}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(task)}
                              aria-label="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(task.id)}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {(["todo", "in_progress", "done"] as TaskStatus[]).map((status) => (
                <div
                  key={status}
                  className="flex min-h-[220px] flex-col rounded-lg border border-border/60 bg-muted/40 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {STATUS_LABEL[status]}
                    </span>
                    <Badge variant="outline">
                      {groupedByStatus[status].length}
                    </Badge>
                  </div>
                  <div className="flex-1 space-y-2">
                    {groupedByStatus[status].length === 0 ? (
                      <p className="pt-4 text-xs text-muted-foreground">
                        No tasks in this column yet.
                      </p>
                    ) : (
                      groupedByStatus[status].map((task) => (
                        <div
                          key={task.id}
                          className="group cursor-pointer rounded-md border border-border/60 bg-background/80 p-2 text-xs shadow-sm transition-colors hover:bg-background"
                          onClick={() => openEdit(task)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium">{task.name}</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "ml-1 border",
                                PRIORITY_BADGE_VARIANT[task.priority]
                              )}
                            >
                              {PRIORITY_LABEL[task.priority]}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                            <span>{formatDueDate(task.dueDate)}</span>
                            <span>{task.assignedTo || "Unassigned"}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formState.id ? "Edit task" : "Create task"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-name">Task name</Label>
              <Input
                id="task-name"
                value={formState.name}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="e.g. Review new product listings"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) =>
                    setFormState((s) => ({ ...s, status: value as TaskStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formState.priority}
                  onValueChange={(value) =>
                    setFormState((s) => ({
                      ...s,
                      priority: value as TaskPriority,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formState.dueDate}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, dueDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned user</Label>
                <Input
                  id="assignedTo"
                  value={formState.assignedTo}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, assignedTo: e.target.value }))
                  }
                  placeholder="Name or email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formState.description}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, description: e.target.value }))
                }
                placeholder="Optional context for this task."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              {formState.id ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

