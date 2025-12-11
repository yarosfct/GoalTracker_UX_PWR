import type { ComponentType, SVGProps } from 'react';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor = 'text-blue-600' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{label}</span>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="text-gray-900 text-2xl font-semibold">{value}</div>
    </div>
  );
}

