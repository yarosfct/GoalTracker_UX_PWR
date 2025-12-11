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
    <div 
      className="rounded-lg p-6" 
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <Icon className={`w-5 h-5 ${iconColor}`} style={{ color: 'var(--accent-primary)' }} />
      </div>
      <div className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

