import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SuccessRateData {
  category: string;
  rate: number;
}

interface SuccessRateChartProps {
  data: SuccessRateData[];
}

export function SuccessRateChart({ data }: SuccessRateChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-gray-900 mb-6">Success Rate by Category</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="category" width={80} />
            <Tooltip 
              formatter={(value: number) => `${value}%`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
            />
            <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#3B82F6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-gray-500">
          No category data available
        </div>
      )}
    </div>
  );
}




