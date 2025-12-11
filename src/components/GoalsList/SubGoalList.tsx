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
    <div className="border-t border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-gray-900">Sub-goals</h4>
        <button
          onClick={onAddSubGoal}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Sub-goal
        </button>
      </div>
      
      {goal.subGoals.length === 0 ? (
        <p className="text-gray-600 text-sm mb-4">No sub-goals yet. Click "Add Sub-goal" to create one.</p>
      ) : (
        <div className="space-y-2">
          {goal.subGoals.map(subGoal => {
            const isOverdue = subGoal.deadline && !subGoal.completed && new Date(subGoal.deadline) < new Date();
            return (
              <div
                key={subGoal.id}
                className={`flex items-center gap-3 p-3 bg-white rounded-lg border ${
                  isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={() => onToggleSubGoal(subGoal.id)}
                  className="flex-shrink-0"
                >
                  {subGoal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <span className={`block ${subGoal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {subGoal.title}
                  </span>
                  {subGoal.deadline && (
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className={`text-xs ${
                        isOverdue ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        Due: {new Date(subGoal.deadline).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onEditSubGoal(subGoal)}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Edit sub-goal"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteSubGoal(subGoal.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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

