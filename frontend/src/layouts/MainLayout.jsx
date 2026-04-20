import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-beige">
      <Sidebar />
      <main className="ml-56 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;