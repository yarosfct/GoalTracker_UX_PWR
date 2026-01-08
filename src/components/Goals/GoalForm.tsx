import { useState } from 'react';

import { useApp } from '../../contexts/AppContext';
import type { Goal, GoalCategory, GoalStatus, GoalPriority } from '../../types';
import { X, HelpCircle } from 'lucide-react';

interface GoalFormProps {
  goal?: Goal;
  onClose: () => void;
}

export function GoalForm({ goal, onClose }: GoalFormProps) {
  const { addGoal, updateGoal } = useApp();

  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || 'personal' as GoalCategory,
    status: goal?.status || 'not-started' as GoalStatus,
    priority: goal?.priority || 'medium' as GoalPriority,
    deadline: goal?.deadline ? goal.deadline.toISOString().split('T')[0] : '',
    isFinalGoal: goal?.isFinalGoal || false,
  });

  const [touched, setTouched] = useState({
    title: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setTouched({ ...touched, title: true });
      return;
    }

    const goalData: Goal = {
      id: goal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      priority: formData.priority,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      createdAt: goal?.createdAt || new Date(),
      subGoals: goal?.subGoals || [],
      timeSpent: goal?.timeSpent || 0,
      isShared: goal?.isShared || false,
      sharedWith: goal?.sharedWith || [],
      isFinalGoal: formData.isFinalGoal,
      mainGoalCompleted: goal?.mainGoalCompleted || false,
    };

    if (goal) {
      updateGoal(goal.id, goalData);
    } else {
      addGoal(goalData);
    }

    onClose();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">{goal ? 'Edit Goal' : 'Create New Goal'}</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-2">
            Goal Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={() => setTouched({ ...touched, title: true })}
            placeholder="e.g., Complete UX Design Course"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.title && !formData.title.trim()
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {touched.title && !formData.title.trim() && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a goal title
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your goal in detail..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="study">Study</option>
              <option value="fitness">Fitness</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="finance">Finance</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Priority *
            </label>
            <select
              required
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as GoalPriority })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Status and Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as GoalStatus })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Final Goal Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <input
            type="checkbox"
            id="isFinalGoal"
            checked={formData.isFinalGoal}
            onChange={(e) => setFormData({ ...formData, isFinalGoal: e.target.checked })}
            className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="isFinalGoal" className="flex-1 text-sm text-purple-900 cursor-pointer">
            <div className="flex items-center gap-2">
              <strong>Set as final goal</strong>
              <div className="relative group">
                <HelpCircle className="w-4 h-4 text-purple-600 cursor-help" />
                {/* Tooltip */}
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                  <p className="mb-2">
                    When checked, the main goal itself becomes a completable step.
                  </p>
                  <p className="mb-2">
                    This means achieving the main goal will be counted as part of the progress 
                    (e.g., if you have 2 sub-goals, progress will be calculated as completed items / 3 total).
                  </p>
                  <p>
                    Perfect for goals like "Save 1000 PLN" where completing the main goal is the final achievement.
                  </p>
                  {/* Arrow */}
                  <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Helper Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Break down your goal into smaller sub-goals after creating it. 
            This makes it easier to track progress and stay motivated!
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {goal ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
}

