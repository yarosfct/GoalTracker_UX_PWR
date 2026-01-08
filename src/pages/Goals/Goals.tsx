import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Trash2, Copy, AlertTriangle } from 'lucide-react';
import type { Goal, GoalCategory, GoalStatus } from '../../types';
import { GoalForm, SubGoalForm, GoalNotificationSettings, ConfirmationDialog } from '../../components/Goals';
import { GoalFilters, GoalListItem, EmptyGoalsState } from '../../components/GoalsList';

const Goals = () => {
  const { goals, deleteGoal, updateGoal, addGoal, addSubGoal, updateSubGoal, toggleSubGoal, deleteSubGoal } = useApp();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const selectedGoalId = searchParams.get('goalId');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all');
  const [groupByPriority, setGroupByPriority] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(selectedGoalId ? [selectedGoalId] : []));
  const [editingSubGoal, setEditingSubGoal] = useState<{ goalId: string; subGoal: any } | null>(null);
  const [addingSubGoalTo, setAddingSubGoalTo] = useState<string | null>(null);
  const [notificationGoal, setNotificationGoal] = useState<Goal | null>(null);
  const [deleteConfirmGoal, setDeleteConfirmGoal] = useState<Goal | null>(null);
  const [duplicateConfirmGoal, setDuplicateConfirmGoal] = useState<Goal | null>(null);
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
    const matchesHideCompleted = !hideCompleted || goal.status !== 'completed';
    return matchesSearch && matchesCategory && matchesStatus && matchesHideCompleted;
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

  const handleDeleteClick = (goal: Goal) => {
    setDeleteConfirmGoal(goal);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmGoal) {
      // Store the goal for potential undo
      const deletedGoal = { ...deleteConfirmGoal };
      
      // Delete immediately
      deleteGoal(deleteConfirmGoal.id);
      setDeleteConfirmGoal(null);
      
      // Show toast with undo option
      showToast({
        message: `Deleted "${deletedGoal.title}"`,
        type: 'warning',
        duration: 10000, // 10 seconds
        onUndo: () => {
          // Restore the deleted goal
          addGoal(deletedGoal);
        },
        undoText: 'Undo'
      });
    }
  };

  const handleDuplicateClick = (goal: Goal) => {
    setDuplicateConfirmGoal(goal);
  };

  const handleDuplicateConfirm = () => {
    if (duplicateConfirmGoal) {
      const duplicatedGoal: Goal = {
        ...duplicateConfirmGoal,
        id: Date.now().toString(),
        title: `${duplicateConfirmGoal.title} (Copy)`,
        createdAt: new Date(),
        subGoals: duplicateConfirmGoal.subGoals.map(sg => ({
          ...sg,
          id: `${Date.now()}-${Math.random()}`,
          completed: false,
          createdAt: new Date(),
          completedAt: undefined,
        })),
      };
      addGoal(duplicatedGoal);
      setDuplicateConfirmGoal(null);
      
      // Show success toast
      showToast({
        message: `Duplicated "${duplicateConfirmGoal.title}"`,
        type: 'success',
        duration: 3000, // 3 seconds for success messages
      });
    }
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
          onDelete={() => handleDeleteClick(goal)}
          onDuplicate={() => handleDuplicateClick(goal)}
          onNotificationSettings={() => setNotificationGoal(goal)}
          onAddSubGoal={() => setAddingSubGoalTo(goal.id)}
          onEditSubGoal={(subGoal) => setEditingSubGoal({ goalId: goal.id, subGoal })}
          onToggleSubGoal={(subGoalId) => toggleSubGoal(goal.id, subGoalId)}
          onDeleteSubGoal={(subGoalId) => deleteSubGoal(goal.id, subGoalId)}
          onStatusChange={(status) => updateGoal(goal.id, { ...goal, status })}
          onToggleMainGoal={(completed) => updateGoal(goal.id, { ...goal, mainGoalCompleted: completed })}
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
        hideCompleted={hideCompleted}
        onHideCompletedChange={setHideCompleted}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmGoal !== null}
        onClose={() => setDeleteConfirmGoal(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Goal?"
        message={`Are you sure you want to delete "${deleteConfirmGoal?.title}"? This action cannot be undone and will also remove all sub-goals.`}
        confirmText="Delete Goal"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 className="w-6 h-6 text-red-600" />}
      />

      {/* Duplicate Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={duplicateConfirmGoal !== null}
        onClose={() => setDuplicateConfirmGoal(null)}
        onConfirm={handleDuplicateConfirm}
        title="Duplicate Goal?"
        message={`Create a copy of "${duplicateConfirmGoal?.title}"? The duplicated goal will include all sub-goals but they will be marked as incomplete.`}
        confirmText="Duplicate Goal"
        cancelText="Cancel"
        variant="default"
        icon={<Copy className="w-6 h-6 text-blue-600" />}
      />
    </div>
  );
};

export default Goals;
