import { Bell } from 'lucide-react';
import type { UserSettings } from '../../types';

interface NotificationSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-blue-600" />
        <h2 className="text-gray-900">Notifications & Reminders</h2>
      </div>
      <div className="space-y-6">
        {/* Enable Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-900 mb-1">Enable Notifications</div>
            <p className="text-sm text-gray-600">Receive reminders about your goals</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => onUpdate({ notifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {/* Reminder Frequency */}
        <div>
          <label className="block text-gray-700 mb-3">Reminder Frequency</label>
          <div className="grid grid-cols-3 gap-4">
            {(['daily', 'weekly', 'milestone'] as const).map(freq => (
              <button
                key={freq}
                onClick={() => onUpdate({ reminderFrequency: freq })}
                disabled={!settings.notifications}
                className={`p-3 border-2 rounded-lg transition-all ${
                  settings.reminderFrequency === freq
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!settings.notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-gray-900 capitalize">{freq}</div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {settings.reminderFrequency === 'daily' && 'Get daily reminders about your active goals'}
            {settings.reminderFrequency === 'weekly' && 'Receive a weekly summary of your progress'}
            {settings.reminderFrequency === 'milestone' && 'Get notified when you reach important milestones'}
          </p>
        </div>
      </div>
    </div>
  );
}


