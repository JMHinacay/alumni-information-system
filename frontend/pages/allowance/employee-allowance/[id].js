import { HRPageHeader, HRTable } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import { useGetEmpAllowanceByEmpId } from '@hooks/employeeAllowance';
import { Divider, Statistic, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
const initialFilterState = {
  filter: '',
  size: 10,
  page: 0,
  department: null,
};

function EmployeeAllowancePage() {
  const router = useRouter();

  const { data, loading, refetch } = useGetEmpAllowanceByEmpId({
    id: router?.query.id,
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },

    {
      title: 'Taxable',
      dataIndex: 'taxable',
      width: 100,
      render: (text) => (text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      width: 350,
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'lastModifiedDate',
      key: 'createdDate',
      render: (text) => {
        return <MomentFormatter format={'MMM D, YYYY, h:mm A'} value={text} />;
      },
    },

    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (text) => <NumeralFormatter withPesos={true} value={text} />,
    },
  ];

  return (
    <div>
      <Head>
        <title>Employee Allowance</title>
      </Head>
      <HRPageHeader title={`${data?.fullName}'s Allowance`} onBack={router.back}>
        <Statistic title="Total" prefix="₱" value={data?.totalAllowance} precision={2} />
      </HRPageHeader>

      <Divider />

      <HRTable
        dataSource={data?.employeeAllowance}
        columns={columns}
        pagination={{
          position: ['topRight', 'bottomRight'],
          showSizeChanger: true,
          size: 'default',
        }}
        rowKey={(record) => record?.id}
        loading={loading}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Typography.Text strong> Total</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={true} value={data?.totalAllowance} />
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
}

export default EmployeeAllowancePage;
