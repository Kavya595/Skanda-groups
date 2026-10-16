import React, { useState, useEffect } from 'react';
import { fetchGallery } from '../api/client';
import Lightbox from '../components/Lightbox';
import { Image as ImageIcon, Sparkles, Calendar, Maximize2 } from 'lucide-react';
import EnquiryModal from '../components/EnquiryModal';

const DEFAULT_GALLERY_PHOTOS = [
  {
    _id: 'photo-brochure-cover',
    title: 'Official Kadthal Venture Publication Cover',
    category: 'development',
    imageUrl: '/assets/hero_cover.jpg',
    caption: 'Locate yourself at the most desirable place — Official Skandha Group gated community brochure and villa plotted layout showcase.'
  },
  {
    _id: 'photo-layout-plan-master',
    title: 'DTCP Sanctioned 96-Plot Master Blueprint',
    category: 'infrastructure',
    imageUrl: '/assets/layout_plan_hd.png',
    caption: 'Official surveyed layout permit TLP NO. 87/2024/H detailing road widths, plot orientations, and central park acreage.'
  },
  {
    _id: 'photo-villa-day',
    title: 'Bespoke Contemporary Villa Architecture',
    category: 'villas',
    imageUrl: '/assets/luxury_villa_day.jpg',
    caption: 'Modern villa living concept with crisp white lines, warm teakwood louvers, light ash-grey travertine stone terrace, and private reflection pool.'
  },
  {
    _id: 'photo-villa-night',
    title: 'Villa Twilight Illumination & Warm Ambiance',
    category: 'lighting',
    imageUrl: '/assets/villa_twilight_lighting.jpg',
    caption: 'Curated evening ambiance featuring warm orange recessed cove lighting, architectural column uplighting, and illuminated private landscape.'
  },
  {
    _id: 'photo-avenue-lighting',
    title: 'Illuminated 40ft Internal Avenue Boulevard',
    category: 'lighting',
    imageUrl: '/assets/avenue_lighting.jpg',
    caption: 'Wide 40-foot blacktop avenue illuminated by designer curved street lamps casting a warm amber glow across smooth asphalt and uplighted palm trees.'
  },
  {
    _id: 'photo-pool-lighting',
    title: 'Resort-Style Evening Pool Pavilion',
    category: 'villas',
    imageUrl: '/assets/pool_lighting.jpg',
    caption: 'Open-air garden cabana and crystal-clear swimming pool with warm golden underwater illumination and light ash-grey travertine sun deck.'
  },
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
    caption: 'Renowned spiritual landmark situated just 1 minute drive from the layout.'
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
        if (selectedCategory === 'all') {
          setItems(DEFAULT_GALLERY_PHOTOS);
        } else {
          setItems(DEFAULT_GALLERY_PHOTOS.filter(p => p.category === selectedCategory));
        }
      }
    } catch {
      if (selectedCategory === 'all') {
        setItems(DEFAULT_GALLERY_PHOTOS);
      } else {
        setItems(DEFAULT_GALLERY_PHOTOS.filter(p => p.category === selectedCategory));
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All Photos (13)' },
    { id: 'villas', label: 'Luxury Villa Concepts' },
    { id: 'lighting', label: 'Evening Lighting & Ambiance' },
    { id: 'infrastructure', label: 'Civil Infrastructure & Roads' },
    { id: 'amenities', label: 'Parks & Water Utilities' },
    { id: 'development', label: 'Surroundings & Aerial' }
  ];

  return (
    <div className="bg-[#000000] text-slate-100 space-y-16 pb-20">
      {/* ========================================================== */}
      {/* 1. HERO SECTION                                            */}
      {/* ========================================================== */}
      <section className="relative bg-gradient-to-b from-[#07090e] via-[#0b0e14] to-[#000000] py-16 sm:py-20 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-brand-orange/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
            <span className="h-px w-8 bg-brand-orange/40" />
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            VISUAL SHOWCASE
            <span className="w-1.5 h-1.5 rounded-sm bg-brand-orange" />
            <span className="h-px w-8 bg-brand-orange/40" />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Site Progress &amp; Architecture Gallery
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Examine bespoke villa architectural concepts, warm twilight ambiance, and authentic on-site developmental progress across wide avenues, landscaped parkland, and security infrastructure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Escorted Site Visit</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* 2. GALLERY CATEGORIES & GRID                               */}
      {/* ========================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'bg-[#121622] text-slate-300 hover:bg-[#181d2c] border border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={item._id || idx}
              onClick={() => setLightboxIndex(idx)}
              className="group cursor-pointer bg-[#0c0f17] rounded-2xl border border-slate-800 shadow-sm hover:shadow-2xl hover:border-brand-orange/40 overflow-hidden transition-all duration-300 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <span className="text-xs font-bold text-white bg-brand-orange px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Enlarge High-Res Photo</span>
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                    {item.category}
                  </div>
                  <h3 className="font-serif font-bold text-white text-lg group-hover:text-brand-orange transition-colors mt-0.5">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-300 leading-relaxed mt-1 font-light">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
