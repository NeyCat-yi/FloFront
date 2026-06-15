import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';

const W = 1.5;
const H = 1.3;
const D = 1.5;

export default function FlotationCell({ color, product }) {
  const impeller = useRef(null);
  const foam = useRef(null);
  const phase = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (phase.current === null) phase.current = Math.random() * Math.PI * 2;
    if (impeller.current) impeller.current.rotation.y = t * 2.4 + phase.current;
    if (foam.current) {
      const s = 1 + Math.sin(t * 2.4 + phase.current) * 0.05;
      foam.current.scale.set(s, 1, s);
    }
  });

  if (product) {
    return (
      <group>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.45, 0.62, 1, 6]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} emissive={color} emissiveIntensity={0.45} transparent opacity={0.9} />
          <Edges color={color} />
        </mesh>
        <pointLight position={[0, 1.3, 0]} color={color} intensity={1.4} distance={3.5} />
      </group>
    );
  }

  return (
    <group>
      {/* 槽体 */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#0b1430" metalness={0.4} roughness={0.25} transparent opacity={0.5} />
        <Edges color={color} />
      </mesh>
      {/* 矿浆填充 */}
      <mesh position={[0, H * 0.32, 0]}>
        <boxGeometry args={[W * 0.86, H * 0.5, D * 0.86]} />
        <meshStandardMaterial color={color} transparent opacity={0.28} emissive={color} emissiveIntensity={0.28} />
      </mesh>
      {/* 泡沫层 */}
      <mesh ref={foam} position={[0, H * 0.62, 0]}>
        <boxGeometry args={[W * 0.86, 0.18, D * 0.86]} />
        <meshStandardMaterial color="#e8f4ff" transparent opacity={0.3} emissive={color} emissiveIntensity={0.18} />
      </mesh>
      {/* 主轴 */}
      <mesh position={[0, H * 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, H, 8]} />
        <meshStandardMaterial color="#3a4a70" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* 皮带轮 */}
      <mesh position={[0, H + 0.16, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 16]} />
        <meshStandardMaterial color="#243056" metalness={0.6} roughness={0.4} />
        <Edges color={color} />
      </mesh>
      {/* 电机 */}
      <mesh position={[0, H + 0.46, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />
        <meshStandardMaterial color="#1a2540" metalness={0.7} roughness={0.3} emissive={color} emissiveIntensity={0.12} />
      </mesh>
      {/* 叶轮 */}
      <group ref={impeller} position={[0, H * 0.2, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <boxGeometry args={[W * 0.7, 0.06, 0.18]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
