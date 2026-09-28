import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Property, FilterState, PropertyCategory, ToastMessage } from '../types/property';
import { INITIAL_PROPERTIES } from '../data/mockProperties';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  activeVideoProperty: Property | null;
  setActiveVideoProperty: (prop: Property | null) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  activeFilterCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  mapCenter: [number, number];
  mapZoom: number;
  setMapCenterAndZoom: (center: [number, number], zoom?: number) => void;
  addProperty: (newProp: Property) => void;
  updatePropertyStatus: (id: string, status: Property['status']) => void;
  deleteProperty: (id: string) => void;
  newlyAddedPropertyId: string | null;
  setNewlyAddedPropertyId: (id: string | null) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  minPrice: 1,      // 1 Lakh (₹1.0K to ₹100 Cr range mapped)
  maxPrice: 10000,  // 10,000 Lakhs = 100 Cr
  uploadedWithin: 'All',
  searchMobile: '',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeVideoProperty, setActiveVideoProperty] = useState<Property | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0334, 80.2326]); // Central Chennai
  const [mapZoom, setMapZoom] = useState(12);
  const [newlyAddedPropertyId, setNewlyAddedPropertyId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const setMapCenterAndZoom = useCallback((center: [number, number], zoom = 14) => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(DEFAULT_FILTERS);
    addToast({
      type: 'info',
      title: 'Filters Reset',
      message: 'All search criteria have been cleared'
    });
  }, [addToast]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.categories.length > 0) count += filterState.categories.length;
    if (filterState.minPrice > 1 || filterState.maxPrice < 10000) count += 1;
    if (filterState.uploadedWithin !== 'All') count += 1;
    if (filterState.searchMobile.trim() !== '') count += 1;
    return count;
  }, [filterState]);

  const addProperty = useCallback((newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
    setNewlyAddedPropertyId(newProp.id);
    setSelectedProperty(newProp);
    setMapCenterAndZoom([newProp.latitude, newProp.longitude], 15);
    addToast({
      type: 'success',
      title: 'Property Live!',
      message: `"${newProp.title}" is now visible on the map.`
    });
  }, [addToast, setMapCenterAndZoom]);

  const updatePropertyStatus = useCallback((id: string, status: Property['status']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Property marked as ${status}`
    });
  }, [addToast]);

  const deleteProperty = useCallback((id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
    addToast({
      type: 'warning',
      title: 'Property Removed',
      message: 'The property was moved to trash.'
    });
  }, [addToast, selectedProperty]);

  // Dynamic filtering
  const filteredProperties = useMemo(() => {
    return properties.filter(item => {
      // Must be published on public map (drafts only in admin unless it was just submitted)
      if (item.status !== 'Published' && item.id !== newlyAddedPropertyId) {
        return false;
      }

      // Search query: title, location, area, category
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.owner.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Categories filter
      if (filterState.categories.length > 0) {
        if (!filterState.categories.includes(item.category)) {
          return false;
        }
      }

      // Price filter (priceAmount is in Lakhs)
      if (item.priceAmount < filterState.minPrice || item.priceAmount > filterState.maxPrice) {
        return false;
      }

      // Uploaded within filter
      if (filterState.uploadedWithin !== 'All') {
        const itemDate = new Date(item.uploadedAt).getTime();
        const now = Date.now();
        const diffDays = Math.max(0, (now - itemDate) / (1000 * 3600 * 24));

        if (filterState.uploadedWithin === '1 Week' && diffDays > 7) return false;
        if (filterState.uploadedWithin === '1 Month' && diffDays > 30) return false;
        if (filterState.uploadedWithin === '6 Months' && diffDays > 180) return false;
      }

      // Listed by / Mobile filter
      if (filterState.searchMobile.trim() !== '') {
        const cleanMobileQuery = filterState.searchMobile.replace(/\D/g, '');
        const cleanItemPhone = item.phone.replace(/\D/g, '');
        if (!cleanItemPhone.includes(cleanMobileQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [properties, searchQuery, filterState, newlyAddedPropertyId]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        selectedProperty,
        setSelectedProperty,
        activeVideoProperty,
        setActiveVideoProperty,
        isFilterOpen,
        setIsFilterOpen,
        filterState,
        setFilterState,
        resetFilters,
        activeFilterCount,
        searchQuery,
        setSearchQuery,
        mapCenter,
        mapZoom,
        setMapCenterAndZoom,
        addProperty,
        updatePropertyStatus,
        deleteProperty,
        newlyAddedPropertyId,
        setNewlyAddedPropertyId,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
