import React, { useState } from 'react';
import { HRPageHeader } from '@components/commons';
import { Col, Input, Row, List, Typography, Divider, Pagination } from 'antd';
import { HRList, HRListItem, HRButton } from 'components/commons';
import { EditOutlined, PlusOutlined, SafetyOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { gql, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import AddAllowance from '@components/pages/employees/salary/form';
import AddForm from '@components/pages/employees/salary/formAdd';

const initialState = {
  filter: '',
  department: null,
  size: 10,
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
        scheduleType
      }
      totalElements
      hasNext
    }
  }
`;

const EmployeeSalaryPage = (props) => {
  const [state, setState] = useState(initialState);
  const [disabled, setDisable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [enable, setEnable] = useState(false);
  const { Search } = Input;
  const router = useRouter();

  const { loading, data, refetch } = useQuery(EMPLOYEE_DETAILS, {
    variables: {
      filter: state.filter,
      department: state.department,
      page: state.page,
      size: state.size,
    },
  });

  function handleModal(selectedRow, willRefetch) {
    setSelectedRow(selectedRow);
    if (willRefetch) refetch();
    setVisible(!visible);
  }

  function handleAddOn(selectedRow, willRefetch) {
    setSelectedRow(selectedRow);
    if (willRefetch) refetch();
    setEnable(!enable);
  }

  function handleShow() {
    setDisable(!disabled);
  }

  function handleCancel() {
    setVisible(!visible);
  }

  function handleCan() {
    setEnable(!enable);
  }

  function handleAdd(e) {
    // console.log(e, 'test');
  }

  function handleEdit(row) {
    // console.log(row);
    handleModal(row, false);
  }

  // function handleDelete(e) {
  //   console.log(e);
  // }

  const onNextPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
  };

  const renderRow = (row) => {
    if (row === 'header') {
      return (
        <List.Item itemKey="header" key="header">
          <Row gutter={2} style={{ width: '100%', marginLeft: 30 }}>
            <Col md={9}>
              <Typography.Text style={{ fontWeight: 'bold' }}>Employee </Typography.Text>
            </Col>
            <Col md={6}>
              <Typography.Text style={{ fontWeight: 'bold', marginBottom: -10 }}>
                Department
              </Typography.Text>
            </Col>
            <Col md={6}>
              <Typography style={{ fontWeight: 'bold', marginBottom: -10 }}>
                Basic Monthly Salary
              </Typography>
            </Col>
            <Col md={3}>
              <Typography style={{ fontWeight: 'bold', marginBottom: -10 }}>Action</Typography>
            </Col>
          </Row>
        </List.Item>
      );
    } else
      return (
        <HRListItem noAction key={row?.id}>
          <Row gutter={2} style={{ width: '100%', marginLeft: 30 }}>
            <Col md={9}>{row?.fullName}</Col>
            <Col md={6}>{row?.department}</Col>
            <Col md={6}>
              <div>{disabled ? row?.basicSalary : row.basicSalary && <SafetyOutlined />}</div>
            </Col>
            <Col md={3}>
              <HRButton
                type={'primary'}
                shape={'circle'}
                icon={<EditOutlined />}
                onClick={() => handleEdit(row)}
              />
              <Divider type="vertical" />
              <HRButton
                placeholder={'Add'}
                type={'primary'}
                shape={'circle'}
                icon={<PlusOutlined />}
                onClick={() => handleAddOn(row)}
              />
              {/* <Popconfirm
                title={'Are you sure you want to delete this record'}
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDelete()}
              >
                <HRButton type={'danger'} shape={'circle'} icon={<DeleteOutlined />} />
              </Popconfirm> */}
            </Col>
          </Row>
        </HRListItem>
      );
  };

  const pagination = (
    <Pagination
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
        <title>Salary</title>
      </Head>
      <HRPageHeader title="Employee Salary" />
      {/* <Switch disabled={disabled} defaultChecked /> */}

      <Row gutter={2} style={{ marginBottom: 10 }}>
        <Col md={20}>
          <Search
            name={'Salary'}
            placeholder={'Search Employee here'}
            enterButton
            onChange={(e) => setState({ ...state, filter: e.target.value })}
          />
        </Col>
        <Col md={4}>
          <HRButton
            block
            icon={
              <>
                <SafetyOutlined />
              </>
            }
            type={'primary'}
            onClick={() => handleShow()}
          >
            Show Salary
          </HRButton>
        </Col>
      </Row>
      {pagination}
      <HRList
        onRefresh={() => refetch()}
        title={<div>Employee Salary </div>}
        bordered
        dataSource={['header', ...(data?.employee?.content || [])]}
        renderItem={renderRow}
        rowKey={(row) => row.id}
        style={{ margin: '10px 0' }}
      />
      {pagination}

      <AddAllowance
        visible={visible}
        handleModal={handleModal}
        selectedRow={selectedRow}
        handleCancel={handleCancel}
      />
      <AddForm
        enable={enable}
        handleAddOn={handleAddOn}
        selectedRow={selectedRow}
        handleCan={handleCan}
      />
    </>
  );
};

export default EmployeeSalaryPage;
