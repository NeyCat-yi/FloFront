import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const nodes = [
  { name: '原矿给矿', x: 80, y: 150, symbolSize: 50, category: 0 },
  { name: '磨矿', x: 230, y: 150, symbolSize: 50, category: 0 },
  { name: '分级', x: 380, y: 150, symbolSize: 50, category: 0 },
  { name: '铅粗选', x: 530, y: 80, symbolSize: 50, category: 1 },
  { name: '铅扫选', x: 680, y: 80, symbolSize: 45, category: 1 },
  { name: '铅精选', x: 830, y: 80, symbolSize: 45, category: 1 },
  { name: '锌粗选', x: 530, y: 220, symbolSize: 50, category: 2 },
  { name: '锌扫选', x: 680, y: 220, symbolSize: 45, category: 2 },
  { name: '锌精选', x: 830, y: 220, symbolSize: 45, category: 2 },
  { name: '尾矿', x: 530, y: 300, symbolSize: 40, category: 3 },
];

const links = [
  { source: '原矿给矿', target: '磨矿' },
  { source: '磨矿', target: '分级' },
  { source: '分级', target: '铅粗选' },
  { source: '分级', target: '锌粗选' },
  { source: '分级', target: '尾矿' },
  { source: '铅粗选', target: '铅扫选' },
  { source: '铅扫选', target: '铅精选' },
  { source: '锌粗选', target: '锌扫选' },
  { source: '锌扫选', target: '锌精选' },
];

const categories = [
  { name: '给矿', itemStyle: { color: '#4fc3f7' } },
  { name: '铅浮选', itemStyle: { color: '#ffb74d' } },
  { name: '锌浮选', itemStyle: { color: '#81c784' } },
  { name: '尾矿', itemStyle: { color: '#90a4ae' } },
];

export default function FlowChart() {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    instanceRef.current = echarts.init(chartRef.current, 'dark');

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '浮选工艺流程图',
        left: 'center',
        top: 8,
        textStyle: { color: '#4fc3f7', fontSize: 14, fontWeight: 600 },
      },
      tooltip: {
        formatter: (params) => {
          if (params.dataType === 'node') return `<b>${params.name}</b>`;
          return `${params.data.source} → ${params.data.target}`;
        },
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          symbol: 'roundRect',
          roam: false,
          label: { show: true, fontSize: 11, color: '#fff' },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: { fontSize: 10 },
          lineStyle: { color: '#555', curveness: 0.2, width: 2 },
          categories,
          data: nodes.map((n) => ({
            ...n,
            category: n.category,
            itemStyle: {
              ...categories[n.category].itemStyle,
              shadowBlur: 12,
              shadowColor: categories[n.category].itemStyle.color,
            },
            label: { color: '#fff' },
          })),
          links,
        },
      ],
    };

    instanceRef.current.setOption(option);

    const activeIdx = [3, 6];
    const timer = setInterval(() => {
      const pulseNodes = nodes.map((n, i) => ({
        ...n,
        category: n.category,
        itemStyle: {
          ...categories[n.category].itemStyle,
          shadowBlur: activeIdx.includes(i) ? (20 + Math.random() * 15) : 8,
          shadowColor: activeIdx.includes(i)
            ? categories[n.category].itemStyle.color
            : 'transparent',
        },
        label: { color: '#fff' },
      }));
      instanceRef.current?.setOption({
        series: [{ data: pulseNodes }],
      });
    }, 1500);

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
      instanceRef.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 200,
        border: '1px solid rgba(79, 195, 247, 0.3)',
        borderRadius: 8,
        background: 'rgba(0,0,0,0.3)',
        boxShadow: '0 0 15px rgba(79, 195, 247, 0.15)',
      }}
    />
  );
}
