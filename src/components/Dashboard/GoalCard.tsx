import { CheckCircle2 } from 'lucide-react';
import type { Goal } from '../../types';

interface GoalCardProps {
  goal: Goal;
  progress: number;
  categoryColor: string;
  onClick: () => void;
}

export function GoalCard({ goal, progress, onClick }: GoalCardProps) {
  return (
    <div
      className="rounded-lg p-4 transition-colors cursor-pointer"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-primary)';
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="mb-1" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
          <span className={`category-badge ${goal.category}`}>
            {goal.category}
          </span>
        </div>
        {goal.status === 'completed' && (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 ml-2" style={{ color: 'var(--accent-success)' }} />
        )}
      </div>
      {goal.subGoals.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${progress}%`,
                backgroundColor: 'var(--accent-primary)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

