import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Float,
    MeshDistortMaterial,
    Sphere,
    MeshWobbleMaterial,
} from "@react-three/drei";

function AnimatedSphere() {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 100, 200]} scale={1.8}>
                <MeshDistortMaterial
                    color="#38bdf8"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
        </Float>
    );
}

function FloatingCube() {
    return (
        <Float speed={2} rotationIntensity={2} floatIntensity={1}>
            <mesh position={[4, 2, -2]} rotation={[45, 45, 45]}>
                <boxGeometry args={[0.8, 0.8, 0.8]} />
                <MeshWobbleMaterial color="#a78bfa" factor={0.6} speed={1.5} />
            </mesh>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <AnimatedSphere />
                <FloatingCube />
            </Canvas>
        </div>
    );
}
