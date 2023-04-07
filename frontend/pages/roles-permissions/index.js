import { EditOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import AccessControl from '@components/accessControl/AccessControl';
import { AccountContext } from '@components/accessControl/AccountContext';
import { HRButton, HRCheckbox, HRDivider, HRPageHeader, HRSelect } from '@components/commons';
import { patch } from '@shared/global';
import { hasPermission } from '@utils/accessFunctions';
import { Col, Input, Pagination, Row, Switch, Table, message } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DEPARTMENT_QUERY, EMPLOYEE_QUERY } from 'pages/employees/list';
import { useContext, useState } from 'react';

const initialState = {
  filter: '',
  department: null,
  size: 25,
  page: 0,
  showInActive: false,
};

function RolesAndPermissionsPage(props) {
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

  const updateActiveStatus = (id, value) => {
    let payload = {};
    payload.isActive = value;
    patch(`/api/employees/${id}`, payload).then((resp) => {
      if (resp) {
        message.success('Active status is successfully updated.');
        refetch();
      }
    });
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
      render: (value, record, index) => {
        // console.log(value);
        return (
          <AccessControl
            allowedPermissions={['manage_employee', 'edit_employee']}
            renderNoAccess={value ? 'YES' : 'NO'}
          >
            <Switch
              checkedChildren={'YES'}
              unCheckedChildren={'NO'}
              checked={value}
              onChange={(val) => updateActiveStatus(record.id, val)}
            />
          </AccessControl>
        );
      },
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
              router.push(`/roles-permissions/${row.id}`);
            }}
          />
        );
      },
    });
  }

  const addEmployee = () => {
    router.push('manage');
  };

  const style = {
    tableStyle: {
      marginBottom: `20px`,
      marginTop: `20px`,
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
    <div style={{ margin: '20px 0' }}>
      <Head>
        <title>Roles & Permissions</title>
      </Head>
      <HRPageHeader
        title="Roles & Permissions"
        // extra={
        //   <HRButton
        //     allowedPermissions={['permission_to_create_allowance']}
        //     type="primary"
        //     onClick={() => {
        //       setIsModalVisible(true);
        //       setModalTitle('Create Allowance');
        //       setSelectedAllowance();
        //     }}
        //   >
        //     Create
        //   </HRButton>
        // }
      />
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

      <HRDivider />

      <Pagination
        defaultCurrent={1}
        total={data?.employees.totalElements}
        pageSize={state.size}
        onChange={onNexPage}
        current={state.page + 1}
      />

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
    </div>
  );
}

export default RolesAndPermissionsPage;
