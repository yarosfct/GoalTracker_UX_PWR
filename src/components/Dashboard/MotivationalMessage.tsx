import { TrendingUp } from 'lucide-react';

interface MotivationalMessageProps {
  inProgressCount: number;
}

export function MotivationalMessage({ inProgressCount }: MotivationalMessageProps) {
  if (inProgressCount === 0) return null;

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-gray-900 mb-1">Keep Going! 💪</h3>
          <p className="text-gray-600">
            You have {inProgressCount} goal{inProgressCount !== 1 ? 's' : ''} in progress.{' '}
            Stay focused and you'll achieve great things!
          </p>
        </div>
      </div>
    </div>
  );
}






