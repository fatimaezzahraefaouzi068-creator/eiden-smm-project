import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiUsers, FiBarChart2, FiAlertCircle, FiUpload } from 'react-icons/fi';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', name: 'Overview', icon: <FiHome size={18} /> },
    { path: '/posts', name: 'MicroView', icon: <FiFileText size={18} /> },
    { path: '/audience', name: 'Audience', icon: <FiUsers size={18} /> },
    { path: '/reports', name: 'Publicité', icon: <FiBarChart2 size={18} /> },
    { path: '/alerts', name: 'Alerts', icon: <FiAlertCircle size={18} /> },
    { path: '/upload', name: 'Import CSV', icon: <FiUpload size={18} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-canvas border-r border-forest/5 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-forest/5">
        <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
          <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-head font-bold text-forest">Social<span className="text-teal">Pulse</span></span>
        <span className="text-[9px] font-label tracking-[0.2em] text-teal ml-1">AI</span>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 py-6">
        <div className="text-[10px] font-label tracking-[0.2em] text-forest/35 uppercase px-2 pb-2">Menu</div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all
              ${isActive ? 'bg-teal/10 text-teal font-semibold border border-teal/10' : 'text-forest/60 hover:bg-beige'}
            `}
          >
            <span className="w-5">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Workspace */}
      <div className="m-3 p-4 bg-forest rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-[10px] font-label tracking-[0.2em] text-canvas/40 uppercase">Workspace</div>
          <div className="text-sm font-head font-bold text-canvas mt-1">Eiden Organization</div>
          <div className="text-[10px] font-label tracking-[0.1em] text-gold mt-2 uppercase">Enterprise Plan</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;