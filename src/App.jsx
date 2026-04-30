import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Navbar from './components/Navbar';
import FlowChart from './components/FlowChart';
import RealtimeMonitor from './components/RealtimeMonitor';
import ParamTable from './components/ParamTable';
import AlarmPanel from './components/AlarmPanel';
import ChartPanel from './components/ChartPanel';
import './App.css';

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#4fc3f7',
          borderRadius: 6,
          colorBgContainer: '#1a1a1a',
          colorBgElevated: '#222',
        },
      }}
    >
      <div className="app-layout">
        <div className="navbar-row">
          <Navbar />
        </div>
        <div className="main-grid">
          <div className="cell-flow">
            <FlowChart />
          </div>
          <div className="cell-monitor">
            <RealtimeMonitor />
          </div>
          <div className="cell-param">
            <ParamTable />
          </div>
          <div className="cell-alarm">
            <AlarmPanel />
          </div>
          <div className="cell-chart">
            <ChartPanel />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
