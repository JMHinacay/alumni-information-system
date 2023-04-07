import { gql, useLazyQuery } from '@apollo/client';
import { HRButton, HRDivider, HRForm } from '@components/commons';
import { Col, DatePicker, message, Row } from 'antd';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';

import AccumulatedLogsTable from '@components/pages/employees/employee-attendance/Tabs/accumulated-logs-component/AccumulatedLogsTable';
import { get } from '@shared/global';
import { useState } from 'react';

const GET_SAVED_EMPLOYEE_ATTENDANCE = gql`
  query($startDate: Instant, $endDate: Instant, $id: UUID) {
    logs: getAccumulatedLogs(startDate: $startDate, endDate: $endDate, id: $id) {
      date
      scheduleStart
      scheduleEnd
      inTime
      outTime
      message
      isError
      late
      undertime
      worked
      hoursRestDay
      hoursSpecialHoliday
      hoursSpecialHolidayAndRestDay
      hoursRegularHoliday
      hoursRegularHolidayAndRestDay
      hoursDoubleHoliday
      hoursDoubleHolidayAndRestDay
      hoursRegularOvertime
      hoursRestOvertime
      hoursSpecialHolidayOvertime
      hoursSpecialHolidayAndRestDayOvertime
      hoursRegularHolidayOvertime
      hoursRegularHolidayAndRestDayOvertime
      hoursDoubleHolidayOvertime
      hoursDoubleHolidayAndRestDayOvertime
      hoursNightDifferential
      hoursWorkedNSD
      hoursRestDayNSD
      hoursSpecialHolidayNSD
      hoursSpecialHolidayAndRestDayNSD
      hoursRegularHolidayNSD
      hoursRegularHolidayAndRestDayNSD
      hoursDoubleHolidayNSD
      hoursDoubleHolidayAndRestDayNSD
      countDoubleHolidayAndRestDay
      workedOIC
      hoursSpecialHolidayOIC
      hoursRegularHolidayOIC
      hoursDoubleHolidayOIC
      hoursRegularOICOvertime
      hoursSpecialHolidayOICOvertime
      hoursRegularHolidayOICOvertime
      hoursDoubleHolidayOICOvertime
      hoursWorkedOICNSD
      hoursSpecialHolidayOICNSD
      hoursRegularHolidayOICNSD
      hoursDoubleHolidayOICNSD
      hoursAbsent
      isOvertimeOnly
      isAbsentOnly
      isRestDay
      isRestDayOnly
      isEmpty
    }
  }
`;

const AccumulatedLogsTab = ({ employeeId = null, ...props }) => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      dates: [null, null],
    },
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // const [getEmployeeAttendance, { data, loading, refetch }] = useLazyQuery(
  //   GET_SAVED_EMPLOYEE_ATTENDANCE,
  // );

  const getEmployeeAccumulatedLogs = (id, start, end) => {
    setLoading(true);
    return get(`/hrm/getEmployeeAccumulatedLogs?id=${id}&startDate=${start}&endDate=${end}`);
  };

  const handleSubmit = async ({ dates }) => {
    try {
      let id = employeeId ? employeeId : router?.query?.id || null;
      let startDate = moment(dates[0]).startOf('day').utc().format();
      let endDate = moment(dates[1]).endOf('day').utc().format();
      let accumulatedLogs = await getEmployeeAccumulatedLogs(id, startDate, endDate);
      setLoading(false);
      setData(accumulatedLogs);
    } catch (err) {
      setLoading(false);
      message.error('Failed to get accumulated Logs.');
    }
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  return (
    <>
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
          </Row>
        </HRForm>
      </div>
      <HRDivider />
      <div>
        <AccumulatedLogsTable loading={loading} dataSource={data || []} ƒ />
      </div>
    </>
  );
};

export default AccumulatedLogsTab;
