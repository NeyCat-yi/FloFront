import { VideoCameraOutlined } from '@ant-design/icons';

export default function CameraFeed() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: 8,
        border: '1px dashed rgba(79, 195, 247, 0.3)',
        gap: 12,
      }}
    >
      <VideoCameraOutlined style={{ fontSize: 48, color: 'rgba(79, 195, 247, 0.4)' }} />
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>实时摄像头检测视频</div>
      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>等待接入视频流...</div>
    </div>
  );
}
