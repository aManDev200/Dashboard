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
      <div className="flex items-center justify-center" style={{ height: '256px' }}>
        <div className="text-large">Loading dashboard data...</div>
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Fiserv Analytics Dashboard</h1>
        <div className="dashboard-subtitle">Payment Aggregator Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 5.8, isPositive: true }}
          icon={<ArrowTrendingUpIcon className="icon" />}
        />
        <StatCard 
          title="Transaction Value" 
          value={`$${(totalValue / 1000000).toFixed(2)}M`} 
          change={{ value: 4.2, isPositive: true }}
          icon={<CurrencyDollarIcon className="icon" />}
        />
        <StatCard 
          title="Processing Speed" 
          value={`${data.processingSpeed.average.toFixed(2)}s`} 
          change={{ value: 0.3, isPositive: true }}
          icon={<BanknotesIcon className="icon" />}
        />
        <StatCard 
          title="Failure Rate" 
          value={`${(averageFailureRate * 100).toFixed(2)}%`} 
          change={{ value: 0.2, isPositive: false }}
          icon={<BuildingLibraryIcon className="icon" />}
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
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                }
              ]}
            />
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Daily Transaction Value ($)</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
              labels={dateLabels}
              datasets={[
                {
                  label: 'Value',
                  data: data.transactionValue.daily.map(val => val / 1000),
                  borderColor: 'rgb(16, 185, 129)',
                  backgroundColor: 'rgba(16, 185, 129, 0.5)',
                }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-section">
          <h2 className="chart-section-title">Failure Rate (%)</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Payment Methods Distribution</h2>
          <div className="chart-tall">
            <DoughnutChart 
              title=""
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
        </div>
      </div>

      {/* Partnership Stats */}
      <div className="chart-section">
        <h2 className="chart-section-title">Active Partnerships</h2>
        <div className="merchant-grid">
          <div className="merchant-item bg-primary-light">
            <div className="merchant-value text-primary">{data.activePartnerships.banks}</div>
            <div className="merchant-label">Banks</div>
          </div>
          <div className="merchant-item bg-info-light">
            <div className="merchant-value text-info">{data.activePartnerships.brands}</div>
            <div className="merchant-label">Brands</div>
          </div>
          <div className="merchant-item bg-warning-light">
            <div className="merchant-value text-warning">{data.activePartnerships.merchants}</div>
            <div className="merchant-label">Merchants</div>
          </div>
        </div>
      </div>
    </div>
  );
} 