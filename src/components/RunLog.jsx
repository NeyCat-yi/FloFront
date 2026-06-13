import { useState, useEffect } from 'react';
import { Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { api } from '../api';

const reagentLabels = {
  oil_2: '2#油',
  msds: '乙硫氮',
  rocss: '黄药',
  copper: '硫酸铜',
  lime: '石灰',
  ds: '抑制剂',
  naoh: '氢氧化钠',
  flocc: '絮凝剂',
  blo: '通风电机',
  lgate: '液位阀门',
};

function formatTimestamp(ts) {
  if (!ts) return '--';
  return ts.replace('T', ' ').slice(0, 19);
}

export default function RunLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getRegentAll();
        if (res.data) {
          setLogs(
            res.data.map((entry, i) => ({
              key: String(entry.id ?? i),
              time: formatTimestamp(entry.timestamp),
              text: Object.entries(reagentLabels)
                .map(([k, label]) => `${label}: ${entry[k] ?? '--'}`)
                .join('  '),
            }))
          );
        }
      } catch (e) {
        console.error('运行日志加载失败:', e.message);
      }
    };
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="section-title">运行信息</div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {logs.map((entry) => (
          <div key={entry.key} className="log-entry">
            <span style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }}>
              <EditOutlined />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span className="log-entry-time">{entry.time}</span>
                <Tag color="blue" style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0 }}>
                  加药调整
                </Tag>
              </div>
              <div className="log-entry-text">
                {entry.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
