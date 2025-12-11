import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Calendar, Edit, Trash2, Copy, Bell } from 'lucide-react';
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
}: GoalListItemProps) {
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [showAddSubGoalPrompt, setShowAddSubGoalPrompt] = useState(false);
  const prevCompletedRef = useRef(goal.subGoals.filter(sg => sg.completed).length);

  useEffect(() => {
    const currentCompleted = goal.subGoals.filter(sg => sg.completed).length;
    const total = goal.subGoals.length;
    
    // Check if we just reached 100% completion (transition from <100% to 100%)
    if (total > 0 && currentCompleted === total && prevCompletedRef.current < total && goal.status !== 'completed') {
      setShowCompletionPrompt(true);
    }
    
    prevCompletedRef.current = currentCompleted;
  }, [goal.subGoals, goal.status]);

  const handleCompletionConfirm = () => {
    onStatusChange('completed');
    setShowCompletionPrompt(false);
  };

  const handleCompletionCancel = () => {
    setShowCompletionPrompt(false);
    setShowAddSubGoalPrompt(true);
  };

  const handleAddSubGoalConfirm = () => {
    setShowAddSubGoalPrompt(false);
    onAddSubGoal();
  };
  const getCategoryColor = (category: GoalCategory) => {
    const colors: Record<string, string> = {
      study: 'bg-blue-100 text-blue-700 border-blue-200',
      fitness: 'bg-green-100 text-green-700 border-green-200',
      personal: 'bg-purple-100 text-purple-700 border-purple-200',
      work: 'bg-orange-100 text-orange-700 border-orange-200',
      finance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      health: 'bg-red-100 text-red-700 border-red-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || colors.other;
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
    if (goal.subGoals.length === 0) return 0;
    const completed = goal.subGoals.filter(sg => sg.completed).length;
    return Math.round((completed / goal.subGoals.length) * 100);
  };

  const progress = getProgressPercentage();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Goal Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <button
            onClick={onToggleExpand}
            className="mt-1 text-gray-400 hover:text-gray-600"
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
                <h3 className="text-gray-900 mb-2">{goal.title}</h3>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-sm border ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(goal.status)}`}>
                    {goal.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(goal.priority)}`}>
                    {goal.priority} priority
                  </span>
                  {goal.deadline && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      Due: {goal.deadline.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onNotificationSettings}
                  className={`p-2 rounded-lg transition-colors ${
                    goal.notifications?.enabled 
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Notification settings"
                >
                  <Bell className="w-5 h-5" />
                </button>
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit goal"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={onDuplicate}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Duplicate goal"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete goal"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {goal.subGoals.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{progress}% ({goal.subGoals.filter(sg => sg.completed).length}/{goal.subGoals.length} completed)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${goal.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'} h-2 rounded-full transition-all`}
                    style={{ width: `${progress}%` }}
                  />
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
        onClose={() => setShowAddSubGoalPrompt(false)}
        onConfirm={handleAddSubGoalConfirm}
        title="Add Another Sub-goal?"
        message="Do you want to add another sub-goal to keep going?"
        confirmText="Yes, Add Sub-goal"
        cancelText="No"
      />
    </div>
  );
}

