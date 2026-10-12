import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PLOTS_DATA } from '../data/plotData';
import { PROJECTS_DATA } from '../data/projects';
import { plotApi } from '../services/plotApi';

const PlotContext = createContext(null);

const STORAGE_KEY_PLOTS = 'skandha_plots_inventory_v1';
const STORAGE_KEY_PROJECTS = 'skandha_projects_inventory_v2';
const STORAGE_KEY_LOGS = 'skandha_admin_activity_logs_v1';
const STORAGE_KEY_BOOKINGS = 'skandha_admin_bookings_queue_v1';

export function PlotProvider({ children }) {
  // 1. Plots state
  const [plots, setPlots] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLOTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PLOTS_DATA;
  });

  // 2. Bookings Approval Queue
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'bk-101',
        plotNumber: 15,
        plotId: 15,
        customerName: 'K. Ramesh Reddy',
        customerPhone: 'ramesh.reddy@example.com',
        requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'pending_approval',
        tokenAmount: '₹50,000',
        facing: 'West',
        sqYards: 202,
        notes: 'Submitted token advance via NEFT. Awaiting Admin Approval.'
      },
      {
        id: 'bk-102',
        plotNumber: 23,
        plotId: 23,
        customerName: 'Priya Sharma',
        customerPhone: 'priya.sharma@example.com',
        requestedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'pending_approval',
        tokenAmount: '₹1,00,000',
        facing: 'West',
        sqYards: 183,
        notes: 'Site visit completed. Spot booking confirmation requested.'
      }
    ];
  });

  // 3. Projects state
  const [projects, setProjects] = useState(() => {
    try {
      localStorage.removeItem('skandha_projects_inventory_v1');
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PROJECTS_DATA;
  });

  // 4. Activity audit logs for admin
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: 'log-1', timestamp: new Date().toISOString(), message: 'Map API Initialized with DTCP Layout Sanction TLP NO. 87/2024/H.' },
      { id: 'log-2', timestamp: new Date().toISOString(), message: '96 Plotted parcels active with live status colors (Green/Blue/Red).' }
    ];
  });

  // Sync from REST API on Mount
  const refreshFromApi = useCallback(async () => {
    try {
      const plotsRes = await plotApi.getPlots();
      if (plotsRes && plotsRes.success && Array.isArray(plotsRes.data)) {
        setPlots(plotsRes.data);
      }

      const bookingsRes = await plotApi.getBookings();
      if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.bookings)) {
        setBookings(bookingsRes.bookings);
      }
    } catch (err) {
      console.warn('[PlotContext] API sync warning:', err.message);
    }
  }, []);

  useEffect(() => {
    refreshFromApi();
  }, [refreshFromApi]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLOTS, JSON.stringify(plots));
    } catch {
      // ignore
    }
  }, [plots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(activityLogs));
    } catch {
      // ignore
    }
  }, [activityLogs]);

  // =========================================================================
  // CORE MAP API ADMIN ACTIONS (Plot Booking Confirmation & Approvals)
  // =========================================================================

  /**
   * ADMIN ACTION: Approve a Plot Booking Request -> Changes color to Blue (#2563eb)
   */
  const approvePlot = async (plotId, details = {}) => {
    const plotNo = Number(plotId);
    
    // Call backend API
    try {
      await plotApi.approvePlot(plotNo, details);
    } catch (err) {
      console.warn('[PlotContext] API approve error, applying local state update:', err.message);
    }

    // Update local plots state (turns BLUE)
    setPlots(prev => prev.map(p => {
      if (p.id === plotNo || p.number === plotNo) {
        return {
          ...p,
          status: 'booked',
          lastUpdated: new Date().toISOString(),
          customer: {
            name: details.customerName || details.name || p.customer?.name || 'Approved Buyer',
            phone: details.customerPhone || details.phone || p.customer?.phone || '',
            tokenAmount: details.tokenAmount || 'Token Confirmed',
            approvedBy: 'Admin',
            approvedAt: new Date().toISOString(),
            notes: details.notes || 'Booking confirmed and approved by Admin.'
          }
        };
      }
      return p;
    }));

    // Update booking in approval queue
    setBookings(prev => prev.map(b => {
      if (b.plotNumber === plotNo || b.plotId === plotNo) {
        return {
          ...b,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          adminNotes: details.notes || 'Approved by Admin'
        };
      }
      return b;
    }));

    // Add Audit Log
    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Admin APPROVED Plot #${plotNo} booking. Plot color changed to Blue (#2563eb).`
      },
      ...prev.slice(0, 49)
    ]);
  };

  /**
   * ADMIN ACTION: Direct Plot Booking -> Changes color to Blue (#2563eb)
   */
  const bookPlot = async (plotId, details = {}) => {
    const plotNo = Number(plotId);

    try {
      await plotApi.bookPlot(plotNo, details);
    } catch (err) {
      console.warn('[PlotContext] API book error, applying local state update:', err.message);
    }

    setPlots(prev => prev.map(p => {
      if (p.id === plotNo || p.number === plotNo) {
        return {
          ...p,
          status: 'booked',
          lastUpdated: new Date().toISOString(),
          customer: {
            name: details.customerName || details.name || 'Direct Booking',
            phone: details.customerPhone || details.phone || '',
            tokenAmount: details.tokenAmount || 'Advance Token Paid',
            bookedBy: 'Admin Access',
            bookedAt: new Date().toISOString(),
            notes: details.notes || 'Admin confirmed direct plot booking.'
          }
        };
      }
      return p;
    }));

    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Admin BOOKED Plot #${plotNo}. Plot color changed to Blue (#2563eb).`
      },
      ...prev.slice(0, 49)
    ]);
  };

  /**
   * ADMIN ACTION: Confirm Deed / Sold Out -> Changes color to Red (#ef4444)
   */
  const confirmSold = async (plotId, details = {}) => {
    const plotNo = Number(plotId);

    try {
      await plotApi.confirmSold(plotNo, details);
    } catch (err) {
      console.warn('[PlotContext] API confirmSold error, applying local state update:', err.message);
    }

    setPlots(prev => prev.map(p => {
      if (p.id === plotNo || p.number === plotNo) {
        return {
          ...p,
          status: 'sold',
          lastUpdated: new Date().toISOString(),
          customer: {
            name: details.customerName || p.customer?.name || 'Registered Owner',
            phone: details.customerPhone || p.customer?.phone || '',
            deedNumber: details.deedNumber || 'REG-' + Date.now().toString().slice(-6),
            soldBy: 'Admin Registration',
            soldAt: new Date().toISOString(),
            notes: details.notes || 'Registration deed completed. Plot sold out.'
          }
        };
      }
      return p;
    }));

    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Admin confirmed SALE DEED for Plot #${plotNo}. Plot color changed to Red (#ef4444).`
      },
      ...prev.slice(0, 49)
    ]);
  };

  /**
   * ADMIN ACTION: Release Plot Back to Available -> Changes color to Green (#10b981)
   */
  const releasePlot = async (plotId, details = {}) => {
    const plotNo = Number(plotId);

    try {
      await plotApi.releasePlot(plotNo, details);
    } catch (err) {
      console.warn('[PlotContext] API release error, applying local update:', err.message);
    }

    setPlots(prev => prev.map(p => {
      if (p.id === plotNo || p.number === plotNo) {
        return {
          ...p,
          status: 'available',
          lastUpdated: new Date().toISOString(),
          customer: null
        };
      }
      return p;
    }));

    setActivityLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Admin RELEASED Plot #${plotNo} back to Available. Plot color changed to Green (#10b981).`
      },
      ...prev.slice(0, 49)
    ]);
  };

  /**
   * General Update status wrapper
   */
  const updatePlotStatus = (plotId, newStatus, customerInfo = null) => {
    if (newStatus === 'booked') {
      bookPlot(plotId, customerInfo || {});
    } else if (newStatus === 'sold') {
      confirmSold(plotId, customerInfo || {});
    } else {
      releasePlot(plotId, customerInfo || {});
    }
  };

  /**
   * Customer / Public Booking Request (Enters Admin Approval Queue)
   */
  const requestBooking = async (bookingData) => {
    try {
      const res = await plotApi.requestBooking(bookingData);
      if (res && res.booking) {
        setBookings(prev => [res.booking, ...prev]);
        return res;
      }
    } catch (err) {
      console.warn('[PlotContext] API request error, saving locally:', err.message);
    }

    const newBooking = {
      id: `bk-${Date.now()}`,
      plotNumber: Number(bookingData.plotNumber),
      plotId: Number(bookingData.plotNumber),
      customerName: bookingData.name || bookingData.customerName || 'Online Inquirer',
      customerPhone: bookingData.phone || bookingData.customerPhone || '',
      requestedAt: new Date().toISOString(),
      status: 'pending_approval',
      tokenAmount: bookingData.tokenAmount || 'Pending Confirmation',
      notes: bookingData.notes || 'Inquiry submitted online awaiting Admin approval.'
    };

    setBookings(prev => [newBooking, ...prev]);
    return { success: true, booking: newBooking };
  };

  // Admin action: Reset plots
  const resetPlots = () => {
    setPlots(INITIAL_PLOTS_DATA);
    setActivityLogs(prev => [
      { id: `log-${Date.now()}`, timestamp: new Date().toISOString(), message: 'Masterplan inventory reset to factory DTCP layout.' },
      ...prev
    ]);
  };

  // Admin action: Edit existing project
  const updateProject = (updatedProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  // Admin action: Add new project
  const addProject = (newProject) => {
    setProjects(prev => [...prev, newProject]);
  };

  // Calculated statistics
  const stats = {
    total: plots.length,
    available: plots.filter(p => p.status === 'available').length,
    booked: plots.filter(p => p.status === 'booked').length,
    sold: plots.filter(p => p.status === 'sold').length,
    pendingApprovals: bookings.filter(b => b.status === 'pending_approval').length
  };

  return (
    <PlotContext.Provider value={{
      plots,
      projects,
      stats,
      bookings,
      activityLogs,
      approvePlot,
      bookPlot,
      confirmSold,
      releasePlot,
      requestBooking,
      updatePlotStatus,
      refreshFromApi,
      resetPlots,
      updateProject,
      addProject
    }}>
      {children}
    </PlotContext.Provider>
  );
}

export function usePlotContext() {
  const context = useContext(PlotContext);
  if (!context) {
    throw new Error('usePlotContext must be used within a PlotProvider');
  }
  return context;
}
