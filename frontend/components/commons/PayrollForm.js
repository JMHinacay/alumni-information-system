import {
  HRButton,
  HRForm,
  HRTable,
  HRDivider,
  HRSelect,
  HRInput,
  HRSearch,
  EmployeeDrawer,
  HRTextarea,
} from '@components/commons';
import { DatePicker, message, PageHeader, Pagination, Spin, Result, Modal } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import moment from 'moment';
import { Row, Col, Tag } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, gql } from '@apollo/react-hooks';
import { DEPARTMENT_QUERY } from 'pages/employees/list';
import { useRouter } from 'next/router';
import { SaveOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

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
        department {
          id
          departmentName
        }
      }
      totalElements
    }
  }
`;

const UPSERT_PAYROLL = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar, $employeeList: [UUID]) {
    upsertPayroll(id: $id, fields: $fields, employeeList: $employeeList) {
      message
      payload {
        id
      }
      returnId
    }
  }
`;

const GET_PAYROLL = gql`
  query($id: UUID) {
    payroll: getPayrollById(id: $id) {
      id
      title
      dateStart
      dateEnd
      description
      status
    }
  }
`;
const GET_EMPLOYEES = gql`
  query($id: UUID) {
    employee: getPayrollEmployee(id: $id) {
      id
      fullName
      gender
      department {
        id
        departmentName
      }
    }
  }
`;
export const UPDATE_PAYROLL_STATUS = gql`
  mutation($id: UUID, $status: String) {
    updatePayrollStatus(id: $id, status: $status) {
      payload {
        id
      }
    }
  }
`;

const CALCULATE_LOGS = gql`
  mutation($payrollId: UUID, $startDate: Instant, $endDate: Instant, $ids: [UUID]) {
    calculateAccumulatedLogs(
      payrollId: $payrollId
      startDate: $startDate
      endDate: $endDate
      ids: $ids
    ) {
      message
    }
  }
`;
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

