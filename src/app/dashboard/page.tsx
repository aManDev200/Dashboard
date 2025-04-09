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
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Payment Ecosystem Overview</h1>
        <div className="text-sm text-gray-500">Comprehensive Analytics Dashboard</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Transactions" 
          value={combinedData.totalTransactions.toLocaleString()} 
          change={{ value: 5.2, isPositive: true }}
          icon={<ChartBarIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(combinedData.totalRevenue / 1000000).toFixed(2)}M`} 
          change={{ value: 4.5, isPositive: true }}
          icon={<CurrencyDollarIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Total Partnerships" 
          value={combinedData.totalPartnerships.toLocaleString()} 
          change={{ value: 3.1, isPositive: true }}
          icon={<BanknotesIcon className="h-10 w-10" />}
        />
        <StatCard 
          title="Active Customers" 
          value={combinedData.totalActiveCustomers.toLocaleString()} 
          change={{ value: 6.3, isPositive: true }}
          icon={<UserGroupIcon className="h-10 w-10" />}
        />
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Transaction Volume by Player</h2>
        <div className="h-80">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PlayerCard
          title="Fiserv Dashboard"
          description="Payment aggregator analytics and insights"
          href="/fiserv"
          bgColor="bg-blue-600"
        />
        <PlayerCard
          title="Banks Dashboard"
          description="Banking institutions' key metrics"
          href="/banks"
          bgColor="bg-green-600"
        />
        <PlayerCard
          title="Brands Dashboard"
          description="Brand partnerships performance data"
          href="/brands"
          bgColor="bg-purple-600"
        />
        <PlayerCard
          title="Merchants Dashboard"
          description="Merchant business analytics"
          href="/merchants"
          bgColor="bg-orange-600"
        />
      </div>

      {/* Ecosystem Structure */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Payment Ecosystem Structure</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <div className="text-blue-600 font-bold text-xl">Fiserv</div>
            </div>
            <div className="text-sm text-gray-500">Payment Aggregator</div>
          </div>
          
          <div className="border-t-2 md:border-t-0 md:border-l-2 border-gray-200 h-12 w-24 md:h-24 md:w-12"></div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <div className="text-green-600 font-bold text-lg">Banks</div>
              </div>
              <div className="text-sm text-gray-500">Financial Institutions</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <div className="text-purple-600 font-bold text-lg">Brands</div>
              </div>
              <div className="text-sm text-gray-500">Product Companies</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <div className="text-orange-600 font-bold text-lg">Merchants</div>
              </div>
              <div className="text-sm text-gray-500">Product Sellers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlayerCardProps {
  title: string;
  description: string;
  href: string;
  bgColor: string;
}

function PlayerCard({ title, description, href, bgColor }: PlayerCardProps) {
  return (
    <Link 
      href={href} 
      className={`${bgColor} hover:opacity-90 transition-opacity rounded-lg p-5 text-white shadow-lg flex flex-col`}
    >
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-white/80 text-sm mb-3">{description}</p>
      <div className="mt-auto flex items-center justify-end">
        <span className="text-xs font-medium">View Details</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );
} 