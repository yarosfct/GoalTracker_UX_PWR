import type { ComponentType, SVGProps } from 'react';
import { useTheme } from '../../hooks/useTheme';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  colorIndex?: number;
}

export function StatCard({ label, value, icon: Icon, iconColor = 'text-blue-600', colorIndex = 0 }: StatCardProps) {
  const { isColorful } = useTheme();
  
  // Cycle through colorful card classes
  const cardClass = isColorful ? `card-colorful-${(colorIndex % 4) + 1}` : '';
  
  return (
    <div 
      className={`rounded-lg p-6 stat-card-hover ${cardClass}`}
      style={{ 
        backgroundColor: isColorful ? 'transparent' : 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <div 
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: isColorful ? 'rgba(255, 255, 255, 0.8)' : 'transparent'
          }}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} style={{ color: 'var(--accent-primary)' }} />
        </div>
      </div>
      <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

