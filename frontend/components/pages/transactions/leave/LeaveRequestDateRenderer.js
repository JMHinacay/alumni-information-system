import { HRDivider, HRList, HRListItem, HRTable } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import { employeeRequestScheduleTypeFormatter } from '@utils/constantFormatters';
import { employeeRequestDatesType, employeeRequestScheduleType } from '@utils/constants';
import { Col, Row, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

export default function LeaveRequestDateRenderer({ type, dates = [], ...props }) {
  const [show, setShow] = useState(false);
  const computeLeaves = () => dates.filter((d) => d.scheduleType !== 'REST').length;

  const computeHalfLeaves = () => {
    let sum = 0;
    dates.map((d) => {
      console.log(d);
      if (d.scheduleType !== 'REST') sum += d.hours;
    }).length;
    return sum;
  };

  const computeRest = () =>
    dates.filter((d) => d.scheduleType === employeeRequestScheduleType.REST).length;

  const columns = [
    {
      title: <Typography.Text strong>Date</Typography.Text>,
      dataIndex: 'startDatetime',
      render: (_, item) => {
        return <MomentFormatter value={item.startDatetime} format="dddd, MMMM Do YYYY" />;
      },
    },
    {
      title: <Typography.Text strong>Hours</Typography.Text>,
      dataIndex: 'hours',
    },
    {
      title: <Typography.Text strong>Schedule Type</Typography.Text>,
      dataIndex: 'scheduleType',
    },
  ];

  if (type === employeeRequestDatesType.SINGLE)
    return (
      <Row gutter={[24, 24]}>
        <Col xxl={24}>
          <div>
            <Typography.Text strong>Date</Typography.Text>
          </div>
          <div>
            {dates[0] ? (
              <>
                <MomentFormatter value={dates[0]?.startDatetime} format="MMMM DD, YYYY" /> (
                {moment(dates[0].endDatetime).diff(moment(dates[0]?.startDatetime), 'hours')} hours)
              </>
            ) : (
              'N/A'
            )}
          </div>
        </Col>
      </Row>
    );
  if (type === employeeRequestDatesType.RANGE)
    return (
      <Row gutter={[24, 24]}>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
          <div>
            <Typography.Text strong>Start Date</Typography.Text>
          </div>
          <div>
            <MomentFormatter value={dates[0]?.startDatetime} format="MMMM DD, YYYY" />
          </div>
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
          <div>
            <Typography.Text strong>End Date</Typography.Text>
          </div>
          <div>
            <MomentFormatter
              value={dates[dates?.length - 1]?.startDatetime}
              format="MMMM DD, YYYY"
            />
          </div>
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
          <div>
            <Typography.Text strong>Number of Leaves</Typography.Text>
          </div>
          <div>
            {computeLeaves()} ({computeHalfLeaves()} total hours)
          </div>
        </Col>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
          <div>
            <Typography.Text strong>Number of Rest Days</Typography.Text>
          </div>
          <div>{computeRest()}</div>
        </Col>
        <Col span={24}>
          <HRTable
            pagination={false}
            dataSource={dates}
            columns={columns}
            rowKey={({ startDatetime }) => moment(startDatetime).format('MMMM DD, YYYY')}
          />
        </Col>
      </Row>
    );
  if (type === employeeRequestDatesType.MIXED || type === employeeRequestDatesType.RANGE)
    return (
      <Row gutter={[24, 24]}>
        <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
          <div>
            <Typography.Text strong>Number of Leaves</Typography.Text>
          </div>
          <div>{dates.length}</div>
        </Col>
        <Col span={24}>
          <HRTable
            pagination={false}
            dataSource={dates}
            columns={columns}
            rowKey={({ startDatetime }) => moment(startDatetime).format('MMMM DD, YYYY')}
          />
        </Col>
      </Row>
    );
  else return null;
}
