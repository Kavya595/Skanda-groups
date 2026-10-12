import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) {
  const currentImage = images[currentIndex];

  // Keyboard navigation: Escape to close, Left/Right arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!currentImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Media Lightbox"
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between text-white z-10 py-2">
        <div className="text-xs sm:text-sm font-medium text-gray-400">
          Image <span className="text-white font-bold">{currentIndex + 1}</span> of {images.length}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 py-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#F58220] text-white transition-all transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* The Image */}
        <div className="max-w-5xl max-h-[75vh] flex items-center justify-center overflow-hidden">
          <img
            src={currentImage.image}
            alt={currentImage.alt}
            className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#F58220] text-white transition-all transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Caption Bar */}
      <div className="max-w-3xl mx-auto text-center text-white pb-2 z-10 space-y-1">
        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#F58220] text-white">
          {currentImage.category}
        </span>
        <h3 className="text-base sm:text-lg font-bold">{currentImage.title}</h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-normal max-w-2xl mx-auto">
          {currentImage.caption}
        </p>
      </div>
    </div>
  );
}
