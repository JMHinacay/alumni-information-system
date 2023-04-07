import NumeralFormatter from '@components/utils/NumeralFormatter';
import useHasPermission from '@hooks/useHasPermission';
import { Card, Col, Row, Typography } from 'antd';
import { useMemo } from 'react';

const OIC = ({ performance, ...props }) => {
  const calculateTotalHours = () => {
    return (
      performance?.workedOIC +
      performance?.hoursSpecialHolidayOIC +
      performance?.hoursRegularHolidayOIC +
      performance?.hoursDoubleHolidayOIC
    );
  };
  const calculateOvertimeHours = () => {
    return (
      performance?.hoursRegularOICOvertime +
      performance?.hoursSpecialHolidayOICOvertime +
      performance?.hoursRegularHolidayOICOvertime +
      performance?.hoursDoubleHolidayOICOvertime
    );
  };
  const calculateTotalCount = () => {
    return (
      performance?.countWorkedOIC +
      performance?.countSpecialHolidayOIC +
      performance?.countRegularHolidayOIC +
      performance?.countDoubleHolidayOIC
    );
  };
  const calculateOvertimeCount = () => {
    return (
      performance?.countOICOvertime +
      performance?.countSpecialHolidayOICOvertime +
      performance?.countRegularHolidayOICOvertime +
      performance?.countDoubleHolidayOICOvertime
    );
  };

  const allowedDetailsCount = useHasPermission(['view_detailed_perf_summary']);
  const totalHours = useMemo(calculateTotalHours, [allowedDetailsCount, performance]);
  const totalOvertimeHours = useMemo(calculateOvertimeHours, [allowedDetailsCount, performance]);
  const totalCount = useMemo(calculateTotalCount, [allowedDetailsCount, performance]);
  const totalOvertimeCount = useMemo(calculateOvertimeCount, [allowedDetailsCount, performance]);

  return (
    <Card title={<Typography.Title level={5}>OIC</Typography.Title>} style={{ marginBottom: 20 }}>
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
                  (allowedDetailsCount ? performance?.countWorkedOIC : totalCount) > 0 && 'success'
                }
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={allowedDetailsCount ? performance?.countWorkedOIC : totalCount}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text
                type={
                  (allowedDetailsCount ? performance?.countOICOvertime : totalOvertimeCount) > 0 &&
                  'success'
                }
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={allowedDetailsCount ? performance?.countOICOvertime : totalOvertimeCount}
                />
              </Typography.Text>

              {allowedDetailsCount && (
                <>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.countSpecialHolidayOIC > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countSpecialHolidayOIC}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countSpecialHolidayOICOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countSpecialHolidayOICOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.countRegularHolidayOIC > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRegularHolidayOIC}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countRegularHolidayOICOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countRegularHolidayOICOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.countDoubleHolidayOIC > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countDoubleHolidayOIC}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.countDoubleHolidayOICOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.countDoubleHolidayOICOvertime}
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
                type={(allowedDetailsCount ? performance?.workedOIC : totalHours) > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={allowedDetailsCount ? performance?.workedOIC : totalHours}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text
                type={
                  (allowedDetailsCount
                    ? performance?.hoursRegularOICOvertime
                    : totalOvertimeHours) > 0 && 'success'
                }
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={
                    allowedDetailsCount ? performance?.hoursRegularOICOvertime : totalOvertimeHours
                  }
                />
              </Typography.Text>
              {allowedDetailsCount && (
                <>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursSpecialHolidayOIC > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursSpecialHolidayOIC}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Special Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursSpecialHolidayOICOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursSpecialHolidayOICOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursRegularHolidayOIC > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRegularHolidayOIC}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Regular Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursRegularHolidayOICOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursRegularHolidayOICOvertime}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday:
                  </Typography.Text>
                  <Typography.Text type={performance?.hoursDoubleHolidayOIC > 0 && 'success'}>
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursDoubleHolidayOIC}
                    />
                  </Typography.Text>
                  <br />
                  <Typography.Text strong style={{ marginRight: 10 }}>
                    Double Holiday Overtime:
                  </Typography.Text>
                  <Typography.Text
                    type={performance?.hoursDoubleHolidayOICOvertime > 0 && 'success'}
                  >
                    <NumeralFormatter
                      withPesos={false}
                      format="0,0.[0000]"
                      value={performance?.hoursDoubleHolidayOICOvertime}
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

export default OIC;
