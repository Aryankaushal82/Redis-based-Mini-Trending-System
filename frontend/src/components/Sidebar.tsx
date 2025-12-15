import { Link, useLocation } from 'react-router-dom';
import { Home, Hash, User, Settings, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Hash, label: 'Explore', path: '/explore' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 p-4 border-r border-border h-screen sticky top-0">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold text-primary">TrendZ</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <div
              className={cn(
                "flex items-center space-x-4 px-4 py-3 rounded-full text-lg transition-colors hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.path ? "font-bold" : "font-medium"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <Button className="w-full rounded-full text-lg py-6" size="lg">
          <PenTool className="mr-2 h-5 w-5" />
          Post
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
