import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { GLTFResult } from '@react-three/fiber';
import * as THREE from 'three';

// Type definition for the GLB model
interface GLTFResult {
  nodes: any;
  materials: any;
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
}

// The actual 3D model component
function PlantPot(props: JSX.IntrinsicElements['group']) {
  // Use relative path that will work in both development and production
  const { nodes, materials, animations, scene } = useGLTF('./3d/plant_pot.glb') as unknown as GLTFResult;
  const group = useRef<THREE.Group>(null);
  
  // Rotate the model gently
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });
  
  // Handle any animation if present
  useEffect(() => {
    if (animations && animations.length > 0) {
      // Set up animation mixer and actions if needed
    }
  }, [animations]);
  
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={4.5} position={[0, -1.7, 0]} />
    </group>
  );
}

// The main component that sets up the 3D canvas
const PlantModel3D: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use Intersection Observer to detect when the component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  if (!isVisible) {
    return (
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ fontSize: '18px', color: '#888' }}>Loading 3D model...</div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '600px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ 
          background: 'transparent',
          width: '100%', 
          height: '100%'
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <PlantPot position={[0, 0, 0]} />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default PlantModel3D;

// Preload the 3D model
useGLTF.preload('./3d/plant_pot.glb');
