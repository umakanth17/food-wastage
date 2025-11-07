// Central data store with localStorage persistence

export interface Donation {
  id: string;
  foodType: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  location: string;
  description: string;
  status: 'available' | 'claimed' | 'completed';
  claimedBy?: string;
  createdAt: string;
  donorId: string;
  donorName: string;
}

export interface Request {
  id: string;
  donationId: string;
  foodType: string;
  quantity: number;
  unit: string;
  donor: string;
  pickupDate: string;
  status: 'pending' | 'approved' | 'completed';
  beneficiaries: number;
  createdAt: string;
  recipientId: string;
  recipientName: string;
}

export interface ActivityLog {
  id: string;
  type: 'donation_created' | 'donation_claimed' | 'donation_completed' | 'request_created' | 'request_approved' | 'request_completed';
  userId: string;
  userName: string;
  userRole: string;
  description: string;
  timestamp: string;
  relatedId: string;
}

interface DataStore {
  donations: Donation[];
  requests: Request[];
  activityLogs: ActivityLog[];
}

const STORAGE_KEY = 'food-rescue-data';

// Initialize with sample data
const initialData: DataStore = {
  donations: [
    {
      id: '1',
      foodType: 'Fresh Vegetables',
      quantity: 50,
      unit: 'kg',
      expiryDate: '2025-11-05',
      location: 'Downtown Grocery Store',
      description: 'Mixed seasonal vegetables in good condition',
      status: 'completed',
      claimedBy: 'City Food Bank',
      createdAt: '2025-10-28',
      donorId: 'donor1',
      donorName: 'Downtown Grocery Store'
    },
    {
      id: '2',
      foodType: 'Bread & Bakery Items',
      quantity: 100,
      unit: 'units',
      expiryDate: '2025-11-03',
      location: 'Main Street Bakery',
      description: 'Fresh bread and pastries from today',
      status: 'claimed',
      claimedBy: 'Community Kitchen',
      createdAt: '2025-11-01',
      donorId: 'donor2',
      donorName: 'Main Street Bakery'
    },
    {
      id: '3',
      foodType: 'Dairy Products',
      quantity: 25,
      unit: 'liters',
      expiryDate: '2025-10-20',
      location: 'Downtown Grocery Store',
      description: 'Fresh milk and yogurt',
      status: 'completed',
      claimedBy: 'Local Shelter',
      createdAt: '2025-10-10',
      donorId: 'donor1',
      donorName: 'Downtown Grocery Store'
    },
    {
      id: '4',
      foodType: 'Canned Goods',
      quantity: 80,
      unit: 'units',
      expiryDate: '2026-04-15',
      location: 'Westside Supermarket',
      description: 'Mixed canned vegetables',
      status: 'available',
      createdAt: '2025-09-15',
      donorId: 'donor3',
      donorName: 'Westside Supermarket'
    },
    {
      id: '5',
      foodType: 'Fruits',
      quantity: 35,
      unit: 'kg',
      expiryDate: '2025-09-05',
      location: 'Farm Fresh Market',
      description: 'Assorted seasonal fruits',
      status: 'completed',
      claimedBy: 'City Food Bank',
      createdAt: '2025-09-01',
      donorId: 'donor4',
      donorName: 'Farm Fresh Market'
    },
  ],
  requests: [
    {
      id: 'r1',
      donationId: '1',
      foodType: 'Fresh Vegetables',
      quantity: 50,
      unit: 'kg',
      donor: 'Downtown Grocery Store',
      pickupDate: '2025-11-04',
      status: 'completed',
      beneficiaries: 120,
      createdAt: '2025-10-28',
      recipientId: 'recipient1',
      recipientName: 'City Food Bank'
    },
    {
      id: 'r2',
      donationId: '2',
      foodType: 'Bakery Items',
      quantity: 80,
      unit: 'units',
      donor: 'Local Bakery',
      pickupDate: '2025-10-15',
      status: 'completed',
      beneficiaries: 95,
      createdAt: '2025-10-10',
      recipientId: 'recipient2',
      recipientName: 'Community Kitchen'
    },
    {
      id: 'r3',
      donationId: '3',
      foodType: 'Canned Soup',
      quantity: 120,
      unit: 'units',
      donor: 'Metro Foods',
      pickupDate: '2025-09-20',
      status: 'completed',
      beneficiaries: 140,
      createdAt: '2025-09-15',
      recipientId: 'recipient1',
      recipientName: 'City Food Bank'
    },
  ],
  activityLogs: []
};

