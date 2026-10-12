import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  ListFilter, 
  ExternalLink,
  ShieldCheck, 
  Compass, 
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NextoraLayoutViewer from './NextoraLayoutViewer';
import { usePlotContext } from '../context/PlotContext';

export default function PlotModal({ isOpen, onClose, project }) {
  const { plots, stats } = usePlotContext();
  const [modalMode, setModalMode] = useState('gis'); // 'gis' (Nextora viewer), 'list' (mobile cards)
  const [listSearch, setListSearch] = useState('');
  const [listStatus, setListStatus] = useState('all');

  if (!isOpen) return null;

  // Filtered plots for list view
  const filteredListPlots = plots.filter(p => {
    if (listSearch && !p.number.toString().includes(listSearch.trim())) return false;
    if (listStatus !== 'all' && p.status !== listStatus) return false;
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-1 sm:p-3 md:p-6 flex items-center justify-center animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-7xl w-full h-[95vh] flex flex-col shadow-2xl relative overflow-hidden border border-gray-300">
        
        {/* Modal Header Switcher & Controls */}
        <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#F58220] text-white">
              DTCP: {project?.dtcpNo || 'TLP NO. 87/2024/H'}
            </span>
            <span className="text-sm font-bold text-white hidden sm:inline">
              Interactive Layout & Plot Availability
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Tabs */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalMode('gis')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalMode === 'gis' ? 'bg-[#F58220] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D & 3D Interactive Map</span>
              </button>

              <button
                type="button"
                onClick={() => setModalMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalMode === 'list' ? 'bg-[#F58220] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Mobile List View</span>
              </button>
            </div>

            {/* Direct Link to Dedicated Fullscreen GIS Route */}
            <Link
              to="/projects/alekya/map"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 hover:text-white transition-colors"
              title="Open full-page interactive map in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F58220]" />
              <span>Full Page Map</span>
            </Link>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Area */}
        <div className="flex-1 overflow-hidden relative">
          {modalMode === 'gis' && (
            <NextoraLayoutViewer 
              isFullscreen={false} 
              onClose={onClose} 
              showBackButton={false} 
            />
          )}

          {modalMode === 'list' && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 bg-slate-900 text-white space-y-4 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={listSearch}
                    onChange={(e) => setListSearch(e.target.value)}
                    placeholder="Search plot number (e.g. 24, 45, 90)..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F58220]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={listStatus}
                    onChange={(e) => setListStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#F58220]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available Only (Green)</option>
                    <option value="booked">Booked Only (Blue)</option>
                    <option value="sold">Sold Only (Red)</option>
                  </select>
                </div>
              </div>

              {/* Grid of Plot Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredListPlots.map((plot) => {
                  let statusBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                  let statusPill = 'bg-emerald-500';
                  if (plot.status === 'booked') {
                    statusBg = 'bg-blue-500/20 text-blue-400 border-blue-500/40';
                    statusPill = 'bg-blue-500';
                  } else if (plot.status === 'sold') {
                    statusBg = 'bg-red-500/20 text-red-400 border-red-500/40';
                    statusPill = 'bg-red-500';
                  }

                  return (
                    <div
                      key={plot.id}
                      className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-[#F58220] transition-all text-left flex flex-col justify-between space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-white group-hover:text-[#F58220]">
                          Plot #{plot.number}
                        </span>
                        <span className={`w-2.5 h-2.5 rounded-full ${statusPill}`} />
                      </div>

                      <div className="text-xs text-slate-300">
                        <div className="font-extrabold text-white text-sm">
                          {plot.sqYards} <span className="text-xs font-normal text-slate-400">Sq. Yds</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{plot.dimensions}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{plot.facing} Facing</div>
                      </div>

                      <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${statusBg}`}>
                          {plot.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
