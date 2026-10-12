import React, { useState } from 'react';
import { Maximize2, Tag } from 'lucide-react';
import Lightbox from './Lightbox';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../data/gallery';

export default function GalleryGrid({ initialLimit = null, showFilters = true }) {
  const [selectedCategory, setSelectedCategory] = useState('Brundavanam');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Filter items
  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const displayItems = initialLimit ? filteredItems.slice(0, initialLimit) : filteredItems;

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % displayItems.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  return (
    <div>
      {/* Category Filter Buttons */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#F58220] text-white shadow-md'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200 hover:text-[#202124]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setLightboxIndex(index)}
          >
            {/* Image Container with Consistent Aspect Ratio */}
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
              {/* Category pill on top right */}
              <div className="self-end">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F58220] text-white shadow">
                  <Tag className="w-3 h-3" />
                  <span>{item.category}</span>
                </span>
              </div>

              {/* Title and zoom prompt on bottom */}
              <div>
                <h4 className="text-base font-bold leading-snug drop-shadow-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-200 mt-1 line-clamp-2">
                  {item.caption}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-orange-300 font-semibold">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to expand image</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={displayItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
