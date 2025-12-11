import { Target } from 'lucide-react';

interface EmptyGoalsStateProps {
  hasFilters: boolean;
  onCreateGoal: () => void;
}

export function EmptyGoalsState({ hasFilters, onCreateGoal }: EmptyGoalsStateProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-gray-900 mb-2">No goals found</h3>
      <p className="text-gray-600 mb-4">
        {hasFilters
          ? 'Try adjusting your filters'
          : 'Create your first goal to get started'}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreateGoal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Your First Goal
        </button>
      )}
    </div>
  );
}




