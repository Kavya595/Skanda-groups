import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  LogIn,
  AlertCircle, 
  LogOut, 
  Check, 
  ArrowLeft, 
  Layers, 
  ExternalLink, 
  RefreshCw, 
  X, 
  CheckCircle, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlotContext } from '../context/PlotContext';
import ChallampallyMasterplan from '../components/ChallampallyMasterplan';

export default function Admin() {
  const { 
    plots, 
    stats, 
    bookPlot, 
    confirmSold, 
    releasePlot, 
    refreshFromApi, 
    resetPlots 
  } = usePlotContext();

  // Authentication State (Session-based: auto-expires on tab/window close, requires login on every new session or after logout)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Purge legacy persistent localStorage login so existing browsers are forced to authenticate cleanly
    try {
      localStorage.removeItem('skandha_admin_logged_in');
    } catch {
      // ignore
    }
    try {
      return sessionStorage.getItem('skandha_admin_session_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [logoutNotice, setLogoutNotice] = useState('');

  // Selected Plot for Instant Confirmation Modal
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [modalAction, setModalAction] = useState('book'); // 'book', 'sold', 'release'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tokenAmount, setTokenAmount] = useState('₹50,000');
  const [deedNumber, setDeedNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Canvas Pan & Zoom State for Interactive Map
  const [zoomLevel, setZoomLevel] = useState(0.9);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Responsive initial zoom
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      if (width < 640) {
        setZoomLevel(0.35);
      } else if (width < 1024) {
        setZoomLevel(0.65);
      } else if (width < 1440) {
        setZoomLevel(0.85);
      } else {
        setZoomLevel(1.0);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Non-passive Wheel Zoom to avoid passive listener console warnings
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onWheelHandler = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
      setZoomLevel(prev => Math.min(Math.max(0.3, prev + zoomFactor), 2.2));
    };

    el.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheelHandler);
    };
  }, []);

  // Drag pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(Math.max(0.3, prev + delta), 2.2));
  };

  const handleResetView = () => {
    setPanOffset({ x: 0, y: 0 });
    const width = window.innerWidth;
    if (width < 640) setZoomLevel(0.35);
    else if (width < 1024) setZoomLevel(0.65);
    else setZoomLevel(0.9);
  };

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPin === 'admin123' || adminPin === 'skandha2026') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('skandha_admin_session_logged_in', 'true');
        localStorage.removeItem('skandha_admin_logged_in');
      } catch {
        // ignore
      }
      setAdminPin('');
      setAuthError('');
      setLogoutNotice('');
    } else {
      setAuthError('Invalid Admin Password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPin('');
    setAuthError('');
    setLogoutNotice('');
    try {
      sessionStorage.removeItem('skandha_admin_session_logged_in');
      localStorage.removeItem('skandha_admin_logged_in');
    } catch {
      // ignore
    }
  };

  // Open Action Modal when clicking any plot on the map
  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
    // Pre-select action based on current status
    if (plot.status === 'available') {
      setModalAction('book');
    } else if (plot.status === 'booked') {
      setModalAction('sold');
    } else {
      setModalAction('release');
    }
    setCustomerName(plot.customer?.name || '');
    setCustomerPhone(plot.customer?.phone || '');
    setTokenAmount(plot.customer?.tokenAmount || '₹50,000');
    setDeedNumber(plot.customer?.deedNumber || 'REG-' + Date.now().toString().slice(-6));
    setAdminNotes(plot.customer?.notes || '');
    setActionSuccessMsg('');
  };

  // Submit Plot Confirmation / Booking
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlot) return;
    setIsSubmitting(true);

    try {
      const plotId = selectedPlot.id || selectedPlot.number;

      if (modalAction === 'book') {
        await bookPlot(plotId, {
          customerName: customerName || 'Booked Buyer',
          customerPhone,
          tokenAmount,
          notes: adminNotes || 'Admin confirmed plot booking.'
        });
        setActionSuccessMsg(`Plot #${selectedPlot.number} successfully BOOKED! Color changed to BLUE (#2563eb).`);
      } else if (modalAction === 'sold') {
        await confirmSold(plotId, {
          customerName: customerName || 'Registered Owner',
          customerPhone,
          deedNumber: deedNumber || 'REG-' + Date.now().toString().slice(-6),
          notes: adminNotes || 'Registration deed executed. Sold out.'
        });
        setActionSuccessMsg(`Plot #${selectedPlot.number} confirmed SOLD! Color changed to RED (#ef4444).`);
      } else if (modalAction === 'release') {
        await releasePlot(plotId, {
          notes: adminNotes || 'Booking cancelled and plot released.'
        });
        setActionSuccessMsg(`Plot #${selectedPlot.number} RELEASED! Color changed to GREEN (#10b981).`);
      }

      setTimeout(() => {
        setSelectedPlot(null);
        setActionSuccessMsg('');
        setIsSubmitting(false);
      }, 1200);
    } catch (err) {
      alert('Error updating plot: ' + err.message);
      setIsSubmitting(false);
    }
  };

  // Plot lookup map for Challampally Masterplan
  const plotLookup = useMemo(() => {
    const map = {};
    plots.forEach(p => {
      map[p.number] = p;
    });
    return map;
  }, [plots]);

  // If not authenticated, render Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F58220]/20 border border-[#F58220]/40 flex items-center justify-center text-[#F58220]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Admin Portal</h2>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:border-[#F58220] outline-none text-sm transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-[#F58220] hover:bg-[#E07016] shadow-lg transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#07080a] text-slate-100 flex flex-col font-sans select-none">
      
      {/* 1. TOP HEADER & MAP API STATUS BAR */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 z-30 shadow-md flex-shrink-0">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-[#F58220] flex items-center justify-center text-white font-black text-xs shadow">
            API
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                Live Interactive Layout Map &bull; Admin Booking Desk
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hidden sm:inline">
                Live Sync
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Click any plot on the layout to confirm bookings and automatically change colors
            </p>
          </div>
        </div>

        {/* Status Counters & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Green (Available) */}
          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008532]" />
            <span className="hidden sm:inline">Available:</span>
            <strong className="text-white font-black">{stats.available}</strong>
          </div>

          {/* Blue (Booked) */}
          <div className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span className="hidden sm:inline">Booked:</span>
            <strong className="text-white font-black">{stats.booked}</strong>
          </div>

          {/* Red (Sold) */}
          <div className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="hidden sm:inline">Sold:</span>
            <strong className="text-white font-black">{stats.sold}</strong>
          </div>

          {/* View Live Public Map in New Tab */}
          <Link
            to="/projects/alekya/map"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold transition-colors text-xs"
            title="View Live Public Map"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F58220]" />
            <span>Public View</span>
          </Link>

          {/* Back to Website */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold transition-colors text-xs"
            title="Return to Main Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>

          {/* Prominent Admin Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 border border-red-500/40 transition-all font-bold text-xs cursor-pointer shadow-xs"
            title="Logout from Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* 2. FLOATING MAP CONTROLS TOOLBAR (Right Side) */}
      <div className="absolute top-16 right-4 z-20 flex flex-col items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-800 flex flex-col gap-1.5">
          {/* Zoom In */}
          <button
            type="button"
            onClick={() => handleZoom(0.15)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer font-bold text-base"
            title="Zoom In"
          >
            +
          </button>

          {/* Zoom Level Indicator */}
          <span className="text-[9px] font-mono text-center text-slate-400 py-0.5">
            {Math.round(zoomLevel * 100)}%
          </span>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => handleZoom(-0.15)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer font-bold text-base"
            title="Zoom Out"
          >
            &minus;
          </button>

          {/* Reset Zoom & Pan */}
          <button
            type="button"
            onClick={handleResetView}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-[#F58220] hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Map Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sync API */}
          <button
            type="button"
            onClick={() => refreshFromApi()}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sync with REST API"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: THE LIVE INTERACTIVE LAYOUT (MAP VIEW REMOVED) */}
      <main 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
          className="transition-transform duration-75 select-none py-6 px-4"
        >
          {/* Authentic CHALLAMPALLY / SKANDHA GRAND VALLEY DTCP Masterplan */}
          <ChallampallyMasterplan
            plotLookup={plotLookup}
            onSelectPlot={(p) => handlePlotClick(p)}
            selectedPlotId={selectedPlot?.id || selectedPlot?.number}
          />
        </div>

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-3 left-4 z-20 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-lg flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Green: Available
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 font-bold text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Blue: Booked
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="flex items-center gap-1.5 font-bold text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Red: Sold
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400">Drag to Pan &bull; Click any plot to edit</span>
        </div>
      </main>

      {/* =========================================================================
          4. ADMIN PLOT BOOKING & CONFIRMATION MODAL
          Opens when clicking any plot directly on the map
         ========================================================================= */}
      {selectedPlot && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-black text-white text-base shadow ${
                  modalAction === 'book' ? 'bg-[#2563eb]' :
                  modalAction === 'sold' ? 'bg-[#ef4444]' : 'bg-[#10b981]'
                }`}>
                  <span className="text-[10px] leading-none opacity-80">PLOT</span>
                  <span className="text-lg leading-none">#{selectedPlot.number}</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Plot #{selectedPlot.number} &bull; {selectedPlot.sqYards} Sq.Yds
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedPlot.facing} Facing &bull; Currently <strong className="uppercase text-white">{selectedPlot.status}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlot(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccessMsg ? (
              <div className="my-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span className="font-bold">{actionSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 my-4">
                
                {/* 3 Status Choice Buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Choose Target Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setModalAction('book')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                        modalAction === 'book' 
                          ? 'bg-[#2563eb] text-white border-blue-400 shadow-md ring-2 ring-blue-500/50' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <span>🔵 Booked</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalAction('sold')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                        modalAction === 'sold' 
                          ? 'bg-[#ef4444] text-white border-red-400 shadow-md ring-2 ring-red-500/50' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span>🔴 Sold Deed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalAction('release')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                        modalAction === 'release' 
                          ? 'bg-[#10b981] text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/50' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>🟢 Available</span>
                    </button>
                  </div>
                </div>

                {modalAction !== 'release' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Buyer / Customer Name
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Ramesh Reddy"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-[#F58220] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Buyer Email / Reference
                        </label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. buyer@example.com"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-[#F58220] outline-none"
                        />
                      </div>
                    </div>

                    {modalAction === 'book' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Token Advance Amount
                        </label>
                        <input
                          type="text"
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          placeholder="e.g. ₹50,000 / ₹1,00,000"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-[#F58220] outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Registration Deed Number
                        </label>
                        <input
                          type="text"
                          value={deedNumber}
                          onChange={(e) => setDeedNumber(e.target.value)}
                          placeholder="e.g. REG-874291"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-[#F58220] outline-none"
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Admin Confirmation Notes
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter notes regarding token confirmation, plot hold, or deed..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-[#F58220] outline-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPlot(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalAction === 'book' ? 'bg-[#2563eb] hover:bg-[#1d4ed8]' :
                      modalAction === 'sold' ? 'bg-[#ef4444] hover:bg-[#dc2626]' :
                      'bg-[#10b981] hover:bg-[#059669]'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {modalAction === 'book' ? 'Confirm Booking (Turn Blue)' :
                       modalAction === 'sold' ? 'Confirm Sale (Turn Red)' :
                       'Release Plot (Turn Green)'}
                    </span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
