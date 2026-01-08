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
  hideCompleted: boolean;
  onHideCompletedChange: (value: boolean) => void;
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
  hideCompleted,
  onHideCompletedChange,
}: GoalFiltersProps) {
  return (
    <div 
      className="rounded-lg p-4 mb-6"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value as GoalCategory | 'all')}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
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
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-secondary)'}
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Options Row */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
        {/* Group By Priority */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="groupByPriority"
            checked={groupByPriority}
            onChange={(e) => onGroupByPriorityChange(e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ 
              accentColor: 'var(--accent-primary)',
              borderColor: 'var(--border-secondary)'
            }}
          />
          <label htmlFor="groupByPriority" className="cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            Group by Priority
          </label>
        </div>

        {/* Hide Completed */}
        <div className="flex items-center gap-2">
          <label htmlFor="hideCompleted" className="cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            Hide Completed Goals
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="hideCompleted"
              checked={hideCompleted}
              onChange={(e) => onHideCompletedChange(e.target.checked)}
              className="sr-only peer"
            />
            <div 
              className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
              style={{
                backgroundColor: hideCompleted ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)'
              }}
            ></div>
          </label>
        </div>
      </div>
    </div>
  );
}

