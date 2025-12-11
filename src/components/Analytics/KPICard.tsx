import type { ComponentType, SVGProps } from 'react';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  progress: number;
  progressColor: string;
  message: string;
}

export function KPICard({ label, value, icon: Icon, iconColor, progress, progressColor, message }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600">{label}</span>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="text-blue-600 mb-2">{value}</div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">{message}</p>
    </div>
  );
}


