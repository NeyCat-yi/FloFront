function rand(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(2);
}

export const flotationCells = [
  { key: 'lead-rougher', label: '铅粗选槽' },
  { key: 'lead-scavenger', label: '铅扫选槽' },
  { key: 'lead-cleaner', label: '铅精选槽' },
  { key: 'zinc-rougher', label: '锌粗选槽' },
  { key: 'zinc-scavenger', label: '锌扫选槽' },
  { key: 'zinc-cleaner', label: '锌精选槽' },
];

const cellGradeRanges = {
  'lead-rougher':   { feed: [2, 5], concentrate: [50, 62] },
  'lead-scavenger': { feed: [1, 3], concentrate: [40, 52] },
  'lead-cleaner':   { feed: [40, 55], concentrate: [58, 68] },
  'zinc-rougher':   { feed: [3, 7], concentrate: [42, 55] },
  'zinc-scavenger': { feed: [1, 4], concentrate: [35, 48] },
  'zinc-cleaner':   { feed: [35, 50], concentrate: [50, 60] },
};

export function generateGradeData(cellKey) {
  const range = cellGradeRanges[cellKey] || cellGradeRanges['lead-rougher'];
  const now = new Date();
  const ts = (offset) => {
    const d = new Date(now.getTime() + offset);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };
  return {
    feedGrade: rand(...range.feed),
    concentrateGrade: rand(...range.concentrate),
    records: [
      { key: '1', label: '测量值', time: ts(0), value: rand(...range.concentrate) },
      { key: '2', label: '预测值', time: ts(0), value: rand(...range.concentrate) },
    ],
  };
}

export const menuItems = {
  smartDetection: {
    label: '智能检测',
    items: ['实时监控', '历史数据查询', '工艺指标分析', '数据导出', '检测报告'],
  },
  optimization: {
    label: '优化决策',
    items: ['药剂优化', '工艺参数优化', '回收率预测', '经济效益分析'],
  },
  systemMode: {
    label: '系统模式',
    items: ['自动模式', '半自动模式', '手动模式', '仿真模式'],
  },
  userManagement: {
    label: '用户管理',
    items: ['用户列表', '角色权限', '操作日志', '系统设置'],
  },
};
