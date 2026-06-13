import { useState, useEffect, useRef, useCallback } from 'react';
import { Select, InputNumber, Button, Table, Tag, message } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { api } from '../api';

const cellOptions = [
  { value: 'zinc-fast-rougher', label: '锌快粗选' },
  { value: 'lead-rougher', label: '铅粗选' },
  { value: 'zinc-scavenger', label: '锌扫选' },
  { value: 'lead-scavenger', label: '铅扫选' },
  { value: 'zinc-cleaner', label: '锌精选' },
  { value: 'lead-cleaner', label: '铅精选' },
];

const currentConditions = [
  { key: '1', name: '铅矿浆流量', value: 45.2, unit: 'm³/h', trend: 'up', pct: '+2%' },
  { key: '2', name: '锌矿浆流量', value: 38.7, unit: 'm³/h', trend: 'down', pct: '-5%' },
  { key: '3', name: '泡沫速度', value: 12.3, unit: 'mm/s', trend: 'flat', pct: '0%' },
  { key: '4', name: '捕收剂用量', value: 85.6, unit: 'kg/t', trend: 'up', pct: '+1%' },
  { key: '5', name: '起泡剂用量', value: 22.1, unit: 'kg/t', trend: 'down', pct: '-3%' },
  { key: '6', name: '通风电机功率', value: 37.5, unit: 'KW', trend: 'up', pct: '+2%' },
  { key: '7', name: '矿浆液位', value: 186, unit: 'mm', trend: 'flat', pct: '0%' },
];

const recommendations = [
  {
    key: '1', color: '#4fc3f7',
    glow: '0 0 18px rgba(79,195,247,0.25), inset 0 0 18px rgba(79,195,247,0.06)',
    changes: ['+2.5 kg/t', '+0.1 m³/min', '+20 mm'],
    recovery: '+1.20%', grade: '+1.20%', reason: '品位偏低',
  },
  {
    key: '2', color: '#ffb74d',
    glow: '0 0 18px rgba(255,183,77,0.25), inset 0 0 18px rgba(255,183,77,0.06)',
    changes: ['+1.5 kg/t', '+0.2 m³/min', '+10 mm'],
    recovery: '+0.70%', grade: '+0.70%', reason: '回收率偏低',
  },
  {
    key: '3', color: '#66bb6a',
    glow: '0 0 18px rgba(102,187,106,0.25), inset 0 0 18px rgba(102,187,106,0.06)',
    changes: ['-0.8 kg/t', '-0.05 m³/min', '+5 mm'],
    recovery: '+0.35%', grade: '+0.50%', reason: '泡沫质量',
  },
  {
    key: '4', color: '#ce93d8',
    glow: '0 0 18px rgba(206,147,216,0.25), inset 0 0 18px rgba(206,147,216,0.06)',
    changes: ['+3.0 kg/t', '+0.15 m³/min', '-15 mm'],
    recovery: '+1.50%', grade: '+0.90%', reason: '分离效率',
  },
];

const manualFields = [
  { key: 'blo', label: '鼓风机功率', rec: 30.0, unit: 'KW' },
  { key: 'lgate', label: '液位阀门开度', rec: 45.7, unit: '°' },
  { key: 'rocss', label: '丁黄药', recMin: 1000.0, recMax: 1200.0, unit: 'ml/min' },
  { key: 'copper', label: '硫酸铜', recMin: 3000.0, recMax: 3110.0, unit: 'ml/min' },
];

const algoColumns = [
  { title: '模型', dataIndex: 'name', key: 'name', ellipsis: true,
    render: (t) => <span style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 500 }}>{t}</span> },
  { title: '输入', dataIndex: 'input_type', key: 'input_type', width: 80,
    render: (t) => <span style={{ fontSize: 13 }}>{t}</span> },
  { title: '输出', dataIndex: 'output_type', key: 'output_type', width: 80,
    render: (t) => <span style={{ fontSize: 13 }}>{t}</span> },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true,
    render: (t) => <span style={{ fontSize: 13 }}>{t}</span> },
];

