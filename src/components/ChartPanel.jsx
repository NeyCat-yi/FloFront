import { useState, useEffect, useRef } from 'react';
import { Segmented } from 'antd';
import * as echarts from 'echarts';
import { generateTrendData, generateComparisonData, generateDistributionData } from '../mock/data';

const timeRanges = ['近1小时', '近6小时', '近24小时'];

function ComparisonChart() {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) instanceRef.current = echarts.init(chartRef.current, 'dark');
    const data = generateComparisonData();
    instanceRef.current.setOption({
      backgroundColor: 'transparent',
      tooltip: {},
      legend: { bottom: 0, textStyle: { color: '#aaa', fontSize: 10 } },
      grid: { top: 20, right: 20, bottom: 30, left: 40 },
      xAxis: { type: 'category', data: data.map((d) => d.name), axisLabel: { fontSize: 10, color: '#888' } },
      yAxis: { type: 'value', axisLabel: { fontSize: 9, color: '#888' }, splitLine: { lineStyle: { color: '#333' } } },
      series: [
        { name: '品位 (%)', type: 'bar', data: data.map((d) => d.grade), itemStyle: { color: '#4fc3f7' } },
        { name: '回收率 (%)', type: 'bar', data: data.map((d) => d.recovery), itemStyle: { color: '#ffb74d' } },
      ],
    });

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); instanceRef.current?.dispose(); instanceRef.current = null; };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}

function DistributionChart() {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) instanceRef.current = echarts.init(chartRef.current, 'dark');
    const data = generateDistributionData();
    const buildHistData = (values, bins = 10) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const step = (max - min) / bins;
      const counts = Array(bins).fill(0);
      const labels = [];
      values.forEach((v) => { counts[Math.min(Math.floor((v - min) / step), bins - 1)]++; });
      for (let i = 0; i < bins; i++) labels.push((min + step * i).toFixed(1));
      return { labels, counts };
    };

    const phHist = buildHistData(data.ph);

    instanceRef.current.setOption({
      backgroundColor: 'transparent',
      tooltip: {},
      legend: { bottom: 0, textStyle: { color: '#aaa', fontSize: 10 } },
      grid: { top: 20, right: 20, bottom: 30, left: 40 },
      xAxis: { type: 'category', data: phHist.labels, axisLabel: { fontSize: 8, color: '#888', rotate: 30 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 9, color: '#888' }, splitLine: { lineStyle: { color: '#333' } } },
      series: [
        { name: 'pH 分布', type: 'bar', data: phHist.counts, itemStyle: { color: '#81c784' } },
      ],
    });

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); instanceRef.current?.dispose(); instanceRef.current = null; };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}

export default function ChartPanel() {
  const [tab, setTab] = useState('趋势图');
  const [timeRange, setTimeRange] = useState('近24小时');
  const trendRef = useRef(null);
  const trendInstance = useRef(null);

  useEffect(() => {
    if (!trendRef.current) return;
    if (!trendInstance.current) trendInstance.current = echarts.init(trendRef.current, 'dark');
    const data = generateTrendData();
    trendInstance.current.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { data: data.series.map((s) => s.name), bottom: 0, textStyle: { color: '#aaa', fontSize: 10 } },
      grid: { top: 20, right: 20, bottom: 30, left: 40 },
      xAxis: { type: 'category', data: data.xAxis, axisLabel: { fontSize: 9, color: '#888' } },
      yAxis: { type: 'value', axisLabel: { fontSize: 9, color: '#888' }, splitLine: { lineStyle: { color: '#333' } } },
      series: data.series.map((s) => ({ ...s, type: 'line', smooth: true, showSymbol: false })),
    });

    const handleResize = () => trendInstance.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); trendInstance.current?.dispose(); trendInstance.current = null; };
  }, [tab, timeRange]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 8px' }}>
        <span style={{ color: '#4fc3f7', fontWeight: 600, fontSize: 13 }}>数据面板</span>
        {tab === '趋势图' && (
          <Segmented
            size="small"
            options={timeRanges}
            value={timeRange}
            onChange={setTimeRange}
          />
        )}
      </div>
      <Segmented
        block
        size="small"
        options={['趋势图', '对比图', '分布图']}
        value={tab}
        onChange={setTab}
        style={{ marginBottom: 8 }}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        {tab === '趋势图' && <div ref={trendRef} style={{ width: '100%', height: '100%' }} />}
        {tab === '对比图' && <ComparisonChart />}
        {tab === '分布图' && <DistributionChart />}
      </div>
    </div>
  );
}
