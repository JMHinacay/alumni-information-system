import { gql, useQuery } from '@apollo/react-hooks';
import { HRButton, HRSearch, HRSelect, HRTable } from '@components/commons';
import { Col, Pagination, Row, Spin } from 'antd';
import _ from 'lodash';
import { DEPARTMENT_QUERY } from 'pages/employees/list';
import { useState } from 'react';

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
        gender
        isActive
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
const Step2 = (props) => {
  const [filterState, setFilterState] = useState(initialState);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      props?.setSelectedData({
        ...props?.selectedData,
        selectedEmployee: selectedRowKeys,
        selectedDepartment: _.uniq([
          ...props?.selectedData?.selectedDepartment,
          ...selectedRows.map((item) => {
            return item?.department?.id;
          }),
        ]),
      });
    },
    preserveSelectedRowKeys: true,
    selectedRowKeys: props?.selectedData?.selectedEmployee,
  };
  const { data, loading } = useQuery(EMPLOYEE_QUERY, {
    variables: filterState,
  });
  const { data: departmentData, loading: loadingDepartment } = useQuery(DEPARTMENT_QUERY);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Department',
      key: 'department',
      render: (text, record) => {
        return <div>{record?.department?.departmentName}</div>;
      },
    },
  ];
  const onNexPage = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };
  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col md={12}>
          <HRSearch
            label="Search Employee"
            allowClear
            value={filterState.filter}
            onChange={(e) => {
              e.preventDefault;
              setFilterState({ ...filterState, filter: e.target.value });
            }}
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
      <Pagination
        style={{ margin: '10px 0', display: 'flex', justifyContent: 'flex-end' }}
        defaultCurrent={1}
        total={data?.employees?.totalElements}
        pageSize={filterState.size}
        onChange={onNexPage}
        current={filterState.page + 1}
      />
      <HRTable
        bordered
        size={'small'}
        preserveSelectedRowKeys={true}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        rowKey={(record) => record?.id}
        dataSource={data?.employees.content}
        pagination={false}
        loading={loading}
      />
      <Pagination
        style={{ margin: '10px 0', display: 'flex', justifyContent: 'flex-end' }}
        defaultCurrent={1}
        total={data?.employees?.totalElements}
        pageSize={filterState.size}
        onChange={onNexPage}
        current={filterState.page + 1}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <HRButton
          type="default"
          style={{ marginTop: 10, marginRight: 10 }}
          onClick={() => {
            props.setCurrent(props.current - 1);
          }}
        >
          Previous
        </HRButton>
        <HRButton
          disabled={props?.selectedData?.selectedEmployee?.length > 0 ? false : true}
          type="primary"
          style={{ marginTop: 10 }}
          onClick={() => {
            props.setCurrent(props.current + 1);
          }}
        >
          Next
        </HRButton>
      </div>
    </div>
  );
};
export default Step2;
