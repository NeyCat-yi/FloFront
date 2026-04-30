import { useState, useEffect, useCallback } from 'react';
import { Table, InputNumber, Tag } from 'antd';
import { generateParams } from '../mock/data';

const statusColors = { '正常': 'green', '偏离': 'orange', '异常': 'red' };

export default function ParamTable() {
  const [data, setData] = useState(generateParams);

  useEffect(() => {
    const timer = setInterval(() => setData(generateParams()), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSetpointChange = useCallback((key, value) => {
    setData((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;
        const updated = { ...row, setpoint: value };
        const diff = Math.abs(updated.current - value) / value;
        updated.status = diff > 0.1 ? '异常' : diff > 0.05 ? '偏离' : '正常';
        return updated;
      })
    );
  }, []);

  const columns = [
    { title: '参数名', dataIndex: 'name', key: 'name', width: 100 },
    {
      title: '当前值',
      dataIndex: 'current',
      key: 'current',
      width: 80,
      render: (v) => <span style={{ color: '#4fc3f7', fontWeight: 600 }}>{v}</span>,
    },
    {
      title: '设定值',
      dataIndex: 'setpoint',
      key: 'setpoint',
      width: 100,
      render: (v, record) => (
        <InputNumber
          size="small"
          min={0}
          step={0.1}
          value={v}
          onChange={(val) => handleSetpointChange(record.key, val)}
          style={{ width: 72 }}
        />
      ),
    },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 70 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ color: '#4fc3f7', fontWeight: 600, fontSize: 13, padding: '4px 0 8px' }}>实时参数表格</div>
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
