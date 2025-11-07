import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, Users, Package, MapPin, Download } from 'lucide-react';
import { useState, useMemo } from 'react';

// Complete dataset for all months
const allMonthsData = [
  { month: 'Jan', wasteReduced: 180, donations: 5 },
  { month: 'Feb', wasteReduced: 210, donations: 6 },
  { month: 'Mar', wasteReduced: 250, donations: 8 },
  { month: 'Apr', wasteReduced: 320, donations: 10 },
  { month: 'May', wasteReduced: 450, donations: 12 },
  { month: 'Jun', wasteReduced: 580, donations: 18 },
  { month: 'Jul', wasteReduced: 720, donations: 21 },
  { month: 'Aug', wasteReduced: 890, donations: 27 },
  { month: 'Sep', wasteReduced: 1050, donations: 32 },
  { month: 'Oct', wasteReduced: 1280, donations: 38 },
  { month: 'Nov', wasteReduced: 1420, donations: 42 },
  { month: 'Dec', wasteReduced: 1580, donations: 45 },
];

const foodTypeDataByRange = {
  '1month': [
    { name: 'Vegetables', value: 32, color: '#10b981' },
    { name: 'Bread & Bakery', value: 28, color: '#f59e0b' },
    { name: 'Dairy', value: 18, color: '#3b82f6' },
    { name: 'Canned Goods', value: 12, color: '#8b5cf6' },
    { name: 'Grains', value: 10, color: '#ec4899' },
  ],
  '3months': [
    { name: 'Vegetables', value: 30, color: '#10b981' },
    { name: 'Bread & Bakery', value: 26, color: '#f59e0b' },
    { name: 'Dairy', value: 20, color: '#3b82f6' },
    { name: 'Canned Goods', value: 14, color: '#8b5cf6' },
    { name: 'Grains', value: 10, color: '#ec4899' },
  ],
  '6months': [
    { name: 'Vegetables', value: 35, color: '#10b981' },
    { name: 'Bread & Bakery', value: 25, color: '#f59e0b' },
    { name: 'Dairy', value: 15, color: '#3b82f6' },
    { name: 'Canned Goods', value: 15, color: '#8b5cf6' },
    { name: 'Grains', value: 10, color: '#ec4899' },
  ],
  '1year': [
    { name: 'Vegetables', value: 33, color: '#10b981' },
    { name: 'Bread & Bakery', value: 24, color: '#f59e0b' },
    { name: 'Dairy', value: 17, color: '#3b82f6' },
    { name: 'Canned Goods', value: 16, color: '#8b5cf6' },
    { name: 'Grains', value: 10, color: '#ec4899' },
  ],
};

const regionDataByRange = {
  '1month': [
    { region: 'Downtown', donations: 8, waste: 240 },
    { region: 'Westside', donations: 6, waste: 180 },
    { region: 'Eastside', donations: 5, waste: 150 },
    { region: 'Northside', donations: 3, waste: 90 },
    { region: 'Southside', donations: 4, waste: 120 },
  ],
  '3months': [
    { region: 'Downtown', donations: 12, waste: 350 },
    { region: 'Westside', donations: 9, waste: 270 },
    { region: 'Eastside', donations: 7, waste: 210 },
    { region: 'Northside', donations: 4, waste: 140 },
    { region: 'Southside', donations: 5, waste: 160 },
  ],
  '6months': [
    { region: 'Downtown', donations: 15, waste: 420 },
    { region: 'Westside', donations: 10, waste: 310 },
    { region: 'Eastside', donations: 8, waste: 250 },
    { region: 'Northside', donations: 5, waste: 180 },
    { region: 'Southside', donations: 7, waste: 220 },
  ],
  '1year': [
    { region: 'Downtown', donations: 22, waste: 680 },
    { region: 'Westside', donations: 16, waste: 520 },
    { region: 'Eastside', donations: 12, waste: 380 },
    { region: 'Northside', donations: 8, waste: 280 },
    { region: 'Southside', donations: 11, waste: 340 },
  ],
};

