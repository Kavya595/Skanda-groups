import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  LAYOUT_BOUNDS,
  layoutRoads,
  parkData,
  statusColors
} from './masterPlanData';

// Road definitions for the interactive Street Walk / Road Travel mode
export const WALK_ROADS = [
  {
    id: 'ROAD-33-MID',
    name: "33' Internal Main Boulevard",
    shortName: "33' Boulevard",
    startX: -82,
    endX: 60,
    z: 0.5,
    axis: 'x',
    cameraHeight: 2.1,
    forwardYaw: Math.PI / 2, // Facing +X (East down the avenue)
    lookAhead: 16
  },
  {
    id: 'ROAD-33-V1',
    name: "33' Vertical Avenue 1 (West)",
    shortName: "Avenue 1",
    x: -32.5,
    startZ: 56,
    endZ: -40,
    axis: 'z',
    cameraHeight: 2.1,
    forwardYaw: 0, // Facing -Z (North toward Maisigandi road)
    lookAhead: 16
  },
  {
    id: 'ROAD-33-V2',
    name: "33' Vertical Avenue 2 (Central)",
    shortName: "Avenue 2",
    x: -3.5,
    startZ: 56,
    endZ: -40,
    axis: 'z',
    cameraHeight: 2.1,
    forwardYaw: 0, // Facing -Z (North)
    lookAhead: 16
  },
  {
    id: 'ROAD-33-V3',
    name: "33' Vertical Avenue 3 (East)",
    shortName: "Avenue 3",
    x: 25.5,
    startZ: 56,
    endZ: -40,
    axis: 'z',
    cameraHeight: 2.1,
    forwardYaw: 0, // Facing -Z (North)
    lookAhead: 16
  },
  {
    id: 'ROAD-60-TOP',
    name: "60' Arterial Road (to Maisigandi Temple)",
    shortName: "60' Arterial",
    startX: -86,
    endX: 70,
    z: -47,
    axis: 'x',
    cameraHeight: 2.3,
    forwardYaw: Math.PI / 2, // Facing +X (East)
    lookAhead: 18
  },
  {
    id: 'ROAD-HWY-EAST',
    name: "Srisailam Highway (NH-765)",
    shortName: "NH-765 Highway",
    x: 80,
    startZ: -50,
    endZ: 60,
    axis: 'z',
    cameraHeight: 2.6,
    forwardYaw: Math.PI, // Facing +Z (Southbound along highway)
    lookAhead: 22
  }
];

