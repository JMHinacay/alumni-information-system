import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  HRButton,
  HRCheckbox,
  HRDivider,
  HRListItem,
  HRPageHeader,
  HRSelect,
  HRTable,
} from '@components/commons';
import { Col, Row, Input, Tooltip, Pagination, Typography, Radio } from 'antd';
import { useRouter } from 'next/router';
import { UnorderedListOutlined } from '@ant-design/icons';
import Head from 'next/head';
import moment from 'moment';

const DEPARTMENT_QUERY = gql`
  {
    departments {
      id
      departmentCode
      departmentName
      departmentDesc
      parentDepartment {
        id
        departmentName
        departmentCode
      }
    }
  }
`;

const EMPLOYEE_QUERY = gql`
  query($filter: String, $option: String, $department: UUID, $page: Int, $size: Int) {
    employees: getEmployeeIsActiveAndIncludeInPayroll(
      filter: $filter
      option: $option
      department: $department
      page: $page
      size: $size
    ) {
      content {
        id
        fullName
        user {
          login
        }
        dob
        gender
        isActive
        basicSalary
        excludePayroll
        department {
          id
          departmentName
        }
        departmentOfDuty {
          id
          departmentName
        }
        isActive
      }
      totalElements
    }
  }
`;

const initialState = {
  filter: '',
  department: null,
  size: 25,
  page: 0,
  option: 'ACTIVE_EMPLOYEE_INCLUDED_PAYROLL',
};

const style = {
  tableStyle: {
    marginBottom: `5px`,
    marginTop: `5px`,
  },
};

const EmployeeAttendanceLogsPage = (props) => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const { loading: departmentLoading, data: departmentData } = useQuery(DEPARTMENT_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const { loading = true, data, refetch } = useQuery(EMPLOYEE_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      filter: state.filter,
      department: state.department,
      page: state.page,
      size: state.size,
      option: state.option,
    },
  });
  const onQueryChange = (field, value) => {
    setState({
      ...state,
      page: 0,
      [field]: value,
    });
  };

  const addEmployee = () => {
    router.push('manage');
  };
  const getEmployeeLogs = (id) => {
    router.push(`/employees/employee-attendance/${id}`);
  };

  const onNexPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
  };

  let columns = [
    {
      title: 'Fullname',
      dataIndex: 'fullName',
      render: (text, record) => {
        const age = moment().diff(record.dob, 'years');
        return `${text.toUpperCase()} ${!isNaN(age) ? `(${age} y.o)` : ''}`;
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (dept) => dept?.departmentName || '--',
    },
    {
      title: 'Duty Department',
      dataIndex: 'departmentOfDuty',
      render: (dept) => dept?.departmentName || '--',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (value) => (
        <Typography.Text type={!value && 'danger'}>{value ? 'YES' : 'NO'}</Typography.Text>
      ),
    },
    {
      title: 'Included in Payroll',
      dataIndex: 'excludePayroll',
      render: (value) => (
        <Typography.Text type={value && 'danger'}>{!value ? 'YES' : 'NO'}</Typography.Text>
      ),
    },
    {
      title: 'Action',
      render: (text, employee) => {
        return (
          <Tooltip title="View Attendance Logs">
            <HRButton
              shape="circle"
              ghost
              icon={<UnorderedListOutlined />}
              type="primary"
              onClick={() => getEmployeeLogs(employee?.id)}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Employee Attendance</title>
      </Head>
      <HRPageHeader title="Employee Attendance" />
      <Row type={'flex'} gutter={[8, 8]}>
        <Col span={16}>
          <Input.Search
            style={{ width: '100%' }}
            placeholder="Search Employees"
            onSearch={(value) => onQueryChange('filter', value)}
            allowClear
          />
        </Col>
        <Col span={8}>
          <HRSelect
            options={departmentData?.departments.map((item) => {
              return {
                value: item.id,
                label: item.departmentName,
              };
            })}
            placeholder="Search Department"
            allowClear={true}
            onChange={(value) => onQueryChange('department', value)}
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Col>
        <Col span={24}>
          <Radio.Group
            onChange={(e) => onQueryChange('option', e.target.value)}
            value={state.option}
            options={[
              {
                label: <Typography.Text strong>Active &amp; Included in Payroll</Typography.Text>,
                value: 'ACTIVE_EMPLOYEE_INCLUDED_PAYROLL',
              },
              {
                label: <Typography.Text strong>Excluded in Payroll</Typography.Text>,
                value: 'EXCLUDE_PAYROLL',
              },
              {
                label: <Typography.Text strong>Inactive Employees</Typography.Text>,
                value: 'INACTIVE_EMPLOYEES',
              },
              { label: <Typography.Text strong>All</Typography.Text>, value: 'ALL' },
            ]}
          />
          {/* <HRCheckbox
            name="showInActive"
            checked={state.showInActive}
            onChange={(e) => onQueryChange('showInActive', e.target.checked)}
          >
            <Typography.Text strong>Show in-active </Typography.Text>
          </HRCheckbox>
          <HRCheckbox
            name="showExcludedPayroll"
            checked={state.showExcludedPayroll}
            onChange={(e) => onQueryChange('showExcludedPayroll', e.target.checked)}
          >
            <Typography.Text strong>Show Excluded in Payroll</Typography.Text>
          </HRCheckbox> */}
        </Col>
      </Row>
      <HRDivider />
      <div style={{ marginTop: 10 }}>
        <Pagination
          defaultCurrent={1}
          total={data?.employees?.totalElements}
          pageSize={state.size}
          onChange={onNexPage}
          current={state.page + 1}
        />
        <HRTable
          bordered
          size={'small'}
          columns={columns}
          loading={loading}
          dataSource={data?.employees?.content}
          pagination={false}
          style={style.tableStyle}
          rowKey={(row) => row.id}
        />
        <Pagination
          defaultCurrent={1}
          total={data?.employees?.totalElements}
          pageSize={state.size}
          onChange={onNexPage}
          current={state.page + 1}
        />
      </div>
    </>
  );
};

export default EmployeeAttendanceLogsPage;
