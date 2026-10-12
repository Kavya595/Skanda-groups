import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ 
  variant = 'default', // 'default' (orange + charcoal) or 'white' (white + orange for dark backgrounds)
  size = 'md',        // 'sm', 'md', 'lg'
  linkToHome = true,
  className = '' 
}) {
  const isWhite = variant === 'white';

  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-16',
  };

  const currentHeight = sizeClasses[size] || 'h-10 sm:h-12';

  const content = (
    <div className={`inline-flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Official Project Logo Image */}
      <img
        src="/images/skandha-logo.png"
        alt="Skandha Groups Official Logo"
        className={`${currentHeight} w-auto rounded-xl object-contain shadow-xs border border-orange-500/20 flex-shrink-0 transition-transform duration-200 hover:scale-105`}
      />

      {/* Brand Typographic Wordmark */}
      <div className="flex flex-col justify-center text-left leading-none">
        <span 
          className="font-extrabold tracking-wider uppercase font-sans text-[#F58220] text-base sm:text-lg lg:text-xl"
          style={{
            letterSpacing: '0.06em',
            lineHeight: 1.1
          }}
        >
          SKANDHA
        </span>
        
        {/* Sub-bar '= GROUPS =' */}
        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
          <div className="h-[1.5px] w-2.5 sm:w-3.5 rounded-full bg-[#F58220]"></div>
          <span 
            className="font-bold tracking-widest text-[0.6rem] sm:text-[0.72rem] uppercase"
            style={{ 
              color: isWhite ? '#E5E7EB' : '#202124', 
              letterSpacing: '0.22em' 
            }}
          >
            GROUPS
          </span>
          <div className="h-[1.5px] w-2.5 sm:w-3.5 rounded-full bg-[#F58220]"></div>
        </div>
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link 
        to="/" 
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] rounded-xl p-1 transition-opacity hover:opacity-95"
        title="Skandha Groups Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
