import { Plus, CheckCircle2, Circle, Calendar, Edit, Trash2 } from 'lucide-react';
import type { Goal } from '../../types';

interface SubGoalListProps {
  goal: Goal;
  onAddSubGoal: () => void;
  onEditSubGoal: (subGoal: any) => void;
  onToggleSubGoal: (subGoalId: string) => void;
  onDeleteSubGoal: (subGoalId: string) => void;
}

export function SubGoalList({
  goal,
  onAddSubGoal,
  onEditSubGoal,
  onToggleSubGoal,
  onDeleteSubGoal,
}: SubGoalListProps) {
  return (
    <div 
      className="p-6"
      style={{
        borderTop: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 style={{ color: 'var(--text-primary)' }}>Sub-goals</h4>
        <button
          onClick={onAddSubGoal}
          className="px-3 py-1 text-white rounded-lg transition-colors flex items-center gap-1 text-sm"
          style={{ backgroundColor: 'var(--accent-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
        >
          <Plus className="w-4 h-4" />
          Add Sub-goal
        </button>
      </div>
      
      {goal.subGoals.length === 0 ? (
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>No sub-goals yet. Click "Add Sub-goal" to create one.</p>
      ) : (
        <div className="space-y-2">
          {goal.subGoals.map(subGoal => {
            const isOverdue = subGoal.deadline && !subGoal.completed && new Date(subGoal.deadline) < new Date();
            return (
              <div
                key={subGoal.id}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: isOverdue ? '#fef2f2' : 'var(--bg-primary)',
                  border: isOverdue ? '1px solid #fca5a5' : '1px solid var(--border-primary)'
                }}
              >
                <button
                  onClick={() => onToggleSubGoal(subGoal.id)}
                  className="flex-shrink-0"
                >
                  {subGoal.completed ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-success)' }} />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  )}
                </button>
                <div className="flex-1">
                  <span 
                    className="block"
                    style={{ 
                      textDecoration: subGoal.completed ? 'line-through' : 'none',
                      color: subGoal.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}
                  >
                    {subGoal.title}
                  </span>
                  {subGoal.deadline && (
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span 
                        className="text-xs"
                        style={{ color: isOverdue ? 'var(--accent-error)' : 'var(--text-muted)' }}
                      >
                        Due: {new Date(subGoal.deadline).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onEditSubGoal(subGoal)}
                  className="p-1 rounded transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit sub-goal"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteSubGoal(subGoal.id)}
                  className="p-1 rounded transition-colors"
                  style={{ color: 'var(--accent-error)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Delete sub-goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

