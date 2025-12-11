import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import type { Goal, ScheduleEvent, UserSettings } from '../types';

interface AppContextType {
  goals: Goal[];
  scheduleEvents: ScheduleEvent[];
  settings: UserSettings;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addSubGoal: (goalId: string, subGoal: { title: string; deadline?: Date }) => void;
  updateSubGoal: (goalId: string, subGoalId: string, subGoal: { title?: string; deadline?: Date }) => void;
  toggleSubGoal: (goalId: string, subGoalId: string) => void;
  deleteSubGoal: (goalId: string, subGoalId: string) => void;
  addScheduleEvent: (event: ScheduleEvent) => void;
  updateScheduleEvent: (id: string, event: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: UserSettings = {
  theme: 'minimal',
  colorScheme: 'light',
  reminderFrequency: 'weekly',
  notifications: true,
  guidedMode: true,
  fontSize: 'medium',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    const savedEvents = localStorage.getItem('scheduleEvents');
    const savedSettings = localStorage.getItem('settings');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals);
      // Convert date strings back to Date objects
      const goalsWithDates = parsedGoals.map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt),
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        subGoals: goal.subGoals.map((sg: any) => ({
          ...sg,
          createdAt: new Date(sg.createdAt),
          completedAt: sg.completedAt ? new Date(sg.completedAt) : undefined,
          deadline: sg.deadline ? new Date(sg.deadline) : undefined,
        })),
      }));
      setGoals(goalsWithDates);
    }
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      const eventsWithDates = parsedEvents.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setScheduleEvents(eventsWithDates);
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('scheduleEvents', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  const updateGoal = (id: string, updatedGoal: Partial<Goal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    setScheduleEvents(scheduleEvents.filter(e => e.goalId !== id));
  };

  const addSubGoal = (goalId: string, subGoal: { title: string; deadline?: Date }) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          subGoals: [
            ...g.subGoals,
            {
              id: Date.now().toString(),
              title: subGoal.title,
              completed: false,
              createdAt: new Date(),
              deadline: subGoal.deadline,
            },
          ],
        };
      }
      return g;
    }));
  };

  const updateSubGoal = (goalId: string, subGoalId: string, subGoal: { title?: string; deadline?: Date }) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          subGoals: g.subGoals.map(sg => {
            if (sg.id === subGoalId) {
              return {
                ...sg,
                title: subGoal.title || sg.title,
                deadline: subGoal.deadline || sg.deadline,
              };
            }
            return sg;
          }),
        };
      }
      return g;
    }));
  };

  const toggleSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          subGoals: g.subGoals.map(sg => {
            if (sg.id === subGoalId) {
              return {
                ...sg,
                completed: !sg.completed,
                completedAt: !sg.completed ? new Date() : undefined,
              };
            }
            return sg;
          }),
        };
      }
      return g;
    }));
  };

  const deleteSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          subGoals: g.subGoals.filter(sg => sg.id !== subGoalId),
        };
      }
      return g;
    }));
  };

  const addScheduleEvent = (event: ScheduleEvent) => {
    setScheduleEvents([...scheduleEvents, event]);
  };

  const updateScheduleEvent = (id: string, updatedEvent: Partial<ScheduleEvent>) => {
    setScheduleEvents(scheduleEvents.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents(scheduleEvents.filter(e => e.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  return (
    <AppContext.Provider
      value={{
        goals,
        scheduleEvents,
        settings,
        addGoal,
        updateGoal,
        deleteGoal,
        addSubGoal,
        updateSubGoal,
        toggleSubGoal,
        deleteSubGoal,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
