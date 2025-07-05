
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Edit3, 
  Trash2,
  Save,
  X
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ProjectWithClient } from "@shared/schema";

interface TimeEntry {
  id: number;
  projectId: number;
  taskId?: number;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number;
  hourlyRate: number;
  totalCost: number;
  isActive: boolean;
  createdAt: string;
}

interface Task {
  id: number;
  title: string;
  projectId: number;
}

export function TimeTracker() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [description, setDescription] = useState("");
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ description: string; duration: number; hourlyRate: number }>({
    description: "",
    duration: 0,
    hourlyRate: 85
  });

  const { data: projects = [] } = useQuery<ProjectWithClient[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: activeTimer } = useQuery<TimeEntry | null>({
    queryKey: ["/api/time-tracking/active"],
    refetchInterval: 1000, // Refresh every second
  });

  const { data: timeEntries = [] } = useQuery<TimeEntry[]>({
    queryKey: ["/api/time-tracking/entries"],
  });

  const startTimerMutation = useMutation({
    mutationFn: async (data: { projectId: number; taskId?: number; description: string }) => {
      const res = await fetch('/api/time-tracking/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to start timer');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-tracking'] });
      setDescription("");
      toast({ title: "Timer iniciado", description: "Começando a rastrear o tempo" });
    },
  });

  const stopTimerMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const res = await fetch(`/api/time-tracking/stop/${entryId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to stop timer');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-tracking'] });
      toast({ title: "Timer parado", description: "Tempo registrado com sucesso" });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ entryId, updates }: { entryId: number; updates: any }) => {
      const res = await fetch(`/api/time-tracking/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-tracking'] });
      setEditingEntry(null);
      toast({ title: "Entrada atualizada", description: "Alterações salvas com sucesso" });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const res = await fetch(`/api/time-tracking/entries/${entryId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete entry');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-tracking'] });
      toast({ title: "Entrada removida", description: "Registro de tempo excluído" });
    },
  });

  const handleStartTimer = () => {
    if (!selectedProject || !description.trim()) {
      toast({
        title: "Erro",
        description: "Selecione um projeto e adicione uma descrição",
        variant: "destructive"
      });
      return;
    }

    startTimerMutation.mutate({
      projectId: parseInt(selectedProject),
      taskId: selectedTask ? parseInt(selectedTask) : undefined,
      description: description.trim()
    });
  };

  const handleStopTimer = () => {
    if (activeTimer) {
      stopTimerMutation.mutate(activeTimer.id);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatActiveTime = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    return formatDuration(diff);
  };

  const filteredTasks = tasks.filter(task => 
    selectedProject ? task.projectId === parseInt(selectedProject) : false
  );

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
          {activeTimer ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Timer Ativo</p>
                  <p className="text-sm text-green-600 dark:text-green-300">{activeTimer.description}</p>
                  <p className="text-xs text-green-500">
                    {projects.find(p => p.id === activeTimer.projectId)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {formatActiveTime(activeTimer.startTime)}
                  </p>
                  <Button
                    onClick={handleStopTimer}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Parar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Projeto *
                </label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name} - {project.client?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Tarefa (opcional)
                </label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma tarefa" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id.toString()}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Descrição *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que você está fazendo..."
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  onClick={handleStartTimer}
                  disabled={startTimerMutation.isPending}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Timer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.slice(0, 10).map((entry) => {
              const project = projects.find(p => p.id === entry.projectId);
              const task = tasks.find(t => t.id === entry.taskId);
              const isEditing = editingEntry === entry.id;

              return (
                <div key={entry.id} className="border rounded-lg p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          value={editData.duration}
                          onChange={(e) => setEditData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                          placeholder="Duração (minutos)"
                        />
                        <Input
                          type="number"
                          value={editData.hourlyRate}
                          onChange={(e) => setEditData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                          placeholder="Taxa por hora"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateEntryMutation.mutate({ entryId: entry.id, updates: editData })}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingEntry(null)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project?.name}</span>
                          {task && <Badge variant="outline">{task.title}</Badge>}
                          {entry.isActive && <Badge variant="default">Ativo</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{entry.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString('pt-BR')} • {formatDuration(entry.duration)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(entry.totalCost)}</div>
                        <div className="text-sm text-gray-500">R$ {entry.hourlyRate}/h</div>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingEntry(entry.id);
                              setEditData({
                                description: entry.description,
                                duration: entry.duration,
                                hourlyRate: entry.hourlyRate
                              });
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteEntryMutation.mutate(entry.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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
