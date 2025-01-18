'use client'; // This ensures the component runs on the client side

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { PerspectiveCameraProps } from '@react-three/fiber';

const Model = () => {
  const { scene } = useGLTF('/space_nebula_hdri_panorama_360_skydome.glb'); // Replace with your model's path

  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      {/* Adjust the camera settings */}
      <PerspectiveCamera makeDefault fov={50} position={[0, 0, 10]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* The model */}
      <primitive object={scene} scale={1} />
      
      {/* OrbitControls */}
      <OrbitControls
        enableZoom={true}
        minDistance={5} // Minimum zoom-out distance
        maxDistance={20} // Maximum zoom-in distance
        target={[0, 0, 0]} // Focus point of the camera
      />
    </Canvas>
  );
};

export default Model;
