import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Trash2,
  MessageSquare,
  X,
  Send,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import {
  adminGetLeads,
  adminUpdateLeadStatus,
  adminAddLeadNote,
  adminDeleteLead,
  adminExportLeadsCsv
} from '../../api/client';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected lead for notes modal
  const [activeLead, setActiveLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadLeads();
  }, [page, search, statusFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await adminGetLeads({
        page,
        limit: 15,
        search,
        status: statusFilter
      });
      if (res.success) {
        setLeads(res.leads);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await adminUpdateLeadStatus(leadId, newStatus);
      if (res.success) {
        setLeads(leads.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
        if (activeLead && activeLead._id === leadId) {
          setActiveLead({ ...activeLead, status: newStatus });
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !activeLead) return;

    try {
      const res = await adminAddLeadNote(activeLead._id, newNote);
      if (res.success && res.lead) {
        setActiveLead(res.lead);
        setLeads(leads.map(l => l._id === res.lead._id ? res.lead : l));
        setNewNote('');
        setFeedback('Note added successfully.');
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await adminDeleteLead(deleteTarget._id);
      if (res.success) {
        setDeleteTarget(null);
        if (activeLead && activeLead._id === deleteTarget._id) setActiveLead(null);
        loadLeads();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-orange-100 text-brand-orange border-orange-200';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qualified': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'spam': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Customer Leads CRM
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified enquiries submitted through website and plot availability drawer.
          </p>
        </div>

        <button
          onClick={() => adminExportLeadsCsv()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Leads (CSV)</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
            <option value="new">New Enquiries</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified Buyers</option>
            <option value="closed">Closed Deal</option>
            <option value="spam">Marked Spam</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Leads: <strong>{total}</strong>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-5 py-3.5">Customer Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone / Method</th>
                <th className="px-5 py-3.5">Plot Inquired</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">No customer enquiries found.</td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {lead.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">{lead.email}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">{lead.phone || '—'}</div>
                      <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                        {lead.preferredContactMethod === 'whatsapp' ? (
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Mail className="w-3 h-3 text-brand-orange" />
                        )}
                        <span>{lead.preferredContactMethod}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {lead.plotNumber ? (
                        <span className="font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          Plot #{lead.plotNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">General</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer capitalize ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                        <option value="spam">Spam</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveLead(lead)}
                          title="Notes & Follow-up"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-brand-orange"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(lead)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Page {page} of {Math.ceil(total / 15) || 1}</div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              disabled={page * 15 >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Follow-up Notes & Details Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Lead Details: {activeLead.name}
                </h3>
                <p className="text-xs text-slate-500">{activeLead.email} &bull; {activeLead.phone || 'No phone'}</p>
              </div>
              <button onClick={() => setActiveLead(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
                {feedback}
              </div>
            )}

            {/* Inquired Plot & Message */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
              {activeLead.plotNumber && (
                <div>
                  <span className="text-slate-500">Target Plot:</span>{' '}
                  <strong className="text-brand-orange">Plot #{activeLead.plotNumber}</strong>
                </div>
              )}
              {activeLead.message && (
                <div>
                  <span className="text-slate-500">Customer Message:</span>
                  <p className="mt-0.5 italic text-slate-900 font-sans">{activeLead.message}</p>
                </div>
              )}
            </div>

            {/* Notes Thread */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Internal Follow-up Notes
              </h4>
              {(!activeLead.followUpNotes || activeLead.followUpNotes.length === 0) ? (
                <div className="text-xs text-slate-400 italic py-4 text-center">
                  No internal notes recorded yet. Add the first follow-up note below.
                </div>
              ) : (
                activeLead.followUpNotes.map((note, i) => (
                  <div key={i} className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs space-y-1">
                    <p className="text-slate-800">{note.text}</p>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>By: {note.author}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                required
                placeholder="Add follow-up note (e.g. called, agreed for Sunday site visit)..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Delete Lead Record</h3>
            <p className="text-xs text-slate-600">
              Permanently delete enquiry from <strong>{deleteTarget.name}</strong> ({deleteTarget.email}) under privacy and data retention policy?
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
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
