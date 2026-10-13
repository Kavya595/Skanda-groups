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

// Camera Controller for Smooth Transitions and Framing
function CameraController({
  selectedPlot,
  cameraPreset,
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
      targetPos.current.set(cx, 22, cz + 20);
      targetLook.current.set(cx, 0.1, cz);
      animatingRef.current = true;
    } else if (cameraPreset) {
      if (cameraPreset === 'overview') {
        targetPos.current.set(0, 68, 76);
        targetLook.current.set(0, 0, 4);
      } else if (cameraPreset === 'topDown') {
        targetPos.current.set(0, 100, 0.1);
        targetLook.current.set(0, 0, 0);
      } else if (cameraPreset === 'highway') {
        targetPos.current.set(78, 25, 20);
        targetLook.current.set(50, 0, -5);
      } else if (cameraPreset === 'park') {
        targetPos.current.set(-68, 24, -10);
        targetLook.current.set(-60, 0, -25);
      }
      animatingRef.current = true;
    }
  }, [selectedPlot, cameraPreset]);

  useFrame((_, delta) => {
    if (animatingRef.current && controlsRef.current) {
      const step = Math.min(delta * 4.0, 1);
      camera.position.lerp(targetPos.current, step);
      controlsRef.current.target.lerp(targetLook.current, step);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.25) {
        animatingRef.current = false;
        if (onResetComplete) onResetComplete();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      maxPolarAngle={Math.PI / 2.08}
      minDistance={8}
      maxDistance={160}
      enableDamping
      dampingFactor={0.06}
    />
  );
}

// Flat Master Plot Tile (Zero gaps, no shadows, bold legible numbers, dimension labels on selection)
function Plot3D({
  plot,
  isSelected,
  onSelect,
  isMeasureMode,
  onMeasurePoint
}) {
  const [hovered, setHovered] = useState(false);

  const meta = statusColors[plot.status] || statusColors.available;

  const color = useMemo(() => {
    if (isSelected) return '#F15A24'; // Skandha Brand Orange
    if (hovered) return '#FB923C';
    return meta.threeColor;
  }, [plot.status, isSelected, hovered, meta.threeColor]);

  const elevY = isSelected ? 0.35 : hovered ? 0.18 : 0.04;
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
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Crisp Survey Demarcation Border */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial
          color={isSelected ? '#FFFFFF' : '#CBD5E1'}
          linewidth={isSelected ? 3 : 1.2}
          opacity={isSelected ? 1.0 : 0.9}
          transparent
        />
      </lineSegments>

      {/* When Selected: Center Circular White Badge matching Photo 4 */}
      {isSelected ? (
        <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Subtle Outer Drop Ring */}
          <mesh position={[0, 0, -0.002]}>
            <circleGeometry args={[Math.min(w, d) * 0.36, 32]} />
            <meshBasicMaterial color="#94A3B8" />
          </mesh>
          {/* Pure White Badge Disk */}
          <mesh position={[0, 0, 0]}>
            <circleGeometry args={[Math.min(w, d) * 0.34, 32]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Horizontal Divider Line */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[Math.min(w, d) * 0.52, 0.08]} />
            <meshBasicMaterial color="#CBD5E1" />
          </mesh>
          {/* Plot Number on Top */}
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
          {/* Area yd² on Bottom */}
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

      {/* Edge Dimensions when Selected or Hovered (Photo 2 & 4: 50', 55', 33') */}
      {(isSelected || hovered) && (
        <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* North edge dimension */}
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
          {/* South edge dimension */}
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
          {/* West edge dimension */}
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
          {/* East edge dimension */}
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

// Realistic Broad Palm Tree matching Photo 1 and Photo 2 (slender organic trunk, 6 broad golden-lime arching leaves, ground shadow)
function PalmTree({ position = [0, 0, 0], scale = 1.0 }) {
  const leafAngles = [0, 60, 120, 180, 240, 300];

  return (
    <group position={position} scale={scale}>
      {/* Ground Soft Decal Shadow on Sidewalk (Photo 1 & 2) */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.22} transparent />
      </mesh>

      {/* Slender Tapered Trunk */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.13, 0.22, 2.9, 8]} />
        <meshBasicMaterial color="#8F785C" />
      </mesh>

      {/* Crown Joint */}
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshBasicMaterial color="#6B5944" />
      </mesh>

      {/* 6 Broad Tropical Fronds radiating and drooping down */}
      {leafAngles.map((angle, idx) => (
        <group
          key={idx}
          position={[0, 2.85, 0]}
          rotation={[0.32, (angle * Math.PI) / 180, -0.42]}
        >
          {/* Main Arched Leaf Blade */}
          <mesh position={[1.3, -0.22, 0]} rotation={[0, 0, -0.28]} scale={[2.5, 0.06, 1.1]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#9EB226" />
          </mesh>
          {/* Leaf Tip Drooping Downward */}
          <mesh position={[2.6, -0.75, 0]} rotation={[0, 0, -0.62]} scale={[1.4, 0.05, 0.85]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#ADC32F" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Avenue Landscaping along Road Curbs lining both sides of roads (Photo 1 & 2)
function Landscaping() {
  const trees = useMemo(() => {
    const list = [];
    // Palm trees along 60ft Road curb (both sides)
    for (let x = -86; x <= 76; x += 11) {
      list.push({ pos: [x, 0, -53.5], scale: 1.1 });
      list.push({ pos: [x, 0, -40.5], scale: 1.1 });
    }
    // Palm trees along Srisailam Highway Service Road
    for (let z = -48; z <= 58; z += 10) {
      list.push({ pos: [72.5, 0, z], scale: 1.18 });
      list.push({ pos: [87.5, 0, z], scale: 1.2 });
    }
    // Palm trees along Mid 33ft Road curbs (both sides)
    for (let x = -58; x <= 65; x += 12) {
      list.push({ pos: [x, 0, -4.2], scale: 0.96 });
      list.push({ pos: [x, 0, 5.2], scale: 0.96 });
    }
    // Palm trees along Vertical Roads V1 & V3 (both sides)
    for (let z = 9; z <= 54; z += 10) {
      list.push({ pos: [-37.2, 0, z], scale: 0.92 });
      list.push({ pos: [-27.8, 0, z], scale: 0.92 });
      list.push({ pos: [21.0, 0, z], scale: 0.92 });
      list.push({ pos: [30.0, 0, z], scale: 0.92 });
    }
    // Trees in Ac. 0.758 Park Perimeter & Interior
    const parkTrees = [
      [-85, -13], [-80, -13], [-70, -13], [-60, -13],
      [-86, -22], [-86, -32], [-86, -40],
      [-60, -22], [-60, -32], [-60, -40],
      [-73, -24], [-75, -30], [-68, -28], [-78, -35]
    ];
    parkTrees.forEach(([px, pz]) => {
      list.push({ pos: [px, 0, pz], scale: 1.25 });
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

// Low-poly Moving Vehicles
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

// Moving Vehicles across Highway AND Internal Layout Roads (User requirement!)
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
    // Internal 33' Mid Road (Eastbound)
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
        <LowPolyCar color="#EF4444" />
      </group>
      {/* 60ft Road Sedan */}
      <group ref={road60Ref} position={[-30, 0, -47]} rotation={[0, Math.PI / 2, 0]}>
        <LowPolyCar color="#2563EB" />
      </group>

      {/* INTERNAL ROAD 1: 33' Mid Horizontal Road Car (Silver Hatchback) */}
      <group ref={roadMidEastRef} position={[-15, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        <LowPolyCar color="#E2E8F0" />
      </group>

      {/* INTERNAL ROAD 2: 33' Vertical Road V1 Car (Yellow Hatchback) */}
      <group ref={roadV1SouthRef} position={[-32.5, 0, 15]}>
        <LowPolyCar color="#FBBF24" />
      </group>

      {/* INTERNAL ROAD 3: 33' Vertical Road V3 Car (Blue Sedan) */}
      <group ref={roadV3NorthRef} position={[25.5, 0, 45]} rotation={[0, Math.PI, 0]}>
        <LowPolyCar color="#0284C7" />
      </group>
    </group>
  );
}

// Connected Road Network with Realistic Asphalt and Stone Cobblestone Sidewalks (Photo 1 & 2)
function ConnectedRoadNetwork() {
  // Procedural dark asphalt tarmac texture with mineral speckles
  const asphaltTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1D2126';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const size = Math.random() * 1.5 + 0.5;
      const rnd = Math.random();
      ctx.fillStyle = rnd > 0.6 ? '#2A3037' : rnd > 0.3 ? '#131518' : '#383F47';
      ctx.fillRect(x, y, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    return texture;
  }, []);

  // Procedural stone cobblestone / paver-block sidewalk texture (Photo 1 & 2)
  const cobblestoneTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#475569'; // Grout line
    ctx.fillRect(0, 0, 256, 256);
    const rows = 16;
    const cols = 8;
    const rh = 256 / rows;
    const cw = 256 / cols;
    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (cw / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * cw + offset + 1.5;
        const y = r * rh + 1.5;
        const w = cw - 3;
        const h = rh - 3;
        const val = 135 + Math.floor(Math.random() * 28);
        ctx.fillStyle = `rgb(${val}, ${val + 4}, ${val + 8})`;
        ctx.fillRect(x, y, w, h);
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

        return (
          <group key={road.id} position={[cx, 0.02, cz]}>
            {/* Wide Stone Cobblestone Sidewalk Pavement (Photo 1 & 2) */}
            <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w + 2.2, d + 2.2]} />
              <meshBasicMaterial
                map={cobblestoneTexture || undefined}
                color={cobblestoneTexture ? '#FFFFFF' : '#CBD5E1'}
              />
            </mesh>

            {/* Crisp Concrete Curb Demarcation Edge */}
            <lineSegments position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(w + 2.2, d + 2.2)]} />
              <lineBasicMaterial color="#E2E8F0" linewidth={2} />
            </lineSegments>

            {/* Realistic Dark Asphalt Road Bed (Photo 1 & 2) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w, d]} />
              <meshBasicMaterial
                map={asphaltTexture || undefined}
                color={asphaltTexture ? (isHighway ? '#E2E8F0' : '#CBD5E1') : (isHighway ? '#1A1E24' : '#22262C')}
              />
            </mesh>

            {/* Center Yellow Divider for Highway */}
            {isHighway && (
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.35, d]} />
                <meshBasicMaterial color="#FBBF24" />
              </mesh>
            )}

            {/* Center Dashed Line for 60ft Road */}
            {isArterial && (
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[w, 0.28]} />
                <meshBasicMaterial color="#FFFFFF" opacity={0.9} transparent />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Street Name Typography printed along roads */}
      <Text
        position={[0, 0.03, -47]}
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
        position={[80, 0.03, 5]}
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
        position={[0, 0.03, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.4}
        color="#CBD5E1"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        33' Road
      </Text>

      <Text
        position={[-32.5, 0.03, 20]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.25}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        33' Road
      </Text>

      <Text
        position={[-3.5, 0.03, 20]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.25}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        33' Road
      </Text>

      <Text
        position={[25.5, 0.03, 20]}
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

// Ac. 0.758 Park Area
function ParkArea() {
  const [cx, cz] = parkData.center;
  const w = parkData.width;
  const d = parkData.depth;

  return (
    <group position={[cx, 0.03, cz]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color="#86EFAC" />
      </mesh>

      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial color="#15803D" linewidth={1.5} />
      </lineSegments>

      {/* Jogging Track Ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[w * 0.32, w * 0.38, 32]} />
        <meshBasicMaterial color="#D97706" opacity={0.75} transparent />
      </mesh>

      <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={1.6}
          color="#14532D"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Open Space Park
        </Text>
        <Text
          position={[0, -1.8, 0]}
          fontSize={1.15}
          color="#166534"
          anchorX="center"
          anchorY="middle"
        >
          Ac. 0.758 Cents
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
  cameraPreset,
  animateVehicles = true,
  isMeasureMode = false,
  measurePoints = [],
  onMeasurePoint
}) {
  return (
    <div className="w-full h-full relative bg-[#DFEFE0] select-none">
      <Canvas
        shadows={false} // NO SHADOWS per user directive
        camera={{ position: [0, 68, 76], fov: 42, near: 1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#DFEFE0']} />

        {/* Clean, Bright, Shadowless Illumination */}
        <ambientLight intensity={1.15} />
        <directionalLight position={[30, 80, 40]} intensity={0.7} />

        <CameraController
          selectedPlot={selectedPlot}
          cameraPreset={cameraPreset}
        />

        {/* Natural Grass Terrain Plane */}
        <mesh position={[0, -0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[380, 260]} />
          <meshBasicMaterial color="#DFEFE0" />
        </mesh>

        {/* Layout Compound Base Surface */}
        <mesh position={[0, 0.005, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[186, 126]} />
          <meshBasicMaterial color="#D5E8CE" />
        </mesh>

        {/* Connected Asphalt Road Network with Sidewalks */}
        <ConnectedRoadNetwork />

        {/* Ac. 0.758 Park Area */}
        <ParkArea />

        {/* Avenue Royal Palms Landscaping */}
        <Landscaping />

        {/* Moving Vehicles along Highway AND Internal Layout Roads */}
        <MovingVehicles animate={animateVehicles} />

        {/* Master Plots (Flat tiles, zero gaps, all numbers visible) */}
        <group>
          {plots.map((plot) => (
            <Plot3D
              key={plot.plotNumber}
              plot={plot}
              isSelected={selectedPlot?.plotNumber === plot.plotNumber}
              onSelect={onSelectPlot}
              isMeasureMode={isMeasureMode}
              onMeasurePoint={onMeasurePoint}
            />
          ))}
        </group>

        {/* Interactive Measure Tool Line */}
        {isMeasureMode && <MeasureOverlay points={measurePoints} />}
      </Canvas>
    </div>
  );
}
