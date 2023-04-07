import React, { useState } from 'react';
import Head from 'next/head';
import { PageHeader, Row, Col, Input, Divider, List, Typography, Pagination } from 'antd';
import { HRList, HRListItem, HRButton } from 'components/commons';
import { useQuery, gql } from '@apollo/react-hooks';
import BiometricForm from '@components/pages/employees/employee-config/form';

const { Search } = Input;

const data = ['afadfasfadasdfasdf', 'asdfasdfadfasfasdf'];

const initialState = {
  filter: '',
  department: null,
  size: 20,
  page: 0,
};

export const EMPLOYEE_DETAILS = gql`
  query($filter: String, $department: UUID, $page: Int, $size: Int) {
    employee: searchEmployeesSalaryPageable(
      filter: $filter
      department: $department
      page: $page
      size: $size
    ) {
      content {
        id
        fullName
        department
        basicSalary
        payFreq
        contributionPagIbig
        employeeNo
      }
      totalElements
      hasNext
    }
  }
`;

function EmployeeConfig(props) {
  const [state, setState] = useState(initialState);
  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const { loading, data, refetch } = useQuery(EMPLOYEE_DETAILS, {
    variables: {
      filter: state.filter,
      department: state.department,
      page: state.page,
      size: state.size,
    },
  });

  function handleOpenModal(selectedRow, willRefetch) {
    setSelectedRow(selectedRow);
    if (willRefetch) refetch();
    setVisible(!visible);
  }
  function handleClose(row) {
    setVisible(!visible);
  }

  const onNextPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
  };

  function renderRow(row) {
    if (row === 'header') {
      return (
        <List.Item style={{ fontWeight: 'bold' }} itemKey="header" key="header">
          <Col md={4}>
            <Typography.Text>Employee No.</Typography.Text>
          </Col>
          <Col md={8}>
            <Typography.Text>Employee </Typography.Text>
          </Col>
          <Col md={6}>
            <Typography.Text>Department </Typography.Text>
          </Col>
          <Col md={6}>
            <Typography.Text>Action </Typography.Text>
          </Col>
        </List.Item>
      );
    } else
      return (
        <HRListItem noAction key={row?.id}>
          <Col md={4}>
            <Typography.Text>{row?.employeeNo}</Typography.Text>
          </Col>
          <Col md={8}>
            <Typography.Text>{row?.fullName}</Typography.Text>
          </Col>
          <Col md={6}>
            <Typography.Text>{row?.department}</Typography.Text>
          </Col>
          <Col md={6}>
            <Typography.Text>
              <HRButton type={'primary'} ghost onClick={() => handleOpenModal(row)}>
                Assign
              </HRButton>
            </Typography.Text>
          </Col>
        </HRListItem>
      );
  }

  const pagination = (
    <Pagination
      style={{ marginTop: 5, float: 'right' }}
      defaultCurrent={1}
      total={data?.employee.totalElements}
      pageSize={state.size}
      onChange={onNextPage}
      current={state.page + 1}
    />
  );

  return (
    <>
      <Head>
        <title>Employee Biometric Configuration</title>
      </Head>
      <div>
        <PageHeader title="Employee Biometric Configuration" />
        <Row gutter={2}>
          <Col md={24}>
            <Search
              name={'employee configuration'}
              placeholder={'Search Employee Here'}
              enterButton
              onChange={(e) => setState({ ...state, filter: e.target.value })}
            />
          </Col>
          <Divider />
          <Col md={24}>
            <HRList
              title={<div>Employee Biometric Configuration</div>}
              bordered
              header={<div>Header</div>}
              dataSource={['header', ...(data?.employee?.content || [])]}
              renderItem={renderRow}
              rowKey={(row) => row.id}
            />
            {pagination}
          </Col>
          <BiometricForm visible={visible} handleClose={handleClose} selectedRow={selectedRow} />
        </Row>
      </div>
    </>
  );
}

export default EmployeeConfig;
