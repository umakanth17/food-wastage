import { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Plus, Package, TrendingUp, Users, CheckCircle, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { dataStore, type Donation } from '../lib/dataStore';

const DONOR_ID = 'donor1';
const DONOR_NAME = 'Downtown Grocery Store';

export function DonorDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    location: '',
    description: ''
  });

  // Load donations on mount and set up refresh
  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = () => {
    const allDonations = dataStore.getDonationsByDonor(DONOR_ID);
    setDonations(allDonations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDonation = dataStore.addDonation({
      foodType: formData.foodType,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      expiryDate: formData.expiryDate,
      location: formData.location,
      description: formData.description,
      status: 'available',
      donorId: DONOR_ID,
      donorName: DONOR_NAME
    });

    loadDonations();
    setIsDialogOpen(false);
    setFormData({
      foodType: '',
      quantity: '',
      unit: 'kg',
      expiryDate: '',
      location: '',
      description: ''
    });
    toast.success('Donation listed successfully!');
  };

  // Filter donations based on time range
  const filteredDonations = useMemo(() => {
    if (timeFilter === 'all') return donations;
    
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
    
    return donations.filter(d => new Date(d.createdAt) >= cutoffDate);
  }, [donations, timeFilter]);

  const stats = {
    totalDonations: filteredDonations.length,
    activeDonations: filteredDonations.filter(d => d.status === 'available').length,
    peopleHelped: filteredDonations.filter(d => d.status === 'completed').length * 15,
    wasteReduced: filteredDonations.reduce((acc, d) => d.status === 'completed' ? acc + d.quantity : acc, 0)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Food Donor Dashboard</h1>
          <p className="text-gray-600">Manage your food donations and track your impact</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              List New Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>List Surplus Food</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="foodType">Food Type</Label>
                <Input
                  id="foodType"
                  placeholder="e.g., Fresh Vegetables, Canned Goods"
                  value={formData.foodType}
                  onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger id="unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="units">Units</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Pickup Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., 123 Main St, City"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional details about the food items..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" className="w-full">List Donation</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-48">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-gray-600">Total Donations</p>
              <p className="text-gray-900">{stats.totalDonations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-gray-600">Active Listings</p>
              <p className="text-gray-900">{stats.activeDonations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-gray-600">People Helped</p>
              <p className="text-gray-900">{stats.peopleHelped}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <p className="text-gray-600">Waste Reduced</p>
              <p className="text-gray-900">{stats.wasteReduced} kg</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-6">Your Donations</h3>
        <div className="space-y-4">
          {filteredDonations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No donations found for this time period</p>
            </div>
          ) : (
            filteredDonations.map((donation) => (
              <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-gray-900 mb-1">{donation.foodType}</h4>
                    <p className="text-gray-600">{donation.quantity} {donation.unit}</p>
                  </div>
                  <Badge variant={
                    donation.status === 'available' ? 'default' :
                    donation.status === 'claimed' ? 'secondary' : 'outline'
                  }>
                    {donation.status === 'available' && <Clock className="w-3 h-3 mr-1" />}
                    {donation.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {donation.status}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-3">{donation.description}</p>
                
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{donation.location}</span>
                  </div>
                  <div>Created: {new Date(donation.createdAt).toLocaleDateString()}</div>
                  <div>Expires: {new Date(donation.expiryDate).toLocaleDateString()}</div>
                  {donation.claimedBy && (
                    <div>Claimed by: {donation.claimedBy}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
