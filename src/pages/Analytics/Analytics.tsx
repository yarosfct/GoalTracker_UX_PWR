const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Track your progress and performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Completion Rate</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0%</p>
          <p className="mt-2 text-sm text-gray-500">No data available</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Goals This Month</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          <p className="mt-2 text-sm text-gray-500">No data available</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Average Progress</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0%</p>
          <p className="mt-2 text-sm text-gray-500">No data available</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Streak Days</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          <p className="mt-2 text-sm text-gray-500">No data available</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Progress Over Time</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Goal Categories</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Insights & Recommendations</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">No insights available yet. Start tracking your goals to see personalized recommendations.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
