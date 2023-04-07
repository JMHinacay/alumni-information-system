import { EditOutlined } from '@ant-design/icons';
import { gql, useLazyQuery, useQuery } from '@apollo/react-hooks';
import {
  HRButton,
  HRDivider,
  HRInput,
  HRPageHeader,
  HRSelect,
  TopBottomPagination,
} from '@components/commons';
import SearchEmployeeRoleAndPermissionTip from '@components/pages/roles-permissions/search/SearchEmployeeRoleAndPermissionTip';
import { Col, Divider, Pagination, Row, Spin, Table, Tag, Typography } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DEPARTMENT_QUERY } from 'pages/employees/list';
import { useEffect, useState } from 'react';

const EMPLOYEES = gql`
  query searchEmployeePermissionRole(
    $filter: String
    $department: UUID
    $permissions: [String]
    $roles: [String]
    $permissionOperation: String
    $rolesOperation: String
    $page: Int
    $size: Int
  ) {
    employees: searchEmployeePermissionRole(
      filter: $filter
      department: $department
      permissions: $permissions
      roles: $roles
      permissionOperation: $permissionOperation
      rolesOperation: $rolesOperation
      page: $page
      size: $size
    ) {
      totalElements
      content {
        key: id
        id
        fullName
        isActive
        gender
        user {
          login
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
  }
`;
const ROLES_AND_PERMISSION = gql`
  query {
    roles: authorities {
      name
      value: name
      label: name
    }
    permissions {
      name
      label: description
      value: name
    }
  }
`;

const initialFilterState = {
  filter: '',
  size: 20,
  page: 0,
  department: null,
  permissions: null,
  roles: null,
  permissionOperation: 'OR',
  rolesOperation: 'OR',
};

const initialFilterExplain = {
  filter: '',
  department: '',
  permissions: [],
  roles: [],
  rolesOperation: 'OR',
  permissionOperation: 'OR',
};

const operations = [
  {
    value: 'AND',
    label: 'AND',
  },
  {
    value: 'OR',
    label: 'OR',
  },
];

