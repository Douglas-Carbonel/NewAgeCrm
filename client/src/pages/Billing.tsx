import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  FileText,
  Play,
  CheckCircle
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UnbilledEntry {
  id: number;
  projectId: number;
  projectName: string;
  clientName: string;
  description: string;
  duration: number;
  hourlyRate: number;
  totalCost: number;
  date: string;
}

interface BillingStats {
  totalUnbilledHours: number;
  totalUnbilledAmount: number;
  totalBilledThisMonth: number;
  averageHourlyRate: number;
}

export default function Billing() {
  const { toast } = useToast();
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  const { data: unbilledEntries = [], isLoading: entriesLoading } = useQuery<UnbilledEntry[]>({
    queryKey: ['/api/billing/unbilled-entries'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<BillingStats>({
    queryKey: ['/api/billing/stats'],
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: async ({ projectId, timeEntryIds }: { projectId: number; timeEntryIds: number[] }) => {
      const res = await fetch('/api/billing/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, timeEntryIds }),
      });
      if (!res.ok) throw new Error('Failed to generate invoice');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing/unbilled-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      setSelectedEntries([]);
      toast({
        title: "Invoice Generated",
        description: "The invoice has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const runAutomaticBillingMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/billing/run-automatic', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to run automatic billing');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing/unbilled-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/stats'] });
      toast({
        title: "Automatic Billing Complete",
        description: `Generated ${data.invoicesGenerated} invoices totaling R$ ${data.totalAmount.toFixed(2)}`,
      });
    },
  });

  const handleGenerateInvoice = () => {
    if (selectedEntries.length === 0) return;

    // Group selected entries by project
    const entriesByProject = new Map<number, number[]>();
    selectedEntries.forEach(entryId => {
      const entry = unbilledEntries.find(e => e.id === entryId);
      if (entry) {
        const projectId = entry.projectId || 0;
        if (!entriesByProject.has(projectId)) {
          entriesByProject.set(projectId, []);
        }
        entriesByProject.get(projectId)!.push(entryId);
      }
    });

    // Generate invoice for the first project (simplified)
    const [projectId, timeEntryIds] = Array.from(entriesByProject.entries())[0];
    generateInvoiceMutation.mutate({ projectId, timeEntryIds });
  };

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (entriesLoading || statsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Invoicing</h1>
          <p className="text-muted-foreground">
            Manage automatic billing and generate invoices from time entries
          </p>
        </div>
        <Button 
          onClick={() => runAutomaticBillingMutation.mutate()}
          disabled={runAutomaticBillingMutation.isPending}
        >
          <Play className="w-4 h-4 mr-2" />
          Run Automatic Billing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unbilled Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatHours(stats?.totalUnbilledHours || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unbilled Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats?.totalUnbilledAmount?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billed This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats?.totalBilledThisMonth?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats?.averageHourlyRate?.toFixed(0) || '0'}/h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unbilled Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Unbilled Time Entries</CardTitle>
              <CardDescription>
                Select entries to generate invoices
              </CardDescription>
            </div>
            <Button 
              onClick={handleGenerateInvoice}
              disabled={selectedEntries.length === 0 || generateInvoiceMutation.isPending}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Invoice ({selectedEntries.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {unbilledEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>All time entries have been billed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unbilledEntries.map((entry) => (
                <div 
                  key={entry.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedEntries.includes(entry.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedEntries(prev => 
                      prev.includes(entry.id)
                        ? prev.filter(id => id !== entry.id)
                        : [...prev, entry.id]
                    );
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.projectName}</span>
                        <Badge variant="outline">{entry.clientName}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">R$ {entry.totalCost.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatHours(entry.duration)} × R$ {entry.hourlyRate}/h
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}