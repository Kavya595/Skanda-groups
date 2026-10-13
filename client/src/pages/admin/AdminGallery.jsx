import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import {
  adminGetGallery,
  adminCreateGalleryItem,
  adminUpdateGalleryItem,
  adminDeleteGalleryItem
} from '../../api/client';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [feedback, setFeedback] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'development',
    imageUrl: '',
    caption: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await adminGetGallery();
      if (res.success) setItems(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        const res = await adminUpdateGalleryItem(editItem._id, formData);
        if (res.success) {
          setFeedback('Gallery photo updated.');
          setEditItem(null);
          loadGallery();
        }
      } else {
        const res = await adminCreateGalleryItem(formData);
        if (res.success) {
          setFeedback('New photo added to gallery.');
          setIsAddOpen(false);
          loadGallery();
        }
      }
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await adminDeleteGalleryItem(deleteTarget._id);
      if (res.success) {
        setDeleteTarget(null);
        loadGallery();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setFormData({
      title: '',
      category: 'development',
      imageUrl: '',
      caption: '',
      order: items.length + 1,
      isActive: true
    });
    setIsAddOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      caption: item.caption || '',
      order: item.order || 0,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Gallery & Media Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public website photo gallery, categorize infrastructure progress, and adjust display orders.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading gallery...</div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-700">No gallery items configured.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-3"
            >
              <div className="h-44 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-brand-orange uppercase">{item.category}</span>
                  <span className="text-slate-400 text-[10px]">Order: {item.order}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 truncate">{item.title}</h4>
                {item.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {item.isActive ? 'Active Publicly' : 'Hidden'}
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-brand-orange"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAddOpen || editItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-serif font-bold text-base text-slate-900">
                {editItem ? 'Edit Gallery Item' : 'Add New Photo'}
              </h3>
              <button
                onClick={() => { setIsAddOpen(false); setEditItem(null); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL / Asset Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/assets/site_entrance_arch.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                  >
                    <option value="development">Development</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="amenities">Amenities</option>
                    <option value="location">Location</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Order Priority</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caption / Subtitle</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-brand-orange"
                />
                <label htmlFor="activeCheck" className="font-bold text-slate-700">
                  Visible on Public Website
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditItem(null); }}
                  className="flex-1 py-2 font-bold border border-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2 rounded-xl transition-colors"
                >
                  Save Photo
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
            <h3 className="font-bold text-slate-900 text-base">Delete Photo</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong>{deleteTarget.title}</strong> from the public gallery?
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
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
