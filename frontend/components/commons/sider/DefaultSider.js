import React, { useContext, useState, useEffect } from 'react';
import { Layout, Row, Col, Menu } from 'antd';
import { getPages } from 'routes';
import { AccountContext } from 'components/accessControl/AccountContext';
import { useRouter } from 'next/router';
import parseUrl from 'parse-url';
import { isInClient } from 'utils/next';
import QueryString from 'qs';

const { Sider } = Layout;

const DefaultSider = ({ state, toggleCollapsed, setState }) => {
  const router = useRouter();
  const accountContext = useContext(AccountContext);
  const [siderState, setSiderState] = useState({
    keys: [],
    key: -1,
  });

  useEffect(() => {
    let selectedKeys = router.pathname.split('/').map((l) => '/' + l);
    selectedKeys.splice(0, 1);
    setSiderState({
      keys: selectedKeys,
    });
  }, [window.location.pathname]);

  const handleClickMenu = ({ item, key, keyPath, sel }) => {
    setSiderState({
      keys: keyPath,
      key: key,
    });
    let newRoutes = { ...router.query };
    let nextQueryString = Object.getOwnPropertyNames(router.query);
    nextQueryString.forEach((value) => {
      if (key.indexOf(`[${value}]`) < 0) delete newRoutes[value];
    });

    router.push({ pathname: keyPath.reverse().join(''), query: { ...newRoutes } });
  };

  const renderMenuItems = (page, idx) => {
    if (page.children) {
      return (
        <Menu.SubMenu title={page.title} icon={page.icon} key={page.url}>
          {page.children.map((item) => {
            return renderMenuItems(item, `${item.url}`);
          })}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={idx} icon={page.icon}>
        {page.title}
      </Menu.Item>
    );
  };

  return (
    <Sider
      theme="light"
      collapsed={state.collapsed}
      // collapsed={true}
      width={'270px'}
      breakpoint={'sm'}
      onCollapse={toggleCollapsed}
      style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1, overflow: 'auto' }}
    >
      <Row
        className="logo"
        align="middle"
        justify="space-around"
        style={{ marginBottom: 100, overflow: 'hidden' }}
      >
        <Col className={state.collapsed ? 'submenu-title' : ''}>
          <span style={{ fontSize: '24px' }}>
            <b>{!state.collapsed ? 'HUMAN RESOURCE' : 'HR'}</b>
          </span>
        </Col>
      </Row>
      <Menu
        mode="inline"
        onClick={handleClickMenu}
        triggerSubMenuAction={state.collapsed ? 'hover' : 'click'}
        defaultOpenKeys={siderState.keys || []}
        // defaultSelectedKeys={'keys' in state ? state.keys : []}
        openKeys={siderState.keys || []}
        selectedKeys={siderState.keys || []}
        onOpenChange={(keys) => {
          setSiderState({
            keys,
            display: 'none',
            displayLogo: 'block',
          });
        }}
      >
        {getPages(accountContext?.data?.user?.roles || []).map((page) => {
          return renderMenuItems(page, page.url);
        })}
      </Menu>
    </Sider>
  );
};

export default DefaultSider;
