import { Dropdown, Menu, Badge, Avatar, Space, theme } from 'antd';
import {
  ExperimentOutlined,
  BulbOutlined,
  ControlOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { menuItems } from '../mock/data';

const { useToken } = theme;

export default function Navbar() {
  const { token } = useToken();

  const buildMenu = (items) => ({
    items: items.map((item, idx) => ({ key: String(idx), label: item })),
  });

  const menus = [
    { ...menuItems.smartDetection, icon: <ExperimentOutlined /> },
    { ...menuItems.optimization, icon: <BulbOutlined /> },
    { ...menuItems.systemMode, icon: <ControlOutlined /> },
    { ...menuItems.userManagement, icon: <UserOutlined /> },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        background: '#141414',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Space size="middle">
        <MenuFoldOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
        <span style={{ fontSize: 16, fontWeight: 600, color: token.colorPrimary }}>
          铅锌矿浮选智能检测与决策系统
        </span>
      </Space>

      <Space size="large">
        {menus.map((menu) => (
          <Dropdown key={menu.label} menu={buildMenu(menu.items)} placement="bottomLeft">
            <span
              style={{
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {menu.icon} {menu.label}
            </span>
          </Dropdown>
        ))}
      </Space>

      <Space size="middle">
        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }} />
        </Badge>
        <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
      </Space>
    </div>
  );
}
