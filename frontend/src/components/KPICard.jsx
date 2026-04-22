const KPICard = ({ title, value, change, icon, color = 'teal' }) => {
  const isPositive = change > 0;
  const changeText = `${isPositive ? '+' : ''}${change}%`;

  const colors = {
    teal: 'border-teal',
    gold: 'border-gold-dk',
    red: 'border-red',
    blue: 'border-blue',
    mint: 'border-mint',
    purple: 'border-purple',
  };

  return (
    <div className={`bg-surface p-6 border-t-3 ${colors[color]} transition-all hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-label tracking-[0.2em] text-forest/40 uppercase">
          {title}
        </div>
        <div className="text-xl">{icon}</div>
      </div>
      <div className="text-3xl font-head font-black text-forest mt-1">{value}</div>
      <div className={`inline-block text-xs font-label px-2 py-0.5 rounded-full mt-2 ${isPositive ? 'bg-teal/10 text-teal' : 'bg-red/10 text-red'}`}>
        {isPositive ? '↑' : '↓'} {changeText}
      </div>
    </div>
  );
};

export default KPICard;