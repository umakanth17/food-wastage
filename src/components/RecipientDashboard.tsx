import { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MapPin, Calendar, Package, TrendingUp, Users, Building2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { dataStore, type Donation, type Request } from '../lib/dataStore';

const RECIPIENT_ID = 'recipient1';
const RECIPIENT_NAME = 'City Food Bank';

export function RecipientDashboard() {
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAvailableDonations(dataStore.getAvailableDonations());
    setRequests(dataStore.getRequestsByRecipient(RECIPIENT_ID));
  };

  const handleRequestDonation = (donation: Donation) => {
    setSelectedDonation(donation);
  };

  const submitRequest = () => {
    if (!selectedDonation || !pickupDate || !beneficiaries) return;

    dataStore.addRequest({
      donationId: selectedDonation.id,
      foodType: selectedDonation.foodType,
      quantity: selectedDonation.quantity,
      unit: selectedDonation.unit,
      donor: selectedDonation.donorName,
      pickupDate,
      status: 'pending',
      beneficiaries: parseInt(beneficiaries),
      recipientId: RECIPIENT_ID,
      recipientName: RECIPIENT_NAME
    });

    loadData();
    setSelectedDonation(null);
    setPickupDate('');
    setBeneficiaries('');
    toast.success('Request submitted successfully!');
  };

  const filteredDonations = availableDonations.filter(d => 
    d.foodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter requests based on time and status
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Filter by time
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
  }, [requests, timeFilter, statusFilter]);

  const stats = {
    totalReceived: filteredRequests.filter(r => r.status === 'completed').length,
    pendingRequests: filteredRequests.filter(r => r.status === 'pending').length,
    totalBeneficiaries: filteredRequests.filter(r => r.status === 'completed').reduce((acc, r) => acc + r.beneficiaries, 0),
    foodReceived: filteredRequests.filter(r => r.status === 'completed').reduce((acc, r) => acc + r.quantity, 0)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Recipient Organization Dashboard</h1>
        <p className="text-gray-600">Request food donations and manage distribution logistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-gray-600">Received</p>
              <p className="text-gray-900">{stats.totalReceived}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-gray-600">Pending Requests</p>
              <p className="text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-gray-600">Beneficiaries</p>
              <p className="text-gray-900">{stats.totalBeneficiaries}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <p className="text-gray-600">Food Received</p>
              <p className="text-gray-900">{stats.foodReceived} kg</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Donations</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <Card className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by food type or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredDonations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No available donations at the moment</p>
                </div>
              ) : (
                filteredDonations.map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-gray-900 mb-1">{donation.foodType}</h4>
                        <p className="text-gray-600">{donation.quantity} {donation.unit} available</p>
                      </div>
                      <Button onClick={() => handleRequestDonation(donation)}>
                        Request
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{donation.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{donation.donorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{donation.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Expires: {new Date(donation.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900">Your Requests</h3>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
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
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No requests found for this filter</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-gray-900 mb-1">{request.foodType}</h4>
                        <p className="text-gray-600">{request.quantity} {request.unit}</p>
                      </div>
                      <Badge variant={
                        request.status === 'pending' ? 'secondary' :
                        request.status === 'approved' ? 'default' : 'outline'
                      }>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <div>Donor: {request.donor}</div>
                      <div>Pickup: {new Date(request.pickupDate).toLocaleDateString()}</div>
                      <div>Beneficiaries: {request.beneficiaries}</div>
                      <div>Requested: {new Date(request.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={selectedDonation !== null} onOpenChange={() => setSelectedDonation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Donation</DialogTitle>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-900">{selectedDonation.foodType}</p>
                <p className="text-gray-600">{selectedDonation.quantity} {selectedDonation.unit}</p>
              </div>
              
              <div>
                <Label htmlFor="pickupDate">Preferred Pickup Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="beneficiaries">Estimated Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  placeholder="Number of people who will benefit"
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.value)}
                  required
                />
              </div>

              <Button onClick={submitRequest} className="w-full">
                Submit Request
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
