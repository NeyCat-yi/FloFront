function rand(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(2);
}

export function generateRealtimeMetrics() {
  return [
    { name: 'pH 值', value: rand(7.5, 8.5), unit: '', status: 'normal', min: 7, max: 9, history: Array.from({ length: 20 }, () => rand(7.5, 8.5)) },
    { name: '药剂用量', value: rand(80, 120), unit: 'g/t', status: 'normal', min: 60, max: 130, history: Array.from({ length: 20 }, () => rand(80, 120)) },
    { name: '矿浆浓度', value: rand(30, 40), unit: '%', status: 'normal', min: 25, max: 45, history: Array.from({ length: 20 }, () => rand(30, 40)) },
    { name: '泡沫层厚度', value: rand(150, 250), unit: 'mm', status: 'normal', min: 100, max: 280, history: Array.from({ length: 20 }, () => rand(150, 250)) },
  ].map(m => {
    if (m.value < m.min * 1.05 && m.value > m.min * 0.95) m.status = 'warning';
    if (m.value < m.min || m.value > m.max) m.status = 'error';
    return m;
  });
}

export function generateParams() {
  return [
    { key: '1', name: '给矿量', current: rand(45, 55), setpoint: 50, unit: 't/h', status: '正常' },
    { key: '2', name: '磨矿细度', current: rand(65, 75), setpoint: 70, unit: '%-200目', status: '正常' },
    { key: '3', name: '浮选浓度', current: rand(30, 38), setpoint: 35, unit: '%', status: '正常' },
    { key: '4', name: 'pH 值', current: rand(8, 9), setpoint: 8.5, unit: '', status: '正常' },
    { key: '5', name: '捕收剂用量', current: rand(80, 100), setpoint: 90, unit: 'g/t', status: '正常' },
    { key: '6', name: '起泡剂用量', current: rand(20, 35), setpoint: 28, unit: 'g/t', status: '正常' },
    { key: '7', name: '充气量', current: rand(0.3, 0.5), setpoint: 0.4, unit: 'm³/min', status: '正常' },
    { key: '8', name: '浮选温度', current: rand(25, 35), setpoint: 30, unit: '℃', status: '正常' },
  ].map(p => {
    const diff = Math.abs(p.current - p.setpoint) / p.setpoint;
    if (diff > 0.1) p.status = '异常';
    else if (diff > 0.05) p.status = '偏离';
    return p;
  });
}

const alarmDescriptions = [
  '粗选槽液位异常升高',
  '扫选 pH 值超出设定范围',
  '精选泡沫层过薄',
  '捕收剂用量偏低',
  '磨矿细度未达标',
  '浮选温度偏离设定值',
  '铅精矿品位下降',
  '锌回收率低于预期',
];

const alarmTypes = ['液位报警', 'pH 报警', '泡沫报警', '药剂报警', '粒度报警', '温度报警', '品位报警', '回收率报警'];

export function generateAlarms() {
  const count = Math.floor(Math.random() * 5) + 3;
  return Array.from({ length: count }, (_, i) => {
    const levelRand = Math.random();
    const level = levelRand < 0.3 ? '紧急' : levelRand < 0.7 ? '警告' : '提示';
    const idx = Math.floor(Math.random() * alarmDescriptions.length);
    const h = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return {
      key: String(i + 1),
      time: `${h}:${m}:${s}`,
      type: alarmTypes[idx],
      description: alarmDescriptions[idx],
      level,
      handled: Math.random() > 0.6,
    };
  });
}

export function generateTrendData() {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  return {
    xAxis: hours,
    series: [
      { name: '铅品位', data: hours.map(() => rand(55, 65)) },
      { name: '锌品位', data: hours.map(() => rand(48, 58)) },
      { name: '铅回收率', data: hours.map(() => rand(80, 92)) },
      { name: '锌回收率', data: hours.map(() => rand(75, 88)) },
    ],
  };
}

export function generateComparisonData() {
  return [
    { name: '铅精矿', grade: rand(58, 65), recovery: rand(82, 92) },
    { name: '锌精矿', grade: rand(50, 57), recovery: rand(78, 88) },
    { name: '尾矿铅', grade: rand(0.3, 0.8), recovery: rand(5, 15) },
    { name: '尾矿锌', grade: rand(0.5, 1.2), recovery: rand(8, 18) },
  ];
}

export function generateDistributionData() {
  return {
    ph: Array.from({ length: 30 }, () => rand(7, 9)),
    concentration: Array.from({ length: 30 }, () => rand(28, 42)),
    dosage: Array.from({ length: 30 }, () => rand(70, 120)),
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
