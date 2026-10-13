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
  const targetPos = useRef(new THREE.Vector3(0, 72, 82));
  const targetLook = useRef(new THREE.Vector3(0, 0, 4));

  useEffect(() => {
    if (selectedPlot && selectedPlot.center) {
      const [cx, cz] = selectedPlot.center;
      targetPos.current.set(cx, 24, cz + 22);
      targetLook.current.set(cx, 0.1, cz);
      animatingRef.current = true;
    } else if (cameraPreset) {
      if (cameraPreset === 'overview') {
        targetPos.current.set(0, 72, 82);
        targetLook.current.set(0, 0, 4);
      } else if (cameraPreset === 'topDown') {
        targetPos.current.set(0, 105, 0.1);
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
      minDistance={10}
      maxDistance={170}
      enableDamping
      dampingFactor={0.06}
    />
  );
}

// Flat Master Plot Tile (No gaps, no shadows, bold legible numbers matching Plots99)
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

  // Elevation (flat map tile with subtle lift on hover/select)
  const elevY = isSelected ? 0.45 : hovered ? 0.22 : 0.04;
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
      {/* Plot Flat Surface Mesh (Zero gaps between neighbors) */}
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

      {/* Crisp White/Subtle Survey Demarcation Border Line */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial
          color={isSelected ? '#FFFFFF' : '#FFFFFF'}
          linewidth={isSelected ? 3 : 1.2}
          opacity={isSelected ? 1.0 : 0.75}
          transparent
        />
      </lineSegments>

      {/* Plot Number Rendered Directly & Bold (Matching Plots99 Screenshot 2) */}
      <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={Math.min(w, d) * 0.32 > 1.8 ? 1.8 : Math.max(Math.min(w, d) * 0.28, 1.35)}
          color={isSelected ? '#FFFFFF' : plot.status === 'sold' ? '#7F1D1D' : '#1E293B'}
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
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.24, 2.4, 6]} />
        <meshBasicMaterial color="#5C4033" />
      </mesh>
      {/* Palm Fronds */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <group
          key={idx}
          position={[0, 2.3, 0]}
          rotation={[0.3, (angle * Math.PI) / 180, -0.4]}
        >
          <mesh position={[0.65, 0, 0]} rotation={[0, 0, -0.2]}>
            <coneGeometry args={[0.38, 1.4, 5]} />
            <meshBasicMaterial color="#228B22" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Avenue Landscaping & Palm Trees
function Landscaping() {
  const trees = useMemo(() => {
    const list = [];
    // Palm trees along 60ft Road curb
    for (let x = -88; x <= 80; x += 13) {
      list.push({ pos: [x, 0, -41], scale: 1.05 });
    }
    // Palm trees along Srisailam Highway Service Road
    for (let z = -48; z <= 60; z += 12) {
      list.push({ pos: [62, 0, z], scale: 1.1 });
      list.push({ pos: [71, 0, z], scale: 1.15 });
    }
    // Palm trees along Mid 33ft Road
    for (let x = -60; x <= 55; x += 14) {
      list.push({ pos: [x, 0, -3.8], scale: 0.9 });
      list.push({ pos: [x, 0, 3.8], scale: 0.9 });
    }
    // Trees in Ac. 0.758 Park Perimeter & Interior
    const parkTrees = [
      [-85, -13], [-80, -13], [-70, -13], [-60, -13],
      [-86, -22], [-86, -32], [-86, -40],
      [-60, -22], [-60, -32], [-60, -40],
      [-73, -24], [-75, -30], [-68, -28], [-78, -35]
    ];
    parkTrees.forEach(([px, pz]) => {
      list.push({ pos: [px, 0, pz], scale: 1.2 });
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
        <boxGeometry args={[1.6, 0.5, 3.0]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.75, -0.15]}>
        <boxGeometry args={[1.3, 0.4, 1.8]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.5, 0.4, 1.52]}>
        <boxGeometry args={[0.25, 0.15, 0.05]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <mesh position={[0.5, 0.4, 1.52]}>
        <boxGeometry args={[0.25, 0.15, 0.05]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      {/* Wheels */}
      {[-0.8, 0.8].map((wx, i) =>
        [-0.9, 0.9].map((wz, j) => (
          <mesh key={`${i}-${j}`} position={[wx, 0.2, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 8]} />
            <meshBasicMaterial color="#0F172A" />
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
      <group ref={hwySouthRef} position={[76, 0, -20]}>
        <LowPolyCar color="#FFFFFF" />
      </group>
      <group ref={hwyNorthRef} position={[83, 0, 30]} rotation={[0, Math.PI, 0]}>
        <LowPolyCar color="#EF4444" />
      </group>
      <group ref={road60Ref} position={[-30, 0, -47]} rotation={[0, Math.PI / 2, 0]}>
        <LowPolyCar color="#2563EB" />
      </group>
    </group>
  );
}

// Connected Road Network (Dark asphalt with clean white street labels)
function ConnectedRoadNetwork() {
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
            {/* Dark Asphalt Road Bed */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[w, d]} />
              <meshBasicMaterial color={isHighway ? '#1E232A' : '#262A30'} />
            </mesh>

            {/* Road Markings */}
            {isHighway && (
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.3, d]} />
                <meshBasicMaterial color="#FBBF24" />
              </mesh>
            )}

            {isArterial && (
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[w, 0.25]} />
                <meshBasicMaterial color="#FFFFFF" opacity={0.8} transparent />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Road Labels (Matching Plots99 Screenshot 1 & 2: "30' Road", "40' Road") */}
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

      <Text
        position={[53.5, 0.03, 20]}
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

// Ac. 0.758 Park Area (Soft Park Green matching Plots99)
function ParkArea() {
  const [cx, cz] = parkData.center;
  const w = parkData.width;
  const d = parkData.depth;

  return (
    <group position={[cx, 0.03, cz]}>
      {/* Park Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color="#86EFAC" />
      </mesh>

      {/* Border */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
        <lineBasicMaterial color="#15803D" linewidth={1.5} />
      </lineSegments>

      {/* Jogging Track Ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[w * 0.32, w * 0.38, 32]} />
        <meshBasicMaterial color="#D97706" opacity={0.7} transparent />
      </mesh>

      {/* Park Label */}
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
    <div className="w-full h-full relative bg-[#E2F0D9] select-none">
      <Canvas
        shadows={false} // NO SHADOWS as requested
        camera={{ position: [0, 72, 82], fov: 42, near: 1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Soft Natural Map Background Color */}
        <color attach="background" args={['#DFEFE0']} />

        {/* Clean, Bright, Shadowless Lighting */}
        <ambientLight intensity={1.15} />
        <directionalLight position={[30, 80, 40]} intensity={0.7} />

        {/* Camera Controller */}
        <CameraController
          selectedPlot={selectedPlot}
          cameraPreset={cameraPreset}
        />

        {/* Surrounding Natural Grass Terrain Plane */}
        <mesh position={[0, -0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[380, 260]} />
          <meshBasicMaterial color="#DFEFE0" />
        </mesh>

        {/* Layout Compound Base Surface */}
        <mesh position={[0, 0.005, 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[186, 126]} />
          <meshBasicMaterial color="#D5E8CE" />
        </mesh>

        {/* Connected Asphalt Road Network */}
        <ConnectedRoadNetwork />

        {/* Ac. 0.758 Park Area */}
        <ParkArea />

        {/* Avenue Landscaping & Palm Trees */}
        <Landscaping />

        {/* Low-poly Animated Vehicles */}
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
