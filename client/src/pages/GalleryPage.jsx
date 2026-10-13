import React, { useState, useEffect } from 'react';
import { fetchGallery } from '../api/client';
import Lightbox from '../components/Lightbox';
import { Image as ImageIcon, Filter } from 'lucide-react';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, [selectedCategory]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === 'all' ? null : selectedCategory;
      const res = await fetchGallery(cat);
      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Gallery loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'infrastructure', label: 'Infrastructure & Roads' },
    { id: 'amenities', label: 'Amenities & Parks' },
    { id: 'development', label: 'Site Development' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Visual Progress
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Site Development Gallery
        </h1>
        <p className="text-sm text-slate-600">
          Real development photographs from Alekhya's Brundavan at Kadthal, featuring completed entrance arch, overhead water tank, blacktop roads, underground drainage, and landscaped open spaces.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-orange text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <div className="text-slate-700 font-bold">No photos found in this category.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={item._id || idx}
              onClick={() => setLightboxIndex(idx)}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-orange-200 overflow-hidden transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-semibold text-white bg-brand-orange/90 px-2.5 py-1 rounded">
                    Click to Enlarge
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                  {item.category}
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-orange transition-colors">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        items={items}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : items.length - 1))}
        onNext={() => setLightboxIndex(prev => (prev < items.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}
