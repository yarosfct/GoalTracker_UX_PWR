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
    <div 
      className="rounded-lg p-6 hover:shadow-md transition-shadow"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="mb-2" style={{ color: 'var(--accent-primary)' }}>{value}</div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <div 
          className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{message}</p>
    </div>
  );
}


