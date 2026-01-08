import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Circle, CheckCircle } from 'lucide-react';
import type { Goal } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface DeadlineCardProps {
  goal: Goal;
  daysUntil: number;
  onClick: () => void;
}

export function DeadlineCard({ goal, daysUntil, onClick }: DeadlineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isColorful } = useTheme();
  const isUrgent = daysUntil <= 7;
  
  const subGoalsWithDeadlines = goal.subGoals.filter(sg => sg.deadline);
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setIsExpanded(!isExpanded);
  };
  
  const getDaysUntil = (deadline: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div
      className="rounded-lg p-4 cursor-pointer transition-all"
      style={{
        backgroundColor: isUrgent ? '#fef2f2' : 'var(--bg-primary)',
        border: isUrgent ? '1px solid #fca5a5' : '1px solid var(--border-primary)',
        boxShadow: isColorful ? 'var(--shadow-sm)' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = isColorful ? 'translateY(-2px)' : 'none';
        e.currentTarget.style.boxShadow = isColorful ? 'var(--shadow-md)' : 'none';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = isColorful ? 'var(--shadow-sm)' : 'none';
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
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 rounded text-sm"
            style={{
              backgroundColor: isUrgent ? '#fee2e2' : 'var(--accent-primary-light)',
              color: isUrgent ? 'var(--accent-error)' : 'var(--accent-primary)'
            }}
          >
            {daysUntil} days
          </div>
          {subGoalsWithDeadlines.length > 0 && (
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
      
      {/* Expanded Subgoals with Deadlines */}
      {isExpanded && subGoalsWithDeadlines.length > 0 && (
        <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-primary)' }}>
          {subGoalsWithDeadlines.map((subGoal) => {
            const subGoalDaysUntil = getDaysUntil(subGoal.deadline!);
            const isSubGoalUrgent = subGoalDaysUntil <= 7;
            
            return (
              <div 
                key={subGoal.id} 
                className="flex items-center justify-between text-sm p-2 rounded"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 flex-1">
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
                <div className="flex items-center gap-2 ml-2">
                  <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span 
                    className="text-xs font-medium"
                    style={{ 
                      color: isSubGoalUrgent ? 'var(--accent-error)' : 'var(--text-secondary)' 
                    }}
                  >
                    {subGoal.deadline?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: isSubGoalUrgent ? '#fee2e2' : 'var(--bg-tertiary)',
                      color: isSubGoalUrgent ? 'var(--accent-error)' : 'var(--text-secondary)'
                    }}
                  >
                    {subGoalDaysUntil} {Math.abs(subGoalDaysUntil) === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

