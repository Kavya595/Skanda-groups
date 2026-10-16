import React, { useState, useEffect } from 'react';
import { adminGetAnalyticsSummary, adminExportWebsiteVisitsCsv } from '../../api/client';
import { Activity, Eye, Compass, Layers, Send, Search, Filter, Download } from 'lucide-react';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetAnalyticsSummary()
      .then(res => res.success && setData(res.summary))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'layout_opened': return <Compass className="w-3.5 h-3.5 text-blue-500" />;
      case 'view_mode_toggled': return <Layers className="w-3.5 h-3.5 text-indigo-500" />;
      case 'plot_viewed': return <Eye className="w-3.5 h-3.5 text-emerald-500" />;
      case 'enquiry_submitted': return <Send className="w-3.5 h-3.5 text-brand-orange" />;
      case 'search_performed': return <Search className="w-3.5 h-3.5 text-amber-500" />;
      case 'filter_applied': return <Filter className="w-3.5 h-3.5 text-purple-500" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Visitor Analytics &amp; Activity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Anonymous layout engagement metrics, plot click streams, and traffic trends.
          </p>
        </div>

        <button
          onClick={() => adminExportWebsiteVisitsCsv()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          title="Download complete website visits and activity report"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Visits Report (CSV)</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Events by Type Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data?.eventsByType?.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 capitalize">
                  {getEventIcon(item._id)}
                  <span>{item._id.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">{item.count}</div>
              </div>
            ))}
          </div>

          {/* Top Plots & Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top 10 Viewed Plots */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Top 10 Most Inquired / Viewed Plots
              </h3>
              {(!data?.topPlots || data.topPlots.length === 0) ? (
                <div className="text-xs text-slate-400 py-6 text-center">No plot clicks yet.</div>
              ) : (
                <div className="space-y-2">
                  {data.topPlots.map((plot, i) => (
                    <div key={plot._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-brand-orange font-bold text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="font-bold text-xs text-slate-900">Plot #{plot._id}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                        {plot.views} views
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent 50 Events Stream */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Live Visitor Activity Stream (Recent 50)
              </h3>
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
                {(!data?.recentEvents || data.recentEvents.length === 0) ? (
                  <div className="text-xs text-slate-400 py-6 text-center">No recent events logged.</div>
                ) : (
                  data.recentEvents.map((ev) => (
                    <div key={ev._id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-slate-100">
                          {getEventIcon(ev.eventType)}
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 capitalize">
                            {ev.eventType.replace(/_/g, ' ')}
                          </span>
                          {ev.plotNumber && (
                            <span className="ml-2 font-semibold text-brand-orange">
                              Plot #{ev.plotNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-slate-400 text-[10px] shrink-0">
                        {new Date(ev.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
