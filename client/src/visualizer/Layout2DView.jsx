import React from 'react';
import LayoutMasterView, { GOOGLE_MAP_LAYER, WALK_ROADS } from './LayoutMasterView';

export { GOOGLE_MAP_LAYER, WALK_ROADS };
export const MAP_LAYERS = { google: GOOGLE_MAP_LAYER };

/**
 * Layout2DView forwards directly to the unified LayoutMasterView with viewMode="2d".
 * Shares the persistent, continuous Google Maps Leaflet engine with 3D mode.
 */
const Layout2DView = React.forwardRef(function Layout2DView(props, ref) {
  return <LayoutMasterView ref={ref} viewMode="2d" {...props} />;
});

export default Layout2DView;
