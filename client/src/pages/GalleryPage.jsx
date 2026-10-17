import React, { useState, useEffect } from 'react';
import { fetchGallery } from '../api/client';
import Lightbox from '../components/Lightbox';
import { Maximize2, MapPin } from 'lucide-react';

const BRUNDAVANAM_GALLERY_PHOTOS = [
  {
    _id: 'brundavanam-portal',
    title: 'Grand Entrance Portal & 24/7 Security Cabin',
    category: 'Brundavanam',
    imageUrl: '/assets/brundavanam_grand_portal.jpg',
    caption: 'Modern architect-designed entrance portal with dual-lane access, 24/7 security guardhouse, boom barriers, and boundary compound wall.'
  },
  {
    _id: 'brundavanam-layout',
    title: 'Official DTCP Sanctioned Layout Blueprint',
    category: 'Brundavanam',
    imageUrl: '/assets/layout_plan_hd.png',
    caption: 'Sanctioned master layout plan displaying all 96 demarcated plots, internal 40 & 33 B.T. avenues, and Ac. 0.758 central open park.'
  },
  {
    _id: 'brundavanam-boulevard',
    title: 'Wide 40 Ft & 33 Ft Internal Blacktop Boulevards',
    category: 'Brundavanam',
    imageUrl: '/assets/brundavanam_boulevard.jpg',
    caption: 'Heavy-duty blacktop internal road network with concrete paver curbs, designer solar street lighting, and avenue trees.'
  },
  {
    _id: 'brundavanam-park',
    title: 'Ac. 0.758 Landscaped Central Park & Walking Trail',
    category: 'Brundavanam',
    imageUrl: '/assets/brundavanam_recreation_park.jpg',
    caption: 'Reserved open green breathing zone featuring manicured lawn turf, morning fitness track, shaded pergolas, and recreation zones.'
  },
  {
    _id: 'brundavanam-estate-aerial',
    title: 'Aerial Architectural Perspective of Community Estate',
    category: 'Brundavanam',
    imageUrl: '/assets/project_hero_bg.jpg',
    caption: "Bird's-eye architectural perspective showcasing the master-planned gated enclave amidst Kadthal's tranquil green surroundings."
  },
  {
    _id: 'brundavanam-routemap',
    title: 'Strategic Highway Connectivity & Regional Route Map',
    category: 'Brundavanam',
    imageUrl: '/assets/route_map_hd.png',
    caption: 'Direct corridor access along NH 765 Srisailam Highway, connecting seamlessly to Maisigandi Temple, ORR Exit 14, and RGIA Airport.'
  },
  {
    _id: 'brundavanam-site-arch',
    title: 'On-Site Secured Gated Entrance Arch',
    category: 'Brundavanam',
    imageUrl: '/assets/brundavanam_entrance_arch.jpg',
    caption: 'Demarcated venture boundary and entrance archway providing security and privacy for the gated township.'
  },
  {
    _id: 'brundavanam-watertank',
    title: 'Overhead Potable Water Reservoir Network',
    category: 'Brundavanam',
    imageUrl: '/assets/brundavanam_water_tank.jpg',
    caption: 'High-capacity overhead water storage tank delivering round-the-clock water pressure to individual plot boundaries.'
  },
  {
    _id: 'brundavanam-drainage',
    title: 'Underground Sanitary & Stormwater Drainage System',
    category: 'Brundavanam',
    imageUrl: '/assets/site_drainage_system.jpg',
    caption: 'Complete subsurface drainage infrastructure ensuring quick rainwater discharge and immaculate community cleanliness.'
  },
  {
    _id: 'brundavanam-children',
    title: 'Children Recreation Play Park',
    category: 'Brundavanam',
    imageUrl: '/assets/site_children_park.jpg',
    caption: 'Safe, open-air recreational park equipped with play amenities for families and children in a green environment.'
  },
  {
    _id: 'brundavanam-plantation',
    title: 'Avenue Tree Plantations & Green Curbs',
    category: 'Brundavanam',
    imageUrl: '/assets/site_avenue_plantation.jpg',
    caption: 'Eco-friendly green avenue plantation bordering both sides of the 40-foot and 33-foot internal avenues.'
  },
  {
    _id: 'brundavanam-temple',
    title: 'Historic Sri Maisigandi Maisamma Temple',
    category: 'Brundavanam',
    imageUrl: '/assets/brundavanam_maisigandi_temple.jpg',
    caption: 'Venerated landmark and spiritual destination located just 1 minute walking distance adjoining the Brundavanam venture.'
  },
  {
    _id: 'brundavanam-aerial',
    title: 'Topographic Layout Survey & Highway Frontage',
    category: 'Brundavanam',
    imageUrl: '/assets/site_aerial_view.jpg',
    caption: 'Elevated vantage showing the 10.50-acre venture boundary adjoining the Srisailam National Highway and Kadthal corridor.'
  }
];

export default function GalleryPage() {
  const [items, setItems] = useState(BRUNDAVANAM_GALLERY_PHOTOS);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const res = await fetchGallery();
      if (res.success && res.items && res.items.length > 0) {
        setItems(res.items);
      } else {
        setItems(BRUNDAVANAM_GALLERY_PHOTOS);
      }
    } catch {
      setItems(BRUNDAVANAM_GALLERY_PHOTOS);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 space-y-10">
      {/* Brundavanam Gallery Header */}
      <div className="text-center space-y-4 pb-2">
        <div className="flex items-center justify-center">
          <h1 className="bg-brand-orange text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold px-6 sm:px-8 py-2 sm:py-2.5 rounded-sm shadow-md tracking-tight inline-block font-serif">
            Brundavanam
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Authentic on-site infrastructure, sanctioned blueprints, and scenic surroundings of Skandha Group&apos;s 10.50-acre gated residential plotted development at Kadthal, adjoining Srisailam Highway (NH 765).
        </p>
      </div>

      {/* Gallery Cards Grid (High-Clarity Visual Presentation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={item._id || idx}
            onClick={() => setLightboxIndex(idx)}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-brand-orange/40 overflow-hidden transition-all duration-300 flex flex-col"
          >
            {/* Visual Frame */}
            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                loading="lazy"
              />
              {/* Hover Zoom Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <span className="text-xs font-bold text-white bg-brand-orange px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge High-Res Photo</span>
                </span>
              </div>
            </div>

            {/* Photo Details */}
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                  {item.category || 'Brundavanam'}
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg group-hover:text-brand-orange transition-colors mt-0.5 leading-snug">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-light">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen High-Resolution Lightbox Modal */}
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
