# Payment Analytics Dashboard

A comprehensive analytics dashboard for different players in the payment ecosystem: Fiserv (payment aggregator), Banks, Brands, and Merchants.

## Overview

This Next.js application provides detailed analytics dashboards for key players in the payment ecosystem. Each dashboard presents specific metrics relevant to its respective domain, with visualizations to help understand trends and performance.

## Features

- **Comprehensive Dashboard**: Overview of all players in the payment ecosystem
- **Player-specific Dashboards**: Dedicated analytics for each player type
- **Interactive Charts**: Visualize transaction volumes, revenue, customer metrics and more
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **UI Components**: @headlessui/react and @heroicons/react

## Dashboard Pages

1. **Main Dashboard**: Overview of all players with combined metrics
2. **Fiserv Dashboard**: Analytics for the payment aggregator
3. **Banks Dashboard**: Analytics for banking institutions
4. **Brands Dashboard**: Analytics for brand partnerships
5. **Merchants Dashboard**: Analytics for merchant businesses

## Data Structure

Currently, the application uses mock data stored in JSON files located in `src/data/`. This can be easily replaced with real API calls in the `DataFetcher.ts` utility file.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

To replace mock data with real API data:

1. Go to `src/components/DataFetcher.ts`
2. Update the data fetching functions to use real API endpoints

Example:
```typescript
export async function getFiservData(): Promise<FiservData> {
  // Replace mock data with real API call
  return await fetch('/api/fiserv').then(res => res.json());
}
```

## License

This project is MIT licensed.
