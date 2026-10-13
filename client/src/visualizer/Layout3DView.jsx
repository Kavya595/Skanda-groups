import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
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
  const targetPos = useRef(new THREE.Vector3(0, 82, 92));
  const targetLook = useRef(new THREE.Vector3(0, 0, 4));

  useEffect(() => {
    if (selectedPlot && selectedPlot.center) {
      const [cx, cz] = selectedPlot.center;
      targetPos.current.set(cx, 26, cz + 26);
      targetLook.current.set(cx, 0.6, cz);
      animatingRef.current = true;
    } else if (cameraPreset) {
      if (cameraPreset === 'overview') {
        targetPos.current.set(0, 82, 92);
        targetLook.current.set(0, 0, 4);
      } else if (cameraPreset === 'topDown') {
        targetPos.current.set(0, 115, 0.1);
        targetLook.current.set(0, 0, 0);
      } else if (cameraPreset === 'highway') {
        targetPos.current.set(82, 28, 20);
        targetLook.current.set(50, 0, -5);
      } else if (cameraPreset === 'park') {
        targetPos.current.set(-68, 25, -10);
        targetLook.current.set(-60, 0, -25);
      }
      animatingRef.current = true;
    }
  }, [selectedPlot, cameraPreset]);

  useFrame((_, delta) => {
    if (animatingRef.current && controlsRef.current) {
      const step = Math.min(delta * 3.8, 1);
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
      maxPolarAngle={Math.PI / 2.06} // Prevent navigating underground
      minDistance={10}
      maxDistance={180}
      enableDamping
      dampingFactor={0.06}
    />
  );
}

// Raised Master Plot Polygon with Survey Demarcation
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
    if (isSelected) return '#F15A24'; // Skandha Warm Orange Glow
    if (hovered) return '#FB923C';
    return meta.threeColor;
  }, [plot.status, isSelected, hovered, meta.threeColor]);

  // Elevation
  const height = isSelected ? 0.95 : hovered ? 0.6 : 0.35;
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
    <group position={[cx, height / 2, cz]}>
      {/* Extruded Plot Surface */}
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
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w, height, d]} />
        <meshStandardMaterial
          color={color}
          roughness={0.42}
          metalness={0.12}
        />
      </mesh>

      {/* Survey Demarcation Border Line */}
      <lineSegments position={[0, height / 2 + 0.015, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(w, 0.02, d)]} />
        <lineBasicMaterial
          color={isSelected ? '#FFFFFF' : '#1E293B'}
          linewidth={isSelected ? 3 : 1.5}
        />
      </lineSegments>

      {/* Circular Plot Number Badge */}
      <group position={[0, height / 2 + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[1.05, 24]} />
          <meshBasicMaterial
            color={isSelected ? '#1E293B' : '#FFFFFF'}
            opacity={0.94}
            transparent
          />
        </mesh>
        <Text
          position={[0, 0, 0.02]}
          fontSize={1.15}
          color={isSelected ? '#FFFFFF' : '#0F172A'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {String(plot.plotNumber)}
        </Text>
      </group>
    </group>
  );
}

// Low-poly Royal Palm Tree
function PalmTree({ position = [0, 0, 0], scale = 1.0 }) {
  return (
    <group position={position} scale={scale}>
      {/* Palm Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 2.8, 7]} />
        <meshStandardMaterial color="#6B4F35" roughness={0.9} />
      </mesh>
      {/* Palm Fronds (layered foliage) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <group
          key={idx}
          position={[0, 2.7, 0]}
          rotation={[0.35, (angle * Math.PI) / 180, -0.45]}
        >
          <mesh position={[0.7, 0, 0]} rotation={[0, 0, -0.2]} castShadow>
            <coneGeometry args={[0.42, 1.6, 5]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Avenue Landscaping & Trees
function Landscaping() {
  const trees = useMemo(() => {
    const list = [];
    // Palm trees along 60ft Road
    for (let x = -88; x <= 80; x += 14) {
      list.push({ pos: [x, 0, -41], scale: 1.1 });
    }
    // Palm trees along Srisailam Highway Service Road
    for (let z = -48; z <= 60; z += 12) {
      list.push({ pos: [62, 0, z], scale: 1.15 });
      list.push({ pos: [71, 0, z], scale: 1.2 });
    }
    // Palm trees along Mid 33ft Road
    for (let x = -60; x <= 55; x += 15) {
      list.push({ pos: [x, 0, -3.8], scale: 0.95 });
      list.push({ pos: [x, 0, 3.8], scale: 0.95 });
    }
    // Trees around Ac. 0.758 Park Perimeter & Interior
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
    <group position={position} rotation={rotation} castShadow>
      {/* Car Body */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.7, 0.55, 3.2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.85, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.45, 1.9]} />
        <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.55, 0.45, 1.62]}>
        <boxGeometry args={[0.3, 0.18, 0.05]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <mesh position={[0.55, 0.45, 1.62]}>
        <boxGeometry args={[0.3, 0.18, 0.05]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      {/* Wheels */}
      {[-0.88, 0.88].map((wx, i) =>
        [-0.95, 0.95].map((wz, j) => (
          <mesh key={`${i}-${j}`} position={[wx, 0.24, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.2, 10]} />
            <meshStandardMaterial color="#1E293B" roughness={0.8} />
          </mesh>
        ))
      )}
    </group>
  );
}

