import React from 'react';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';

// css
// import 'styles/index.module.css';

const HRNavigationHeader = () => {
  const router = useRouter();
  const { Header } = Layout;
  return (
    <Header
      style={{
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: 0,
        paddingBottom: 0,
      }}
      id="header"
      className="fixed-top header-transparent"
    >
      <div>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>CLINFOSYS</span>
      </div>
      <span style={{ display: 'inherit' }}>
        <Menu mode="horizontal" style={{ backgroundColor: 'inherit', borderBottom: 0 }}>
          <Menu.Item style={{ borderBottom: '0' }} key="1" onClick={() => router.push('/')}>
            Home
          </Menu.Item>
          <Menu.Item style={{ borderBottom: '0' }} key="2">
            Features
          </Menu.Item>
          <Menu.Item style={{ borderBottom: '0' }} key="3">
            Pricing
          </Menu.Item>
          <Menu.Item style={{ borderBottom: '0' }} key="4">
            FAQ
          </Menu.Item>
          <Menu.Item style={{ borderBottom: '0' }} key="5">
            Contact
          </Menu.Item>
          <Menu.Item style={{ borderBottom: '0' }} key="6" onClick={() => router.push('/register')}>
            Register
          </Menu.Item>
          <Menu.Item style={{ borderBottom: '0' }} key="7" onClick={() => router.push('/login')}>
            Login
          </Menu.Item>
        </Menu>
      </span>
    </Header>
  );
};

export default HRNavigationHeader;
