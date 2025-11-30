import { useState } from 'react';
import { DonorDashboard } from './components/DonorDashboard';
import { RecipientDashboard } from './components/RecipientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalystDashboard } from './components/AnalystDashboard';
import { LandingPage } from './components/LandingPage';
import { Button } from './components/ui/button';
import { UserCircle, Package, Building2, BarChart3 } from 'lucide-react';


type UserRole = 'donor' | 'recipient' | 'admin' | 'analyst' | null;


export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>(null);


  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }


  if (!currentRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-green-700 mb-4">Food Rescue Platform</h1>
            <p className="text-gray-600">Reducing food waste, improving food security, one donation at a time</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setCurrentRole('donor')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Package className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-green-700">Food Donor</h3>
              </div>
              <p className="text-gray-600">List surplus food, coordinate donations, and track your impact on reducing waste</p>
            </button>


            <button
              onClick={() => setCurrentRole('recipient')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Building2 className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-blue-700">Recipient Organization</h3>
              </div>
              <p className="text-gray-600">Request food donations, manage logistics, and distribute to those in need</p>
            </button>


            <button
              onClick={() => setCurrentRole('analyst')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="text-purple-700">Data Analyst</h3>
              </div>
              <p className="text-gray-600">Track food waste trends, analyze data, and generate insights for efficiency</p>
            </button>


            <button
              onClick={() => setCurrentRole('admin')}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <UserCircle className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="text-orange-700">Administrator</h3>
              </div>
              <p className="text-gray-600">Manage platform content, oversee interactions, and ensure data accuracy</p>
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-green-700">Food Rescue Platform</h2>
          <Button onClick={() => setCurrentRole(null)} variant="outline">
            Switch Role
          </Button>
        </div>
      </header>


      {currentRole === 'donor' && <DonorDashboard />}
      {currentRole === 'recipient' && <RecipientDashboard />}
      {currentRole === 'admin' && <AdminDashboard />}
      {currentRole === 'analyst' && <AnalystDashboard />}
    </div>
  );
}
