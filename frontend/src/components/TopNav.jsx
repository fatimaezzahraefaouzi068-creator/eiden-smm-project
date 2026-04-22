const TopNav = () => {
  return (
    <nav className="topnav">
      <div className="topnav-brand">
        <div className="topnav-brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="#CFC292" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        Social<em>Pulse</em>
        <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '3px', color: 'rgba(18,38,32,.3)', marginLeft: '4px', fontFamily: 'var(--f-label)', textTransform: 'uppercase' }}>AI</span>
      </div>
      <div className="topnav-right">
        <button className="pill-btn live">Live</button>
        <select className="pill-btn">
          <option value="7d">Last 7 days</option>
          <option value="30d" selected>Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <button className="pill-btn gold">Export PDF</button>
        <div style={{ position: 'relative' }}>
          <div className="topnav-avatar">EG</div>
          <div className="notif-dot"></div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;