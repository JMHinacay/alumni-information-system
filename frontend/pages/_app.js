import React, { useEffect } from 'react';
import { apolloClient } from '../shared/global';
import { ApolloProvider } from '@apollo/react-hooks';
import AuthManager from '../components/accessControl/AuthManager';
import AccessManager from '../components/accessControl/AccessManager';
import { useRouter } from 'next/router';
import MainLayout from '../components/mainlayout';
import LoginLayout from '../components/loginlayout';
import _ from 'lodash';
import { newConfig } from 'routes/config';

import NProgress from 'nprogress';
import 'styles/global.css';
import 'styles/nprogress.css';
import { message } from 'antd';

NProgress.configure({ showSpinner: false, speed: 650 });

// message config
message.config({
  maxCount: 4,
});

const child = ({ children }) => children;

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());
  }, []);

  const Layout = Component.Layout || child;
  if (router.route === '/')
    return (
      <ApolloProvider client={apolloClient}>
        <AuthManager>
          <LoginLayout>
            <Component {...pageProps} />
          </LoginLayout>
        </AuthManager>
      </ApolloProvider>
    );

  //check if we have a config for a given path
  if (_.has(newConfig, router.pathname) && !newConfig[router.pathname]?.isPublic) {
    return (
      <ApolloProvider client={apolloClient}>
        <AuthManager>
          <AccessManager {...pageProps}>
            <MainLayout>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </MainLayout>
          </AccessManager>
        </AuthManager>
      </ApolloProvider>
    );
  } else if (!_.has(newConfig, router.pathname) && router.pathname !== '/404') {
    // you need to configure the path in the /routes/config.js
    //throw new Error('No config in the given path');
  }
  if (router.route === '/reset-password') {
    return <Component {...pageProps} />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
