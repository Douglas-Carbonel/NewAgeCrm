import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { Play, Pause, Square, Clock, Calendar, Target } from "lucide-react";
import type { ProjectWithClient, TaskWithProject } from "@shared/schema";

interface TimeEntry {
  id: number;
  projectId: number;
  taskId?: number;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  hourlyRate: number;
  totalCost: number;
  isActive: boolean;
}

export function TimeTracker() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery<ProjectWithClient[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks = [] } = useQuery<TaskWithProject[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: timeEntries = [] } = useQuery<TimeEntry[]>({
    queryKey: ["/api/time-entries"],
  });

  // Filter tasks by selected project
  const projectTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject)
    : [];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(activeTimer.startTime);
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const startTimerMutation = useMutation({
    mutationFn: async (data: { projectId: number; taskId?: number; description: string }) => {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data: TimeEntry) => {
      setActiveTimer(data);
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
    }
  });

  const stopTimerMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const response = await fetch(`/api/time-entries/${entryId}/stop`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      setActiveTimer(null);
      setElapsedTime(0);
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
    }
  });

  const handleStartTimer = () => {
    if (!selectedProject) return;
    
    startTimerMutation.mutate({
      projectId: selectedProject,
      taskId: selectedTask || undefined,
      description: description || "Trabalho no projeto"
    });
  };

  const handleStopTimer = () => {
    if (activeTimer) {
      stopTimerMutation.mutate(activeTimer.id);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Calculate today's totals
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = timeEntries.filter(entry => 
    entry.startTime.startsWith(today)
  );
  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const todayRevenue = todayEntries.reduce((sum, entry) => sum + entry.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Timer Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Controle de Tempo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Timer Display */}
          {activeTimer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-mono font-bold text-green-700">
                      {formatTime(elapsedTime)}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">{activeTimer.description}</p>
                </div>
                <Button 
                  onClick={handleStopTimer}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </Button>
              </div>
            </div>
          )}

          {/* Timer Setup */}
          {!activeTimer && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Projeto *
                  </label>
                  <Select onValueChange={(value) => setSelectedProject(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tarefa (opcional)
                  </label>
                  <Select 
                    onValueChange={(value) => setSelectedTask(parseInt(value))}
                    disabled={!selectedProject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tarefa" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTasks.map((task) => (
                        <SelectItem key={task.id} value={task.id.toString()}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Descrição
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que você está trabalhando?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button 
                onClick={handleStartTimer}
                disabled={!selectedProject || startTimerMutation.isPending}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Timer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(todayTotal)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(todayRevenue)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entradas</p>
                <p className="text-2xl font-bold text-gray-900">{todayEntries.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Entradas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.slice(0, 5).map((entry) => {
              const project = projects.find(p => p.id === entry.projectId);
              const task = tasks.find(t => t.id === entry.taskId);
              
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{entry.description}</p>
                      {entry.isActive && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Ativo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {project?.name} {task && `• ${task.title}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatTime(entry.duration)}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(entry.totalCost)}</p>
                  </div>
                </div>
              );
            })}
            
            {timeEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma entrada de tempo registrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}