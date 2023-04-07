import React, { useState, useEffect, useContext } from 'react';
import { AccountConsumer, AccountProvider } from './AccountContext';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { ModalProvider } from 'react-modal-hook';
import { Modal } from 'antd';
import { getUrlPrefix, post } from '@shared/global';

const AuthManager = (props) => {
  const router = useRouter();
  const { loading, error, data, refetch, called } = useQuery(
    gql`
      {
        account {
          id
          fullName
          firstName
          middleName
          lastName
          user {
            activated
            access
            roles
          }
          department {
            id
            departmentName
          }
          departmentOfDuty {
            id
            departmentName
          }
        }
      }
    `,
    {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  );

  if (data?.account?.user?.activated === false) {
    post(`/api/logout`, {
      credentials: 'include',
    }).finally(async () => {
      router.replace(`/reset-password`);
    });
  }

  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    window.showSessionExpiredModal = () => {
      if (router.route !== '/') {
        setSessionExpired(true);
        Modal.error({
          title: 'Not Authenticated',
          content: 'Your sesssion has expired. You will be forced to logout.',
          onOk: async () => {
            Modal.destroyAll();
            await router.push(
              `/?redirectUrl=${encodeURIComponent(
                location.href.substring(location.origin.length),
              )}`,
            );
            refetch();
          },
        });
      }
    };
  }, [router.route]);

  const blank = (
    <div>
      <style global jsx>{`
        * {
          margin: 0;
          padding: 0;
        }

        html,
        body {
          width: 100%;
          height: 100%;
        }
        #__next {
          height: 100% !important;
        }

        #__next::before {
          background-size: 60px 40px;
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );

  // might be redundant because we already have apollo-http-link to catch for network errors
  // if (error) {
  //   if (error.networkError && error.networkError.statusCode === 401) {
  //     const parts = parseUrl(window.location.href);
  //     const pathname = parts.pathname || '';
  //     const search = parts.search || '';
  //     const hash = parts.hash || '';

  //     window.location = '/login?redirectUrl=' + encodeURIComponent(pathname + search + hash);
  //   }
  // }

  // we might not need this.. so I commented this for now
  // if (!data) {
  //   return blank;
  // }

  useEffect(() => {
    if (router.route === '/') {
      if (sessionExpired) router.reload();
      else if (data) {
        if (router?.query?.redirectUrl) router.replace(router.query.redirectUrl);
        else router.replace('/dashboard');
      }
    }
  }, [data, router?.pathname, sessionExpired]);

  if (error?.networkError?.response?.status === 401 && router.route !== '/') return null;
  if (!data && loading) return null;
  // if (loading && called) return null;
  if (data && router.pathname === '/') return null;

  return (
    <AccountProvider value={{ data: data?.account, refetchAccount: refetch }}>
      <AccountConsumer>
        {(value) => {
          const childrenWithProps = React.Children.map(props.children, (child) =>
            React.cloneElement(child, {
              account: value.data,
              refetchAccount: value.refetchAccount,
            }),
          );

          return <ModalProvider>{childrenWithProps}</ModalProvider>;
        }}
      </AccountConsumer>
    </AccountProvider>
  );
};

export default AuthManager;
