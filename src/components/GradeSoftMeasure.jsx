import { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import * as echarts from 'echarts';
import { flotationCells, generateGradeData } from '../mock/data';

function GaugeChart({ value, label, min, max, color }) {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(ref.current, 'dark');
    }
    instanceRef.current.setOption({
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min,
        max,
        radius: '95%',
        center: ['50%', '60%'],
        progress: { show: true, width: 8, itemStyle: { color } },
        pointer: { length: '55%', width: 3, itemStyle: { color } },
        axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(79, 195, 247, 0.08)']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: {
          offsetCenter: [0, '80%'],
          fontSize: 11,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-display)',
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '45%'],
          fontSize: 16,
          fontWeight: 700,
          color,
          fontFamily: 'var(--font-mono)',
          formatter: '{value}%',
        },
        data: [{ value, name: label }],
      }],
    });
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [value]);

  useEffect(() => () => { instanceRef.current?.dispose(); instanceRef.current = null; }, []);

  return <div ref={ref} style={{ width: '100%', height: '100%', minHeight: 80 }} />;
}

export default function GradeSoftMeasure() {
  const [cell, setCell] = useState(flotationCells[0].key);
  const [data, setData] = useState(() => generateGradeData(cell));

  useEffect(() => {
    setData(generateGradeData(cell));
    const timer = setInterval(() => setData(generateGradeData(cell)), 3000);
    return () => clearInterval(timer);
  }, [cell]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div className="section-title">品位软测量</div>
        <Select
          size="small"
          value={cell}
          onChange={setCell}
          options={flotationCells.map((c) => ({ value: c.key, label: c.label }))}
          style={{ width: 120 }}
        />
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 8, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          {data.records.map((r) => {
            const isMeasured = r.label === '测量值';
            const dotColor = isMeasured ? '#4fc3f7' : '#81c784';
            return (
              <div key={r.key} className="grade-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: dotColor, display: 'inline-block',
                    boxShadow: `0 0 6px ${dotColor}50`,
                  }} />
                  <span style={{
                    color: dotColor, fontSize: 11, fontWeight: 600,
                    fontFamily: 'var(--font-display)', letterSpacing: 0.5,
                  }}>
                    {r.label}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="grade-value">{r.value}%</span>
                  <span className="grade-time">{r.time}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <GaugeChart value={data.feedGrade} label="入矿品位" min={0} max={70} color="#4fc3f7" />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <GaugeChart value={data.concentrateGrade} label="精矿品位" min={0} max={80} color="#ffb74d" />
          </div>
        </div>
      </div>
    </div>
  );
}
