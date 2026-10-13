import React, { useState, useEffect } from 'react';
import { fetchGallery } from '../api/client';
import Lightbox from '../components/Lightbox';
import { Image as ImageIcon, Sparkles, Calendar, Maximize2 } from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';

const DEFAULT_GALLERY_PHOTOS = [
  {
    _id: 'photo-1',
    title: 'Grand Entrance Arch & Security Cabin',
    category: 'infrastructure',
    imageUrl: '/assets/site_entrance_arch.jpg',
    caption: 'Official secured gated entry arch with 24/7 security cabin and peripheral fencing.'
  },
  {
    _id: 'photo-2',
    title: 'Ac. 0.758 Landscaped Central Park',
    category: 'amenities',
    imageUrl: '/assets/site_landscape_park.jpg',
    caption: 'Dedicated green parkland enclave with lawn turf, flowering shade trees, and walking trails.'
  },
  {
    _id: 'photo-3',
    title: "40' & 33' Wide Blacktop Asphalt Roads",
    category: 'infrastructure',
    imageUrl: '/assets/site_bt_roads.jpg',
    caption: 'Interconnected internal blacktop avenues bordered by concrete curbs and pedestrian pavers.'
  },
  {
    _id: 'photo-4',
    title: 'Overhead Potable Water Reservoir',
    category: 'infrastructure',
    imageUrl: '/assets/site_overhead_tank.jpg',
    caption: 'High-capacity storage tank guaranteeing round-the-clock water pressure to all 96 villa plots.'
  },
  {
    _id: 'photo-5',
    title: 'Avenue Trees & Green Curbsides',
    category: 'amenities',
    imageUrl: '/assets/site_avenue_plantation.jpg',
    caption: 'Ecological avenue plantation lining all internal roadways for natural shade and beauty.'
  },
  {
    _id: 'photo-6',
    title: "Children's Play Area & Jogging Trail",
    category: 'amenities',
    imageUrl: '/assets/site_children_park.jpg',
    caption: 'Family recreation zone equipped with modern play fixtures and morning fitness trails.'
  },
  {
    _id: 'photo-7',
    title: 'Underground Sanitary Drainage Network',
    category: 'infrastructure',
    imageUrl: '/assets/site_drainage_system.jpg',
    caption: 'Subsurface drainage network engineered to ensure swift rainwater run-off and sanitary hygiene.'
  },
  {
    _id: 'photo-8',
    title: 'Historic Maisigandi Temple',
    category: 'development',
    imageUrl: '/assets/maisigandi_temple.jpg',
    caption: 'Renowned spiritual landmark situated just 1 minute drive from Alekhya’s Brundavan layout.'
  },
  {
    _id: 'photo-9',
    title: 'Aerial Layout Perspective & Highway Frontage',
    category: 'development',
    imageUrl: '/assets/site_aerial_view.jpg',
    caption: 'Topographic perspective highlighting adjacency to Srisailam Highway (NH 765) and Kadthal.'
  }
];

export default function GalleryPage() {
  const [items, setItems] = useState(DEFAULT_GALLERY_PHOTOS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    loadGallery();
  }, [selectedCategory]);

  const loadGallery = async () => {
    try {
      const cat = selectedCategory === 'all' ? null : selectedCategory;
      const res = await fetchGallery(cat);
      if (res.success && res.items && res.items.length > 0) {
        setItems(res.items);
      } else {
        // Filter default photos by category
        if (selectedCategory === 'all') {
          setItems(DEFAULT_GALLERY_PHOTOS);
        } else {
          setItems(DEFAULT_GALLERY_PHOTOS.filter(p => p.category === selectedCategory));
        }
      }
    } catch (err) {
      console.warn('Using default gallery:', err);
      if (selectedCategory === 'all') {
        setItems(DEFAULT_GALLERY_PHOTOS);
      } else {
        setItems(DEFAULT_GALLERY_PHOTOS.filter(p => p.category === selectedCategory));
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Photos (9)' },
    { id: 'infrastructure', label: 'Civil Infrastructure & Roads' },
    { id: 'amenities', label: 'Parks, Water & Landscaping' },
    { id: 'development', label: 'Site Surroundings & Aerial' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Luxury Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Real Site Progress &bull; Authentic Brochure Photography
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 leading-tight">
            Alekhya's Brundavan On-Site Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            Examine authentic on-site developmental milestones across internal blacktop avenues, overhead water infrastructure, landscaped open space, and gated entrance security.
          </p>
        </div>

        <button
          onClick={() => setIsEnquiryOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Escorted Site Visit</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-orange text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={item._id || idx}
            onClick={() => setLightboxIndex(idx)}
            className="group cursor-pointer bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-orange-200 overflow-hidden transition-all duration-300 flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <span className="text-xs font-bold text-white bg-brand-orange px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge High-Res Photo</span>
                </span>
              </div>
            </div>

            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  {item.category}
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-lg group-hover:text-brand-orange transition-colors mt-0.5">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        items={items}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : items.length - 1))}
        onNext={() => setLightboxIndex(prev => (prev < items.length - 1 ? prev + 1 : 0))}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
}
