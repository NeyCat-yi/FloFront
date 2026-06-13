import { useState, useEffect } from 'react';
import {
  ExperimentOutlined,
  ThunderboltOutlined,
  FireOutlined,
  AimOutlined,
} from '@ant-design/icons';
import { api } from '../api';

const fields = [
  { key: 'lead_inGrade', label: '铅入矿品位', unit: '%', icon: 'lead', color: '#ffb74d' },
  { key: 'zinc_inGrade', label: '锌入矿品位', unit: '%', icon: 'zinc', color: '#81c784' },
  { key: 'dealed_gauge', label: '已处理矿石量', unit: 't', icon: 'ore', color: '#4fc3f7' },
  { key: 'consumed_regent', label: '药剂消耗量', unit: 'kg', icon: 'reagent', color: '#ce93d8' },
  { key: 'consumed_energy', label: '能耗', unit: 'kWh', icon: 'energy', color: '#ff8a65' },
];

const iconMap = {
  lead: <ExperimentOutlined />,
  zinc: <ExperimentOutlined />,
  ore: <FireOutlined />,
  reagent: <AimOutlined />,
  energy: <ThunderboltOutlined />,
};

export default function ProcessInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getBasicLatest();
        setInfo(res.data);
      } catch (e) {
        console.error('流程信息加载失败:', e.message);
      }
    };
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="section-title">铅锌矿流程信息</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {fields.map((f) => (
          <div key={f.key} className="info-card">
            <span className="info-icon" style={{ color: f.color }}>
              {iconMap[f.icon]}
            </span>
            <span className="info-label">{f.label}</span>
            <span className="info-value" style={{ color: f.color }}>
              {info ? info[f.key] : '--'}
            </span>
            <span className="info-unit">{f.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