class DataManager {
  private data: DataStore;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DataStore {
    if (typeof window === 'undefined') return initialData;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored data', e);
        return initialData;
      }
    }
    return initialData;
  }

  private saveData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  // Donations
  getAllDonations(): Donation[] {
    return [...this.data.donations];
  }

  getDonationsByDonor(donorId: string): Donation[] {
    return this.data.donations.filter(d => d.donorId === donorId);
  }

  getAvailableDonations(): Donation[] {
    return this.data.donations.filter(d => d.status === 'available');
  }

  addDonation(donation: Omit<Donation, 'id' | 'createdAt'>): Donation {
    const newDonation: Donation = {
      ...donation,
      id: `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.data.donations.unshift(newDonation);
    
    // Log activity
    this.addActivityLog({
      type: 'donation_created',
      userId: donation.donorId,
      userName: donation.donorName,
      userRole: 'donor',
      description: `Created donation: ${donation.foodType} (${donation.quantity} ${donation.unit})`,
      relatedId: newDonation.id
    });
    
    this.saveData();
    return newDonation;
  }

  updateDonation(id: string, updates: Partial<Donation>): void {
    const index = this.data.donations.findIndex(d => d.id === id);
    if (index !== -1) {
      this.data.donations[index] = { ...this.data.donations[index], ...updates };
      this.saveData();
    }
  }

  deleteDonation(id: string): void {
    const donation = this.data.donations.find(d => d.id === id);
    if (donation) {
      this.addActivityLog({
        type: 'donation_completed',
        userId: 'admin',
        userName: 'Administrator',
        userRole: 'admin',
        description: `Deleted donation: ${donation.foodType} (${donation.quantity} ${donation.unit})`,
        relatedId: id
      });
    }
    this.data.donations = this.data.donations.filter(d => d.id !== id);
    this.saveData();
  }

  // Requests
  getAllRequests(): Request[] {
    return [...this.data.requests];
  }

  getRequestsByRecipient(recipientId: string): Request[] {
    return this.data.requests.filter(r => r.recipientId === recipientId);
  }

  addRequest(request: Omit<Request, 'id' | 'createdAt'>): Request {
    const newRequest: Request = {
      ...request,
      id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.data.requests.unshift(newRequest);
    
    // Update donation status
    this.updateDonation(request.donationId, { 
      status: 'claimed',
      claimedBy: request.recipientName
    });
    
    // Log activity
    this.addActivityLog({
      type: 'request_created',
      userId: request.recipientId,
      userName: request.recipientName,
      userRole: 'recipient',
      description: `Requested: ${request.foodType} (${request.quantity} ${request.unit}) from ${request.donor}`,
      relatedId: newRequest.id
    });
    
    this.saveData();
    return newRequest;
  }

  updateRequest(id: string, updates: Partial<Request>): void {
    const index = this.data.requests.findIndex(r => r.id === id);
    if (index !== -1) {
      this.data.requests[index] = { ...this.data.requests[index], ...updates };
      
      // If completing request, update donation status
      if (updates.status === 'completed') {
        const request = this.data.requests[index];
        this.updateDonation(request.donationId, { status: 'completed' });
      }
      
      this.saveData();
    }
  }

  deleteRequest(id: string): void {
    const request = this.data.requests.find(r => r.id === id);
    if (request) {
      this.addActivityLog({
        type: 'request_completed',
        userId: 'admin',
        userName: 'Administrator',
        userRole: 'admin',
        description: `Deleted request: ${request.foodType} from ${request.donor}`,
        relatedId: id
      });
    }
    this.data.requests = this.data.requests.filter(r => r.id !== id);
    this.saveData();
  }

  // Activity Logs
  getAllActivityLogs(): ActivityLog[] {
    return [...this.data.activityLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.data.activityLogs.push(newLog);
  }

  // Stats
  getStats() {
    return {
      totalDonations: this.data.donations.length,
      activeDonations: this.data.donations.filter(d => d.status === 'available').length,
      completedDonations: this.data.donations.filter(d => d.status === 'completed').length,
      totalRequests: this.data.requests.length,
      pendingRequests: this.data.requests.filter(r => r.status === 'pending').length,
      completedRequests: this.data.requests.filter(r => r.status === 'completed').length,
    };
  }
}

// Singleton instance
export const dataStore = new DataManager();