const mockAlgorithms = [
  { name: 'LSTM-Rec', input_type: '工艺参数', output_type: '药剂推荐', description: '基于长短期记忆网络的加药量推荐模型' },
  { name: 'XGBoost-Opt', input_type: '实时指标', output_type: '参数优化', description: '基于梯度提升树的浮选工艺参数优化模型' },
];

const historyColumns = [
  { title: '时间', dataIndex: 'timestamp', key: 'timestamp', width: 120,
    render: (t) => t ? t.replace('T', ' ').slice(0, 19) : '--' },
  { title: '2#油', dataIndex: 'oil_2', key: 'oil_2', width: 70,
    render: (v) => v != null ? v.toFixed(1) : '--' },
  { title: '黄药', dataIndex: 'rocss', key: 'rocss', width: 70,
    render: (v) => v != null ? v.toFixed(1) : '--' },
  { title: '硫酸铜', dataIndex: 'copper', key: 'copper', width: 70,
    render: (v) => v != null ? v.toFixed(1) : '--' },
  { title: '石灰', dataIndex: 'lime', key: 'lime', width: 70,
    render: (v) => v != null ? v.toFixed(1) : '--' },
];

function TrendIcon({ trend }) {
  if (trend === 'up') return <ArrowUpOutlined style={{ color: '#ff5252', fontSize: 12 }} />;
  if (trend === 'down') return <ArrowDownOutlined style={{ color: '#66bb6a', fontSize: 12 }} />;
  return <MinusOutlined style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }} />;
}

