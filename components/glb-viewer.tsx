'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Center>
      <group ref={ref}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4FF00]/20 border-t-[#D4FF00]" />
        <span className="text-sm font-medium text-neutral-400">
          Downloading Asset... {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

interface GlbViewerProps {
  url: string;
  fullscreen?: boolean;
}

export default function GlbViewer({ url, fullscreen }: GlbViewerProps) {
  return (
    <div
      className={
        fullscreen
          ? 'relative h-full w-full bg-[#080808]'
          : 'relative h-[400px] w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#111]'
      }
    >
      <Canvas
        camera={{ position: [0, 1, 3], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} />
        <Suspense fallback={<Loader />}>
          <Model url={url} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={fullscreen}
          minDistance={1}
          maxDistance={10}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 backdrop-blur-sm">
        Drag to rotate / Scroll to zoom
      </div>
    </div>
  );
}
