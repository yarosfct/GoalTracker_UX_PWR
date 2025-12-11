import { Search, Filter } from 'lucide-react';
import type { GoalCategory, GoalStatus } from '../../types';

interface GoalFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: GoalCategory | 'all';
  onCategoryChange: (value: GoalCategory | 'all') => void;
  filterStatus: GoalStatus | 'all';
  onStatusChange: (value: GoalStatus | 'all') => void;
  groupByPriority: boolean;
  onGroupByPriorityChange: (value: boolean) => void;
}

export function GoalFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterStatus,
  onStatusChange,
  groupByPriority,
  onGroupByPriorityChange,
}: GoalFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value as GoalCategory | 'all')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="study">Study</option>
            <option value="fitness">Fitness</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="finance">Finance</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value as GoalStatus | 'all')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Group By Option */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <input
          type="checkbox"
          id="groupByPriority"
          checked={groupByPriority}
          onChange={(e) => onGroupByPriorityChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="groupByPriority" className="text-gray-700">
          Group by Priority
        </label>
      </div>
    </div>
  );
}

