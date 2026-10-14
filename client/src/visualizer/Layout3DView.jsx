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

// Perfectly Straight, Upright Royal Avenue Tree (Zero Tilt, Zero Bending, Sits on Block Border)
function StraightAvenueTree({ position = [0, 0, 0], scale = 1.0 }) {
  // Symmetrical frond angles around vertical trunk: 10 radially balanced angles
  const angles = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

  return (
    <group position={position} scale={scale}>
      {/* 1. Raised Stone Tree-Pit Base Box on Border */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.72, 0.14, 0.72]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
      </mesh>
      {/* Dark Nutrient Soil Fill */}
      <mesh position={[0, 0.135, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.6]} />
        <meshBasicMaterial color="#2E2016" />
      </mesh>

      {/* 2. Perfectly Straight, Upright Vertical Trunk (Zero curvature, zero lean) */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.11, 0.15, 3.2, 14]} />
        <meshStandardMaterial color="#5C4533" roughness={0.85} />
      </mesh>

      {/* 3. Ornamental Support Rings / Decorative Timber Ties */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.06, 12]} />
        <meshStandardMaterial color="#854D0E" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 12]} />
        <meshStandardMaterial color="#854D0E" roughness={0.6} />
      </mesh>

      {/* 4. Upright Green Crownshaft */}
      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.65, 12]} />
        <meshStandardMaterial color="#2D5A27" roughness={0.6} />
      </mesh>
      <mesh position={[0, 3.55, 0]}>
        <sphereGeometry args={[0.15, 10, 10]} />
        <meshStandardMaterial color="#3B7D2F" roughness={0.6} />
      </mesh>

      {/* 5. Perfectly Straight Upright Fronds (Symmetrical, Elegant, Upward-pointing, NO Bending) */}
      {angles.map((ang, idx) => (
        <group
          key={idx}
          position={[0, 3.5, 0]}
          rotation={[0.38, (ang * Math.PI) / 180, 0]} // Upward elevation angle, zero roll/twist
        >
          {/* Main Leaf Stem */}
          <mesh position={[0, 0.8, 0]} scale={[0.04, 1.6, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#276749" roughness={0.5} />
          </mesh>
          {/* Lower Leaf Foliage */}
          <mesh position={[0, 0.65, 0]} scale={[0.32, 0.9, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#2F855A" roughness={0.5} />
          </mesh>
          {/* Upper Leaf Foliage */}
          <mesh position={[0, 1.3, 0]} scale={[0.22, 0.8, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#48BB78" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 6. Central Upright Vertical Spear Fronds */}
      <mesh position={[0, 4.1, 0]}>
        <cylinderGeometry args={[0.02, 0.05, 1.1, 8]} />
        <meshStandardMaterial color="#38A169" roughness={0.5} />
      </mesh>
      <mesh position={[0.03, 4.25, 0.02]}>
        <cylinderGeometry args={[0.015, 0.04, 0.9, 8]} />
        <meshStandardMaterial color="#48BB78" roughness={0.5} />
      </mesh>
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

// Authoritative Block-by-Block Avenue Borders & Straight Trees (Zero Encroachment on Plots)
const BLOCK_AVENUE_BORDERS = [
  // ==========================================
  // NORTH BLOCKS: A, B, C, D, E (Z: -42 to -3)
  // ==========================================

  // BLOCK A (Plots 25-30, X: -58 to -36)
  // North Border facing 60ft Road (Z = -43.2)
  {
    x: -46.5, z: -43.2, w: 18.0, d: 0.8, isHorizontal: true,
    trees: [[-54, -43.2], [-46.5, -43.2], [-39, -43.2]]
  },
  // East Border facing Road V1 (X = -34.8)
  {
    x: -34.8, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[-34.8, -35], [-34.8, -23], [-34.8, -11]]
  },
  // South Border facing Central Blvd (Z = -1.8)
  {
    x: -46.5, z: -1.8, w: 18.0, d: 0.8, isHorizontal: true,
    trees: [[-54, -1.8], [-46.5, -1.8], [-39, -1.8]]
  },

  // BLOCK B (Plots 17-24, X: -29 to -7)
  // West Border facing Road V1 (X = -30.2)
  {
    x: -30.2, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[-30.2, -35], [-30.2, -23], [-30.2, -11]]
  },
  // North Border facing 60ft Road (Z = -43.2)
  {
    x: -18.0, z: -43.2, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[-25, -43.2], [-18, -43.2], [-11, -43.2]]
  },
  // East Border facing Road V2 (X = -5.8)
  {
    x: -5.8, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[-5.8, -35], [-5.8, -23], [-5.8, -11]]
  },
  // South Border facing Central Blvd (Z = -1.8)
  {
    x: -18.0, z: -1.8, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[-25, -1.8], [-18, -1.8], [-11, -1.8]]
  },

  // BLOCK C (Plots 13-16, X: 0 to 22)
  // West Border facing Road V2 (X = -1.2)
  {
    x: -1.2, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[-1.2, -35], [-1.2, -23], [-1.2, -11]]
  },
  // North Border facing 60ft Road (Z = -43.2)
  {
    x: 11.0, z: -43.2, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[4, -43.2], [11, -43.2], [18, -43.2]]
  },
  // East Border facing Road V3 (X = 23.2)
  {
    x: 23.2, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[23.2, -35], [23.2, -23], [23.2, -11]]
  },
  // South Border facing Central Blvd (Z = -1.8)
  {
    x: 11.0, z: -1.8, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[4, -1.8], [11, -1.8], [18, -1.8]]
  },

  // BLOCK D (Plots 7-12, X: 29 to 50)
  // West Border facing Road V3 (X = 27.8)
  {
    x: 27.8, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[27.8, -35], [27.8, -23], [27.8, -11]]
  },
  // North Border facing 60ft Road (Z = -43.2)
  {
    x: 39.5, z: -43.2, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[33, -43.2], [39.5, -43.2], [46, -43.2]]
  },
  // East Border facing Road V4 (X = 51.2)
  {
    x: 51.2, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[51.2, -35], [51.2, -23], [51.2, -11]]
  },
  // South Border facing Central Blvd (Z = -1.8)
  {
    x: 39.5, z: -1.8, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[33, -1.8], [39.5, -1.8], [46, -1.8]]
  },

  // BLOCK E (Plots 1-6, X: 57 to 63)
  // West Border facing Road V4 (X = 55.8)
  {
    x: 55.8, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[55.8, -35], [55.8, -23], [55.8, -11]]
  },
  // East Border facing Service Road (X = 64.2)
  {
    x: 64.2, z: -23.0, w: 0.8, d: 28.0, isHorizontal: false,
    trees: [[64.2, -35], [64.2, -23], [64.2, -11]]
  },
  // South Border facing Central Blvd (Z = -1.8)
  {
    x: 60.0, z: -1.8, w: 4.5, d: 0.8, isHorizontal: true,
    trees: [[60, -1.8]]
  },

  // ==========================================
  // SOUTH BLOCKS: F, G, H, I, J, K (Z: 4 to 60)
  // ==========================================

  // BLOCK F (Plots 31-36, X: -78 to -65)
  // North Border facing Central Blvd (Z = 2.8)
  {
    x: -71.5, z: 2.8, w: 10.0, d: 0.8, isHorizontal: true,
    trees: [[-71.5, 2.8]]
  },
  // East Border facing Road V0 (X = -63.8)
  {
    x: -63.8, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[-63.8, 14], [-63.8, 26], [-63.8, 38], [-63.8, 50]]
  },

  // BLOCK G (Plots 37-46, X: -58 to -36)
  // West Border facing Road V0 (X = -59.2)
  {
    x: -59.2, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[-59.2, 14], [-59.2, 26], [-59.2, 38], [-59.2, 50]]
  },
  // North Border facing Central Blvd (Z = 2.8)
  {
    x: -46.5, z: 2.8, w: 18.0, d: 0.8, isHorizontal: true,
    trees: [[-54, 2.8], [-46.5, 2.8], [-39, 2.8]]
  },
  // East Border facing Road V1 (X = -34.8)
  {
    x: -34.8, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[-34.8, 14], [-34.8, 26], [-34.8, 38], [-34.8, 50]]
  },
  // South Border facing South Road (Z = 61.2)
  {
    x: -46.5, z: 61.2, w: 18.0, d: 0.8, isHorizontal: true,
    trees: [[-54, 61.2], [-46.5, 61.2], [-39, 61.2]]
  },

  // BLOCK H (Plots 47-58, X: -29 to -7)
  // West Border facing Road V1 (X = -30.2)
  {
    x: -30.2, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[-30.2, 14], [-30.2, 26], [-30.2, 38], [-30.2, 50]]
  },
  // North Border facing Central Blvd (Z = 2.8)
  {
    x: -18.0, z: 2.8, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[-25, 2.8], [-18, 2.8], [-11, 2.8]]
  },
  // East Border facing Road V2 (X = -5.8)
  {
    x: -5.8, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[-5.8, 14], [-5.8, 26], [-5.8, 38], [-5.8, 50]]
  },
  // South Border facing South Road (Z = 61.2)
  {
    x: -18.0, z: 61.2, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[-25, 61.2], [-18, 61.2], [-11, 61.2]]
  },

  // BLOCK I (Plots 59-70, X: 0 to 22)
  // West Border facing Road V2 (X = -1.2)
  {
    x: -1.2, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[-1.2, 14], [-1.2, 26], [-1.2, 38], [-1.2, 50]]
  },
  // North Border facing Central Blvd (Z = 2.8)
  {
    x: 11.0, z: 2.8, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[4, 2.8], [11, 2.8], [18, 2.8]]
  },
  // East Border facing Road V3 (X = 23.2)
  {
    x: 23.2, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[23.2, 14], [23.2, 26], [23.2, 38], [23.2, 50]]
  },
  // South Border facing South Road (Z = 61.2)
  {
    x: 11.0, z: 61.2, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[4, 61.2], [11, 61.2], [18, 61.2]]
  },

  // BLOCK J (Plots 71-82, X: 29 to 50)
  // West Border facing Road V3 (X = 27.8)
  {
    x: 27.8, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[27.8, 14], [27.8, 26], [27.8, 38], [27.8, 50]]
  },
  // North Border facing Central Blvd (Z = 2.8)
  {
    x: 39.5, z: 2.8, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[33, 2.8], [39.5, 2.8], [46, 2.8]]
  },
  // East Border facing Road V4 (X = 51.2)
  {
    x: 51.2, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[51.2, 14], [51.2, 26], [51.2, 38], [51.2, 50]]
  },
  // South Border facing South Road (Z = 61.2)
  {
    x: 39.5, z: 61.2, w: 16.0, d: 0.8, isHorizontal: true,
    trees: [[33, 61.2], [39.5, 61.2], [46, 61.2]]
  },

  // BLOCK K (Plots 83-96, X: 57 to 70)
  // West Border facing Road V4 (X = 55.8)
  {
    x: 55.8, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[55.8, 14], [55.8, 26], [55.8, 38], [55.8, 50]]
  },
  // North Border facing Central Blvd (Z = 2.8)
  {
    x: 63.5, z: 2.8, w: 10.0, d: 0.8, isHorizontal: true,
    trees: [[63.5, 2.8]]
  },
  // East Border facing Service Road (X = 71.2)
  {
    x: 71.2, z: 32.0, w: 0.8, d: 44.0, isHorizontal: false,
    trees: [[71.2, 14], [71.2, 26], [71.2, 38], [71.2, 50]]
  },
  // South Border facing South Road (Z = 61.2)
  {
    x: 63.5, z: 61.2, w: 10.0, d: 0.8, isHorizontal: true,
    trees: [[63.5, 61.2]]
  }
];

