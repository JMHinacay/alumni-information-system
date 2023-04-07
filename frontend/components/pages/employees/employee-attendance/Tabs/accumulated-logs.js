import { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { HRButton, HRDivider, HRForm, HRList, HRListItem } from '@components/commons';
import { Col, DatePicker, Row, Table, Tag, Tooltip, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import MomentFormatter from '@components/utils/MomentFormatter';
import moment from 'moment';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import HRTable from '@components/commons/HRTable';

import styles from '@styles/employee-attendance/accumulated-logs.module.css';

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
      hoursRegularOvertime
      hoursRestOvertime
      hoursSpecialHolidayOvertime
      hoursSpecialHolidayAndRestDayOvertime
      hoursRegularHolidayOvertime
      hoursRegularHolidayAndRestDayOvertime
      hoursDoubleHolidayOvertime
      hoursDoubleHolidayAndRestDayOvertime
      hoursRestDay
      hoursSpecialHoliday
      hoursSpecialHolidayAndRestDay
      hoursRegularHoliday
      hoursRegularHolidayAndRestDay
      hoursDoubleHoliday
      hoursDoubleHolidayAndRestDay
      hoursNightDifferential
      hoursAbsent
      isOvertimeOnly
      isAbsentOnly
      isRestDay
      isRestDayOnly
    }
  }
