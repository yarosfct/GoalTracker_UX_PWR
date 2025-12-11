import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import type { Goal, ScheduleEvent, UserSettings } from '../types';
import { storage } from '../utils/storage';
import { mockGoals } from '../utils/mockData';

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

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state from storage
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = storage.getGoals();
    if (savedGoals.length === 0) {
      // Seed with mock data if storage is empty
      storage.saveGoals(mockGoals);
      return mockGoals;
    }
    return savedGoals;
  });

  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() => 
    storage.getScheduleEvents()
  );

  const [settings, setSettings] = useState<UserSettings>(() => 
    storage.getSettings()
  );

  // Persistence effects
  useEffect(() => {
    storage.saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    storage.saveScheduleEvents(scheduleEvents);
  }, [scheduleEvents]);

  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  const updateGoal = (id: string, updatedGoal: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setScheduleEvents(prev => prev.filter(e => e.goalId !== id));
  };

  const addSubGoal = (goalId: string, subGoal: { title: string; deadline?: Date }) => {
    setGoals(prev => prev.map(g => {
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
    setGoals(prev => prev.map(g => {
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
    setGoals(prev => prev.map(g => {
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
    setGoals(prev => prev.map(g => {
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
    setScheduleEvents(prev => [...prev, event]);
  };

  const updateScheduleEvent = (id: string, updatedEvent: Partial<ScheduleEvent>) => {
    setScheduleEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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
