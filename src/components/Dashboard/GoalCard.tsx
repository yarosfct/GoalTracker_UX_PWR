import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Circle, CheckCircle } from 'lucide-react';
import type { Goal } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface GoalCardProps {
  goal: Goal;
  progress: number;
  categoryColor: string;
  onClick: () => void;
}

export function GoalCard({ goal, progress, onClick }: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isColorful } = useTheme();
  
  const completedSubGoals = goal.subGoals.filter(sg => sg.completed).length;
  const totalSubGoals = goal.subGoals.length;
  const totalItems = goal.isFinalGoal ? totalSubGoals + 1 : totalSubGoals;
  const completedItems = goal.isFinalGoal ? completedSubGoals + (goal.mainGoalCompleted ? 1 : 0) : completedSubGoals;
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="rounded-lg p-4 transition-all cursor-pointer"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        border: `1px solid var(--border-primary)`,
        boxShadow: isColorful ? 'var(--shadow-sm)' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.transform = isColorful ? 'translateY(-2px)' : 'none';
        e.currentTarget.style.boxShadow = isColorful ? 'var(--shadow-md)' : 'none';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-primary)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = isColorful ? 'var(--shadow-sm)' : 'none';
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
      
      {totalItems > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Progress</span>
            <div className="flex items-center gap-2">
              <span>{completedItems}/{totalItems} completed</span>
              <span>•</span>
              <span>{progress}%</span>
              {totalItems > 0 && (
                <button
                  onClick={handleExpandClick}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${progress}%`,
                background: isColorful ? 'var(--button-primary-bg)' : 'var(--accent-primary)'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Expanded Subgoals */}
      {isExpanded && totalItems > 0 && (
        <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-primary)' }}>
          {goal.subGoals.map((subGoal) => (
            <div 
              key={subGoal.id} 
              className="flex items-center gap-2 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {subGoal.completed ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-success)' }} />
              ) : (
                <Circle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              )}
              <span 
                style={{ 
                  color: subGoal.completed ? 'var(--text-muted)' : 'var(--text-secondary)',
                  textDecoration: subGoal.completed ? 'line-through' : 'none'
                }}
              >
                {subGoal.title}
              </span>
            </div>
          ))}
          
          {/* Main Goal Checkbox (if isFinalGoal) */}
          {goal.isFinalGoal && (
            <div 
              className="flex items-center gap-2 text-sm p-2 rounded"
              style={{ backgroundColor: 'var(--accent-primary-light)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {goal.mainGoalCompleted ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
              ) : (
                <Circle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
              )}
              <span 
                className="font-medium"
                style={{ 
                  color: 'var(--accent-primary)',
                  textDecoration: goal.mainGoalCompleted ? 'line-through' : 'none'
                }}
              >
                🎯 {goal.title}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

