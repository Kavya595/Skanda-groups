import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  adminGetPlots,
  adminCreatePlot,
  adminUpdatePlot,
  adminUpdatePlotStatus,
  adminDeletePlot,
  adminExportPlotsCsv,
  adminImportPlotsCsv
} from '../../api/client';
import { statusColors } from '../../visualizer/layoutData';

export default function AdminPlots() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editPlot, setEditPlot] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    plotNumber: '',
    block: 'A-Top',
    areaSqYds: 183,
    dimensions: "50' x 33'",
    facing: 'East',
    roadWidth: "33'-0\"",
    isCorner: false,
    status: 'available',
    basePricePerSqYd: 12500,
    notes: ''
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    loadPlots();
  }, [page, search, statusFilter]);

  const loadPlots = async () => {
    setLoading(true);
    try {
      const res = await adminGetPlots({
        page,
        limit: 20,
        search,
        status: statusFilter
      });
      if (res.success) {
        setPlots(res.plots);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (plotNumber, newStatus) => {
    try {
      const res = await adminUpdatePlotStatus(plotNumber, newStatus);
      if (res.success) {
        setPlots(plots.map(p => p.plotNumber === plotNumber ? { ...p, status: newStatus } : p));
        setFeedbackMsg(`Plot #${plotNumber} status set to ${newStatus}`);
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch (err) {
      setFeedbackError(err.message);
      setTimeout(() => setFeedbackError(''), 3000);
    }
  };

  const handleSavePlot = async (e) => {
    e.preventDefault();
    setFeedbackError('');

    try {
      if (editPlot) {
        const res = await adminUpdatePlot(editPlot.plotNumber, formData);
        if (res.success) {
          setFeedbackMsg(`Plot #${editPlot.plotNumber} updated successfully.`);
          setEditPlot(null);
          loadPlots();
        }
      } else {
        const res = await adminCreatePlot({
          ...formData,
          plotNumber: Number(formData.plotNumber),
          areaSqYds: Number(formData.areaSqYds)
        });
        if (res.success) {
          setFeedbackMsg(`Plot #${formData.plotNumber} created successfully.`);
          setIsAddOpen(false);
          loadPlots();
        }
      }
    } catch (err) {
      setFeedbackError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await adminDeletePlot(deleteTarget.plotNumber);
      if (res.success) {
        setFeedbackMsg(`Plot #${deleteTarget.plotNumber} deleted.`);
        setDeleteTarget(null);
        loadPlots();
      }
    } catch (err) {
      setFeedbackError(err.message);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    try {
      const parsed = JSON.parse(importJsonText);
      const res = await adminImportPlotsCsv(parsed);
      if (res.success) {
        setFeedbackMsg(res.message);
        setIsImportOpen(false);
        loadPlots();
      }
    } catch (err) {
      setFeedbackError('Invalid JSON format for import. Expected array of plot objects.');
    }
  };

  const openEditModal = (plot) => {
    setEditPlot(plot);
    setFormData({
      plotNumber: plot.plotNumber,
      block: plot.block,
      areaSqYds: plot.areaSqYds,
      dimensions: plot.dimensions,
      facing: plot.facing,
      roadWidth: plot.roadWidth,
      isCorner: plot.isCorner,
      status: plot.status,
      basePricePerSqYd: plot.basePricePerSqYd || 12500,
      notes: plot.notes || ''
    });
  };

  const openAddModal = () => {
    setEditPlot(null);
    setFormData({
      plotNumber: '',
      block: 'A-Top',
      areaSqYds: 183,
      dimensions: "50' x 33'",
      facing: 'East',
      roadWidth: "33'-0\"",
      isCorner: false,
      status: 'available',
      basePricePerSqYd: 12500,
      notes: ''
    });
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Plots Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all 96 DTCP layout plots, dimensions, facings, and availability statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => adminExportPlotsCsv()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plot</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {feedbackError && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{feedbackError}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Plot # or Block..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Total: <strong>{total}</strong> plots
        </div>
      </div>

      {/* Plots Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-5 py-3.5">Plot #</th>
                <th className="px-5 py-3.5">Block</th>
                <th className="px-5 py-3.5">Area (Sq.Yds)</th>
                <th className="px-5 py-3.5">Dimensions</th>
                <th className="px-5 py-3.5">Facing</th>
                <th className="px-5 py-3.5">Corner</th>
                <th className="px-5 py-3.5">Road Width</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">Loading plots inventory...</td>
                </tr>
              ) : plots.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">No plots found matching filters.</td>
                </tr>
              ) : (
                plots.map(plot => {
                  const meta = statusColors[plot.status] || statusColors.available;
                  return (
                    <tr key={plot.plotNumber} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-extrabold text-slate-900">
                        #{plot.plotNumber}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-600">{plot.block}</td>
                      <td className="px-5 py-3 font-bold text-slate-900">
                        {plot.areaSqYds} <span className="text-[10px] text-slate-400 font-normal">Sq.Yds</span>
                      </td>
                      <td className="px-5 py-3 font-mono">{plot.dimensions}</td>
                      <td className="px-5 py-3 font-medium">{plot.facing}</td>
                      <td className="px-5 py-3">
                        {plot.isCorner ? (
                          <span className="font-bold text-brand-orange">Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="px-5 py-3">{plot.roadWidth || "33'-0\""}</td>
                      <td className="px-5 py-3">
                        {/* Quick inline status switcher */}
                        <select
                          value={plot.status}
                          onChange={(e) => handleQuickStatusChange(plot.plotNumber, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${meta.badge}`}
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Sold</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(plot)}
                            title="Edit Plot"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-brand-orange"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(plot)}
                            title="Delete Plot"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Page {page} of {Math.ceil(total / 20) || 1}</div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              disabled={page * 20 >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Plot Modal */}
      {(isAddOpen || editPlot) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {editPlot ? `Edit Plot #${editPlot.plotNumber}` : 'Add New Plot'}
              </h3>
              <button
                onClick={() => { setIsAddOpen(false); setEditPlot(null); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plot Number *</label>
                  <input
                    type="number"
                    required
                    disabled={!!editPlot}
                    value={formData.plotNumber}
                    onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Block / Zone *</label>
                  <input
                    type="text"
                    required
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area (Sq. Yards) *</label>
                  <input
                    type="number"
                    required
                    value={formData.areaSqYds}
                    onChange={(e) => setFormData({ ...formData, areaSqYds: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dimensions *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50' x 33'"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Facing *</label>
                  <select
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East Corner</option>
                    <option value="North-West">North-West Corner</option>
                    <option value="South-East">South-East Corner</option>
                    <option value="South-West">South-West Corner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Road Width</label>
                  <input
                    type="text"
                    value={formData.roadWidth}
                    onChange={(e) => setFormData({ ...formData, roadWidth: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="cornerCheck"
                    checked={formData.isCorner}
                    onChange={(e) => setFormData({ ...formData, isCorner: e.target.checked })}
                    className="rounded text-brand-orange"
                  />
                  <label htmlFor="cornerCheck" className="font-bold text-slate-700">
                    Is Corner Plot
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Admin Comments</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditPlot(null); }}
                  className="flex-1 py-2 font-bold border border-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2 rounded-xl transition-colors"
                >
                  {editPlot ? 'Save Changes' : 'Create Plot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Confirm Plot Deletion</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong>Plot #{deleteTarget.plotNumber}</strong>? This operation will be permanently logged in the audit trail.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 text-xs font-bold border border-slate-300 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-xl"
              >
                Delete Plot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-serif font-bold text-base text-slate-900">
                Bulk Import Plots (JSON)
              </h3>
              <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Paste JSON array containing plot objects (e.g. <code>[{`{"plotNumber":1,"areaSqYds":241,...}`}]</code>). Existing plot numbers will be safely updated without duplicates.
            </p>
            <textarea
              rows="8"
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="[{ ... }]"
              className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsImportOpen(false)}
                className="flex-1 py-2 text-xs font-bold border border-slate-300 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold py-2 rounded-xl"
              >
                Process Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
