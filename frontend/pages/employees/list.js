import { useContext, useState } from 'react';
import { gql, useQuery } from '@apollo/react-hooks';
import { HRPageHeader, HRSelect, HRButton, HRCheckbox } from '@components/commons';
import { Row, Col, Input, Switch, Table, message, Pagination, Typography, Tag } from 'antd';
import { useRouter } from 'next/router';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import { patch } from 'shared/global';
import Head from 'next/head';
import { hasPermission } from '@utils/accessFunctions';
import { AccountContext } from '@components/accessControl/AccountContext';
import AccessControl from '@components/accessControl/AccessControl';

export const DEPARTMENT_QUERY = gql`
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

export const EMPLOYEE_QUERY = gql`
  query ($filter: String, $showInActive: Boolean, $department: UUID, $page: Int, $size: Int) {
    employees: searchActiveEmployeesPageable(
      filter: $filter
      showInActive: $showInActive
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
  showInActive: false,
};

const EmployeeListPage = (props) => {
  const router = useRouter();
  const accountContext = useContext(AccountContext);
  const [state, setState] = useState(initialState);
  const {
    loading = true,
    data,
    refetch,
  } = useQuery(EMPLOYEE_QUERY, {
    variables: {
      filter: state.filter,
      department: state.department,
      page: state.page,
      size: state.size,
      showInActive: state.showInActive,
    },
  });

  const { loading: departmentLoading, data: departmentData } = useQuery(DEPARTMENT_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const addEmployee = () => {
    router.push('manage');
  };

  let columns = [
    {
      title: 'User',
      dataIndex: 'user',
      render: (user) => user?.login || '--',
    },
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
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'YES' : 'NO'}</Tag>,
    },
  ];
  if (hasPermission(['manage_employee', 'edit_employee'], accountContext?.data?.user?.access)) {
    columns = columns.concat({
      title: 'Action',
      render: (row) => {
        return (
          <HRButton
            key="view-employee"
            size="small"
            style={{ marginRight: 5 }}
            allowedPermissions={['manage_employee', 'edit_employee']}
            icon={<EditOutlined />}
            onClick={() => {
              router.push(`/employees/manage/${row.id}`);
            }}
          />
        );
      },
    });
  }

  const style = {
    tableStyle: {
      marginBottom: `5px`,
      marginTop: `5px`,
    },
    buttonStyle: {
      borderRadius: `25px`,
    },
  };

  const onQueryChange = (field, value) => {
    setState({
      ...state,
      page: 0,
      [field]: value,
    });
  };

  const onNexPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
  };

  return (
    <>
      <Head>
        <title>Employee List</title>
      </Head>
      <HRPageHeader title="Employee List" />
      <Row type={'flex'} justify={'space-between'} gutter={[8, 8]}>
        <Col span={12}>
          <Input.Search
            style={{ width: '100%' }}
            placeholder="Search Employees"
            onSearch={(value) => {
              onQueryChange('filter', value);
            }}
            allowClear
          />
        </Col>
        <Col span={6}>
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
        <Col span={6}>
          <HRButton
            allowedPermissions={['add_employee']}
            type={'primary'}
            onClick={addEmployee}
            style={{ width: '100%' }}
          >
            Add Employee
          </HRButton>
        </Col>
        <Col span={6}>
          <HRCheckbox
            name="showInActive"
            checked={state.showInActive}
            onChange={(e) => onQueryChange('showInActive', e.target.checked)}
          >
            Show in-active
          </HRCheckbox>
        </Col>
      </Row>

      <Table
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
        total={data?.employees.totalElements}
        pageSize={state.size}
        onChange={onNexPage}
        current={state.page + 1}
      />
    </>
  );
};

export default EmployeeListPage;
