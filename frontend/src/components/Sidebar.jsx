const Sidebar = ({ activePanel, onPanelChange }) => {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: '📊', iconClass: 'ico-dash', badge: 'Live', badgeClass: 'teal' },
    { id: 'posts', name: 'MicroView', icon: '📝', iconClass: 'ico-posts' },
    { id: 'audience', name: 'Audience', icon: '👥', iconClass: 'ico-aud' },
    { id: 'alerts', name: 'Alerts', icon: '🔔', iconClass: 'ico-alert', badge: '3', badgeClass: 'red' },
    { id: 'reports', name: 'Publicité', icon: '📢', iconClass: 'ico-report', badge: 'New', badgeClass: 'gold' },
    { id: 'upload', name: 'Import CSV', icon: '📁', iconClass: 'ico-upload' },  // ← AJOUTE CETTE LIGNE
  ];

  return (
    <aside className="sidebar">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`sb-item ${activePanel === item.id ? 'active' : ''}`}
          onClick={() => onPanelChange(item.id)}
        >
          <div className={`sb-ico ${item.iconClass}`}>{item.icon}</div>
          <span>{item.name}</span>
          {item.badge && <span className={`sb-badge ${item.badgeClass}`}>{item.badge}</span>}
        </div>
      ))}
      <div className="sb-spacer"></div>
      <div className="sb-workspace">
        <div className="sb-ws-name">Eiden Agency</div>
        <div className="sb-ws-plan">Agency Plan · Unlimited</div>
      </div>
    </aside>
  );
};

export default Sidebar;