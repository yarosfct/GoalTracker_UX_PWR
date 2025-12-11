import { Type } from 'lucide-react';
import type { UserSettings } from '../../types';

interface AccessibilitySettingsProps {
  settings: UserSettings;
  onUpdate: (settings: Partial<UserSettings>) => void;
}

export function AccessibilitySettings({ settings, onUpdate }: AccessibilitySettingsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Type className="w-6 h-6 text-blue-600" />
        <h2 className="text-gray-900">Accessibility</h2>
      </div>
      <div className="space-y-6">
        {/* Font Size */}
        <div>
          <label className="block text-gray-700 mb-3">Font Size</label>
          <div className="grid grid-cols-3 gap-4">
            {(['small', 'medium', 'large'] as const).map(size => (
              <button
                key={size}
                onClick={() => onUpdate({ fontSize: size })}
                className={`p-3 border-2 rounded-lg transition-all ${
                  settings.fontSize === size
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-gray-900 capitalize ${
                  size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''
                }`}>
                  {size}
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Guided Mode */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-900 mb-1">Guided Mode</div>
            <p className="text-sm text-gray-600">Show helpful tips and tutorials for new users</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.guidedMode}
              onChange={(e) => onUpdate({ guidedMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}


