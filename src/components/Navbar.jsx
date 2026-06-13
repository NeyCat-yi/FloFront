import { Dropdown, Badge, Avatar, Space, theme } from 'antd';
import {
  ExperimentOutlined,
  BulbOutlined,
  ControlOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../mock/data';

const { useToken } = theme;

export default function Navbar() {
  const { token } = useToken();
  const navigate = useNavigate();

  const handleMenuClick = (menuLabel, itemLabel) => {
    if (menuLabel === '优化决策' && itemLabel === '药剂优化') {
      navigate('/reagent-optimization');
    }
  };

  const buildMenu = (menu, items) => ({
    items: items.map((item, idx) => ({
      key: String(idx),
      label: item,
      onClick: () => handleMenuClick(menu.label, item),
    })),
  });

  const menus = [
    { ...menuItems.smartDetection, icon: <ExperimentOutlined /> },
    { ...menuItems.optimization, icon: <BulbOutlined /> },
    { ...menuItems.systemMode, icon: <ControlOutlined /> },
    { ...menuItems.userManagement, icon: <UserOutlined /> },
  ];

  return (
    <div className="navbar">
      <Space size="middle">
        <MenuFoldOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
        <span className="navbar-title">
          铅锌矿浮选智能检测与决策系统
        </span>
      </Space>

      <Space size="large">
        {menus.map((menu) => (
          <Dropdown key={menu.label} menu={buildMenu(menu, menu.items)} placement="bottomLeft">
            <span className="navbar-menu-item">
              {menu.icon} {menu.label}
            </span>
          </Dropdown>
        ))}
      </Space>

      <Space size="middle">
        <Badge count={3} size="small">
          <BellOutlined className="navbar-icon" />
        </Badge>
        <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
      </Space>
    </div>
  );
}
