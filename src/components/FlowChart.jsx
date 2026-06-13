import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const catColors = ['#4fc3f7', '#ffb74d', '#ef5350'];

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function nodeGradient(catIdx) {
  const [r, g, b] = hexToRgb(catColors[catIdx]);
  return {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: `rgba(${r},${g},${b},0.7)` },
      { offset: 1, color: `rgba(${r},${g},${b},0.15)` },
    ],
  };
}

const nodes = [
  { name: '原矿', x: 70, y: 220, symbolSize: 50, symbol: 'circle', category: 0 },
  { name: '球磨机/旋流器', x: 200, y: 220, symbolSize: 50, symbol: 'roundRect', category: 0 },
  { name: '铅快粗选', x: 350, y: 220, symbolSize: 48, symbol: 'circle', category: 1 },
  { name: '铅快精选', x: 450, y: 100, symbolSize: 44, symbol: 'roundRect', category: 1 },
  { name: '铅精选', x: 620, y: 100, symbolSize: 44, symbol: 'roundRect', category: 1 },
  { name: '铅精矿', x: 790, y: 100, symbolSize: 46, symbol: 'rect', category: 1 },
  { name: '铅粗选', x: 480, y: 340, symbolSize: 44, symbol: 'roundRect', category: 1 },
  { name: '铅扫选', x: 650, y: 340, symbolSize: 44, symbol: 'roundRect', category: 1 },
  { name: '锌精矿', x: 90, y: 470, symbolSize: 46, symbol: 'rect', category: 2 },
  { name: '锌精选', x: 260, y: 470, symbolSize: 44, symbol: 'roundRect', category: 2 },
  { name: '锌扫选', x: 430, y: 470, symbolSize: 44, symbol: 'roundRect', category: 2 },
  { name: '锌粗选', x: 600, y: 470, symbolSize: 44, symbol: 'roundRect', category: 2 },
  { name: '锌快粗选', x: 770, y: 470, symbolSize: 48, symbol: 'circle', category: 2 },
];

const solidLinks = [
  { source: '原矿', target: '球磨机/旋流器' },
  { source: '球磨机/旋流器', target: '铅快粗选' },
  { source: '铅快粗选', target: '铅粗选' },
  { source: '铅粗选', target: '铅扫选' },
  { source: '铅扫选', target: '锌快粗选' },
  { source: '锌快粗选', target: '锌粗选' },
  { source: '锌粗选', target: '锌扫选' },
  { source: '锌精选', target: '锌快粗选', lineStyle: { curveness: 0.3 } },
];

const dashedLinks = [
  { source: '铅快粗选', target: '铅快精选' },
  { source: '铅快精选', target: '铅精选' },
  { source: '铅精选', target: '铅精矿' },
  { source: '铅扫选', target: '铅粗选' },
  { source: '锌快粗选', target: '锌精选' },
  { source: '锌精选', target: '锌精矿' },
  { source: '锌扫选', target: '锌粗选' },
  { source: '锌粗选', target: '锌快粗选', lineStyle: { curveness: 0.3 } },
];

const categories = [
  { name: '预处理', itemStyle: { color: catColors[0] } },
  { name: '铅浮选', itemStyle: { color: catColors[1] } },
  { name: '锌浮选', itemStyle: { color: catColors[2] } },
];

const DATA_CENTER = [430, 285];
const REF_W = 860;
const REF_H = 520;

function buildLegend() {
  const textColor = 'rgba(255,255,255,0.55)';
  return [
    {
      type: 'group',
      left: 20,
      bottom: 6,
      children: [
        { type: 'line', shape: { x1: 0, y1: 0, x2: 25, y2: 0 }, style: { stroke: '#aaa', lineWidth: 2 } },
        { type: 'polygon', shape: { points: [[25, 0], [20, -3], [20, 3]] }, style: { fill: '#aaa' } },
        { type: 'text', left: 30, top: -5, style: { text: '尾矿', fill: textColor, fontSize: 10 } },
        { type: 'line', shape: { x1: 70, y1: 0, x2: 95, y2: 0 }, style: { stroke: '#aaa', lineWidth: 2, lineDash: [4, 2] } },
        { type: 'polygon', shape: { points: [[95, 0], [90, -3], [90, 3]] }, style: { fill: '#aaa' } },
        { type: 'text', left: 100, top: -5, style: { text: '泡沫', fill: textColor, fontSize: 10 } },
      ],
    },
  ];
}

export default function FlowChart() {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, 'dark');
    instanceRef.current = chart;

    const nodeCat = {};
    nodes.forEach((n) => { nodeCat[n.name] = n.category; });

    const shadowColors = catColors.map((c) => {
      const [r, g, b] = hexToRgb(c);
      return `rgba(${r},${g},${b},0.4)`;
    });

    function linkColor(source) {
      const [r, g, b] = hexToRgb(catColors[nodeCat[source]]);
      return `rgba(${r},${g},${b},0.5)`;
    }

    const links = [
      ...solidLinks.map((l) => ({
        ...l,
        lineStyle: { type: 'solid', width: 1.5, color: linkColor(l.source), ...(l.lineStyle || {}) },
      })),
      ...dashedLinks.map((l) => ({
        ...l,
        lineStyle: { type: 'dashed', width: 1.5, color: linkColor(l.source), ...(l.lineStyle || {}) },
      })),
    ];

    function calcZoom() {
      const el = chartRef.current;
      if (!el) return 1;
      const rect = el.getBoundingClientRect();
      return Math.min(rect.width / REF_W, rect.height / REF_H);
    }

    const nodeData = nodes.map((n) => ({
      ...n,
      itemStyle: {
        color: nodeGradient(n.category),
        borderColor: catColors[n.category],
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: shadowColors[n.category],
        shadowOffsetY: 2,
      },
      emphasis: {
        itemStyle: { shadowBlur: 20, borderWidth: 3 },
      },
    }));

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        formatter: (p) =>
          p.dataType === 'node'
            ? `<b>${p.name}</b>`
            : `${p.data.source} → ${p.data.target}`,
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          zoom: calcZoom(),
          center: DATA_CENTER,
          roam: false,
          label: { show: true, fontSize: 11, color: '#fff', fontWeight: 500 },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [4, 10],
          categories,
          data: nodeData,
          links,
        },
      ],
      graphic: buildLegend(),
    });

    const onResize = () => {
      chart.resize();
      chart.setOption({ series: [{ zoom: calcZoom() }] });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className="flow-chart-container"
    />
  );
}
