import { useApp } from '../../contexts/AppContext';
import { HelpCircle } from 'lucide-react';
import { AppearanceSettings, NotificationSettings, AccessibilitySettings, DataManagement } from '../../components/Settings';

const Settings = () => {
  const { settings, updateSettings, goals } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your GoalTracker experience</p>
      </div>
      <div className="space-y-6">
        <AppearanceSettings settings={settings} onUpdate={updateSettings} />
        <NotificationSettings settings={settings} onUpdate={updateSettings} />
        <AccessibilitySettings settings={settings} onUpdate={updateSettings} />
        <DataManagement goals={goals} settings={settings} />

        {/* Help */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-700 mb-3">
                GoalTracker is designed to help you achieve your goals through structured planning and consistent tracking.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Create goals and break them down into manageable sub-goals</li>
                <li>• Use the calendar to schedule dedicated time for your goals</li>
                <li>• Track your progress with detailed analytics</li>
                <li>• Customize notifications to stay motivated</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
