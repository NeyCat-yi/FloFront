import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import FlotationCell from './flotation/FlotationCell';
import FlowPipe from './flotation/FlowPipe';
import { nodes, links, nodeMap, STAGE_COLORS } from './flotation/sceneData';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.45} color="#6fb6ff" />
      <directionalLight position={[6, 12, 8]} intensity={0.9} />
      <pointLight position={[-9, 6, 6]} color="#4fc3f7" intensity={0.7} distance={22} />
      <pointLight position={[8, 6, -6]} color="#ffb74d" intensity={0.45} distance={22} />

      {nodes.map((n) => (
        <group key={n.id} position={n.pos}>
          <FlotationCell color={STAGE_COLORS[n.stage]} product={n.product} />
          <Html position={[0, n.product ? 1.6 : 2.25, 0]} center distanceFactor={14} pointerEvents="none">
            <div className="flow3d-label">{n.label}</div>
          </Html>
        </group>
      ))}

      {links.map((l, i) => (
        <FlowPipe
          key={i}
          from={nodeMap[l.from].pos}
          to={nodeMap[l.to].pos}
          type={l.type}
          color={STAGE_COLORS[nodeMap[l.from].stage]}
        />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#070c1c" metalness={0.2} roughness={0.9} transparent opacity={0.4} />
      </mesh>
    </>
  );
}

export default function FlowChart3D() {
  return (
    <div className="flow-3d-wrap">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 8.5, 13], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Scene />
      </Canvas>
      <div className="flow3d-legend">
        <span><i className="lg-line solid" />尾矿/矿浆</span>
        <span><i className="lg-line dashed" />泡沫/精矿</span>
      </div>
    </div>
  );
}
