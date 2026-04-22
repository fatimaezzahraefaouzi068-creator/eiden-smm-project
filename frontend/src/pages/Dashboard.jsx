import { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    engagement_rate: 0,
    virality_score: 0,
    eqs: 0,
    follower_growth_rate: 0,
    reach_velocity: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState('weekly');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/metrics/engagement');
        setMetrics(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const weeklyData = [420, 510, 490, 580, 610, 570, 640, 720, 690, 780, 840, 910, 1180, 1840];
  const monthlyData = [180, 210, 260, 310, 290, 350, 420, 480, 510, 590, 650, 720, 980, 1100, 1520, 1840];
  const chartData = chartMode === 'weekly' ? weeklyData : monthlyData;
  const maxValue = Math.max(...chartData);

  if (loading) {
    return (
      <div>
        <div className="page-hd"><h1>Overview</h1><div className="page-hd-sub">Live Command Center — All platforms</div></div>
        <div className="bg-white p-12 text-center">⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-hd">
        <div><h1>Overview</h1><div className="page-hd-sub">Live Command Center — All platforms</div></div>
        <div className="page-hd-right">
          <div className="plat-bar">
            <button className="plat-btn active"><span className="plat-dot" style={{ background: '#0C5752' }}></span>All</button>
            <button className="plat-btn"><span className="plat-dot" style={{ background: '#ec4899' }}></span>Instagram</button>
            <button className="plat-btn"><span className="plat-dot" style={{ background: '#888780' }}></span>TikTok</button>
            <button className="plat-btn"><span className="plat-dot" style={{ background: '#0077b5' }}></span>LinkedIn</button>
            <button className="plat-btn"><span className="plat-dot" style={{ background: '#1877f2' }}></span>Facebook</button>
          </div>
        </div>
      </div>

      <div className="card-forest grain">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
          <div>
            <div className="s-num wh">Views</div>
            <div style={{ fontFamily: 'var(--f-head)', fontSize: '48px', fontWeight: 900, letterSpacing: '-.04em', color: 'var(--canvas)' }}>1.84M</div>
            <div style={{ color: 'var(--gold)', fontFamily: 'var(--f-label)', letterSpacing: '2px', fontWeight: 700, marginTop: '8px', fontSize: '12px' }}>↑ 21.1% VS MOIS PRÉCÉDENT</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <div className="donut-wrap" style={{ width: '72px', height: '72px' }}>
              <svg viewBox="0 0 110 110" style={{ width: '100%', height: '100%' }}>
                <circle cx="55" cy="55" r="40" fill="none" stroke="rgba(254,253,251,.1)" strokeWidth="12"></circle>
                <circle cx="55" cy="55" r="40" fill="none" stroke="#0E7A73" strokeWidth="12" strokeDasharray="190 251" strokeLinecap="round" transform="rotate(-90 55 55)"></circle>
              </svg>
              <div className="donut-center">
                <div className="donut-center-val">76%</div>
                <div className="donut-center-lbl">goal</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(254,253,251,.08)', borderRadius: '100px', padding: '3px' }}>
              <button onClick={() => setChartMode('weekly')} style={{ fontFamily: 'var(--f-label)', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '100px', border: 'none', background: chartMode === 'weekly' ? '#CFC292' : 'transparent', color: chartMode === 'weekly' ? '#122620' : 'rgba(254,253,251,.55)' }}>Weekly</button>
              <button onClick={() => setChartMode('monthly')} style={{ fontFamily: 'var(--f-label)', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '100px', border: 'none', background: chartMode === 'monthly' ? '#CFC292' : 'transparent', color: chartMode === 'monthly' ? '#122620' : 'rgba(254,253,251,.55)' }}>Monthly</button>
            </div>
          </div>
        </div>
        <div style={{ height: '160px', marginTop: '20px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
          {chartData.map((value, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ height: `${(value / maxValue) * 120}px`, width: '100%', background: 'rgba(14,122,115,0.4)', borderRadius: '2px 2px 0 0' }}></div>
              <span style={{ fontSize: '8px', color: 'rgba(254,253,251,.4)', fontFamily: 'Cormorant Garamond, serif' }}>{(i === 0 || i === 3 || i === 6 || i === 9 || i === 12) && (chartMode === 'weekly' ? (i === 0 ? 'W1 Jan' : i === 3 ? 'W3 Jan' : i === 6 ? 'W1 Feb' : i === 9 ? 'W3 Feb' : i === 12 ? 'W1 Apr' : '') : '')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="kpi-grid" style={{ marginTop: '-6px' }}>
        <div className="kpi-card">
          <div className="kpi-num">Followers en plus</div>
          <div className="kpi-value">34</div>
          <span className="kpi-badge up">↑ 17.2%</span>
        </div>
        <div className="kpi-card gold">
          <div className="kpi-num">Visites</div>
          <div className="kpi-value">1.3K</div>
          <span className="kpi-badge up">↑ 52.9%</span>
        </div>
        <div className="kpi-card" style={{ borderTopColor: '#4A3470' }}>
          <div className="kpi-num">Interactions</div>
          <div className="kpi-value">56</div>
          <span className="kpi-badge up">↑ 36.6%</span>
        </div>
        <div className="kpi-card mint">
          <div className="kpi-num">Vidéos et reels</div>
          <div className="kpi-value">311</div>
          <span className="kpi-badge dn">↓ 31.8%</span>
        </div>
      </div>

      <div className="anomaly">
        <div className="anomaly-dot"></div>
        <div className="anomaly-text"><strong>AI Insight · LinkedIn:</strong> Engagement dropped 42% on Apr 7. Resume daily cadence to recover reach velocity by weekend.</div>
      </div>
    </div>
  );
};

export default Dashboard;