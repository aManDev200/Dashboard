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
    <div className={`stat-card ${className}`}>
      <div className="stat-content">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
          {change && (
            <div className="stat-change">
              <span className={change.isPositive ? 'change-positive' : 'change-negative'}>
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
              <span className="change-label">from previous period</span>
            </div>
          )}
        </div>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
    </div>
  );
} 