import { useRef, useEffect, useState } from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';

const cameras = [
  { id: 1, label: '粗选槽', src: 'http://localhost:8888/camera1/index.m3u8' },
  { id: 2, label: '粗选槽预测', src: 'http://localhost:8888/camera2/index.m3u8' },
  { id: 3, label: '精选槽', src: 'http://localhost:8888/camera3/index.m3u8' },
  { id: 4, label: '精选槽预测', src: 'http://localhost:8888/camera4/index.m3u8' },
];

function CameraSlot({ label, src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!src) return;
    let destroyed = false;

    import('hls.js').then((Hls) => {
      if (destroyed || !videoRef.current) return;
      const hls = new Hls.default();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!destroyed) {
          videoRef.current?.play();
          setConnected(true);
        }
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setConnected(false);
      });
      playerRef.current = hls;
    }).catch(() => {});

    return () => {
      destroyed = true;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setConnected(false);
    };
  }, [src]);

  return (
    <div className={`camera-slot ${connected ? 'connected' : ''}`}>
      <div className="camera-label">{label}</div>
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: connected ? 'block' : 'none' }}
      />
      {!connected && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VideoCameraOutlined style={{ fontSize: 24, color: 'rgba(79, 195, 247, 0.35)' }} />
          <div className="camera-placeholder-text">等待接入...</div>
        </div>
      )}
    </div>
  );
}

export default function CameraFeed() {
  return (
    <div className="camera-grid">
      {cameras.map((c) => (
        <CameraSlot key={c.id} label={c.label} src={c.src} />
      ))}
    </div>
  );
}
