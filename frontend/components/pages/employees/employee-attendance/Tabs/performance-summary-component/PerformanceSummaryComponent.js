import { HRDivider } from '@components/commons';
import { Col, Row, Spin, Statistic } from 'antd';
import Numeral from 'numeral';
import React from 'react';
import NightShiftDifferential from './NightShiftDifferential';
import OIC from './OIC';
import RegularAndOvertime from './RegularAndOvertime';
import Underperformances from './Underperformances';

export default function PerformanceSummaryComponent({ loading, performance, ...props }) {
  return (
    <Spin spinning={loading}>
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={12} xl={6}>
          <Statistic
            title="Total Working Hours"
            value={Numeral(performance?.totalWorkingHours || 0).format('0,0.[0000]')}
            suffix="Hr(s)"
          />
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Statistic
            title="Total Hours of Regular Work"
            value={Numeral(performance?.worked || 0).format('0,0.[0000]')}
            suffix="Hr(s)"
          />
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Statistic
            title="Total Hours of Underperformance"
            value={Numeral(
              performance?.late + performance?.undertime + performance?.hoursAbsent || 0,
            ).format('0,0.[0000]')}
            suffix="Hr(s)"
          />
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Statistic
            title="Total Hours of NSD"
            value={Numeral(performance?.hoursTotalNSD || 0).format('0,0.[0000]')}
            suffix="Hr(s)"
          />
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Statistic
            title="Total Overtime Count"
            value={Numeral(
              performance?.countOvertime +
                performance?.countRestOvertime +
                performance?.countSpecialHolidayOvertime +
                performance?.countSpecialHolidayAndRestDayOvertime +
                performance?.countRegularHolidayOvertime +
                performance?.countRegularHolidayAndRestDayOvertime +
                performance?.countDoubleHolidayOvertime +
                performance?.countDoubleHolidayAndRestDayOvertime || 0,
            ).format('0,00')}
          />
        </Col>
      </Row>

      <HRDivider />
      <Underperformances performance={performance || {}} />
      <RegularAndOvertime performance={performance || {}} />
      <OIC performance={performance || {}} />
      <NightShiftDifferential performance={performance || {}} />
    </Spin>
  );
}
