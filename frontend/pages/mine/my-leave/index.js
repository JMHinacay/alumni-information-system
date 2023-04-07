import { HRButton, HRDivider, HRForm, HRPageHeader } from '@components/commons';
import { Col, DatePicker, Row, Spin, Tabs } from 'antd';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState } from 'react';
import LeaveTab from '@components/pages/mine/my-leave/LeaveTabs';
import { employeeRequestStatus } from '@utils/constants';
import { Controller, useForm } from 'react-hook-form';
import AccessControl from '@components/accessControl/AccessControl';

const { TabPane } = Tabs;

function MyCornerLeavePage() {
  const methods = useForm();
  const router = useRouter();
  const [dates, setDates] = useState([null, null]);

  const handleSubmit = ({ dates }) => {
    if (Array.isArray(dates)) {
      if (dates.length === 2) {
        setDates(dates);
      }
    }
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  return (
    <div>
      <Head>
        <title>My Leaves</title>
      </Head>
      <HRPageHeader
        title="My Leave Requests"
        extra={[
          <HRButton type="primary" onClick={() => router.push('/mine/my-leave/create')}>
            Create Leave Request
          </HRButton>,
        ]}
      />
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Row type="flex" gutter={[12, 12]} align="bottom">
          <Col span={16}>
            <Row gutter={12}>
              <Col span={24}>
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
                        Date Requested
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
            </Row>
          </Col>
          <Col span={8}>
            <HRButton block type="primary" htmlType="submit">
              Get Leave Requests
            </HRButton>
          </Col>
        </Row>
      </HRForm>
      <HRDivider />
      <Tabs defaultActiveKey="drafts" destroyInactiveTabPane>
        <TabPane tab="Drafts" key="drafts">
          <LeaveTab status={[employeeRequestStatus.DRAFT]} dates={dates} />
        </TabPane>
        <TabPane tab="Pending Supervisor" key="pending-supervisor">
          <LeaveTab status={[employeeRequestStatus.PENDING_SUPERVISOR]} dates={dates} />
        </TabPane>
        <TabPane tab="Pending" key="pending">
          <LeaveTab status={[employeeRequestStatus.PENDING]} dates={dates} />
        </TabPane>
        <TabPane tab="Approved" key="approved">
          <LeaveTab status={[employeeRequestStatus.APPROVED]} dates={dates} />
        </TabPane>
        <TabPane tab="Rejects" key="rejects">
          <LeaveTab
            status={[employeeRequestStatus.REJECTED, employeeRequestStatus.REJECTED_SUPERVISOR]}
            dates={dates}
          />
        </TabPane>
        <TabPane tab="Reverted" key="reverted">
          <LeaveTab status={[employeeRequestStatus.REVERTED]} dates={dates} />
        </TabPane>
        <TabPane tab="Cancelled" key="cancelled">
          <LeaveTab status={[employeeRequestStatus.CANCELLED]} dates={dates} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default MyCornerLeavePage;