`;

const AccumulatedLogsTab = (props) => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      dates: [null, null],
    },
  });
  const [getEmployeeAttendance, { data, loading, refetch }] = useLazyQuery(
    GET_SAVED_EMPLOYEE_ATTENDANCE,
  );

  const handleSubmit = ({ dates }) => {
    // console.log(moment(dates[0]).format('dddd, MMMM D, YYYY, h:mm A'));
    // console.log({
    //   variables: {
    //     startDate: moment(values[0]).startOf('day').utc().format(),
    //     endDate: moment(values[1]).endOf('day').utc().format(),
    //     ...state,
    //     id: router?.query?.id || null,
    //   },
    // });
    getEmployeeAttendance({
      variables: {
        startDate: moment(dates[0]).startOf('day').utc().format(),
        endDate: moment(dates[1]).endOf('day').utc().format(),
        id: router?.query?.id || null,
      },
    });
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const headers = [
    { text: 'Date', span: 9 },
    { text: 'In', span: 3 },
    { text: 'Out', span: 3 },
    { text: 'Work', span: 2 },
    { text: 'Late', span: 2 },
    { text: 'Undertime', span: 2 },
    { text: 'OT', span: 2 },
  ];

  const onCell = (record, index) => {
    let props = {};
    if (record?.isAbsentOnly) props.className = `${styles.absent}`;
    else if (record?.isOvertimeOnly) props.className = `${styles.overtime}`;
    return props;
  };

  const onCellData = (record, key, withHoursSuffix) => {
    let count = record[key];
    let props = {
      className: '',
    };
    if (record?.isAbsentOnly) props.className = `${styles.absent} `;
    else if (record?.isOvertimeOnly) props.className = `${styles.overtime} `;
    if (count > 0) {
      if (withHoursSuffix) props.className += `${styles[`with-hours-${withHoursSuffix}`]} `;
      else props.className += `${styles['with-hours']} `;
    }
    return props;
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 350,
      fixed: 'left',
      render: (text, logs) => (
        <>
          <span style={{ marginRight: 5 }}>
            <MomentFormatter format={'ddd, MMMM D, YYYY'} value={logs?.date} />
          </span>
          {logs?.isError && (
            <Tag color="red">{logs?.message}</Tag>
            // <Tooltip title={logs?.message}>
            //   <ExclamationCircleOutlined style={{ marginRight: 10, color: 'red' }} />
            // </Tooltip>
          )}
          {logs?.isRestDay && <Tag color="blue">REST DAY</Tag>}
        </>
      ),
      onCell,
    },
    {
      title: 'In',
      key: 'in-time',
      width: 125,
      render: (_, { inTime }) => inTime && <MomentFormatter value={inTime} format="hh:mm:ss A" />,
      onCell,
    },
    {
      title: 'Out',
      key: 'out-time',
      width: 125,
      render: (_, { outTime }) =>
        outTime && <MomentFormatter value={outTime} format="hh:mm:ss A" />,
      onCell,
    },
    {
      title: <Typography.Text strong>Scheduled</Typography.Text>,
      children: [
        {
          title: 'Regular',
          key: 'regular_worked',
          dataIndex: 'worked',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'worked'),
        },
        {
          title: 'Late',
          dataIndex: 'late',
          key: 'late',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'late', 'red'),
        },
        {
          title: 'Undertime',
          dataIndex: 'undertime',
          key: 'undertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'undertime', 'red'),
        },
        {
          title: 'Absent',
          dataIndex: 'hoursAbsent',
          key: 'hoursAbsent',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell,
        },
        {
          title: 'Rest Day',
          key: 'regular_rest',
          dataIndex: 'hoursRestDay',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursRestDay'),
        },
        {
          title: 'Special Holiday',
          key: 'hoursSpecialHoliday',
          dataIndex: 'hoursSpecialHoliday',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursSpecialHoliday'),
        },
        {
          title: 'Special Holiday and Rest Day',
          key: 'hoursSpecialHolidayAndRestDay',
          dataIndex: 'hoursSpecialHolidayAndRestDay',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursSpecialHolidayAndRestDay'),
        },
        {
          title: 'Regular Holiday',
          key: 'hoursRegularHoliday',
          dataIndex: 'hoursRegularHoliday',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursRegularHoliday'),
        },
        {
          title: 'Regular Holiday and Rest Day',
          key: 'hoursRegularHolidayAndRestDay',
          dataIndex: 'hoursRegularHolidayAndRestDay',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursRegularHolidayAndRestDay'),
        },
        {
          title: 'Double Holiday',
          key: 'hoursDoubleHoliday',
          dataIndex: 'hoursDoubleHoliday',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursDoubleHoliday'),
        },
        {
          title: 'Double Holiday and Rest Day',
          key: 'hoursDoubleHolidayAndRestDay',
          dataIndex: 'hoursDoubleHolidayAndRestDay',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursDoubleHolidayAndRestDay'),
        },
        {
          title: 'Nigh Shift Differential',
          dataIndex: 'gender',
          dataIndex: 'hoursNightDifferential',
          key: 'hoursNightDifferential',
          width: 150,
          onCell: (record, index) => onCellData(record, 'hoursNightDifferential'),
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
        },
      ],
    },
    {
      title: <Typography.Text strong>Overtime</Typography.Text>,
      children: [
        {
          title: 'Regular',
          key: 'hoursRegularOvertime',
          dataIndex: 'hoursRegularOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursRegularOvertime'),
        },
        {
          title: 'Rest Day',
          key: 'hoursRestOvertime',
          dataIndex: 'hoursRestOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursRestOvertime'),
        },
        {
          title: 'Special Holiday',
          key: 'hoursSpecialHolidayOvertime',
          dataIndex: 'hoursSpecialHolidayOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursSpecialHolidayOvertime'),
        },
        {
          title: 'Special Holiday and Rest Day',
          key: 'hoursSpecialHolidayAndRestDayOvertime',
          dataIndex: 'hoursSpecialHolidayAndRestDayOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursSpecialHolidayAndRestDayOvertime'),
        },
        {
          title: 'Regular Holiday',
          key: 'hoursRegularHolidayOvertime',
          dataIndex: 'hoursRegularHolidayOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursRegularHolidayOvertime'),
        },
        {
          title: 'Regular Holiday and Rest Day',
          key: 'hoursRegularHolidayAndRestDayOvertime',
          dataIndex: 'hoursRegularHolidayAndRestDayOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursRegularHolidayAndRestDayOvertime'),
        },
        {
          title: 'Double Holiday',
          key: 'hoursDoubleHolidayOvertime',
          dataIndex: 'hoursDoubleHolidayOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursDoubleHolidayOvertime'),
        },
        {
          title: 'Double Holiday and Rest Day',
          key: 'hoursDoubleHolidayAndRestDayOvertime',
          dataIndex: 'hoursDoubleHolidayAndRestDayOvertime',
          width: 125,
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
          onCell: (record, index) => onCellData(record, 'hoursDoubleHolidayAndRestDayOvertime'),
        },
        {
          title: 'Nigh Shift Differential',
          dataIndex: 'gender',
          dataIndex: 'hoursNightDifferentialOvertime',
          key: 'hoursNightDifferentialOvertime',
          width: 150,
          onCell: (record, index) => onCellData(record, 'hoursNightDifferentialOvertime'),
          render: (text) => <NumeralFormatter withPesos={false} value={text} />,
        },
      ],
    },
  ];

  const scrollProps = { y: 'calc(100vh - 330px)' };

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
        {/* <HRList
          loading={loading}
          headers={headers}
          dataSource={data?.logs || []}
          renderItem={renderAttendanceLogs}
          style={{ margin: '10px 0' }}
        /> */}

        <HRTable
          columns={columns}
          loading={loading}
          dataSource={data?.logs || []}
          size="middle"
          scroll={scrollProps}
          pagination={false}
          rowKey="id"
          // onRow={onRow}
          summary={(pageData) => {
            // console.log(pageData);
            let totalBorrow = 0;
            let totalRepayment = 0;

            let totalHoursRegularOvertime = 0;
            let totalHoursRestOvertime = 0;
            let totalHoursSpecialHolidayOvertime = 0;
            let totalHoursSpecialHolidayAndRestDayOvertime = 0;
            let totalHoursRegularHolidayOvertime = 0;
            let totalHoursRegularHolidayAndRestDayOvertime = 0;
            let totalHoursDoubleHolidayOvertime = 0;
            let totalHoursDoubleHolidayAndRestDayOvertime = 0;
            let totalHoursRestDay = 0;
            let totalHoursSpecialHoliday = 0;
            let totalHoursSpecialHolidayAndRestDay = 0;
            let totalHoursRegularHoliday = 0;
            let totalHoursRegularHolidayAndRestDay = 0;
            let totalHoursDoubleHoliday = 0;
            let totalHoursDoubleHolidayAndRestDay = 0;

            let totalHoursAbsent = 0;

            let totalHoursNightDifferential = 0;
            let totalHoursNightDifferentialOvertime = 0;

            let totalLate = 0;
            let totalUndertime = 0;
            let totalWorked = 0;

            pageData.forEach(
              ({
                hoursRegularOvertime,
                hoursRestOvertime,
                hoursSpecialHolidayOvertime,
                hoursSpecialHolidayAndRestDayOvertime,
                hoursRegularHolidayOvertime,
                hoursRegularHolidayAndRestDayOvertime,
                hoursDoubleHolidayOvertime,
                hoursDoubleHolidayAndRestDayOvertime,
                hoursRestDay,
                hoursSpecialHoliday,
                hoursSpecialHolidayAndRestDay,
                hoursRegularHoliday,
                hoursRegularHolidayAndRestDay,
                hoursDoubleHoliday,
                hoursDoubleHolidayAndRestDay,
                hoursNightDifferential,
                hoursAbsent,
                hoursNightDifferentialOvertime,
                late,
                undertime,
                worked,
              }) => {
                totalHoursRegularOvertime += hoursRegularOvertime;
                totalHoursRestOvertime += hoursRestOvertime;
                totalHoursSpecialHolidayOvertime += hoursSpecialHolidayOvertime;
                totalHoursSpecialHolidayAndRestDayOvertime += hoursSpecialHolidayAndRestDayOvertime;
                totalHoursRegularHolidayOvertime += hoursRegularHolidayOvertime;
                totalHoursRegularHolidayAndRestDayOvertime += hoursRegularHolidayAndRestDayOvertime;
                totalHoursDoubleHolidayOvertime += hoursDoubleHolidayOvertime;
                totalHoursDoubleHolidayAndRestDayOvertime += hoursDoubleHolidayAndRestDayOvertime;
                totalHoursRestDay += hoursRestDay;
                totalHoursSpecialHoliday += hoursSpecialHoliday;
                totalHoursSpecialHolidayAndRestDay += hoursSpecialHolidayAndRestDay;
                totalHoursRegularHoliday += hoursRegularHoliday;
                totalHoursRegularHolidayAndRestDay += hoursRegularHolidayAndRestDay;
                totalHoursDoubleHoliday += hoursDoubleHoliday;
                totalHoursDoubleHolidayAndRestDay += hoursDoubleHolidayAndRestDay;
                totalHoursNightDifferential += hoursNightDifferential;
                totalHoursNightDifferentialOvertime += hoursNightDifferentialOvertime;
                totalHoursAbsent += hoursAbsent;
                totalLate += late;
                totalUndertime += undertime;
                totalWorked += worked;
              },
            );

            return (
              <Table.Summary.Row fixed>
                <Table.Summary.Cell index={0} fixed={'left'} width={300}>
                  <Typography.Text strong>Total</Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalWorked} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong type={totalLate > 0 && 'danger'}>
                    <NumeralFormatter withPesos={false} value={totalLate} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong type={totalUndertime > 0 && 'danger'}>
                    <NumeralFormatter withPesos={false} value={totalUndertime} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong type={totalHoursAbsent > 0 && 'danger'}>
                    <NumeralFormatter withPesos={false} value={totalHoursAbsent} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursRestDay} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursSpecialHoliday} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter
                      withPesos={false}
                      value={totalHoursSpecialHolidayAndRestDay}
                    />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursRegularHoliday} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter
                      withPesos={false}
                      value={totalHoursRegularHolidayAndRestDay}
                    />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursDoubleHoliday} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursDoubleHolidayAndRestDay} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursNightDifferential} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursRegularOvertime} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursRestOvertime} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursSpecialHolidayOvertime} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter
                      withPesos={false}
                      value={totalHoursSpecialHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursRegularOvertime} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter
                      withPesos={false}
                      value={totalHoursRegularHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter withPesos={false} value={totalHoursDoubleHolidayOvertime} />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter
                      withPesos={false}
                      value={totalHoursDoubleHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Typography.Text strong>
                    <NumeralFormatter
                      withPesos={false}
                      value={totalHoursNightDifferentialOvertime}
                    />
                  </Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
        {/* <HRTable columns={columns} dataSource={data?.logs || []} loading={loading} /> */}
      </div>
    </>
  );
};

export default AccumulatedLogsTab;
