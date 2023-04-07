import {
  EditOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
  SelectOutlined,
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { gql, useQuery, useMutation } from '@apollo/react-hooks';
import { HRButton, HRDivider, HRPageHeader } from '@components/commons';

import { timekeepingStatusColorGenerator } from '@utils/constantFormatters';
import {
  Space,
  Spin,
  Tooltip,
  Typography,
  Result,
  message,
  Modal,
  Tag,
  List,
  Card,
  Image,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DEPARTMENT_QUERY } from 'pages/employees/list';
import React, { useState } from 'react';

const GET_PAYROLL = gql`
  query($id: UUID) {
    payroll: getPayrollById(id: $id) {
      id
      title
      dateStart
      dateEnd
      description
      status
    }
  }
`;

export const UPDATE_PAYROLL_STATUS = gql`
  mutation($id: UUID, $status: String) {
    updatePayrollStatus(id: $id, status: $status) {
      payload {
        id
      }
    }
  }
`;

function ViewPayroll() {
  const router = useRouter();

  //======================================Queries=================================
  const { data: getPayroll, loading: loadingGetPayroll, refetch: refetchTimekeeping } = useQuery(
    GET_PAYROLL,
    {
      variables: {
        id: router?.query.id,
      },
      fetchPolicy: 'network-only',
    },
  );

  //======================================Queries=================================
  //======================================Mutation================================

  const [updatePayrollStatus, { loading: loadingUpdateStatus }] = useMutation(
    UPDATE_PAYROLL_STATUS,
    {
      onCompleted: (data) => {
        refetchTimekeeping();
      },
      onError: () => {
        message.error('Something went wrong, Please try again later.');
      },
    },
  );

  //======================================Mutation================================

  const confirm = (status) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to set this payroll as ${status}?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        Modal.confirm({
          title: 'Confirm',
          icon: <ExclamationCircleOutlined />,
          content: 'Are you sure?',
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => {
            updatePayrollStatus({
              variables: { id: router?.query?.id, status: status },
            });
          },
        });
      },
    });
  };

  const menuItems = [
    {
      title: 'Payroll',
      src: '/payroll.jpg',
      link: '/#',
    },
    {
      title: 'Timekeeping',
      src: '/timekeeping.png',
      link: '/#',
    },
    {
      title: 'De Minimis',
      src: '/deminimis.jpg',
      link: '/#',
    },
    {
      title: 'Contributions',
      src: '/contributions.jpg',
      link: '/#',
    },
    {
      title: 'Loans',
      src: '/loans.jpg',
      link: '/#',
    },
    {
      title: 'Adjustments',
      src: '/adjustments.jpg',
      link: '/#',
    },
  ];
  return (
    <div>
      <Head>
        <title>View Payroll</title>
      </Head>
      {loadingGetPayroll ? (
        <div
          style={{
            height: 'calc(100vh - 160px)',
          }}
        >
          <Spin style={{ position: 'relative', top: '40%', left: '50%' }} size="large" />
        </div>
      ) : (
        <>
          {['ACTIVE', 'CANCELLED', 'FINALIZED'].includes(getPayroll?.payroll?.status) ? (
            <>
              <HRPageHeader
                title={
                  <>
                    {getPayroll?.payroll?.title}{' '}
                    <Tag color={timekeepingStatusColorGenerator(getPayroll?.payroll?.status)}>
                      {getPayroll?.payroll?.status}
                    </Tag>
                  </>
                }
                onBack={router.back}
                extra={
                  getPayroll?.payroll?.status == 'ACTIVE' && (
                    <Space size={'small'}>
                      <Tooltip title="Cancel Payroll">
                        <HRButton
                          shape="circle"
                          icon={<CloseOutlined />}
                          type="default"
                          danger
                          onClick={() => confirm('CANCELLED')}
                        />
                      </Tooltip>
                      <Link href={`/payroll/payroll/${router?.query?.id}/manage-employee`}>
                        <Tooltip title="Add/Remove Employees">
                          <HRButton
                            shape="circle"
                            icon={<UserSwitchOutlined />}
                            type="primary"
                            ghost
                          />
                        </Tooltip>
                      </Link>

                      <HRButton
                        icon={<CheckOutlined />}
                        type="primary"
                        onClick={() => {
                          confirm('FINALIZED');
                        }}
                      >
                        Finalize Payroll
                      </HRButton>
                    </Space>
                  )
                }
              />
              <Typography.Title level={5}>
                {moment(getPayroll?.payroll?.dateStart).format(' MMMM D, YYYY')} -
                {moment(getPayroll?.payroll?.dateEnd).format(' MMMM D, YYYY')}
              </Typography.Title>

              <Typography.Text>{getPayroll?.payroll?.description}</Typography.Text>
              <HRDivider />

              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 6,
                  xxl: 3,
                }}
                dataSource={menuItems}
                renderItem={(item) => (
                  <List.Item>
                    <Link href={item.link}>
                      <Card hoverable style={{ width: '100%' }}>
                        <Image
                          src={item.src}
                          layout="fill"
                          objectFit="cover"
                          quality={100}
                          preview={false}
                        />
                        <Meta
                          title={
                            <div
                              style={{
                                marginTop: 30,
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography.Title level={4}>{item.title}</Typography.Title>{' '}
                            </div>
                          }
                        />
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            </>
          ) : (
            <>
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                  <HRButton type="primary" onClick={router.back}>
                    Go Back
                  </HRButton>
                }
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ViewPayroll;
