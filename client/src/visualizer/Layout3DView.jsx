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
    id: 'road-mid-33',
    name: "33' Internal Main Boulevard",
    shortName: "33' Road",
    startX: -58,
    endX: 58,
    z: 0.5,
    dir: 'east',
    cameraHeight: 2.1,
    lookAhead: 15
  },
  {
    id: 'road-v1-33',
    name: "33' Vertical Avenue 1 (West)",
    shortName: "Avenue 1",
    x: -32.5,
    startZ: 50,
    endZ: -38,
    dir: 'north',
    cameraHeight: 2.1,
    lookAhead: 15
  },
  {
    id: 'road-v3-33',
    name: "33' Vertical Avenue 3 (East)",
    shortName: "Avenue 3",
    x: 25.5,
    startZ: 50,
    endZ: -38,
    dir: 'north',
    cameraHeight: 2.1,
    lookAhead: 15
  },
  {
    id: 'road-top-60',
    name: "60' Arterial Road (to Maisigandi Temple)",
    shortName: "60' Road",
    startX: -78,
    endX: 72,
    z: -47,
    dir: 'east',
    cameraHeight: 2.3,
    lookAhead: 18
  },
  {
    id: 'road-hwy-100',
    name: "Srisailam Highway (NH 765)",
    shortName: "NH-765",
    x: 77,
    startZ: -48,
    endZ: 58,
    dir: 'south',
    cameraHeight: 2.6,
    lookAhead: 20
  }
];

