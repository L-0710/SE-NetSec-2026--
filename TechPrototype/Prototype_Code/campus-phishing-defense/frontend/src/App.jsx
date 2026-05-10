import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Space, message } from 'antd';
import { 
  HomeOutlined, 
  LinkOutlined, 
  MailOutlined, 
  PlaySquareOutlined, 
  BarChartOutlined, 
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined
} from '@ant-design/icons';

import Dashboard from './pages/Dashboard';
import UrlDetection from './pages/UrlDetection';
import EmailAnalysis from './pages/EmailAnalysis';
import Training from './pages/Training';
import Reports from './pages/Reports';
import KnowledgeBase from './pages/KnowledgeBase';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';

const { Header, Sider, Content } = Layout;

const SidebarMenu = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/" style={{ color: 'white' }}>仪表盘</Link>,
    },
    {
      key: '/url-detection',
      icon: <LinkOutlined />,
      label: <Link to="/url-detection" style={{ color: 'white' }}>URL检测</Link>,
    },
    {
      key: '/email-analysis',
      icon: <MailOutlined />,
      label: <Link to="/email-analysis" style={{ color: 'white' }}>邮件头分析</Link>,
    },
    {
      key: '/training',
      icon: <PlaySquareOutlined />,
      label: <Link to="/training" style={{ color: 'white' }}>宣教演练</Link>,
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: <Link to="/reports" style={{ color: 'white' }}>统计报表</Link>,
    },
    {
      key: '/knowledge-base',
      icon: <BookOutlined />,
      label: <Link to="/knowledge-base" style={{ color: 'white' }}>安全知识库</Link>,
    },
    {
      key: '/user-management',
      icon: <TeamOutlined />,
      label: <Link to="/user-management" style={{ color: 'white' }}>用户管理</Link>,
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ 
        backgroundColor: '#1890ff', 
        borderRight: 0,
      }}
      items={menuItems}
      theme="dark"
    />
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    message.success('已退出登录');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <UserOutlined /> 个人中心
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider 
            width={220}
            theme="dark" 
            style={{ 
              backgroundColor: '#1890ff',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              overflow: 'auto'
            }}
          >
            <div className="logo">
              <div className="logo-title">
                校园钓鱼防御平台
              </div>
              <div className="logo-subtitle">
                校园安全防御系统
              </div>
            </div>
            <SidebarMenu />
          </Sider>
          <Layout style={{ marginLeft: 220, minHeight: '100vh' }}>
            <Header style={{ 
              backgroundColor: 'white', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
              padding: '0 24px',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                height: '100%'
              }}>
                <div className="header-title" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  校园钓鱼防御与宣教平台
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Dropdown overlay={userMenu} placement="bottomRight">
                    <Button type="text" icon={<UserOutlined />} style={{ marginRight: 8 }}>
                      {currentUser?.username || '管理员'}
                    </Button>
                  </Dropdown>
                  <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                    {currentUser?.username?.charAt(0) || '管'}
                  </Avatar>
                </div>
              </div>
            </Header>
            <Content style={{ 
              padding: 24, 
              background: '#f0f2f5',
              minHeight: 'calc(100vh - 64px)'
            }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/url-detection" element={<UrlDetection />} />
                <Route path="/email-analysis" element={<EmailAnalysis />} />
                <Route path="/training" element={<Training />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/user-management" element={<UserManagement />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      )}
    </Router>
  );
}

export default App;