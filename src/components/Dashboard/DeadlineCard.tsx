import { Clock } from 'lucide-react';
import type { Goal } from '../../types';

interface DeadlineCardProps {
  goal: Goal;
  daysUntil: number;
  onClick: () => void;
}

export function DeadlineCard({ goal, daysUntil, onClick }: DeadlineCardProps) {
  const isUrgent = daysUntil <= 7;

  return (
    <div
      className="rounded-lg p-4 cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        backgroundColor: isUrgent ? '#fef2f2' : 'var(--bg-primary)',
        border: isUrgent ? '1px solid #fca5a5' : '1px solid var(--border-primary)'
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Clock className="w-4 h-4" />
            <span>
              {goal.deadline?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div
          className="px-2 py-1 rounded text-sm"
          style={{
            backgroundColor: isUrgent ? '#fee2e2' : 'var(--accent-primary-light)',
            color: isUrgent ? 'var(--accent-error)' : 'var(--accent-primary)'
          }}
        >
          {daysUntil} days
        </div>
      </div>
    </div>
  );
}

