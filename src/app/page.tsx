import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Payment Analytics Platform</h1>
      <p className="text-xl text-gray-600 mb-12 max-w-3xl text-center">
        Comprehensive analytics dashboard for all players in the payment ecosystem
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        <DashboardCard 
          title="Fiserv Dashboard" 
          description="Analytics for payment aggregator services"
          href="/fiserv"
          bgColor="bg-blue-600"
        />
        
        <DashboardCard 
          title="Banks Dashboard" 
          description="Analytics for banking institutions"
          href="/banks"
          bgColor="bg-green-600"
        />
        
        <DashboardCard 
          title="Brands Dashboard" 
          description="Analytics for brand partnerships"
          href="/brands"
          bgColor="bg-purple-600"
        />
        
        <DashboardCard 
          title="Merchants Dashboard" 
          description="Analytics for merchant services"
          href="/merchants"
          bgColor="bg-orange-600"
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  bgColor: string;
}

function DashboardCard({ title, description, href, bgColor }: DashboardCardProps) {
  return (
    <Link 
      href={href} 
      className={`${bgColor} hover:opacity-90 transition-opacity rounded-lg p-6 text-white shadow-lg flex flex-col h-full`}
    >
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-white/80 mb-4 flex-grow">{description}</p>
      <div className="mt-auto flex items-center justify-end">
        <span className="text-sm font-medium">View Dashboard</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );
}