// Camera Controller for Smooth Transitions, Street Walk, and Park Ground Inspections
function CameraController({
  selectedPlot,
  cameraPreset,
  walkRoadIndex = 0,
  walkProgress = 0,
  onResetComplete
}) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const animatingRef = useRef(false);
  const targetPos = useRef(new THREE.Vector3(0, 68, 76));
  const targetLook = useRef(new THREE.Vector3(0, 0, 4));

  useEffect(() => {
    if (selectedPlot && selectedPlot.center) {
      const [cx, cz] = selectedPlot.center;
      targetPos.current.set(cx, 20, cz + 18);
      targetLook.current.set(cx, 0.1, cz);
      animatingRef.current = true;
    } else if (cameraPreset === 'roadWalk') {
      // Human eye-level Street Walk mode along the roads
      const road = WALK_ROADS[walkRoadIndex] || WALK_ROADS[0];
      const prog = Math.max(0, Math.min(1, walkProgress));

      if (road.dir === 'east') {
        const curX = road.startX + (road.endX - road.startX) * prog;
        targetPos.current.set(curX, road.cameraHeight, road.z);
        targetLook.current.set(curX + road.lookAhead, road.cameraHeight * 0.9, road.z);
      } else if (road.dir === 'north') {
        const curZ = road.startZ + (road.endZ - road.startZ) * prog;
        targetPos.current.set(road.x, road.cameraHeight, curZ);
        targetLook.current.set(road.x, road.cameraHeight * 0.9, curZ - road.lookAhead);
      } else if (road.dir === 'south') {
        const curZ = road.startZ + (road.endZ - road.startZ) * prog;
        targetPos.current.set(road.x, road.cameraHeight, curZ);
        targetLook.current.set(road.x, road.cameraHeight * 0.9, curZ + road.lookAhead);
      }
      animatingRef.current = true;
    } else if (cameraPreset === 'parkGround') {
      // Ground-level walk view inside Ac. 0.758 park (matching Screenshot 5)
      targetPos.current.set(-74, 1.4, -18);
      targetLook.current.set(-71, 0.9, -32);
      animatingRef.current = true;
    } else if (cameraPreset === 'park') {
      // Elevated isometric view of the park (matching Screenshot 2 & 4)
      targetPos.current.set(-73, 32, -4);
      targetLook.current.set(-73, 0.1, -26);
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
  }, [selectedPlot, cameraPreset, walkRoadIndex, walkProgress]);

  useFrame((_, delta) => {
    if (animatingRef.current && controlsRef.current) {
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
      maxPolarAngle={cameraPreset === 'roadWalk' || cameraPreset === 'parkGround' ? Math.PI / 2.02 : Math.PI / 2.08}
      minDistance={cameraPreset === 'roadWalk' || cameraPreset === 'parkGround' ? 1.5 : 4}
      maxDistance={170}
      enableDamping
      dampingFactor={0.06}
    />
  );
}

// Flat Master Plot Tile (Bold legible numbers, dimension labels, zero gaps)
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
    if (isSelected) return '#F15A24'; // Skandha Brand Orange
    if (isSearchedMatch) return '#EA580C';
    if (hovered) return '#FB923C';
    return meta.threeColor;
  }, [plot.status, isSelected, isSearchedMatch, hovered, meta.threeColor]);

  const elevY = isSelected ? 0.38 : isSearchedMatch ? 0.28 : hovered ? 0.16 : isDimmed ? 0.02 : 0.04;
  const [cx, cz] = plot.center || [0, 0];
  const w = plot.bounds?.width || 10;
  const d = plot.bounds?.depth || 10;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isMeasureMode && onMeasurePoint) {
      onMeasurePoint([cx, 0.4, cz]);
    } else {
      onSelect(plot);
    }
  };

  return (
    <group position={[cx, elevY, cz]}>
      {/* Plot Flat Surface Mesh */}
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
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial
          color={color}
          opacity={isDimmed ? 0.22 : 1.0}
          transparent={isDimmed}
        />
      </mesh>

      {/* Crisp Demarcation Boundary Lines */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial
          color={isSelected || isSearchedMatch ? '#FFFFFF' : isDimmed ? '#94A3B8' : '#CBD5E1'}
          linewidth={isSelected || isSearchedMatch ? 3 : 1.2}
          opacity={isDimmed ? 0.3 : (isSelected || isSearchedMatch ? 1.0 : 0.9)}
          transparent
        />
      </lineSegments>

      {/* Glowing Target Ring on Searched Match */}
      {isSearchedMatch && (
        <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[Math.min(w, d) * 0.38, Math.min(w, d) * 0.46, 32]} />
            <meshBasicMaterial color="#EA580C" />
          </mesh>
        </group>
      )}

      {/* When Selected: Center Circular White Badge */}
      {isSelected ? (
        <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh position={[0, 0, -0.002]}>
            <circleGeometry args={[Math.min(w, d) * 0.36, 32]} />
            <meshBasicMaterial color="#94A3B8" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <circleGeometry args={[Math.min(w, d) * 0.34, 32]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[Math.min(w, d) * 0.52, 0.08]} />
            <meshBasicMaterial color="#CBD5E1" />
          </mesh>
          <Text
            position={[0, Math.min(w, d) * 0.14, 0.01]}
            fontSize={Math.min(w, d) * 0.2}
            color="#0F172A"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
          >
            {String(plot.plotNumber)}
          </Text>
          <Text
            position={[0, -Math.min(w, d) * 0.14, 0.01]}
            fontSize={Math.min(w, d) * 0.12}
            color="#64748B"
            fontWeight="600"
            anchorX="center"
            anchorY="middle"
          >
            {`${plot.areaSqYds} yd²`}
          </Text>
        </group>
      ) : (
        /* When Unselected: Bold Number on Surface */
        <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            fontSize={Math.min(w, d) * 0.32 > 1.85 ? 1.85 : Math.max(Math.min(w, d) * 0.28, 1.35)}
            color={plot.status === 'sold' ? '#7F1D1D' : '#1E293B'}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {String(plot.plotNumber)}
          </Text>
        </group>
      )}

      {/* Edge Dimensions when Selected or Hovered (matching Screenshot 3: 50', 30') */}
      {(isSelected || hovered) && (
        <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

// Realistic Broad Tropical Palm Tree along avenue stone curbs (Matching Image 4 & 5)
function PalmTree({ position = [0, 0, 0], scale = 1.0 }) {
  const leafAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <group position={position} scale={scale}>
      {/* Soft circular contact shadow on stone curb */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.25} transparent />
      </mesh>

      {/* Slender Tapered Textured Trunk */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.11, 0.18, 2.8, 8]} />
        <meshStandardMaterial color="#785B3A" roughness={0.9} />
      </mesh>

      {/* Crown Joint */}
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#5C4528" roughness={0.8} />
      </mesh>

      {/* 8 Compact Tropical Fronds radiating and drooping down (reduced length for realism) */}
      {leafAngles.map((angle, idx) => (
        <group
          key={idx}
          position={[0, 2.75, 0]}
          rotation={[0.32, (angle * Math.PI) / 180, -0.42]}
        >
          {/* Inner Frond Arch (compact realistic length) */}
          <mesh position={[0.75, -0.12, 0]} rotation={[0, 0, -0.22]} scale={[1.35, 0.05, 0.72]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#65A30D" roughness={0.65} />
          </mesh>
          {/* Outer Drooping Tip (compact realistic length) */}
          <mesh position={[1.5, -0.42, 0]} rotation={[0, 0, -0.52]} scale={[0.85, 0.04, 0.52]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#84CC16" roughness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Low Cycad Palm Shrub for the Park Lawn (matching Screenshot 4 & 5)
function ParkCycadShrub({ position = [0, 0, 0], scale = 1.0 }) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <group position={position} scale={scale}>
      {/* Small Brown Trunk Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.38, 6]} />
        <meshBasicMaterial color="#6E563B" />
      </mesh>

      {/* Radiating Arching Leaves */}
      {angles.map((ang, idx) => (
        <group key={idx} position={[0, 0.35, 0]} rotation={[0.4, (ang * Math.PI) / 180, -0.3]}>
          <mesh position={[0.65, -0.1, 0]} rotation={[0, 0, -0.2]} scale={[1.2, 0.04, 0.42]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#558B1F" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Little Flower Patch for Park Lawn (matching Screenshot 1 & 5: white and orange flowers)
function FlowerPatch({ position = [0, 0, 0], isOrange = false }) {
  return (
    <group position={position}>
      {/* 4 Petals Disk */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 5]} />
        <meshBasicMaterial color={isOrange ? '#FB923C' : '#FFFFFF'} />
      </mesh>
      {/* Flower Core */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 6]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>
    </group>
  );
}

// Avenue Landscaping along Road Curbs
function Landscaping() {
  const trees = useMemo(() => {
    const list = [];
    // Palm trees along 60ft Road curb (both sides, layout interior only, removed from highway route x > 56)
    for (let x = -86; x <= 56; x += 11) {
      list.push({ pos: [x, 0.18, -52.9], scale: 1.1 });
      list.push({ pos: [x, 0.18, -41.1], scale: 1.1 });
    }
    // Palm trees along Mid 33ft Road curbs (both sides, layout interior only, removed from highway route x > 56)
    for (let x = -58; x <= 56; x += 11) {
      list.push({ pos: [x, 0.18, -3.9], scale: 0.96 });
      list.push({ pos: [x, 0.18, 4.9], scale: 0.96 });
    }
    // Palm trees along Vertical Roads V1 & V3 (both sides)
    for (let z = 9; z <= 54; z += 10) {
      list.push({ pos: [-36.9, 0.18, z], scale: 0.92 });
      list.push({ pos: [-28.1, 0.18, z], scale: 0.92 });
      list.push({ pos: [21.1, 0.18, z], scale: 0.92 });
      list.push({ pos: [29.9, 0.18, z], scale: 0.92 });
    }
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

// Low-poly Moving Vehicles (matching Screenshot 3: Red sedan on road!)
function LowPolyCar({ color = '#FFFFFF', position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[1.5, 0.48, 2.8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.72, -0.15]}>
        <boxGeometry args={[1.2, 0.38, 1.7]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.45, 0.38, 1.42]}>
        <boxGeometry args={[0.22, 0.14, 0.05]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <mesh position={[0.45, 0.38, 1.42]}>
        <boxGeometry args={[0.22, 0.14, 0.05]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      {/* Wheels */}
      {[-0.75, 0.75].map((wx, i) =>
        [-0.85, 0.85].map((wz, j) => (
          <mesh key={`${i}-${j}`} position={[wx, 0.18, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.16, 8]} />
            <meshBasicMaterial color="#0F172A" />
          </mesh>
        ))
      )}
    </group>
  );
}

// Moving Vehicles across Highway AND Internal Layout Roads (Screenshot 3 Red Sedan!)
function MovingVehicles({ animate }) {
  const hwySouthRef = useRef();
  const hwyNorthRef = useRef();
  const road60Ref = useRef();
  const roadMidEastRef = useRef();
  const roadV1SouthRef = useRef();
  const roadV3NorthRef = useRef();

  useFrame((_, delta) => {
    if (!animate) return;
    // Srisailam Highway Southbound
    if (hwySouthRef.current) {
      hwySouthRef.current.position.z += delta * 15;
      if (hwySouthRef.current.position.z > 62) hwySouthRef.current.position.z = -54;
    }
    // Srisailam Highway Northbound
    if (hwyNorthRef.current) {
      hwyNorthRef.current.position.z -= delta * 13;
      if (hwyNorthRef.current.position.z < -54) hwyNorthRef.current.position.z = 62;
    }
    // 60ft Arterial Road
    if (road60Ref.current) {
      road60Ref.current.position.x += delta * 12;
      if (road60Ref.current.position.x > 84) road60Ref.current.position.x = -88;
    }
    // INTERNAL ROAD: Red Sedan driving on 33' Mid Road (matching Screenshot 3!)
    if (roadMidEastRef.current) {
      roadMidEastRef.current.position.x += delta * 9;
      if (roadMidEastRef.current.position.x > 60) roadMidEastRef.current.position.x = -62;
    }
    // Internal Road V1 (Southbound)
    if (roadV1SouthRef.current) {
      roadV1SouthRef.current.position.z += delta * 8;
      if (roadV1SouthRef.current.position.z > 58) roadV1SouthRef.current.position.z = 6;
    }
    // Internal Road V3 (Northbound)
    if (roadV3NorthRef.current) {
      roadV3NorthRef.current.position.z -= delta * 8;
      if (roadV3NorthRef.current.position.z < 6) roadV3NorthRef.current.position.z = 58;
    }
  });

  return (
    <group>
      {/* Highway Southbound SUV */}
      <group ref={hwySouthRef} position={[76, 0, -20]}>
        <LowPolyCar color="#FFFFFF" />
      </group>
      {/* Highway Northbound Sedan */}
      <group ref={hwyNorthRef} position={[83, 0, 30]} rotation={[0, Math.PI, 0]}>
        <LowPolyCar color="#10B981" />
      </group>
      {/* 60ft Road Blue Sedan */}
      <group ref={road60Ref} position={[-30, 0, -47]} rotation={[0, Math.PI / 2, 0]}>
        <LowPolyCar color="#2563EB" />
      </group>

      {/* INTERNAL ROAD: Iconic RED CAR matching Screenshot 3! */}
      <group ref={roadMidEastRef} position={[-15, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        <LowPolyCar color="#DC2626" />
      </group>

      {/* Internal Road V1 (Yellow Car) */}
      <group ref={roadV1SouthRef} position={[-32.5, 0, 15]}>
        <LowPolyCar color="#FBBF24" />
      </group>

      {/* Internal Road V3 (Silver Car) */}
      <group ref={roadV3NorthRef} position={[25.5, 0, 45]} rotation={[0, Math.PI, 0]}>
        <LowPolyCar color="#E2E8F0" />
      </group>
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

  // Interlocking Stone Cobblestone Paver Texture for Raised Road Curbs (Matching Image 4 & 5)
  const cobblestoneTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dark mortar joint background
    ctx.fillStyle = '#1E252F';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 16;
    const cols = 8;
    const rh = 512 / rows;
    const cw = 512 / cols;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (cw / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * cw + offset + 2;
        const y = r * rh + 2;
        const w = cw - 4;
        const h = rh - 4;

        // Natural slate & granite paver tone variation (matching Image 4)
        const tone = 125 + Math.floor(Math.random() * 45);
        ctx.fillStyle = `rgb(${tone}, ${tone + 4}, ${tone + 9})`;
        ctx.fillRect(x, y, w, h);

        // Stone edge highlight / chamfer
        ctx.strokeStyle = `rgba(255, 255, 255, 0.28)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
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
            {/* Raised Cobblestone Stone Curbs along Road Flanks (Matching Image 4 & 5) */}
            {isHorizontal ? (
              <>
                {/* North Stone Curb Strip (1.8m width, 0.18m height) */}
                <mesh position={[0, 0.09, -d / 2 - 0.9]}>
                  <boxGeometry args={[w + 1.8, 0.18, 1.8]} />
                  <meshStandardMaterial
                    map={cobblestoneTexture || undefined}
                    color="#FFFFFF"
                    roughness={0.85}
                  />
                </mesh>
                {/* South Stone Curb Strip (1.8m width, 0.18m height) */}
                <mesh position={[0, 0.09, d / 2 + 0.9]}>
                  <boxGeometry args={[w + 1.8, 0.18, 1.8]} />
                  <meshStandardMaterial
                    map={cobblestoneTexture || undefined}
                    color="#FFFFFF"
                    roughness={0.85}
                  />
                </mesh>
                {/* Outer White Chamfer Curb Edge Lines */}
                <lineSegments position={[0, 0.181, -d / 2 - 1.8]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(w + 1.8, 0.01, 0.02)]} />
                  <lineBasicMaterial color="#FFFFFF" linewidth={2} />
                </lineSegments>
                <lineSegments position={[0, 0.181, d / 2 + 1.8]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(w + 1.8, 0.01, 0.02)]} />
                  <lineBasicMaterial color="#FFFFFF" linewidth={2} />
                </lineSegments>
              </>
            ) : (
              <>
                {/* West Stone Curb Strip (1.8m width, 0.18m height) */}
                <mesh position={[-w / 2 - 0.9, 0.09, 0]}>
                  <boxGeometry args={[1.8, 0.18, d + 1.8]} />
                  <meshStandardMaterial
                    map={cobblestoneTexture || undefined}
                    color="#FFFFFF"
                    roughness={0.85}
                  />
                </mesh>
                {/* East Stone Curb Strip (1.8m width, 0.18m height) */}
                <mesh position={[w / 2 + 0.9, 0.09, 0]}>
                  <boxGeometry args={[1.8, 0.18, d + 1.8]} />
                  <meshStandardMaterial
                    map={cobblestoneTexture || undefined}
                    color="#FFFFFF"
                    roughness={0.85}
                  />
                </mesh>
                {/* Outer White Chamfer Curb Edge Lines */}
                <lineSegments position={[-w / 2 - 1.8, 0.181, 0]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(0.02, 0.01, d + 1.8)]} />
                  <lineBasicMaterial color="#FFFFFF" linewidth={2} />
                </lineSegments>
                <lineSegments position={[w / 2 + 1.8, 0.181, 0]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(0.02, 0.01, d + 1.8)]} />
                  <lineBasicMaterial color="#FFFFFF" linewidth={2} />
                </lineSegments>
              </>
            )}

            {/* Deep Rich Blacktop Asphalt Road Bed (Exact match to Image 4 & 5) */}
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

// Ac. 0.758 Park Area (matching Screenshot 1, 2, 4, 5: flowers, perimeter palms, cycad shrubs, 3D Park text)
function ParkArea3D({ onParkClick }) {
  const [cx, cz] = parkData.center;
  const w = parkData.width;
  const d = parkData.depth;

  // Perimeter small palm trees (matching Screenshot 2 & 4 perimeter!)
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

  // Scattered cycad shrubs inside the park lawn (matching Screenshot 4 & 5!)
  const cycads = useMemo(() => {
    const list = [];
    for (let i = 0; i < 32; i++) {
      const rx = cx - w * 0.42 + Math.random() * (w * 0.84);
      const rz = cz - d * 0.42 + Math.random() * (d * 0.84);
      list.push({ pos: [rx, 0.04, rz], scale: 0.8 + Math.random() * 0.35 });
    }
    return list;
  }, [cx, cz, w, d]);

  // Sprinkled white & orange flower clusters (matching Screenshot 1 & 5!)
  const flowers = useMemo(() => {
    const list = [];
    for (let i = 0; i < 48; i++) {
      const fx = cx - w * 0.44 + Math.random() * (w * 0.88);
      const fz = cz - d * 0.44 + Math.random() * (d * 0.88);
      list.push({ pos: [fx, 0.04, fz], isOrange: i % 2 === 0 });
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

      {/* Jogging Track Loop */}
      <mesh position={[cx, 0.038, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[w * 0.32, w * 0.38, 32]} />
        <meshBasicMaterial color="#D97706" opacity={0.65} transparent />
      </mesh>

      {/* 3D "Park" Label in Center (matching Screenshot 1, 2, 4) */}
      <group position={[cx, 0.06, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={2.2}
          color="#14532D"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Park
        </Text>
        <Text
          position={[0, -2.4, 0]}
          fontSize={1.2}
          color="#166534"
          anchorX="center"
          anchorY="middle"
          fontWeight="semibold"
        >
          Ac. 0.758 Cents
        </Text>
      </group>

      {/* Perimeter Palm Trees (matching Screenshot 2 & 4) */}
      {perimeterPalms.map(([px, pz], idx) => (
        <PalmTree key={`perm-${idx}`} position={[px, 0.03, pz]} scale={0.72} />
      ))}

      {/* Scattered Cycad Palm Shrubs (matching Screenshot 4 & 5) */}
      {cycads.map((c, idx) => (
        <ParkCycadShrub key={`cycad-${idx}`} position={c.pos} scale={c.scale} />
      ))}

      {/* Scattered Daisy & Orange Flower Blossoms (matching Screenshot 1 & 5) */}
      {flowers.map((fl, idx) => (
        <FlowerPatch key={`fl-${idx}`} position={fl.pos} isOrange={fl.isOrange} />
      ))}
    </group>
  );
}

// Real-World Kadthal / Srisailam Highway Cartographic Terrain Backdrop
function CartographicMapTerrain() {
  return (
    <group>
      {/* Light pastel green map terrain plane (matching OpenStreetMap / Google Maps base) */}
      <mesh position={[0, -0.015, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[450, 320]} />
        <meshBasicMaterial color="#CFE2CC" />
      </mesh>

      {/* Layout Compound Boundary Base */}
      <mesh position={[0, 0.005, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[186, 126]} />
        <meshBasicMaterial color="#D5E8CE" />
      </mesh>

      {/* Boundary Compound Fencing Line */}
      <lineSegments position={[0, 0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(186, 126)]} />
        <lineBasicMaterial color="#68D391" linewidth={2} />
      </lineSegments>

      {/* Srisailam Highway Extended North-South Corridor Vein */}
      <mesh position={[80, 0.006, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 320]} />
        <meshBasicMaterial color="#1E232A" />
      </mesh>
      {/* Highway Median Line Extension */}
      <mesh position={[80, 0.008, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.35, 320]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>

      {/* 60ft Arterial Road East-West Extension towards Maisigandi Temple */}
      <mesh position={[-60, 0.006, -47]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[260, 10]} />
        <meshBasicMaterial color="#2B303A" />
      </mesh>

      {/* Real-World GIS Milestone Markers on 3D Map */}
      <group position={[80, 0.05, -120]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <Text fontSize={3.2} color="#1E3A8A" fontWeight="bold">
          ▲ to Hyderabad / RGIA Airport / ORR Exit 14 (34 km)
        </Text>
      </group>

      <group position={[80, 0.05, 130]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <Text fontSize={3.2} color="#1E3A8A" fontWeight="bold">
          ▼ to Kadthal Town / Dindi / Srisailam (NH-765)
        </Text>
      </group>

      <group position={[-140, 0.05, -47]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text fontSize={3.0} color="#92400E" fontWeight="bold">
          ◄ to Maisigandi Maisamma Temple (0.8 km)
        </Text>
      </group>
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

  return (
    <div className="w-full h-full relative bg-[#CFE2CC] select-none">
      <Canvas
        shadows={false} // NO SHADOWS per user directive
        camera={{ position: [0, 68, 76], fov: 42, near: 0.5, far: 550 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#CFE2CC']} />

        {/* Clean, Bright, Shadowless Illumination */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[30, 80, 40]} intensity={0.65} />

        {/* Camera Controller supporting Street Walk & Park Ground views */}
        <CameraController
          selectedPlot={selectedPlot}
          cameraPreset={cameraPreset}
          walkRoadIndex={walkRoadIndex}
          walkProgress={walkProgress}
        />

        {/* Google Maps / Cartographic Terrain Backdrop */}
        <CartographicMapTerrain />

        {/* Connected Asphalt Road Network with Sidewalks */}
        <ConnectedRoadNetwork onRoadClick={onRoadClick} />

        {/* Ac. 0.758 Park Area with Flowers, Perimeter Palms & Cycads */}
        <ParkArea3D onParkClick={onParkClick} />

        {/* Avenue Royal Palms Landscaping */}
        <Landscaping />

        {/* Moving Vehicles along Highway AND Internal Layout Roads */}
        <MovingVehicles animate={animateVehicles} />

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
