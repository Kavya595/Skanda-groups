import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  LAYOUT_BOUNDS,
  SITE_BOUNDARY_LOCAL,
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
  onResetComplete,
  apiRef
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const animatingRef = useRef(false);
  const targetPos = useRef(new THREE.Vector3(-9, 200, 7.5));
  const targetLook = useRef(new THREE.Vector3(-9, 0, 6));

  // Expose smooth zoomIn / zoomOut / reset to external toolbars
  React.useImperativeHandle(apiRef, () => ({
    zoomIn: () => {
      if (controlsRef.current) {
        controlsRef.current.dollyIn(1.38);
        controlsRef.current.update();
      }
    },
    zoomOut: () => {
      if (controlsRef.current) {
        controlsRef.current.dollyOut(1.38);
        controlsRef.current.update();
      }
    },
    reset: () => {
      targetPos.current.set(-9, 200, 7.5);
      targetLook.current.set(-9, 0, 6);
      animatingRef.current = true;
    }
  }));

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
      // High-angle 3D Geographic Regional Map View (Minimizes layout to small particle)
      targetPos.current.set(0, 520, 560);
      targetLook.current.set(0, 0, -50);
      animatingRef.current = true;
    } else if (cameraPreset === 'park' || cameraPreset === 'parkGround') {
      // Low eye-level ground perspective inside Ac. 0.758 park (exact match to Screenshots 3 & 4)
      targetPos.current.set(-73, 2.0, -14);
      targetLook.current.set(-71, 1.2, -34);
      animatingRef.current = true;
    } else if (cameraPreset === 'topDown') {
      targetPos.current.set(-9, 200, 7.5);
      targetLook.current.set(-9, 0, 6);
      animatingRef.current = true;
    } else if (cameraPreset === 'highway') {
      targetPos.current.set(78, 22, 22);
      targetLook.current.set(50, 0, -4);
      animatingRef.current = true;
    } else {
      // Overview preset (default: top-down, flat, upright, normally visible map view matching 2D)
      targetPos.current.set(-9, 200, 7.5);
      targetLook.current.set(-9, 0, 6);
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
      target={[-9, 0, 6]}
      enabled={cameraPreset !== 'roadWalk'}
      enableRotate={true}
      screenSpacePanning={true}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
      }}
      touches={{
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_ROTATE
      }}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={10}
      maxDistance={45000}
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

  const customShape = useMemo(() => {
    if (!plot.hasCustomPolygon || !plot.polygon) return null;
    const shape = new THREE.Shape();
    plot.polygon.forEach(([px, pz], idx) => {
      const lx = px - cx;
      const lz = -(pz - cz);
      if (idx === 0) shape.moveTo(lx, lz);
      else shape.lineTo(lx, lz);
    });
    shape.closePath();
    return shape;
  }, [plot.hasCustomPolygon, plot.polygon, cx, cz]);

  const customExtrudeGeom = useMemo(() => {
    if (!customShape) return null;
    return new THREE.ExtrudeGeometry(customShape, { depth: tileHeight, bevelEnabled: false });
  }, [customShape, tileHeight]);

  const customEdgesGeom = useMemo(() => {
    if (!customExtrudeGeom) return null;
    return new THREE.EdgesGeometry(customExtrudeGeom);
  }, [customExtrudeGeom]);

  return (
    <group position={[cx, posY, cz]}>
      {/* 3D Volumetric Foundation Plinth Box with Height, Width, and Depth */}
      {customShape && customExtrudeGeom ? (
        <group
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
          <mesh geometry={customExtrudeGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, -tileHeight / 2, 0]}>
            <meshStandardMaterial color={color} roughness={0.5} opacity={isDimmed ? 0.25 : 1.0} transparent={isDimmed} />
          </mesh>
          {customEdgesGeom && (
            <lineSegments geometry={customEdgesGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, -tileHeight / 2, 0]}>
              <lineBasicMaterial
                color={isSelected || isSearchedMatch ? '#FFFFFF' : '#64748B'}
                linewidth={isSelected || isSearchedMatch ? 3 : 1.5}
                opacity={isDimmed ? 0.3 : 1.0}
                transparent={isDimmed}
              />
            </lineSegments>
          )}
        </group>
      ) : (
        <>
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
        </>
      )}

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

