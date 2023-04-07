import { gql, useLazyQuery } from '@apollo/client';
import { HRButton, HRDivider, HRForm } from '@components/commons';
import { Col, DatePicker, message, Row } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import { useRouter } from 'next/router';
import PerformanceSummaryComponent from '@components/pages/employees/employee-attendance/Tabs/performance-summary-component/PerformanceSummaryComponent';
import { get } from '@shared/global';
import { useState } from 'react';

const GET_EMPLOYEE_PERF = gql`
  query($startDate: Instant, $endDate: Instant, $id: UUID) {
    performance: getEmployeePerformanceSummary(startDate: $startDate, endDate: $endDate, id: $id) {
      late
      countLate
      hoursAbsent
      countAbsent
      undertime
      countUndertime

      worked
      countWorked
      workedOIC
      countWorkedOIC
      hoursRegularOvertime
      countOvertime
      hoursRegularOICOvertime
      countOICOvertime
      hoursWorkedNSD
      countWorkedNSD
      hoursWorkedOICNSD
      countWorkedOICNSD
      hoursRestDay
      countRestDayWorked
      hoursRestOvertime
      countRestOvertime
      hoursRestDayNSD
      countRestDayNSD

      hoursSpecialHoliday
      countSpecialHoliday
      hoursSpecialHolidayOIC
      countSpecialHolidayOIC
      hoursSpecialHolidayOvertime
      countSpecialHolidayOvertime
      hoursSpecialHolidayOICOvertime
      countSpecialHolidayOICOvertime
      hoursSpecialHolidayNSD
      countSpecialHolidayNSD
      hoursSpecialHolidayOICNSD
      countSpecialHolidayOICNSD
      hoursSpecialHolidayAndRestDay
      countSpecialHolidayAndRestDay
      hoursSpecialHolidayAndRestDayOvertime
      countSpecialHolidayAndRestDayOvertime
      hoursSpecialHolidayAndRestDayNSD
      countSpecialHolidayAndRestDayNSD

      hoursRegularHoliday
      countRegularHoliday
      hoursRegularHolidayOIC
      countRegularHolidayOIC
      hoursRegularHolidayOvertime
      countRegularHolidayOvertime
      hoursRegularHolidayOICOvertime
      countRegularHolidayOICOvertime
      hoursRegularHolidayNSD
      countRegularHolidayNSD
      hoursRegularHolidayOICNSD
      countRegularHolidayOICNSD
      hoursRegularHolidayAndRestDay
      countRegularHolidayAndRestDay
      hoursRegularHolidayAndRestDayOvertime
      countRegularHolidayAndRestDayOvertime
      hoursRegularHolidayAndRestDayNSD
      countRegularHolidayAndRestDayNSD

      hoursDoubleHoliday
      countDoubleHoliday
      hoursDoubleHolidayOIC
      countDoubleHolidayOIC
      hoursDoubleHolidayOvertime
      countDoubleHolidayOvertime
      hoursDoubleHolidayOICOvertime
      countDoubleHolidayOICOvertime
      hoursDoubleHolidayNSD
      countDoubleHolidayNSD
      hoursDoubleHolidayOICNSD
      countDoubleHolidayOICNSD
      hoursDoubleHolidayAndRestDay
      countDoubleHolidayAndRestDay
      hoursDoubleHolidayAndRestDayOvertime
      countDoubleHolidayAndRestDayOvertime
      hoursDoubleHolidayAndRestDayNSD
      countDoubleHolidayAndRestDayNSD

      hoursTotalNSD
      countRestDay
      totalWorkingHours
    }
  }
`;

const PerformanceSummaryTab = ({ employeeId = null, ...props }) => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      dates: [null, null],
    },
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // const [getEmployeePerf, { data, loading, refetch }] = useLazyQuery(GET_EMPLOYEE_PERF);

  const getEmployeePerformanceSummary = async (id, start, end) => {
    setLoading(true);
    return get(`/hrm/getEmployeePerformanceSummary?id=${id}&startDate=${start}&endDate=${end}`);
  };

  const handleSubmit = async ({ dates }) => {
    try {
      let id = employeeId ? employeeId : router?.query?.id || null;
      let startDate = moment(dates[0]).startOf('day').utc().format();
      let endDate = moment(dates[1]).endOf('day').utc().format();
      let perfSummary = await getEmployeePerformanceSummary(id, startDate, endDate);
      setData(perfSummary);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      message.error('Failed to get Performance Summary');
    }
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const { performance } = data || {};
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <HRForm methods={methods} onSubmit={handleSubmit}>
          <Row gutter={[12, 12]}>
            <Col xs={24} lg={24} xl={12}>
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
            <Col xs={24} lg={12} xl={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <HRButton type="primary" block htmlType="submit" loading={loading}>
                Submit
              </HRButton>
            </Col>
          </Row>
        </HRForm>
      </div>
      <HRDivider />
      <PerformanceSummaryComponent loading={loading} performance={data} />
    </>
  );
};

export default PerformanceSummaryTab;
