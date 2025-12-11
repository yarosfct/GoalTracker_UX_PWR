import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface MotivationalMessageProps {
  inProgressCount: number;
}

export function MotivationalMessage({ inProgressCount }: MotivationalMessageProps) {
  const { isColorful } = useTheme();
  
  if (inProgressCount === 0) return null;

  return (
    <div 
      className="mt-8 rounded-lg p-6"
      style={{
        background: isColorful ? 'var(--gradient-accent)' : 'var(--gradient-accent)',
        border: '1px solid var(--border-secondary)'
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-primary-light)' }}
        >
          <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div>
          <h3 className="mb-1" style={{ color: 'var(--text-primary)' }}>Keep Going! 💪</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            You have {inProgressCount} goal{inProgressCount !== 1 ? 's' : ''} in progress.{' '}
            Stay focused and you'll achieve great things!
          </p>
        </div>
      </div>
    </div>
  );
}