export default function ReagentOptimization() {
  const navigate = useNavigate();
  const [cell, setCell] = useState('zinc-fast-rougher');
  const [regent, setRegent] = useState({});
  const [algorithms, setAlgorithms] = useState([]);
  const [history, setHistory] = useState([]);
  const [edits, setEdits] = useState({});
  const predictRef = useRef(null);
  const predictInst = useRef(null);
  const scoreRef = useRef(null);
  const scoreInst = useRef(null);

  const loadRegent = useCallback(async () => {
    try {
      const res = await api.getRegentLatest();
      if (res.data) setRegent(res.data);
    } catch (_) {}
  }, []);

  const loadAlgo = useCallback(async () => {
    try {
      const res = await api.listAlgorithms();
      if (res.algorithms) setAlgorithms(res.algorithms);
    } catch (_) {}
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const res = await api.getRegentAll();
      if (res.data) setHistory(res.data);
    } catch (_) {}
  }, []);

  useEffect(() => {
    loadRegent();
    loadAlgo();
    loadHistory();
    const t = setInterval(loadRegent, 5000);
    return () => clearInterval(t);
  }, [loadRegent, loadAlgo, loadHistory]);

  // Prediction area chart
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!predictRef.current || predictRef.current.clientHeight === 0) return;
      if (!predictInst.current) predictInst.current = echarts.init(predictRef.current, 'dark');
      const x = Array.from({ length: 31 }, (_, i) => i);
      predictInst.current.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: { data: ['回收率变化', '品位变化'], bottom: 0, textStyle: { color: '#aaa', fontSize: 12 } },
        grid: { top: 20, right: 16, bottom: 32, left: 44 },
        xAxis: { type: 'category', data: x, axisLabel: { color: '#888', fontSize: 11 }, nameTextStyle: { color: '#888', fontSize: 11 } },
        yAxis: { type: 'value', min: -1, max: 2, axisLabel: { color: '#888', fontSize: 11, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(79, 195, 247, 0.06)' } } },
        series: [
          {
            name: '回收率变化', type: 'line', smooth: true, showSymbol: false,
            data: x.map(v => +(0.2 + 1.6 * (1 - Math.exp(-v / 10))).toFixed(2)),
            lineStyle: { color: '#4fc3f7', width: 2 }, itemStyle: { color: '#4fc3f7' },
            areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(79,195,247,0.25)' }, { offset: 1, color: 'rgba(79,195,247,0)' },
            ]) },
          },
          {
            name: '品位变化', type: 'line', smooth: true, showSymbol: false,
            data: x.map(v => +(-0.3 + 0.8 * (1 - Math.exp(-v / 15))).toFixed(2)),
            lineStyle: { color: '#ffb74d', type: 'dashed', width: 2 }, itemStyle: { color: '#ffb74d' },
            areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255,183,77,0.12)' }, { offset: 1, color: 'rgba(255,183,77,0)' },
            ]) },
          },
        ],
      });
    }, 60);
    const resize = () => predictInst.current?.resize();
    window.addEventListener('resize', resize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', resize); };
  }, [cell]);

  // Stability score ring
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scoreRef.current || scoreRef.current.clientHeight === 0) return;
      if (!scoreInst.current) scoreInst.current = echarts.init(scoreRef.current, 'dark');
      scoreInst.current.setOption({
        backgroundColor: 'transparent',
        series: [{
          type: 'gauge', startAngle: 90, endAngle: -270, radius: '92%', center: ['50%', '50%'],
          pointer: { show: false },
          progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: { color: '#4fc3f7' } },
          axisLine: { lineStyle: { width: 10, color: [[1, 'rgba(79, 195, 247, 0.08)']] } },
          axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
          title: { offsetCenter: [0, '35%'], fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-display)' },
          detail: { offsetCenter: [0, '-5%'], fontSize: 34, fontWeight: 700, color: '#4fc3f7', fontFamily: 'var(--font-mono)' },
          data: [{ value: 82, name: '稳定性' }],
        }],
      });
    }, 60);
    const resize = () => scoreInst.current?.resize();
    window.addEventListener('resize', resize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', resize); };
  }, []);

  const handleApply = useCallback(async () => {
    try {
      const payload = { ...regent };
      Object.entries(edits).forEach(([k, v]) => { if (v != null) payload[k] = v; });
      await api.addRegent(payload);
      message.success('调整已提交');
      setEdits({});
      loadRegent();
    } catch (e) {
      message.error('提交失败: ' + e.message);
    }
  }, [regent, edits, loadRegent]);

  return (
    <div className="reagent-page">
      {/* ─── 顶部工具栏：返回 + 浮选槽选择 ─── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0, padding: '0 2px',
      }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="reagent-back-btn"
          style={{ padding: '0 4px', height: 28, fontSize: 14 }}
        >返回主页</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-display)' }}>
            当前浮选槽：
          </span>
          <Select value={cell} onChange={setCell} options={cellOptions} style={{ width: 140 }} />
        </div>
      </div>

      {/* ─── 上半区：三列 22% / 38% / 40% ─── */}
      <div style={{ flex: 55, display: 'grid', gridTemplateColumns: '22% 38% 40%', gap: 10, minHeight: 0 }}>
        {/* 当前工况 + 稳定性分数 */}
        <div className="reagent-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="reagent-title">当前工况</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {currentConditions.map((c) => (
              <div key={c.key} className="reagent-condition-row" style={{ padding: '6px 4px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    color: '#4fc3f7', fontSize: 14, fontWeight: 600,
                    fontFamily: 'var(--font-mono)', letterSpacing: '-0.3px',
                  }}>{c.value}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{c.unit}</span>
                  <TrendIcon trend={c.trend} />
                  <span style={{
                    color: c.trend === 'up' ? '#ff5252' : c.trend === 'down' ? '#66bb6a' : 'var(--text-muted)',
                    fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500,
                  }}>{c.pct}</span>
                </div>
              </div>
            ))}
          </div>
          {/* 稳定性分数 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginTop: 8,
            paddingTop: 8, borderTop: '1px solid rgba(79, 195, 247, 0.08)',
            paddingLeft: 16,
          }}>
            <div style={{ width: 110, height: 110, flexShrink: 0 }} ref={scoreRef} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpOutlined style={{ color: '#66bb6a', fontSize: 14 }} />
                <span style={{
                  color: '#66bb6a', fontSize: 18, fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}>6</span>
              </div>
              <span style={{
                color: 'var(--text-muted)', fontSize: 12,
                fontFamily: 'var(--font-display)',
              }}>相较30min前</span>
            </div>
          </div>
        </div>

        {/* 加药推荐 */}
        <div className="reagent-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="reagent-title">加药推荐</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
            {recommendations.map((rec) => (
              <div key={rec.key} style={{
                padding: '14px 16px', borderRadius: 10,
                border: `1px solid ${rec.color}30`,
                boxShadow: rec.glow,
                background: 'var(--bg-card)',
                transition: 'background 0.2s ease',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {rec.changes.map((c, i) => (
                      <Tag key={i} style={{
                        background: `${rec.color}18`, color: rec.color,
                        border: 'none', fontSize: 13, margin: 0, padding: '2px 10px',
                        fontFamily: 'var(--font-mono)', fontWeight: 500,
                      }}>{c}</Tag>
                    ))}
                  </div>
                  <Tag color={
                    rec.color === '#4fc3f7' ? 'blue' :
                    rec.color === '#ffb74d' ? 'orange' :
                    rec.color === '#66bb6a' ? 'green' : 'purple'
                  } style={{
                    fontSize: 12, lineHeight: '20px', padding: '0 8px',
                  }}>{rec.reason}</Tag>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  预计提升：<span style={{ color: '#66bb6a', fontWeight: 600 }}>回收率 {rec.recovery}</span>
                  ，<span style={{ color: '#66bb6a', fontWeight: 600 }}>品位 {rec.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 加药后预测 */}
        <div className="reagent-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="reagent-title">加药后预测</div>
          <div ref={predictRef} style={{ flex: 1, minHeight: 0 }} />
        </div>
      </div>

      {/* ─── 下半区：手动调节 / 模型选择 / 决策历史 = 4:3.5:2.5 ─── */}
      <div style={{ flex: 45, display: 'grid', gridTemplateColumns: '4fr 3.5fr 2.5fr', gap: 10, minHeight: 0 }}>
        {/* 手动调节 */}
        <div className="reagent-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 6,
          }}>
            <span className="reagent-title" style={{ marginBottom: 0 }}>手动调节</span>
            <Button type="primary" onClick={handleApply} style={{ fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>
              提交调整
            </Button>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, overflow: 'auto' }}>
            {manualFields.map((f) => {
              const val = edits[f.key] ?? regent[f.key] ?? 0;
              const hasRange = f.recMin != null;
              const recDisplay = hasRange ? `${f.recMin} ~ ${f.recMax}` : `${f.rec}`;
              return (
                <div key={f.key} className="reagent-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
                    fontFamily: 'var(--font-display)',
                  }}>{f.label}</div>
                  {/* 推荐值行 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>推荐</span>
                    <span style={{
                      color: '#66bb6a', fontSize: 14, fontWeight: 600,
                      fontFamily: 'var(--font-mono)', letterSpacing: '-0.3px',
                    }}>{recDisplay}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{f.unit}</span>
                  </div>
                  {/* 设定值行 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>设定</span>
                    <InputNumber value={val} step={0.1}
                      onChange={(v) => setEdits((p) => ({ ...p, [f.key]: v }))}
                      style={{ flex: 1, minWidth: 90 }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{f.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 模型选择 */}
        <div className="reagent-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="reagent-title">模型选择</div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Table
              dataSource={(algorithms.length > 0 ? algorithms : mockAlgorithms).map((a, i) => ({ ...a, key: String(i) }))}
              columns={algoColumns}
              pagination={false}
              size="middle"
              style={{ width: '100%' }}
              locale={{ emptyText: (
                <div style={{
                  padding: '40px 0', color: 'var(--text-muted)',
                  fontSize: 14, fontFamily: 'var(--font-display)',
                }}>
                  暂无可用模型
                </div>
              ) }}
            />
          </div>
        </div>

        {/* 决策历史 */}
        <div className="reagent-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="reagent-title">决策历史</div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Table
              dataSource={history.slice(0, 10).map((h, i) => ({ ...h, key: String(i) }))}
              columns={historyColumns}
              pagination={false}
              size="middle"
              style={{ width: '100%' }}
              locale={{ emptyText: (
                <div style={{
                  padding: '40px 0', color: 'var(--text-muted)',
                  fontSize: 14, fontFamily: 'var(--font-display)',
                }}>
                  暂无历史记录
                </div>
              ) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
