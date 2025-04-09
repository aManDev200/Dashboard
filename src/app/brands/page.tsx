'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import LineChart from '@/components/LineChart';
import DoughnutChart from '@/components/DoughnutChart';
import { getBrandsData, BrandsData } from '@/components/DataFetcher';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';

export default function BrandsDashboard() {
  const [data, setData] = useState<BrandsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const brandsData = await getBrandsData();
        setData(brandsData);
      } catch (error) {
        console.error('Failed to fetch Brands data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  // Calculate some metrics
  const totalTransactions = data.transactionVolume.daily.reduce((a, b) => a + b, 0);
  const totalEngagement = data.customerEngagement.daily.reduce((a, b) => a + b, 0);
  const totalRevenue = data.revenueGenerated.daily.reduce((a, b) => a + b, 0);
  const totalMerchants = data.activeMerchants.premium + data.activeMerchants.standard + data.activeMerchants.basic;
  
  // Date labels for charts (last 7 days)
  const dateLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Brands Analytics Dashboard</h1>
        <div className="text-sm text-gray-500">Brand Partnership Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 5.3, isPositive: true }}
          icon={<ChartBarIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Customer Engagement" 
          value={totalEngagement.toLocaleString()} 
          change={{ value: 7.5, isPositive: true }}
          icon={<UserGroupIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Revenue Generated" 
          value={`$${(totalRevenue / 1000).toFixed(2)}K`} 
          change={{ value: 4.8, isPositive: true }}
          icon={<CurrencyDollarIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Active Merchants" 
          value={totalMerchants.toLocaleString()} 
          change={{ value: 3.2, isPositive: true }}
          icon={<ShoppingBagIcon className="h-10 w-10" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          title="Daily Transaction Volume"
          labels={dateLabels}
          datasets={[
            {
              label: 'Transactions',
              data: data.transactionVolume.daily,
              borderColor: 'rgb(147, 51, 234)',
              backgroundColor: 'rgba(147, 51, 234, 0.5)',
            }
          ]}
        />
        <LineChart 
          title="Daily Customer Engagement"
          labels={dateLabels}
          datasets={[
            {
              label: 'Engagement',
              data: data.customerEngagement.daily,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          title="Loyalty Program Metrics"
          labels={dateLabels}
          datasets={[
            {
              label: 'New Enrollments',
              data: data.loyaltyMetrics.newEnrollments,
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.5)',
            },
            {
              label: 'Redemption Rate (%)',
              data: data.loyaltyMetrics.redemptionRate.map(val => val * 100),
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
            }
          ]}
        />
        <DoughnutChart 
          title="Top Product Categories"
          labels={data.topProductCategories.map(item => item.name)}
          data={data.topProductCategories.map(item => item.percentage)}
          backgroundColor={[
            'rgba(147, 51, 234, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(75, 85, 99, 0.7)'
          ]}
        />
      </div>

      {/* Customer Satisfaction & Merchant Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Satisfaction</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-600">{data.customerSatisfaction.overall}/5</div>
              <div className="text-sm text-gray-600 mt-1">Overall Satisfaction</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600">{data.customerSatisfaction.rewards}/5</div>
              <div className="text-sm text-gray-600 mt-1">Rewards Program</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600">{data.customerSatisfaction.usability}/5</div>
              <div className="text-sm text-gray-600 mt-1">Usability Rating</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-orange-600">{data.customerSatisfaction.support}/5</div>
              <div className="text-sm text-gray-600 mt-1">Support Quality</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Merchant Distribution</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{data.activeMerchants.premium}</div>
              <div className="text-sm text-gray-600 mt-1">Premium Partners</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{data.activeMerchants.standard}</div>
              <div className="text-sm text-gray-600 mt-1">Standard Partners</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{data.activeMerchants.basic}</div>
              <div className="text-sm text-gray-600 mt-1">Basic Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Users Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Loyalty Program Active Users</h2>
        <div className="h-64">
          <LineChart 
            title=""
            labels={dateLabels}
            datasets={[
              {
                label: 'Active Users',
                data: data.loyaltyMetrics.activeUsers,
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.5)',
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
} 