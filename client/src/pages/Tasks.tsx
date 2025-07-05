import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { TaskModal } from "@/components/TaskModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  CheckSquare,
  Clock,
  User
} from "lucide-react";
import type { TaskWithProject } from "@shared/schema";

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithProject | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery<TaskWithProject[]>({
    queryKey: ["/api/tasks"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await apiRequest("PUT", `/api/tasks/${id}`, { 
        completed,
        status: completed ? "completed" : "pending"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleEdit = (task: TaskWithProject) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleComplete = (taskId: number, completed: boolean) => {
    updateMutation.mutate({ id: taskId, completed });
  };

  const groupedTasks = {
    pending: filteredTasks.filter(task => !task.completed && task.status !== "completed"),
    inProgress: filteredTasks.filter(task => !task.completed && task.status === "in_progress"),
    completed: filteredTasks.filter(task => task.completed || task.status === "completed"),
  };

  const renderTaskCard = (task: TaskWithProject) => (
    <Card key={task.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => handleToggleComplete(task.id, checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{task.project.name}</p>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                )}
              </div>
              <div className="flex space-x-1 ml-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(task)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-3">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority} priority
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                {task.assignee && (
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{task.assignee}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Tasks" 
        subtitle="Manage and track project tasks" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Task Management</CardTitle>
              <Button 
                variant="default" 
                size="lg"
                onClick={() => {
                  setSelectedTask(undefined);
                  setShowModal(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Task Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Pending ({groupedTasks.pending.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedTasks.pending.map(renderTaskCard)}
                {groupedTasks.pending.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending tasks</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* In Progress Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>In Progress ({groupedTasks.inProgress.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedTasks.inProgress.map(renderTaskCard)}
                {groupedTasks.inProgress.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks in progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed ({groupedTasks.completed.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedTasks.completed.map(renderTaskCard)}
                {groupedTasks.completed.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No completed tasks</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setSelectedTask(undefined);
        }}
        task={selectedTask}
      />
    </div>
  );
}
