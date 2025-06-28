import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  FolderOpen,
  Users,
  CheckSquare,
  Receipt,
  Calendar,
  Target,
  Download
} from "lucide-react";
import type { ProjectWithClient, TaskWithProject, InvoiceWithClient } from "@shared/schema";

export default function Reports() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: projects = [] } = useQuery<ProjectWithClient[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks = [] } = useQuery<TaskWithProject[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: invoices = [] } = useQuery<InvoiceWithClient[]>({
    queryKey: ["/api/invoices"],
  });

  // Calculate project statistics
  const projectStats = {
    total: projects.length,
    planning: projects.filter(p => p.status === "planning").length,
    inProgress: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
    onHold: projects.filter(p => p.status === "on_hold").length,
  };

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length,
  };

  // Calculate invoice statistics
  const invoiceStats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === "draft").length,
    sent: invoices.filter(i => i.status === "sent").length,
    paid: invoices.filter(i => i.status === "paid").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
    totalAmount: invoices.reduce((sum, i) => sum + parseFloat(i.amount), 0),
    paidAmount: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + parseFloat(i.amount), 0),
  };

  // Recent completed projects
  const recentCompletedProjects = projects
    .filter(p => p.status === "completed")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Upcoming deadlines
  const upcomingDeadlines = [
    ...projects
      .filter(p => p.status !== "completed")
      .map(p => ({ type: "project", name: p.name, deadline: p.deadline, client: p.client.company })),
    ...tasks
      .filter(t => !t.completed && t.dueDate)
      .map(t => ({ type: "task", name: t.title, deadline: t.dueDate!, project: t.project.name }))
  ]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 10);

  return (
    <div className="flex-1 overflow-hidden">
      <TopBar 
        title="Reports" 
        subtitle="Analytics and business insights" 
      />
      
      <div className="p-6 overflow-y-auto max-h-screen">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(invoiceStats.paidAmount)}
                  </p>
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    15% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Project Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {projectStats.total > 0 ? Math.round((projectStats.completed / projectStats.total) * 100) : 0}%
                  </p>
                  <p className="text-blue-600 text-sm mt-1 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {projectStats.completed}/{projectStats.total} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Invoices</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(invoiceStats.totalAmount - invoiceStats.paidAmount)}
                  </p>
                  <p className="text-orange-600 text-sm mt-1 flex items-center">
                    <Receipt className="w-4 h-4 mr-1" />
                    {invoiceStats.sent + invoiceStats.overdue} invoices
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Task Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                  </p>
                  <p className="text-purple-600 text-sm mt-1 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-1" />
                    {taskStats.completed}/{taskStats.total} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Status Breakdown */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Status Breakdown</CardTitle>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Planning</span>
                  </div>
                  <span className="font-medium">{projectStats.planning}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">In Progress</span>
                  </div>
                  <span className="font-medium">{projectStats.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Completed</span>
                  </div>
                  <span className="font-medium">{projectStats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">On Hold</span>
                  </div>
                  <span className="font-medium">{projectStats.onHold}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Overview</CardTitle>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total Invoiced</span>
                  <span className="font-medium">{formatCurrency(invoiceStats.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(invoiceStats.paidAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Pending</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(invoiceStats.totalAmount - invoiceStats.paidAmount)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Collection Rate</span>
                    <span className="font-medium">
                      {invoiceStats.totalAmount > 0 
                        ? Math.round((invoiceStats.paidAmount / invoiceStats.totalAmount) * 100)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Completed Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCompletedProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.client.company}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(project.status)}>
                        Completed
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(project.deadline)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {recentCompletedProjects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No completed projects yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      new Date(item.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                        ? 'bg-red-500' 
                        : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {'client' in item ? item.client : item.project}
                      </p>
                      <p className={`text-xs mt-1 ${
                        new Date(item.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                        {formatDate(item.deadline)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {upcomingDeadlines.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
