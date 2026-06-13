import { useState, useEffect, useCallback } from 'react';
import { Table, InputNumber, message } from 'antd';
import { api } from '../api';

const reagentFields = [
  { key: 'oil_2', label: '2#油', unit: 'mL/min' },
  { key: 'msds', label: '乙硫氮', unit: 'mL/min' },
  { key: 'rocss', label: '黄药', unit: 'mL/min' },
  { key: 'copper', label: '硫酸铜', unit: 'mL/min' },
  { key: 'lime', label: '石灰', unit: 'mL/min' },
  { key: 'ds', label: '抑制剂', unit: 'mL/min' },
  { key: 'naoh', label: '氢氧化钠', unit: 'mL/min' },
  { key: 'flocc', label: '絮凝剂', unit: 'mL/min' },
  { key: 'blo', label: '通风电机功率', unit: 'kW' },
  { key: 'lgate', label: '液位阀门', unit: '%' },
];

export default function ParamTable() {
  const [data, setData] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const res = await api.getRegentLatest();
      if (res.data) {
        setData(reagentFields.map((f) => ({
          key: f.key,
          name: f.label,
          current: res.data[f.key],
          setpoint: res.data[f.key],
          unit: f.unit,
        })));
      }
    } catch (e) {
      console.error('加药数据加载失败:', e.message);
    }
  }, []);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, [loadData]);

  const handleSetpointChange = useCallback(async (fieldKey, value) => {
    setData((prev) =>
      prev.map((row) =>
        row.key === fieldKey ? { ...row, setpoint: value } : row
      )
    );
    try {
      const payload = {};
      data.forEach((row) => {
        payload[row.key] = row.key === fieldKey ? value : row.setpoint;
      });
      await api.addRegent(payload);
      message.success('加药调整已提交');
    } catch (e) {
      message.error('提交失败: ' + e.message);
    }
  }, [data]);

  const columns = [
    { title: '药剂', dataIndex: 'name', key: 'name', width: 90 },
    {
      title: '当前值',
      dataIndex: 'current',
      key: 'current',
      width: 75,
      render: (v) => (
        <span style={{ color: '#4fc3f7', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          {v ?? '--'}
        </span>
      ),
    },
    {
      title: '设定值',
      dataIndex: 'setpoint',
      key: 'setpoint',
      width: 90,
      render: (v, record) => (
        <InputNumber
          size="small"
          min={0}
          step={0.1}
          value={v}
          onChange={(val) => handleSetpointChange(record.key, val)}
          style={{ width: 68 }}
        />
      ),
    },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 60 },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="section-title">加药调整</div>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
        scroll={{ y: 'calc(100% - 30px)' }}
        rowKey="key"
        style={{ flex: 1 }}
      />
    </div>
  );
}
