import { gql, useMutation } from '@apollo/react-hooks';
import { HRButton, HRPageHeader, HRSearch, HRSelect, HRTable } from '@components/commons';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import { useGetAllowanceTemplate } from '@hooks/allowanceTemplateHooks';
import { useGetDepartmentsInId } from '@hooks/department';
import { useGetEmployeesInIds } from '@hooks/employee';
import { Col, Divider, message, Modal, Pagination, Row, Spin, Tag } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const UPSERT_EMPLOYEE_ALLOWANCE = gql`
  mutation($template_id: UUID, $employee_id: [UUID]) {
    result: upsertEmployeeAllowance(template_id: $template_id, employee_id: $employee_id) {
      message
      success
    }
  }
`;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (text) => {
      return <NumeralFormatter format={'0,0.00'} withPesos={true} value={text} />;
    },
  },
  {
    title: 'Taxable',
    dataIndex: 'taxable',
    key: 'taxable',
    width: 100,
    render: (text) => (text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>),
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
  },
];
const employeeColumns = [
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
const initialState = {
  filter: '',
  department: null,
  size: 25,
  page: 0,
};
const Step3 = (props) => {
  const router = useRouter();
  const [filterState, setFilterState] = useState(initialState);
  const [templateItems, setTemplateItems] = useState([]);
  const { data: employeeData, loading: employeeLoading } = useGetEmployeesInIds({
    variables: {
      ...filterState,
      ids: props?.selectedData?.selectedEmployee,
    },
  });
  const { data: departmentData, loading: loadingDepartment } = useGetDepartmentsInId({
    variables: {
      ids: props?.selectedData?.selectedDepartment,
    },
  });
  const [upsertEmployeeAllowance, { loading: loadingUpsert }] = useMutation(
    UPSERT_EMPLOYEE_ALLOWANCE,
    {
      onCompleted: (result) => {
        message[result?.result?.success ? 'success' : 'error'](result?.result?.message);
        if (result?.result?.success) {
          router.back();
        }
      },
    },
  );
  const { data, loading: itemLoading } = useGetAllowanceTemplate({
    id: props?.selectedData?.selectedTemplate,
    onCompleted: queryCallback,
  });

  function queryCallback2(result) {
    setTemplateItems(result?.data?.response?.templates?.map(({ allowance }) => ({ ...allowance })));
  }

  function queryCallback(result) {
    setTemplateItems(
      result?.data?.response?.templates
        ?.filter((item) => item.active)
        .map(({ allowance }) => allowance),
    );
  }

  function submit() {
    Modal.confirm({
      title: 'Are you sure?',
      content: `Are you sure you want to assign the allowance template to ${props?.selectedData?.selectedEmployee.length} employees ?`,
      okText: 'Yes',
      cancelText: 'No',
      async onOk() {
        await upsertEmployeeAllowance({
          variables: {
            template_id: props?.selectedData?.selectedTemplate,
            employee_id: props?.selectedData?.selectedEmployee,
          },
        });
      },
    });
  }
  const onNexPage = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };
  return (
    <div style={{ marginTop: '30px' }}>
      <HRPageHeader title={`${data?.name} Allowance`} />
      <HRTable
        bordered
        dataSource={templateItems}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={false}
        loading={itemLoading || loadingUpsert}
      />
      <Divider />
      <HRPageHeader title="Employees" />
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
        total={employeeData?.employees?.totalElements}
        pageSize={filterState.size}
        onChange={onNexPage}
        current={filterState.page + 1}
      />
      <HRTable
        style={{ margin: '20px 0' }}
        columns={employeeColumns}
        rowKey={(record) => record?.id}
        dataSource={employeeData?.employees?.content}
        pagination={false}
        loading={employeeLoading || loadingUpsert}
      />
      <Pagination
        style={{ margin: '10px 0', display: 'flex', justifyContent: 'flex-end' }}
        defaultCurrent={1}
        total={employeeData?.employees?.totalElements}
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
          disabled={props?.selectedData?.selectedTemplate ? false : true}
          type="primary"
          style={{ marginTop: 10 }}
          onClick={submit}
        >
          Submit
        </HRButton>
      </div>
    </div>
  );
};

export default Step3;
