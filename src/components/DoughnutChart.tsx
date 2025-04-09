'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor: string[];
  className?: string;
}

export default function DoughnutChart({
  title,
  labels,
  data,
  backgroundColor,
  className = '',
}: DoughnutChartProps) {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    cutout: '70%',
  };

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="h-64">
        <Doughnut options={options} data={chartData} />
      </div>
    </div>
  );
} 