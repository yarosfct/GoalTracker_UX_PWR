import { CheckCircle2 } from 'lucide-react';
import type { Goal } from '../../types';

interface GoalCardProps {
  goal: Goal;
  progress: number;
  categoryColor: string;
  onClick: () => void;
}

export function GoalCard({ goal, progress, categoryColor, onClick }: GoalCardProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{goal.title}</h3>
          <span className={`inline-block px-2 py-1 rounded text-sm ${categoryColor}`}>
            {goal.category}
          </span>
        </div>
        {goal.status === 'completed' && (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
        )}
      </div>
      {goal.subGoals.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

