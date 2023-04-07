import React, { useEffect, useState } from 'react';
import { HRPageHeader } from '@components/commons';
import Head from 'next/head';
import { HRList, HRListItem, HRButton } from 'components/commons';
import { Col, Row, List, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import ComingSoon from '@components/ComingSoon';
import FormLoan from '@components/pages/employees/transactions/loans/form';

// const data = [
//   'Racing car sprays burning fuel into crowd.',
//   'Japanese princess to wed commoner.',
//   'Australian walks 100km after outback crash.',
//   'Man charged over missing wedding girl.',
//   'Los Angeles battles huge wildfires.',
// ];

const { TabPane } = Tabs;

function TransactionsLoansPage(props) {
  const [state, setState] = useState({ search: '' });
  const [visible, setVisible] = useState(false);

  function handleOpenModal() {
    setVisible(!visible);
  }

  function handleCancel() {
    setVisible(!visible);
  }

  function callback(key) {
    // console.log(key);
  }

  const { loading, data, refetch } = useQuery(
    gql`
      query($search: String) {
        employeeLoan: getEmployeeLoanByIdWithFilter(search: $search) {
          id
          status
          loanType
        }
      }
    `,
    {
      variables: {
        search: state.search,
      },
    },
  );

  const renderRow = (row) => {
    return (
      <List.Item>
        <Row gutter={2}>
          <Col md={4}>{row?.data}</Col>
        </Row>
      </List.Item>
    );
  };

  return (
    <>
      <Head>
        <title>Loans</title>
      </Head>
      <HRPageHeader title="Loans" />
      <ComingSoon />
    </>
  );
  return (
    <>
      <Head>
        <title>Loans</title>
      </Head>
      <HRPageHeader title="Loans" />
      <div>
        <HRButton
          onClick={() => handleOpenModal()}
          style={{ marginBottom: 10 }}
          type={'primary'}
          block
          icon={
            <>
              <PlusOutlined />
            </>
          }
        >
          New Loan
        </HRButton>

        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Active Loans" key="1">
            <List title={'Employee Loans'} bordered renderItem={renderRow} />
          </TabPane>
          <TabPane tab="Inactive Loans" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>

        <FormLoan
          visible={visible}
          handleCancel={handleCancel}
          handleOpenModal={handleOpenModal}
          // selectedRow={selectedRow}
        />
      </div>
    </>
  );
}

export default TransactionsLoansPage;
