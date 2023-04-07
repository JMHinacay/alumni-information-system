import NumeralFormatter from '@components/utils/NumeralFormatter';
import useHasPermission from '@hooks/useHasPermission';
import { Table, Typography } from 'antd';

const AccumulatedLogsSummary = ({ pageData, ...props }) => {
  const allowViewDetailedAccumulatedLog = useHasPermission(['view_detailed_accumulated_log']);

  let totalLate = 0;
  let totalUndertime = 0;
  let totalWorked = 0;
  let totalHoursAbsent = 0;
  let totalHoursRegularOvertime = 0;
  let totalHoursWorkedNSD = 0;
  let totalHoursRestDay = 0;
  let totalHoursRestOvertime = 0;
  let totalHoursRestDayNSD = 0;
  let totalHoursSpecialHoliday = 0;
  let totalHoursSpecialHolidayOvertime = 0;
  let totalHoursSpecialHolidayNSD = 0;
  let totalHoursSpecialHolidayAndRestDay = 0;
  let totalHoursSpecialHolidayAndRestDayOvertime = 0;
  let totalHoursSpecialHolidayAndRestDayNSD = 0;
  let totalHoursRegularHoliday = 0;
  let totalHoursRegularHolidayOvertime = 0;
  let totalHoursRegularHolidayNSD = 0;
  let totalHoursRegularHolidayAndRestDay = 0;
  let totalHoursRegularHolidayAndRestDayOvertime = 0;
  let totalHoursRegularHolidayAndRestDayNSD = 0;
  let totalHoursDoubleHoliday = 0;
  let totalHoursDoubleHolidayOvertime = 0;
  let totalHoursDoubleHolidayNSD = 0;
  let totalHoursDoubleHolidayAndRestDay = 0;
  let totalHoursDoubleHolidayAndRestDayOvertime = 0;
  let totalHoursDoubleHolidayAndRestDayNSD = 0;
  let totalWorkedOIC = 0;
  let totalHoursSpecialHolidayOIC = 0;
  let totalHoursRegularHolidayOIC = 0;
  let totalHoursDoubleHolidayOIC = 0;
  let totalHoursRegularOICOvertime = 0;
  let totalHoursSpecialHolidayOICOvertime = 0;
  let totalHoursRegularHolidayOICOvertime = 0;
  let totalHoursDoubleHolidayOICOvertime = 0;
  let totalHoursWorkedOICNSD = 0;
  let totalHoursSpecialHolidayOICNSD = 0;
  let totalHoursRegularHolidayOICNSD = 0;
  let totalHoursDoubleHolidayOICNSD = 0;

  let overallHoursWorked = 0;
  let overallHoursOvertime = 0;
  let overallHoursNSD = 0;

  pageData.forEach(
    ({
      late,
      undertime,
      hoursAbsent,
      worked,
      hoursRegularOvertime,
      hoursWorkedNSD,
      hoursRestDay,
      hoursRestOvertime,
      hoursRestDayNSD,
      hoursSpecialHoliday,
      hoursSpecialHolidayOvertime,
      hoursSpecialHolidayNSD,
      hoursSpecialHolidayAndRestDay,
      hoursSpecialHolidayAndRestDayOvertime,
      hoursSpecialHolidayAndRestDayNSD,
      hoursRegularHoliday,
      hoursRegularHolidayOvertime,
      hoursRegularHolidayNSD,
      hoursRegularHolidayAndRestDay,
      hoursRegularHolidayAndRestDayOvertime,
      hoursRegularHolidayAndRestDayNSD,
      hoursDoubleHoliday,
      hoursDoubleHolidayOvertime,
      hoursDoubleHolidayNSD,
      hoursDoubleHolidayAndRestDay,
      hoursDoubleHolidayAndRestDayOvertime,
      hoursDoubleHolidayAndRestDayNSD,
      workedOIC,
      hoursSpecialHolidayOIC,
      hoursRegularHolidayOIC,
      hoursDoubleHolidayOIC,
      hoursRegularOICOvertime,
      hoursSpecialHolidayOICOvertime,
      hoursRegularHolidayOICOvertime,
      hoursDoubleHolidayOICOvertime,
      hoursWorkedOICNSD,
      hoursSpecialHolidayOICNSD,
      hoursRegularHolidayOICNSD,
      hoursDoubleHolidayOICNSD,
    }) => {
      totalLate += late;
      totalUndertime += undertime;
      totalWorked += worked;
      totalHoursAbsent += hoursAbsent;
      totalHoursRegularOvertime += hoursRegularOvertime;
      totalHoursWorkedNSD += hoursWorkedNSD;
      totalHoursRestDay += hoursRestDay;
      totalHoursRestOvertime += hoursRestOvertime;
      totalHoursRestDayNSD += hoursRestDayNSD;
      totalHoursSpecialHoliday += hoursSpecialHoliday;
      totalHoursSpecialHolidayOvertime += hoursSpecialHolidayOvertime;
      totalHoursSpecialHolidayNSD += hoursSpecialHolidayNSD;
      totalHoursSpecialHolidayAndRestDay += hoursSpecialHolidayAndRestDay;
      totalHoursSpecialHolidayAndRestDayOvertime += hoursSpecialHolidayAndRestDayOvertime;
      totalHoursSpecialHolidayAndRestDayNSD += hoursSpecialHolidayAndRestDayNSD;
      totalHoursRegularHoliday += hoursRegularHoliday;
      totalHoursRegularHolidayOvertime += hoursRegularHolidayOvertime;
      totalHoursRegularHolidayNSD += hoursRegularHolidayNSD;
      totalHoursRegularHolidayAndRestDay += hoursRegularHolidayAndRestDay;
      totalHoursRegularHolidayAndRestDayOvertime += hoursRegularHolidayAndRestDayOvertime;
      totalHoursRegularHolidayAndRestDayNSD += hoursRegularHolidayAndRestDayNSD;
      totalHoursDoubleHoliday += hoursDoubleHoliday;
      totalHoursDoubleHolidayOvertime += hoursDoubleHolidayOvertime;
      totalHoursDoubleHolidayNSD += hoursDoubleHolidayNSD;
      totalHoursDoubleHolidayAndRestDay += hoursDoubleHolidayAndRestDay;
      totalHoursDoubleHolidayAndRestDayOvertime += hoursDoubleHolidayAndRestDayOvertime;
      totalHoursDoubleHolidayAndRestDayNSD += hoursDoubleHolidayAndRestDayNSD;
      totalWorkedOIC += workedOIC;
      totalHoursSpecialHolidayOIC += hoursSpecialHolidayOIC;
      totalHoursRegularHolidayOIC += hoursRegularHolidayOIC;
      totalHoursDoubleHolidayOIC += hoursDoubleHolidayOIC;
      totalHoursRegularOICOvertime += hoursRegularOICOvertime;
      totalHoursSpecialHolidayOICOvertime += hoursSpecialHolidayOICOvertime;
      totalHoursRegularHolidayOICOvertime += hoursRegularHolidayOICOvertime;
      totalHoursDoubleHolidayOICOvertime += hoursDoubleHolidayOICOvertime;
      totalHoursWorkedOICNSD += hoursWorkedOICNSD;
      totalHoursSpecialHolidayOICNSD += hoursSpecialHolidayOICNSD;
      totalHoursRegularHolidayOICNSD += hoursRegularHolidayOICNSD;
      totalHoursDoubleHolidayOICNSD += hoursDoubleHolidayOICNSD;

      //=============================OVERALL=============================\\
      // Worked
      overallHoursWorked += worked;
      overallHoursWorked += hoursRestDay;
      overallHoursWorked += hoursSpecialHoliday;
      overallHoursWorked += hoursSpecialHolidayAndRestDay;
      overallHoursWorked += hoursRegularHoliday;
      overallHoursWorked += hoursRegularHolidayAndRestDay;
      overallHoursWorked += hoursDoubleHoliday;
      overallHoursWorked += hoursDoubleHolidayAndRestDay;
      overallHoursWorked += workedOIC;
      overallHoursWorked += hoursSpecialHolidayOIC;
      overallHoursWorked += hoursRegularHolidayOIC;
      overallHoursWorked += hoursDoubleHolidayOIC;
      // Overtime
      overallHoursOvertime += hoursRegularOvertime;
      overallHoursOvertime += hoursRestOvertime;
      overallHoursOvertime += hoursSpecialHolidayOvertime;
      overallHoursOvertime += hoursSpecialHolidayAndRestDayOvertime;
      overallHoursOvertime += hoursRegularHolidayOvertime;
      overallHoursOvertime += hoursRegularHolidayAndRestDayOvertime;
      overallHoursOvertime += hoursDoubleHolidayOvertime;
      overallHoursOvertime += hoursDoubleHolidayAndRestDayOvertime;
      overallHoursOvertime += hoursRegularOICOvertime;
      overallHoursOvertime += hoursSpecialHolidayOICOvertime;
      overallHoursOvertime += hoursRegularHolidayOICOvertime;
      overallHoursOvertime += hoursDoubleHolidayOICOvertime;
      // NSD
      overallHoursNSD += hoursWorkedNSD;
      overallHoursNSD += hoursRestDayNSD;
      overallHoursNSD += hoursSpecialHolidayNSD;
      overallHoursNSD += hoursSpecialHolidayAndRestDayNSD;
      overallHoursNSD += hoursRegularHolidayNSD;
      overallHoursNSD += hoursRegularHolidayAndRestDayNSD;
      overallHoursNSD += hoursDoubleHolidayNSD;
      overallHoursNSD += hoursDoubleHolidayAndRestDayNSD;
      overallHoursNSD += hoursWorkedOICNSD;
      overallHoursNSD += hoursSpecialHolidayOICNSD;
      overallHoursNSD += hoursRegularHolidayOICNSD;
      overallHoursNSD += hoursDoubleHolidayOICNSD;
      //=============================OVERALL=============================\\
    },
  );

  return (
    <Table.Summary.Row fixed>
      <Table.Summary.Cell index={0} fixed={'left'} width={300}>
        <Typography.Text strong>Total</Typography.Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell align="center"></Table.Summary.Cell>
      <Table.Summary.Cell align="center"></Table.Summary.Cell>
      {/*=======================================Underperformances=======================================*/}
      <Table.Summary.Cell align="center" align="center">
        <Typography.Text strong={totalLate > 0} type={totalLate > 0 && 'danger'}>
          <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={totalLate} />
        </Typography.Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell align="center">
        <Typography.Text strong={totalUndertime > 0} type={totalUndertime > 0 && 'danger'}>
          <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={totalUndertime} />
        </Typography.Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell align="center">
        <Typography.Text strong={totalHoursAbsent > 0} type={totalHoursAbsent > 0 && 'danger'}>
          <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={totalHoursAbsent} />
        </Typography.Text>
      </Table.Summary.Cell>
      {/*=======================================Underperformances=======================================*/}
      {/*============================================Work Day===========================================*/}
      <Table.Summary.Cell align="center">
        <Typography.Text strong={totalWorked > 0} type={totalWorked > 0 && 'success'}>
          <NumeralFormatter
            format={'0,0.[0000]'}
            withPesos={false}
            value={allowViewDetailedAccumulatedLog ? totalWorked : overallHoursWorked}
          />
        </Typography.Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell align="center">
        <Typography.Text
          strong={totalHoursRegularOvertime > 0}
          type={totalHoursRegularOvertime > 0 && 'success'}
        >
          <NumeralFormatter
            format={'0,0.[0000]'}
            withPesos={false}
            value={
              allowViewDetailedAccumulatedLog ? totalHoursRegularOvertime : overallHoursOvertime
            }
          />
        </Typography.Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell align="center">
        <Typography.Text
          strong={totalHoursWorkedNSD > 0}
          type={totalHoursWorkedNSD > 0 && 'success'}
        >
          <NumeralFormatter
            format={'0,0.[0000]'}
            withPesos={false}
            value={allowViewDetailedAccumulatedLog ? totalHoursWorkedNSD : overallHoursNSD}
          />
        </Typography.Text>
      </Table.Summary.Cell>
      {/*============================================Work Day===========================================*/}
      {allowViewDetailedAccumulatedLog && (
        <>
          <Table.Summary.Cell align="center">
            <Typography.Text strong={totalWorkedOIC > 0} type={totalWorkedOIC > 0 && 'success'}>
              <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={totalWorkedOIC} />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularOICOvertime > 0}
              type={totalHoursRegularOICOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularOICOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursWorkedOICNSD > 0}
              type={totalHoursWorkedOICNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursWorkedOICNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*==========================================Work Day OIC=========================================*/}
          {/*============================================Rest Day===========================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRestDay > 0}
              type={totalHoursRestDay > 0 && 'success'}
            >
              <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={totalHoursRestDay} />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRestOvertime > 0}
              type={totalHoursRestOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRestOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRestDayNSD > 0}
              type={totalHoursRestDayNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRestDayNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*============================================Rest Day===========================================*/}
          {/*=========================================Special Holiday=======================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHoliday > 0}
              type={totalHoursSpecialHoliday > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursSpecialHoliday}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayOvertime > 0}
              type={totalHoursSpecialHolidayOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursSpecialHolidayOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayNSD > 0}
              type={totalHoursSpecialHolidayNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                value={totalHoursSpecialHolidayNSD}
                withPesos={false}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*=========================================Special Holiday=======================================*/}
          {/*=======================================Special Holiday OIC=====================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayOIC > 0}
              type={totalHoursSpecialHolidayOIC > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursSpecialHolidayOIC}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayOICOvertime > 0}
              type={totalHoursSpecialHolidayOICOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursSpecialHolidayOICOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayOICNSD > 0}
              type={totalHoursSpecialHolidayOICNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                value={totalHoursSpecialHolidayOICNSD}
                withPesos={false}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*=======================================Special Holiday OIC=====================================*/}
          {/*==================================Special Holiday And Rest Day=================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayAndRestDay > 0}
              type={totalHoursSpecialHolidayAndRestDay > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursSpecialHolidayAndRestDay}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayAndRestDayOvertime > 0}
              type={totalHoursSpecialHolidayAndRestDayOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursSpecialHolidayAndRestDayOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursSpecialHolidayAndRestDayNSD > 0}
              type={totalHoursSpecialHolidayAndRestDayNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursSpecialHolidayAndRestDayNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*==================================Special Holiday And Rest Day=================================*/}
          {/*========================================Regular Holiday========================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHoliday > 0}
              type={totalHoursRegularHoliday > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHoliday}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayOvertime > 0}
              type={totalHoursRegularHolidayOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayNSD > 0}
              type={totalHoursRegularHolidayNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*========================================Regular Holiday========================================*/}
          {/*======================================Regular Holiday OIC======================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayOIC > 0}
              type={totalHoursRegularHolidayOIC > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayOIC}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayOICOvertime > 0}
              type={totalHoursRegularHolidayOICOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayOICOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayOICNSD > 0}
              type={totalHoursRegularHolidayOICNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayOICNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*======================================Regular Holiday OIC======================================*/}
          {/*==================================Regular Holiday And Rest Day=================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayAndRestDay > 0}
              type={totalHoursRegularHolidayAndRestDay > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayAndRestDay}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayAndRestDayOvertime > 0}
              type={totalHoursRegularHolidayAndRestDayOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayAndRestDayOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursRegularHolidayAndRestDayNSD > 0}
              type={totalHoursRegularHolidayAndRestDayNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursRegularHolidayAndRestDayNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*==================================Regular Holiday And Rest Day=================================*/}
          {/*=========================================Double Holiday========================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHoliday > 0}
              type={totalHoursDoubleHoliday > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHoliday}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayOvertime > 0}
              type={totalHoursDoubleHolidayOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayNSD > 0}
              type={totalHoursDoubleHolidayNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*=========================================Double Holiday========================================*/}
          {/*=======================================Double Holiday OIC======================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayOIC > 0}
              type={totalHoursDoubleHolidayOIC > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayOIC}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayOICOvertime > 0}
              type={totalHoursDoubleHolidayOICOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayOICOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayOICNSD > 0}
              type={totalHoursDoubleHolidayOICNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayOICNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          {/*=======================================Double Holiday OIC======================================*/}
          {/*===================================Double Holiday And Rest Day=================================*/}
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayAndRestDay > 0}
              type={totalHoursDoubleHolidayAndRestDay > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayAndRestDay}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayAndRestDayOvertime > 0}
              type={totalHoursDoubleHolidayAndRestDayOvertime > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayAndRestDayOvertime}
              />
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="center">
            <Typography.Text
              strong={totalHoursDoubleHolidayAndRestDayNSD > 0}
              type={totalHoursDoubleHolidayAndRestDayNSD > 0 && 'success'}
            >
              <NumeralFormatter
                format={'0,0.[0000]'}
                withPesos={false}
                value={totalHoursDoubleHolidayAndRestDayNSD}
              />
            </Typography.Text>
          </Table.Summary.Cell>
        </>
      )}
      {/*==========================================Work Day OIC=========================================*/}
      {/*===================================Double Holiday And Rest Day=================================*/}
    </Table.Summary.Row>
  );
};

export default AccumulatedLogsSummary;
