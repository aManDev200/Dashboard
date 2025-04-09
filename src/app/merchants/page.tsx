'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import LineChart from '@/components/LineChart';
import DoughnutChart from '@/components/DoughnutChart';
import { getMerchantsData, MerchantsData } from '@/components/DataFetcher';
import { 
  ShoppingCartIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

export default function MerchantsDashboard() {
  const [data, setData] = useState<MerchantsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const merchantsData = await getMerchantsData();
        setData(merchantsData);
      } catch (error) {
        console.error('Failed to fetch Merchants data:', error);
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
  const avgConversion = data.customerConversion.daily.reduce((a, b) => a + b, 0) / data.customerConversion.daily.length;
  const totalRevenue = data.revenueGenerated.daily.reduce((a, b) => a + b, 0);
  const totalCustomers = data.activeCustomers.new + data.activeCustomers.returning + data.activeCustomers.loyal;
  const avgOrderValue = data.paymentMetrics.averageOrderValue.reduce((a, b) => a + b, 0) / data.paymentMetrics.averageOrderValue.length;
  
  // Date labels for charts (last 7 days)
  const dateLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Merchants Analytics Dashboard</h1>
        <div className="text-sm text-gray-500">Merchant Business Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 3.8, isPositive: true }}
          icon={<ShoppingCartIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${(avgConversion * 100).toFixed(1)}%`} 
          change={{ value: 2.5, isPositive: true }}
          icon={<UserGroupIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Revenue Generated" 
          value={`$${(totalRevenue / 1000).toFixed(2)}K`} 
          change={{ value: 4.2, isPositive: true }}
          icon={<CurrencyDollarIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`$${avgOrderValue.toFixed(2)}`} 
          change={{ value: 1.8, isPositive: true }}
          icon={<ClockIcon className="h-10 w-10" />}
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
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.5)',
            }
          ]}
        />
        <LineChart 
          title="Daily Conversion Rate (%)"
          labels={dateLabels}
          datasets={[
            {
              label: 'Conversion Rate',
              data: data.customerConversion.daily.map(val => val * 100),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          title="Payment Performance Metrics"
          labels={dateLabels}
          datasets={[
            {
              label: 'Avg. Order Value ($)',
              data: data.paymentMetrics.averageOrderValue,
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
            {
              label: 'Cart Abandonment (%)',
              data: data.paymentMetrics.cartAbandonment.map(val => val * 100),
              borderColor: 'rgb(244, 63, 94)',
              backgroundColor: 'rgba(244, 63, 94, 0.5)',
            }
          ]}
        />
        <DoughnutChart 
          title="Sales Channels Distribution"
          labels={data.topSalesChannels.map(item => item.name)}
          data={data.topSalesChannels.map(item => item.percentage)}
          backgroundColor={[
            'rgba(249, 115, 22, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(244, 63, 94, 0.7)'
          ]}
        />
      </div>

      {/* Customer Satisfaction & Customer Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Satisfaction</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-orange-600">{data.customerSatisfaction.overall}/5</div>
              <div className="text-sm text-gray-600 mt-1">Overall Satisfaction</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600">{data.customerSatisfaction.checkout}/5</div>
              <div className="text-sm text-gray-600 mt-1">Checkout Experience</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600">{data.customerSatisfaction.support}/5</div>
              <div className="text-sm text-gray-600 mt-1">Support Quality</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-600">{data.customerSatisfaction.delivery}/5</div>
              <div className="text-sm text-gray-600 mt-1">Delivery Experience</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Distribution</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{data.activeCustomers.new}</div>
              <div className="text-sm text-gray-600 mt-1">New Customers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{data.activeCustomers.returning}</div>
              <div className="text-sm text-gray-600 mt-1">Returning Customers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{data.activeCustomers.loyal}</div>
              <div className="text-sm text-gray-600 mt-1">Loyal Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Time Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Checkout Time Performance (seconds)</h2>
        <div className="h-64">
          <LineChart 
            title=""
            labels={dateLabels}
            datasets={[
              {
                label: 'Avg. Checkout Time',
                data: data.paymentMetrics.checkoutTime,
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