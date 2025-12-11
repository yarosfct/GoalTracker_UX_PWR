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
      className={`border rounded-lg p-4 ${
        isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'
      } cursor-pointer hover:opacity-90 transition-opacity`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{goal.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
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
          className={`px-2 py-1 rounded text-sm ${
            isUrgent ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          {daysUntil} days
        </div>
      </div>
    </div>
  );
}

