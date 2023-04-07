import { useState, useEffect } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { HRButton, HRDivider, HRForm } from '@components/commons';
import { Col, DatePicker, Row, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import RawLogsTable from '@components/pages/employees/employee-attendance/Tabs/raw-logs-component/RawLogsTable';
import { get } from '@shared/global';

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
    selectedAttendance: {},
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getEmployeeRawLogs = async (params) => {
    let { page, size, startDate, endDate, id } = params;
    setLoading(true);
    return get(
      `/hrm/getEmployeeRawLogs?id=${id}&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`,
    );
  };

  const handleSubmit = async ({ dates }) => {
    try {
      // console.log(dates);
      let id = employeeId ? employeeId : router?.query?.id || null;
      let rawLogs = await getEmployeeRawLogs({
        ...state,
        startDate: moment(dates[0]).startOf('day').utc().format(),
        endDate: moment(dates[1]).endOf('day').utc().format(),
        id,
      });
      setData(rawLogs);
      setLoading(false);

      setState({
        ...state,
        startDate: moment(dates[0]).startOf('day').utc().format(),
        endDate: moment(dates[1]).endOf('day').utc().format(),
        page: 0,
      });
    } catch (err) {
      setLoading(false);
      message.error('Failed to get Raw Logs.');
    }
  };

  const handleAttendanceModal = (selectedAttendance = {}, willRefetch = false) => {
    if (willRefetch) refetch();

    setAttendanceModal({
      visible: !attendanceModal.visible,
      selectedAttendance: { ...selectedAttendance },
    });
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const onNextPage = async (page, size) => {
    try {
      setState({ ...state, page: page - 1, size });
      let rawLogs = await getEmployeeRawLogs({
        ...state,
        page: page - 1,
        size,
        id: employeeId,
      });
      setLoading(false);
      setData(rawLogs);
    } catch (err) {
      setLoading(false);
      message.error('Failed to get Raw Logs.');
    }
  };

  return (
    <>
      {/* <Typography.Title level={2}>Accumulated Employee Logs</Typography.Title> */}
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
                onClick={() => handleAttendanceModal({}, false)}
                allowedPermissions={['manage_raw_logs']}
              >
                Add Log
              </HRButton>
            </Col>
          </Row>
        </HRForm>
      </div>
      <HRDivider />
      <RawLogsTable
        totalElements={data?.totalElements}
        pageSize={state.size}
        onNextPage={onNextPage}
        currentPage={state.page + 1}
        loading={loading}
        dataSource={data?.content || []}
        showTags={false}
      />
    </>
  );
};

export default RawEmployeeLogs;
