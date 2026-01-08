import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Copy, Bell } from 'lucide-react';
import type { Goal, GoalCategory, GoalStatus, GoalPriority } from '../../types';
import { SubGoalList } from './SubGoalList';
import { GoalPrompt } from '../Goals';

interface GoalListItemProps {
  goal: Goal;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onNotificationSettings: () => void;
  onAddSubGoal: () => void;
  onEditSubGoal: (subGoal: any) => void;
  onToggleSubGoal: (subGoalId: string) => void;
  onDeleteSubGoal: (subGoalId: string) => void;
  onStatusChange: (status: GoalStatus) => void;
  onToggleMainGoal?: (completed: boolean) => void;
}

export function GoalListItem({
  goal,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onDuplicate,
  onNotificationSettings,
  onAddSubGoal,
  onEditSubGoal,
  onToggleSubGoal,
  onDeleteSubGoal,
  onStatusChange,
  onToggleMainGoal,
}: GoalListItemProps) {
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [showAddSubGoalPrompt, setShowAddSubGoalPrompt] = useState(false);
  const [wasTriggeredByMainGoal, setWasTriggeredByMainGoal] = useState(false);
  const prevCompletedRef = useRef(goal.subGoals.filter(sg => sg.completed).length);
  const prevMainGoalCompletedRef = useRef(goal.mainGoalCompleted || false);

  useEffect(() => {
    const currentCompleted = goal.subGoals.filter(sg => sg.completed).length;
    const total = goal.isFinalGoal ? goal.subGoals.length + 1 : goal.subGoals.length;
    const mainGoalCompleted = goal.mainGoalCompleted || false;
    const totalCompletedItems = goal.isFinalGoal ? currentCompleted + (mainGoalCompleted ? 1 : 0) : currentCompleted;
    
    // Check if we just reached 100% completion (transition from <100% to 100%)
    if (total > 0 && totalCompletedItems === total && 
        (prevCompletedRef.current < currentCompleted || prevMainGoalCompletedRef.current !== mainGoalCompleted) && 
        goal.status !== 'completed') {
      // Track if this was triggered by the main goal being checked
      const triggeredByMainGoal = prevMainGoalCompletedRef.current !== mainGoalCompleted && mainGoalCompleted;
      setWasTriggeredByMainGoal(triggeredByMainGoal);
      setShowCompletionPrompt(true);
    }
    
    prevCompletedRef.current = currentCompleted;
    prevMainGoalCompletedRef.current = mainGoalCompleted;
  }, [goal.subGoals, goal.status, goal.isFinalGoal, goal.mainGoalCompleted]);

  const handleCompletionConfirm = () => {
    onStatusChange('completed');
    setShowCompletionPrompt(false);
    setWasTriggeredByMainGoal(false);
  };

  const handleCompletionCancel = () => {
    setShowCompletionPrompt(false);
    setShowAddSubGoalPrompt(true);
    // wasTriggeredByMainGoal is kept until handleAddSubGoalConfirm
  };

  const handleAddSubGoalConfirm = () => {
    // If the completion prompt was triggered by the main goal being checked,
    // uncheck the main goal when adding another subgoal
    if (wasTriggeredByMainGoal && onToggleMainGoal) {
      onToggleMainGoal(false);
    }
    setShowAddSubGoalPrompt(false);
    setWasTriggeredByMainGoal(false);
    onAddSubGoal();
  };
  
  const handleMainGoalToggle = () => {
    if (onToggleMainGoal) {
      const newCompleted = !(goal.mainGoalCompleted || false);
      onToggleMainGoal(newCompleted);
    }
  };
  const getCategoryClass = (category: GoalCategory) => {
    return `category-badge ${category}`;
  };

  const getPriorityColor = (priority: GoalPriority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return colors[priority];
  };

  const getStatusColor = (status: GoalStatus) => {
    const colors = {
      'not-started': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'on-hold': 'bg-orange-100 text-orange-700',
    };
    return colors[status];
  };

  const getProgressPercentage = () => {
    const subGoalsCompleted = goal.subGoals.filter(sg => sg.completed).length;
    const mainGoalCompleted = goal.mainGoalCompleted || false;
    
    if (goal.isFinalGoal) {
      // When isFinalGoal is true, include the main goal in the total count
      const total = goal.subGoals.length + 1;
      if (total === 1) return mainGoalCompleted ? 100 : 0; // Only main goal, no subgoals
      const completedItems = subGoalsCompleted + (mainGoalCompleted ? 1 : 0);
      return Math.round((completedItems / total) * 100);
    } else {
      // Normal calculation - only count subgoals
      if (goal.subGoals.length === 0) return 0;
      return Math.round((subGoalsCompleted / goal.subGoals.length) * 100);
    }
  };
  
  const getTotalItems = () => {
    return goal.isFinalGoal ? goal.subGoals.length + 1 : goal.subGoals.length;
  };
  
  const getCompletedItems = () => {
    const subGoalsCompleted = goal.subGoals.filter(sg => sg.completed).length;
    const mainGoalCompleted = goal.mainGoalCompleted || false;
    return goal.isFinalGoal ? subGoalsCompleted + (mainGoalCompleted ? 1 : 0) : subGoalsCompleted;
  };

  const progress = getProgressPercentage();

  return (
    <div 
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      {/* Goal Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <button
            onClick={onToggleExpand}
            className="mt-1"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="mb-2" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>{goal.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={getCategoryClass(goal.category)}>
                    {goal.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(goal.status)}`}>
                    {goal.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(goal.priority)}`}>
                    {goal.priority} priority
                  </span>
                  {goal.deadline && (
                    <span className="px-2 py-1 rounded text-sm" style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)'
                    }}>
                      Due: {goal.deadline.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onNotificationSettings}
                  className="p-2 rounded-lg transition-colors"
                  style={goal.notifications?.enabled ? {
                    color: 'var(--accent-primary)',
                    backgroundColor: 'var(--accent-primary-light)'
                  } : {
                    color: 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    if (!goal.notifications?.enabled) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!goal.notifications?.enabled) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  title="Notification settings"
                >
                  <Bell className="w-5 h-5" />
                </button>
                <button
                  onClick={onEdit}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit goal"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={onDuplicate}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Duplicate goal"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--accent-error)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Delete goal"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {(goal.subGoals.length > 0 || goal.isFinalGoal) && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <span>Overall Progress</span>
                  <span>{progress}% ({getCompletedItems()}/{getTotalItems()} completed)</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: goal.status === 'completed' ? 'var(--accent-success)' : 'var(--accent-primary)'
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Main Goal Checkbox (when isFinalGoal is true) */}
            {goal.isFinalGoal && (
              <div className="mt-4 p-4 rounded-lg border-2 border-purple-300 bg-purple-50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`main-goal-${goal.id}`}
                    checked={goal.mainGoalCompleted || false}
                    onChange={handleMainGoalToggle}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  />
                  <label 
                    htmlFor={`main-goal-${goal.id}`} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium text-purple-900">
                      🎯 {goal.title}
                    </div>
                    <div className="text-sm text-purple-700">
                      Mark this main goal as completed
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-goals (Expanded) */}
      {isExpanded && (
        <SubGoalList
          goal={goal}
          onAddSubGoal={onAddSubGoal}
          onEditSubGoal={onEditSubGoal}
          onToggleSubGoal={onToggleSubGoal}
          onDeleteSubGoal={onDeleteSubGoal}
        />
      )}

      {/* Prompts */}
      <GoalPrompt
        isOpen={showCompletionPrompt}
        onClose={() => setShowCompletionPrompt(false)}
        onConfirm={handleCompletionConfirm}
        title="Goal Completed?"
        message="You've completed all sub-goals! Do you want to mark this goal as completed?"
        confirmText="Yes, Mark as Completed"
        cancelText="No"
        onCancel={handleCompletionCancel}
      />

      <GoalPrompt
        isOpen={showAddSubGoalPrompt}
        onClose={() => {
          setShowAddSubGoalPrompt(false);
          setWasTriggeredByMainGoal(false);
        }}
        onConfirm={handleAddSubGoalConfirm}
        title="Add Another Sub-goal?"
        message="Do you want to add another sub-goal to keep going?"
        confirmText="Yes, Add Sub-goal"
        cancelText="No"
      />
    </div>
  );
}

