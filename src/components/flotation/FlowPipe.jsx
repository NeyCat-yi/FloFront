import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 6;

export default function FlowPipe({ from, to, type, color }) {
  const refs = useRef([]);

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += type === 'foam' ? 1.7 : 0.25;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }, [from, to, type]);

  const tube = useMemo(
    () => new THREE.TubeGeometry(curve, 24, 0.025, 8, false),
    [curve],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speed = type === 'foam' ? 0.16 : 0.26;
    for (let i = 0; i < COUNT; i += 1) {
      const m = refs.current[i];
      if (!m) continue;
      const u = (t * speed + i / COUNT) % 1;
      m.position.copy(curve.getPointAt(u));
      m.material.opacity = (1 - Math.abs(u - 0.5) * 0.7) * 0.95;
    }
  });

  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color={color} transparent opacity={type === 'foam' ? 0.1 : 0.16} />
      </mesh>
      {Array.from({ length: COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <sphereGeometry args={[type === 'foam' ? 0.07 : 0.055, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
