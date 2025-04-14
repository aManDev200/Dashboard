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
      <div className="flex items-center justify-center" style={{ height: '256px' }}>
        <div className="text-large">Loading dashboard data...</div>
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Banks Analytics Dashboard</h1>
        <div className="dashboard-subtitle">Banking Institutions Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 4.2, isPositive: true }}
          icon={<BuildingLibraryIcon className="icon" />}
        />
        <StatCard 
          title="New Customers" 
          value={totalCustomers.toLocaleString()} 
          change={{ value: 6.8, isPositive: true }}
          icon={<UserPlusIcon className="icon" />}
        />
        <StatCard 
          title="Revenue Generated" 
          value={`$${(totalRevenue / 1000).toFixed(2)}K`} 
          change={{ value: 3.5, isPositive: true }}
          icon={<CurrencyDollarIcon className="icon" />}
        />
        <StatCard 
          title="Active Merchants" 
          value={totalMerchants.toLocaleString()} 
          change={{ value: 2.1, isPositive: true }}
          icon={<ShieldCheckIcon className="icon" />}
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
                  borderColor: 'rgb(22, 163, 74)',
                  backgroundColor: 'rgba(22, 163, 74, 0.5)',
                }
              ]}
            />
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Daily Customer Acquisition</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-section">
          <h2 className="chart-section-title">Fraud Detection Metrics</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Top Banking Services</h2>
          <div className="chart-tall">
            <DoughnutChart 
              title=""
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
        </div>
      </div>

      {/* Customer Satisfaction & Merchant Distribution */}
      <div className="chart-grid">
        <div className="chart-section">
          <h2 className="chart-section-title">Customer Satisfaction</h2>
          <div className="satisfaction-grid">
            <div className="satisfaction-item">
              <div className="satisfaction-value text-primary">{data.customerSatisfaction.overall}/5</div>
              <div className="satisfaction-label">Overall Satisfaction</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-success">{data.customerSatisfaction.usability}/5</div>
              <div className="satisfaction-label">Usability Rating</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-info">{data.customerSatisfaction.support}/5</div>
              <div className="satisfaction-label">Support Quality</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-warning">{data.customerSatisfaction.reliability}/5</div>
              <div className="satisfaction-label">System Reliability</div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h2 className="chart-section-title">Active Merchant Distribution</h2>
          <div className="merchant-grid">
            <div className="merchant-item bg-primary-light">
              <div className="merchant-value text-primary">{data.activeMerchants.small}</div>
              <div className="merchant-label">Small Businesses</div>
            </div>
            <div className="merchant-item bg-success-light">
              <div className="merchant-value text-success">{data.activeMerchants.medium}</div>
              <div className="merchant-label">Medium Businesses</div>
            </div>
            <div className="merchant-item bg-info-light">
              <div className="merchant-value text-info">{data.activeMerchants.large}</div>
              <div className="merchant-label">Large Enterprises</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 