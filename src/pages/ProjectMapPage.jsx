import React from 'react';
import NextoraLayoutViewer from '../components/NextoraLayoutViewer';

export default function ProjectMapPage() {
  return (
    <div className="w-full h-screen overflow-hidden bg-[#f4f7fb] flex flex-col">
      <NextoraLayoutViewer 
        isFullscreen={true} 
        showBackButton={true} 
      />
    </div>
  );
}
