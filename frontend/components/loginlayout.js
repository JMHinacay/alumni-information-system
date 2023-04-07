import React from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Layout } from 'antd';
import ComponentTransition from './componentTransition';
const { Content } = Layout;

const LoginLayout = (props) => {
  return (
    <ComponentTransition>
      <Layout>
        <Content>{props.children}</Content>
        <div>
          <style global jsx>{`
            .centered {
              position: fixed;
              top: 25%;
              left: 40%;
              margin-top: -25px;
              margin-left: -50px;
            }
          `}</style>
        </div>
      </Layout>
    </ComponentTransition>
  );
};

export default LoginLayout;
