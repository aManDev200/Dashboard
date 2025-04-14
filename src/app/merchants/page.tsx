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

// Helper function to generate consistent date labels
function generateDateLabels() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to ensure consistent rendering
    }).format(date);
  });
}

export default function MerchantsDashboard() {
  const [data, setData] = useState<MerchantsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateLabels, setDateLabels] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const merchantsData = await getMerchantsData();
        setData(merchantsData);
        setDateLabels(generateDateLabels());
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
      <div className="flex items-center justify-center" style={{ height: '256px' }}>
        <div className="text-large">Loading dashboard data...</div>
      </div>
    );
  }

  // Calculate some metrics
  const totalTransactions = data.transactionVolume.daily.reduce((a, b) => a + b, 0);
  const avgConversion = data.customerConversion.daily.reduce((a, b) => a + b, 0) / data.customerConversion.daily.length;
  const totalRevenue = data.revenueGenerated.daily.reduce((a, b) => a + b, 0);
  const totalCustomers = data.activeCustomers.new + data.activeCustomers.returning + data.activeCustomers.loyal;
  const avgOrderValue = data.paymentMetrics.averageOrderValue.reduce((a, b) => a + b, 0) / data.paymentMetrics.averageOrderValue.length;
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Merchants Analytics Dashboard</h1>
        <div className="dashboard-subtitle">Merchant Business Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 3.8, isPositive: true }}
          icon={<ShoppingCartIcon className="icon" />}
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${(avgConversion * 100).toFixed(1)}%`} 
          change={{ value: 2.5, isPositive: true }}
          icon={<UserGroupIcon className="icon" />}
        />
        <StatCard 
          title="Revenue Generated" 
          value={`$${(totalRevenue / 1000).toFixed(2)}K`} 
          change={{ value: 4.2, isPositive: true }}
          icon={<CurrencyDollarIcon className="icon" />}
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`$${avgOrderValue.toFixed(2)}`} 
          change={{ value: 1.8, isPositive: true }}
          icon={<ClockIcon className="icon" />}
        />
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="chart-section">
          <h2 className="chart-section-title">Daily Transaction Volume</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Daily Conversion Rate (%)</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-section">
          <h2 className="chart-section-title">Payment Performance Metrics</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Sales Channels Distribution</h2>
          <div className="chart-tall">
            <DoughnutChart 
              title=""
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
        </div>
      </div>

      {/* Customer Satisfaction & Customer Distribution */}
      <div className="chart-grid">
        <div className="chart-section">
          <h2 className="chart-section-title">Customer Satisfaction</h2>
          <div className="satisfaction-grid">
            <div className="satisfaction-item">
              <div className="satisfaction-value text-warning">{data.customerSatisfaction.overall}/5</div>
              <div className="satisfaction-label">Overall Satisfaction</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-info">{data.customerSatisfaction.checkout}/5</div>
              <div className="satisfaction-label">Checkout Experience</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-success">{data.customerSatisfaction.support}/5</div>
              <div className="satisfaction-label">Support Quality</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-primary">{data.customerSatisfaction.delivery}/5</div>
              <div className="satisfaction-label">Delivery Experience</div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h2 className="chart-section-title">Customer Distribution</h2>
          <div className="merchant-grid">
            <div className="merchant-item bg-info-light">
              <div className="merchant-value text-info">{data.activeCustomers.new}</div>
              <div className="merchant-label">New Customers</div>
            </div>
            <div className="merchant-item bg-success-light">
              <div className="merchant-value text-success">{data.activeCustomers.returning}</div>
              <div className="merchant-label">Returning Customers</div>
            </div>
            <div className="merchant-item bg-primary-light">
              <div className="merchant-value text-primary">{data.activeCustomers.loyal}</div>
              <div className="merchant-label">Loyal Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Time Chart */}
      <div className="chart-section">
        <h2 className="chart-section-title">Checkout Time Performance (seconds)</h2>
        <div className="chart-tall">
          <LineChart 
            title=""
            labels={dateLabels}
            datasets={[
              {
                label: 'Average Checkout Time',
                data: data.paymentMetrics.checkoutTime,
                borderColor: 'rgb(147, 51, 234)',
                backgroundColor: 'rgba(147, 51, 234, 0.5)',
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
} 