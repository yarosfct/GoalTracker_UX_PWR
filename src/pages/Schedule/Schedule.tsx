import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Target, Plus, Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react';
import type { ScheduleEvent, GoalCategory, Goal, GoalStatus, GoalPriority } from '../../types';
import { TimePicker } from '../../components/TimePicker';

type ViewMode = 'month' | 'week';

const Schedule = () => {
  const { scheduleEvents, goals, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent, addGoal } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    goalId: '',
    subGoalId: '',
    title: '',
    startTime: '',
    endTime: '',
  });
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    description: '',
    category: 'personal' as GoalCategory,
    priority: 'medium' as GoalPriority,
  });

  // Calculate conflicts for all events
  const conflicts = useMemo(() => {
    const conflictMap = new Map<string, boolean>();
    
    scheduleEvents.forEach(event1 => {
      const start1 = new Date(event1.start).getTime();
      const end1 = new Date(event1.end).getTime();
      
      scheduleEvents.forEach(event2 => {
        if (event1.id === event2.id) return;
        
        const start2 = new Date(event2.start).getTime();
        const end2 = new Date(event2.end).getTime();
        
        if (start1 < end2 && start2 < end1) {
          conflictMap.set(event1.id, true);
          conflictMap.set(event2.id, true);
        }
      });
    });
    
    return conflictMap;
  }, [scheduleEvents]);

  // Check for conflicts in the form
  const getFormConflicts = () => {
    if (!selectedDate || !formData.startTime || !formData.endTime) return false;

    const [startHour, startMinute] = formData.startTime.split(':');
    const [endHour, endMinute] = formData.endTime.split(':');
    
    const formStart = new Date(selectedDate);
    formStart.setHours(parseInt(startHour), parseInt(startMinute));
    const formEnd = new Date(selectedDate);
    formEnd.setHours(parseInt(endHour), parseInt(endMinute));
    
    return scheduleEvents.some(event => {
      if (editingEventId === event.id) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      return formStart.getTime() < eventEnd.getTime() && eventStart.getTime() < formEnd.getTime();
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1)));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentDate(newDate);
    }
  };

  const getEventsForDate = (date: Date) => {
    return scheduleEvents.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getGoalDeadlinesForDate = (date: Date) => {
    const deadlines: Array<{ id: string; title: string; category: GoalCategory; isSubGoal: boolean }> = [];
    
    goals.forEach(goal => {
      // Check parent goal deadline
      if (goal.deadline) {
        const deadline = new Date(goal.deadline);
        if (
          deadline.getDate() === date.getDate() &&
          deadline.getMonth() === date.getMonth() &&
          deadline.getFullYear() === date.getFullYear()
        ) {
          deadlines.push({
            id: goal.id,
            title: goal.title,
            category: goal.category,
            isSubGoal: false
          });
        }
      }
      
      // Check sub-goals deadlines
      goal.subGoals?.forEach(subGoal => {
        if (subGoal.deadline) {
          const subDeadline = new Date(subGoal.deadline);
          if (
            subDeadline.getDate() === date.getDate() &&
            subDeadline.getMonth() === date.getMonth() &&
            subDeadline.getFullYear() === date.getFullYear()
          ) {
            deadlines.push({
              id: subGoal.id,
              title: subGoal.title,
              category: goal.category,
              isSubGoal: true
            });
          }
        }
      });
    });
    
    return deadlines;
  };

  const getCategoryColor = (category: GoalCategory) => {
    const colors = {
      study: 'bg-blue-500',
      fitness: 'bg-green-500',
      personal: 'bg-purple-500',
      work: 'bg-orange-500',
      finance: 'bg-yellow-500',
      health: 'bg-red-500',
      other: 'bg-gray-500',
    };
    return colors[category] || colors.other;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEventId(null);
    setFormData({ goalId: '', subGoalId: '', title: '', startTime: '', endTime: '' });
    setShowEventForm(true);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleReschedule = () => {
    if (!selectedEvent) return;
    
    const start = new Date(selectedEvent.start);
    const end = new Date(selectedEvent.end);
    
    setFormData({
      goalId: selectedEvent.goalId,
      subGoalId: '',
      title: selectedEvent.title,
      startTime: `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`,
    });
    
    setSelectedDate(start);
    setEditingEventId(selectedEvent.id);
    setShowEventDetails(false);
    setShowEventForm(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && confirm('Are you sure you want to delete this event?')) {
      deleteScheduleEvent(selectedEvent.id);
      setShowEventDetails(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    const goal = goals.find(g => g.id === formData.goalId);
    if (!goal) return;
    
    let eventTitle = formData.title || goal.title;
    if (formData.subGoalId) {
      const subGoal = goal.subGoals.find(sg => sg.id === formData.subGoalId);
      if (subGoal) {
        eventTitle = formData.title || `${goal.title} - ${subGoal.title}`;
      }
    }

    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = formData.startTime.split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = formData.endTime.split(':');
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute));

    if (editingEventId) {
       updateScheduleEvent(editingEventId, {
        goalId: formData.goalId,
        title: eventTitle,
        start: startDateTime,
        end: endDateTime,
        category: goal.category,
       });
    } else {
      const event: ScheduleEvent = {
        id: Date.now().toString(),
        goalId: formData.goalId,
        title: eventTitle,
        start: startDateTime,
        end: endDateTime,
        category: goal.category,
      };
      addScheduleEvent(event);
    }

    setShowEventForm(false);
    setEditingEventId(null);
    setFormData({ goalId: '', subGoalId: '', title: '', startTime: '', endTime: '' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (start.getMonth() === end.getMonth()) {
      return `${monthNames[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalData.title,
      description: newGoalData.description,
      category: newGoalData.category,
      priority: newGoalData.priority,
      status: 'in-progress' as GoalStatus,
      createdAt: new Date(),
      deadline: undefined,
      subGoals: [],
      timeSpent: 0,
      sharedWith: [],
    };
    addGoal(newGoal);
    setFormData({ ...formData, goalId: newGoal.id });
    setShowGoalForm(false);
    setNewGoalData({ title: '', description: '', category: 'personal', priority: 'medium' });
  };

  // Conflict warning display in modal
  const showConflictWarning = showEventForm && getFormConflicts();

  // Find earliest conflict for global alert
  const earliestConflict = useMemo(() => {
    const conflictingEvents = scheduleEvents.filter(event => conflicts.get(event.id));
    if (conflictingEvents.length === 0) return null;
    
    // Sort by start date and return the earliest
    const sorted = conflictingEvents.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    return sorted[0];
  }, [scheduleEvents, conflicts]);

  const handleNavigateToConflict = () => {
    if (!earliestConflict) return;
    const conflictDate = new Date(earliestConflict.start);
    setCurrentDate(conflictDate);
    setViewMode('week'); // Switch to week view for better visibility
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Global Conflict Alert */}
      {earliestConflict && (
        <div 
          className="mb-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
          onClick={handleNavigateToConflict}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900 mb-1">
                Scheduling Conflicts Detected
              </h3>
              <p className="text-sm text-amber-800">
                You have {scheduleEvents.filter(e => conflicts.get(e.id)).length} overlapping events in your schedule.
                The earliest conflict is on <span className="font-medium">{earliestConflict.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>.
                Click here to view and resolve.
              </p>
            </div>
          </div>
        </div>
      )}

      <div 
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)'
        }}
      >
        {/* Calendar Header */}
        <div 
          className="p-6"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: 'var(--text-primary)' }}>
              {viewMode === 'month' 
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : getWeekRange()
              }
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('prev')}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Today
              </button>
              <button
                onClick={() => navigate('next')}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('month')}
              className="px-4 py-2 rounded-lg transition-colors"
              style={viewMode === 'month' ? {
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff'
              } : {
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'month') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'month') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className="px-4 py-2 rounded-lg transition-colors"
              style={viewMode === 'week' ? {
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff'
              } : {
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'week') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'week') {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }
              }}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar Content */}
        {viewMode === 'month' ? (
          <div className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayEvents = getEventsForDate(date);
                const goalDeadlines = getGoalDeadlinesForDate(date);
                const today = isToday(date);
                const hasConflict = dayEvents.some(e => conflicts.get(e.id));

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-2 hover:border-blue-300 transition-colors cursor-pointer relative ${
                      today ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className={`text-sm ${today ? 'text-blue-700' : 'text-gray-700'}`}>
                        {day}
                      </div>
                      {hasConflict && (
                        <div className="text-amber-500" title="Scheduling conflict on this day">
                          <AlertTriangle className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      {/* Schedule Events */}
                      {dayEvents.slice(0, 1).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded text-white truncate ${getCategoryColor(event.category)} flex items-center gap-1 ${conflicts.get(event.id) ? 'ring-2 ring-amber-400' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          title={event.title}
                        >
                          <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {/* Goal Deadlines */}
                      {goalDeadlines.slice(0, 1).map(goal => (
                        <div
                          key={goal.id}
                          className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 border border-red-300 truncate flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                          title={`Goal Deadline: ${goal.title}`}
                        >
                          <Target className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{goal.title}</span>
                        </div>
                      ))}
                      {(dayEvents.length + goalDeadlines.length) > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length + goalDeadlines.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Week View
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((date, idx) => {
                const dayEvents = getEventsForDate(date);
                const goalDeadlines = getGoalDeadlinesForDate(date);
                const today = isToday(date);
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const hasConflict = dayEvents.some(e => conflicts.get(e.id));

                return (
                  <div
                    key={idx}
                    className={`border rounded-lg p-3 min-h-[400px] hover:border-blue-300 transition-colors cursor-pointer relative ${
                      today ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="mb-3 text-center relative">
                      {hasConflict && (
                        <div className="absolute right-0 top-0 text-amber-500" title="Scheduling conflict">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-sm text-gray-600">{dayNames[idx]}</div>
                      <div className={`text-xl ${today ? 'text-blue-700' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {/* Schedule Events */}
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-2 rounded text-white ${getCategoryColor(event.category)} ${conflicts.get(event.id) ? 'ring-2 ring-amber-400' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{event.title}</span>
                          </div>
                          <div className="text-xs opacity-90">
                            {event.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            {' - '}
                            {event.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                      {/* Goal Deadlines */}
                      {goalDeadlines.map(goal => (
                        <div
                          key={goal.id}
                          className="text-xs px-2 py-2 rounded bg-red-100 text-red-800 border border-red-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Target className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{goal.title}</span>
                          </div>
                          <div className="text-xs">Goal Deadline</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div 
          className="p-6"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          <h3 className="mb-3" style={{ color: 'var(--text-secondary)' }}>Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Schedule Event</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: 'var(--accent-error)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Goal Deadline</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Conflict</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <h4 className="w-full" style={{ color: 'var(--text-secondary)' }}>Categories:</h4>
            {(['study', 'fitness', 'personal', 'work', 'finance', 'health'] as GoalCategory[]).map(category => (
              <div key={category} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${getCategoryColor(category)}`} />
                <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={() => setShowEventDetails(false)}>
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-medium text-lg flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(selectedEvent.category)}`} />
                Event Details
              </h3>
              <button
                onClick={() => setShowEventDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-1">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-500 capitalize">{selectedEvent.category}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedEvent.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedEvent.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {selectedEvent.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {conflicts.get(selectedEvent.id) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <span className="font-medium">Scheduling Conflict:</span> This event overlaps with another scheduled event.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDeleteEvent}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel Event
                </button>
                <button
                  onClick={handleReschedule}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {showEventForm && selectedDate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={() => setShowEventForm(false)}>
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-medium text-lg">
                {editingEventId ? 'Reschedule Event' : `Schedule Event for ${selectedDate.toLocaleDateString()}`}
              </h3>
              <button
                onClick={() => setShowEventForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {showConflictWarning && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <span className="font-medium">Warning:</span> This time slot overlaps with an existing event.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700">Goal *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventForm(false);
                      setShowGoalForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Goal
                  </button>
                </div>
                <select
                  required
                  value={formData.goalId}
                  onChange={(e) => setFormData({ ...formData, goalId: e.target.value, subGoalId: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a goal</option>
                  {goals.filter(g => g.status !== 'completed').map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>

              {formData.goalId && goals.find(g => g.id === formData.goalId)?.subGoals.length ? (
                <div>
                  <label className="block text-gray-700 mb-2">Sub-goal (optional)</label>
                  <select
                    value={formData.subGoalId}
                    onChange={(e) => setFormData({ ...formData, subGoalId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a sub-goal</option>
                    {goals.find(g => g.id === formData.goalId)?.subGoals.filter(sg => !sg.completed).map(subGoal => (
                      <option key={subGoal.id} value={subGoal.id}>
                        {subGoal.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="block text-gray-700 mb-2">Event Title (optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Leave empty to use goal title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <TimePicker
                    required
                    label="Start Time"
                    value={formData.startTime}
                    onChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
                  />
                </div>
                <div>
                  <TimePicker
                    required
                    label="End Time"
                    value={formData.endTime}
                    onChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingEventId ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={() => setShowGoalForm(false)}>
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-medium text-lg">Add New Goal</h3>
              <button
                onClick={() => setShowGoalForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={newGoalData.title}
                  onChange={(e) => setNewGoalData({ ...newGoalData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  value={newGoalData.description}
                  onChange={(e) => setNewGoalData({ ...newGoalData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={newGoalData.category}
                    onChange={(e) => setNewGoalData({ ...newGoalData, category: e.target.value as GoalCategory })}
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
                  <label className="block text-gray-700 mb-2">Priority *</label>
                  <select
                    required
                    value={newGoalData.priority}
                    onChange={(e) => setNewGoalData({ ...newGoalData, priority: e.target.value as GoalPriority })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Button */}
      <button
        onClick={() => setShowGoalForm(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Schedule;
