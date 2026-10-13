import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { statusColors } from './layoutData';
import { Camera, Eye, Info, Pause, Play } from 'lucide-react';

// Single Plot 3D Mesh
function Plot3D({ plot, isSelected, onSelect, reducedMotion }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const color = useMemo(() => {
    if (isSelected) return '#FB923C'; // Vibrant Orange
    if (hovered) return '#F97316';
    if (plot.status === 'sold') return '#94A3B8';
    if (plot.status === 'reserved') return '#F59E0B';
    if (plot.status === 'blocked') return '#475569';
    return '#10B981'; // Available - Emerald Green
  }, [plot.status, isSelected, hovered]);

  const height = isSelected ? 1.2 : hovered ? 0.9 : 0.6;

  return (
    <group position={[plot.x3d || 0, height / 2, plot.z3d || 0]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plot);
        }}
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
        <boxGeometry args={[plot.w3d || 6, height, plot.d3d || 5]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Plot Number floating label */}
      <Text
        position={[0, height / 2 + 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={1.4}
        color={isSelected || hovered ? '#FFFFFF' : '#1E293B'}
        anchorX="center"
        anchorY="middle"
      >
        {String(plot.plotNumber)}
      </Text>
    </group>
  );
}

// Moving Cars on Highway & 60ft Road
function AnimatedCars({ animate }) {
  const car1Ref = useRef();
  const car2Ref = useRef();

  useFrame((_, delta) => {
    if (!animate) return;
    if (car1Ref.current) {
      car1Ref.current.position.z += delta * 12;
      if (car1Ref.current.position.z > 35) car1Ref.current.position.z = -35;
    }
    if (car2Ref.current) {
      car2Ref.current.position.x += delta * 10;
      if (car2Ref.current.position.x > 45) car2Ref.current.position.x = -45;
    }
  });

  return (
    <group>
      {/* Highway Car (White SUV) */}
      <mesh ref={car1Ref} position={[68, 0.4, -20]} castShadow>
        <boxGeometry args={[1.8, 1, 3.2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* 60ft Road Car (Blue Sedan) */}
      <mesh ref={car2Ref} position={[-20, 0.4, -38]} castShadow>
        <boxGeometry args={[3, 0.9, 1.6]} />
        <meshStandardMaterial color="#2563EB" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}

// 3D Trees (Instanced Cylinder + Cone)
function Trees() {
  const treePositions = useMemo(() => {
    const list = [];
    // Avenue trees along Road V1, V2, V3
    [-18, 4, 25].forEach(x => {
      for (let z = -25; z <= 35; z += 12) {
        list.push([x, 0, z]);
      }
    });
    // Park trees
    for (let i = 0; i < 8; i++) {
      list.push([-42 + (i % 3) * 6, 0, -22 + Math.floor(i / 3) * 7]);
    }
    return list;
  }, []);

  return (
    <group>
      {treePositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Trunk */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 1.6, 6]} />
            <meshStandardMaterial color="#78350F" roughness={0.8} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[1.2, 2.4, 7]} />
            <meshStandardMaterial color="#15803D" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Scene Environment & Roads
function SceneGround() {
  return (
    <group>
      {/* Ground Terrain */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[160, 100]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
      </mesh>

      {/* Srisailam Highway Road (NH-765) */}
      <mesh position={[68, 0.05, 0]} receiveShadow>
        <planeGeometry args={[12, 100]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Highway Service Road (33ft) */}
      <mesh position={[58, 0.05, 0]} receiveShadow>
        <planeGeometry args={[6, 100]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Proposed 60'-0" Wide Road (Top) */}
      <mesh position={[0, 0.05, -38]} receiveShadow>
        <planeGeometry args={[160, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Proposed 33'-0" Mid Horizontal Road */}
      <mesh position={[0, 0.05, -4]} receiveShadow>
        <planeGeometry args={[130, 6]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Vertical Roads V0, V1, V2, V3 */}
      {[-35, -2, 16, 38].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0]} receiveShadow>
          <planeGeometry args={[5, 75]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>
      ))}

      {/* Reserved Park (Ac. 0.758 cents) */}
      <mesh position={[-42, 0.1, -22]} receiveShadow>
        <boxGeometry args={[26, 0.2, 22]} />
        <meshStandardMaterial color="#4ADE80" roughness={0.7} />
      </mesh>

      {/* Park Fountain */}
      <mesh position={[-42, 0.25, -22]}>
        <cylinderGeometry args={[3, 3, 0.3, 16]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

export default function Layout3DView({ plots, selectedPlot, onSelectPlot }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const controlsRef = useRef();

  const setViewpoint = (view) => {
    if (!controlsRef.current) return;
    if (view === 'iso') {
      controlsRef.current.object.position.set(0, 48, 62);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'top') {
      controlsRef.current.object.position.set(0, 85, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'highway') {
      controlsRef.current.object.position.set(80, 20, 25);
      controlsRef.current.target.set(50, 0, -10);
    } else if (view === 'park') {
      controlsRef.current.object.position.set(-50, 18, 5);
      controlsRef.current.target.set(-42, 0, -22);
    }
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Conceptual Disclaimer Banner */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 text-white text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Conceptual 3D Visualization:</strong> Derived from DTCP Approved Layout Plan TLP No. 87/2024/H. Click any plot to view source-verified dimensions.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition-colors"
          >
            {reducedMotion ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>{reducedMotion ? 'Resume Motion' : 'Reduce Motion'}</span>
          </button>
        </div>
      </div>

      {/* Floating Viewpoint Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-white text-xs">
        <button
          onClick={() => setViewpoint('iso')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-brand-orange transition-colors font-medium"
        >
          Isometric View
        </button>
        <button
          onClick={() => setViewpoint('top')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-brand-orange transition-colors font-medium"
        >
          Top-Down Master Plan
        </button>
        <button
          onClick={() => setViewpoint('highway')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-brand-orange transition-colors font-medium"
        >
          Highway Entrance View
        </button>
        <button
          onClick={() => setViewpoint('park')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-brand-orange transition-colors font-medium"
        >
          Park & Green Space View
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 48, 62], fov: 45 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[40, 60, 30]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-30, 40, -20]} intensity={0.4} />

        <OrbitControls
          ref={controlsRef}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={15}
          maxDistance={120}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Scene Components */}
        <SceneGround />
        <Trees />
        <AnimatedCars animate={!reducedMotion} />

        {/* 96 Plots */}
        {plots.map((plot) => (
          <Plot3D
            key={plot.plotNumber}
            plot={plot}
            isSelected={selectedPlot && selectedPlot.plotNumber === plot.plotNumber}
            onSelect={onSelectPlot}
            reducedMotion={reducedMotion}
          />
        ))}
      </Canvas>
    </div>
  );
}
