import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  ApiOutlined,
  AppstoreOutlined,
  FileOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'menu',
      icon: <MenuFoldOutlined />,
      label: '菜单管理',
      onClick: () => navigate(`/admin/menu`),
    },
    {
      key: 'apis',
      icon: <ApiOutlined />,
      label: 'API管理',
      onClick: () => navigate(`/admin/apis`),
    },
    {
      key: 'pages',
      icon: <FileOutlined />,
      label: '页面管理',
      onClick: () => navigate(`/admin/pages`),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 