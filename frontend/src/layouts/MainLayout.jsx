import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActivePanel = () => {
    if (location.pathname === '/dashboard') return 'overview';
    if (location.pathname === '/posts') return 'posts';
    if (location.pathname === '/audience') return 'audience';
    if (location.pathname === '/alerts') return 'alerts';
    if (location.pathname === '/reports') return 'reports';
    if (location.pathname === '/upload') return 'upload';
    return 'overview';
  };

  const [activePanel, setActivePanel] = useState(getActivePanel());

  const handlePanelChange = (panelId) => {
    setActivePanel(panelId);
    const routes = {
      overview: '/dashboard',
      posts: '/posts',
      audience: '/audience',
      alerts: '/alerts',
      reports: '/reports',
      upload: '/upload',
    };
    navigate(routes[panelId] || '/dashboard');
  };

  return (
    <div className="shell">
      <TopNav />
      <Sidebar onPanelChange={handlePanelChange} activePanel={activePanel} />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;