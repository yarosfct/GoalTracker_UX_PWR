import { useState } from 'react';
import { Target, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { mockGoals } from '../utils/mockData';

interface WelcomeModalProps {
  onClose: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const { addGoal } = useApp();
  const [step, setStep] = useState(1);

  const handleLoadSampleData = () => {
    mockGoals.forEach(goal => addGoal(goal));
    setStep(3);
  };

  const handleSkip = () => {
    setStep(3);
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8 relative">
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-gray-900 mb-4">Welcome to GoalTracker! 🎯</h2>
            <p className="text-gray-600 mb-8">
              Your personal goal management system designed to help you achieve your objectives
              through structured planning and consistent monitoring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-gray-900 mb-2">📝 Organize Goals</h3>
                <p className="text-sm text-gray-600">
                  Create and break down goals into manageable sub-goals
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-gray-900 mb-2">📅 Schedule Time</h3>
                <p className="text-sm text-gray-600">
                  Plan your activities with an integrated calendar
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-gray-900 mb-2">📊 Track Progress</h3>
                <p className="text-sm text-gray-600">
                  Visualize your achievements with detailed analytics
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-gray-900 mb-2">🔔 Stay Motivated</h3>
                <p className="text-sm text-gray-600">
                  Get reminders and motivational feedback
                </p>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-gray-900 mb-4">Load Sample Data?</h2>
            <p className="text-gray-600 mb-6">
              We can load some example goals to help you understand how the app works.
              You can delete these anytime and create your own goals.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Sample data includes:
              </p>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• 5 goals across different categories (study, fitness, personal, etc.)</li>
                <li>• Sub-goals to demonstrate progress tracking</li>
                <li>• Various priority levels and deadlines</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Fresh
              </button>
              <button
                onClick={handleLoadSampleData}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-gray-900 mb-4">You're All Set! 🎉</h2>
            <p className="text-gray-600 mb-8">
              Start creating your goals, scheduling activities, and tracking your progress.
              You can customize your experience in Settings anytime.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Quick Tips:</strong>
              </p>
              <ul className="text-sm text-gray-700 mt-2 space-y-1 text-left">
                <li>• Break down large goals into smaller sub-goals</li>
                <li>• Set realistic deadlines to stay on track</li>
                <li>• Review your analytics weekly to monitor progress</li>
                <li>• Use the calendar to block time for important goals</li>
              </ul>
            </div>
            <button
              onClick={handleComplete}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Using GoalTracker
            </button>
          </div>
        )}
      </div>
    </div>
  );
}







