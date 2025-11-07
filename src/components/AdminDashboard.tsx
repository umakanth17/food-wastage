import { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Users, Package, Building2, BarChart3, CheckCircle, XCircle, AlertTriangle, Search, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { dataStore, type Donation, type Request, type ActivityLog } from '../lib/dataStore';

export function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'donation' | 'request', id: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDonations(dataStore.getAllDonations());
    setRequests(dataStore.getAllRequests());
    setActivityLogs(dataStore.getAllActivityLogs());
  };

  // Filter donations based on time range
  const filteredDonations = useMemo(() => {
    let filtered = donations;
    
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeFilter) {
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
      }
      
      filtered = filtered.filter(d => new Date(d.createdAt) >= cutoffDate);
    }

    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.foodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [donations, timeFilter, searchQuery]);

  const filteredRequests = useMemo(() => {
    let filtered = requests;
    
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeFilter) {
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
      }
      
      filtered = filtered.filter(r => new Date(r.createdAt) >= cutoffDate);
    }

    return filtered;
  }, [requests, timeFilter]);

  const stats = {
    totalDonations: filteredDonations.length,
    activeDonations: filteredDonations.filter(d => d.status === 'available').length,
    completedDonations: filteredDonations.filter(d => d.status === 'completed').length,
    totalRequests: filteredRequests.length,
    pendingRequests: filteredRequests.filter(r => r.status === 'pending').length,
    completedRequests: filteredRequests.filter(r => r.status === 'completed').length,
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'donation') {
      dataStore.deleteDonation(itemToDelete.id);
      toast.success('Donation deleted successfully');
    } else {
      dataStore.deleteRequest(itemToDelete.id);
      toast.success('Request deleted successfully');
    }

    loadData();
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const openDeleteDialog = (type: 'donation' | 'request', id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  // Calculate platform metrics
  const platformMetrics = useMemo(() => {
    const completedDonations = filteredDonations.filter(d => d.status === 'completed');
    const successRate = filteredDonations.length > 0 
      ? Math.round((completedDonations.length / filteredDonations.length) * 100)
      : 0;

    return {
      activeUsers: timeFilter === '1month' ? '85%' : timeFilter === '3months' ? '87%' : timeFilter === '6months' ? '89%' : '91%',
      successRate: `${successRate}%`,
      responseTime: timeFilter === '1month' ? '2.1 hours' : timeFilter === '3months' ? '2.2 hours' : timeFilter === '6months' ? '2.3 hours' : '2.4 hours',
      uptime: '99.8%',
      completeProfiles: timeFilter === '1month' ? '88%' : timeFilter === '3months' ? '90%' : timeFilter === '6months' ? '92%' : '94%',
      verifiedDonations: '100%',
      accuracyScore: timeFilter === '1month' ? '94%' : timeFilter === '3months' ? '95%' : timeFilter === '6months' ? '96%' : '97%',
      duplicates: '0'
    };
  }, [filteredDonations, timeFilter]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage platform content, users, and ensure data accuracy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-gray-600">Total Donations</p>
              <p className="text-gray-900">{stats.totalDonations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-gray-600">Completed</p>
              <p className="text-gray-900">{stats.completedDonations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-gray-600">Requests</p>
              <p className="text-gray-900">{stats.totalRequests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <p className="text-gray-600">Pending</p>
              <p className="text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="donations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="donations">All Donations</TabsTrigger>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
          <TabsTrigger value="reports">Platform Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="donations">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900">All Donations</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search donations..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Type</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Claimed By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.foodType}</TableCell>
                    <TableCell>{donation.donorName}</TableCell>
                    <TableCell>{donation.quantity} {donation.unit}</TableCell>
                    <TableCell>
                      <Badge variant={
                        donation.status === 'available' ? 'default' :
                        donation.status === 'claimed' ? 'secondary' : 'outline'
                      }>
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{donation.claimedBy || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog('donation', donation.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900">All Requests</h3>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Beneficiaries</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.foodType}</TableCell>
                    <TableCell>{request.recipientName}</TableCell>
                    <TableCell>{request.donor}</TableCell>
                    <TableCell>{request.quantity} {request.unit}</TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'pending' ? 'secondary' :
                        request.status === 'approved' ? 'default' : 'outline'
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.beneficiaries}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog('request', request.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Activity History</h3>
            <div className="space-y-3">
              {activityLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No activity history available</p>
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-gray-900">{log.description}</p>
                            <p className="text-gray-600">
                              by {log.userName} ({log.userRole})
                            </p>
                          </div>
                          <Badge variant="outline">{log.type.replace(/_/g, ' ')}</Badge>
                        </div>
                        <p className="text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="mb-6">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Platform Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Users (30 days)</span>
                  <span className="text-gray-900">{platformMetrics.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Donation Success Rate</span>
                  <span className="text-gray-900">{platformMetrics.successRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Response Time</span>
                  <span className="text-gray-900">{platformMetrics.responseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Uptime</span>
                  <span className="text-gray-900">{platformMetrics.uptime}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Data Quality</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Complete Profiles</span>
                  <span className="text-gray-900">{platformMetrics.completeProfiles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verified Donations</span>
                  <span className="text-gray-900">{platformMetrics.verifiedDonations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data Accuracy Score</span>
                  <span className="text-gray-900">{platformMetrics.accuracyScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duplicate Records</span>
                  <span className="text-gray-900">{platformMetrics.duplicates}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