// Block Borders with Landscaped Turf and Straight Upright Trees (No Bending, Kept for Every Set of Blocks)
function BlockBordersAndAvenueTrees() {
  return (
    <group>
      {/* 1. Raised Concrete Curbs with Landscaped Turf Top along Every Block Perimeter */}
      {BLOCK_AVENUE_BORDERS.map((seg, idx) => (
        <group key={`border-${idx}`}>
          {/* Raised Kerb Stone Base (0.12m height above road level) */}
          <mesh position={[seg.x, 0.06, seg.z]}>
            <boxGeometry args={[seg.w, 0.12, seg.d]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.65} metalness={0.08} />
          </mesh>

          {/* Manicured Emerald Turf Planter Top Surface */}
          <mesh position={[seg.x, 0.122, seg.z]}>
            <boxGeometry args={[seg.isHorizontal ? seg.w : seg.w - 0.1, 0.01, seg.isHorizontal ? seg.d - 0.1 : seg.d]} />
            <meshStandardMaterial color="#4D7C0F" roughness={0.8} />
          </mesh>

          {/* White Painted Road Margin Line on road-facing curb edge */}
          <mesh
            position={[
              seg.x,
              0.124,
              seg.z
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[seg.isHorizontal ? seg.w : 0.08, seg.isHorizontal ? 0.08 : seg.d]} />
            <meshBasicMaterial color="#FFFFFF" opacity={0.88} transparent />
          </mesh>
        </group>
      ))}

      {/* 2. Perfectly Straight, Upright Avenue Trees on the Block Borders (Kept for every set of blocks) */}
      {BLOCK_AVENUE_BORDERS.flatMap((seg, bIdx) =>
        seg.trees.map(([tx, tz], tIdx) => (
          <StraightAvenueTree
            key={`tree-${bIdx}-${tIdx}`}
            position={[tx, 0.12, tz]}
            scale={0.92}
          />
        ))
      )}
    </group>
  );
}

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

      {/* Perimeter Straight Avenue Trees */}
      {perimeterPalms.map(([px, pz], idx) => (
        <StraightAvenueTree key={`perm-${idx}`} position={[px, 0.03, pz]} scale={0.72} />
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

        {/* Block Borders with Landscaped Turf and Straight Upright Trees (No Bending, Kept for Every Set of Blocks) */}
        <BlockBordersAndAvenueTrees />

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
