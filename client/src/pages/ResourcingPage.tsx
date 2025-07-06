import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Clock, AlertTriangle, Plus, Filter, TrendingUp } from "lucide-react";

export default function ResourcingPage() {
  const team = [
    {
      id: 1,
      name: "João Silva",
      role: "Desenvolvedor Frontend",
      avatar: "",
      skills: ["React", "TypeScript", "CSS"],
      availability: 75, // percentual
      currentProjects: ["Sistema de Gestão", "E-commerce"],
      hoursThisWeek: 32,
      capacity: 40,
      hourlyRate: 85
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "Designer UX/UI",
      avatar: "",
      skills: ["Figma", "Adobe XD", "Sketch"],
      availability: 50,
      currentProjects: ["App Mobile"],
      hoursThisWeek: 20,
      capacity: 40,
      hourlyRate: 95
    },
    {
      id: 3,
      name: "Pedro Costa",
      role: "Desenvolvedor Backend",
      avatar: "",
      skills: ["Node.js", "Python", "PostgreSQL"],
      availability: 90,
      currentProjects: ["Sistema de Gestão", "App Mobile"],
      hoursThisWeek: 36,
      capacity: 40,
      hourlyRate: 90
    },
    {
      id: 4,
      name: "Ana Oliveira",
      role: "Consultora",
      avatar: "",
      skills: ["Estratégia", "Gestão", "Análise"],
      availability: 25,
      currentProjects: ["Consultoria Tech Corp"],
      hoursThisWeek: 10,
      capacity: 40,
      hourlyRate: 150
    }
  ];

  const projects = [
    {
      id: 1,
      name: "Sistema de Gestão",
      client: "Tech Corp",
      deadline: "2024-02-15",
      progress: 65,
      requiredSkills: ["React", "Node.js", "PostgreSQL"],
      assignedMembers: [1, 3],
      status: "em_andamento",
      priority: "alta"
    },
    {
      id: 2,
      name: "E-commerce",
      client: "Loja Online",
      deadline: "2024-01-30",
      progress: 40,
      requiredSkills: ["React", "CSS"],
      assignedMembers: [1],
      status: "em_andamento",
      priority: "media"
    },
    {
      id: 3,
      name: "App Mobile",
      client: "StartupXYZ",
      deadline: "2024-03-01",
      progress: 20,
      requiredSkills: ["React Native", "Node.js", "Figma"],
      assignedMembers: [2, 3],
      status: "iniciado",
      priority: "baixa"
    }
  ];

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 70) return "text-red-600";
    if (availability >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Recursos</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe a alocação e capacidade da equipe</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Planejar Recursos
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Capacidade Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {team.reduce((sum, member) => sum + member.capacity, 0)}h
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">por semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Horas Alocadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {team.reduce((sum, member) => sum + member.hoursThisWeek, 0)}h
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Utilização Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(team.reduce((sum, member) => sum + member.availability, 0) / team.length)}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">da capacidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recursos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {team.filter(member => member.availability < 80).length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">pessoas disponíveis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equipe e Capacidade</CardTitle>
            <CardDescription>Visão geral da utilização da equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.map((member) => (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <Badge className={`${getAvailabilityColor(member.availability)} bg-transparent border`}>
                      {member.availability}% ocupado
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Capacidade esta semana</span>
                      <span>{member.hoursThisWeek}h / {member.capacity}h</span>
                    </div>
                    <Progress value={member.availability} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Projetos Ativos</p>
                      <p className="font-semibold">{member.currentProjects.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Taxa/Hora</p>
                      <p className="font-semibold">R$ {member.hourlyRate}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Habilidades</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos Ativos</CardTitle>
            <CardDescription>Status e alocação de recursos por projeto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.client}</p>
                    </div>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Deadline</p>
                      <p className="font-semibold">
                        {new Date(project.deadline).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Equipe</p>
                      <div className="flex -space-x-2">
                        {project.assignedMembers.map((memberId) => {
                          const member = team.find(m => m.id === memberId);
                          return member ? (
                            <Avatar key={memberId} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Habilidades Necessárias</p>
                    <div className="flex flex-wrap gap-1">
                      {project.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas de Recursos</CardTitle>
          <CardDescription>Situações que requerem atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-400">Pedro Costa está sobrecarregado</p>
                <p className="text-sm text-red-600 dark:text-red-300">90% de utilização - considere redistribuir tarefas</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800 dark:text-yellow-400">E-commerce com deadline próximo</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">Prazo em 15 dias - progresso de apenas 40%</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-400">Ana Oliveira disponível para novos projetos</p>
                <p className="text-sm text-green-600 dark:text-green-300">Apenas 25% de utilização - pode assumir mais trabalho</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}