function RolesPermissionsSearchPage(props) {
  const router = useRouter();
  const [filterState, setFilterState] = useState(initialFilterState);
  const [filterExplain, setfilterExplain] = useState(initialFilterExplain);

  const [searchEmployeeWithRolesAndPermission, { data, loading, previousData }] = useLazyQuery(
    EMPLOYEES,
    {
      notifyOnNetworkStatusChange: true,
    },
  );
  const { data: departmentData, loading: loadingDepartment } = useQuery(DEPARTMENT_QUERY);
  const { data: rolesAndPermissionData, loading: loadingRolesAndPermission } =
    useQuery(ROLES_AND_PERMISSION);

  useEffect(() => {
    searchEmployeeWithRolesAndPermission({ variables: filterState });
  }, []);

  const onNexPage = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };

  const onSearchEmployeeRolesAndPermission = () => {
    searchEmployeeWithRolesAndPermission({
      variables: {
        ...filterState,
        roles: filterState?.roles || [],
        permissions: filterState.permissions || [],
      },
    });
  };

  const columns = [
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
    {
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
              router.push(`/roles-permissions/${row.id}`);
            }}
          />
        );
      },
    },
  ];
  const tableStyle = {
    marginBottom: `5px`,
    marginTop: `5px`,
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <Head>
        <title>Search Roles & Permissions</title>
      </Head>
      <HRPageHeader title="Search Roles & Permissions" onBack={router.back} />
      <Row gutter={[12, 12]}>
        <Col md={12}>
          <HRInput
            label="Search"
            onChange={(e) => {
              setfilterExplain({ ...filterExplain, filter: e.target.value });
              setFilterState({ ...filterState, filter: e.target.value });
            }}
            allowClear
          />
        </Col>
        <Col md={12}>
          <Spin spinning={loadingDepartment}>
            <HRSelect
              label="Department"
              placeholder={'Department'}
              allowClear={true}
              showSearch
              options={departmentData?.departments?.map(({ id, departmentName }) => ({
                value: id,
                label: departmentName,
              }))}
              value={filterState.department || []}
              onChange={(value, option) => {
                setfilterExplain({
                  ...filterExplain,
                  department: option?.label,
                });
                setFilterState({ ...filterState, department: value });
              }}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Spin>
        </Col>
      </Row>
      <HRDivider />
      <Row gutter={[12, 12]}>
        <Col md={12}>
          <Col md={12} style={{ paddingLeft: 0 }}>
            <Spin spinning={loadingRolesAndPermission}>
              <HRSelect
                label="Permission Operation"
                placeholder={'AND or OR'}
                allowClear={true}
                showSearch
                options={operations}
                value={filterState.permissionOperation}
                onChange={(permissionOperation) => {
                  setFilterState({ ...filterState, permissionOperation });
                }}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Spin>
          </Col>
        </Col>
        <Col md={12}>
          <Col md={12} style={{ paddingLeft: 0 }}>
            <Spin spinning={loadingRolesAndPermission}>
              <HRSelect
                label="Permission Operation"
                placeholder={'AND or OR'}
                allowClear={true}
                options={operations}
                value={filterState.rolesOperation || []}
                onChange={(rolesOperation) => {
                  setFilterState({ ...filterState, rolesOperation });
                }}
              />
            </Spin>
          </Col>
        </Col>
        <Col md={12}>
          <Spin spinning={loadingRolesAndPermission}>
            <HRSelect
              label="Permission"
              placeholder={'Permission to XXXXX'}
              allowClear={true}
              mode="multiple"
              showSearch
              options={rolesAndPermissionData?.permissions || []}
              value={filterState.permissions || []}
              onChange={(permissions, option = []) => {
                setfilterExplain({
                  ...filterExplain,
                  permissions: option?.map((value) => value.label),
                });
                setFilterState({ ...filterState, permissions });
              }}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Spin>
        </Col>

        <Col md={12}>
          <Spin spinning={loadingRolesAndPermission}>
            <HRSelect
              label="Role"
              placeholder={'XXXXX_ROLE'}
              allowClear={true}
              mode="multiple"
              showSearch
              options={rolesAndPermissionData?.roles || []}
              value={filterState.roles || []}
              onChange={(roles, option = []) => {
                setfilterExplain({
                  ...filterExplain,
                  roles: option?.map((value) => value.label),
                });
                setFilterState({ ...filterState, roles });
              }}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Spin>
        </Col>
      </Row>
      <HRButton
        type="primary"
        block
        style={{ marginTop: 10 }}
        onClick={onSearchEmployeeRolesAndPermission}
        loading={loading}
      >
        Search Employee
      </HRButton>
      <Divider />

      <SearchEmployeeRoleAndPermissionTip
        {...filterExplain}
        permissionOperation={filterState.permissionOperation}
        rolesOperation={filterState.rolesOperation}
      />

      <Typography.Title level={4} style={{ marginTop: 10 }}>
        Number of Results: {data?.employees?.totalElements}
      </Typography.Title>
      <div style={{ marginTop: 20 }}>
        <TopBottomPagination
          defaultCurrent={1}
          total={data?.employees?.totalElements}
          pageSize={filterState.size}
          onChange={onNexPage}
          current={filterState.page + 1}
        >
          <Table
            bordered
            size={'small'}
            columns={columns}
            loading={loading}
            dataSource={
              data?.employees?.content ? data?.employees?.content : previousData?.employees?.content
            }
            pagination={false}
            style={tableStyle}
            rowKey={employeeTableRowKey}
          />
        </TopBottomPagination>
      </div>
    </div>
  );
}

export default RolesPermissionsSearchPage;

const employeeTableRowKey = () => (row) => row.id;
