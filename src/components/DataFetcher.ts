'use client';

// Import all our mock data
import fiservData from '../data/fiserv.json';
import banksData from '../data/banks.json';
import brandsData from '../data/brands.json';
import merchantsData from '../data/merchants.json';

// Type definitions for our data structures
export interface TransactionData {
  daily: number[];
  weekly: number[];
  monthly: number[];
}

export interface FiservData {
  transactionVolume: TransactionData;
  transactionValue: TransactionData;
  revenueGenerated: TransactionData;
  activePartnerships: {
    banks: number;
    merchants: number;
    brands: number;
  };
  failureRate: TransactionData;
  processingSpeed: {
    average: number;
    peak: number;
    low: number;
  };
  topPaymentMethods: {
    name: string;
    percentage: number;
  }[];
}

export interface BanksData {
  transactionVolume: TransactionData;
  customerAcquisition: TransactionData;
  revenueGenerated: TransactionData;
  activeMerchants: {
    small: number;
    medium: number;
    large: number;
  };
  fraudMetrics: {
    detectedFraud: number[];
    preventedLoss: number[];
    suspiciousTransactions: number[];
  };
  customerSatisfaction: {
    overall: number;
    support: number;
    usability: number;
    reliability: number;
  };
  topServices: {
    name: string;
    percentage: number;
  }[];
}

export interface BrandsData {
  transactionVolume: TransactionData;
  customerEngagement: TransactionData;
  revenueGenerated: TransactionData;
  activeMerchants: {
    premium: number;
    standard: number;
    basic: number;
  };
  loyaltyMetrics: {
    newEnrollments: number[];
    activeUsers: number[];
    redemptionRate: number[];
  };
  customerSatisfaction: {
    overall: number;
    rewards: number;
    usability: number;
    support: number;
  };
  topProductCategories: {
    name: string;
    percentage: number;
  }[];
}

export interface MerchantsData {
  transactionVolume: TransactionData;
  customerConversion: TransactionData;
  revenueGenerated: TransactionData;
  activeCustomers: {
    new: number;
    returning: number;
    loyal: number;
  };
  paymentMetrics: {
    averageOrderValue: number[];
    cartAbandonment: number[];
    checkoutTime: number[];
  };
  customerSatisfaction: {
    overall: number;
    checkout: number;
    support: number;
    delivery: number;
  };
  topSalesChannels: {
    name: string;
    percentage: number;
  }[];
}

// Functions to fetch data (mock implementation now, can be replaced with actual API calls later)
export async function getFiservData(): Promise<FiservData> {
  // In a real app, this would be: return await fetch('/api/fiserv').then(res => res.json());
  return fiservData as FiservData;
}

export async function getBanksData(): Promise<BanksData> {
  // In a real app, this would be: return await fetch('/api/banks').then(res => res.json());
  return banksData as BanksData;
}

export async function getBrandsData(): Promise<BrandsData> {
  // In a real app, this would be: return await fetch('/api/brands').then(res => res.json());
  return brandsData as BrandsData;
}

export async function getMerchantsData(): Promise<MerchantsData> {
  // In a real app, this would be: return await fetch('/api/merchants').then(res => res.json());
  return merchantsData as MerchantsData;
} 