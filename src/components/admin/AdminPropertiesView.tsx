import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Play, 
  ArrowUpDown, 
  CheckCircle2, 
  FileEdit, 
  Phone, 
  MapPin, 
  Calendar, 
  IndianRupee,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { Property, PropertyStatus } from '../../types/property';
import { AdminSidebar } from './AdminSidebar';
import { StatusBadge } from './StatusBadge';

export const AdminPropertiesView: React.FC = () => {
  const navigate = useNavigate();
  const { 
    properties, 
    deleteProperty, 
    updatePropertyStatus, 
    setActiveVideoProperty, 
    setSelectedProperty,
    addToast 
  } = useProperties();

  const [currentTab, setCurrentTab] = useState('properties');
  const [searchAdmin, setSearchAdmin] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | PropertyStatus>('All');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Compute Stats
  const counts = useMemo(() => {
    return {
      total: properties.length,
      published: properties.filter(p => p.status === 'Published').length,
      drafts: properties.filter(p => p.status === 'Draft' || p.status === 'Pending').length,
      trash: 2, // simulated demo trash count
    };
  }, [properties]);

  // Filtered properties for table
  const displayedProperties = useMemo(() => {
    return properties.filter((item) => {
      // Tab filter
      if (currentTab === 'published' && item.status !== 'Published') return false;
      if (currentTab === 'drafts' && item.status !== 'Draft' && item.status !== 'Pending') return false;

      // Status pill filter
      if (selectedStatusFilter !== 'All' && item.status !== selectedStatusFilter) {
        return false;
      }

      // Search filter
      if (searchAdmin.trim() !== '') {
        const q = searchAdmin.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.owner.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.videoId.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [properties, currentTab, selectedStatusFilter, searchAdmin]);

  const handleDelete = (id: string, title: string) => {
    deleteProperty(id);
    addToast({
      type: 'warning',
      title: 'Moved to Trash',
      message: `"${title}" was removed from the active catalog.`
    });
  };

  const handleQuickStatusChange = (prop: Property) => {
    const nextStatus: PropertyStatus = prop.status === 'Published' ? 'Draft' : 'Published';
    updatePropertyStatus(prop.id, nextStatus);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <AdminSidebar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          counts={counts} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative z-10 w-64 h-full flex flex-col">
            <AdminSidebar 
              currentTab={currentTab} 
              setCurrentTab={(t) => { setCurrentTab(t); setIsMobileSidebarOpen(false); }} 
              counts={counts} 
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                Property Inventory Management
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Manage YouTube video tours, GPS locations, and pricing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/sell')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              View Live Map
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

          {/* Stats KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Properties
                </span>
                <span className="text-2xl font-black text-slate-900">{counts.total}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  100% Verified Locations
                </span>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Building2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Live on Map
                </span>
                <span className="text-2xl font-black text-emerald-600">{counts.published}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Active video listings
                </span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Drafts &amp; Pending
                </span>
                <span className="text-2xl font-black text-amber-600">{counts.drafts}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Awaiting review
                </span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <FileEdit className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Trash / Archived
                </span>
                <span className="text-2xl font-black text-slate-400">{counts.trash}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Retained 30 days
                </span>
              </div>
              <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchAdmin}
                onChange={(e) => setSearchAdmin(e.target.value)}
                placeholder="Search title, owner, phone, YouTube ID..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {(['All', 'Published', 'Draft', 'Pending'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedStatusFilter === status
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

          </div>

          {/* Table (Desktop) & Card List (Mobile) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Property</th>
                    <th className="py-3.5 px-3">Owner / Contact</th>
                    <th className="py-3.5 px-3">YouTube ID</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Price</th>
                    <th className="py-3.5 px-3">Location</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-blue-50/40 transition-colors group">
                      
                      {/* Property Title & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.thumbnail}
                            alt=""
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="max-w-xs truncate">
                            <span className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer block truncate"
                              onClick={() => {
                                setSelectedProperty(prop);
                                navigate('/');
                              }}
                            >
                              {prop.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {prop.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Owner & Phone */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800 block">{prop.owner}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{prop.phone}</span>
                      </td>

                      {/* YouTube Video Tour Link */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => setActiveVideoProperty(prop)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[11px] font-semibold border border-red-200/60 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current text-red-600" />
                          <span className="font-mono">{prop.videoId}</span>
                        </button>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-slate-600 font-medium">
                        {prop.category}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-extrabold text-blue-600">
                        {prop.price}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3 text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[130px]">{prop.area || prop.location}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={prop.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedProperty(prop);
                              navigate('/');
                            }}
                            title="View on Map"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickStatusChange(prop)}
                            title="Toggle Status"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prop.id, prop.title)}
                            title="Delete"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Responsive Card View */}
            <div className="block lg:hidden divide-y divide-slate-100">
              {displayedProperties.map((prop) => (
                <div key={prop.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.thumbnail}
                        alt=""
                        className="w-14 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block leading-snug">
                          {prop.title}
                        </span>
                        <span className="text-xs font-extrabold text-blue-600">{prop.price}</span>
                      </div>
                    </div>
                    <StatusBadge status={prop.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                    <div>Owner: <strong className="text-slate-800">{prop.owner}</strong></div>
                    <div>Location: <strong className="text-slate-800">{prop.area}</strong></div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveVideoProperty(prop)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{prop.videoId}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedProperty(prop);
                          navigate('/');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg"
                      >
                        View Map
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id, prop.title)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {displayedProperties.length === 0 && (
              <div className="text-center py-12 px-4">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">No properties match your filter</h3>
                <p className="text-xs text-slate-400 mt-1">Try resetting search keywords or status filter.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
