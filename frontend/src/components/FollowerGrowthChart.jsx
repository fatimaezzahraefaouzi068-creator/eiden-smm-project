import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FollowerGrowthChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 border border-forest/5">
        <h3 className="font-head font-bold text-forest mb-4">Évolution des followers</h3>
        <div className="h-[300px] flex items-center justify-center text-forest/45">
          ⏳ Chargement des données...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 border border-forest/5">
        <h3 className="font-head font-bold text-forest mb-4">Évolution des followers</h3>
        <div className="h-[300px] flex items-center justify-center text-forest/45">
          📊 Aucune donnée disponible
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 border border-forest/5">
      <h3 className="font-head font-bold text-forest mb-4">Évolution des followers</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
          <XAxis dataKey="date" stroke="#6b6375" fontSize={12} />
          <YAxis stroke="#6b6375" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#122620', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#CFC292' }}
            itemStyle={{ color: '#FEFDFB' }}
            formatter={(value) => [`${value.toLocaleString()} followers`, '']}
          />
          <Line
            type="monotone"
            dataKey="followers"
            name="Followers"
            stroke="#0C5752"
            strokeWidth={3}
            dot={{ fill: '#0C5752', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FollowerGrowthChart;