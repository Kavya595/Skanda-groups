import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Box, 
  Rotate3d, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Trees, 
  Compass, 
  RotateCcw,
  Sparkles,
  Car as CarIcon,
  Play,
  Pause,
  Eye,
  CheckCircle2,
  Maximize2,
  Navigation,
  Info,
  X,
  Send,
  MapPin
} from 'lucide-react';
import { INITIAL_PLOTS_DATA } from '../data/plotData';
import PlotSpecificationsModal, { PLOT_SPECS } from './PlotSpecificationsModal';
import { createGrassTileCanvas } from '../utils/mapGrassPattern';

/**
 * High-definition 512x512 Canvas Texture for 3D Plots
 * Exact 1:1 match to the official DTCP sanctioned project layout drawing:
 * - Architectural Yellow theme: #FFF460 for available plots
 * - Center Circular Badge: black outer ring, top plot number, horizontal dividing line, bottom square yards
 * - Diagonal hatching on corner plots (32, 28, 21, 20)
 * - Perimeter boundary dimensions along plot edges in crisp black font
 * - Real-time status transitions: Available (Yellow #FFF460), Booked (Blue #3b82f6), Sold (Red #ef4444)
 */
function createExact2DPlotTexture(plot, specs = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const isHatched = [32, 28, 21, 20].includes(Number(plot.number));

  // Color configurations matching User Image 5:
  // Available (Vibrant Green #22c55e), Booked (Blue #3b82f6), Sold (Red #ef4444)
  // Center Circular Badge: Pure White (#ffffff) with black border and bold black plot number (exact match to Image 5)
  let fillBg = '#22c55e';
  let borderColor = '#000000';
  let circleBg = '#ffffff';
  let circleBorder = '#000000';
  let textColor = '#000000';
  let numColor = '#000000';

  if (plot.status === 'booked') {
    fillBg = '#3b82f6';
    borderColor = '#000000';
    circleBg = '#ffffff';
    circleBorder = '#000000';
    textColor = '#000000';
    numColor = '#000000';
  } else if (plot.status === 'sold') {
    fillBg = '#ef4444';
    borderColor = '#000000';
    circleBg = '#ffffff';
    circleBorder = '#000000';
    textColor = '#000000';
    numColor = '#000000';
  }

  // 1. Full solid base fill
  ctx.fillStyle = fillBg;
  ctx.fillRect(0, 0, 512, 512);

  // If corner hatched plot and available, draw diagonal stripes in vibrant emerald green
  if (isHatched && plot.status === 'available') {
    ctx.save();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 14;
    for (let i = -512; i < 1024; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 2. Bold black perimeter boundary border line
  ctx.lineWidth = 16;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(8, 8, 496, 496);

  // Helper to draw crisp boundary dimensions along edges in high-contrast
  const drawDimText = (text, x, y, align, baseline, maxW = 200) => {
    if (!text) return;
    ctx.save();
    ctx.font = 'bold 36px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
    const measured = ctx.measureText(text).width;
    if (measured > maxW) {
      const scale = maxW / measured;
      const size = Math.max(24, Math.floor(36 * scale));
      ctx.font = `bold ${size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`;
    }
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // 3. Perimeter boundary dimensions from DTCP blueprint / specs
  if (specs.topDim) {
    drawDimText(specs.topDim, 256, 26, 'center', 'top', 360);
  }
  if (specs.bottomDim) {
    drawDimText(specs.bottomDim, 256, 486, 'center', 'bottom', 360);
  }
  if (specs.leftDim) {
    drawDimText(specs.leftDim, 26, 256, 'left', 'middle', 140);
  }
  if (specs.rightDim) {
    drawDimText(specs.rightDim, 486, 256, 'right', 'middle', 140);
  }

  // 4. Center Circular Badge (Plot Number on top, dividing line, Square Yards on bottom)
  const centerX = 256;
  const centerY = 256;
  const radius = 105;

  ctx.save();
  // Outer circular border & fill
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = circleBg;
  ctx.fill();
  ctx.lineWidth = 9;
  ctx.strokeStyle = circleBorder;
  ctx.stroke();

  // Horizontal dividing line across circle
  ctx.beginPath();
  ctx.moveTo(centerX - radius + 5, centerY);
  ctx.lineTo(centerX + radius - 5, centerY);
  ctx.lineWidth = 7;
  ctx.strokeStyle = circleBorder;
  ctx.stroke();

  // Plot Number (top half)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = numColor;
  ctx.font = '900 86px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${plot.number}`, centerX, centerY - 48);

  // Square Yards (bottom half)
  const sq = specs.sqYards || plot.sqYards || 202;
  ctx.font = '900 62px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${sq}`, centerX, centerY + 50);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * High-definition 2048x2048 Georeferenced Map Terrain Texture for 3D View
 * Renders the real-world Kadthal corridor, NH 765 Srisailam Highway,
 * surrounding green parcels, road network, coordinates, and regional landmarks.
 */
/**
 * High-definition 1536x1536 Georeferenced Map Terrain Texture for 3D View
 * Renders authentic OpenStreetMap or Satellite tiles directly on the 3D ground plane,
 * providing a realistic "normal maps" experience under the 3D venture layout.
 */
/**
 * High-definition 2048x2048 Georeferenced Regional Map Terrain for 3D View
 * Streams a 4x4 grid of authentic OpenStreetMap or Satellite tiles (Zoom 15)
 * covering the complete Kadthal corridor, NH 765 Srisailam Highway, Kadthal town,
 * natural water reservoirs, and surrounding regional connectivity.
 */
function createKadthalMapTerrainTexture(mapType = 'osm', onUpdate = null) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  const isSat = mapType === 'satellite';

  // Base background fill matching map provider
  ctx.fillStyle = isSat ? '#111827' : '#f2efe9';
  ctx.fillRect(0, 0, 2048, 2048);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  // 4x4 Grid of tiles at Zoom 15 covering Kadthal region (~20km x 20km)
  const zoom = 15;
  const startX = 23528;
  const startY = 14814;
  const totalTiles = 16;
  let tilesLoaded = 0;

  // Immediate base map cartography so canvas is never blank
  if (!isSat) {
    // Water reservoir near Kadthal
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.ellipse(380, 720, 90, 55, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // NH 765 Srisailam Highway corridor
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.moveTo(560, 0);
    ctx.lineTo(820, 1024);
    ctx.lineTo(1040, 2048);
    ctx.stroke();

    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(560, 0);
    ctx.lineTo(820, 1024);
    ctx.lineTo(1040, 2048);
    ctx.stroke();

    // Approach road to venture
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(760, 800);
    ctx.lineTo(1195, 910);
    ctx.stroke();
  }

  for (let dy = 0; dy < 4; dy++) {
    for (let dx = 0; dx < 4; dx++) {
      const tileX = startX + dx;
      const tileY = startY + dy;
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const sub = ['a', 'b', 'c'][(dx + dy) % 3];
      let tileUrl = `https://${sub}.tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
      if (isSat) {
        tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
      }

      img.onload = () => {
        // Draw tile onto the 2048x2048 canvas (each tile = 512x512)
        ctx.drawImage(img, dx * 512, dy * 512, 512, 512);
        tilesLoaded++;
        texture.needsUpdate = true;
        if (onUpdate) onUpdate();
      };
      img.onerror = () => {
        tilesLoaded++;
        if (tilesLoaded >= totalTiles) {
          texture.needsUpdate = true;
          if (onUpdate) onUpdate();
        }
      };
      img.src = tileUrl;
    }
  }

  return texture;
}

/**
 * Creates 3D Procedural Coconut Palm Tree
 */
function createCoconutTree(scale = 1) {
  const tree = new THREE.Group();
  tree.userData.isTree = true;

  const trunkHeight = 3.2 * scale;
  const trunkBaseRadius = 0.18 * scale;
  const trunkTopRadius = 0.12 * scale;

  const trunkGeo = new THREE.CylinderGeometry(trunkTopRadius, trunkBaseRadius, trunkHeight, 8, 4);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5a3818,
    roughness: 0.9,
    metalness: 0.05
  });
  const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
  trunkMesh.position.y = trunkHeight / 2;
  trunkMesh.rotation.z = (Math.random() - 0.5) * 0.08;
  tree.add(trunkMesh);

  // Trunk rings
  const ringGeo = new THREE.TorusGeometry(0.16 * scale, 0.03 * scale, 4, 8);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x3d230e, roughness: 1.0 });
  for (let y = 0.8 * scale; y < trunkHeight - 0.3; y += 0.7 * scale) {
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    tree.add(ring);
  }

  // Coconuts at crown
  const cocoGeo = new THREE.SphereGeometry(0.18 * scale, 6, 6);
  const cocoMat = new THREE.MeshStandardMaterial({ color: 0x422006, roughness: 0.85 });
  [
    [0.12, trunkHeight - 0.08, 0.10],
    [-0.12, trunkHeight - 0.08, 0.10],
    [0.06, trunkHeight - 0.06, -0.12]
  ].forEach(([cx, cy, cz]) => {
    const coco = new THREE.Mesh(cocoGeo, cocoMat);
    coco.position.set(cx * scale, cy, cz * scale);
    tree.add(coco);
  });

  // Radiating Palm Fronds Canopy
  const frondCount = 9;
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.6,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < frondCount; i++) {
    const angle = (i / frondCount) * Math.PI * 2;
    const frondGroup = new THREE.Group();
    frondGroup.position.set(0, trunkHeight, 0);
    frondGroup.rotation.y = angle;

    const leafGeo = new THREE.ConeGeometry(0.40 * scale, 2.0 * scale, 4);
    const leafMesh = new THREE.Mesh(leafGeo, frondMat);
    leafMesh.position.set(0, 0.45 * scale, 0.95 * scale);
    leafMesh.rotation.x = 1.25;
    leafMesh.scale.set(0.3, 1, 1);
    frondGroup.add(leafMesh);

    tree.add(frondGroup);
  }

  // Base ground shadow
  const shadowGeo = new THREE.CircleGeometry(0.75 * scale, 12);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x1c1917,
    transparent: true,
    opacity: 0.30,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.04;
  tree.add(shadowMesh);

  return tree;
}

/**
 * Creates 3D Detailed Miniature Moving Vehicle
 */
function createDetailedCar(colorHex = 0xdc2626, name = 'car') {
  const car = new THREE.Group();
  car.userData.name = name;
  car.userData.wheels = [];

  const bodyGeo = new THREE.BoxGeometry(4.8, 1.1, 2.2);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.65,
    roughness: 0.22
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.y = 0.85;
  car.add(bodyMesh);

  const bumperMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const fBumper = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 2.2), bumperMat);
  fBumper.position.set(2.45, 0.65, 0);
  car.add(fBumper);
  const rBumper = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 2.2), bumperMat);
  rBumper.position.set(-2.45, 0.65, 0);
  car.add(rBumper);

  const cabinGeo = new THREE.BoxGeometry(2.8, 0.95, 1.9);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.05,
    metalness: 0.95
  });
  const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
  cabinMesh.position.set(-0.2, 1.65, 0);
  car.add(cabinMesh);

  const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 1.8), bodyMat);
  roofMesh.position.set(-0.2, 2.15, 0);
  car.add(roofMesh);

  const wheelGeo = new THREE.CylinderGeometry(0.50, 0.50, 0.32, 12);
  wheelGeo.rotateZ(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
  const hubcapMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });

  const wheelPositions = [
    [1.4, 0.50, 1.05],
    [1.4, 0.50, -1.05],
    [-1.4, 0.50, 1.05],
    [-1.4, 0.50, -1.05]
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(wx, wy, wz);

    const tire = new THREE.Mesh(wheelGeo, tireMat);
    wheelGroup.add(tire);

    const hubcap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.34, 8), hubcapMat);
    hubcap.rotateZ(Math.PI / 2);
    wheelGroup.add(hubcap);

    car.add(wheelGroup);
    car.userData.wheels.push(wheelGroup);
  });

  const lightGeo = new THREE.BoxGeometry(0.14, 0.24, 0.38);
  const headLightMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 2.2
  });
  const hLeft = new THREE.Mesh(lightGeo, headLightMat);
  hLeft.position.set(2.42, 0.9, 0.7);
  car.add(hLeft);
  const hRight = new THREE.Mesh(lightGeo, headLightMat);
  hRight.position.set(2.42, 0.9, -0.7);
  car.add(hRight);

  const beamGeo = new THREE.PlaneGeometry(6, 2.5);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.rotation.x = -Math.PI / 2;
  beamMesh.position.set(5.5, 0.08, 0);
  car.add(beamMesh);

  const tailLightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xef4444,
    emissiveIntensity: 2.0
  });
  const tLeft = new THREE.Mesh(lightGeo, tailLightMat);
  tLeft.position.set(-2.42, 0.9, 0.7);
  car.add(tLeft);
  const tRight = new THREE.Mesh(lightGeo, tailLightMat);
  tRight.position.set(-2.42, 0.9, -0.7);
  car.add(tRight);

  const carShadowGeo = new THREE.PlaneGeometry(5.0, 2.4);
  const carShadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  });
  const carShadowMesh = new THREE.Mesh(carShadowGeo, carShadowMat);
  carShadowMesh.rotation.x = -Math.PI / 2;
  carShadowMesh.position.y = 0.05;
  car.add(carShadowMesh);

  return car;
}

/**
 * Creates 3D Playground Structures for the Park
 */
function createPlaygroundEquipment(baseX, baseZ) {
  const parkProps = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const swingMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });

  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.2, 8), frameMat);
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(baseX - 4, 3.8, baseZ);
  parkProps.add(crossbar);

  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 4.2, 8);
  [-2.4, 2.4].forEach(xOff => {
    const l1 = new THREE.Mesh(legGeo, frameMat);
    l1.position.set(baseX - 4 + xOff, 1.9, baseZ - 0.9);
    l1.rotation.x = 0.25;
    parkProps.add(l1);

    const l2 = new THREE.Mesh(legGeo, frameMat);
    l2.position.set(baseX - 4 + xOff, 1.9, baseZ + 0.9);
    l2.rotation.x = -0.25;
    parkProps.add(l2);
  });

  [-1.0, 1.0].forEach(xOff => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.35), swingMat);
    seat.position.set(baseX - 4 + xOff, 1.0, baseZ);
    parkProps.add(seat);
  });

  const slideGroup = new THREE.Group();
  slideGroup.position.set(baseX + 4, 0, baseZ - 3);

  const towerMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
  const slideRampMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.2, 2.0), towerMat);
  platform.position.y = 2.4;
  slideGroup.add(platform);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.3, 4), towerMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 4.8;
  slideGroup.add(roof);

  const ramp = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 3.6), slideRampMat);
  ramp.position.set(0, 1.2, 2.0);
  ramp.rotation.x = 0.65;
  slideGroup.add(ramp);

  parkProps.add(slideGroup);

  return parkProps;
}

export default function PlotMap3D({ 
  plots = INITIAL_PLOTS_DATA, 
  onSelectPlot = () => {}, 
  selectedPlotId = null,
  appliedFilters = null,
  externalZoomTrigger = null,
  externalResetTrigger = 0,
  onSwitchToMapView = null,
  currentMapLayer = 'osm',
  onMapLayerChange = null
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const groundMeshRef = useRef(null);

  const plotMeshesRef = useRef(new Map());
  const interactiveListRef = useRef([]);
  const carsRef = useRef([]);
  const treesGroupRef = useRef(null);
  const beaconMeshRef = useRef(null);

  const [filterStatus, setFilterStatus] = useState('all');
  const [hoveredPlot, setHoveredPlot] = useState(null);
  const [inspectedPlot, setInspectedPlot] = useState(null);
  const [isTrafficActive, setIsTrafficActive] = useState(true);
  const [showTrees, setShowTrees] = useState(true);
  const [activePreset, setActivePreset] = useState('cad');
  const [groundMapType, setGroundMapType] = useState(currentMapLayer || 'osm'); // 'osm' | 'satellite'

  const plotMap = useMemo(() => {
    const map = {};
    plots.forEach(p => {
      map[p.number] = p;
    });
    return map;
  }, [plots]);

  const counts = useMemo(() => {
    return {
      all: plots.length,
      available: plots.filter(p => p.status === 'available').length,
      booked: plots.filter(p => p.status === 'booked').length,
      sold: plots.filter(p => p.status === 'sold').length,
    };
  }, [plots]);

  // Sync inspected plot with selectedPlotId if provided
  useEffect(() => {
    if (selectedPlotId) {
      const p = plotMap[selectedPlotId];
      if (p) setInspectedPlot(p);
    }
  }, [selectedPlotId, plotMap]);

  // Dynamic ground map type switcher (Street Map vs Satellite Imagery)
  const handleGroundMapChange = useCallback((type) => {
    setGroundMapType(type);
    onMapLayerChange?.(type);
    if (sceneRef.current) {
      const isSat = type === 'satellite';
      sceneRef.current.background = new THREE.Color(isSat ? 0x0f172a : 0xf2efe9);
      sceneRef.current.fog = new THREE.FogExp2(isSat ? 0x0f172a : 0xf2efe9, 0.0003);
    }
    if (groundMeshRef.current && groundMeshRef.current.material) {
      const newTex = createKadthalMapTerrainTexture(type, () => {
        newTex.needsUpdate = true;
      });
      if (groundMeshRef.current.material.map) {
        groundMeshRef.current.material.map.dispose();
      }
      groundMeshRef.current.material.map = newTex;
      groundMeshRef.current.material.needsUpdate = true;
    }
  }, [onMapLayerChange]);

  // Sync external currentMapLayer changes
  useEffect(() => {
    if (currentMapLayer && currentMapLayer !== groundMapType) {
      handleGroundMapChange(currentMapLayer);
    }
  }, [currentMapLayer, groundMapType, handleGroundMapChange]);

  // =========================================================================
  // CAMERA PRESETS (Centered around the DTCP layout coordinate space)
  // =========================================================================
  const applyCameraPreset = useCallback((preset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActivePreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (preset === 'cad') {
      camera.position.set(-6, 95, 105);
      controls.target.set(-6, 0, 0);
    } else if (preset === 'top') {
      camera.position.set(-6, 140, 1);
      controls.target.set(-6, 0, 0);
    } else if (preset === 'avenue') {
      camera.position.set(-82, 14, 0);
      controls.target.set(10, 2, 0);
    } else if (preset === 'park') {
      camera.position.set(-52, 45, 35);
      controls.target.set(-52, 0, -15);
    } else if (preset === 'highway') {
      camera.position.set(55, 45, 45);
      controls.target.set(45, 0, 5);
    } else if (preset === 'map') {
      camera.position.set(-6, 320, 260);
      controls.target.set(-6, 0, 0);
    }
    controls.update();
  }, []);

  // External Zoom trigger handling (from Nextora floating toolbar)
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current || !externalZoomTrigger) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    const delta = externalZoomTrigger === 'in' ? 24 : -24;
    cameraRef.current.position.addScaledVector(dir, delta);
    controlsRef.current.update();
  }, [externalZoomTrigger]);

  // External Reset trigger handling
  useEffect(() => {
    if (externalResetTrigger > 0) {
      applyCameraPreset('cad');
    }
  }, [externalResetTrigger, applyCameraPreset]);

  // =========================================================================
  // MAIN THREE.JS SCENE INITIALIZATION & LIFECYCLE
  // =========================================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 650;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const isSatInit = groundMapType === 'satellite';
    scene.background = new THREE.Color(isSatInit ? 0x0f172a : 0xf2efe9);
    scene.fog = new THREE.FogExp2(isSatInit ? 0x0f172a : 0xf2efe9, 0.0003);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 2500);
    camera.position.set(-6, 95, 105);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 15;
    controls.maxDistance = 1600; // Allows wide regional zoom out to view normal maps in 3D
    controls.target.set(-6, 0, 0);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.35);
    sunLight.position.set(50, 100, 70);
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0x166534, 0.6);
    scene.add(hemiLight);

    // 1. Georeferenced Kadthal Map Terrain Ground (Real Normal Maps in 3D)
    const mapTerrainTexture = createKadthalMapTerrainTexture(groundMapType);
    const groundGeo = new THREE.PlaneGeometry(3600, 3600);
    const groundMat = new THREE.MeshStandardMaterial({
      map: mapTerrainTexture,
      roughness: 0.9,
      metalness: 0.02
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(-306.6, -0.06, 199.8); // Aligns Kadthal coordinate with 3D venture center
    scene.add(ground);
    groundMeshRef.current = ground;

    // 1b. Surrounding Authentic Meadow Grass Ground Mesh (Matching User Image 2)
    const grassCanvas = createGrassTileCanvas(48, 48);
    const grassTex = new THREE.CanvasTexture(grassCanvas);
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(24, 18);
    grassTex.colorSpace = THREE.SRGBColorSpace;
    const ventureGrassGeo = new THREE.PlaneGeometry(168, 126);
    const ventureGrassMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.85,
      metalness: 0.02
    });
    const ventureGrass = new THREE.Mesh(ventureGrassGeo, ventureGrassMat);
    ventureGrass.rotation.x = -Math.PI / 2;
    ventureGrass.position.set(-6.0, 0.015, 0);
    scene.add(ventureGrass);

    // 2. Black Roads with Crisp Architectural Signage
    const blackRoadMat = new THREE.MeshBasicMaterial({ color: 0x050505 });

    const helperAddBlackRoad = (x, z, rWidth, depth, labelText = '', isVert = false) => {
      const roadGeo = new THREE.PlaneGeometry(rWidth, depth);
      const road = new THREE.Mesh(roadGeo, blackRoadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(x, 0.05, z);
      scene.add(road);

      if (labelText) {
        const textCanvas = document.createElement('canvas');
        textCanvas.width = isVert ? 128 : 1024;
        textCanvas.height = isVert ? 512 : 128;
        const ctx = textCanvas.getContext('2d');
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

        ctx.fillStyle = labelText.includes('CENTRAL') ? '#f58220' : (labelText.includes('60') ? '#facc15' : '#ffffff');
        ctx.font = isVert ? 'bold 22px monospace' : 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (isVert) {
          ctx.save();
          ctx.translate(64, 256);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(labelText, 0, 0);
          ctx.restore();
        } else {
          ctx.fillText(labelText, 512, 64);
        }

        const textTex = new THREE.CanvasTexture(textCanvas);
        const textMat = new THREE.MeshBasicMaterial({ map: textTex, transparent: true });
        const textPlane = new THREE.Mesh(
          isVert ? new THREE.PlaneGeometry(rWidth * 0.9, depth * 0.7) : new THREE.PlaneGeometry(rWidth * 0.75, depth * 0.8), 
          textMat
        );
        textPlane.rotation.x = -Math.PI / 2;
        textPlane.position.set(x, 0.06, z);
        scene.add(textPlane);
      }
    };

    // Central 33' Avenue (Horizontal dividing Top Row and Bottom Row)
    helperAddBlackRoad(-7.0, 0, 135, 4.8, 'PROPOSED 33\'-0" WIDE ROAD   •   CENTRAL AVENUE   •   PROPOSED 33\'-0" WIDE ROAD', false);

    // Top 60' Road (Horizontal along North boundary)
    helperAddBlackRoad(-7.0, -38.5, 135, 6.8, 'PROP. 60\'-0" WIDE ROAD', false);

    // Vertical Roads:
    // Road 1: Bottom row only between Strip 33-36 and Block 5
    helperAddBlackRoad(-56.5, 20.0, 3.8, 38.0, 'PROP. 33\'-0" WIDE ROAD', true);

    // Continuous straight vertical roads (Top to Bottom across both rows):
    const vertRoads = [
      { x: -34.5, label: 'PROP. 33\'-0" WIDE ROAD' }, // Road 2 (between Park/Block 5 and Block 1/Block 6)
      { x: -13.2, label: 'PROP. 33\'-0" WIDE ROAD' }, // Road 3 (between Block 1/6 and Block 2/7)
      { x: 8.2,   label: 'PROP. 33\'-0" WIDE ROAD' }, // Road 4 (between Block 2/7 and Block 3/8)
      { x: 30.6,  label: 'PROP. 33\'-0" WIDE ROAD' }, // Road 5 (between Block 3/8 and Block 4/9)
      { x: 54.2,  label: 'PROP. 33\'-0" WIDE ROAD' }  // Road 6 (Far right vertical road)
    ];

    vertRoads.forEach(vr => {
      helperAddBlackRoad(vr.x, 0.0, 4.0, 85.0, vr.label, true);
    });

    // 4th Phase foundation cutouts below Block 5 and Block 8 (Dashed outline on grass terrain)
    const helperAddPhaseTag = (x, z, pWidth = 18.0) => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 256;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 64);
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(2, 2, 252, 60);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('4th Phase', 128, 42);
      const pTex = new THREE.CanvasTexture(pCanvas);
      const pMesh = new THREE.Mesh(new THREE.PlaneGeometry(pWidth, 4.5), new THREE.MeshBasicMaterial({ map: pTex }));
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.set(x, 0.16, z);
      scene.add(pMesh);
    };
    helperAddPhaseTag(-45.8, 39.0, 18.0);
    helperAddPhaseTag(19.3, 39.5, 18.8);

    // 4. SITE RESERVED FOR OPEN SPACE (PARK) - Authentic Masterplan Children's Park Image
    // Spans across the entire top-left row above Strip 33-36, Road 1, and Block 5
    const parkGroup = new THREE.Group();
    scene.add(parkGroup);

    // High-resolution fallback canvas while texture loads
    const parkCanvas = document.createElement('canvas');
    parkCanvas.width = 512;
    parkCanvas.height = 512;
    const pCtx = parkCanvas.getContext('2d');

    pCtx.fillStyle = '#ecfdf5';
    pCtx.fillRect(0, 0, 512, 512);
    pCtx.lineWidth = 14;
    pCtx.strokeStyle = '#059669';
    pCtx.strokeRect(7, 7, 498, 498);

    pCtx.fillStyle = '#065f46';
    pCtx.font = 'bold 28px monospace';
    pCtx.textAlign = 'center';
    pCtx.fillText("209'-9\"", 256, 40);
    pCtx.fillText("201'-6\"", 256, 484);

    pCtx.save();
    pCtx.translate(476, 256);
    pCtx.rotate(Math.PI / 2);
    pCtx.fillText("169'-3\"", 0, 0);
    pCtx.restore();

    pCtx.fillStyle = '#059669';
    pCtx.beginPath();
    pCtx.roundRect(40, 160, 432, 60, 28);
    pCtx.fill();

    pCtx.fillStyle = '#ffffff';
    pCtx.font = 'bold 24px system-ui';
    pCtx.fillText("SITE RESERVED FOR OPEN SPACE", 256, 198);

    pCtx.fillStyle = '#064e3b';
    pCtx.font = '900 38px system-ui';
    pCtx.fillText("(PARK)", 256, 265);

    pCtx.font = 'bold 26px system-ui';
    pCtx.fillStyle = '#047857';
    pCtx.fillText("Ac.0.758 cents", 256, 310);

    const initialParkTex = new THREE.CanvasTexture(parkCanvas);
    const parkMat = new THREE.MeshBasicMaterial({ map: initialParkTex });
    const parkMesh = new THREE.Mesh(new THREE.PlaneGeometry(32.0, 30.0), parkMat);
    parkMesh.rotation.x = -Math.PI / 2;
    parkMesh.position.set(-52.5, 0.16, -19.5);
    parkGroup.add(parkMesh);

    // Load authentic masterplan park playground texture
    const parkTextureLoader = new THREE.TextureLoader();
    parkTextureLoader.load('/images/masterplan-park.png', (loadedTex) => {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      loadedTex.generateMipmaps = true;
      loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTex.magFilter = THREE.LinearFilter;
      parkMat.map = loadedTex;
      parkMat.needsUpdate = true;
    });

    const playEquipment = createPlaygroundEquipment(-52.5, -19.5);
    parkGroup.add(playEquipment);

    // 5. 3D DTCP ARCHITECTURAL PLOTS (1 to 96)
    const plotsGroup = new THREE.Group();
    scene.add(plotsGroup);

    const interactiveList = [];
    interactiveListRef.current = interactiveList;
    plotMeshesRef.current.clear();

    const helperCreatePlotMesh = (plotNumber, x, z, w, d) => {
      const plot = plotMap[plotNumber] || {
        id: plotNumber,
        number: plotNumber,
        sqYards: 202,
        status: 'available',
        facing: 'East'
      };

      const specs = PLOT_SPECS[plotNumber] || {};
      const height = 1.8;

      const boxGeo = new THREE.BoxGeometry(w, height, d);
      const canvasTexture = createExact2DPlotTexture(plot, specs);

      // Side colors: Available Green 0x008532, Booked Blue 0x2563eb, Sold Red 0xdc2626
      let sideColor = 0x008532;
      if (plot.status === 'booked') sideColor = 0x2563eb;
      else if (plot.status === 'sold') sideColor = 0xdc2626;

      const sideMat = new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.55 });
      const topMat = new THREE.MeshStandardMaterial({ map: canvasTexture, roughness: 0.35 });
      const bottomMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const materials = [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat];

      const mesh = new THREE.Mesh(boxGeo, materials);
      mesh.position.set(x, height / 2 + 0.05, z);
      mesh.userData = {
        plot,
        baseY: height / 2 + 0.05,
        height
      };

      // Crisp black architectural perimeter boundary lines around each plot box
      const edgeGeo = new THREE.EdgesGeometry(boxGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000 });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(edgeLines);

      plotsGroup.add(mesh);
      interactiveList.push(mesh);
      plotMeshesRef.current.set(plot.number, mesh);
    };

    const renderBlockColumn = (plotsList, x, startZ, endZ, pWidth) => {
      const totalDepth = Math.abs(endZ - startZ);
      const plotDepth = (totalDepth / plotsList.length) - 0.45;
      plotsList.forEach((plotNum, idx) => {
        const z = startZ + idx * (plotDepth + 0.45) + (plotDepth / 2);
        helperCreatePlotMesh(plotNum, x, z, pWidth, plotDepth);
      });
    };

    // =========================================================================
    // EXACT DTCP BLUEPRINT COLUMN-BY-COLUMN MAPPING (Plots 1 to 96)
    // =========================================================================

    // TOP ROW (North) - Z bounds from -34.0 to -4.5
    const nNorthZ = -34.0;
    const nSouthZ = -4.5;

    // BLOCK 1: Directly above Block 6! (West: 29..32 | East: 25..28)
    renderBlockColumn([29, 30, 31, 32], -28.2, nNorthZ, nSouthZ, 8.2);
    renderBlockColumn([25, 26, 27, 28], -19.6, nNorthZ, nSouthZ, 8.2);

    // BLOCK 2: Directly above Block 7! (West: 24..21 | East: 17..20)
    renderBlockColumn([24, 23, 22, 21], -6.8,  nNorthZ, nSouthZ, 8.2);
    renderBlockColumn([17, 18, 19, 20], 1.8,   nNorthZ, nSouthZ, 8.2);

    // BLOCK 3: Directly above Block 8! (West: 16..13 | East: 9..12)
    renderBlockColumn([16, 15, 14, 13], 14.8,  nNorthZ, nSouthZ, 8.6);
    renderBlockColumn([9, 10, 11, 12],  23.8,  nNorthZ, nSouthZ, 8.6);

    // BLOCK 4: Directly above Block 9! (West: 8..5 | East: 1..4)
    renderBlockColumn([8, 7, 6, 5], 37.4, nNorthZ, nSouthZ, 8.8);
    renderBlockColumn([1, 2, 3, 4], 47.0, nNorthZ, nSouthZ, 9.6);

    // BOTTOM ROW (South) - Sits below Central 33' Avenue (Z > 4.5)
    // STRIP (Far West): Plots 33, 34, 35, 36 (Under West section of Park)
    renderBlockColumn([33, 34, 35, 36], -63.5, 4.5, 34.5, 9.5);

    // BLOCK 5: West (41..37) | East (42..46) (Under East section of Park)
    renderBlockColumn([41, 40, 39, 38, 37], -50.3, 4.5, 35.5, 8.4);
    renderBlockColumn([42, 43, 44, 45, 46], -41.3, 4.5, 35.5, 8.8);

    // BLOCK 6: West (52..47) | East (53..58) (DIRECTLY UNDER BLOCK 1!)
    renderBlockColumn([52, 51, 50, 49, 48, 47], -28.2, 4.5, 36.5, 8.2);
    renderBlockColumn([53, 54, 55, 56, 57, 58], -19.6, 4.5, 36.5, 8.2);

    // BLOCK 7: West (64..59) | East (65..70) (DIRECTLY UNDER BLOCK 2!)
    renderBlockColumn([64, 63, 62, 61, 60, 59], -6.8,  4.5, 36.5, 8.2);
    renderBlockColumn([65, 66, 67, 68, 69, 70], 1.8,   4.5, 36.5, 8.2);

    // BLOCK 8: West (76..71) | East (77..82) (DIRECTLY UNDER BLOCK 3!)
    renderBlockColumn([76, 75, 74, 73, 72, 71], 14.8,  4.5, 36.5, 8.6);
    renderBlockColumn([77, 78, 79, 80, 81, 82], 23.8,  4.5, 36.5, 8.6);

    // BLOCK 9: West (89..83) | East (90..96) (DIRECTLY UNDER BLOCK 4!)
    renderBlockColumn([89, 88, 87, 86, 85, 84, 83], 37.4, 4.5, 38.5, 8.8);
    renderBlockColumn([90, 91, 92, 93, 94, 95, 96], 47.0, 4.5, 38.5, 9.6);

    // =========================================================================
    // 6. 3D PROCEDURAL COCONUT PALM TREES
    // =========================================================================
    const treesGroup = new THREE.Group();
    scene.add(treesGroup);
    treesGroupRef.current = treesGroup;

    const plantTree = (x, z, scale = 1) => {
      const tree = createCoconutTree(scale);
      tree.position.set(x, 0, z);
      treesGroup.add(tree);
    };

    // Plant along Central 33' Avenue verges
    for (let x = -68; x <= 56; x += 11.0) {
      plantTree(x, -2.8, 0.9);
      plantTree(x, 2.8, 0.9);
    }

    // Plant along Vertical Black Roads at block corners
    vertRoads.forEach(vr => {
      for (let z = -32; z <= 34; z += 12.0) {
        if (Math.abs(z) > 3.5) {
          plantTree(vr.x - 2.4, z, 0.85);
          plantTree(vr.x + 2.4, z, 0.85);
        }
      }
    });

    // Plant around Park boundary
    for (let px = -68; px <= -36; px += 8.0) {
      plantTree(px, -34.5, 0.95);
    }
    for (let pz = -32; pz <= -6; pz += 9.0) {
      plantTree(-69, pz, 0.95);
    }

    // =========================================================================
    // 7. REAL 3D MOVING MINIATURE VEHICLES
    // =========================================================================
    const carsList = [];
    carsRef.current = carsList;

    const spawnCar = (color, laneConfig) => {
      const car = createDetailedCar(color, laneConfig.name);
      car.position.set(laneConfig.startX, 0, laneConfig.startZ);
      if (laneConfig.rotY !== undefined) car.rotation.y = laneConfig.rotY;
      car.userData.lane = laneConfig;
      scene.add(car);
      carsList.push(car);
    };

    // Central Avenue traffic
    spawnCar(0xdc2626, { name: 'red_sedan', startX: -70, startZ: 1.2, endX: 58, speed: 0.36, axis: 'x', rotY: 0 });
    spawnCar(0x2563eb, { name: 'blue_sedan', startX: 58, startZ: -1.2, endX: -70, speed: -0.34, axis: 'x', rotY: Math.PI });

    // Top 60' Road traffic
    spawnCar(0xeab308, { name: 'yellow_taxi', startX: -70, startZ: -37.0, endX: 58, speed: 0.38, axis: 'x', rotY: 0 });
    spawnCar(0xffffff, { name: 'white_suv', startX: 58, startZ: -40.0, endX: -70, speed: -0.40, axis: 'x', rotY: Math.PI });

    // Vertical Roads traffic
    spawnCar(0x94a3b8, { name: 'silver_car', startX: -34.5, startZ: -38.0, endZ: 38.0, speed: 0.28, axis: 'z', rotY: -Math.PI / 2 });
    spawnCar(0x059669, { name: 'green_coupe', startX: -13.2, startZ: 38.0, endZ: -38.0, speed: -0.30, axis: 'z', rotY: Math.PI / 2 });
    spawnCar(0xb91c1c, { name: 'crimson_car', startX: 8.2, startZ: -38.0, endZ: 38.0, speed: 0.32, axis: 'z', rotY: -Math.PI / 2 });
    spawnCar(0x1e293b, { name: 'dark_sedan', startX: 30.6, startZ: 38.0, endZ: -38.0, speed: -0.34, axis: 'z', rotY: Math.PI / 2 });

    // 8. 3D Selection Beacon Pin
    const beaconGroup = new THREE.Group();
    beaconGroup.visible = false;
    scene.add(beaconGroup);
    beaconMeshRef.current = beaconGroup;

    const pinGeo = new THREE.OctahedronGeometry(1.4, 0);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xf58220,
      emissive: 0xf58220,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.y = 6.5;
    beaconGroup.add(pinMesh);

    const ringGeo = new THREE.RingGeometry(1.5, 2.0, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf58220,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 2.1;
    beaconGroup.add(ringMesh);

    // 9. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentHoveredMesh = null;

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveList, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        renderer.domElement.style.cursor = 'pointer';

        if (currentHoveredMesh !== hit) {
          if (currentHoveredMesh && currentHoveredMesh !== hit) {
            const isSel = selectedPlotId === currentHoveredMesh.userData.plot?.id ||
                          selectedPlotId === currentHoveredMesh.userData.plot?.number;
            currentHoveredMesh.position.y = isSel ? currentHoveredMesh.userData.baseY + 1.5 : currentHoveredMesh.userData.baseY;
          }
          currentHoveredMesh = hit;
          hit.position.y = hit.userData.baseY + 1.0;
          setHoveredPlot(hit.userData.plot);
        }
      } else {
        renderer.domElement.style.cursor = 'default';
        if (currentHoveredMesh) {
          const isSel = selectedPlotId === currentHoveredMesh.userData.plot?.id ||
                        selectedPlotId === currentHoveredMesh.userData.plot?.number;
          currentHoveredMesh.position.y = isSel ? currentHoveredMesh.userData.baseY + 1.5 : currentHoveredMesh.userData.baseY;
          currentHoveredMesh = null;
          setHoveredPlot(null);
        }
      }
    };

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveList, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const plot = hit.userData.plot;
        if (plot) {
          beaconGroup.position.set(hit.position.x, 0, hit.position.z);
          beaconGroup.visible = true;
          if (onSelectPlot) {
            onSelectPlot(plot);
          } else {
            setInspectedPlot(plot);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      if (isTrafficActive) {
        carsList.forEach(car => {
          const lane = car.userData.lane;
          if (!lane) return;

          if (lane.axis === 'x') {
            car.position.x += lane.speed;
            if (lane.speed > 0 && car.position.x > lane.endX) {
              car.position.x = lane.startX;
            } else if (lane.speed < 0 && car.position.x < lane.endX) {
              car.position.x = lane.startX;
            }
          } else if (lane.axis === 'z') {
            car.position.z += lane.speed;
            if (lane.speed > 0 && car.position.z > lane.endZ) {
              car.position.z = lane.startZ;
            } else if (lane.speed < 0 && car.position.z < lane.endZ) {
              car.position.z = lane.startZ;
            }
          }

          const wheelSpeed = Math.abs(lane.speed) * 2.8;
          if (car.userData.wheels) {
            car.userData.wheels.forEach(w => {
              w.rotation.x += wheelSpeed;
            });
          }
        });
      }

      if (beaconGroup.visible) {
        pinMesh.rotation.y = elapsed * 2.5;
        pinMesh.position.y = 6.2 + Math.sin(elapsed * 4) * 0.4;
        ringMesh.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.15);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (mapTerrainTexture) mapTerrainTexture.dispose();
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  useEffect(() => {
    if (treesGroupRef.current) {
      treesGroupRef.current.visible = showTrees;
    }
  }, [showTrees]);

  useEffect(() => {
    interactiveListRef.current.forEach(mesh => {
      const plot = mesh.userData.plot;
      if (!plot) return;

      const isMatch = filterStatus === 'all' || plot.status === filterStatus;
      if (isMatch) {
        mesh.scale.set(1, 1, 1);
        mesh.visible = true;
      } else {
        mesh.scale.set(0.96, 0.35, 0.96);
        mesh.position.y = mesh.userData.baseY * 0.35;
      }
    });
  }, [filterStatus]);

  // Real-time automatic synchronization when plot status changes in Admin Panel
  useEffect(() => {
    plotMeshesRef.current.forEach((mesh, plotNumber) => {
      const currentPlot = plotMap[plotNumber];
      if (!currentPlot) return;

      if (mesh.userData.plot?.status !== currentPlot.status) {
        mesh.userData.plot = currentPlot;
        const specs = PLOT_SPECS[plotNumber] || {};

        let sideColor = 0x008532;
        if (currentPlot.status === 'booked') sideColor = 0x2563eb;
        else if (currentPlot.status === 'sold') sideColor = 0xdc2626;

        const newCanvasTexture = createExact2DPlotTexture(currentPlot, specs);
        if (Array.isArray(mesh.material)) {
          mesh.material[0].color.setHex(sideColor);
          mesh.material[1].color.setHex(sideColor);
          if (mesh.material[2].map) mesh.material[2].map.dispose();
          mesh.material[2].map = newCanvasTexture;
          mesh.material[2].needsUpdate = true;
          mesh.material[4].color.setHex(sideColor);
          mesh.material[5].color.setHex(sideColor);
        }
      }
    });
  }, [plotMap]);

  useEffect(() => {
    if (!selectedPlotId) {
      if (beaconMeshRef.current) beaconMeshRef.current.visible = false;
      return;
    }

    const selectedMesh = plotMeshesRef.current.get(Number(selectedPlotId));
    if (selectedMesh) {
      selectedMesh.position.y = selectedMesh.userData.baseY + 1.5;
      if (beaconMeshRef.current) {
        beaconMeshRef.current.position.set(selectedMesh.position.x, 0, selectedMesh.position.z);
        beaconMeshRef.current.visible = true;
      }
    }
  }, [selectedPlotId]);

  return (
    <div className="relative w-full h-full min-h-[620px] flex flex-col bg-white overflow-hidden select-none">
      
      {/* 1. EXACT PLOT SPECIFICATIONS MODAL DIALOG */}
      {!onSelectPlot && inspectedPlot && (
        <PlotSpecificationsModal
          plot={inspectedPlot}
          onClose={() => setInspectedPlot(null)}
        />
      )}

      {/* 2. MAIN WEBGL THREE.JS CANVAS CONTAINER */}
      <div 
        ref={containerRef} 
        className="w-full flex-1 relative cursor-grab active:cursor-grabbing outline-none"
        tabIndex={0}
      />



      {/* 5. BOTTOM STATUS LEGEND & STATUTORY CLEARANCE BAR */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 z-10 shadow-lg">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400 mr-1 hidden sm:inline">
            Status:
          </span>
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('available')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterStatus === 'available' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#008532] shadow-2xs" />
            Available ({counts.available})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('booked')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterStatus === 'booked' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-400 hover:text-blue-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] shadow-2xs" />
            Booked ({counts.booked})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('sold')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterStatus === 'sold' ? 'bg-red-600 text-white shadow-xs' : 'text-red-400 hover:text-red-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shadow-2xs" />
            Sold ({counts.sold})
          </button>
        </div>

        {/* Feature Badges & Interaction Tips */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
            <span>🌴 Coconut Palms</span>
          </span>
          <span className="hidden md:inline">&bull;</span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
            <span>🚗 Moving Traffic</span>
          </span>
          <span className="hidden lg:inline">&bull;</span>
          <span className="text-slate-400 hidden lg:inline">
            Click any plot for Plot Specifications &bull; Drag to Rotate
          </span>
        </div>

      </div>

    </div>
  );
}
