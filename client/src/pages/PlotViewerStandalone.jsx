import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Box,
  Layers,
  Search,
  Maximize2,
  Minimize2,
  Ruler,
  Car,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  X,
  Info,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  Share2,
  Navigation,
  ChevronDown,
  Building,
  Trees,
  Droplets,
  Lightbulb,
  Award,
  Calculator,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  Check,
  Plus,
  Minus,
  Eye,
  Sliders,
  ArrowUpRight,
  TrendingUp,
  Phone,
  Send,
  Bot,
  Mail,
  Calendar,
  User,
  CheckCircle,
  FileText,
  Play,
  Pause
} from 'lucide-react';
import { fetchPlots, fetchPlotStats, trackActivityEvent, submitLead } from '../api/client';
import { getEnrichedPlots, LAYOUT_BOUNDS, statusColors } from '../visualizer/masterPlanData';
import Layout3DView, { WALK_ROADS } from '../visualizer/Layout3DView';
import Layout2DView from '../visualizer/Layout2DView';
import EnquiryModal from '../components/EnquiryModal';

// Authoritative Location Highlights matching Plots99 structure
const locationHighlights = [
  { icon: '🚗', text: 'Direct Frontage on Srisailam National Highway (NH 765)' },
  { icon: '🛕', text: '1 min to Sri Maisigandi Maisamma Temple, Kadthal' },
  { icon: '🌐', text: 'Inside the Regional Ring Road (RRR) Kadthal Junction Corridor (10 mins)' },
  { icon: '🏭', text: '15 mins to Hyderabad Pharma City, Mucherla Future City & AI City' },
  { icon: '🚀', text: '20 mins to Kandukur, FAB City & Maheshwaram Aerospace Park' },
  { icon: '🛣️', text: '25 mins to Outer Ring Road (ORR Exit 14 Tukkuguda)' },
  { icon: '✈️', text: '32 mins to Rajiv Gandhi International Airport (RGIA) Shamshabad' },
  { icon: '🎢', text: '26 mins to Wonderla Amusement Park' },
  { icon: '🏫', text: 'Surrounded by top international schools, colleges & multispeciality hospitals' },
  { icon: '📈', text: 'Fastest appreciating growth corridor in South Hyderabad' }
];

// Authoritative Project Highlights matching Plots99 structure
const projectHighlights = [
  { icon: '📜', text: 'DTCP Sanctioned Layout (TLP NO. 87/2024/H) & TS RERA Registered (PO2400009081)' },
  { icon: '✍️', text: 'Immediate Spot Registration with 100% Clear Title Guarantee' },
  { icon: '✅', text: '100% Vasthu Compliant layout with East, West and Corner plots' },
  { icon: '🏛️', text: 'Magnificent Grand Entrance Arch with 24/7 Security Gatehouse' },
  { icon: '💧', text: 'Overhead Water Storage Tank & dedicated 24/7 water distribution lines' },
  { icon: '🛣️', text: "60' Arterial Highway Approach with 33' Blacktop Internal Boulevards" },
  { icon: '🕳️', text: 'Concealed Underground Drainage & Storm-Water Sewerage System' },
  { icon: '💡', text: 'Electricity lines with designer LED street illumination' },
  { icon: '🌳', text: 'Ac. 0.758 Landscaped Central Park with walking tracks & gazebos' },
  { icon: '🌲', text: 'Lush Avenue Plantation on both sides of internal roads' },
  { icon: '🚧', text: 'Comprehensive boundary fencing securing the entire layout' },
  { icon: '🚌', text: 'Effortless access to public transport & TSRTC bus stations' },
  { icon: '🍃', text: '100% Pollution-Free, peaceful serene green environment' }
];

// 15 Master Layout Amenities matching Plots99
const layoutAmenities = [
  { title: 'DTCP & RERA Approved', desc: 'TLP No. 87/2024/H & PO2400009081 sanctioned layout', icon: ShieldCheck },
  { title: '60ft & 33ft BT Roads', desc: 'Heavy-duty blacktop boulevards with kerb stones', icon: Navigation },
  { title: '24/7 Gated Security', desc: 'Round-the-clock security cabin & boom barrier', icon: ShieldCheck },
  { title: 'Grand Entrance Arch', desc: 'Imposing architectural arch welcoming residents', icon: Building },
  { title: 'Overhead Water Tank', desc: 'High-capacity storage tank with pipeline to every plot', icon: Droplets },
  { title: 'Underground Drainage', desc: 'Concealed sewage network with eco-friendly outlets', icon: Layers },
  { title: 'LED Street Lighting', desc: 'Energy-efficient illumination with designer poles', icon: Lightbulb },
  { title: 'Underground Power Cables', desc: 'Concealed electrical lines with dedicated transformers', icon: Award },
  { title: 'Ac. 0.758 Central Park', desc: 'Lush park with jogging tracks, lawn & gazebo', icon: Trees },
  { title: "Children's Play Area", desc: 'Safe playground equipment and recreational sandpits', icon: Sparkles },
  { title: 'Perimeter Walking Track', desc: 'Paved walking paths for senior citizens & walkers', icon: Navigation },
  { title: 'Avenue Plantation', desc: 'Flowering avenue trees along every internal road', icon: Trees },
  { title: 'Layout Compound Wall', desc: 'Heavy-duty perimeter security fencing', icon: ShieldCheck },
  { title: '100% Vasthu Layout', desc: 'Scientifically planned orientation for peace & prosperity', icon: Compass },
  { title: 'Bank Loan Sanction', desc: 'Pre-approved home loans from SBI, HDFC & ICICI', icon: Award }
];

