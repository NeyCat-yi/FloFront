import { useState, useEffect } from 'react';
import { Card, Space, Tag } from 'antd';
import { generateRealtimeMetrics } from '../mock/data';

const statusColor = { normal: '#52c41a', warning: '#faad14', error: '#ff4d4f' };
const statusLabel = { normal: '正常', warning: '警告', error: '异常' };

function MiniChart({ data, color }) {
  const points = data.map((v, i) => `${i * 6},${60 - ((v - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 50}`).join(' ');
  return (
    <svg width="114" height="60" style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export default function RealtimeMonitor() {
  const [metrics, setMetrics] = useState(generateRealtimeMetrics);

  useEffect(() => {
    const timer = setInterval(() => setMetrics(generateRealtimeMetrics()), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
      <div style={{ color: '#4fc3f7', fontWeight: 600, fontSize: 13, padding: '4px 0' }}>实时检测</div>
      {metrics.map((m) => (
        <Card
          key={m.name}
          size="small"
          style={{ background: 'rgba(0,0,0,0.3)', borderColor: statusColor[m.status] + '44', flex: 1 }}
          styles={{ body: { padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }}
        >
          <div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{m.name}</div>
            <Space size={4} align="baseline">
              <span style={{ color: statusColor[m.status], fontSize: 20, fontWeight: 700 }}>{m.value}</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{m.unit}</span>
            </Space>
            <div><Tag color={statusColor[m.status]} style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>{statusLabel[m.status]}</Tag></div>
          </div>
          <MiniChart data={m.history} color={statusColor[m.status]} />
        </Card>
      ))}
    </div>
  );
}
