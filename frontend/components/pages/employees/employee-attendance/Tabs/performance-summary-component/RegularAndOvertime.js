import { useMemo } from 'react';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import useHasPermission from '@hooks/useHasPermission';
import { Card, Col, Row, Typography } from 'antd';

const RegularAndOvertime = ({ performance, ...props }) => {
  const calculateTotalHours = () => {
    return (
      performance?.worked +
      performance?.hoursRestDay +
      performance?.hoursSpecialHoliday +
      performance?.hoursSpecialHolidayAndRestDay +
      performance?.hoursRegularHoliday +
      performance?.hoursRegularHolidayAndRestDay +
      performance?.hoursDoubleHoliday +
      performance?.hoursDoubleHolidayAndRestDay
    );
  };
  const calculateOvertimeHours = () => {
    return (
      performance?.hoursRegularOvertime +
      performance?.hoursRestOvertime +
      performance?.hoursSpecialHolidayOvertime +
      performance?.hoursSpecialHolidayAndRestDayOvertime +
      performance?.hoursRegularHolidayOvertime +
      performance?.hoursRegularHolidayAndRestDayOvertime +
      performance?.hoursDoubleHolidayOvertime +
      performance?.hoursDoubleHolidayAndRestDayOvertime
    );
  };
  const calculateTotalCount = () => {
    return (
      performance?.countWorked +
      performance?.countRestDayWorked +
      performance?.countSpecialHoliday +
      performance?.countSpecialHolidayAndRestDay +
      performance?.countRegularHoliday +
      performance?.countRegularHolidayAndRestDay +
      performance?.countDoubleHoliday +
      performance?.countDoubleHolidayAndRestDay
    );
  };
  const calculateOvertimeCount = () => {
    return (
      performance?.countOvertime +
      performance?.countRestOvertime +
      performance?.countSpecialHolidayOvertime +
      performance?.countSpecialHolidayAndRestDayOvertime +
      performance?.countRegularHolidayOvertime +
      performance?.countRegularHolidayAndRestDayOvertime +
      performance?.countDoubleHolidayOvertime +
      performance?.countDoubleHolidayAndRestDayOvertime
    );
  };

  const allowedDetailsCount = useHasPermission(['view_detailed_perf_summary']);
  const totalHours = useMemo(calculateTotalHours, [allowedDetailsCount, performance]);
  const totalOvertimeHours = useMemo(calculateOvertimeHours, [allowedDetailsCount, performance]);
  const totalCount = useMemo(calculateTotalCount, [allowedDetailsCount, performance]);
  const totalOvertimeCount = useMemo(calculateOvertimeCount, [allowedDetailsCount, performance]);

  return (
    <Card
      title={<Typography.Title level={5}>Regular and Overtime</Typography.Title>}
      style={{ marginBottom: 20 }}
    >
      <Row>
        <Col xs={24} lg={24} xl={12}>
          <Typography.Title level={5}>Count</Typography.Title>
          <Row>
            <Col xs={24} lg={24} xl={12}>
              <Typography.Text strong style={{ marginRight: 10 }}>
                Work:
              </Typography.Text>
              <Typography.Text
                type={
                  (allowedDetailsCount ? performance?.countWorked : totalCount) > 0 && 'success'
                }
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={allowedDetailsCount ? performance?.countWorked : totalCount}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text
                type={
                  (allowedDetailsCount ? performance?.countOvertime : totalOvertimeCount) > 0 &&
                  'success'
                }
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={allowedDetailsCount ? performance?.countOvertime : totalOvertimeCount}
                />
              </Typography.Text>

              {allowedDetailsCount && (
                <>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Rest Day:
                  </Typography.Text>

                  <Typography.Text type={performance?.countRestDayWorked > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRestDayWorked}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.countRestOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRestOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.countSpecialHoliday > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countSpecialHoliday}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.countSpecialHolidayOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countSpecialHolidayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday and Rest Day:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countSpecialHolidayAndRestDay > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countSpecialHolidayAndRestDay}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday and Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countSpecialHolidayAndRestDayOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countSpecialHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.countRegularHoliday > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRegularHoliday}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.countRegularHolidayOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRegularHolidayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday and Rest Day:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countRegularHolidayAndRestDay > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRegularHolidayAndRestDay}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday and Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countRegularHolidayAndRestDayOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRegularHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.countDoubleHoliday > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countDoubleHoliday}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.countDoubleHolidayOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countDoubleHolidayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday and Rest Day:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countDoubleHolidayAndRestDay > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countDoubleHolidayAndRestDay}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday and Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countDoubleHolidayAndRestDayOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countDoubleHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                </>
              )}
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={24} xl={12}>
          <Typography.Title level={5}>Hours</Typography.Title>
          <Row>
            <Col xs={24} lg={24} xl={12}>
              <Typography.Text strong style={{ marginRight: 10 }}>
                Work:
              </Typography.Text>
              <Typography.Text
                type={(allowedDetailsCount ? performance?.worked : totalHours) > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={allowedDetailsCount ? performance?.worked : totalHours}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text
                type={
                  (allowedDetailsCount ? performance?.hoursRegularOvertime : totalOvertimeHours) >
                    0 && 'success'
                }
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={
                    allowedDetailsCount ? performance?.hoursRegularOvertime : totalOvertimeHours
                  }
                />
              </Typography.Text>
              {allowedDetailsCount && (
                <>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Rest Day:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursRestDay > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRestDay}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursRestOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRestOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursSpecialHoliday > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursSpecialHoliday}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursSpecialHolidayOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursSpecialHolidayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday and Rest Day:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursSpecialHolidayAndRestDay > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursSpecialHolidayAndRestDay}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday and Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursSpecialHolidayAndRestDayOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursSpecialHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursRegularHoliday > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRegularHoliday}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursRegularHolidayOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRegularHolidayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday and Rest Day:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursRegularHolidayAndRestDay > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRegularHolidayAndRestDay}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday and Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursRegularHolidayAndRestDayOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRegularHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursDoubleHoliday > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursDoubleHoliday}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursDoubleHolidayOvertime > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursDoubleHolidayOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday and Rest Day:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursDoubleHolidayAndRestDay > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursDoubleHolidayAndRestDay}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday and Rest Day Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursDoubleHolidayAndRestDayOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursDoubleHolidayAndRestDayOvertime}
                    />
                  </Typography.Text>
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default RegularAndOvertime;
