import { Target } from 'lucide-react';

interface EmptyGoalsStateProps {
  hasFilters: boolean;
  onCreateGoal: () => void;
}

export function EmptyGoalsState({ hasFilters, onCreateGoal }: EmptyGoalsStateProps) {
  return (
    <div 
      className="rounded-lg p-12 text-center"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <Target className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--border-secondary)' }} />
      <h3 className="mb-2" style={{ color: 'var(--text-primary)' }}>No goals found</h3>
      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
        {hasFilters
          ? 'Try adjusting your filters'
          : 'Create your first goal to get started'}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreateGoal}
          className="px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--accent-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
        >
          Create Your First Goal
        </button>
      )}
    </div>
  );
}







