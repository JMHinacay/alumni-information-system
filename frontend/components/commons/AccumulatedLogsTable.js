import React, { useState, useEffect } from 'react';
import { Tooltip, Typography, Tag, Button, Space } from 'antd';
import { CheckCircleTwoTone, ReloadOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import MomentFormatter from '@components/utils/MomentFormatter';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import useHasPermission from '@hooks/useHasPermission';
import AccumulatedLogsSummary from './AccumulatedLogsSummary';
import { HRTable, HRButton, HRInput } from '@components/commons';
import styles from '@styles/employee-attendance/accumulated-logs.module.css';
import moment from 'moment';
import _ from 'lodash';
import Item from 'antd/lib/list/Item';

function AccumulatedLogsTable({
  dataSource,
  holidays = {},
  loading,
  toggleValue,
  allowReallocateHours,
  actionColumn,
  ...props
}) {
  const [tableData, setTableData] = useState(dataSource);
  const allowViewDetailedAccumulatedLog = useHasPermission(['view_detailed_accumulated_log']);

  const onCell = (record, index) => {
    let props = {};
    if (record?.isAbsentOnly) props.className = `${styles.absent}`;
    else if (record?.isOvertimeOnly) props.className = `${styles.overtime}`;
    return props;
  };

  const onCellData = (record, key, withHoursSuffix, finalCount) => {
    let count = record[key];
    let props = {
      className: '',
    };
    if (record?.isAbsentOnly) props.className = `${styles.absent} `;
    else if (record?.isOvertimeOnly) props.className = `${styles.overtime} `;

    if (finalCount) {
      if (finalCount > 0) {
        props.className += `${styles['with-hours']} `;
      }
    } else if (count > 0) {
      if (withHoursSuffix) props.className += `${styles[`with-hours-${withHoursSuffix}`]} `;
      else props.className += `${styles['with-hours']} `;
    }
    return props;
  };

  const checkAllowReallocateHours = (text, record, log, index) => {
    // if (allowReallocateHours) {
    //   return (
    //     <HourAllocator
    //       rowIndex={index}
    //       text={text}
    //       record={record}
    //       tableData={tableData}
    //       setTableData={setTableData}
    //       log={log}
    //       toggleValue={toggleValue}
    //     />
    //   );
    // } else {
    return <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />;
    //}
  };

  let columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 350,
      fixed: 'left',
      render: (text, logs) => {
        const isHoliday = (holidays) => {
          let holiday = holidays[moment(logs?.date).format('MM_DD_YYYY')] || null;
          if (holiday && holiday.length > 0) {
            for (let i = 0; i < holiday.length; i++) {
              const day = holiday[i];
              if (day?.holidayType !== 'NON_HOLIDAY') return true;
            }
          } else return false;
        };

        let isEmpty =
          logs.late === 0 &&
          logs.undertime === 0 &&
          logs.worked === 0 &&
          logs.hoursRestDay === 0 &&
          logs.hoursSpecialHoliday === 0 &&
          logs.hoursSpecialHolidayAndRestDay === 0 &&
          logs.hoursRegularHoliday === 0 &&
          logs.hoursRegularHolidayAndRestDay === 0 &&
          logs.hoursDoubleHoliday === 0 &&
          logs.hoursDoubleHolidayAndRestDay === 0 &&
          logs.hoursRegularOvertime === 0 &&
          logs.hoursRestOvertime === 0 &&
          logs.hoursSpecialHolidayOvertime === 0 &&
          logs.hoursSpecialHolidayAndRestDayOvertime === 0 &&
          logs.hoursRegularHolidayOvertime === 0 &&
          logs.hoursRegularHolidayAndRestDayOvertime === 0 &&
          logs.hoursDoubleHolidayOvertime === 0 &&
          logs.hoursDoubleHolidayAndRestDayOvertime === 0 &&
          logs.hoursWorkedNSD === 0 &&
          logs.hoursRestDayNSD === 0 &&
          logs.hoursSpecialHolidayNSD === 0 &&
          logs.hoursSpecialHolidayAndRestDayNSD === 0 &&
          logs.hoursRegularHolidayNSD === 0 &&
          logs.hoursRegularHolidayAndRestDayNSD === 0 &&
          logs.hoursDoubleHolidayNSD === 0 &&
          logs.hoursDoubleHolidayAndRestDayNSD === 0 &&
          logs.workedOIC === 0 &&
          logs.hoursSpecialHolidayOIC === 0 &&
          logs.hoursRegularHolidayOIC === 0 &&
          logs.hoursDoubleHolidayOIC === 0 &&
          logs.hoursRegularOICOvertime === 0 &&
          logs.hoursSpecialHolidayOICOvertime === 0 &&
          logs.hoursRegularHolidayOICOvertime === 0 &&
          logs.hoursDoubleHolidayOICOvertime === 0 &&
          logs.hoursWorkedOICNSD === 0 &&
          logs.hoursSpecialHolidayOICNSD === 0 &&
          logs.hoursRegularHolidayOICNSD === 0 &&
          logs.hoursDoubleHolidayOICNSD === 0 &&
          logs.hoursAbsent === 0;
        return (
          <>
            {!isEmpty ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 5 }} />
            ) : (
              <CloseCircleTwoTone twoToneColor="#F23535" style={{ marginRight: 5 }} />
            )}
            <span style={{ marginRight: 5 }}>
              <MomentFormatter format={'ddd, MMMM D, YYYY'} value={logs?.date} />
            </span>
            <div>
              {logs?.isRestDay && <Tag color="blue">REST DAY</Tag>}
              {logs?.isLeave && <Tag color="green">LEAVE</Tag>}
              {isHoliday(holidays) && <Tag color="blue">HOLIDAY</Tag>}
              {logs?.isError && <Tag color="red">{logs?.message}</Tag>}
            </div>
          </>
        );
      },
      onCell,
    },
    {
      title: 'In',
      key: 'in-time',
      width: 200,
      render: (_, { inTime }) =>
        inTime && <MomentFormatter value={inTime} format="MMM D, YYYY, h:mm:ss A" />,
      onCell,
    },
    {
      title: 'Out',
      key: 'out-time',
      width: 200,
      render: (_, { outTime }) =>
        outTime && <MomentFormatter value={outTime} format="MMM D, YYYY, h:mm:ss A" />,
      onCell,
    },
    {
      title: <Typography.Text strong>Underperformances</Typography.Text>,
      children: [
        {
          title: 'Late',
          dataIndex: 'late',
          key: 'late',
          width: 100,
          align: 'center',
          render: (text, record, index) => checkAllowReallocateHours(text, record, 'late', index),
          onCell: (record) => onCellData(record, 'late', 'red'),
        },
        {
          title: 'Undertime',
          dataIndex: 'undertime',
          key: 'undertime',
          width: 100,
          align: 'center',
          render: (text, record, index) =>
            checkAllowReallocateHours(text, record, 'undertime', index),
          onCell: (record) => onCellData(record, 'undertime', 'red'),
        },
        {
          title: 'Absent',
          dataIndex: 'hoursAbsent',
          key: 'hoursAbsent',
          width: 100,
          align: 'center',
          render: (text, record, index) =>
            checkAllowReallocateHours(text, record, 'hoursAbsent', index),
          onCell: (record) => onCellData(record, 'hoursAbsent', 'red'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Work Day</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'worked',
          dataIndex: 'worked',
          width: 100,
          align: 'center',
          render: (text, record, index) => {
            if (allowViewDetailedAccumulatedLog)
              return checkAllowReallocateHours(text, record, 'worked', index);
            else {
              let {
                worked,
                hoursRestDay,
                hoursSpecialHoliday,
                hoursSpecialHolidayAndRestDay,
                hoursRegularHoliday,
                hoursRegularHolidayAndRestDay,
                hoursDoubleHoliday,
                hoursDoubleHolidayAndRestDay,
                workedOIC,
                hoursSpecialHolidayOIC,
                hoursRegularHolidayOIC,
                hoursDoubleHolidayOIC,
              } = record;
              const total =
                worked +
                hoursRestDay +
                hoursSpecialHoliday +
                hoursSpecialHolidayAndRestDay +
                hoursRegularHoliday +
                hoursRegularHolidayAndRestDay +
                hoursDoubleHoliday +
                hoursDoubleHolidayAndRestDay +
                workedOIC +
                hoursSpecialHolidayOIC +
                hoursRegularHolidayOIC +
                hoursDoubleHolidayOIC;
              return <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={total} />;
            }
          },
          onCell: (record) => {
            if (allowViewDetailedAccumulatedLog) return onCellData(record, 'worked');
            else {
              let {
                worked,
                hoursRestDay,
                hoursSpecialHoliday,
                hoursSpecialHolidayAndRestDay,
                hoursRegularHoliday,
                hoursRegularHolidayAndRestDay,
                hoursDoubleHoliday,
                hoursDoubleHolidayAndRestDay,
                workedOIC,
                hoursSpecialHolidayOIC,
                hoursRegularHolidayOIC,
                hoursDoubleHolidayOIC,
              } = record;
              const total =
                worked +
                hoursRestDay +
                hoursSpecialHoliday +
                hoursSpecialHolidayAndRestDay +
                hoursRegularHoliday +
                hoursRegularHolidayAndRestDay +
                hoursDoubleHoliday +
                hoursDoubleHolidayAndRestDay +
                workedOIC +
                hoursSpecialHolidayOIC +
                hoursRegularHolidayOIC +
                hoursDoubleHolidayOIC;
              return onCellData(record, 'worked', null, total);
            }
          },
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularOvertime',
          dataIndex: 'hoursRegularOvertime',
          width: 100,
          align: 'center',
          render: (text, record, index) => {
            if (allowViewDetailedAccumulatedLog)
              return checkAllowReallocateHours(text, record, 'hoursRegularOvertime', index);
            else {
              let {
                hoursRegularOvertime,
                hoursRestOvertime,
                hoursSpecialHolidayOvertime,
                hoursSpecialHolidayAndRestDayOvertime,
                hoursRegularHolidayOvertime,
                hoursRegularHolidayAndRestDayOvertime,
                hoursDoubleHolidayOvertime,
                hoursDoubleHolidayAndRestDayOvertime,
                hoursRegularOICOvertime,
                hoursSpecialHolidayOICOvertime,
                hoursRegularHolidayOICOvertime,
                hoursDoubleHolidayOICOvertime,
              } = record;
              const total =
                hoursRegularOvertime +
                hoursRestOvertime +
                hoursSpecialHolidayOvertime +
                hoursSpecialHolidayAndRestDayOvertime +
                hoursRegularHolidayOvertime +
                hoursRegularHolidayAndRestDayOvertime +
                hoursDoubleHolidayOvertime +
                hoursDoubleHolidayAndRestDayOvertime +
                hoursRegularOICOvertime +
                hoursSpecialHolidayOICOvertime +
                hoursRegularHolidayOICOvertime +
                hoursDoubleHolidayOICOvertime;
              return <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={total} />;
            }
          },
          onCell: (record) => {
            if (allowViewDetailedAccumulatedLog) return onCellData(record, 'hoursRegularOvertime');
            else {
              let {
                hoursRegularOvertime,
                hoursRestOvertime,
                hoursSpecialHolidayOvertime,
                hoursSpecialHolidayAndRestDayOvertime,
                hoursRegularHolidayOvertime,
                hoursRegularHolidayAndRestDayOvertime,
                hoursDoubleHolidayOvertime,
                hoursDoubleHolidayAndRestDayOvertime,
                hoursRegularOICOvertime,
                hoursSpecialHolidayOICOvertime,
                hoursRegularHolidayOICOvertime,
                hoursDoubleHolidayOICOvertime,
              } = record;
              const total =
                hoursRegularOvertime +
                hoursRestOvertime +
                hoursSpecialHolidayOvertime +
                hoursSpecialHolidayAndRestDayOvertime +
                hoursRegularHolidayOvertime +
                hoursRegularHolidayAndRestDayOvertime +
                hoursDoubleHolidayOvertime +
                hoursDoubleHolidayAndRestDayOvertime +
                hoursRegularOICOvertime +
                hoursSpecialHolidayOICOvertime +
                hoursRegularHolidayOICOvertime +
                hoursDoubleHolidayOICOvertime;
              return onCellData(record, 'hoursRegularOvertime', null, total);
            }
          },
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursWorkedNSD',
          dataIndex: 'hoursWorkedNSD',
          width: 100,
          align: 'center',
          render: (text, record, index) => {
            if (allowViewDetailedAccumulatedLog)
              return checkAllowReallocateHours(text, record, 'hoursWorkedNSD', index);
            else {
              let {
                hoursWorkedNSD,
                hoursRestDayNSD,
                hoursSpecialHolidayNSD,
                hoursSpecialHolidayAndRestDayNSD,
                hoursRegularHolidayNSD,
                hoursRegularHolidayAndRestDayNSD,
                hoursDoubleHolidayNSD,
                hoursDoubleHolidayAndRestDayNSD,
                hoursWorkedOICNSD,
                hoursSpecialHolidayOICNSD,
                hoursRegularHolidayOICNSD,
                hoursDoubleHolidayOICNSD,
              } = record;
              const total =
                hoursWorkedNSD +
                hoursRestDayNSD +
                hoursSpecialHolidayNSD +
                hoursSpecialHolidayAndRestDayNSD +
                hoursRegularHolidayNSD +
                hoursRegularHolidayAndRestDayNSD +
                hoursDoubleHolidayNSD +
                hoursDoubleHolidayAndRestDayNSD +
                hoursWorkedOICNSD +
                hoursSpecialHolidayOICNSD +
                hoursRegularHolidayOICNSD +
                hoursDoubleHolidayOICNSD;
              return <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={total} />;
            }
          },
          onCell: (record) => {
            if (allowViewDetailedAccumulatedLog) return onCellData(record, 'hoursWorkedNSD');
            else {
              let {
                hoursWorkedNSD,
                hoursRestDayNSD,
                hoursSpecialHolidayNSD,
                hoursSpecialHolidayAndRestDayNSD,
                hoursRegularHolidayNSD,
                hoursRegularHolidayAndRestDayNSD,
                hoursDoubleHolidayNSD,
                hoursDoubleHolidayAndRestDayNSD,
                hoursWorkedOICNSD,
                hoursSpecialHolidayOICNSD,
                hoursRegularHolidayOICNSD,
                hoursDoubleHolidayOICNSD,
              } = record;
              const total =
                hoursWorkedNSD +
                hoursRestDayNSD +
                hoursSpecialHolidayNSD +
                hoursSpecialHolidayAndRestDayNSD +
                hoursRegularHolidayNSD +
                hoursRegularHolidayAndRestDayNSD +
                hoursDoubleHolidayNSD +
                hoursDoubleHolidayAndRestDayNSD +
                hoursWorkedOICNSD +
                hoursSpecialHolidayOICNSD +
                hoursRegularHolidayOICNSD +
                hoursDoubleHolidayOICNSD;
              return onCellData(record, 'hoursWorkedNSD', null, total);
            }
          },
        },
      ],
    },
  ];

  if (allowViewDetailedAccumulatedLog) {
    let addedColumns = [
      {
        title: <Typography.Text strong>Work Day OIC</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'workedOIC',
            dataIndex: 'workedOIC',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'workedOIC', index),
            onCell: (record) => onCellData(record, 'workedOIC'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularOICOvertime',
            dataIndex: 'hoursRegularOICOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularOICOvertime', index),
            onCell: (record) => onCellData(record, 'hoursRegularOICOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursWorkedOICNSD',
            dataIndex: 'hoursWorkedOICNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursWorkedOICNSD', index),
            onCell: (record) => onCellData(record, 'hoursWorkedOICNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Rest Day</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRestDay',
            dataIndex: 'hoursRestDay',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRestDay', index),
            onCell: (record) => onCellData(record, 'hoursRestDay'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRestOvertime',
            dataIndex: 'hoursRestOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRestOvertime', index),
            onCell: (record) => onCellData(record, 'hoursRestOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRestDayNSD',
            dataIndex: 'hoursRestDayNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRestDayNSD', index),
            onCell: (record) => onCellData(record, 'hoursRestDayNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Special Holiday</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHoliday',
            dataIndex: 'hoursSpecialHoliday',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHoliday', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHoliday'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayOvertime',
            dataIndex: 'hoursSpecialHolidayOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHolidayOvertime', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayNSD',
            dataIndex: 'hoursSpecialHolidayNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHolidayNSD', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Special Holiday OIC</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayOIC',
            dataIndex: 'hoursSpecialHolidayOIC',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHolidayOIC', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayOIC'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayOICOvertime',
            dataIndex: 'hoursSpecialHolidayOICOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHolidayOICOvertime', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayOICOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayOICNSD',
            dataIndex: 'hoursSpecialHolidayOICNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHolidayOICNSD', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayOICNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Special Holiday and Rest Day</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayAndRestDay',
            dataIndex: 'hoursSpecialHolidayAndRestDay',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHolidayAndRestDay', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayAndRestDay'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayAndRestDayOvertime',
            dataIndex: 'hoursSpecialHolidayAndRestDayOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(
                text,
                record,
                'hoursSpecialHolidayAndRestDayOvertime',
                index,
              ),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayAndRestDayOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursSpecialHolidayAndRestDayNSD',
            dataIndex: 'hoursSpecialHolidayAndRestDayNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursSpecialHolidayAndRestDayNSD', index),
            onCell: (record) => onCellData(record, 'hoursSpecialHolidayAndRestDayNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Regular Holiday</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHoliday',
            dataIndex: 'hoursRegularHoliday',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHoliday', index),
            onCell: (record) => onCellData(record, 'hoursRegularHoliday'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayOvertime',
            dataIndex: 'hoursRegularHolidayOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHolidayOvertime', index),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayNSD',
            dataIndex: 'hoursRegularHolidayNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHolidayNSD', index),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Regular Holiday OIC</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayOIC',
            dataIndex: 'hoursRegularHolidayOIC',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHolidayOIC', index),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayOIC'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayOICOvertime',
            dataIndex: 'hoursRegularHolidayOICOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHolidayOICOvertime', index),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayOICOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayOICNSD',
            dataIndex: 'hoursRegularHolidayOICNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHolidayOICNSD', index),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayOICNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Regular Holiday and Rest Day</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayAndRestDay',
            dataIndex: 'hoursRegularHolidayAndRestDay',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHolidayAndRestDay', index),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayAndRestDay'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayAndRestDayOvertime',
            dataIndex: 'hoursRegularHolidayAndRestDayOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(
                text,
                record,
                'hoursRegularHolidayAndRestDayOvertime',
                index,
              ),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayAndRestDayOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursRegularHolidayAndRestDayNSD',
            dataIndex: 'hoursRegularHolidayAndRestDayNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursRegularHolidayAndRestDayNSD', index),
            onCell: (record) => onCellData(record, 'hoursRegularHolidayAndRestDayNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>DoubleHoliday</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHoliday',
            dataIndex: 'hoursDoubleHoliday',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHoliday', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHoliday'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayOvertime',
            dataIndex: 'hoursDoubleHolidayOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHolidayOvertime', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayNSD',
            dataIndex: 'hoursDoubleHolidayNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHolidayNSD', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Double Holiday OIC</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayOIC',
            dataIndex: 'hoursDoubleHolidayOIC',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHolidayOIC', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayOIC'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayOICOvertime',
            dataIndex: 'hoursDoubleHolidayOICOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHolidayOICOvertime', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayOICOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayOICNSD',
            dataIndex: 'hoursDoubleHolidayOICNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHolidayOICNSD', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayOICNSD'),
          },
        ],
      },
      {
        title: <Typography.Text strong>Double Holiday and Rest Day</Typography.Text>,
        children: [
          {
            title: (
              <Tooltip title="Regular">
                <Typography.Text>R</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayAndRestDay',
            dataIndex: 'hoursDoubleHolidayAndRestDay',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHolidayAndRestDay', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayAndRestDay'),
          },
          {
            title: (
              <Tooltip title="Overtime">
                <Typography.Text>OT</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayAndRestDayOvertime',
            dataIndex: 'hoursDoubleHolidayAndRestDayOvertime',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(
                text,
                record,
                'hoursDoubleHolidayAndRestDayOvertime',
                index,
              ),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayAndRestDayOvertime'),
          },
          {
            title: (
              <Tooltip title="Night Shift Differential">
                <Typography.Text>NSD</Typography.Text>
              </Tooltip>
            ),
            key: 'hoursDoubleHolidayAndRestDayNSD',
            dataIndex: 'hoursDoubleHolidayAndRestDayNSD',
            width: 100,
            align: 'center',
            render: (text, record, index) =>
              checkAllowReallocateHours(text, record, 'hoursDoubleHolidayAndRestDayNSD', index),
            onCell: (record) => onCellData(record, 'hoursDoubleHolidayAndRestDayNSD'),
          },
        ],
      },
    ];
    columns = [...columns, ...addedColumns];
  }

  if (allowReallocateHours) {
    let fixedColumn = [
      {
        title: 'Unallocated Hours',
        key: 'unallocated',
        dataIndex: 'unallocated',
        width: 120,
        fixed: 'right',
        align: 'center',
        render: (text) => <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />,
        onCell,
      },
    ];

    columns = [...columns, ...fixedColumn, { ...actionColumn, onCell }];
  }

  const scrollProps = { y: 'calc(100vh - 330px)' };
  useEffect(() => {
    // let arr = dataSource.map((item) => {
    //   return item.totals;
    // });
    // setTableData(arr);
    setTableData(dataSource);
  }, [dataSource]);

  return (
    <>
      <HRTable
        columns={columns}
        loading={loading}
        // dataSource={tableData}
        dataSource={allowReallocateHours ? tableData : dataSource}
        size="middle"
        scroll={scrollProps}
        pagination={false}
        rowKey="id"
        summary={(pageData) => (
          <AccumulatedLogsSummary pageData={pageData} allowReallocateHours={allowReallocateHours} />
        )}
      />
    </>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    JSON.stringify(prevProps.actionColumn) === JSON.stringify(nextProps.actionColumn) &&
    _.isEqual(prevProps.dataSource, nextProps.dataSource) &&
    _.isEqual(prevProps.holidays, nextProps.holidays) &&
    prevProps.loading === nextProps.loading &&
    prevProps.toggleValue === nextProps.toggleValue &&
    prevProps.allowReallocateHours === nextProps.allowReallocateHours
  );
}
export default React.memo(AccumulatedLogsTable, areEqual);
