'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({ title, value, change, icon, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white shadow rounded-lg p-5 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          {change && (
            <div className="mt-1">
              <span
                className={`${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                } font-medium text-sm`}
              >
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
              <span className="text-gray-500 text-sm ml-1">from previous period</span>
            </div>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
} 