import { useState, useEffect } from 'react';
import { Badge, List, Tag, Space, Button } from 'antd';
import { AlertOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { generateAlarms } from '../mock/data';

const levelColor = { '紧急': 'red', '警告': 'orange', '提示': 'blue' };

export default function AlarmPanel() {
  const [alarms, setAlarms] = useState(generateAlarms);

  useEffect(() => {
    const timer = setInterval(() => setAlarms(generateAlarms()), 8000);
    return () => clearInterval(timer);
  }, []);

  const total = alarms.length;
  const handled = alarms.filter((a) => a.handled).length;
  const unhandled = total - handled;

  const handleAlarm = (key) => {
    setAlarms((prev) => prev.map((a) => (a.key === key ? { ...a, handled: true } : a)));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ color: '#4fc3f7', fontWeight: 600, fontSize: 13, padding: '4px 0' }}>
        <AlertOutlined style={{ marginRight: 6 }} />
        报警信息
      </div>

      <Space size="middle" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span>总计 <Badge count={total} style={{ backgroundColor: '#555' }} /></span>
        <span>已处理 <Badge count={handled} style={{ backgroundColor: '#52c41a' }} /></span>
        <span>未处理 <Badge count={unhandled} style={{ backgroundColor: '#ff4d4f' }} /></span>
      </Space>

      <div style={{ flex: 1, overflow: 'auto', marginTop: 4 }}>
        <List
          size="small"
          dataSource={alarms}
          style={{ height: '100%' }}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '6px 8px',
                opacity: item.handled ? 0.5 : 1,
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
              actions={
                item.handled
                  ? [<CheckCircleOutlined style={{ color: '#52c41a' }} />]
                  : [
                      <Button
                        key="handle"
                        type="link"
                        size="small"
                        onClick={() => handleAlarm(item.key)}
                        style={{ padding: 0, fontSize: 11 }}
                      >
                        处理
                      </Button>,
                    ]
              }
            >
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color={levelColor[item.level]} style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px' }}>
                    {item.level}
                  </Tag>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{item.time}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 }}>{item.description}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{item.type}</div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
