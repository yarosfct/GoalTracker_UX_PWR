import { useState } from 'react';

import { X, Bell, Calendar, TrendingUp, Clock } from 'lucide-react';
import type { Goal, GoalNotifications } from '../../types';

interface GoalNotificationSettingsProps {
  goal: Goal;
  onClose: () => void;
  onSave: (notifications: GoalNotifications) => void;
}

export function GoalNotificationSettings({ goal, onClose, onSave }: GoalNotificationSettingsProps) {
  const [settings, setSettings] = useState<GoalNotifications>(
    goal.notifications || {
      enabled: false,
      notifyOnDeadline: true,
      notifyDaily: false,
      notifyWeekly: false,
      notifyOnProgress: false,
      deadlineReminderDays: 1,
    }
  );

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={onClose}>
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-gray-900">Notification Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="mb-6">
            <p className="text-gray-600 text-sm">Configure notifications for:</p>
            <p className="text-gray-900 mt-1">{goal.title}</p>
          </div>
          <div className="space-y-4">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <label htmlFor="enabled" className="text-gray-900 cursor-pointer">
                  Enable Notifications
                </label>
                <p className="text-sm text-gray-600">Turn on reminders for this goal</p>
              </div>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                id="enabled"
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors cursor-pointer"
                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.enabled ? 'transform translate-x-6' : ''
                }`} />
              </div>
            </div>
          </div>

          {/* Individual Notification Options */}
          <div className={`space-y-3 ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Deadline Reminder */}
            {goal.deadline && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <label htmlFor="notifyOnDeadline" className="text-gray-900 cursor-pointer flex items-center gap-2">
                        Deadline Reminder
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Get notified before your goal deadline
                      </p>
                    </div>
                  </div>
                  <input
                    id="notifyOnDeadline"
                    type="checkbox"
                    checked={settings.notifyOnDeadline}
                    onChange={(e) => setSettings({ ...settings, notifyOnDeadline: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                
                {settings.notifyOnDeadline && (
                  <div className="ml-8">
                    <label className="text-sm text-gray-700 mb-2 block">Remind me:</label>
                    <select
                      value={settings.deadlineReminderDays}
                      onChange={(e) => setSettings({ ...settings, deadlineReminderDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1 day before</option>
                      <option value={2}>2 days before</option>
                      <option value={3}>3 days before</option>
                      <option value={7}>1 week before</option>
                      <option value={14}>2 weeks before</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Daily Reminder */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <label htmlFor="notifyDaily" className="text-gray-900 cursor-pointer">
                      Daily Reminder
                    </label>
                    <p className="text-sm text-gray-600">Get a daily reminder to work on this goal</p>
                  </div>
                </div>
                <input
                  id="notifyDaily"
                  type="checkbox"
                  checked={settings.notifyDaily}
                  onChange={(e) => setSettings({ ...settings, notifyDaily: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <label htmlFor="notifyWeekly" className="text-gray-900 cursor-pointer">
                      Weekly Summary
                    </label>
                    <p className="text-sm text-gray-600">Receive a weekly progress update</p>
                  </div>
                </div>
                <input
                  id="notifyWeekly"
                  type="checkbox"
                  checked={settings.notifyWeekly}
                  onChange={(e) => setSettings({ ...settings, notifyWeekly: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Progress Milestones */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <div>
                    <label htmlFor="notifyOnProgress" className="text-gray-900 cursor-pointer">
                      Progress Milestones
                    </label>
                    <p className="text-sm text-gray-600">Get notified when you complete sub-goals</p>
                  </div>
                </div>
                <input
                  id="notifyOnProgress"
                  type="checkbox"
                  checked={settings.notifyOnProgress}
                  onChange={(e) => setSettings({ ...settings, notifyOnProgress: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Info Message */}
          {!goal.deadline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                💡 Tip: Set a deadline for this goal to enable deadline reminders
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

