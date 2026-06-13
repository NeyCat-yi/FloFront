import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FlowChart from './components/FlowChart';
import ProcessInfo from './components/ProcessInfo';
import ParamTable from './components/ParamTable';
import CameraFeed from './components/CameraFeed';
import RunLog from './components/RunLog';
import GradeSoftMeasure from './components/GradeSoftMeasure';
import ReagentOptimization from './components/ReagentOptimization';
import './App.css';

function Dashboard() {
  return (
    <div className="main-grid">
      <div className="cell-flow">
        <div className="panel">
          <FlowChart />
        </div>
      </div>
      <div className="cell-camera">
        <div className="panel">
          <div className="panel-inner">
            <CameraFeed />
          </div>
        </div>
      </div>
      <div className="cell-param">
        <div className="panel">
          <div className="panel-inner">
            <ParamTable />
          </div>
        </div>
      </div>
      <div className="cell-monitor">
        <div className="panel">
          <div className="panel-inner">
            <ProcessInfo />
          </div>
        </div>
      </div>
      <div className="cell-grade">
        <div className="panel">
          <div className="panel-inner">
            <GradeSoftMeasure />
          </div>
        </div>
      </div>
      <div className="cell-chart">
        <div className="panel">
          <div className="panel-inner">
            <RunLog />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#4fc3f7',
          borderRadius: 8,
          colorBgContainer: 'rgba(8, 14, 32, 0.6)',
          colorBgElevated: '#0c1225',
          fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
        },
        components: {
          Table: {
            headerBg: 'rgba(79, 195, 247, 0.06)',
            borderColor: 'rgba(79, 195, 247, 0.08)',
            rowHoverBg: 'rgba(79, 195, 247, 0.04)',
          },
          Select: {
            optionActiveBg: 'rgba(79, 195, 247, 0.08)',
          },
          InputNumber: {
            activeBorderColor: '#4fc3f7',
          },
        },
      }}
    >
      <BrowserRouter>
        <div className="app-layout">
          <div className="navbar-row">
            <Navbar />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reagent-optimization" element={<ReagentOptimization />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
}
