import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle2, Clock, Target, TrendingUp, Plus } from 'lucide-react';
import type { Goal } from '../../types';
import { StatCard, GoalCard, DeadlineCard, MotivationalMessage } from '../../components/Dashboard';

const Dashboard = () => {
  const { goals } = useApp();
  const navigate = useNavigate();

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    notStarted: goals.filter(g => g.status === 'not-started').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const recentGoals = goals
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const upcomingDeadlines = goals
    .filter(g => g.deadline && g.status !== 'completed')
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return a.deadline.getTime() - b.deadline.getTime();
    })
    .slice(0, 3);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      study: 'bg-blue-100 text-blue-700',
      fitness: 'bg-green-100 text-green-700',
      personal: 'bg-purple-100 text-purple-700',
      work: 'bg-orange-100 text-orange-700',
      finance: 'bg-yellow-100 text-yellow-700',
      health: 'bg-red-100 text-red-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors.other;
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.subGoals.length === 0) return 0;
    const completed = goal.subGoals.filter(sg => sg.completed).length;
    return Math.round((completed / goal.subGoals.length) * 100);
  };

  const handleNavigate = (view: string, goalId?: string) => {
    if (goalId) {
      navigate(`/${view}?goalId=${goalId}`);
    } else {
      navigate(`/${view}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's an overview of your goals and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Goals"
          value={stats.total}
          icon={Target}
          iconColor="text-blue-600"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={Clock}
          iconColor="text-orange-600"
        />
        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={TrendingUp}
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Goals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Recent Goals</h2>
            <button
              onClick={() => handleNavigate('goals')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          </div>
          {recentGoals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No goals yet. Create your first goal to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {recentGoals.map(goal => {
                const progress = getProgressPercentage(goal);
                return (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    progress={progress}
                    categoryColor={getCategoryColor(goal.category)}
                    onClick={() => handleNavigate('goals', goal.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Upcoming Deadlines</h2>
          
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No upcoming deadlines
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingDeadlines.map(goal => {
                const daysUntil = goal.deadline
                  ? Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : 0;
                return (
                  <DeadlineCard
                    key={goal.id}
                    goal={goal}
                    daysUntil={daysUntil}
                    onClick={() => handleNavigate('goals', goal.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Motivational Message */}
      <MotivationalMessage inProgressCount={stats.inProgress} />
    </div>
  );
};

export default Dashboard;
