'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import LineChart from '@/components/LineChart';
import DoughnutChart from '@/components/DoughnutChart';
import { getFiservData, FiservData } from '@/components/DataFetcher';
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  BanknotesIcon, 
  BuildingLibraryIcon 
} from '@heroicons/react/24/outline';

export default function FiservDashboard() {
  const [data, setData] = useState<FiservData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fiservData = await getFiservData();
        setData(fiservData);
      } catch (error) {
        console.error('Failed to fetch Fiserv data:', error);
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
  const totalValue = data.transactionValue.daily.reduce((a, b) => a + b, 0);
  const averageFailureRate = data.failureRate.daily.reduce((a, b) => a + b, 0) / data.failureRate.daily.length;
  
  // Date labels for charts (last 7 days)
  const dateLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fiserv Analytics Dashboard</h1>
        <div className="text-sm text-gray-500">Payment Aggregator Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 5.8, isPositive: true }}
          icon={<ArrowTrendingUpIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Transaction Value" 
          value={`$${(totalValue / 1000000).toFixed(2)}M`} 
          change={{ value: 4.2, isPositive: true }}
          icon={<CurrencyDollarIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Processing Speed" 
          value={`${data.processingSpeed.average.toFixed(2)}s`} 
          change={{ value: 0.3, isPositive: true }}
          icon={<BanknotesIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Failure Rate" 
          value={`${(averageFailureRate * 100).toFixed(2)}%`} 
          change={{ value: 0.2, isPositive: false }}
          icon={<BuildingLibraryIcon className="h-10 w-10" />}
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
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            }
          ]}
        />
        <LineChart 
          title="Daily Transaction Value ($)"
          labels={dateLabels}
          datasets={[
            {
              label: 'Value',
              data: data.transactionValue.daily.map(val => val / 1000), // Show in thousands
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
            }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          title="Failure Rate (%)"
          labels={dateLabels}
          datasets={[
            {
              label: 'Failure Rate',
              data: data.failureRate.daily.map(val => val * 100),
              borderColor: 'rgb(244, 63, 94)',
              backgroundColor: 'rgba(244, 63, 94, 0.5)',
            }
          ]}
        />
        <DoughnutChart 
          title="Payment Methods Distribution"
          labels={data.topPaymentMethods.map(item => item.name)}
          data={data.topPaymentMethods.map(item => item.percentage)}
          backgroundColor={[
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(244, 63, 94, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(251, 146, 60, 0.7)'
          ]}
        />
      </div>

      {/* Partnership Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Active Partnerships</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{data.activePartnerships.banks}</div>
            <div className="text-sm text-gray-600 mt-1">Banks</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{data.activePartnerships.brands}</div>
            <div className="text-sm text-gray-600 mt-1">Brands</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{data.activePartnerships.merchants}</div>
            <div className="text-sm text-gray-600 mt-1">Merchants</div>
          </div>
        </div>
      </div>
    </div>
  );
} 