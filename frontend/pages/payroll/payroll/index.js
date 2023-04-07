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
import {
  HRButton,
  HRPageHeader,
  HRTablePaginated,
  HRSearch,
  EditPayrollDetailsModal,
} from '@components/commons';
import { Space, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { payrollStatusColorGenerator } from '@utils/constantFormatters';

const PAYROLL_PAGABLE_QUERY = gql`
  query($pageSize: Int, $page: Int, $filter: String) {
    payrolls: getPayrollByPagination(pageSize: $pageSize, page: $page, filter: $filter) {
      content {
        id
        title
        dateStart
        dateEnd
        status
        createdBy
        createdDate
      }
      totalElements
    }
  }
`;

const initialFilterState = { page: 0, pageSize: 10, filter: '' };

function PayrollPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [filterState, setFilterState] = useState(initialFilterState);

  const { data, loading } = useQuery(PAYROLL_PAGABLE_QUERY, {
    fetchPolicy: 'network-only',
    variables: filterState,
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
      render: (text) => <Tag color={payrollStatusColorGenerator(text)}>{text}</Tag>,
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
          ? (link = `/payroll/payroll/${record.id}/edit`)
          : (link = `/payroll/payroll/${record.id}`);
        return (
          <Space size={'small'}>
            <Link href={link}>
              <Tooltip title="View Payroll">
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

  const onPaginationChange = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };
  return (
    <div>
      <Head>
        <title>Payroll</title>
      </Head>
      <HRPageHeader
        title="Payroll"
        extra={
          <Link href={'/payroll/payroll/create'}>
            <HRButton type="primary">
              <PlusOutlined />
              New Payroll
            </HRButton>
          </Link>
        }
      />

      <HRSearch
        label="Search Payroll"
        allowClear
        onSearch={(value) => {
          setFilterState({ ...filterState, filter: value });
        }}
      />

      <HRTablePaginated
        dataSource={data?.payrolls?.content}
        columns={columns}
        loading={loading}
        //pagination props
        total={data?.payrolls?.totalElements}
        pageSize={filterState?.pageSize}
        onChange={onPaginationChange}
        current={filterState?.page + 1}
      />

      <EditPayrollDetailsModal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        payrollId={selectedId}
      />
    </div>
  );
}

export default PayrollPage;
