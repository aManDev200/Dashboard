'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import LineChart from '@/components/LineChart';
import DoughnutChart from '@/components/DoughnutChart';
import { getFiservData, getBanksData, getBrandsData, getMerchantsData } from '@/components/DataFetcher';
import Link from 'next/link';
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function MainDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [combinedData, setCombinedData] = useState<{
    fiservTransactions: number[];
    banksTransactions: number[]; 
    brandsTransactions: number[];
    merchantsTransactions: number[];
    totalTransactions: number;
    totalRevenue: number;
    totalPartnerships: number;
    totalActiveCustomers: number;
    dateLabels: string[];
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const fiservData = await getFiservData();
        const banksData = await getBanksData();
        const brandsData = await getBrandsData();
        const merchantsData = await getMerchantsData();

        // Date labels for charts (last 7 days)
        const dateLabels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        // Combine relevant data
        const totalTransactionsFiserv = fiservData.transactionVolume.daily.reduce((a, b) => a + b, 0);
        const totalTransactionsBanks = banksData.transactionVolume.daily.reduce((a, b) => a + b, 0);
        const totalTransactionsBrands = brandsData.transactionVolume.daily.reduce((a, b) => a + b, 0);
        const totalTransactionsMerchants = merchantsData.transactionVolume.daily.reduce((a, b) => a + b, 0);
        
        const totalRevenueFiserv = fiservData.revenueGenerated.daily.reduce((a, b) => a + b, 0);
        const totalRevenueBanks = banksData.revenueGenerated.daily.reduce((a, b) => a + b, 0);
        const totalRevenueBrands = brandsData.revenueGenerated.daily.reduce((a, b) => a + b, 0);
        const totalRevenueMerchants = merchantsData.revenueGenerated.daily.reduce((a, b) => a + b, 0);

        const totalPartnerships = 
          fiservData.activePartnerships.banks + 
          fiservData.activePartnerships.brands + 
          fiservData.activePartnerships.merchants;

        const totalActiveCustomers = 
          merchantsData.activeCustomers.new + 
          merchantsData.activeCustomers.returning + 
          merchantsData.activeCustomers.loyal;

        setCombinedData({
          fiservTransactions: fiservData.transactionVolume.daily,
          banksTransactions: banksData.transactionVolume.daily,
          brandsTransactions: brandsData.transactionVolume.daily,
          merchantsTransactions: merchantsData.transactionVolume.daily,
          totalTransactions: totalTransactionsFiserv + totalTransactionsBanks + totalTransactionsBrands + totalTransactionsMerchants,
          totalRevenue: totalRevenueFiserv + totalRevenueBanks + totalRevenueBrands + totalRevenueMerchants,
          totalPartnerships,
          totalActiveCustomers,
          dateLabels,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading || !combinedData) {
    return (
      <div className="flex items-center justify-center" style={{ height: '256px' }}>
        <div className="text-large">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Payment Ecosystem Overview</h1>
        <div className="dashboard-subtitle">Comprehensive Analytics Dashboard</div>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid">
        <StatCard 
          title="Total Transactions" 
          value={combinedData.totalTransactions.toLocaleString()} 
          change={{ value: 5.2, isPositive: true }}
          icon={<ChartBarIcon className="icon" />}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(combinedData.totalRevenue / 1000000).toFixed(2)}M`} 
          change={{ value: 4.5, isPositive: true }}
          icon={<CurrencyDollarIcon className="icon" />}
        />
        <StatCard 
          title="Total Partnerships" 
          value={combinedData.totalPartnerships.toLocaleString()} 
          change={{ value: 3.1, isPositive: true }}
          icon={<BanknotesIcon className="icon" />}
        />
        <StatCard 
          title="Active Customers" 
          value={combinedData.totalActiveCustomers.toLocaleString()} 
          change={{ value: 6.3, isPositive: true }}
          icon={<UserGroupIcon className="icon" />}
        />
      </div>

      {/* Transaction Volume Chart */}
      <div className="chart-section">
        <h2 className="chart-section-title">Daily Transaction Volume by Player</h2>
        <div className="chart-tall">
          <LineChart 
            title=""
            labels={combinedData.dateLabels}
            datasets={[
              {
                label: 'Fiserv',
                data: combinedData.fiservTransactions,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
              },
              {
                label: 'Banks',
                data: combinedData.banksTransactions,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
              },
              {
                label: 'Brands',
                data: combinedData.brandsTransactions,
                borderColor: 'rgb(147, 51, 234)',
                backgroundColor: 'rgba(147, 51, 234, 0.5)',
              },
              {
                label: 'Merchants',
                data: combinedData.merchantsTransactions,
                borderColor: 'rgb(249, 115, 22)',
                backgroundColor: 'rgba(249, 115, 22, 0.5)',
              }
            ]}
          />
        </div>
      </div>

      {/* Player Dashboards Quick Access */}
      <div className="dashboard-grid">
        <Link href="/fiserv" className="player-card bg-blue">
          <h3 className="player-card-title">Fiserv Dashboard</h3>
          <p className="player-card-description">Payment aggregator analytics and insights</p>
          <div className="player-card-footer">
            <span className="player-card-link">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </Link>
        <Link href="/banks" className="player-card bg-green">
          <h3 className="player-card-title">Banks Dashboard</h3>
          <p className="player-card-description">Banking institutions' key metrics</p>
          <div className="player-card-footer">
            <span className="player-card-link">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </Link>
        <Link href="/brands" className="player-card bg-purple">
          <h3 className="player-card-title">Brands Dashboard</h3>
          <p className="player-card-description">Brand partnerships performance data</p>
          <div className="player-card-footer">
            <span className="player-card-link">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </Link>
        <Link href="/merchants" className="player-card bg-orange">
          <h3 className="player-card-title">Merchants Dashboard</h3>
          <p className="player-card-description">Merchant business analytics</p>
          <div className="player-card-footer">
            <span className="player-card-link">
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </Link>
      </div>

      {/* Ecosystem Structure */}
      <div className="ecosystem-section">
        <h2 className="ecosystem-title">Payment Ecosystem Structure</h2>
        <div className="ecosystem-container">
          <div className="ecosystem-node">
            <div className="ecosystem-circle large bg-blue-light">
              <div className="ecosystem-circle-text text-blue">Fiserv</div>
            </div>
            <div className="ecosystem-label">Payment Aggregator</div>
          </div>
          
          <div className="ecosystem-divider vertical"></div>
          
          <div className="ecosystem-container">
            <div className="ecosystem-node">
              <div className="ecosystem-circle small bg-green-light">
                <div className="ecosystem-circle-text text-green">Banks</div>
              </div>
              <div className="ecosystem-label">Financial Institutions</div>
            </div>
            
            <div className="ecosystem-divider horizontal"></div>
            
            <div className="ecosystem-node">
              <div className="ecosystem-circle small bg-purple-light">
                <div className="ecosystem-circle-text text-purple">Brands</div>
              </div>
              <div className="ecosystem-label">Product Companies</div>
            </div>
            
            <div className="ecosystem-divider horizontal"></div>
            
            <div className="ecosystem-node">
              <div className="ecosystem-circle small bg-orange-light">
                <div className="ecosystem-circle-text text-orange">Merchants</div>
              </div>
              <div className="ecosystem-label">Product Sellers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 