// Curated Nearby Landmarks matching Plots99 Screenshot 5
const nearbyLandmarks = [
  {
    name: 'Maisigandi Maisamma Temple',
    category: 'SPIRITUAL LANDMARK',
    distance: '0.8 km',
    time: '1 min',
    icon: Sparkles,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    name: 'Srisailam Highway (NH 765)',
    category: 'NATIONAL HIGHWAY',
    distance: 'Direct Frontage',
    time: '0 min',
    icon: Navigation,
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    name: 'Upcoming Mucherla Future City & AI City',
    category: 'ECONOMIC HUB',
    distance: '14.2 km',
    time: '12m 30s',
    icon: Building,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    name: 'Hyderabad Pharma City & Life Sciences SEZ',
    category: 'INDUSTRIAL CORRIDOR',
    distance: '18.5 km',
    time: '15m 45s',
    icon: Building,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    name: 'Regional Ring Road (RRR) Kadthal Junction',
    category: 'EXPRESSWAY',
    distance: '12.4 km',
    time: '10m 20s',
    icon: Navigation,
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    name: 'Kandukur & Maheshwaram Aerospace Park',
    category: 'TECH & DEFENCE',
    distance: '24.1 km',
    time: '20m 10s',
    icon: Building,
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  },
  {
    name: 'RVM Institute of Medical Sciences & Hospital',
    category: 'HEALTHCARE',
    distance: '21.8 km',
    time: '18m 40s',
    icon: Droplets,
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    name: 'Bhashyam Blooms International School',
    category: 'EDUCATION',
    distance: '16.2 km',
    time: '14m 15s',
    icon: Award,
    badgeColor: 'bg-orange-50 text-orange-800 border-orange-200'
  },
  {
    name: 'Rajiv Gandhi International Airport (RGIA)',
    category: 'INTERNATIONAL AIRPORT',
    distance: '38.5 km',
    time: '32m 00s',
    icon: Navigation,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  {
    name: 'Wonderla Amusement Park',
    category: 'RECREATION',
    distance: '31.2 km',
    time: '26m 30s',
    icon: Sparkles,
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  },
  {
    name: 'Foxconn Manufacturing & Kongara Kalan Hub',
    category: 'ELECTRONICS SEZ',
    distance: '26.7 km',
    time: '22m 45s',
    icon: Building,
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200'
  },
  {
    name: 'Outer Ring Road (ORR) Exit 14 Tukkuguda',
    category: 'HIGHWAY INTERCHANGE',
    distance: '34.0 km',
    time: '28m 15s',
    icon: Navigation,
    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200'
  }
];

export default function PlotViewerStandalone({ settings }) {
  const [viewMode, setViewMode] = useState('3d');
  const [plots, setPlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [facingFilter, setFacingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Selected Plot & Modals
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const handleExecuteSearch = (query) => {
    const clean = (query !== undefined ? query : searchTerm).trim();
    if (!clean) {
      setSearchNotFound(false);
      return;
    }

    // Try exact plot number match first (e.g. "24")
    let found = plots.find(p => String(p.plotNumber) === clean);
    // If not exact match, look for numeric digits in string (e.g. user typed "plot 24" or "#24")
    if (!found) {
      const digits = clean.replace(/\D/g, '');
      if (digits) {
        found = plots.find(p => String(p.plotNumber) === digits);
      }
    }
    // If still not match, try partial match
    if (!found) {
      found = plots.find(p => String(p.plotNumber).includes(clean));
    }

    if (found) {
      setSearchNotFound(false);
      handleSelectPlot({ ...found });
      // In 3D mode, ensure camera is in overview/topDown so it smoothly flies directly to the plot
      if (viewMode === '3d' && (cameraPreset === 'parkGround' || cameraPreset === 'park')) {
        setCameraPreset('overview');
      }
    } else {
      setSearchNotFound(true);
      setTimeout(() => setSearchNotFound(false), 3500);
    }
  };
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      role: 'assistant',
      text: "Namaste! I am your Alekhya's Brundavan AI Assistant. How can I help you regarding plot availability, Vasthu facings, DTCP/RERA approvals, or Srisailam Highway connectivity today?"
    }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const handleAskAIPrompt = (promptText) => {
    let reply = "";
    const lower = promptText.toLowerCase();

    if (lower.includes('east') || lower.includes('facing')) {
      reply = "Alekhya's Brundavan offers premium East-facing plots (e.g. Plots 2, 3, 4, 5, 23, 24, 25, 91, 92, 93, 94, 95) with sizes ranging from 194 to 295 sq.yds. All plots are 100% Vasthu compliant with 33' blacktop road access.";
    } else if (lower.includes('dtcp') || lower.includes('rera') || lower.includes('approval') || lower.includes('legal')) {
      reply = "Alekhya's Brundavan is fully sanctioned by DTCP (Sanction Order: TLP NO. 87/2024/H) and registered with TS RERA (Reg No: PO2400009081). The venture provides 100% clear title ownership with instant spot registration and bank loan tie-ups with SBI, HDFC, and ICICI.";
    } else if (lower.includes('distance') || lower.includes('temple') || lower.includes('airport') || lower.includes('rgia')) {
      reply = "Key connectivity from Alekhya's Brundavan (Kadthal):\n• Maisigandi Maisamma Temple: 0.8 km (1 min)\n• Srisailam Highway (NH 765): Direct Frontage (0 min)\n• Regional Ring Road (RRR) Kadthal Junction: 12.4 km (10 mins)\n• Hyderabad Pharma City SEZ: 18.5 km (15 mins)\n• Rajiv Gandhi International Airport (RGIA): 38.5 km (32 mins)";
    } else if (lower.includes('size') || lower.includes('dimension') || lower.includes('area') || lower.includes('road')) {
      reply = "Plot sizes range from 183 to 672 sq.yards (1,647 to 6,048 sq.ft) with standard dimensions such as 55' x 30' and 55' x 33'. The layout features a 60' wide main approach road, 33' wide internal blacktop boulevards, and an Ac. 0.758 landscaped central park.";
    } else {
      reply = "Alekhya's Brundavan by Skandha Group is a prime 96-plot gated community situated directly on Srisailam Highway in Kadthal. Would you like to schedule a site visit or enquire about specific plot numbers? Click 'Enquire Plot' or message us directly on WhatsApp!";
    }

    setAiChatMessages(prev => [
      ...prev,
      { role: 'user', text: promptText },
      { role: 'assistant', text: reply }
    ]);
  };

  const handleSendAIMessage = (e) => {
    e?.preventDefault();
    if (!aiInputText.trim()) return;
    const q = aiInputText.trim();
    setAiInputText('');
    handleAskAIPrompt(q);
  };

  // Tools & State
  const [cameraPreset, setCameraPreset] = useState('overview');
  const [animateVehicles, setAnimateVehicles] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMeasureMode, setIsMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [walkRoadIndex, setWalkRoadIndex] = useState(0);
  const [walkProgress, setWalkProgress] = useState(0.1);
  const [isAutoWalking, setIsAutoWalking] = useState(false);

  // Dynamic facing distribution calculation for Property Insights (Photo 3)
  const facingCounts = React.useMemo(() => {
    const counts = { N: 0, NE: 0, E: 0, SE: 0, S: 0, SW: 0, W: 0, NW: 0 };
    plots.forEach(p => {
      const f = (p.facing || '').toLowerCase();
      if (f.includes('north-east') || f.includes('northeast')) counts.NE++;
      else if (f.includes('north-west') || f.includes('northwest')) counts.NW++;
      else if (f.includes('south-east') || f.includes('southeast')) counts.SE++;
      else if (f.includes('south-west') || f.includes('southwest')) counts.SW++;
      else if (f.includes('north')) counts.N++;
      else if (f.includes('south')) counts.S++;
      else if (f.includes('west')) counts.W++;
      else counts.E++;
    });
    return counts;
  }, [plots]);

  // Inventory breakdown percentages for Property Insights Pie Chart (Photo 3)
  const inventoryBreakdown = React.useMemo(() => {
    const total = plots.length || 96;
    const avail = plots.filter(p => p.status === 'available').length || 81;
    const sold = plots.filter(p => p.status === 'sold').length || 8;
    const res = plots.filter(p => p.status === 'reserved').length || 7;
    return {
      total,
      available: avail,
      sold,
      reserved: res,
      availPct: Math.round((avail / total) * 100),
      soldPct: Math.round((sold / total) * 100),
      resPct: Math.round((res / total) * 100)
    };
  }, [plots]);

  // Interactive Plot Sizer Form (NO hardcoded costs mentioned directly!)
  const [calcPlotArea, setCalcPlotArea] = useState(202);
  const [calcFacingPref, setCalcFacingPref] = useState('East');
  const [calcVillaType, setCalcVillaType] = useState('Duplex');

  const containerRef = useRef(null);
  const mapSectionRef = useRef(null);
  const layout2DRef = useRef(null);

  useEffect(() => {
    trackActivityEvent('layout_opened', null, { viewMode, standalone: true });
    loadLayoutData();
  }, []);

  const loadLayoutData = async () => {
    setLoading(true);
    try {
      const [plotsRes, statsRes] = await Promise.all([
        fetchPlots({ all: 'true' }),
        fetchPlotStats()
      ]);

      let loadedPlots = [];
      if (plotsRes.success && plotsRes.plots) {
        loadedPlots = getEnrichedPlots(plotsRes.plots);
      } else {
        loadedPlots = getEnrichedPlots();
      }
      setPlots(loadedPlots);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      // Check URL query parameter for shared plot (User requirement: "each plot is sharable")
      const searchParams = new URLSearchParams(window.location.search);
      const targetPlotNum = searchParams.get('plot');
      if (targetPlotNum) {
        const found = loadedPlots.find(p => String(p.plotNumber) === String(targetPlotNum));
        if (found) {
          setSelectedPlot(found);
        }
      }
    } catch (err) {
      console.warn('Backend plots fetch failed, using authoritative master plan:', err);
      const fallbackPlots = getEnrichedPlots();
      setPlots(fallbackPlots);

      const searchParams = new URLSearchParams(window.location.search);
      const targetPlotNum = searchParams.get('plot');
      if (targetPlotNum) {
        const found = fallbackPlots.find(p => String(p.plotNumber) === String(targetPlotNum));
        if (found) {
          setSelectedPlot(found);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlot = (plot) => {
    setSelectedPlot(plot);
    if (plot && plot.plotNumber) {
      trackActivityEvent('plot_viewed', plot.plotNumber, {
        status: plot.status,
        facing: plot.facing
      });
    }
  };

  const handleShareCurrentPlot = (plot) => {
    const target = plot || selectedPlot;
    if (!target) return;
    const shareUrl = `${window.location.origin}/plots?plot=${target.plotNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `Alekhya's Brundavan - Plot #${target.plotNumber}`,
        text: `Inspect Plot #${target.plotNumber} (${target.areaSqYds} sq.yds, ${target.facing} facing) in Alekhya's Brundavan at Kadthal.`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleViewModeToggle = (mode) => {
    setViewMode(mode);
    trackActivityEvent('view_mode_toggled', null, { viewMode: mode });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const handleMeasurePoint = (pt) => {
    setMeasurePoints(prev => {
      if (prev.length >= 2) return [pt];
      return [...prev, pt];
    });
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter(prev => prev === status ? 'all' : status);
  };

  // Auto-walk smooth loop
  useEffect(() => {
    if (!isAutoWalking || cameraPreset !== 'roadWalk' || viewMode !== '3d') return;
    const interval = setInterval(() => {
      setWalkProgress((prev) => {
        const next = prev + 0.004;
        return next >= 1 ? 0 : next;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isAutoWalking, cameraPreset, viewMode]);

  const handleToggleRoadView = () => {
    if (viewMode !== '3d') setViewMode('3d');
    if (cameraPreset === 'roadWalk') {
      setCameraPreset('overview');
      setIsAutoWalking(false);
    } else {
      setCameraPreset('roadWalk');
      setWalkProgress(0.1);
    }
  };

  const handleRoadClick = (road) => {
    if (viewMode !== '3d') setViewMode('3d');
    const roadIdx = (WALK_ROADS || []).findIndex(
      r => r.id === road.id || r.name?.toLowerCase().includes(road.name?.toLowerCase())
    );
    setWalkRoadIndex(roadIdx >= 0 ? roadIdx : 0);
    setWalkProgress(0.12);
    setCameraPreset('roadWalk');
  };

  const handleWalkStep = (step) => {
    setWalkProgress(prev => Math.max(0, Math.min(1, prev + step)));
  };

  // Click on park drops camera into park ground walk
  const handleParkClick = () => {
    if (viewMode !== '3d') setViewMode('3d');
    setCameraPreset(prev => prev === 'park' ? 'overview' : 'park');
  };

  const handleToggleParkView = () => {
    if (viewMode !== '3d') setViewMode('3d');
    setCameraPreset(prev => prev === 'park' ? 'overview' : 'park');
  };

  // Insights Tab Switcher (matching Plots99 Features & Additional Info)
  const [insightsTab, setInsightsTab] = useState('location');

  // Contact & Site Visit Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    facing: 'Any Facing',
    visitDate: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isScrolledPastMap, setIsScrolledPastMap] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastMap(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Section Scrolling
  const scrollToSection = (id) => {
    const aliasMap = {
      info: 'sec-info',
      insights: 'sec-insights',
      stats: 'sec-stats',
      nearby: 'sec-landmarks',
      contact: 'sec-contact',
      approvals: 'sec-approvals',
      overview: 'sec-overview'
    };
    const targetId = aliasMap[id] || id;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.phone.trim()) return;
    setContactSubmitting(true);
    try {
      await submitLead({
        name: contactForm.name || 'Site Visit Guest',
        phone: contactForm.phone,
        email: contactForm.email || undefined,
        plotNumber: selectedPlot?.plotNumber ? Number(selectedPlot.plotNumber) : undefined,
        message: `Inquiry from Master Plan Viewer. Preferred Facing: ${contactForm.facing}. Preferred Date: ${contactForm.visitDate || 'Flexible'}. Notes: ${contactForm.message || 'Booked guided site visit'}`
      });
      setContactSuccess(true);
      setContactForm({
        name: '',
        phone: '',
        email: '',
        facing: 'Any Facing',
        visitDate: '',
        message: ''
      });
      setTimeout(() => setContactSuccess(false), 6000);
    } catch (err) {
      console.error('Failed to submit contact enquiry:', err);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen justify-between bg-slate-100 font-sans text-slate-800">
      <div id="main" className="grow">
        {/* ========================================================== */}
        {/* 1. TOP INTERACTIVE MASTER PLAN MAP (FIXED 75VH)            */}
        {/* ========================================================== */}
        <div
          ref={mapSectionRef}
          className="fixed top-0 left-0 w-full z-0 overflow-hidden h-[75vh] select-none bg-[#E5ECE3]"
        >
        {/* Floating Top Header (Branding & Search) */}
        <header className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-xl pointer-events-auto flex items-center gap-3.5">
            <a href="/" className="flex items-center gap-2 group" title="Return to Skandha Group main website">
              <img
                src="/assets/skandha_logo.svg"
                alt="Skandha Group"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>

            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base text-slate-900 leading-tight">
                  Alekhya's Brundavan
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-50 text-brand-orange border border-orange-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Master Plan
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                DTCP: TLP NO. 87/2024/H &bull; TS RERA: PO2400009081 &bull; Kadthal
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/90 shadow-xl pointer-events-auto flex items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteSearch();
              }}
              className="relative flex items-center"
            >
              <div className="relative w-44 sm:w-60">
                <button
                  type="submit"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                  title="Search plot"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerm(val);
                    const clean = val.trim();
                    if (!clean) {
                      setSearchNotFound(false);
                      return;
                    }
                    const digits = clean.replace(/\D/g, '');
                    let found = plots.find(p => String(p.plotNumber) === clean || (digits && String(p.plotNumber) === digits));
                    if (!found && clean.length >= 1) {
                      found = plots.find(p => String(p.plotNumber).includes(clean));
                    }
                    if (found) {
                      setSearchNotFound(false);
                      handleSelectPlot({ ...found });
                      if (viewMode === '3d' && (cameraPreset === 'parkGround' || cameraPreset === 'park')) {
                        setCameraPreset('overview');
                      }
                    }
                  }}
                  className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-semibold text-slate-900"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedPlot(null);
                      setSearchNotFound(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {searchNotFound && (
                <div className="absolute top-10 left-0 bg-red-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl animate-fadeIn whitespace-nowrap z-50">
                  Plot not found (Plots 1 to 96 available)
                </div>
              )}
            </form>
          </div>
        </header>

        {/* Top-Left Zoom Controls & Compass Rose (Plots99 Exact Match) */}
        <div className={`absolute top-20 left-4 z-30 flex flex-col gap-2.5 pointer-events-auto transition-opacity duration-300 ${
          isScrolledPastMap ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          {/* Vertical OpenLayers-style Zoom Pill (matching Plots99 .ol-zoom) */}
          <div className="bg-white/85 backdrop-blur-md rounded-full border border-slate-200/80 shadow-lg flex flex-col items-center overflow-hidden">
            <button
              onClick={() => {
                if (viewMode === '2d') {
                  layout2DRef.current?.zoomIn();
                } else {
                  if (cameraPreset === 'overview') setCameraPreset('topDown');
                  else if (cameraPreset === 'topDown') setCameraPreset('park');
                }
              }}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-slate-100/70 transition-colors"
              title="Zoom In (+)"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="w-5 h-px bg-slate-200/80" />
            <button
              onClick={() => {
                if (viewMode === '2d') {
                  layout2DRef.current?.zoomOut();
                } else {
                  setCameraPreset('overview');
                }
              }}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:bg-slate-100/70 transition-colors"
              title="Zoom Out (−)"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Compass Needle (matching Plots99 top-left compass) */}
          <button
            onClick={() => {
              if (viewMode === '2d') {
                layout2DRef.current?.reset();
              } else {
                setCameraPreset('overview');
              }
            }}
            className="w-10 h-10 bg-white/85 backdrop-blur-md rounded-full border border-slate-200/80 shadow-lg flex items-center justify-center group hover:bg-white transition-all"
            title="Reset to True North (Overview)"
          >
            <Compass className="w-5 h-5 text-emerald-600 group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>

        {/* Floating Right Circular Toolbar */}
        <aside className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 pointer-events-auto transition-opacity duration-300 ${
          isScrolledPastMap ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          {/* 3D Map View (Regional Kadthal & Highway Location from Brochure / PDF) */}
          <button
            onClick={() => {
              if (viewMode === '2d') {
                layout2DRef.current?.reset();
              } else {
                setCameraPreset(prev => prev === 'mapView' ? 'overview' : 'mapView');
              }
            }}
            className={`w-10 h-10 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
              cameraPreset === 'mapView'
                ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400/50'
                : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-emerald-700 border-slate-200/90 hover:bg-white'
            }`}
            title="3D Geographic Map View (Kadthal & Srisailam Highway Regional Location from Brochure)"
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Park View (Flowering Lawn, Cycad Palm Shrubs & Perimeter Palms) */}
          <button
            onClick={handleToggleParkView}
            className={`w-10 h-10 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
              cameraPreset === 'park' || cameraPreset === 'parkGround'
                ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400/50'
                : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-emerald-700 border-slate-200/90 hover:bg-white'
            }`}
            title="Park View (Ac. 0.758 Central Park Flowering Lawn & Cycad Shrubs)"
          >
            <Trees className="w-4 h-4" />
          </button>

          {/* Top-Down Orthographic */}
          <button
            onClick={() => setCameraPreset(cameraPreset === 'topDown' ? 'overview' : 'topDown')}
            className={`w-10 h-10 rounded-full shadow-lg border transition-all duration-200 hover:scale-110 flex items-center justify-center ${
              cameraPreset === 'topDown'
                ? 'bg-slate-900 text-white border-slate-950'
                : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-brand-orange border-slate-200/90 hover:bg-white'
            }`}
            title="Top-Down Overhead View"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 text-slate-700 hover:text-brand-orange hover:bg-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </aside>

        {/* Floating 3D Map View Indicator Banner (when MapPin is active) */}
        {cameraPreset === 'mapView' && viewMode === '3d' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md text-white rounded-full border border-slate-700/80 shadow-2xl px-4 py-2 flex items-center gap-3 animate-fadeIn pointer-events-auto">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🗺️ Regional Map View: Alekhya's Brundavan, Kadthal (NH-765)</span>
            </div>
            <button
              onClick={() => setCameraPreset('overview')}
              className="px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-[11px] font-semibold text-white transition-all shadow-sm"
            >
              Reset to 3D Layout
            </button>
          </div>
        )}

        {/* Map Canvas (3D or 2D) */}
        <div className="w-full h-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-[#DFEFE0]">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs font-semibold text-slate-700">Loading master plan...</div>
              </div>
            </div>
          ) : viewMode === '3d' ? (
            <Layout3DView
              plots={plots}
              selectedPlot={selectedPlot}
              onSelectPlot={handleSelectPlot}
              cameraPreset={cameraPreset}
              searchTerm={searchTerm}
              filterStatus={statusFilter}
              filterFacing={facingFilter}
              walkRoadIndex={walkRoadIndex}
              walkProgress={walkProgress}
              onWalkProgressChange={setWalkProgress}
              animateVehicles={animateVehicles}
              isMeasureMode={isMeasureMode}
              measurePoints={measurePoints}
              onMeasurePoint={handleMeasurePoint}
              onRoadClick={handleRoadClick}
              onParkClick={handleParkClick}
            />
          ) : (
            <Layout2DView
              ref={layout2DRef}
              plots={plots}
              selectedPlot={selectedPlot}
              onSelectPlot={handleSelectPlot}
              filterStatus={statusFilter}
              filterFacing={facingFilter}
              searchTerm={searchTerm}
              animateVehicles={animateVehicles}
            />
          )}
        </div>

        {/* Floating Upper-Right Quick Plot Card (Exact Match to Screenshot 1 & 3) */}
        {selectedPlot && selectedPlot.plotNumber && (
          <div className="absolute top-16 right-3 sm:right-6 z-30 w-72 sm:w-84 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 sm:p-5 animate-fadeIn pointer-events-auto">
            {/* Top Header matching Screenshot 1 & 3 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedPlot.status === 'sold'
                    ? 'bg-[#F89898]'
                    : selectedPlot.status === 'reserved'
                    ? 'bg-[#FBE38E]'
                    : 'bg-[#68D391]'
                }`} />
                <span className="font-bold text-slate-900 text-base">
                  {selectedPlot.plotNumber}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedPlot.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedPlot(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key-Value Details matching Screenshot 1 & 3 */}
            <div className="py-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Facing</span>
                <strong className="text-slate-900 font-bold">{selectedPlot.facing}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Area</span>
                <strong className="text-slate-900 font-bold">{selectedPlot.areaSqYds}.00 yd²</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Dimensions</span>
                <strong className="text-slate-900 font-bold">{selectedPlot.dimensions}</strong>
              </div>
            </div>

            {/* 4 Action Buttons matching Screenshot 1 & 3 */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-800 font-semibold text-center border border-emerald-200 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>RFA Score 96%</span>
              </div>
              <button
                onClick={() => handleShareCurrentPlot(selectedPlot)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedShare ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <a
                href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-orange" />
                <span>Directions</span>
              </a>
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="p-2 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-[11px] text-white font-bold text-center transition-colors shadow-xs"
              >
                Enquire Plot
              </button>
            </div>
          </div>
        )}


        {/* Floating 3D Map View Indicator Banner (when MapPin is clicked) */}
        {cameraPreset === 'mapView' && viewMode === '3d' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md text-white rounded-full border border-slate-700/80 shadow-2xl px-4 py-2 flex items-center gap-3 animate-fadeIn pointer-events-auto">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3D Geographic Map View &bull; Kadthal &bull; Srisailam Highway (NH 765) Corridor</span>
            </div>
            <button
              onClick={() => setCameraPreset('overview')}
              className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 px-2.5 py-0.5 rounded-full hover:bg-slate-700 transition-colors"
            >
              Exit Map View
            </button>
          </div>
        )}

        {/* Floating Park View Controller (USER REQUIREMENT matching Screenshot 3 & 4) */}
        {(cameraPreset === 'park' || cameraPreset === 'parkGround') && viewMode === '3d' && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-3.5 space-y-2 pointer-events-auto animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">
                  Ac. 0.758 Central Park &bull; Ground-Level Lawn Walk
                </span>
              </div>
              <button
                onClick={() => setCameraPreset('overview')}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-bold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Exit Park View
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Flowering lawn &bull; Cycad palm shrubs &bull; Perimeter palms</span>
              <span className="text-emerald-700 font-bold">Drag to explore</span>
            </div>
          </div>
        )}

        {/* Bottom Left Floating Legend (Plots99 Exact Structure - Vertical) */}
        <div className={`absolute bottom-4 left-4 z-30 pointer-events-auto transition-opacity duration-300 ${
          isScrolledPastMap ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200/90 shadow-2xl">
            <div className="flex flex-col gap-1.5 text-xs font-bold">
              {/* SOLD */}
              <button
                onClick={() => toggleStatusFilter('sold')}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  statusFilter === 'sold'
                    ? 'ring-2 ring-red-400 bg-red-50/90 shadow-xs'
                    : 'hover:bg-slate-50'
                }`}
                title="Filter Sold plots (click again to clear)"
              >
                <span className="w-7 h-6 rounded-md bg-[#F89898] text-[#7F1D1D] text-[11px] font-black flex items-center justify-center shadow-2xs">
                  {stats?.sold || 8}
                </span>
                <span className="text-[11px] font-bold tracking-wider text-slate-700">
                  SOLD
                </span>
              </button>

              {/* RESERVED */}
              <button
                onClick={() => toggleStatusFilter('reserved')}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  statusFilter === 'reserved'
                    ? 'ring-2 ring-amber-400 bg-amber-50/90 shadow-xs'
                    : 'hover:bg-slate-50'
                }`}
                title="Filter Reserved plots (click again to clear)"
              >
                <span className="w-7 h-6 rounded-md bg-[#FBE38E] text-[#78350F] text-[11px] font-black flex items-center justify-center shadow-2xs">
                  {stats?.reserved || 7}
                </span>
                <span className="text-[11px] font-bold tracking-wider text-slate-700">
                  RESERVED
                </span>
              </button>

              {/* AVAILABLE */}
              <button
                onClick={() => toggleStatusFilter('available')}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  statusFilter === 'available'
                    ? 'ring-2 ring-emerald-400 bg-emerald-50/90 shadow-xs'
                    : 'hover:bg-slate-50'
                }`}
                title="Filter Available plots (click again to clear)"
              >
                <span className="w-7 h-6 rounded-md bg-[#9BD89E] text-[#064E3B] text-[11px] font-black flex items-center justify-center shadow-2xs">
                  {stats?.available || 81}
                </span>
                <span className="text-[11px] font-bold tracking-wider text-slate-700">
                  AVAILABLE
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Right Map Attribution (Single Clean Text) */}
        <div className={`absolute bottom-4 right-28 z-20 pointer-events-auto hidden md:block select-none transition-opacity duration-300 ${
          isScrolledPastMap ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="text-[10px] text-slate-500 font-sans tracking-wide">
            &copy; Google Maps &bull; Kadthal, Srisailam Highway (NH-765)
          </div>
        </div>

        {/* Bottom Right 2D/3D Pill */}
        <div className={`absolute bottom-4 right-4 z-30 pointer-events-auto transition-opacity duration-300 ${
          isScrolledPastMap ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/90 shadow-2xl flex items-center gap-1">
            <button
              onClick={() => handleViewModeToggle('2d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === '2d'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => handleViewModeToggle('3d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. SLIDING BOTTOM CONTAINER SHEET (STARTING AT mt-[75vh])   */}
      {/* ========================================================== */}
      <div
        className="container-main relative z-10 bg-white/95 backdrop-blur-xs rounded-t-[28px] sm:rounded-t-[36px] md:rounded-t-[40px] shadow-[0_-12px_40px_rgba(0,0,0,0.18)] border-t border-slate-200/40 max-w-full overflow-x-hidden mt-[75vh]"
        style={{ width: '100%', borderTopColor: '#329e4d' }}
      >
          {/* Sticky Navigation Bar matching Plots99 */}
          <div className="sticky top-0 z-20 backdrop-blur-md bg-white/90 border-b border-slate-200/50 px-3 sm:px-6 py-2 sm:py-2.5 transition-all shadow-xs rounded-t-[28px] sm:rounded-t-[36px] md:rounded-t-[40px]">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              <nav className="flex items-center gap-1 sm:gap-1.5 shrink-0" aria-label="Page Navigation">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="h-8 px-2.5 rounded-full text-xs font-semibold gap-1.5 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-all inline-flex items-center"
                  title="Interactive Map"
                >
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline font-bold">Alekhya's Brundavan</span>
                </button>
                <div className="h-4 w-px bg-slate-300 mx-0.5" />
                <button
                  onClick={() => scrollToSection('sec-info')}
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-medium gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all inline-flex items-center"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Overview</span>
                </button>
                <button
                  onClick={() => scrollToSection('sec-insights')}
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-medium gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all inline-flex items-center"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Insights</span>
                </button>
                <button
                  onClick={() => scrollToSection('sec-stats')}
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-medium gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all inline-flex items-center"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stats</span>
                </button>
                <button
                  onClick={() => scrollToSection('sec-landmarks')}
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-medium gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all inline-flex items-center"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nearby</span>
                </button>
                <button
                  onClick={() => scrollToSection('sec-contact')}
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-medium gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all inline-flex items-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Contact</span>
                </button>
              </nav>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold gap-1.5 border border-slate-300/80 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-2xs inline-flex items-center text-slate-700"
                  type="button"
                  title="Ask AI Assistant"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=17.0985,78.5085"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold gap-1.5 border border-slate-300/80 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-2xs inline-flex items-center text-slate-700"
                  title="Get Directions to Venture"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Directions</span>
                </a>
                <button
                  onClick={() => handleShareCurrentPlot(selectedPlot || plots[0])}
                  className="h-8 px-2.5 sm:px-3 rounded-full text-xs font-semibold gap-1.5 border border-slate-300/80 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-2xs inline-flex items-center text-slate-700"
                  type="button"
                  title="Share Venture"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sheet Content: Info & Overview */}
          <section id="sec-info" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-8 md:space-y-12">
            {/* Top Brand & Title Info Block (exact Plots99 match) */}
            <div className="scroll-mt-24 space-y-5">
              <div className="flex items-start gap-3.5 sm:gap-5 md:items-center md:justify-between">
                <div className="shrink-0">
                  <div className="block p-2 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all group">
                    <img
                      alt="Skandha Group"
                      src="/assets/skandha_logo.svg"
                      className="object-contain h-12 w-12 sm:h-16 sm:w-16 md:h-18 md:w-auto max-w-[85px] sm:max-w-[140px] md:max-w-[190px] transition-transform group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2 grow min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="w-fit shrink-0 justify-center overflow-hidden whitespace-nowrap border transition-[color,box-shadow] rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 font-semibold text-[11px] sm:text-xs bg-emerald-600/10 text-emerald-700 border-emerald-600/20 flex items-center gap-1 sm:gap-1.5">
                      <Layers className="w-3 h-3 text-emerald-600" />
                      <span>Plotted Development</span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-brand-orange border border-orange-200">
                      DTCP &amp; TS RERA Approved
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                    Alekhya's Brundavan
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-500">
                    <a
                      href="https://maps.google.com/?q=Maisigandi+Temple+Kadthal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-emerald-700 transition-colors text-left"
                      title="View on Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Kadthal, Srisailam Highway, Telangana</span>
                    </a>
                    <span className="opacity-40">•</span>
                    <a
                      href="/"
                      className="group inline-flex items-center gap-1 font-medium uppercase tracking-wider text-slate-500 hover:text-emerald-700 transition-colors text-[11px] sm:text-xs"
                    >
                      <span>By Skandha Group</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Card */}
            <div id="sec-overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                    Project Overview
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    By <strong>Skandha Group</strong>. A DTCP-approved, 100% Vasthu-compliant residential plotted layout adjoining Srisailam Highway, situated 1 minute from Maisigandi Temple and minutes from the upcoming Mucherla Future City &amp; Hyderabad Pharma City.
                  </p>
                </div>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow transition-all shrink-0"
                >
                  <span>Enquire Plot Availability</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Spec Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500">Total Plotted Units</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">96 Plots</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">Available for Booking</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500">Plot Sizes Range</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">183 - 672</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Sq. Yards (1,647 - 6,048 Sq.Ft)</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500">Statutory Clearances</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">DTCP &amp; TS RERA</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">TLP NO. 87/2024/H</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500">Open Space Park</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">Ac. 0.758</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">Landscaped Children's Park</div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* 2. VENTURE INSIGHTS & HIGHLIGHTS (PLOTS99 EXACT MATCH)    */}
          {/* ========================================================== */}
          <section id="sec-insights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" />
                    <span>Venture Intelligence</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    Project &amp; Location Insights
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Explore authoritative location connectivity, engineering infrastructure, master amenities, and orientation analysis.
                  </p>
                </div>
              </div>

              {/* Interactive Tabs matching Plots99 */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'location', label: 'Location Highlights', icon: MapPin },
                  { id: 'project', label: 'Project Highlights', icon: Building },
                  { id: 'amenities', label: 'Master Amenities (15)', icon: Sparkles },
                  { id: 'vasthu', label: 'Vasthu & Facings Radar', icon: Compass }
                ].map((tab) => {
                  const IconC = tab.icon;
                  const isActive = insightsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setInsightsTab(tab.id)}
                      className={`h-9 px-3.5 sm:px-4 rounded-xl text-xs font-semibold gap-2 border transition-all inline-flex items-center whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200/90 hover:border-emerald-600 hover:text-emerald-700'
                      }`}
                    >
                      <IconC className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Location Highlights */}
              {insightsTab === 'location' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                        Strategic Connectivity &amp; Regional Growth Corridors
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        High-speed arterial access along Srisailam Highway (NH 765) and future growth zones.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
                      10 Growth Hubs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {locationHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-start gap-3 group"
                      >
                        <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                          {item.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Project Highlights */}
              {insightsTab === 'project' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                        Master Plan Infrastructure &amp; Statutory Approvals
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        DTCP TLP NO. 87/2024/H &amp; TS RERA PO2400009081 certified specifications.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
                      13 Key Features
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {projectHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-start gap-3 group"
                      >
                        <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                          {item.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Amenities Grid (15 Amenities) */}
              {insightsTab === 'amenities' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                        Master Layout Amenities &amp; Community Infrastructure
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        15 high-standard civil, green, and safety amenities for comfortable villa living.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
                      15 Amenities
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {layoutAmenities.map((item, idx) => {
                      const IconA = item.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-start gap-3.5 group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                            <IconA className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Vasthu & Cardinal Orientation Radar */}
              {insightsTab === 'vasthu' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 animate-fadeIn">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                      100% Vasthu Compliant Cardinal Orientation
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Units planned according to classical Vasthu principles ensuring optimal sunlight, airflow, and positive prosperity.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3 Core Property Insights Analytics Cards (Always Visible in Insights) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {/* Card 1: Facing Distribution (Photo 3) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    <Compass className="w-3.5 h-3.5" />
                    <span>ANALYSIS</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mt-1">Facing Distribution</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Units oriented across cardinal directions</p>
                </div>

                {/* 8-Point Cardinal Compass Radar (Photo 3) */}
                <div className="relative w-56 h-56 mx-auto my-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-slate-200" />
                  <div className="absolute inset-8 rounded-full border border-dashed border-slate-200" />
                  <div className="absolute inset-16 rounded-full border border-slate-200/70" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500" />

                  {/* Dashed axes */}
                  <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-200" />
                  <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 border-l border-dashed border-slate-200" />

                  {/* North */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400">N</span>
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mt-0.5">
                      {facingCounts.N || 8}
                    </span>
                  </div>

                  {/* North-East */}
                  <div className="absolute top-6 right-6 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400">NE</span>
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mt-0.5">
                      {facingCounts.NE || 6}
                    </span>
                  </div>

                  {/* East */}
                  <div className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-1">
                    <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs">
                      {facingCounts.E || 44}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">E</span>
                  </div>

                  {/* South-East */}
                  <div className="absolute bottom-6 right-6 flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mb-0.5">
                      {facingCounts.SE || 4}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">SE</span>
                  </div>

                  {/* South */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mb-0.5">
                      {facingCounts.S || 6}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">S</span>
                  </div>

                  {/* South-West */}
                  <div className="absolute bottom-6 left-6 flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mb-0.5">
                      {facingCounts.SW || 4}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">SW</span>
                  </div>

                  {/* West */}
                  <div className="absolute top-1/2 left-1 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400">W</span>
                    <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs">
                      {facingCounts.W || 38}
                    </span>
                  </div>

                  {/* North-West */}
                  <div className="absolute top-6 left-6 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400">NW</span>
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-2xs mt-0.5">
                      {facingCounts.NW || 6}
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50/60 py-2 rounded-xl border border-emerald-100">
                  +12 Multi-Facing &amp; Corner Units
                </div>
              </div>

              {/* Card 2: Inventory Status (Photo 3) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    <Layers className="w-3.5 h-3.5" />
                    <span>STOCK</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mt-1">Inventory Status</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Visual breakdown of unit availability</p>
                </div>

                {/* Pie / Donut Chart */}
                <div className="w-44 h-44 mx-auto my-6 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#68D391"
                      strokeWidth="24"
                      strokeDasharray={`${inventoryBreakdown.availPct * 2.38} 238`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#FC8181"
                      strokeWidth="24"
                      strokeDasharray={`${inventoryBreakdown.soldPct * 2.38} 238`}
                      strokeDashoffset={`-${inventoryBreakdown.availPct * 2.38}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#F6E05E"
                      strokeWidth="24"
                      strokeDasharray={`${inventoryBreakdown.resPct * 2.38} 238`}
                      strokeDashoffset={`-${(inventoryBreakdown.availPct + inventoryBreakdown.soldPct) * 2.38}`}
                    />
                  </svg>
                </div>

                {/* Legend below matching Photo 3 */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#68D391]" />
                    <span>Available {inventoryBreakdown.availPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#FC8181]" />
                    <span>Sold {inventoryBreakdown.soldPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#F6E05E]" />
                    <span>Reserved {inventoryBreakdown.resPct}%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Project Scale (Photo 3) */}
              <div className="bg-[#044E46] text-white p-7 rounded-3xl flex flex-col justify-between shadow-lg">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Project Scale
                  </div>
                  <div className="mt-5">
                    <div className="text-xs text-emerald-200">Total Units</div>
                    <div className="text-5xl font-extrabold mt-1">96</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-emerald-600/50 my-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">Total Area</div>
                    <div className="text-xl font-bold mt-1">24,200.00 yd²</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">In Acres</div>
                    <div className="text-xl font-bold mt-1">10.50 ac</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Kadthal, Srisailam Highway</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* 3. VENTURE STATS & VILLA SIZER CONFIGURATION (PLOTS99)     */}
          {/* ========================================================== */}
          <section id="sec-stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Villa Footprint Planner</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
                    Custom Villa Configuration &amp; Bank Assistance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Select your preferred plot size, facing direction, and villa layout to receive official legal documentation and pre-approved bank loan options.
                  </p>
                </div>
                <div className="text-right hidden md:block">
                  <span className="text-xs text-slate-400">Direct Developer Terms</span>
                  <div className="text-base font-bold text-emerald-400">Pre-Approved Bank Loans</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Sliders Form */}
                <div className="space-y-5 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-300">Target Plot Size:</span>
                      <span className="text-amber-400 font-bold">{calcPlotArea} Sq.Yds (≈ {calcPlotArea * 9} Sq.Ft)</span>
                    </div>
                    <input
                      type="range"
                      min="183"
                      max="400"
                      step="19"
                      value={calcPlotArea}
                      onChange={(e) => setCalcPlotArea(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>183 Sq.Yds (Standard)</span>
                      <span>202 Sq.Yds</span>
                      <span>264 Sq.Yds</span>
                      <span>400 Sq.Yds (Corner)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Preferred Facing Orientation:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['East', 'West', 'North-East'].map((face) => (
                        <button
                          key={face}
                          type="button"
                          onClick={() => setCalcFacingPref(face)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            calcFacingPref === face
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {face} Facing
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Planned Villa Construction:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Duplex Villa', 'Triplex Luxury', 'Custom Estate'].map((vType) => (
                        <button
                          key={vType}
                          type="button"
                          onClick={() => setCalcVillaType(vType)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                            calcVillaType === vType
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {vType}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Configured Summary */}
                <div className="bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/15 space-y-6">
                  <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
                    <div>
                      <div className="text-xs text-slate-300">Configured Footprint</div>
                      <div className="text-xl font-bold text-white mt-1">
                        {calcPlotArea} Sq.Yds
                      </div>
                      <div className="text-[11px] text-amber-400 mt-0.5 font-medium">
                        {calcFacingPref} Facing &bull; 100% Vasthu
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-300">Bank Loan Eligibility</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">
                        Up to 75%
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        SBI, HDFC, ICICI Approved
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Official Developer Terms
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Spot Registration with Clear Title Guarantee
                    </div>
                    <div className="text-[11px] text-slate-300 leading-tight">
                      Transparent terms direct from Skandha Group. Official rate cards and payment schedules provided upon consultation.
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-lg"
                  >
                    Request Official Pricing Breakdown &amp; Loan Details
                  </button>
                </div>
              </div>
            </div>

            {/* Statutory Clearances */}
            <div id="sec-approvals" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Legal Certainty</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                DTCP Approved &amp; TS RERA Registered
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Clear title ownership with instant spot registration. Pre-approved for housing and plotted development bank loans.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    DTCP Sanction Order
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    TLP NO. 87/2024/H
                  </div>
                  <p className="text-xs text-slate-600">
                    Directorate of Town and Country Planning official sanctioned layout approval.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    TS RERA Registration
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    PO2400009081
                  </div>
                  <p className="text-xs text-slate-600">
                    Telangana Real Estate Regulatory Authority registered project compliance.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Title &amp; Bank Clearances
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    100% Clear Title
                  </div>
                  <p className="text-xs text-slate-600">
                    Direct spot registration with loan sanction options across SBI, HDFC, and ICICI.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* 4. NEARBY LANDMARKS & CONNECTIVITY (MATCHING SCREENSHOT 5) */}
          {/* ========================================================== */}
          <section id="sec-landmarks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>Strategic Location</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    Nearby Landmarks &amp; Connectivity
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Key locations, drive times, and growth infrastructure surrounding Alekhya's Brundavan at Kadthal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyLandmarks.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.category}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-brand-orange transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Navigation className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.distance}</span>
                          </span>
                          <span className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.time}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* 5. CONTACT & SITE VISIT SCHEDULER (PLOTS99 EXACT MATCH)    */}
          {/* ========================================================== */}
          <section id="sec-contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <Phone className="w-4 h-4" />
                    <span>Developer Desk</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    Connect with Our Project Desk
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    Schedule an on-site visit to Alekhya's Brundavan at Kadthal, receive certified DTCP/RERA documents, or request custom rate cards.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+919100031199"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Sales Desk</span>
                  </a>
                  <a
                    href="https://wa.me/919100031199?text=Hi%2C%20I%20am%20interested%20in%20visiting%20Alekhya%27s%20Brundavan%20plots%20at%20Kadthal."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Office & Site Details */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Developer Information
                    </div>
                    <div className="font-serif text-lg font-bold text-slate-900">
                      Skandha Group
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Trusted real estate developer pioneering premium plotted developments, farm communities, and gated townships across Telangana.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Site Location</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Kadthal, Srisailam Highway (NH 765)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        1 min from Maisigandi Temple
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Corporate Office</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Hyderabad, Telangana, India
                      </div>
                      <div className="text-[11px] text-slate-500">
                        info@skandhagroup.com
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Site Desk Hours: Mon - Sun (9:00 AM - 7:00 PM)</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                      Open 7 Days
                    </span>
                  </div>
                </div>

                {/* Right Column: Site Visit & Plot Inquiry Form */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Book a Free Guided Site Visit
                    </h4>
                    {selectedPlot && (
                      <span className="text-[11px] font-bold bg-orange-50 text-brand-orange border border-orange-200 px-2.5 py-0.5 rounded-full">
                        Plot #{selectedPlot.plotNumber} Selected
                      </span>
                    )}
                  </div>

                  {contactSuccess ? (
                    <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Site Visit Request Received!</span>
                      </div>
                      <p className="text-xs text-emerald-700 leading-relaxed">
                        Thank you! Our dedicated site coordinator from Skandha Group will contact you promptly to confirm your visit and provide route assistance.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Your Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Ramesh Reddy"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Preferred Facing
                          </label>
                          <select
                            value={contactForm.facing}
                            onChange={(e) => setContactForm({ ...contactForm, facing: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                          >
                            <option value="Any Facing">Any Facing</option>
                            <option value="East">East Facing (Vasthu)</option>
                            <option value="West">West Facing (Vasthu)</option>
                            <option value="North-East">North-East Facing</option>
                            <option value="Corner">Corner Plot</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Preferred Visit Date
                          </label>
                          <input
                            type="date"
                            value={contactForm.visitDate}
                            onChange={(e) => setContactForm({ ...contactForm, visitDate: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Notes / Requirements (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Interested in 200 sq.yds East plot, need pickup assistance"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={contactSubmitting || !contactForm.phone.trim()}
                        className="w-full py-3 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-50 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                      >
                        {contactSubmitting ? (
                          <span>Submitting Request...</span>
                        ) : (
                          <>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Confirm Site Visit &amp; Request Rate Card</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>



      {/* ========================================================== */}
      {/* 6. SIGNATURE DARK FOOTER (PLOTS99 EXACT MATCH)             */}
      {/* ========================================================== */}
      <footer className="relative overflow-hidden bg-slate-950 text-slate-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        {/* Radial Glow Spheres matching Plots99 */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Col 1: Developer Branding */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/skandha_logo_white.svg"
                  alt="Skandha Group"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-white">Alekhya's Brundavan</strong> is a landmark DTCP-approved gated community residential layout by <strong>Skandha Group</strong>, strategically poised on Srisailam Highway (NH 765), Kadthal.
              </p>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div><span className="text-slate-300 font-semibold">DTCP Sanction:</span> TLP NO. 87/2024/H</div>
                <div><span className="text-slate-300 font-semibold">TS RERA Reg:</span> PO2400009081</div>
                <div><span className="text-slate-300 font-semibold">Location:</span> Kadthal, Ranga Reddy Dist, Telangana</div>
              </div>
            </div>

            {/* Col 2: Layout & Planning */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Layout Specifications</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('sec-overview')}>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>96 Premium Plotted Units</span>
                </li>
                <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('sec-overview')}>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>60' Wide Arterial Highway Approach</span>
                </li>
                <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('sec-overview')}>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>33' Blacktop Internal Boulevards</span>
                </li>
                <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('sec-overview')}>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Ac. 0.758 Landscaped Central Park</span>
                </li>
                <li className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('sec-stats')}>
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>100% Vasthu Compliant East &amp; West Plots</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Strategic Growth Corridors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Regional Growth Hubs</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-orange" />
                  <span>Maisigandi Maisamma Temple (1 min)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-orange" />
                  <span>RRR Kadthal Interchange (10 mins)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-orange" />
                  <span>Pharma City &amp; Mucherla Future City (15 mins)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-orange" />
                  <span>RGIA Airport Shamshabad (32 mins)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-orange" />
                  <span>ORR Exit 14 Tukkuguda (25 mins)</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Corporate Office & Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact &amp; Site Visits</h4>
              <p className="text-xs text-slate-400">
                Direct builder bookings with guaranteed spot registration and bank loan assistance.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <a
                  href="tel:+919100031199"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+91 91000 31199 / Site Desk</span>
                </a>
                <a
                  href="https://wa.me/919100031199?text=Hi%2C%20I%20am%20interested%20in%20Alekhya%27s%20Brundavan%20plots%20at%20Kadthal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Legal Compliance & Disclaimer matching Plots99 */}
          <div className="pt-8 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-3 leading-relaxed">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-400">
              <div className="flex flex-wrap items-center gap-4">
                <span>&copy; {new Date().getFullYear()} Skandha Group. All Rights Reserved.</span>
                <span className="opacity-40">•</span>
                <a href="/" className="hover:text-slate-300 transition-colors">Main Portal</a>
                <span className="opacity-40">•</span>
                <a href="/project" className="hover:text-slate-300 transition-colors">Project Specifications</a>
                <span className="opacity-40">•</span>
                <a href="https://rerait.telangana.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">TS RERA Registry</a>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>DTCP Approved &bull; RERA Certified</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
                Legal Disclaimer
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                It is the sole responsibility of customers, owners, and marketing individuals to ensure a comprehensive review of plot dimensions and other details related to the plot and venture before proceeding. We act solely as a facilitator and are not liable for any disputes. The interactive 2D and 3D layout maps, road visualizations, plot boundaries, and metric estimates displayed on this platform represent the sanctioned DTCP master plan (TLP NO. 87/2024/H). Visual simulations are artistic impressions created for spatial orientation.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Close container-main */}
      </div>

      {/* ========================================================== */}
      {/* FLOATING AI ASSISTANT TRIGGER BUTTON (PLOTS99 EXACT MATCH) */}
      {/* ========================================================== */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full text-white font-semibold text-xs shadow-2xl transition-all duration-300 hover:scale-105 group"
        style={{
          background: 'linear-gradient(135deg, #329e4d 0%, #16a34a 50%, #6366f1 100%)',
          boxShadow: '0 8px 30px rgba(50, 158, 77, 0.45)'
        }}
        title="Chat with AI Venture Assistant"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
        </div>
        <span className="tracking-wide">Ask AI Assistant</span>
      </button>

      {/* ========================================================== */}
      {/* AI ASSISTANT MODAL DIALOG                                  */}
      {/* ========================================================== */}
      {isAIAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Alekhya's Brundavan AI</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium">
                    Skandha Group Real Estate &amp; Master Plan Intelligence
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAIAssistantOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Close AI Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Questions Chips */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
              {[
                'Available East plots',
                'DTCP & RERA Approvals',
                'Distance from Temple & RGIA',
                'Plot sizes & dimensions',
                'Schedule site visit'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleAskAIPrompt(chip)}
                  className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-[11px] font-semibold border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all shrink-0 whitespace-nowrap shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Stream */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1 max-h-[380px] bg-slate-50/50">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendAIMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about plot availability, vasthu, approvals..."
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!aiInputText.trim()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Direct WhatsApp Callout Footer */}
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
              <span className="font-medium">Prefer direct human assistance?</span>
              <a
                href="https://wa.me/919100000000?text=Hi%2C%20I%20am%20interested%20in%20Alekhya%27s%20Brundavan%20plots."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Sales Desk</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        prefilledPlot={selectedPlot}
      />

      {/* Close id="main" */}
      </div>

    {/* Close containerRef */}
    </div>
  );
}