const initialFilterState = {
  filter: '',
  department: null,
  size: 25,
  page: 0,
  option: 'ACTIVE_EMPLOYEE_INCLUDED_PAYROLL',
};
function PayrollForm({ isCreatePayroll, isEditEmployee, isDraftPayroll }) {
  const methods = useForm({ defaultValues: { description: '', title: '', dates: null } });
  const router = useRouter();

  const [filterState, setFilterState] = useState(initialFilterState);
  const [selectedId, setSelectedId] = useState([]);
  const [selectedRowsState, setSelectedRowsState] = useState([]);
  const [action, setAction] = useState(null);
  const [empDrawerVisibility, setEmpDrawerVisibility] = useState();
  const [selectedEmployeeByDept, setSelectedEmployeeByDept] = useState([]);
  const [employeeLength, setEmployeeLength] = useState(0);

  //============queries================
  const { data: employees, loading: employeesLoading } = useQuery(GET_EMPLOYEES, {
    variables: {
      id: router.query?.id,
    },
    onCompleted: (result) => {
      if (result) {
        let ids = [];
        if (result?.employee) {
          result.employee.map((value) => {
            ids.push(value.id);
          });
        }
        setSelectedId(ids);
        updateSelectedEmployeesByDept(ids, result?.employee);
        setSelectedRowsState(result?.employee);
      }
    },
  });
  const { data, loading } = useQuery(EMPLOYEE_QUERY, {
    variables: filterState,
  });
  const { data: departmentData, loading: loadingDepartment } = useQuery(DEPARTMENT_QUERY);
  const { data: payroll, loading: loadingPayroll } = useQuery(GET_PAYROLL, {
    skip: isCreatePayroll,
    variables: {
      id: router?.query.id,
    },
    fetchPolicy: 'network-only',
    onCompleted: (result) => {
      let values = {
        title: result?.payroll?.title,
        dates: [
          result?.payroll?.dateStart ? moment(result?.payroll?.dateStart) : null,
          result?.payroll?.dateEnd ? moment(result?.payroll?.dateEnd) : null,
        ],
        description: result?.payroll?.description,
      };
      methods.reset({
        ...values,
      });
    },
  });

  //============queries================
  //=============mutations==========

  const [upsertPayroll, { loading: LoadingUpsertPayroll }] = useMutation(UPSERT_PAYROLL, {
    onCompleted: (data) => {
      message.success(data.upsertPayroll.message);
      if (isCreatePayroll) {
        router.push(`/payroll/payroll/${data?.upsertPayroll?.payload?.id}/edit`);
      } else if (isEditEmployee == true) {
        router.back();
      }
    },
    onError: () => {
      message.error('Something went wrong, Please try again later.');
    },
  });

  const updateSelectedEmployeesByDept = (selectedRowKeys, selectedRows, isClearAll) => {
    var newSelectedRows = selectedRows.filter((item) => {
      return item?.id;
    });
    newSelectedRows = _.uniqBy([...newSelectedRows, ...selectedRowsState], 'id');
    newSelectedRows = selectedRowKeys.map((rowKey) => {
      return _.find(newSelectedRows, (item) => item.id === rowKey);
    });

    setSelectedRowsState(newSelectedRows);
    setEmployeeLength(selectedRowKeys.length);
    if (selectedRowKeys.length !== 0) {
      let tempSelectedEmployeeByDept = departmentData?.departments?.map(
        ({ id, departmentName }) => {
          return {
            department: id,
            departmentName: departmentName,
            data:
              newSelectedRows?.filter((item) => {
                return id === item?.department?.id;
              }) || [],
          };
        },
      );

      tempSelectedEmployeeByDept = tempSelectedEmployeeByDept?.filter(
        (item) => item?.data?.length !== 0,
      );

      setSelectedEmployeeByDept(tempSelectedEmployeeByDept);
      setSelectedId(selectedRowKeys);
    } else {
      setSelectedEmployeeByDept([]);
      setSelectedId(selectedRowKeys);
    }
  };

  const [updatePayrollStatus, { loading: loadingUpdateStatus }] = useMutation(
    UPDATE_PAYROLL_STATUS,
    {
      onCompleted: (data) => {
        router.push(`/payroll/payroll/${data?.updatePayrollStatus?.payload?.id}`);
      },
      onError: () => {
        message.error('Something went wrong, Please try again later.');
      },
    },
  );

  const [calcAccumulatedLogs, { loading: loadingCalcAccumulatedLogs }] = useMutation(
    CALCULATE_LOGS,
    {},
  );
  //=============mutations==========

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      updateSelectedEmployeesByDept(selectedRowKeys, selectedRows);
      setSelectedId(selectedRowKeys);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {},
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedId,
  };

  const showDrawer = () => {
    setEmpDrawerVisibility(true);
  };

  const onSubmit = (props) => {
    const { description, title, dates } = props || {};
    if (selectedId.length === 0) message.error('No Employee Selected, Please Select Employees');
    else {
      var text;
      switch (action) {
        case 'SET_AS_ACTIVE':
          text = 'start this payroll?';

          break;
        case 'SAVE_EMPLOYEES':
          text = 'save the employees?';

          break;
        default:
          text = 'save payroll details?';
      }

      Modal.confirm({
        title: 'Confirm',
        content: `Are you sure you want to ${text}`,
        okText: 'Confirm',
        cancelText: 'Cancel',
        onCancel: () => {
          setAction(null);
        },
        onOk: () => {
          if (action !== 'SAVE_EMPLOYEES') {
            var values = {
              description,
              title,
              dateStart: moment(dates[0]).startOf('day').utc().format(),
              dateEnd: moment(dates[1])?.endOf('day').utc().format(),
            };
          }

          upsertPayroll({
            variables: {
              id: router.query?.id,
              fields: values || {},
              employeeList: selectedId,
            },
          });

          if (action === 'SET_AS_ACTIVE') {
            updatePayrollStatus({
              variables: {
                id: router.query?.id,
                status: 'ACTIVE',
              },
            });
          }
        },
      });
    }
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const onNexPage = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };

  return (
    <>
      {loadingPayroll ? (
        <div
          style={{
            height: 'calc(100vh - 160px)',
          }}
        >
          <Spin style={{ position: 'relative', top: '40%', left: '50%' }} size="large" />
        </div>
      ) : (isDraftPayroll === true && payroll?.payroll?.status === 'DRAFT') ||
        isCreatePayroll === true ||
        (isEditEmployee === true && payroll?.payroll?.status === 'ACTIVE') ? (
        <>
          <Spin
            spinning={LoadingUpsertPayroll || loadingUpdateStatus || loadingCalcAccumulatedLogs}
          >
            <div>
              <HRForm onSubmit={onSubmit} methods={methods} id="payroll-form">
                {isEditEmployee === false ? (
                  <>
                    <PageHeader
                      title={`${isCreatePayroll == true ? `Create` : `Edit`} Payroll`}
                      onBack={router.back}
                      extra={
                        <>
                          <HRButton
                            type="primary"
                            ghost
                            htmlType="submit"
                            loading={LoadingUpsertPayroll}
                            icon={<SaveOutlined />}
                          >
                            Save Details
                          </HRButton>

                          {isDraftPayroll == true && (
                            <HRButton
                              type="primary"
                              htmlType="submit"
                              icon={<CheckCircleOutlined />}
                              onClick={(e) => {
                                setAction('SET_AS_ACTIVE');
                              }}
                              loading={loadingCalcAccumulatedLogs}
                            >
                              Start Payroll
                            </HRButton>
                          )}
                        </>
                      }
                      tags={isDraftPayroll === true ? <Tag color="blue">Draft</Tag> : null}
                    />
                    <Row gutter={12}>
                      <Col md={12}>
                        <HRInput name="title" label="Title" allowClear rules={{ required: true }} />
                      </Col>

                      <Col md={12}>
                        <Controller
                          name="dates"
                          rules={{
                            validate: (value) => {
                              if (!value) return 'please select date range';
                              if (!Array.isArray(value)) {
                                return 'please select date range';
                              } else if (Array.isArray(value)) {
                                if (value[0] === null || value[1] === null)
                                  return 'please select date range';
                              }
                              return true;
                            },
                          }}
                          render={(inputProps) => (
                            <>
                              <label>
                                Date Range
                                <label style={{ color: 'red' }}>
                                  {methods.errors?.dates && `(${methods.errors?.dates?.message})`}
                                </label>
                              </label>
                              <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                format="MMMM D, YYYY"
                                onCalendarChange={handleDateChange}
                                value={inputProps.value}
                                onBlur={inputProps.onBlur}
                                allowClear
                                allowEmpty
                              />
                            </>
                          )}
                        />
                      </Col>
                    </Row>
                    <HRTextarea
                      name="description"
                      label="Description"
                      allowClear
                      style={{ width: '100%' }}
                    />
                  </>
                ) : (
                  <PageHeader
                    title={'Add Employees to Payroll'}
                    onBack={router.back}
                    extra={
                      <HRButton
                        type="primary"
                        htmlType="submit"
                        onClick={(e) => {
                          setAction('SAVE_EMPLOYEES');
                        }}
                      >
                        Submit Employees
                      </HRButton>
                    }
                  />
                )}
              </HRForm>

              <HRDivider />
              {/* ========================================================Form for Search==========================*/}
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
              <HRDivider />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <HRButton type="primary" ghost onClick={showDrawer}>
                  View {employeeLength} Selected
                </HRButton>
              </div>
              <Row>
                <Col md={24}>
                  <div style={{ margin: '20px 0' }}>
                    <Pagination
                      defaultCurrent={1}
                      total={data?.employees.totalElements}
                      pageSize={filterState.size}
                      onChange={onNexPage}
                      current={filterState.page + 1}
                    />
                    {/* ========================================================Form for Search END==========================*/}
                    <HRTable
                      preserveSelectedRowKeys={true}
                      style={{ margin: '20px 0' }}
                      rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                      }}
                      columns={columns}
                      rowKey={(record) => record?.id}
                      dataSource={data?.employees.content}
                      pagination={false}
                      loading={loading || employeesLoading}
                    />
                    <Pagination
                      defaultCurrent={1}
                      total={data?.employees.totalElements}
                      pageSize={filterState.size}
                      onChange={onNexPage}
                      current={filterState.page + 1}
                    />
                  </div>
                </Col>
              </Row>

              <EmployeeDrawer
                drawerUsage={!isEditEmployee ? 'create_payroll' : 'edit_employee'}
                empDrawerVisibility={empDrawerVisibility}
                setEmpDrawerVisibility={setEmpDrawerVisibility}
                selectedEmployeeByDept={selectedEmployeeByDept}
                setSelectedEmployeeByDept={setSelectedEmployeeByDept}
                updateSelectedEmployeesByDept={updateSelectedEmployeesByDept}
                selectedId={selectedId}
                selectedRows={selectedRowsState}
              />
            </div>
          </Spin>
        </>
      ) : (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <HRButton type="primary" onClick={router.back}>
              Go Back
            </HRButton>
          }
        />
      )}
    </>
  );
}

export default PayrollForm;
