"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"

function Model({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath)
  return <primitive object={scene} scale={2} position={[0, -1.5, 0]} />
}

export default function Product3DViewer({ modelPath }: { modelPath: string }) {
  return (
    <Suspense
      fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading 3D model...</div>}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} className="w-full h-full absolute inset-0">
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Model modelPath={modelPath} />
        <OrbitControls />
        <Environment preset="studio" />
      </Canvas>
    </Suspense>
  )
}
