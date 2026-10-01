import React from 'react';
import { useNavigate } from 'react-router-dom';
import whiteLogo from '../../assets/white-logo.png';
import { 
  LayoutDashboard, 
  Building2, 
  CheckCircle2, 
  FileEdit, 
  Trash2, 
  Settings, 
  Map, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  counts: {
    total: number;
    published: number;
    drafts: number;
    trash: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
  counts,
}) => {
  const navigate = useNavigate();

  const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2, count: counts.total },
    { id: 'published', label: 'Published', icon: CheckCircle2, count: counts.published },
    { id: 'drafts', label: 'Drafts', icon: FileEdit, count: counts.drafts },
    { id: 'trash', label: 'Trash', icon: Trash2, count: counts.trash },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-11 px-3 py-1 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center shadow-sm">
            <img src={whiteLogo} alt="VJM Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">VJM Console</h2>
            <span className="text-[10px] text-slate-400 block font-medium">Real Estate Platform</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Management
        </div>

        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Switch Back to Public Map */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/60"
        >
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-400" />
            <span>Public Map View</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

    </aside>
  );
};
