import { Leaf, TrendingUp, Users, Zap } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center p-4">
      <div className="text-center max-w-3xl mx-auto text-white">
        <div className="flex justify-center mb-8">
          <Leaf className="w-20 h-20" />
        </div>
        
        <h1 className="text-5xl font-bold mb-6">Food Rescue Platform</h1>
        
        <p className="text-2xl mb-12 text-green-50">
          Reduce food waste, improve food security, and make a real difference
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Impact</h3>
            <p className="text-green-50">Monitor food waste and donations in real-time</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Communities</h3>
            <p className="text-green-50">Link donors with recipients efficiently</p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Optimize Systems</h3>
            <p className="text-green-50">Use data to improve food distribution</p>
          </div>
        </div>
        
        <button
          onClick={onEnter}
          className="bg-white text-green-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
