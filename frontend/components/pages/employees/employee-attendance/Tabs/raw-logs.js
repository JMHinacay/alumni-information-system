import { useState, useEffect } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { HRButton, HRDivider, HRForm } from '@components/commons';
import { Col, DatePicker, Row, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import RawLogsTable from '@components/pages/employees/employee-attendance/Tabs/raw-logs-component/RawLogsTable';

const GET_SAVED_EMPLOYEE_ATTENDANCE = gql`
  query($size: Int, $page: Int, $id: UUID, $startDate: Instant, $endDate: Instant) {
    logs: getSavedEmployeeAttendance(
      size: $size
      page: $page
      id: $id
      startDate: $startDate
      endDate: $endDate
    ) {
      content {
        additionalNote
        attendance_time
        createdBy
        createdDate
        id
        isIgnored
        isManual
        lastModifiedBy
        lastModifiedDate
        method
        original_attendance_time
        source
        type
        originalType
        employee {
          id
        }
      }
      totalElements
    }
  }
`;

const UPSERT_EMPLOYEE_ATTENDANCE = gql`
  mutation($id: UUID, $employee: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertEmployeeAttendance(id: $id, employee: $employee, fields: $fields) {
      payload {
        additionalNote
        attendance_time
        createdBy
        createdDate
        id
        isIgnored
        isManual
        lastModifiedBy
        lastModifiedDate
        method
        original_attendance_time
        source
        type
      }
      success
      message
    }
  }
`;

const DELETE_EMPLOYEE_ATTENDANCE = gql`
  mutation($id: UUID) {
    data: deleteEmployeeAttendance(id: $id) {
      message
      success
    }
  }
`;

const initialState = {
  size: 25,
  page: 0,
  startDate: null,
  endDate: null,
};
const RawEmployeeLogs = ({ employeeId = null, ...props }) => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      dates: [null, null],
    },
  });
  const [state, setState] = useState(initialState);
  const [attendanceModal, setAttendanceModal] = useState({
    visible: false,
    selectedAttendance: null,
  });

  const [getEmployeeAttendance, { data, loading, refetch }] = useLazyQuery(
    GET_SAVED_EMPLOYEE_ATTENDANCE,
  );
  const [upsertEmployeeAttendance, { loading: loadingUpsertEmployeeAttendance }] = useMutation(
    UPSERT_EMPLOYEE_ATTENDANCE,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully updated employee attendance.');

          let id = employeeId ? employeeId : router?.query?.id || null;
          getEmployeeAttendance({
            variables: {
              ...state,

              id,
            },
          });
        } else message.error(data?.message ?? 'Failed to update employee attendance.');
      },
    },
  );
  const [deleteEmployeeAttendance, { loading: loadingDeleteEmployeeAttendance }] = useMutation(
    DELETE_EMPLOYEE_ATTENDANCE,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully deleted employee attendance.');
          let id = employeeId ? employeeId : router?.query?.id || null;
          getEmployeeAttendance({
            variables: {
              ...state,
              id,
            },
          });
        } else message.error(data?.message ?? 'Failed to delete employee attendance.');
      },
    },
  );

  useEffect(() => {
    if (router?.query?.startDate && router?.query?.endDate && router?.query?.prefetch == 'true') {
      methods?.setValue('dates', [
        moment(parseInt(router?.query?.startDate)),
        moment(parseInt(router?.query?.endDate)),
      ]);
      let id = employeeId ? employeeId : router?.query?.id || null;
      getEmployeeAttendance({
        variables: {
          ...state,
          startDate: moment(parseInt(router?.query?.startDate)).startOf('day').utc().format(),
          endDate: moment(parseInt(router?.query?.endDate)).endOf('day').utc().format(),
          id,
        },
      });
    }
    if (props?.selectedData?.useStaticDate) {
      let id = employeeId ? employeeId : router?.query?.id || props?.empID?.employee?.id;
      getEmployeeAttendance({
        variables: {
          ...state,
          startDate: moment(props?.selectedData?.staticStartDate).startOf('day').utc().format(),
          endDate: moment(props?.selectedData?.staticStartDate).endOf('day').utc().format(),
          id,
        },
      });
    }
  }, []);

  const handleSubmit = ({ dates }) => {
    let id = employeeId ? employeeId : router?.query?.id || props?.empID?.employee?.id;
    getEmployeeAttendance({
      variables: {
        ...state,
        startDate: moment(dates[0]).startOf('day').utc().format(),
        endDate: moment(dates[1]).endOf('day').utc().format(),
        id,
      },
    });
    setState({
      ...state,
      startDate: moment(dates[0]).startOf('day').utc().format(),
      endDate: moment(dates[1]).endOf('day').utc().format(),
      page: 0,
    });
  };

  const handleAttendanceModal = (selectedAttendance = null, willRefetch = false) => {
    if (willRefetch) refetch();

    setAttendanceModal({
      visible: !attendanceModal.visible,
      selectedAttendance,
    });
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const onNextPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
    getEmployeeAttendance({
      variables: {
        ...state,
        page: page - 1,
        size,
        id: router.query?.id || null,
      },
    });
  };

  const onClickDeleteAttendance = (id) => {
    Modal.confirm({
      title: 'Are you sure',
      content: `Are you sure you want to delete this log?`,
      onOk: () =>
        deleteEmployeeAttendance({
          variables: {
            id,
          },
        }),
    });
  };

  const onClickIgnored = ({ employee, ...logs }) => {
    let newLogs = { ...logs };
    newLogs.isIgnored = !newLogs.isIgnored;
    upsertEmployeeAttendance({
      variables: {
        id: logs?.id || null,
        fields: newLogs,
        employee: employee?.id,
      },
    });
    // Modal.confirm({
    //   title: 'Are you sure',
    //   content: `Are you sure you want to ${logs?.isIgnored ? 'Unignore' : 'Ignore'} this log?`,
    //   onOk: () =>
    //     upsertEmployeeAttendance({
    //       variables: {
    //         id: logs?.id || null,
    //         fields: newLogs,
    //         employee: employee?.id,
    //       },
    //     }),
    // });
  };

  return (
    <>
      {/* <Typography.Title level={2}>Accumulated Employee Logs</Typography.Title> */}
      {props?.selectedData?.useStaticDate ? (
        ''
      ) : (
        <div style={{ marginBottom: 20 }}>
          <HRForm methods={methods} onSubmit={handleSubmit}>
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Controller
                  name="dates"
                  rules={{
                    validate: (value) => {
                      if (!value) return 'Please select date range.';
                      if (!Array.isArray(value)) {
                        return 'Please select date range.';
                      } else if (Array.isArray(value)) {
                        if (value[0] === null || value[1] === null)
                          return 'Please select date range.';
                      }
                      return true;
                    },
                  }}
                  render={(inputProps) => (
                    <>
                      <label>
                        Date Range{' '}
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
              <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <HRButton type="primary" block htmlType="submit" loading={loading}>
                  Submit
                </HRButton>
              </Col>
              <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <HRButton
                  type="primary"
                  block
                  onClick={() => handleAttendanceModal(null, false)}
                  allowedPermissions={['manage_raw_logs']}
                >
                  Add Log
                </HRButton>
              </Col>
            </Row>
          </HRForm>
          <HRDivider />
        </div>
      )}

      <RawLogsTable
        useStaticDate={props?.selectedData?.useStaticDate}
        totalElements={data?.logs?.totalElements}
        pageSize={state.size}
        onNextPage={onNextPage}
        currentPage={state.page + 1}
        attendanceModal={attendanceModal}
        handleAttendanceModal={handleAttendanceModal}
        loading={loading || loadingUpsertEmployeeAttendance}
        dataSource={data?.logs?.content || []}
        onClickIgnored={onClickIgnored}
      />
    </>
  );
};

export default RawEmployeeLogs;