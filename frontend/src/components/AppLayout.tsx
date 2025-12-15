import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TrendingSidebar from './TrendingSidebar';

const AppLayout = () => {
  return (
    <div className="flex justify-center min-h-screen bg-background text-foreground">
      <div className="flex w-full max-w-7xl">
        <Sidebar />
        <main className="flex-1 border-r border-border min-h-screen">
          <Outlet />
        </main>
        <TrendingSidebar />
      </div>
    </div>
  );
};

export default AppLayout;
