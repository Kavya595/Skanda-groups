import React, { useRef, useImperativeHandle } from 'react';
import Layout2DView, { GOOGLE_MAP_LAYER } from './Layout2DView';
import Layout3DView, { WALK_ROADS } from './Layout3DView';

export { GOOGLE_MAP_LAYER, WALK_ROADS };

/**
 * Clean LayoutMasterView Architecture:
 * - When viewMode === '2d': Renders pure Leaflet Google Map (zero 3D interference)
 * - When viewMode === '3d': Renders pure Three.js 3D isometric scene (zero 2D tile bleeding/overlap)
 * Complete separation eliminates visual clutter, prevents camera glitches, and provides smooth gesture navigation.
 */
const LayoutMasterView = React.forwardRef(function LayoutMasterView({
  viewMode = '3d',
  ...props
}, ref) {
  const ref2D = useRef(null);
  const ref3D = useRef(null);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (viewMode === '2d') {
        ref2D.current?.zoomIn();
      } else {
        ref3D.current?.zoomIn();
      }
    },
    zoomOut: () => {
      if (viewMode === '2d') {
        ref2D.current?.zoomOut();
      } else {
        ref3D.current?.zoomOut();
      }
    },
    reset: () => {
      if (viewMode === '2d') {
        ref2D.current?.reset();
      } else {
        ref3D.current?.reset();
      }
    },
    setMapType: (type) => ref2D.current?.setMapType?.(type)
  }), [viewMode]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {viewMode === '2d' ? (
        <Layout2DView ref={ref2D} {...props} />
      ) : (
        <Layout3DView ref={ref3D} {...props} />
      )}
    </div>
  );
});

export default LayoutMasterView;
