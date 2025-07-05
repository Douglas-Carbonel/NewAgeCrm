import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  FileText,
  MessageSquare
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Approval {
  id: number;
  entityType: string;
  entityId: number;
  entityName?: string;
  requestedBy: string;
  approvedBy: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  comments: string;
  requestedAt: string;
  reviewedAt: string | null;
}

interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  averageProcessingTime: number;
  byEntityType: {
    project: number;
    task: number;
    invoice: number;
    contract: number;
  };
}

export default function Approvals() {
  const { toast } = useToast();
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [comments, setComments] = useState("");

  const { data: approvals = [], isLoading } = useQuery<Approval[]>({
    queryKey: ['/api/approvals'],
  });

  const { data: stats } = useQuery<ApprovalStats>({
    queryKey: ['/api/approvals/stats'],
  });

  const processApprovalMutation = useMutation({
    mutationFn: async ({ 
      approvalId, 
      status, 
      comments 
    }: { 
      approvalId: number; 
      status: 'approved' | 'rejected'; 
      comments: string;
    }) => {
      const res = await fetch(`/api/approvals/${approvalId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          comments, 
          approvedBy: 'current_user' // In a real app, this would be the logged-in user
        }),
      });
      if (!res.ok) throw new Error('Failed to process approval');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/approvals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/approvals/stats'] });
      setSelectedApproval(null);
      setComments("");
      toast({
        title: "Approval Processed",
        description: "The approval has been processed successfully.",
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

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const processedApprovals = approvals.filter(a => a.status !== 'pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case 'invoice': return <FileText className="w-4 h-4" />;
      case 'project': return <TrendingUp className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">
          Review and process pending approvals
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Process Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageProcessingTime.toFixed(1)}h
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed ({processedApprovals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p className="text-muted-foreground">No pending approvals!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingApprovals.map((approval) => (
                <Card key={approval.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getEntityTypeIcon(approval.entityType)}
                        <div>
                          <CardTitle className="text-lg">
                            {approval.entityName || `${approval.entityType} #${approval.entityId}`}
                          </CardTitle>
                          <CardDescription>
                            Requested by {approval.requestedBy} • {approval.entityType}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(approval.status)}>
                        {approval.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {approval.reason && (
                        <div>
                          <label className="text-sm font-medium">Reason:</label>
                          <p className="text-sm text-muted-foreground">{approval.reason}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            processApprovalMutation.mutate({
                              approvalId: approval.id,
                              status: 'approved',
                              comments: ''
                            });
                          }}
                          disabled={processApprovalMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedApproval(approval)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Review with Comments
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            processApprovalMutation.mutate({
                              approvalId: approval.id,
                              status: 'rejected',
                              comments: 'Rejected without comments'
                            });
                          }}
                          disabled={processApprovalMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          <div className="grid gap-4">
            {processedApprovals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getEntityTypeIcon(approval.entityType)}
                      <div>
                        <CardTitle className="text-lg">
                          {approval.entityName || `${approval.entityType} #${approval.entityId}`}
                        </CardTitle>
                        <CardDescription>
                          {approval.status === 'approved' ? 'Approved' : 'Rejected'} by {approval.approvedBy} • 
                          {approval.reviewedAt && new Date(approval.reviewedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(approval.status)}>
                      {approval.status}
                    </Badge>
                  </div>
                </CardHeader>
                {approval.comments && (
                  <CardContent>
                    <div>
                      <label className="text-sm font-medium">Comments:</label>
                      <p className="text-sm text-muted-foreground">{approval.comments}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Review Approval</CardTitle>
              <CardDescription>
                {selectedApproval.entityName || `${selectedApproval.entityType} #${selectedApproval.entityId}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Comments:</label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add your review comments..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    processApprovalMutation.mutate({
                      approvalId: selectedApproval.id,
                      status: 'approved',
                      comments
                    });
                  }}
                  disabled={processApprovalMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    processApprovalMutation.mutate({
                      approvalId: selectedApproval.id,
                      status: 'rejected',
                      comments
                    });
                  }}
                  disabled={processApprovalMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedApproval(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}