function MovingVehicles({ animate }) {
  const hwySouthRef = useRef();
  const hwyNorthRef = useRef();
  const road60Ref = useRef();

  useFrame((_, delta) => {
    if (!animate) return;
    if (hwySouthRef.current) {
      hwySouthRef.current.position.z += delta * 15;
      if (hwySouthRef.current.position.z > 62) hwySouthRef.current.position.z = -54;
    }
    if (hwyNorthRef.current) {
      hwyNorthRef.current.position.z -= delta * 13;
      if (hwyNorthRef.current.position.z < -54) hwyNorthRef.current.position.z = 62;
    }
    if (road60Ref.current) {
      road60Ref.current.position.x += delta * 12;
      if (road60Ref.current.position.x > 84) road60Ref.current.position.x = -88;
    }
  });

  return (
    <group>
      {/* Srisailam Highway Southbound SUV */}
      <group ref={hwySouthRef} position={[76, 0, -20]}>
        <LowPolyCar color="#FFFFFF" />
      </group>
      {/* Srisailam Highway Northbound Sedan */}
      <group ref={hwyNorthRef} position={[83, 0, 30]} rotation={[0, Math.PI, 0]}>
        <LowPolyCar color="#EF4444" />
      </group>
      {/* 60ft Arterial Road Sedan */}
      <group ref={road60Ref} position={[-30, 0, -47]} rotation={[0, Math.PI / 2, 0]}>
        <LowPolyCar color="#2563EB" />
      </group>
    </group>
  );
}

// Connected Road Network & Markings
function ConnectedRoadNetwork() {
  return (
    <group>
      {/* Continuous Road Surfaces */}
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
          <group key={road.id} position={[cx, 0.04, cz]}>
            {/* Dark Asphalt Surface */}
            <mesh receiveShadow>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial
                color={isHighway ? '#1E232A' : isArterial ? '#252A32' : '#2D323A'}
                roughness={0.58}
              />
            </mesh>

            {/* Road Markings */}
            {isHighway && (
              // Srisailam Highway Center Yellow Divider
              <mesh position={[0, 0.01, 0]}>
                <planeGeometry args={[0.35, d]} />
                <meshBasicMaterial color="#FBBF24" />
              </mesh>
            )}

            {isArterial && (
              // 60ft Road White Dashed Center Line
              <mesh position={[0, 0.01, 0]}>
                <planeGeometry args={[w, 0.28]} />
                <meshBasicMaterial color="#FFFFFF" opacity={0.8} transparent />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 3D Road Name Labels */}
      <Text
        position={[0, 0.1, -47]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.7}
        color="#F8FAFC"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        PROPOSED 60'-0" WIDE ROAD (TO MAISIGANDI TEMPLE)
      </Text>

      <Text
        position={[80, 0.1, 5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={1.8}
        color="#FEF08A"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        SRISAILAM HIGHWAY (NH-765)
      </Text>

      <Text
        position={[0, 0.1, 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.4}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        PROPOSED 33'-0" WIDE ROAD
      </Text>
    </group>
  );
}

// Ac. 0.758 Park Environment
function ParkArea() {
  const [cx, cz] = parkData.center;
  const w = parkData.width;
  const d = parkData.depth;

  return (
    <group position={[cx, 0.06, cz]}>
      {/* Lush Green Lawn */}
      <mesh receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#5EAB53" roughness={0.7} />
      </mesh>

      {/* Jogging Track Perimeter Path */}
      <mesh position={[0, 0.01, 0]}>
        <ringGeometry args={[w * 0.35, w * 0.42, 32]} />
        <meshStandardMaterial color="#D97706" roughness={0.8} opacity={0.85} transparent />
      </mesh>

      {/* Park Name Billboard */}
      <group position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={1.5}
          color="#14532D"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          OPEN SPACE PARK
        </Text>
        <Text
          position={[0, -1.8, 0]}
          fontSize={1.1}
          color="#166534"
          anchorX="center"
          anchorY="middle"
        >
          Ac. 0.758 Cents Landscaped
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
      {/* Markers */}
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
          {/* Distance Text Badge */}
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
    <div className="w-full h-full relative bg-slate-900 select-none">
      <Canvas
        shadows
        camera={{ position: [0, 82, 92], fov: 42, near: 1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Sky / Scene Ambient Color */}
        <color attach="background" args={['#E6F4EA']} />

        {/* Natural Sun Lighting & Soft Shadows */}
        <ambientLight intensity={0.85} color="#FFFFFF" />
        <directionalLight
          position={[60, 95, 45]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={250}
          shadow-camera-left={-110}
          shadow-camera-right={110}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-bias={-0.0004}
        />
        <hemisphereLight skyColor="#F8FAFC" groundColor="#8CB878" intensity={0.4} />

        {/* Camera Navigation Controller */}
        <CameraController
          selectedPlot={selectedPlot}
          cameraPreset={cameraPreset}
        />

        {/* Surrounding Natural Grass Terrain */}
        <mesh position={[0, -0.02, 5]} receiveShadow>
          <planeGeometry args={[380, 260]} />
          <meshStandardMaterial color="#8CB878" roughness={0.9} />
        </mesh>

        {/* Project Compound Boundary Kerb */}
        <mesh position={[0, 0.01, 5]}>
          <planeGeometry args={[186, 126]} />
          <meshStandardMaterial color="#94C383" roughness={0.85} />
        </mesh>

        {/* Connected Asphalt Road Network */}
        <ConnectedRoadNetwork />

        {/* Ac. 0.758 Park Environment */}
        <ParkArea />

        {/* Avenue Landscaping & Palm Trees */}
        <Landscaping />

        {/* Low-poly Animated Vehicles */}
        <MovingVehicles animate={animateVehicles} />

        {/* Continuous Plot Surfaces (All 96 Plots) */}
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

        {/* Interactive Measure Tool Overlay */}
        {isMeasureMode && <MeasureOverlay points={measurePoints} />}
      </Canvas>
    </div>
  );
}
