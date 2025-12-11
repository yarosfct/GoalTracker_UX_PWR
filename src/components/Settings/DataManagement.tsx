import { Download, Trash2 } from 'lucide-react';
import type { Goal, UserSettings } from '../../types';

interface DataManagementProps {
  goals: Goal[];
  settings: UserSettings;
}

export function DataManagement({ goals, settings }: DataManagementProps) {
  const handleExportData = () => {
    const data = {
      goals,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goaltracker-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-blue-600" />
        <h2 className="text-gray-900">Data Management</h2>
      </div>
      <div className="space-y-4">
        <div>
          <button
            onClick={handleExportData}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export All Data
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Download your goals and settings as a JSON file for backup or analysis
          </p>
        </div>
        <div>
          <button
            onClick={handleClearData}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear All Data
          </button>
          <p className="text-sm text-gray-600 mt-2">
            ⚠️ This will permanently delete all your goals, sub-goals, and settings
          </p>
        </div>
      </div>
    </div>
  );
}

