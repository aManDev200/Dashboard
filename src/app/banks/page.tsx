'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import LineChart from '@/components/LineChart';
import DoughnutChart from '@/components/DoughnutChart';
import { getBanksData, BanksData } from '@/components/DataFetcher';
import { 
  UserPlusIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  BuildingLibraryIcon 
} from '@heroicons/react/24/outline';

export default function BanksDashboard() {
  const [data, setData] = useState<BanksData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const banksData = await getBanksData();
        setData(banksData);
      } catch (error) {
        console.error('Failed to fetch Banks data:', error);
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
  const totalCustomers = data.customerAcquisition.daily.reduce((a, b) => a + b, 0);
  const totalRevenue = data.revenueGenerated.daily.reduce((a, b) => a + b, 0);
  const totalMerchants = data.activeMerchants.small + data.activeMerchants.medium + data.activeMerchants.large;
  
  // Date labels for charts (last 7 days)
  const dateLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banks Analytics Dashboard</h1>
        <div className="text-sm text-gray-500">Banking Institutions Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 4.2, isPositive: true }}
          icon={<BuildingLibraryIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="New Customers" 
          value={totalCustomers.toLocaleString()} 
          change={{ value: 6.8, isPositive: true }}
          icon={<UserPlusIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Revenue Generated" 
          value={`$${(totalRevenue / 1000).toFixed(2)}K`} 
          change={{ value: 3.5, isPositive: true }}
          icon={<CurrencyDollarIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Active Merchants" 
          value={totalMerchants.toLocaleString()} 
          change={{ value: 2.1, isPositive: true }}
          icon={<ShieldCheckIcon className="h-10 w-10" />}
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
              borderColor: 'rgb(22, 163, 74)',
              backgroundColor: 'rgba(22, 163, 74, 0.5)',
            }
          ]}
        />
        <LineChart 
          title="Daily Customer Acquisition"
          labels={dateLabels}
          datasets={[
            {
              label: 'New Customers',
              data: data.customerAcquisition.daily,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          title="Fraud Detection Metrics"
          labels={dateLabels}
          datasets={[
            {
              label: 'Detected Fraud (Cases)',
              data: data.fraudMetrics.detectedFraud,
              borderColor: 'rgb(244, 63, 94)',
              backgroundColor: 'rgba(244, 63, 94, 0.5)',
            },
            {
              label: 'Suspicious Transactions',
              data: data.fraudMetrics.suspiciousTransactions,
              borderColor: 'rgb(234, 179, 8)',
              backgroundColor: 'rgba(234, 179, 8, 0.5)',
            }
          ]}
        />
        <DoughnutChart 
          title="Top Banking Services"
          labels={data.topServices.map(item => item.name)}
          data={data.topServices.map(item => item.percentage)}
          backgroundColor={[
            'rgba(22, 163, 74, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(234, 179, 8, 0.7)',
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
              <div className="text-3xl font-bold text-blue-600">{data.customerSatisfaction.overall}/5</div>
              <div className="text-sm text-gray-600 mt-1">Overall Satisfaction</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600">{data.customerSatisfaction.usability}/5</div>
              <div className="text-sm text-gray-600 mt-1">Usability Rating</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-600">{data.customerSatisfaction.support}/5</div>
              <div className="text-sm text-gray-600 mt-1">Support Quality</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-600">{data.customerSatisfaction.reliability}/5</div>
              <div className="text-sm text-gray-600 mt-1">System Reliability</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Merchant Distribution</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{data.activeMerchants.small}</div>
              <div className="text-sm text-gray-600 mt-1">Small Businesses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{data.activeMerchants.medium}</div>
              <div className="text-sm text-gray-600 mt-1">Medium Businesses</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{data.activeMerchants.large}</div>
              <div className="text-sm text-gray-600 mt-1">Large Enterprises</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 