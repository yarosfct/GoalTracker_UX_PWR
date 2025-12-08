const Schedule = () => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <p className="mt-2 text-gray-600">Plan and organize your goal activities</p>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              &lt; Previous
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Next &gt;
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center">
              <div className="font-semibold text-gray-700 mb-2">{day}</div>
              <div className="bg-gray-50 rounded-lg p-4 h-32 border-2 border-dashed border-gray-300">
                <p className="text-xs text-gray-400">No activities</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Activities</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">No scheduled activities</p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
