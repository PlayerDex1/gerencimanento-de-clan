import { Link, Outlet, useLocation } from 'react-router-dom';
import { TrendingUp, Bell, BarChart2, Zap } from 'lucide-react';

const NAV = [
  { name: 'Live Market', href: '/', icon: TrendingUp },
  { name: 'Watchlist', href: '/watchlist', icon: Bell },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-50 flex flex-col">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">ZGaming</span>
              <span className="text-indigo-400"> Market</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-400">
              <Zap className="w-2.5 h-2.5" /> LIVE
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV.map(item => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link key={item.name} to={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}>
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800/40 py-4 text-center text-xs text-zinc-600">
        ZGaming Market — Lineage 2 Real-time Market Tracker
      </footer>
    </div>
  );
}