export function AnalystDashboard() {
  const [timeRange, setTimeRange] = useState('6months');

  // Calculate data based on selected time range
  const { wasteReductionData, impactData, foodTypeData, regionData, insights } = useMemo(() => {
    let monthsToShow = 6;
    let totalDonations = 45;
    let totalWasteReduced = 1280;
    let peopleHelped = 850;
    let activeLocations = 23;
    let trend = '+18%';
    let donationTrend = '+22%';
    let peopleTrend = '+31%';

    switch (timeRange) {
      case '1month':
        monthsToShow = 1;
        totalDonations = 8;
        totalWasteReduced = 240;
        peopleHelped = 150;
        activeLocations = 12;
        trend = '+12%';
        donationTrend = '+8%';
        peopleTrend = '+15%';
        break;
      case '3months':
        monthsToShow = 3;
        totalDonations = 23;
        totalWasteReduced = 680;
        peopleHelped = 420;
        activeLocations = 18;
        trend = '+15%';
        donationTrend = '+18%';
        peopleTrend = '+25%';
        break;
      case '6months':
        monthsToShow = 6;
        totalDonations = 45;
        totalWasteReduced = 1280;
        peopleHelped = 850;
        activeLocations = 23;
        trend = '+18%';
        donationTrend = '+22%';
        peopleTrend = '+31%';
        break;
      case '1year':
        monthsToShow = 12;
        totalDonations = 92;
        totalWasteReduced = 2850;
        peopleHelped = 1780;
        activeLocations = 28;
        trend = '+24%';
        donationTrend = '+28%';
        peopleTrend = '+42%';
        break;
    }

    const wasteData = allMonthsData.slice(-monthsToShow);
    
    const impact = [
      { metric: 'Total Donations', value: totalDonations.toString(), trend: donationTrend, icon: Package },
      { metric: 'Waste Reduced', value: `${totalWasteReduced.toLocaleString()} kg`, trend, icon: TrendingDown },
      { metric: 'People Helped', value: peopleHelped.toLocaleString(), trend: peopleTrend, icon: Users },
      { metric: 'Active Locations', value: activeLocations.toString(), trend: '+5', icon: MapPin },
    ];

    const foodData = foodTypeDataByRange[timeRange as keyof typeof foodTypeDataByRange];
    const regData = regionDataByRange[timeRange as keyof typeof regionDataByRange];

    // Different insights based on time range
    let insightData = [];
    if (timeRange === '1month') {
      insightData = [
        {
          color: 'green',
          title: 'Recent Growth',
          description: `Food waste reduced by ${trend} this month, saving ${totalWasteReduced} kg from landfills`
        },
        {
          color: 'blue',
          title: 'Top Categories',
          description: 'Vegetables and bakery items lead donations this month with strong community response'
        },
        {
          color: 'purple',
          title: 'Regional Focus',
          description: 'Downtown area shows highest activity, opportunity to expand in Northside region'
        },
        {
          color: 'orange',
          title: 'Monthly Outlook',
          description: 'Maintaining current pace could help 180+ people by month-end'
        },
      ];
    } else if (timeRange === '3months') {
      insightData = [
        {
          color: 'green',
          title: 'Quarterly Progress',
          description: `Waste reduction up ${trend} over 3 months, saving ${totalWasteReduced.toLocaleString()} kg total`
        },
        {
          color: 'blue',
          title: 'Category Trends',
          description: 'Consistent demand for fresh produce and bakery items across all three months'
        },
        {
          color: 'purple',
          title: 'Geographic Expansion',
          description: 'Westside and Eastside showing steady growth in donation participation'
        },
        {
          color: 'orange',
          title: 'Quarterly Impact',
          description: 'On track to reach 500+ beneficiaries by end of quarter'
        },
      ];
    } else if (timeRange === '6months') {
      insightData = [
        {
          color: 'green',
          title: 'Waste Reduction Growth',
          description: `Food waste reduced by ${trend} compared to last period, saving ${totalWasteReduced.toLocaleString()} kg from landfills`
        },
        {
          color: 'blue',
          title: 'High Demand Categories',
          description: 'Vegetables and bakery items show highest donation rates, representing 60% of all donations'
        },
        {
          color: 'purple',
          title: 'Regional Opportunities',
          description: 'Northside and Southside regions show potential for growth with lower donation rates'
        },
        {
          color: 'orange',
          title: 'Impact Scaling',
          description: 'Current trajectory suggests potential to help 1,200+ people monthly by year-end'
        },
      ];
    } else {
      insightData = [
        {
          color: 'green',
          title: 'Annual Achievement',
          description: `Outstanding ${trend} waste reduction over the year, preventing ${totalWasteReduced.toLocaleString()} kg of food waste`
        },
        {
          color: 'blue',
          title: 'Year-Round Favorites',
          description: 'Vegetables remain top category year-round, with seasonal variations in bakery and dairy'
        },
        {
          color: 'purple',
          title: 'Regional Network',
          description: 'Successfully expanded to all 5 regions with Downtown leading and growth in suburban areas'
        },
        {
          color: 'orange',
          title: 'Annual Impact',
          description: `Helped ${peopleHelped.toLocaleString()} people this year, nearly double the initial target`
        },
      ];
    }

    return {
      wasteReductionData: wasteData,
      impactData: impact,
      foodTypeData: foodData,
      regionData: regData,
      insights: insightData,
    };
  }, [timeRange]);

  const getBorderColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'border-green-500',
      blue: 'border-blue-500',
      purple: 'border-purple-500',
      orange: 'border-orange-500',
    };
    return colors[color] || 'border-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Data Analytics Dashboard</h1>
          <p className="text-gray-600">Track food waste trends and platform efficiency</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {impactData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-purple-700" />
                </div>
                <span className="text-green-600">{item.trend}</span>
              </div>
              <p className="text-gray-600 mb-1">{item.metric}</p>
              <p className="text-gray-900">{item.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">Waste Reduction Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wasteReductionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="wasteReduced" stroke="#10b981" strokeWidth={2} name="Waste Reduced (kg)" />
              <Line type="monotone" dataKey="donations" stroke="#3b82f6" strokeWidth={2} name="Donations" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">Food Distribution by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={foodTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {foodTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">Regional Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="region" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" fill="#3b82f6" name="Donations" />
              <Bar dataKey="waste" fill="#10b981" name="Waste Reduced (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">Key Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`border-l-4 ${getBorderColor(insight.color)} pl-4 py-2`}>
                <p className="text-gray-900">{insight.title}</p>
                <p className="text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