// Authoritative Plots99 Avenue Palm Tree (Exact match to User's Uploaded Images 1 & 2: low human-scale, leaves drooping downward)
function Plots99AvenuePalm({ position = [0, 0, 0], scale = 1.0 }) {
  // 6 radial main frond angles matching user reference photos (media_1791978949814_743b6c5a.png & media_1791978967243_dc66c9dd.png)
  const frondAngles = [0, 60, 120, 180, 240, 300];
  // 4 secondary outer drooping fronds for natural fullness
  const secondaryFrondAngles = [30, 90, 210, 270];
  // 8 fibrous collar stubs
  const stubAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <group position={position} scale={scale}>
      {/* 1. Circular Stone Planter Base in Sidewalk */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.16, 0.32, 16]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 12]} />
        <meshBasicMaterial color="#33251A" />
      </mesh>

      {/* 2. Slender, Human-Scale Straight Ash-Grey Palm Trunk (~1.75m tall, matching Images 1 & 2) */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.075, 0.098, 1.76, 12]} />
        <meshStandardMaterial color="#948B7E" roughness={0.82} />
      </mesh>

      {/* 3. Fibrous Trimmed Frond Stubs Collar (Yellow/tan fibers at top of trunk) */}
      <mesh position={[0, 1.76, 0]}>
        <cylinderGeometry args={[0.11, 0.08, 0.18, 10]} />
        <meshStandardMaterial color="#C8AF58" roughness={0.7} />
      </mesh>
      {stubAngles.map((ang, idx) => (
        <mesh
          key={`stub-${idx}`}
          position={[
            Math.sin((ang * Math.PI) / 180) * 0.09,
            1.78 + (idx % 2) * 0.03,
            Math.cos((ang * Math.PI) / 180) * 0.09
          ]}
          rotation={[0.28, (ang * Math.PI) / 180, 0]}
        >
          <cylinderGeometry args={[0.018, 0.028, 0.14, 6]} />
          <meshStandardMaterial color="#D4BA6A" roughness={0.65} />
        </mesh>
      ))}

      {/* 4. Crown Node */}
      <mesh position={[0, 1.84, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#557D24" roughness={0.6} />
      </mesh>

      {/* 5. Broad Arched Tropical Banana / Palm Fronds Drooping Downward (Exact match to User Images 1 & 2) */}
      {/* Primary Tier: 6 Broad Cascading Fronds */}
      {frondAngles.map((ang, idx) => {
        const rad = (ang * Math.PI) / 180;
        return (
          <group key={`frond-${idx}`} position={[0, 1.84, 0]} rotation={[0, rad, 0]}>
            {/* Segment 1: Inner Leaf extending slightly outward */}
            <mesh position={[0.52, -0.05, 0]} rotation={[0, 0, -0.22]} scale={[1.05, 0.02, 0.52]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#6BA322" roughness={0.55} />
            </mesh>
            {/* Segment 2: Mid Leaf curving downward */}
            <mesh position={[1.28, -0.26, 0]} rotation={[0, 0, -0.46]} scale={[0.98, 0.018, 0.58]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#7DBB28" roughness={0.55} />
            </mesh>
            {/* Segment 3: Drooping Leaf Tip hanging low towards ~1.2m off ground */}
            <mesh position={[1.92, -0.58, 0]} rotation={[0, 0, -0.74]} scale={[0.82, 0.016, 0.44]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#8BC92F" roughness={0.55} />
            </mesh>
            {/* Central Frond Rib */}
            <mesh position={[1.18, -0.28, 0]} rotation={[0, 0, -0.42]} scale={[2.25, 0.028, 0.028]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#426E15" roughness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Secondary Tier: 4 Lower Drooping Fronds for Full Realistic Foliage */}
      {secondaryFrondAngles.map((ang, idx) => {
        const rad = (ang * Math.PI) / 180;
        return (
          <group key={`sec-frond-${idx}`} position={[0, 1.80, 0]} rotation={[0, rad, 0]}>
            <mesh position={[0.48, -0.08, 0]} rotation={[0, 0, -0.32]} scale={[0.95, 0.018, 0.48]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#5E931C" roughness={0.55} />
            </mesh>
            <mesh position={[1.16, -0.36, 0]} rotation={[0, 0, -0.62]} scale={[0.88, 0.016, 0.52]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#70AA22" roughness={0.55} />
            </mesh>
            <mesh position={[1.72, -0.72, 0]} rotation={[0, 0, -0.88]} scale={[0.74, 0.014, 0.38]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#7FBA28" roughness={0.55} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

const StraightAvenueTree = Plots99AvenuePalm;

// Natural Perimeter Canopy Shade Tree for Surrounding Greenery
function PerimeterCanopyTree({ position = [0, 0, 0], scale = 1.0 }) {
  return (
    <group position={position} scale={scale}>
      {/* Natural Bark Trunk */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 3.6, 8]} />
        <meshStandardMaterial color="#4A3B32" roughness={0.9} />
      </mesh>
      {/* Lower Dense Canopy Tier */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshStandardMaterial color="#2D5A27" roughness={0.7} />
      </mesh>
      {/* Upper Lush Canopy Tier */}
      <mesh position={[0, 4.6, 0]}>
        <sphereGeometry args={[1.35, 8, 8]} />
        <meshStandardMaterial color="#4E9A1A" roughness={0.65} />
      </mesh>
    </group>
  );
}

// Shared Procedural Lush Grass Turf Texture Cache
let grassTurfTextureCache = null;

function getGrassTurfTexture() {
  if (typeof document === 'undefined') return null;
  if (grassTurfTextureCache) return grassTurfTextureCache;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 1. Lush Bermuda turf green base
  ctx.fillStyle = '#6AA81A';
  ctx.fillRect(0, 0, 512, 512);

  // 2. Alternating subtle lawn mowing stripes
  const stripeW = 64;
  for (let x = 0; x < 512; x += stripeW * 2) {
    ctx.fillStyle = 'rgba(126, 196, 32, 0.16)';
    ctx.fillRect(x, 0, stripeW, 512);
  }

  // 3. Dense individual grass blades & turf stipples
  const bladeColors = [
    '#528A13', // shadow root blade
    '#68A618', // natural grass body
    '#76B820', // vibrant sunlit blade
    '#86CC28', // fresh spring tip
    '#44750F'  // deep thatch green
  ];

  for (let i = 0; i < 32000; i++) {
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    const len = Math.random() * 4.5 + 2.5;
    const bw = Math.random() * 1.6 + 0.8;
    const tilt = (Math.random() - 0.5) * 0.35;

    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(tilt);
    ctx.fillStyle = bladeColors[Math.floor(Math.random() * bladeColors.length)];
    ctx.fillRect(-bw / 2, -len, bw, len);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  grassTurfTextureCache = texture;
  return texture;
}



// High-Quality Realistic 3D Low-Poly Vehicles driving on Venture Roads
function Vehicle3D({ color }) {
  return (
    <group>
      {/* Aerodynamic Car Body with glossy finish */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.45, 0.38, 2.7]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Cabin Roof / Tinted Glass Canopy */}
      <mesh position={[0, 0.62, -0.1]}>
        <boxGeometry args={[1.18, 0.32, 1.55]} />
        <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Front Windshield Tint */}
      <mesh position={[0, 0.58, 0.7]} rotation={[0.45, 0, 0]}>
        <planeGeometry args={[1.1, 0.35]} />
        <meshStandardMaterial color="#1E293B" roughness={0.1} />
      </mesh>
      {/* Rear Windshield Tint */}
      <mesh position={[0, 0.58, -0.9]} rotation={[-0.45, Math.PI, 0]}>
        <planeGeometry args={[1.1, 0.35]} />
        <meshStandardMaterial color="#1E293B" roughness={0.1} />
      </mesh>
      {/* Dual Glowing LED Headlights */}
      <mesh position={[-0.45, 0.32, 1.36]}>
        <boxGeometry args={[0.22, 0.12, 0.04]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <mesh position={[0.45, 0.32, 1.36]}>
        <boxGeometry args={[0.22, 0.12, 0.04]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      {/* Dual Red LED Taillights */}
      <mesh position={[-0.45, 0.32, -1.36]}>
        <boxGeometry args={[0.22, 0.12, 0.04]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[0.45, 0.32, -1.36]}>
        <boxGeometry args={[0.22, 0.12, 0.04]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      {/* 4 Rubber Wheels with Silver Hubs */}
      {[-0.74, 0.74].map((wx, i) =>
        [-0.82, 0.82].map((wz, j) => (
          <group key={`${i}-${j}`} position={[wx, 0.16, wz]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.14, 12]} />
              <meshStandardMaterial color="#111827" roughness={0.8} />
            </mesh>
            <mesh position={[wx > 0 ? 0.075 : -0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <circleGeometry args={[0.09, 8]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

// Moving Vehicles across Highway AND Venture Roads
function MovingVehicles3D({ animate = true }) {
  const hwySouthRef = useRef();
  const hwyNorthRef = useRef();
  const road60EastRef = useRef();
  const road60WestRef = useRef();
  const roadMidEastRef = useRef();
  const roadMidWestRef = useRef();
  const roadV2Ref = useRef();

  useFrame((_, delta) => {
    if (!animate) return;
    // 1. Srisailam Highway Southbound (White SUV)
    if (hwySouthRef.current) {
      hwySouthRef.current.position.z += delta * 16;
      if (hwySouthRef.current.position.z > 66) hwySouthRef.current.position.z = -56;
    }
    // 2. Srisailam Highway Northbound (Emerald Green Sedan)
    if (hwyNorthRef.current) {
      hwyNorthRef.current.position.z -= delta * 15;
      if (hwyNorthRef.current.position.z < -56) hwyNorthRef.current.position.z = 66;
    }
    // 3. 60ft Road Eastbound (Silver Sedan)
    if (road60EastRef.current) {
      road60EastRef.current.position.x += delta * 13;
      if (road60EastRef.current.position.x > 74) road60EastRef.current.position.x = -88;
    }
    // 4. 60ft Road Westbound (Royal Blue Sedan)
    if (road60WestRef.current) {
      road60WestRef.current.position.x -= delta * 12;
      if (road60WestRef.current.position.x < -88) road60WestRef.current.position.x = 74;
    }
    // 5. 33ft Central Boulevard Eastbound (Ruby Red Sedan matching Plots99 photo!)
    if (roadMidEastRef.current) {
      roadMidEastRef.current.position.x += delta * 9.5;
      if (roadMidEastRef.current.position.x > 62) roadMidEastRef.current.position.x = -72;
    }
    // 6. 33ft Central Boulevard Westbound (Warm Amber Compact)
    if (roadMidWestRef.current) {
      roadMidWestRef.current.position.x -= delta * 8.5;
      if (roadMidWestRef.current.position.x < -72) roadMidWestRef.current.position.x = 62;
    }
    // 7. Internal Cross Street Road V2 Southbound (Violet Crossover)
    if (roadV2Ref.current) {
      roadV2Ref.current.position.z += delta * 8;
      if (roadV2Ref.current.position.z > 58) roadV2Ref.current.position.z = -38;
    }
  });

  return (
    <group>
      {/* 1. Srisailam Highway: White SUV (Southbound) */}
      <group ref={hwySouthRef} position={[77, 0, -25]}>
        <Vehicle3D color="#F8FAFC" />
      </group>
      {/* 2. Srisailam Highway: Emerald Green Sedan (Northbound) */}
      <group ref={hwyNorthRef} position={[83, 0, 35]} rotation={[0, Math.PI, 0]}>
        <Vehicle3D color="#059669" />
      </group>
      {/* 3. 60ft Arterial Road: Silver Sedan (Eastbound towards Highway) */}
      <group ref={road60EastRef} position={[-40, 0, -44.5]} rotation={[0, Math.PI / 2, 0]}>
        <Vehicle3D color="#E2E8F0" />
      </group>
      {/* 4. 60ft Arterial Road: Royal Blue Sedan (Westbound) */}
      <group ref={road60WestRef} position={[30, 0, -49.5]} rotation={[0, -Math.PI / 2, 0]}>
        <Vehicle3D color="#2563EB" />
      </group>
      {/* 5. 33ft Central Boulevard: Ruby Red Sedan (Eastbound, matching Plots99 photo!) */}
      <group ref={roadMidEastRef} position={[-20, 0, 1.8]} rotation={[0, Math.PI / 2, 0]}>
        <Vehicle3D color="#DC2626" />
      </group>
      {/* 6. 33ft Central Boulevard: Warm Amber Compact (Westbound) */}
      <group ref={roadMidWestRef} position={[40, 0, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
        <Vehicle3D color="#D97706" />
      </group>
      {/* 7. Internal Cross Street Road V2: Violet Crossover (Southbound) */}
      <group ref={roadV2Ref} position={[-3.5, 0, 15]}>
        <Vehicle3D color="#7C3AED" />
      </group>
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

// Authoritative Block-by-Block Avenue Borders & Straight Trees
// Placed strictly along internal streets in between blocks all the way through; zero trees at entrance or corners
const BLOCK_AVENUE_BORDERS = [
  // ==========================================
  // NORTH STREETS (IN BETWEEN BLOCKS, Z: -40 to -5)
  // Continuous avenue palm trees lining both curbs of each internal avenue
  // Spaced at ~5m, keeping 60' road & 33' MID road intersections clear
  // ==========================================

  // Avenue V1 (Between Block A and Block B)
  {
    x: -34.8, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[-34.8, -37], [-34.8, -32], [-34.8, -27], [-34.8, -22], [-34.8, -17], [-34.8, -12], [-34.8, -7]]
  },
  {
    x: -30.2, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[-30.2, -37], [-30.2, -32], [-30.2, -27], [-30.2, -22], [-30.2, -17], [-30.2, -12], [-30.2, -7]]
  },

  // Avenue V2 (Between Block B and Block C)
  {
    x: -5.8, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[-5.8, -37], [-5.8, -32], [-5.8, -27], [-5.8, -22], [-5.8, -17], [-5.8, -12], [-5.8, -7]]
  },
  {
    x: -1.2, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[-1.2, -37], [-1.2, -32], [-1.2, -27], [-1.2, -22], [-1.2, -17], [-1.2, -12], [-1.2, -7]]
  },

  // Avenue V3 (Between Block C and Block D)
  {
    x: 23.2, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[23.2, -37], [23.2, -32], [23.2, -27], [23.2, -22], [23.2, -17], [23.2, -12], [23.2, -7]]
  },
  {
    x: 27.8, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[27.8, -37], [27.8, -32], [27.8, -27], [27.8, -22], [27.8, -17], [27.8, -12], [27.8, -7]]
  },

  // Avenue V4 (Between Block D and Block E)
  {
    x: 51.2, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[51.2, -37], [51.2, -32], [51.2, -27], [51.2, -22], [51.2, -17], [51.2, -12], [51.2, -7]]
  },
  {
    x: 55.8, z: -22.5, w: 0.8, d: 33.0, isHorizontal: false,
    trees: [[55.8, -37], [55.8, -32], [55.8, -27], [55.8, -22], [55.8, -17], [55.8, -12], [55.8, -7]]
  },

  // ==========================================
  // SOUTH STREETS (IN BETWEEN BLOCKS, Z: 6 to 65)
  // Continuous avenue palm trees lining both curbs all the way along the street
  // ==========================================

  // Avenue V0 (Between Block F and Block G)
  {
    x: -63.8, z: 27.0, w: 0.8, d: 40.0, isHorizontal: false,
    trees: [[-63.8, 9], [-63.8, 15], [-63.8, 21], [-63.8, 27], [-63.8, 33], [-63.8, 39], [-63.8, 45]]
  },
  {
    x: -59.2, z: 27.0, w: 0.8, d: 40.0, isHorizontal: false,
    trees: [[-59.2, 9], [-59.2, 15], [-59.2, 21], [-59.2, 27], [-59.2, 33], [-59.2, 39], [-59.2, 45]]
  },

  // Avenue V1 (Between Block G and Block H)
  {
    x: -34.8, z: 34.0, w: 0.8, d: 52.0, isHorizontal: false,
    trees: [[-34.8, 9], [-34.8, 14], [-34.8, 19], [-34.8, 24], [-34.8, 29], [-34.8, 34], [-34.8, 39], [-34.8, 44], [-34.8, 49], [-34.8, 54], [-34.8, 58]]
  },
  {
    x: -30.2, z: 34.0, w: 0.8, d: 52.0, isHorizontal: false,
    trees: [[-30.2, 9], [-30.2, 14], [-30.2, 19], [-30.2, 24], [-30.2, 29], [-30.2, 34], [-30.2, 39], [-30.2, 44], [-30.2, 49], [-30.2, 54], [-30.2, 58]]
  },

  // Avenue V2 (Between Block H and Block I)
  {
    x: -5.8, z: 34.0, w: 0.8, d: 52.0, isHorizontal: false,
    trees: [[-5.8, 9], [-5.8, 14], [-5.8, 19], [-5.8, 24], [-5.8, 29], [-5.8, 34], [-5.8, 39], [-5.8, 44], [-5.8, 49], [-5.8, 54], [-5.8, 58]]
  },
  {
    x: -1.2, z: 34.0, w: 0.8, d: 52.0, isHorizontal: false,
    trees: [[-1.2, 9], [-1.2, 14], [-1.2, 19], [-1.2, 24], [-1.2, 29], [-1.2, 34], [-1.2, 39], [-1.2, 44], [-1.2, 49], [-1.2, 54], [-1.2, 58]]
  },

  // Avenue V3 (Between Block I and Block J)
  {
    x: 23.2, z: 34.0, w: 0.8, d: 52.0, isHorizontal: false,
    trees: [[23.2, 9], [23.2, 14], [23.2, 19], [23.2, 24], [23.2, 29], [23.2, 34], [23.2, 39], [23.2, 44], [23.2, 49], [23.2, 54], [23.2, 58]]
  },
  {
    x: 27.8, z: 34.0, w: 0.8, d: 52.0, isHorizontal: false,
    trees: [[27.8, 9], [27.8, 14], [27.8, 19], [27.8, 24], [27.8, 29], [27.8, 34], [27.8, 39], [27.8, 44], [27.8, 49], [27.8, 54], [27.8, 58]]
  },

  // Avenue V4 (Between Block J and Block K)
  {
    x: 51.2, z: 35.5, w: 0.8, d: 55.0, isHorizontal: false,
    trees: [[51.2, 9], [51.2, 14], [51.2, 19], [51.2, 24], [51.2, 29], [51.2, 34], [51.2, 39], [51.2, 44], [51.2, 49], [51.2, 54], [51.2, 59], [51.2, 63]]
  },
  {
    x: 55.8, z: 35.5, w: 0.8, d: 55.0, isHorizontal: false,
    trees: [[55.8, 9], [55.8, 14], [55.8, 19], [55.8, 24], [55.8, 29], [55.8, 34], [55.8, 39], [55.8, 44], [55.8, 49], [55.8, 54], [55.8, 59], [55.8, 63]]
  },

  // ==========================================
  // CENTRAL 33' MAIN BOULEVARD (BETWEEN NORTH & SOUTH BLOCKS, Z: -4.5 to 5.5)
  // Continuous avenue palm trees lining both curbs of 33' Boulevard strictly in between blocks
  // ==========================================
  // North Curb of 33' Boulevard (Facing North Blocks A, B, C, D)
  {
    x: -47.0, z: -4.5, w: 22.0, d: 0.8, isHorizontal: true,
    trees: [[-55, -4.5], [-49, -4.5], [-43, -4.5], [-37, -4.5]]
  },
  {
    x: -18.0, z: -4.5, w: 20.0, d: 0.8, isHorizontal: true,
    trees: [[-26, -4.5], [-20, -4.5], [-14, -4.5], [-8, -4.5]]
  },
  {
    x: 11.0, z: -4.5, w: 20.0, d: 0.8, isHorizontal: true,
    trees: [[3, -4.5], [9, -4.5], [15, -4.5]]
  },
  {
    x: 39.5, z: -4.5, w: 19.0, d: 0.8, isHorizontal: true,
    trees: [[32, -4.5], [38, -4.5], [44, -4.5]]
  },

  // South Curb of 33' Boulevard (Facing South Blocks F, G, H, I, J)
  {
    x: -47.0, z: 5.5, w: 22.0, d: 0.8, isHorizontal: true,
    trees: [[-55, 5.5], [-49, 5.5], [-43, 5.5], [-37, 5.5]]
  },
  {
    x: -18.0, z: 5.5, w: 20.0, d: 0.8, isHorizontal: true,
    trees: [[-26, 5.5], [-20, 5.5], [-14, 5.5], [-8, 5.5]]
  },
  {
    x: 11.0, z: 5.5, w: 20.0, d: 0.8, isHorizontal: true,
    trees: [[3, 5.5], [9, 5.5], [15, 5.5]]
  },
  {
    x: 39.5, z: 5.5, w: 19.0, d: 0.8, isHorizontal: true,
    trees: [[32, 5.5], [38, 5.5], [44, 5.5]]
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
            <meshStandardMaterial color="#68A816" roughness={0.8} />
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

  // Procedural Park Grass Turf Texture
  const parkGrassTexture = useMemo(() => {
    const base = getGrassTurfTexture();
    if (!base) return null;
    const tex = base.clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 8);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (onParkClick) onParkClick();
      }}
    >
      {/* Vibrant Grass Lawn with Natural Turf Texture */}
      <mesh position={[cx, 0.03, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          map={parkGrassTexture || undefined}
          color="#72B31E"
          roughness={0.85}
        />
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

// Module-level caches for pure 2D Canvas elements (Safe across WebGL context recreations)
let cachedLocalCanvas = null;
let cachedRegionalCanvas = null;

// Dual-Resolution Full Geographic Map Terrain
// Tier 1 (Zoom 18): High-Definition ~880m local layout ground
// Tier 2 (Zoom 12): Full Regional ~65.5km panorama (Shadnagar, Keshampet, Amangal, Kadthal, Kandukur, Yacharam, NH-765)
function GeographicMapTerrain() {
  const [localTilesLoaded, setLocalTilesLoaded] = useState(0);
  const [regionalTilesLoaded, setRegionalTilesLoaded] = useState(0);

  // Exact DTCP layout compound base shape matching brochure cuts
  const compoundShape = useMemo(() => {
    const shape = new THREE.Shape();
    SITE_BOUNDARY_LOCAL.forEach(([x, z], idx) => {
      // In Three.js, rotating [-PI/2, 0, 0] maps 2D (x, y) to 3D (x, 0, -y). So y = -z.
      if (idx === 0) shape.moveTo(x, -z);
      else shape.lineTo(x, -z);
    });
    shape.closePath();
    return shape;
  }, []);

  // Perimeter fencing points tracing the exact brochure cuts
  const fencePoints = useMemo(() => {
    const pts = SITE_BOUNDARY_LOCAL.map(([x, z]) => new THREE.Vector3(x, 0.015, z));
    pts.push(new THREE.Vector3(SITE_BOUNDARY_LOCAL[0][0], 0.015, SITE_BOUNDARY_LOCAL[0][1]));
    return pts;
  }, []);

  // 1. Regional Canvas (Zoom 12: 1792x1792 covering 65.5 km from Shadnagar to Yacharam and Shamshabad to Amangal)
  const regionalCanvas = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1792;
    canvas.height = 1792;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#E5ECE3';
    ctx.fillRect(0, 0, 1792, 1792);
    return canvas;
  }, []);

  const regionalTexture = useMemo(() => {
    if (!regionalCanvas) return null;
    const tex = new THREE.CanvasTexture(regionalCanvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [regionalCanvas]);

  // 2. Local Canvas (Zoom 18: 1536x1536 covering 877.4m directly around layout)
  const localCanvas = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1536;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#E5ECE3';
    ctx.fillRect(0, 0, 1536, 1536);
    return canvas;
  }, []);

  const localTexture = useMemo(() => {
    if (!localCanvas) return null;
    const tex = new THREE.CanvasTexture(localCanvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [localCanvas]);

  useEffect(() => {
    return () => {
      localTexture?.dispose();
      regionalTexture?.dispose();
    };
  }, [localTexture, regionalTexture]);

  // Stream Regional Zoom 12 tiles (Entire region matching 2D Zoom-out view in Image 1)
  useEffect(() => {
    if (!regionalCanvas) return;
    const ctx = regionalCanvas.getContext('2d');
    const zoom = 12;
    const minTx = 2938;
    const minTy = 1849;
    const xCenter = 2941.2978;
    const yCenter = 1852.2051;

    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const tx = minTx + dx;
        const ty = minTy + dy;
        const cx = Math.round(896 + (tx - xCenter) * 256);
        const cy = Math.round(896 + (ty - yCenter) * 256);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            ctx.drawImage(img, cx, cy, 256, 256);
            if (regionalTexture) {
              regionalTexture.needsUpdate = true;
              setRegionalTilesLoaded(c => c + 1);
            }
          } catch (e) {
            console.warn('Regional tile draw warning:', e);
          }
        };

        img.onerror = () => {
          const fallback = new Image();
          fallback.crossOrigin = 'anonymous';
          fallback.onload = () => {
            try {
              ctx.drawImage(fallback, cx, cy, 256, 256);
              if (regionalTexture) {
                regionalTexture.needsUpdate = true;
                setRegionalTilesLoaded(c => c + 1);
              }
            } catch (e) {}
          };
          fallback.src = `/api/tiles/${zoom}/${tx}/${ty}.png?type=osm`;
        };

        img.src = `/api/tiles/${zoom}/${tx}/${ty}.png?type=google`;
      }
    }
  }, [regionalCanvas, regionalTexture]);

  // Stream Local Zoom 18 tiles (Venture grounds matching 2D Close-up view in Image 2)
  useEffect(() => {
    if (!localCanvas) return;
    const ctx = localCanvas.getContext('2d');
    const zoom = 18;
    const minTx = 188240;
    const minTy = 118538;
    const xCenter = 188243.0578;
    const yCenter = 118541.1257;

    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const tx = minTx + dx;
        const ty = minTy + dy;
        const cx = Math.round(768 + (tx - xCenter) * 256);
        const cy = Math.round(768 + (ty - yCenter) * 256);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          try {
            ctx.drawImage(img, cx, cy, 256, 256);
            if (localTexture) {
              localTexture.needsUpdate = true;
              setLocalTilesLoaded(c => c + 1);
            }
          } catch (e) {
            console.warn('Local tile draw warning:', e);
          }
        };

        img.onerror = () => {
          const fallback = new Image();
          fallback.crossOrigin = 'anonymous';
          fallback.onload = () => {
            try {
              ctx.drawImage(fallback, cx, cy, 256, 256);
              if (localTexture) {
                localTexture.needsUpdate = true;
                setLocalTilesLoaded(c => c + 1);
              }
            } catch (e) {}
          };
          fallback.src = `/api/tiles/${zoom}/${tx}/${ty}.png?type=osm`;
        };

        img.src = `/api/tiles/${zoom}/${tx}/${ty}.png?type=google`;
      }
    }
  }, [localCanvas, localTexture]);

  return (
    <group>
      {/* 1. Full 65.5-Kilometer Regional Terrain Plane (Zoom 12: Shadnagar, Keshampet, Amangal, Kadthal, Kandukur, Yacharam, NH-765) */}
      <mesh position={[0, -0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <planeGeometry args={[65510, 65510]} />
        <meshBasicMaterial
          key={`reg-mat-${regionalTilesLoaded}`}
          map={regionalTexture || undefined}
          color={regionalTexture ? '#FFFFFF' : '#E5ECE3'}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Crisp Local Google Maps Roadmap Tile Plane (Zoom 18: ~877m coverage centered directly under layout) */}
      <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <planeGeometry args={[877.4, 877.4]} />
        <meshBasicMaterial
          key={`loc-mat-${localTilesLoaded}`}
          map={localTexture || undefined}
          color={localTexture ? '#FFFFFF' : '#E5ECE3'}
          depthWrite={false}
        />
      </mesh>

      {/* DTCP Sanctioned Layout Compound Base Ground Tile (Exact brochure cuts polygon with matching 0.35 opacity) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <shapeGeometry args={[compoundShape]} />
        <meshBasicMaterial
          color="#F0FDF4"
          opacity={0.35}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* DTCP Sanctioned Layout Boundary Perimeter Fencing following exact cuts */}
      <Line points={fencePoints} color="#15803D" lineWidth={3.5} />

      {/* 4th Phase road opening markers matching brochure */}
      {[
        [-61.5, 53.5], // Road V0 opening to 4th Phase
        [-32.5, 65.5], // Road V1 opening to 4th Phase
        [-3.5, 65.5],  // Road V2 opening to 4th Phase
        [25.5, 65.5],  // Road V3 opening to 4th Phase
        [53.5, 69.0]   // Road V4 opening to 4th Phase
      ].map(([px, pz], i) => (
        <Text
          key={`phase4-3d-${i}`}
          position={[px, 0.035, pz]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1.2}
          color="#94A3B8"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          &darr; 4th Phase
        </Text>
      ))}

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

const Layout3DView = React.forwardRef(function Layout3DView({
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
}, ref) {
  const cleanSearch = (searchTerm || '').trim();
  const bgColor = '#E5ECE3';

  return (
    <div className={`w-full h-full relative bg-[#E5ECE3] select-none ${cameraPreset === 'roadWalk' ? 'cursor-grab active:cursor-grabbing' : ''}`}>
      <Canvas
        shadows={false} // NO SHADOWS per user directive
        className={cameraPreset === 'roadWalk' ? 'cursor-grab active:cursor-grabbing' : ''}
        camera={{ position: [-9, 200, 7.5], fov: 42, near: 0.5, far: 90000 }}
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
          apiRef={ref}
        />

        {/* Real-World Geographic Kadthal Map Terrain with DTCP Sanctioned Layout Boundary & Landmarks */}
        <GeographicMapTerrain />


        {/* Connected Asphalt Road Network with Sidewalks */}
        <ConnectedRoadNetwork onRoadClick={onRoadClick} />

        {/* Ac. 0.758 Park Area with Flowers, Perimeter Palms & Cycads */}
        <ParkArea3D onParkClick={onParkClick} />

        {/* Block Borders with Landscaped Turf and Straight Upright Trees (No Bending, Kept for Every Set of Blocks) */}
        <BlockBordersAndAvenueTrees />

        {/* Moving Vehicles across Highway AND Venture Roads */}
        <MovingVehicles3D animate={animateVehicles} />

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
});

export default Layout3DView;
