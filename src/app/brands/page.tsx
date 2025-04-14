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
      <div className="flex items-center justify-center" style={{ height: '256px' }}>
        <div className="text-large">Loading dashboard data...</div>
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Brands Analytics Dashboard</h1>
        <div className="dashboard-subtitle">Brand Partnership Insights</div>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid">
        <StatCard 
          title="Total Transactions" 
          value={totalTransactions.toLocaleString()} 
          change={{ value: 5.3, isPositive: true }}
          icon={<ChartBarIcon className="icon" />}
        />
        <StatCard 
          title="Customer Engagement" 
          value={totalEngagement.toLocaleString()} 
          change={{ value: 7.5, isPositive: true }}
          icon={<UserGroupIcon className="icon" />}
        />
        <StatCard 
          title="Revenue Generated" 
          value={`$${(totalRevenue / 1000).toFixed(2)}K`} 
          change={{ value: 4.8, isPositive: true }}
          icon={<CurrencyDollarIcon className="icon" />}
        />
        <StatCard 
          title="Active Merchants" 
          value={totalMerchants.toLocaleString()} 
          change={{ value: 3.2, isPositive: true }}
          icon={<ShoppingBagIcon className="icon" />}
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
                  borderColor: 'rgb(147, 51, 234)',
                  backgroundColor: 'rgba(147, 51, 234, 0.5)',
                }
              ]}
            />
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Daily Customer Engagement</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-section">
          <h2 className="chart-section-title">Loyalty Program Metrics</h2>
          <div className="chart-tall">
            <LineChart 
              title=""
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
          </div>
        </div>
        <div className="chart-section">
          <h2 className="chart-section-title">Top Product Categories</h2>
          <div className="chart-tall">
            <DoughnutChart 
              title=""
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
              <div className="satisfaction-value text-success">{data.customerSatisfaction.rewards}/5</div>
              <div className="satisfaction-label">Rewards Program</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-info">{data.customerSatisfaction.usability}/5</div>
              <div className="satisfaction-label">Usability Rating</div>
            </div>
            <div className="satisfaction-item">
              <div className="satisfaction-value text-warning">{data.customerSatisfaction.support}/5</div>
              <div className="satisfaction-label">Support Quality</div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h2 className="chart-section-title">Active Merchant Distribution</h2>
          <div className="merchant-grid">
            <div className="merchant-item bg-primary-light">
              <div className="merchant-value text-primary">{data.activeMerchants.premium}</div>
              <div className="merchant-label">Premium Partners</div>
            </div>
            <div className="merchant-item bg-info-light">
              <div className="merchant-value text-info">{data.activeMerchants.standard}</div>
              <div className="merchant-label">Standard Partners</div>
            </div>
            <div className="merchant-item bg-success-light">
              <div className="merchant-value text-success">{data.activeMerchants.basic}</div>
              <div className="merchant-label">Basic Partners</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Users Chart */}
      <div className="chart-section">
        <h2 className="chart-section-title">Loyalty Program Active Users</h2>
        <div className="chart-tall">
          <LineChart 
            title=""
            labels={dateLabels}
            datasets={[
              {
                label: 'Active Users',
                data: data.loyaltyMetrics.activeUsers,
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