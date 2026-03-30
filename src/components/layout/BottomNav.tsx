import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, Sliders, FileText } from 'lucide-react';
import clsx from 'clsx';

export function BottomNav() {
  const tabs = [
    { to: '/', icon: FileText, label: 'REPORTS' },
    { to: '/map', icon: MapIcon, label: 'MAP' },
    { to: '/sim', icon: Sliders, label: 'SIM' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'DASH' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] h-[84px] flex justify-around items-center px-4 pb-6 pt-2 rounded-t-[32px] z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.2)] border-t border-slate-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => clsx(
              "flex flex-col items-center gap-1.5 min-w-[64px] transition-colors",
              isActive ? "text-[#22c55e]" : "text-slate-500"
            )}
          >
            <Icon size={22} strokeWidth={2.5} />
            <span className="text-[9px] font-bold tracking-[0.2em] leading-none">{tab.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
