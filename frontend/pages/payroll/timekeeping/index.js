import Head from 'next/head';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/react-hooks';
import React, { useState } from 'react';
import {
  UnorderedListOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { HRButton, HRPageHeader, HRTable, EditTimekeepingDetailsModal } from '@components/commons';
import { Space, Tooltip } from 'antd';
import _ from 'lodash';

const TIMEKEEPING_QUERY = gql`
  query {
    timekeepingList: timekeepings {
      id
      title
      dateStart
      dateEnd
      status
      createdBy
      createdDate
    }
  }
`;

function TimekeepingPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const { data, loading } = useQuery(TIMEKEEPING_QUERY, {
    fetchPolicy: 'network-only',
  });

  const showModal = (id) => {
    setSelectedId(id);
    setIsModalVisible(true);
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date Range',
      dataIndex: 'dateRange',
      key: 'dateRange',
      render: (text, record) => {
        {
          return (
            <div>
              {moment(record.dateStart).format(' MMMM D, YYYY')} -
              {moment(record.dateEnd).format(' MMMM D, YYYY')}
            </div>
          );
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text) => {
        return <div>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</div>;
      },
    },

    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      render: (text, record) => {
        var link;
        record.status === 'DRAFT'
          ? (link = `/payroll/timekeeping/${record.id}/edit`)
          : (link = `/payroll/timekeeping/${record.id}`);
        return (
          <Space size={'small'}>
            <Link href={link}>
              <Tooltip title="View Timekeeping">
                <HRButton shape="circle" ghost icon={<UnorderedListOutlined />} type="primary" />
              </Tooltip>
            </Link>
            <Tooltip title="Edit Details">
              <HRButton
                shape="circle"
                ghost
                icon={<EditOutlined />}
                type="primary"
                onClick={(e) => {
                  showModal(record.id);
                }}
              />
            </Tooltip>
            {record.status === 'DRAFT' && (
              <Tooltip title="Delete">
                <HRButton
                  shape="circle"
                  danger
                  ghost
                  icon={<DeleteOutlined />}
                  type="primary"
                  onClick={(e) => {
                    showModal(record.id);
                  }}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Head>
        <title>Timekeeping</title>
      </Head>
      <HRPageHeader
        title="Timekeeping"
        extra={
          <Link href={'/payroll/timekeeping/create'}>
            <HRButton type="primary">
              <PlusOutlined />
              New Timekeeping
            </HRButton>
          </Link>
        }
      />

      <HRTable
        dataSource={_.get(data, 'timekeepingList')}
        columns={columns}
        pagination={false}
        loading={loading}
      />

      <EditTimekeepingDetailsModal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        timekeepingId={selectedId}
      />
    </div>
  );
}

export default TimekeepingPage;
