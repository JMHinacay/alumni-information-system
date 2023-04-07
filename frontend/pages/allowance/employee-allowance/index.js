import { EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { gql, useQuery } from '@apollo/react-hooks';
import { HRButton, HRInput, HRPageHeader, HRSelect, HRTable } from '@components/commons';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import { Col, Divider, Pagination, Row, Space, Spin } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { DEPARTMENT_QUERY } from 'pages/employees/list';

const initialFilterState = {
  filter: '',
  size: 10,
  page: 0,
  department: null,
};

const EMPLOYEES = gql`
  query searchActiveEmployeesPageable($filter: String, $department: UUID, $page: Int, $size: Int) {
    employees: searchActiveEmployeesPageable(
      filter: $filter
      department: $department
      page: $page
      size: $size
    ) {
      content {
        key: id
        id
        fullName
        isActive
        basicSalary
        lastModifiedBy
        totalAllowance
        department {
          id
          departmentName
        }
      }
      totalElements
    }
  }
`;

function EmployeeAllowancePage() {
  const [filterState, setFilterState] = useState(initialFilterState);
  const onChangePagination = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };

  const { data, loading } = useQuery(EMPLOYEES, {
    variables: filterState,
  });
  const { data: departmentData, loading: loadingDepartment } = useQuery(DEPARTMENT_QUERY);

  const onChange = debounce((value) => {
    setFilterState({ ...filterState, filter: value });
  }, 500);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
    },
    {
      title: 'Department',
      dataIndex: ['department', 'departmentName'],
    },
    {
      title: 'Total',
      dataIndex: 'totalAllowance',
      render: (text) => <NumeralFormatter withPesos={true} value={text} />,
    },

    {
      title: 'Last Modified Date',
      dataIndex: 'lastModifiedDate',
      key: 'createdDate',
      render: (text) => {
        return <div>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</div>;
      },
    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      width: 100,

      render: (id, record) => {
        return (
          <Space size={'small'}>
            <HRButton
              href={`/allowance/employee-allowance/${id}`}
              shape="circle"
              tooltipTitle={'View Allowance'}
              ghost
              icon={<EyeOutlined />}
              type="primary"
            />
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Head>
        <title>Employee Allowance</title>
      </Head>
      <HRPageHeader
        title="Employee Allowance"
        extra={
          <Link href={'/allowance/employee-allowance/assign'}>
            <HRButton
              type="primary"
              allowedPermissions={['permission_to_assign_allowance_to_employees']}
            >
              Assign Allowance
            </HRButton>
          </Link>
        }
      />
      <Row gutter={[12, 12]}>
        <Col md={12}>
          <HRInput label="Search" onChange={(e) => onChange(e.target.value)} allowClear />
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
              onChange={(value) => {
                setFilterState({ ...filterState, department: value });
              }}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Spin>
        </Col>
      </Row>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Pagination
          defaultCurrent={1}
          total={data?.employees?.totalElements}
          pageSize={filterState.size}
          onChange={onChangePagination}
          current={filterState.page + 1}
          showSizeChanger
        />
      </div>
      <HRTable
        dataSource={data?.employees?.content}
        columns={columns}
        pagination={false}
        rowKey={(record) => record?.id}
        loading={loading}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Pagination
          defaultCurrent={1}
          total={data?.employees?.totalElements}
          pageSize={filterState.size}
          onChange={onChangePagination}
          current={filterState.page + 1}
          showSizeChanger
        />
      </div>
    </div>
  );
}

export default EmployeeAllowancePage;
