import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import * as THREE from 'three';

export default function StlModel({ url, onBounds }) {
  const [geom, setGeom] = useState(null);
  const [error, setError] = useState(null);
  const meshRef = useRef(null);
  const { camera } = useThree();

  useEffect(() => {
    console.log('[StlModel] fetching:', url);
    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        console.log('[StlModel] loaded OK, verts:', geometry.attributes.position?.count);
        setGeom(geometry);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          console.log('[StlModel] progress:', pct + '%');
        }
      },
      (err) => {
        console.error('[StlModel] FAIL:', err.message || err, err);
        setError(err.message || String(err));
      },
    );
  }, [url]);

  useEffect(() => {
    if (!geom || !meshRef.current) return;
    try {
      console.log('[StlModel] fitting bounds...');
      geom.computeBoundingBox();
      const box = geom.boundingBox;
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const s = 12 / maxDim;
      console.log('[StlModel] size:', size.toArray().map((v) => v.toFixed(1)), 'scale:', s.toFixed(4));

      meshRef.current.position.set(-center.x, -center.y, -center.z);
      meshRef.current.scale.setScalar(s);

      camera.position.set(0, maxDim * s * 0.5, maxDim * s * 0.82);
      camera.lookAt(0, maxDim * s * 0.08, 0);
      camera.updateProjectionMatrix();
      console.log('[StlModel] camera at:', camera.position.toArray().map((v) => v.toFixed(1)));
    } catch (e) {
      console.error('[StlModel] bounds error:', e);
    }

    if (onBounds) {
      const box = geom.boundingBox;
      const c = new THREE.Vector3(); box.getCenter(c);
      const sz = new THREE.Vector3(); box.getSize(sz);
      const s = 12 / Math.max(sz.x, sz.y, sz.z, 1);
      onBounds({ center: c, size: sz, scale: s });
    }
  }, [geom, camera, onBounds]);

  if (error) {
    console.log('[StlModel] rendering error state:', error);
    return null;
  }

  if (!geom) {
    console.log('[StlModel] rendering placeholder');
    return (
      <mesh>
        <boxGeometry args={[6, 2.5, 6]} />
        <meshStandardMaterial color="#1a3a5c" metalness={0.2} roughness={0.5} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    );
  }

  console.log('[StlModel] rendering model');
  return (
    <mesh ref={meshRef} geometry={geom}>
      <meshStandardMaterial
        color="#2a4a6a"
        metalness={0.65}
        roughness={0.35}
        emissive="#1a2a4a"
        emissiveIntensity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
