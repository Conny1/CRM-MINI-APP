// components/MetricCard.tsx
import { useEffect, useState } from "react";
import type { Metric } from "../types";
import { Users, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  metric: Metric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  const { title, value, change, icon, color } = metric;
  const isPositive = change.startsWith('+');
    const [IconComponent, setIconComponent] = useState<LucideIcon>(Users);


  useEffect(() => {
    const loadIcon = async () => {
      try {
        // Dynamically import the specific icon
        const iconModule = await import(`lucide-react`);
        setIconComponent(() => iconModule[icon as keyof typeof iconModule ]  as LucideIcon || iconModule.Users);
      } catch (error) {
        console.error('Error loading icon:', error);
        // Fallback to Users icon
        setIconComponent(() => Users);
      }
    };
    
    loadIcon();
  }, []);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>
      {IconComponent &&  <div className={`${color} p-3 rounded-lg`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: '75%' }}></div>
        </div>
      </div>
    </div>
  );
}