// Camera Controller for Smooth Transitions, Street Walk, and Park Ground Inspections
function CameraController({
  selectedPlot,
  cameraPreset,
  walkRoadIndex = 0,
  walkProgress = 0,
  onWalkProgressChange,
  onResetComplete
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const animatingRef = useRef(false);
  const targetPos = useRef(new THREE.Vector3(0, 68, 76));
  const targetLook = useRef(new THREE.Vector3(0, 0, 4));

  // Road Walk Gesture State
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const progRef = useRef(walkProgress);
  const yawRef = useRef(Math.PI / 2);
  const pitchRef = useRef(-0.02);

  // Sync internal progress when walkProgress prop changes from external buttons or slider
  useEffect(() => {
    progRef.current = walkProgress;
  }, [walkProgress]);

  // When switching roads, orient camera along the road forward direction
  useEffect(() => {
    if (cameraPreset === 'roadWalk') {
      const road = WALK_ROADS[walkRoadIndex] || WALK_ROADS[0];
      yawRef.current = road.forwardYaw;
      pitchRef.current = -0.02;
    }
  }, [walkRoadIndex, cameraPreset]);

  // Hand Gesture Drag Navigation on the Canvas for Road View (USER REQUIREMENT)
  useEffect(() => {
    if (cameraPreset !== 'roadWalk') return;

    const dom = gl.domElement;

    const handlePointerDown = (e) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      // Drag up/down to walk forward and backward (USER REQUIREMENT: "drag like normally and go forward and see")
      const moveDelta = -dy * 0.0028;
      const nextProg = Math.max(0, Math.min(1, progRef.current + moveDelta));
      progRef.current = nextProg;
      if (onWalkProgressChange) {
        onWalkProgressChange(nextProg);
      }

      // Drag left/right to look around and inspect plots on both sides
      yawRef.current -= dx * 0.005;

      // Slight natural vertical pitch
      pitchRef.current = Math.max(-0.35, Math.min(0.35, pitchRef.current - dy * 0.0008));
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const moveStep = -Math.sign(e.deltaY) * 0.035;
      const nextProg = Math.max(0, Math.min(1, progRef.current + moveStep));
      progRef.current = nextProg;
      if (onWalkProgressChange) {
        onWalkProgressChange(nextProg);
      }
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
    };
  }, [gl, cameraPreset, onWalkProgressChange]);

  // Preset Camera Transitions for Overview, Park, TopDown, and Selected Plots
  useEffect(() => {
    if (selectedPlot && selectedPlot.center) {
      const [cx, cz] = selectedPlot.center;
      targetPos.current.set(cx, 20, cz + 18);
      targetLook.current.set(cx, 0.1, cz);
      animatingRef.current = true;
    } else if (cameraPreset === 'roadWalk') {
      animatingRef.current = false;
    } else if (cameraPreset === 'mapView') {
      // High-angle 3D Geographic Regional Map View (Kadthal & Srisailam Highway NH-765)
      targetPos.current.set(0, 160, 180);
      targetLook.current.set(0, 0, 0);
      animatingRef.current = true;
    } else if (cameraPreset === 'park' || cameraPreset === 'parkGround') {
      // Low eye-level ground perspective inside Ac. 0.758 park (exact match to Screenshots 3 & 4)
      targetPos.current.set(-73, 2.0, -14);
      targetLook.current.set(-71, 1.2, -34);
      animatingRef.current = true;
    } else if (cameraPreset === 'topDown') {
      targetPos.current.set(0, 105, 0.1);
      targetLook.current.set(0, 0, 0);
      animatingRef.current = true;
    } else if (cameraPreset === 'highway') {
      targetPos.current.set(78, 22, 22);
      targetLook.current.set(50, 0, -4);
      animatingRef.current = true;
    } else {
      // Overview preset (default)
      targetPos.current.set(0, 68, 76);
      targetLook.current.set(0, 0, 4);
      animatingRef.current = true;
    }
  }, [
    selectedPlot?.plotNumber,
    selectedPlot?.center?.[0],
    selectedPlot?.center?.[1],
    cameraPreset
  ]);

  useFrame((_, delta) => {
    if (cameraPreset === 'roadWalk') {
      // Direct Responsive Road Walk Camera Control
      const road = WALK_ROADS[walkRoadIndex] || WALK_ROADS[0];
      let tx, ty = road.cameraHeight, tz;
      if (road.axis === 'x') {
        tx = road.startX + (road.endX - road.startX) * progRef.current;
        tz = road.z;
      } else {
        tx = road.x;
        tz = road.startZ + (road.endZ - road.startZ) * progRef.current;
      }

      // Smooth camera interpolation
      const smoothRate = isDragging.current ? 0.35 : 0.18;
      camera.position.x += (tx - camera.position.x) * smoothRate;
      camera.position.y += (ty - camera.position.y) * smoothRate;
      camera.position.z += (tz - camera.position.z) * smoothRate;

      // Compute look direction from yaw and pitch
      const lookDist = 18;
      const lx = camera.position.x + Math.sin(yawRef.current) * Math.cos(pitchRef.current) * lookDist;
      const ly = camera.position.y + Math.sin(pitchRef.current) * lookDist;
      const lz = camera.position.z - Math.cos(yawRef.current) * Math.cos(pitchRef.current) * lookDist;
      camera.lookAt(lx, ly, lz);

      if (controlsRef.current) {
        controlsRef.current.target.set(lx, ly, lz);
      }
    } else if (animatingRef.current && controlsRef.current) {
      const step = Math.min(delta * 4.2, 1);
      camera.position.lerp(targetPos.current, step);
      controlsRef.current.target.lerp(targetLook.current, step);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.22) {
        animatingRef.current = false;
        if (onResetComplete) onResetComplete();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={cameraPreset !== 'roadWalk'}
      enableRotate={false}
      screenSpacePanning={true}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={4}
      maxDistance={220}
      enableDamping
      dampingFactor={0.08}
    />
  );
}

// 3D Volumetric Plot Tile with physical Height, Width, Depth and Plinth Base
function Plot3D({
  plot,
  isSelected,
  isDimmed = false,
  isSearchedMatch = false,
  onSelect,
  isMeasureMode,
  onMeasurePoint
}) {
  const [hovered, setHovered] = useState(false);
  const meta = statusColors[plot.status] || statusColors.available;

  const color = useMemo(() => {
    if (isSelected) {
      if (plot.status === 'sold') return '#F87171';
      if (plot.status === 'reserved') return '#FBBF24';
      return '#68D391';
    }
    if (isSearchedMatch) return '#EA580C';
    if (hovered) return '#FB923C';
    return meta.threeColor;
  }, [plot.status, isSelected, isSearchedMatch, hovered, meta.threeColor]);

  const [cx, cz] = plot.center || [0, 0];
  const w = plot.bounds?.width || 10;
  const d = plot.bounds?.depth || 10;

  // Realistic Physical 3D Tile Dimensions: Height (0.22m plinth slab), Width and Depth
  const tileHeight = 0.22;
  const liftY = isSelected ? 0.32 : isSearchedMatch ? 0.22 : hovered ? 0.12 : 0;
  const posY = (tileHeight / 2) + 0.02 + liftY;
  const tileW = Math.max(w - 0.08, 0.5);
  const tileD = Math.max(d - 0.08, 0.5);
  const topSurfaceY = (tileHeight / 2) + 0.005;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isMeasureMode && onMeasurePoint) {
      onMeasurePoint([cx, tileHeight + liftY + 0.1, cz]);
    } else {
      onSelect(plot);
    }
  };

  return (
    <group position={[cx, posY, cz]}>
      {/* 3D Volumetric Foundation Plinth Box with Height, Width, and Depth */}
      <mesh
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <boxGeometry args={[tileW, tileHeight, tileD]} />
        {/* +X (Right side) */}
        <meshStandardMaterial attach="material-0" color={isSelected ? '#C2410C' : '#CBD5E1'} roughness={0.7} />
        {/* -X (Left side) */}
        <meshStandardMaterial attach="material-1" color={isSelected ? '#C2410C' : '#CBD5E1'} roughness={0.7} />
        {/* +Y (Top surface) with vibrant status color */}
        <meshStandardMaterial attach="material-2" color={color} roughness={0.5} opacity={isDimmed ? 0.25 : 1.0} transparent={isDimmed} />
        {/* -Y (Bottom) */}
        <meshStandardMaterial attach="material-3" color="#94A3B8" roughness={0.9} />
        {/* +Z (Front side) */}
        <meshStandardMaterial attach="material-4" color={isSelected ? '#C2410C' : '#CBD5E1'} roughness={0.7} />
        {/* -Z (Back side) */}
        <meshStandardMaterial attach="material-5" color={isSelected ? '#C2410C' : '#CBD5E1'} roughness={0.7} />
      </mesh>

      {/* Crisp 3D Demarcation Bevel Edges highlighting Height, Width, Depth */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(tileW, tileHeight, tileD)]} />
        <lineBasicMaterial
          color={isSelected || isSearchedMatch ? '#FFFFFF' : '#64748B'}
          linewidth={isSelected || isSearchedMatch ? 3 : 1.5}
          opacity={isDimmed ? 0.3 : 1.0}
          transparent={isDimmed}
        />
      </lineSegments>

      {/* Glowing Target Ring on Searched Match */}
      {isSearchedMatch && (
        <group position={[0, topSurfaceY + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[Math.min(w, d) * 0.38, Math.min(w, d) * 0.46, 32]} />
            <meshBasicMaterial color="#EA580C" />
          </mesh>
        </group>
      )}

      {/* Plot Number in Center (Exact Match to Plots99 Image 1, 2, 4) */}
      <group position={[0, topSurfaceY + 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={Math.min(w, d) * 0.32 > 1.9 ? 1.9 : Math.max(Math.min(w, d) * 0.28, 1.35)}
          color={plot.status === 'sold' ? '#7F1D1D' : '#1E293B'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {String(plot.plotNumber)}
        </Text>
      </group>

      {/* Edge Dimensions when Selected or Hovered (matching Screenshot 3: 50', 30') */}
      {(isSelected || hovered) && (
        <group position={[0, topSurfaceY + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            position={[0, d / 2 - 0.7, 0]}
            fontSize={0.95}
            color={isSelected ? '#FFFFFF' : '#0F172A'}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {plot.dimensions?.split('x')[0]?.trim() || `${Math.round(w * 3.28)}'`}
          </Text>
          <Text
            position={[0, -d / 2 + 0.7, 0]}
            fontSize={0.95}
            color={isSelected ? '#FFFFFF' : '#0F172A'}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {plot.dimensions?.split('x')[0]?.trim() || `${Math.round(w * 3.28)}'`}
          </Text>
          <Text
            position={[-w / 2 + 0.7, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            fontSize={0.95}
            color={isSelected ? '#FFFFFF' : '#0F172A'}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {plot.dimensions?.split('x')[1]?.trim() || `${Math.round(d * 3.28)}'`}
          </Text>
          <Text
            position={[w / 2 - 0.7, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            fontSize={0.95}
            color={isSelected ? '#FFFFFF' : '#0F172A'}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {plot.dimensions?.split('x')[1]?.trim() || `${Math.round(d * 3.28)}'`}
          </Text>
        </group>
      )}
    </group>
  );
}

// Realistic Broad Tropical Palm Tree along avenue stone curbs (Matching Plots99 Image 1 & 4)
function PalmTree({ position = [0, 0, 0], scale = 1.0 }) {
  const leafAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <group position={position} scale={scale}>
      {/* Small Circular Tree-Pit Stone Border in Cobblestone Sidewalk */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.38, 16]} />
        <meshBasicMaterial color="#A0AEC0" />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 12]} />
        <meshBasicMaterial color="#3E3024" />
      </mesh>

      {/* Slender Textured Bark Trunk with slight natural curvature */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.10, 0.16, 3.0, 10]} />
        <meshStandardMaterial color="#8E8175" roughness={0.88} />
      </mesh>

      {/* Decorative Crown Sheath / Trimmed Frond Stubs (Matching Image 1 tan fibers) */}
      <mesh position={[0, 2.95, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.45, 8]} />
        <meshStandardMaterial color="#C5A059" roughness={0.7} />
      </mesh>

      {/* Crown Top Joint */}
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#556B2F" roughness={0.7} />
      </mesh>

      {/* 8 Broad Tropical Banana / Palm Leaves Radiating and Drooping (Matching Image 1 & 4) */}
      {leafAngles.map((angle, idx) => (
        <group
          key={idx}
          position={[0, 3.15, 0]}
          rotation={[0.34, (angle * Math.PI) / 180, -0.44]}
        >
          {/* Main Leaf Arch */}
          <mesh position={[1.1, -0.15, 0]} rotation={[0, 0, -0.22]} scale={[2.0, 0.04, 0.95]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#4E9A1A" roughness={0.55} />
          </mesh>
          {/* Drooping Leaf Tip */}
          <mesh position={[2.1, -0.6, 0]} rotation={[0, 0, -0.55]} scale={[1.2, 0.03, 0.75]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#65B32E" roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Low Cycad Palm Shrub for the Park Lawn (matching Screenshot 3 & 4)
function ParkCycadShrub({ position = [0, 0, 0], scale = 1.0 }) {
  const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <group position={position} scale={scale}>
      {/* Small Dark Brown Trunk Base */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.32, 8]} />
        <meshBasicMaterial color="#5C4033" />
      </mesh>

      {/* 12 Radiating Arching Cycad Palm Leaflets */}
      {angles.map((ang, idx) => (
        <group key={idx} position={[0, 0.28, 0]} rotation={[0.42, (ang * Math.PI) / 180, -0.32]}>
          <mesh position={[0.55, -0.06, 0]} rotation={[0, 0, -0.2]} scale={[1.15, 0.035, 0.32]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#2B5329" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Little Flower Patch for Park Lawn (matching Screenshot 3 & 4: white and orange flowers)
function FlowerPatch({ position = [0, 0, 0], isOrange = false }) {
  return (
    <group position={position}>
      {/* Flower Petals */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 5]} />
        <meshBasicMaterial color={isOrange ? '#F97316' : '#FFFFFF'} />
      </mesh>
      {/* Blossom Core */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 6]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>
    </group>
  );
}

// Avenue Landscaping between Block to Block along Internal Road Curbs (100% Unblocked Streets)
function Landscaping() {
  const trees = useMemo(() => {
    const list = [];

    // Strict clearance guard: guarantees NO tree is inside any road or within 8.5m of any intersection
    const isBlockingStreet = (x, z) => {
      // 1. Inside 60ft Road corridor (Z: -53.5 to -40.5)
      if (z >= -53.5 && z <= -40.5) return true;
      // 2. Inside Central Boulevard corridor (Z: -4.5 to 5.5)
      if (z >= -4.5 && z <= 5.5) return true;
      // 3. Inside any vertical road corridor (with safety margins)
      const vCorridors = [
        [-89.5, -79.5], // West Boundary Road
        [-66.5, -56.5], // Road V0
        [-37.5, -27.5], // Road V1
        [-8.5, 1.5],    // Road V2
        [20.5, 30.5],   // Road V3
        [48.5, 58.5],   // Road V4
        [61.5, 71.5],   // Service Road
        [71.5, 90.0]    // Srisailam Highway
      ];
      for (const [xmin, xmax] of vCorridors) {
        if (x >= xmin && x <= xmax) return true;
      }
      // 4. Near any intersection (keep turning mouths and street entrances wide open)
      const junctions = [-84.5, -61.5, -32.5, -3.5, 25.5, 53.5, 66.5];
      for (const jx of junctions) {
        if (Math.hypot(x - jx, z - (-47)) < 8.5) return true;
        if (Math.hypot(x - jx, z - 0.5) < 8.5) return true;
      }
      return false;
    };

    const addSafeTree = (pos, scale = 0.95) => {
      if (!isBlockingStreet(pos[0], pos[2])) {
        list.push({ pos, scale });
      }
    };

    // 1. Avenue Palms along North side of Central Boulevard (fronting Blocks A, B, C, D)
    [-74, -62, -50, -22, -14, 7, 15, 36, 44].forEach((x) => {
      addSafeTree([x, 0.14, -5.4], 0.95);
    });

    // 2. Avenue Palms along South side of Central Boulevard (fronting Blocks F, Park, H, I, J)
    [-74, -52, -42, -22, -14, 7, 15, 36, 44].forEach((x) => {
      addSafeTree([x, 0.14, 6.4], 0.95);
    });

    // 3. Avenue Palms along 60ft Road verge (North boundary of Blocks A, B, C, D)
    [-74, -62, -50, -22, -14, 7, 15, 36, 44].forEach((x) => {
      addSafeTree([x, 0.14, -39.8], 1.02);
    });

    // 4. Avenue Palms along Vertical Road V1 (between Block A & B; Block G & H)
    [-34, -24, -14].forEach((z) => {
      addSafeTree([-38.2, 0.14, z], 0.9);
      addSafeTree([-26.8, 0.14, z], 0.9);
    });
    [16, 28, 40, 50].forEach((z) => {
      addSafeTree([-38.2, 0.14, z], 0.9);
      addSafeTree([-26.8, 0.14, z], 0.9);
    });

    // 5. Avenue Palms along Vertical Road V2 (between Block B & C; Block H & I)
    [-34, -24, -14].forEach((z) => {
      addSafeTree([-9.2, 0.14, z], 0.9);
      addSafeTree([2.2, 0.14, z], 0.9);
    });
    [16, 28, 40, 50].forEach((z) => {
      addSafeTree([-9.2, 0.14, z], 0.9);
      addSafeTree([2.2, 0.14, z], 0.9);
    });

    // 6. Avenue Palms along Vertical Road V3 (between Block C & D; Block I & J)
    [-34, -24, -14].forEach((z) => {
      addSafeTree([19.8, 0.14, z], 0.9);
      addSafeTree([31.2, 0.14, z], 0.9);
    });
    [16, 28, 40, 50].forEach((z) => {
      addSafeTree([19.8, 0.14, z], 0.9);
      addSafeTree([31.2, 0.14, z], 0.9);
    });

    // 7. Avenue Palms along Vertical Road V4 (between Block D & E; Block J & K)
    [-34, -24, -14].forEach((z) => {
      addSafeTree([47.8, 0.14, z], 0.9);
      addSafeTree([59.2, 0.14, z], 0.9);
    });
    [16, 28, 40, 50].forEach((z) => {
      addSafeTree([47.8, 0.14, z], 0.9);
      addSafeTree([59.2, 0.14, z], 0.9);
    });

    return list;
  }, []);

  return (
    <group>
      {trees.map((t, idx) => (
        <PalmTree key={idx} position={t.pos} scale={t.scale} />
      ))}
    </group>
  );
}

// Block frontage curb definition: precast kerbs & painted road borders that DO NOT block any intersection
const BLOCK_CURB_SEGMENTS = [
  // HORIZONTAL CURB SEGMENTS
  // North side of Central Boulevard (facing South Blocks A, B, C, D, E at Z = -3.12)
  { x: -58.0, z: -3.14, w: 38.0, d: 0.3, isHorizontal: true, isNorth: true },
  { x: -18.0, z: -3.14, w: 16.5, d: 0.3, isHorizontal: true, isNorth: true },
  { x: 11.0, z: -3.14, w: 16.5, d: 0.3, isHorizontal: true, isNorth: true },
  { x: 39.5, z: -3.14, w: 16.0, d: 0.3, isHorizontal: true, isNorth: true },
  { x: 60.0, z: -3.14, w: 4.0, d: 0.3, isHorizontal: true, isNorth: true },

  // South side of Central Boulevard (facing North Blocks F, Park, H, I, J, K at Z = 4.14)
  { x: -72.5, z: 4.14, w: 11.0, d: 0.3, isHorizontal: true, isNorth: false },
  { x: -47.0, z: 4.14, w: 19.0, d: 0.3, isHorizontal: true, isNorth: false },
  { x: -18.0, z: 4.14, w: 16.5, d: 0.3, isHorizontal: true, isNorth: false },
  { x: 11.0, z: 4.14, w: 16.5, d: 0.3, isHorizontal: true, isNorth: false },
  { x: 39.5, z: 4.14, w: 16.0, d: 0.3, isHorizontal: true, isNorth: false },
  { x: 60.0, z: 4.14, w: 4.0, d: 0.3, isHorizontal: true, isNorth: false },

  // South side of 60ft Road (facing North Blocks A, B, C, D, E at Z = -41.86)
  { x: -58.0, z: -41.86, w: 38.0, d: 0.3, isHorizontal: true, isNorth: false },
  { x: -18.0, z: -41.86, w: 16.5, d: 0.3, isHorizontal: true, isNorth: false },
  { x: 11.0, z: -41.86, w: 16.5, d: 0.3, isHorizontal: true, isNorth: false },
  { x: 39.5, z: -41.86, w: 16.0, d: 0.3, isHorizontal: true, isNorth: false },
  { x: 60.0, z: -41.86, w: 4.0, d: 0.3, isHorizontal: true, isNorth: false },

  // North side of 60ft Road outer perimeter
  { x: -12.5, z: -52.14, w: 151.0, d: 0.3, isHorizontal: true, isNorth: true },

  // VERTICAL CURB SEGMENTS
  // North section: between 60ft road and Central Blvd (Z: -40.5 to -4.5, center Z = -22.5, length = 35.0m)
  { x: -80.86, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: false },
  { x: -36.14, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: true },
  { x: -28.86, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: false },
  { x: -7.14, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: true },
  { x: 0.14, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: false },
  { x: 21.86, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: true },
  { x: 29.14, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: false },
  { x: 49.86, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: true },
  { x: 57.14, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: false },
  { x: 62.86, z: -22.5, w: 0.3, d: 35.0, isHorizontal: false, isWest: true },

  // South section: between Central Blvd and South Boundary (Z: 5.5 to 57.5, center Z = 31.5, length = 51.0m)
  { x: -80.86, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: false },
  { x: -64.86, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: true },
  { x: -58.14, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: false },
  { x: -36.14, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: true },
  { x: -28.86, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: false },
  { x: -7.14, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: true },
  { x: 0.14, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: false },
  { x: 21.86, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: true },
  { x: 29.14, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: false },
  { x: 49.86, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: true },
  { x: 57.14, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: false },
  { x: 62.86, z: 31.5, w: 0.3, d: 51.0, isHorizontal: false, isWest: true }
];

// Connected Road Network with Realistic Deep Asphalt, Raised Cobblestone Curbs, and Printed Road Names (Matching Image 4 & 5)
function ConnectedRoadNetwork({ onRoadClick }) {
  // High-Resolution Deep Bitumen Asphalt Texture with aggregate specks
  const asphaltTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich deep asphalt tarmac base (matching Image 4 & 5)
    ctx.fillStyle = '#16191E';
    ctx.fillRect(0, 0, 512, 512);

    // Fine mineral grit and bitumen aggregates
    for (let i = 0; i < 18000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 1.8 + 0.4;
      const rnd = Math.random();
      if (rnd > 0.72) {
        ctx.fillStyle = '#2A303A'; // medium stone aggregate
      } else if (rnd > 0.35) {
        ctx.fillStyle = '#0F1115'; // deep black bitumen
      } else {
        ctx.fillStyle = '#383F4C'; // light quartz glint
      }
      ctx.fillRect(x, y, size, size);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
  }, []);

  // Organic Polygonal Flagstone / Cobblestone Paver Texture matching media_1791965028424_4ab01446.png
  const cobblestoneTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dark charcoal mortar joint background
    ctx.fillStyle = '#1C222A';
    ctx.fillRect(0, 0, 512, 512);

    // Natural stone tones from photo (cool slate, granite, ash greys)
    const stoneColors = [
      '#758393', '#8B99A9', '#63707F', '#9BAAB9', '#586472',
      '#7E8C9C', '#8492A2', '#6C7988', '#92A1B1', '#606C7A'
    ];

    const rows = 14;
    const cols = 10;
    const cellH = 512 / rows;
    const cellW = 512 / cols;

    for (let r = 0; r < rows; r++) {
      const rowOffset = (r % 2) * (cellW * 0.48);
      for (let c = -1; c <= cols + 1; c++) {
        // Natural jitter for organic cobblestone shapes
        const seed = r * 13 + c * 37;
        const jx = Math.sin(seed * 0.7) * (cellW * 0.18);
        const jy = Math.cos(seed * 0.9) * (cellH * 0.18);
        const cx = c * cellW + rowOffset + jx;
        const cy = r * cellH + jy;
        const radX = cellW * 0.44;
        const radY = cellH * 0.42;

        ctx.save();
        ctx.beginPath();
        // 8-point irregular polygon with rounded corners for organic flagstone
        const pts = 8;
        for (let i = 0; i < pts; i++) {
          const ang = (i / pts) * Math.PI * 2;
          const rMod = 0.86 + 0.22 * Math.sin(ang * 3 + seed);
          const px = cx + Math.cos(ang) * radX * rMod;
          const py = cy + Math.sin(ang) * radY * rMod;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Fill natural stone color
        ctx.fillStyle = stoneColors[(Math.abs(r * 5 + c * 7)) % stoneColors.length];
        ctx.fill();

        // 3D sunlit bevel highlight on stone top edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Dark mortar edge line
        ctx.strokeStyle = 'rgba(20, 25, 32, 0.85)';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        ctx.restore();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  }, []);

  return (
    <group>
      {layoutRoads.map((road) => {
        const [p0, p1, p2, p3] = road.polygon;
        const xMin = Math.min(p0[0], p1[0], p2[0], p3[0]);
        const xMax = Math.max(p0[0], p1[0], p2[0], p3[0]);
        const zMin = Math.min(p0[1], p1[1], p2[1], p3[1]);
        const zMax = Math.max(p0[1], p1[1], p2[1], p3[1]);
        const w = xMax - xMin;
        const d = zMax - zMin;
        const cx = (xMin + xMax) / 2;
        const cz = (zMin + zMax) / 2;

        const isHighway = road.type === 'highway';
        const isArterial = road.type === 'arterial';
        const isHorizontal = w >= d;

        return (
          <group
            key={road.id}
            position={[cx, 0.02, cz]}
            onClick={(e) => {
              e.stopPropagation();
              if (onRoadClick) onRoadClick(road);
            }}
          >
            {/* Deep Rich Blacktop Asphalt Road Bed (Continuous open network) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial
                map={asphaltTexture || undefined}
                color="#FFFFFF"
                roughness={0.92}
                metalness={0.08}
              />
            </mesh>

            {/* Highway Centerline: Yellow Double Median Divider (NH-765) */}
            {isHighway && (
              <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh position={[-0.18, 0, 0]}>
                  <planeGeometry args={[0.18, d]} />
                  <meshBasicMaterial color="#FBBF24" />
                </mesh>
                <mesh position={[0.18, 0, 0]}>
                  <planeGeometry args={[0.18, d]} />
                  <meshBasicMaterial color="#FBBF24" />
                </mesh>
              </group>
            )}

            {/* Arterial 60ft Road: White Dashed Centerline */}
            {isArterial && (
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[w, 0.28]} />
                <meshBasicMaterial color="#FFFFFF" opacity={0.92} transparent />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 2. Realistic Block-Frontage Curbs, Sidewalk Verges & Painted Margins (Zero Blockades at Intersections!) */}
      <group>
        {BLOCK_CURB_SEGMENTS.map((seg, idx) => (
          <group key={`curb-${idx}`}>
            {/* Raised Precast Concrete Kerb Stone (0.12m height above road) */}
            <mesh position={[seg.x, 0.08, seg.z]}>
              <boxGeometry args={[seg.w, 0.12, seg.d]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.65} metalness={0.1} />
            </mesh>

            {/* Painted White Road Margin Line along the asphalt edge directly adjoining the curb */}
            <mesh
              position={[
                seg.isHorizontal ? seg.x : (seg.isWest ? seg.x + 0.22 : seg.x - 0.22),
                0.026,
                seg.isHorizontal ? (seg.isNorth ? seg.z + 0.22 : seg.z - 0.22) : seg.z
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[seg.isHorizontal ? seg.w : 0.12, seg.isHorizontal ? 0.12 : seg.d]} />
              <meshBasicMaterial color="#FFFFFF" opacity={0.92} transparent />
            </mesh>

            {/* Paved Walkway / Sidewalk Paver Verge behind the curb */}
            <mesh
              position={[
                seg.isHorizontal ? seg.x : (seg.isWest ? seg.x - 0.6 : seg.x + 0.6),
                0.035,
                seg.isHorizontal ? (seg.isNorth ? seg.z - 0.6 : seg.z + 0.6) : seg.z
              ]}
            >
              <boxGeometry args={[seg.isHorizontal ? seg.w : 0.9, 0.04, seg.isHorizontal ? 0.9 : seg.d]} />
              <meshStandardMaterial map={cobblestoneTexture || undefined} color="#E2E8F0" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Street Name Typography printed directly on asphalt (Matching Image 5) */}
      <Text
        position={[0, 0.035, -47]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.75}
        color="#F8FAFC"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        60' Road (to Maisigandi Temple)
      </Text>

      <Text
        position={[80, 0.035, 5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.8}
        color="#FEF08A"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Srisailam Highway (NH-765)
      </Text>

      <Text
        position={[0, 0.035, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.4}
        color="#CBD5E1"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        33' Main Boulevard
      </Text>

      <Text
        position={[-32.5, 0.035, 20]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.25}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        33' Road
      </Text>

      <Text
        position={[-3.5, 0.035, 20]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.25}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        33' Road
      </Text>

      <Text
        position={[25.5, 0.035, 20]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.25}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        33' Road
      </Text>
    </group>
  );
}

// Ac. 0.758 Park Area (matching Screenshot 3 & 4: clean flowering lawn, perimeter palms, cycad shrubs)
function ParkArea3D({ onParkClick }) {
  const [cx, cz] = parkData.center;
  const w = parkData.width;
  const d = parkData.depth;

  // Perimeter small palm trees (matching Screenshot 3 & 4 perimeter)
  const perimeterPalms = useMemo(() => {
    const list = [];
    const minX = cx - w / 2;
    const maxX = cx + w / 2;
    const minZ = cz - d / 2;
    const maxZ = cz + d / 2;

    // North & South edges
    for (let x = minX; x <= maxX; x += 3.8) {
      list.push([x, minZ]);
      list.push([x, maxZ]);
    }
    // West & East edges
    for (let z = minZ + 3.8; z < maxZ; z += 3.8) {
      list.push([minX, z]);
      list.push([maxX, z]);
    }
    return list;
  }, [cx, cz, w, d]);

  // Scattered cycad shrubs inside the park lawn (matching Screenshot 3 & 4)
  const cycads = useMemo(() => {
    const list = [];
    const rows = 6;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jx = (((r * 13 + c * 23) % 17) - 8) * 0.35;
        const jz = (((r * 19 + c * 29) % 17) - 8) * 0.45;
        const rx = cx - w * 0.38 + (c / (cols - 1)) * (w * 0.76) + jx;
        const rz = cz - d * 0.38 + (r / (rows - 1)) * (d * 0.76) + jz;
        const sc = 0.82 + (((r * 7 + c * 11) % 5) * 0.08);
        list.push({ pos: [rx, 0.035, rz], scale: sc });
      }
    }
    return list;
  }, [cx, cz, w, d]);

  // Sprinkled white daisy & orange poppy blossoms (matching Screenshot 3 & 4)
  const flowers = useMemo(() => {
    const list = [];
    for (let i = 0; i < 72; i++) {
      const jx = (((i * 37) % 100) / 100 - 0.5) * (w * 0.88);
      const jz = (((i * 59) % 100) / 100 - 0.5) * (d * 0.88);
      list.push({ pos: [cx + jx, 0.04, cz + jz], isOrange: i % 2 === 0 });
    }
    return list;
  }, [cx, cz, w, d]);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (onParkClick) onParkClick();
      }}
    >
      {/* Vibrant Grass Lawn (matching Plots99 #7CB518) */}
      <mesh position={[cx, 0.03, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color="#7CB518" />
      </mesh>

      {/* Dark green perimeter outline */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.035, cz]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial color="#4A7C12" linewidth={2} />
      </lineSegments>

      {/* Perimeter Palm Trees (matching Screenshot 3 & 4) */}
      {perimeterPalms.map(([px, pz], idx) => (
        <PalmTree key={`perm-${idx}`} position={[px, 0.03, pz]} scale={0.72} />
      ))}

      {/* Scattered Cycad Palm Shrubs (matching Screenshot 3 & 4) */}
      {cycads.map((c, idx) => (
        <ParkCycadShrub key={`cycad-${idx}`} position={c.pos} scale={c.scale} />
      ))}

      {/* Scattered Daisy & Orange Flower Blossoms (matching Screenshot 3 & 4) */}
      {flowers.map((fl, idx) => (
        <FlowerPatch key={`fl-${idx}`} position={fl.pos} isOrange={fl.isOrange} />
      ))}
    </group>
  );
}

// Grand Entrance Arch connecting Layout to Srisailam Highway Service Road
function GrandEntranceArch({ position = [63, 0, 0.5] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Left Stone Pillar */}
      <mesh position={[-4.0, 2.6, 0]}>
        <boxGeometry args={[0.9, 5.2, 0.9]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      {/* Left Pillar Base */}
      <mesh position={[-4.0, 0.3, 0]}>
        <boxGeometry args={[1.3, 0.6, 1.3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>
      {/* Left Pillar Cap & Gold Lamp */}
      <mesh position={[-4.0, 5.35, 0]}>
        <boxGeometry args={[1.1, 0.3, 1.1]} />
        <meshStandardMaterial color="#D97706" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Right Stone Pillar */}
      <mesh position={[4.0, 2.6, 0]}>
        <boxGeometry args={[0.9, 5.2, 0.9]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      {/* Right Pillar Base */}
      <mesh position={[4.0, 0.3, 0]}>
        <boxGeometry args={[1.3, 0.6, 1.3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>
      {/* Right Pillar Cap & Gold Lamp */}
      <mesh position={[4.0, 5.35, 0]}>
        <boxGeometry args={[1.1, 0.3, 1.1]} />
        <meshStandardMaterial color="#D97706" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Architectural Overhead Crossbeam */}
      <mesh position={[0, 4.9, 0]}>
        <boxGeometry args={[9.2, 0.85, 0.7]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* Gold Decorative Header Trim */}
      <mesh position={[0, 5.4, 0]}>
        <boxGeometry args={[8.8, 0.15, 0.75]} />
        <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* "ALEKHYA'S BRUNDAVAN" Text Facing Highway (East side) */}
      <Text
        position={[0, 4.9, 0.38]}
        fontSize={0.44}
        color="#FEF08A"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        ALEKHYA'S BRUNDAVAN
      </Text>

      {/* "WELCOME TO BRUNDAVAN" Text Facing Inside Layout (West side) */}
      <Text
        position={[0, 4.9, -0.38]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.42}
        color="#FEF08A"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        WELCOME TO BRUNDAVAN
      </Text>
    </group>
  );
}

// Module-level cache for Map View terrain texture
let mapTerrainTextureCache = null;

// Real-World Kadthal / Srisailam Highway Map View Terrain Backdrop (Matching Plots99 Real Map)
function RealWorldMapTerrain() {
  const [terrainTexture, setTerrainTexture] = useState(() => mapTerrainTextureCache);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mapTerrainTextureCache) {
      setTerrainTexture(mapTerrainTextureCache);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Clean Google Maps pastel land tone matching 2D View
    ctx.fillStyle = '#E5ECE3';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle agricultural & open field parcels in light earthy greens
    const parcels = [
      { x: 30, y: 40, w: 260, h: 220, col: '#E0EAE0' },
      { x: 320, y: 50, w: 340, h: 180, col: '#DCE8DC' },
      { x: 40, y: 310, w: 240, h: 280, col: '#E2ECE1' },
      { x: 40, y: 640, w: 260, h: 320, col: '#DEE8DD' },
      { x: 330, y: 720, w: 310, h: 260, col: '#E0EAE0' },
      { x: 720, y: 120, w: 270, h: 360, col: '#DEEADE' },
      { x: 720, y: 530, w: 260, h: 420, col: '#E2EBE1' }
    ];
    parcels.forEach(p => {
      ctx.fillStyle = p.col;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    });

    // Srisailam Highway NH-765 corridor preview
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(720, 0, 40, 1024);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 2;
    ctx.strokeRect(720, 0, 40, 1024);

    // 60' Arterial Road connecting to Highway
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 360, 720, 28);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    mapTerrainTextureCache = tex;
    setTerrainTexture(tex);

    // Load 4x4 grid of Clean, Watermark-Free Google Maps Tiles (Zoom 16) for Kadthal Region [17.0985, 78.5085]
    // Kadthal center tile at zoom 16 is x=47060, y=29608. Covers ~9.2 km x ~9.2 km!
    // Zero API key required, zero watermarks!
    const zoom = 16;
    const startX = 47058;
    const startY = 29606;

    for (let dy = 0; dy < 4; dy++) {
      for (let dx = 0; dx < 4; dx++) {
        const x = startX + dx;
        const y = startY + dy;
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          ctx.drawImage(img, dx * 256, dy * 256, 256, 256);
          tex.needsUpdate = true;
        };
        img.onerror = () => {
          // Fallback to our proxy or OSM
          const fallback = new Image();
          fallback.crossOrigin = 'anonymous';
          fallback.onload = () => {
            ctx.drawImage(fallback, dx * 256, dy * 256, 256, 256);
            tex.needsUpdate = true;
          };
          fallback.src = `/api/tiles/${zoom}/${x}/${y}.png?type=google`;
        };
        // Load directly from Google Maps tile CDN
        img.src = `https://mt1.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${zoom}`;
      }
    }
  }, []);

  return (
    <group>
      {/* Real-World Geographic Terrain Plane Centered at Layout Origin [0, -0.025, 5] */}
      <mesh position={[0, -0.025, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1168, 1168]} />
        {terrainTexture ? (
          <meshBasicMaterial map={terrainTexture} />
        ) : (
          <meshBasicMaterial color="#E5ECE3" />
        )}
      </mesh>

      {/* DTCP Sanctioned Layout Compound Base Ground Tile */}
      <mesh position={[0, 0.005, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[186, 126]} />
        <meshBasicMaterial color="#D5E8CE" opacity={0.92} transparent />
      </mesh>

      {/* DTCP Sanctioned Layout Boundary Perimeter Fencing */}
      <lineSegments position={[0, 0.012, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(186, 126)]} />
        <lineBasicMaterial color="#15803D" linewidth={3} />
      </lineSegments>

      {/* Grand Entrance Arch at Srisailam Highway Service Road Entrance */}
      <GrandEntranceArch position={[63, 0, 0.5]} />
    </group>
  );
}

// Interactive Distance Measurement Line
function MeasureOverlay({ points }) {
  if (!points || points.length === 0) return null;

  const [p1, p2] = points;
  let distanceM = 0;
  let distanceFt = 0;
  let midPoint = [0, 0, 0];

  if (p2) {
    const v1 = new THREE.Vector3(...p1);
    const v2 = new THREE.Vector3(...p2);
    distanceM = v1.distanceTo(v2);
    distanceFt = Math.round(distanceM * 3.28084);
    midPoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + 1.2, (p1[2] + p2[2]) / 2];
  }

  return (
    <group>
      <mesh position={p1}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color="#F15A24" />
      </mesh>

      {p2 && (
        <>
          <mesh position={p2}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshBasicMaterial color="#F15A24" />
          </mesh>
          <Line
            points={[p1, p2]}
            color="#F15A24"
            lineWidth={3}
            dashed
            dashScale={2}
          />
          <group position={midPoint} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[10, 2.2]} />
              <meshBasicMaterial color="#0F172A" opacity={0.9} transparent />
            </mesh>
            <Text
              fontSize={1.1}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {`${distanceFt} ft (${distanceM.toFixed(1)} m)`}
            </Text>
          </group>
        </>
      )}
    </group>
  );
}

export default function Layout3DView({
  plots,
  selectedPlot,
  onSelectPlot,
  cameraPreset = 'overview',
  searchTerm = '',
  filterStatus = 'all',
  filterFacing = 'all',
  walkRoadIndex = 0,
  walkProgress = 0,
  onWalkProgressChange,
  animateVehicles = true,
  isMeasureMode = false,
  measurePoints = [],
  onMeasurePoint,
  onRoadClick,
  onParkClick
}) {
  const cleanSearch = (searchTerm || '').trim();
  const bgColor = '#E5ECE3';

  return (
    <div className={`w-full h-full relative bg-[#E5ECE3] select-none ${cameraPreset === 'roadWalk' ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <Canvas
        shadows={false} // NO SHADOWS per user directive
        className={cameraPreset === 'roadWalk' ? 'cursor-grab active:cursor-grabbing' : ''}
        camera={{ position: [0, 68, 76], fov: 42, near: 0.5, far: 1600 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[bgColor]} />

        {/* Clean, Bright, Shadowless Illumination */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[30, 80, 40]} intensity={0.65} />

        {/* Camera Controller supporting Street Walk & Park Ground views */}
        <CameraController
          selectedPlot={selectedPlot}
          cameraPreset={cameraPreset}
          walkRoadIndex={walkRoadIndex}
          walkProgress={walkProgress}
          onWalkProgressChange={onWalkProgressChange}
        />

        {/* Real-World Geographic Kadthal Map View Terrain (Clean OpenStreetMap) */}
        <RealWorldMapTerrain />

        {/* Connected Asphalt Road Network with Sidewalks */}
        <ConnectedRoadNetwork onRoadClick={onRoadClick} />

        {/* Ac. 0.758 Park Area with Flowers, Perimeter Palms & Cycads */}
        <ParkArea3D onParkClick={onParkClick} />

        {/* Avenue Royal Palms Landscaping (with 100% clear streets) */}
        <Landscaping />

        {/* Master Plots (Flat tiles, zero gaps, all numbers visible) */}
        <group>
          {plots.map((plot) => {
            const matchesSearch = !cleanSearch || String(plot.plotNumber).includes(cleanSearch);
            const matchesStatus = !filterStatus || filterStatus === 'all' || plot.status === filterStatus;
            const matchesFacing = !filterFacing || filterFacing === 'all' || (plot.facing && plot.facing.toLowerCase().includes(filterFacing.toLowerCase()));
            const isMatch = matchesSearch && matchesStatus && matchesFacing;
            const hasActiveFilter = Boolean(cleanSearch) || (filterStatus && filterStatus !== 'all') || (filterFacing && filterFacing !== 'all');
            const isDimmed = hasActiveFilter && !isMatch;
            const isSearchedMatch = Boolean(cleanSearch) && String(plot.plotNumber) === cleanSearch;

            return (
              <Plot3D
                key={plot.plotNumber}
                plot={plot}
                isSelected={selectedPlot?.plotNumber === plot.plotNumber}
                isDimmed={isDimmed}
                isSearchedMatch={isSearchedMatch}
                onSelect={onSelectPlot}
                isMeasureMode={isMeasureMode}
                onMeasurePoint={onMeasurePoint}
              />
            );
          })}
        </group>

        {/* Interactive Measure Tool Line */}
        {isMeasureMode && <MeasureOverlay points={measurePoints} />}
      </Canvas>
    </div>
  );
}
