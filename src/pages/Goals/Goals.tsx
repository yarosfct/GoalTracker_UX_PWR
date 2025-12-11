import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Plus } from 'lucide-react';
import type { Goal, GoalCategory, GoalStatus } from '../../types';
import { GoalForm, SubGoalForm, GoalNotificationSettings } from '../../components/Goals';
import { GoalFilters, GoalListItem, EmptyGoalsState } from '../../components/GoalsList';

const Goals = () => {
  const { goals, deleteGoal, updateGoal, addGoal, addSubGoal, updateSubGoal, toggleSubGoal, deleteSubGoal } = useApp();
  const [searchParams] = useSearchParams();
  const selectedGoalId = searchParams.get('goalId');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all');
  const [groupByPriority, setGroupByPriority] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(selectedGoalId ? [selectedGoalId] : []));
  const [editingSubGoal, setEditingSubGoal] = useState<{ goalId: string; subGoal: any } | null>(null);
  const [addingSubGoalTo, setAddingSubGoalTo] = useState<string | null>(null);
  const [notificationGoal, setNotificationGoal] = useState<Goal | null>(null);
  const goalRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Expand selected goal if provided in URL and scroll to it
  useEffect(() => {
    if (selectedGoalId) {
      setExpandedGoals(prev => {
        if (!prev.has(selectedGoalId)) {
          return new Set([...prev, selectedGoalId]);
        }
        return prev;
      });

      // Scroll to goal after a brief delay to ensure rendering
      setTimeout(() => {
        const element = goalRefs.current[selectedGoalId];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a highlight effect
          element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
          }, 2000);
        }
      }, 100);
    }
  }, [selectedGoalId]);

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleExpanded = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
    }
  };

  const handleDuplicate = (goal: Goal) => {
    const duplicatedGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      title: `${goal.title} (Copy)`,
      createdAt: new Date(),
      subGoals: goal.subGoals.map(sg => ({
        ...sg,
        id: `${Date.now()}-${Math.random()}`,
        completed: false,
        createdAt: new Date(),
        completedAt: undefined,
      })),
    };
    addGoal(duplicatedGoal);
  };

  const groupedGoals = groupByPriority
    ? {
        high: filteredGoals.filter(g => g.priority === 'high'),
        medium: filteredGoals.filter(g => g.priority === 'medium'),
        low: filteredGoals.filter(g => g.priority === 'low'),
      }
    : null;

  const renderGoal = (goal: Goal) => {
    const isExpanded = expandedGoals.has(goal.id);
    return (
      <div key={goal.id} ref={el => { goalRefs.current[goal.id] = el; }} className="transition-all duration-300 rounded-lg">
        <GoalListItem
          goal={goal}
          isExpanded={isExpanded}
          onToggleExpand={() => toggleExpanded(goal.id)}
          onEdit={() => handleEdit(goal)}
          onDelete={() => handleDelete(goal.id)}
          onDuplicate={() => handleDuplicate(goal)}
          onNotificationSettings={() => setNotificationGoal(goal)}
          onAddSubGoal={() => setAddingSubGoalTo(goal.id)}
          onEditSubGoal={(subGoal) => setEditingSubGoal({ goalId: goal.id, subGoal })}
          onToggleSubGoal={(subGoalId) => toggleSubGoal(goal.id, subGoalId)}
          onDeleteSubGoal={(subGoalId) => deleteSubGoal(goal.id, subGoalId)}
          onStatusChange={(status) => updateGoal(goal.id, { ...goal, status })}
        />
      </div>
    );
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GoalForm
          goal={editingGoal || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>My Goals</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track your goals</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
          style={{ backgroundColor: 'var(--accent-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
        >
          <Plus className="w-5 h-5" />
          Create Goal
        </button>
      </div>

      {/* Filters */}
      <GoalFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        groupByPriority={groupByPriority}
        onGroupByPriorityChange={setGroupByPriority}
      />

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <EmptyGoalsState
          hasFilters={searchTerm !== '' || filterCategory !== 'all' || filterStatus !== 'all'}
          onCreateGoal={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {groupByPriority && groupedGoals ? (
            <>
              {groupedGoals.high.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>High Priority</h4>
                  {groupedGoals.high.map(renderGoal)}
                </div>
              )}
              {groupedGoals.medium.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Medium Priority</h4>
                  {groupedGoals.medium.map(renderGoal)}
                </div>
              )}
              {groupedGoals.low.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Low Priority</h4>
                  {groupedGoals.low.map(renderGoal)}
                </div>
              )}
            </>
          ) : (
            filteredGoals.map(renderGoal)
          )}
        </div>
      )}
      
      {/* Sub-goal Forms */}
      {addingSubGoalTo && (
        <SubGoalForm
          onSave={(data) => {
            addSubGoal(addingSubGoalTo, data);
            setAddingSubGoalTo(null);
          }}
          onClose={() => setAddingSubGoalTo(null)}
        />
      )}
      {editingSubGoal && (
        <SubGoalForm
          subGoal={editingSubGoal.subGoal}
          onSave={(data) => {
            updateSubGoal(editingSubGoal.goalId, editingSubGoal.subGoal.id, data);
            setEditingSubGoal(null);
          }}
          onClose={() => setEditingSubGoal(null)}
        />
      )}

      {/* Notification Settings Modal */}
      {notificationGoal && (
        <GoalNotificationSettings
          goal={notificationGoal}
          onClose={() => setNotificationGoal(null)}
          onSave={(notifications) => {
            updateGoal(notificationGoal.id, { ...notificationGoal, notifications });
            setNotificationGoal(null);
          }}
        />
      )}
    </div>
  );
};

export default Goals;
