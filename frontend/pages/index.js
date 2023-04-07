import React, { useState, useContext } from 'react';
import Head from 'next/head';
import qs from 'qs';
import { devusername, devpassword } from '../shared/devsettings';
import { useRouter } from 'next/router';
import { post } from '../shared/global';
import { useForm } from 'react-hook-form';
import parseUrl from 'parse-url';
import { Row, Col, Input, Button, message, Typography } from 'antd';
import Icon from '@ant-design/icons';
import { HRInput, HRForm, HRButton } from '../components/commons';
import { AccountContext } from '../components/accessControl/AccountContext';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const MyLoginForm = () => {
  const router = useRouter();
  const [loginErrorMsg, setLoginErrorMsg] = useState(undefined);
  const accountContext = useContext(AccountContext);
  const methods = useForm({
    defaultValues: {
      username: process.env.NODE_ENV === 'development' ? devusername : null,
      password: process.env.NODE_ENV === 'development' ? devpassword : null,
    },
  });

  const onSubmit = (data) => {
    post('/api/authenticate', qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        const parts = parseUrl(window.location.href);
        const search = parts.search || '';
        accountContext.refetchAccount();
        // if (search) {
        //   const searchObj = qs.parse(search);
        //   router.replace(decodeURIComponent(searchObj.redirectUrl) || '/');
        // } else {
        //   router.replace('/dashboard');
        // }
      })
      .catch((error) => {
        if (error?.response?.status === 401)
          message.error('Wrong username and password. Please try again.');
        else message.error('Failed to login. Please try again later.');
      });
  };

  return (
    <div>
      <Row>
        <Col md={10} sm={0} xs={0}>
          <div
            style={{
              padding: '0px 5% 0px 5%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: '#34495e',
            }}
          >
            <h1
              style={{
                fontFamily: 'Poppins-Bold',
                fontWeight: 'bold',
                marginBottom: 0,
                color: 'white',
                fontSize: 28,
              }}
            >
              Protect personal information.
            </h1>
            <h1 style={{ color: 'white', fontSize: 28 }}>The identity saved could be your own.</h1>

            <div>
              <h2 style={{ fontFamily: 'Poppins-Light', opacity: 0.6, color: 'white' }}>
                The use of cellular phones or video recording devices; and sharing of photos/videos
                of any medical staff and/or patients inside hospital premises via any forms of media
                such as but not limited to social media, e-mail or magazines are{' '}
                <b>STRICTLY PROHIBITED.</b>
              </h2>
            </div>
          </div>
        </Col>
        <Col md={14} sm={24} xs={24}>
          <div
            style={{
              padding: '0px 5% 0px 5%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              alignSelf: 'center',
              justifyContent: 'center',
            }}
          >
            {/* <img src={logo} alt="HISMKII" style={{ width: 300 }} /> */}

            <div style={{ display: 'flex' }}>
              <h1 style={{ marginBottom: 0, fontWeight: 'bold', fontSize: 28 }}>
                Welcome to HISD3
                <sup
                  style={{
                    fontFamily: 'Poppins-Light',
                    fontWeight: 'bold',
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                >
                  Mark 2.0
                </sup>
                Human Resources
              </h1>
            </div>

            <h2 style={{ marginBottom: 20 }}>Sign in to continue</h2>

            <HRForm onSubmit={onSubmit} methods={methods}>
              <HRInput
                allowClear
                autoCapitalize={'off'}
                placeholder="Username"
                name="username"
                prefix={<UserOutlined />}
                style={{ marginBottom: 20 }}
              />
              <HRInput
                allowClear
                autoCapitalize={'off'}
                type="password"
                autoComplete={'new-password'}
                name="password"
                placeholder="Password"
                prefix={<LockOutlined />}
                style={{ marginBottom: 40 }}
              />
              {/* <Checkbox>Remember me</Checkbox>
              <Link className="login-form-forgot" to={''}>
                Forgot password
              </Link> */}
              <div>
                <HRButton style={{ width: '100%' }} type="primary" htmlType="submit">
                  Log in
                </HRButton>
              </div>
            </HRForm>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Login = () => (
  <>
    <Head>
      <title>HR | Login</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {/* <div className="centered" style={{ width: '22%' }}> */}
    <MyLoginForm />
    {/* </div> */}
  </>
);

export default Login;
