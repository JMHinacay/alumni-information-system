import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { HRButton, HRForm, HRList, HRListItem, HRPageHeader } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import { Col, Typography, DatePicker, Row, message } from 'antd';
import { gql } from 'apollo-boost';
import Head from 'next/head';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';

const GET_ATTENDANCE_LOGS = gql`
  query($daterange: Map_String_StringScalar) {
    logs: get_biometrics_attlog(daterange: $daterange) {
      message
      success
      payload {
        date
        idno
        name
        status
        time
        verification
        employeeId
        deviceName
        department
        departmentId
        dateTime
      }
    }
  }
`;

const SAVE_ATTENDANCE_LOGS = gql`
  mutation($logs: [AttLogDtoInput], $startDate: Instant, $endDate: Instant) {
    data: save_biometric_attlog(logs: $logs, startDate: $startDate, endDate: $endDate) {
      success
      message
    }
  }
`;

const EmployeeAttendanceLogsPage = (props) => {
  const methods = useForm({
    defaultValues: {
      dates: [null, null],
    },
  });
  const [getAttendanceLogs, { data, loading, refetch }] = useLazyQuery(GET_ATTENDANCE_LOGS);
  const [
    saveAttendanceLogs,
    { data: attendanceLogsData, loading: loadingAttendanceLogs },
  ] = useMutation(SAVE_ATTENDANCE_LOGS, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success)
        message.success(data?.message ?? 'Successfully saved attendance logs to the database.');
      else message.error(data?.message ?? 'Failed to save attendance logs to the database.');
    },
  });

  const headers = [
    { text: 'Employee Name', span: 8 },
    { text: 'Department', span: 6 },
    { text: 'Date/Time', span: 4 },
    { text: 'Status', span: 2 },
    { text: 'Device', span: 4 },
  ];

  const handleSubmit = (values) => {
    getAttendanceLogs({
      variables: {
        daterange: {
          sdate: moment(values?.dates[0]).format('YYYY-MM-DD'),
          edate: moment(values?.dates[1]).format('YYYY-MM-DD'),
          period: 0,
        },
      },
    });
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const onClickSaveToDatabase = () => {
    let dates = methods.getValues('dates');
    let logs = data?.logs?.payload?.map(({ __typename, ...logs }) => logs) || [];
    let [startDate, endDate] = dates;
    if (logs.length <= 0)
      message.error('No logs found. Please get the logs first before saving to database.');
    if ((startDate, endDate)) {
      saveAttendanceLogs({
        variables: {
          startDate: moment(startDate).startOf('day').utc().format(),
          endDate: moment(endDate).endOf('day').utc().format(),
          logs: logs,
        },
      });
    }
  };

  return (
    <>
      <Head>
        <title>Attendance Logs</title>
      </Head>
      <HRPageHeader title="Employee Attendance Logs" />
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
              <HRButton
                type="primary"
                block
                htmlType="submit"
                loading={loading}
                disabled={loadingAttendanceLogs}
                allowedPermissions={['sync_biometric_logs']}
              >
                Submit
              </HRButton>
            </Col>
            <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <HRButton
                type="primary"
                block
                onClick={onClickSaveToDatabase}
                loading={loadingAttendanceLogs}
                disabled={loading}
                allowedPermissions={['sync_biometric_logs']}
              >
                Save To Database
              </HRButton>
            </Col>
          </Row>
        </HRForm>
      </div>
      <HRList
        dataSource={data?.logs?.payload || []}
        loading={loading}
        pagination={{
          position: 'both',
        }}
        header={
          <>
            <div style={{ width: '100%' }}>
              <HRListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Col span={8}>
                  <Typography.Text strong>Employee Name</Typography.Text>
                </Col>
                <Col span={6}>
                  <Typography.Text strong>Department</Typography.Text>
                </Col>
                <Col span={4}>
                  <Typography.Text strong>Date</Typography.Text>
                </Col>
                <Col span={2}>
                  <Typography.Text strong>Status</Typography.Text>
                </Col>
                <Col span={4}>
                  <Typography.Text strong>Device</Typography.Text>
                </Col>
              </HRListItem>
            </div>
          </>
        }
        renderItem={(log) => {
          return (
            <HRListItem>
              <Col span={8}>
                <Typography.Text>{log.name}</Typography.Text>
              </Col>
              <Col span={6}>
                <Typography.Text>{log.department}</Typography.Text>
              </Col>
              <Col span={4}>
                <Typography.Text>
                  <MomentFormatter value={log?.dateTime} format="MMMM D YYYY, h:mm:ss A" />
                </Typography.Text>
              </Col>
              <Col span={2}>
                <Typography.Text>{log.status}</Typography.Text>
              </Col>
              <Col span={4}>
                <Typography.Text>{log.deviceName}</Typography.Text>
              </Col>
            </HRListItem>
          );
        }}
      />
    </>
  );
};

export default EmployeeAttendanceLogsPage;
