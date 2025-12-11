import { Palette } from 'lucide-react';
import type { UserSettings } from '../../types';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function AppearanceSettings({ settings, onUpdate }: AppearanceSettingsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6 text-blue-600" />
        <h2 className="text-gray-900">Appearance</h2>
      </div>
      <div className="space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-gray-700 mb-3">Theme Style</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate({ theme: 'minimal' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                settings.theme === 'minimal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-gray-900 mb-1">Minimal</div>
              <p className="text-sm text-gray-600">Clean and simple design</p>
            </button>
            <button
              onClick={() => onUpdate({ theme: 'colorful' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                settings.theme === 'colorful'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-gray-900 mb-1">Colorful</div>
              <p className="text-sm text-gray-600">Vibrant and engaging</p>
            </button>
          </div>
        </div>
        {/* Color Scheme */}
        <div>
          <label className="block text-gray-700 mb-3">Color Scheme</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate({ colorScheme: 'light' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                settings.colorScheme === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-gray-900">Light Mode</div>
            </button>
            <button
              onClick={() => onUpdate({ colorScheme: 'dark' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                settings.colorScheme === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-gray-900">Dark Mode (Coming Soon)</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


