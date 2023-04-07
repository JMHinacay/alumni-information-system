import { HRButton, HRDivider, HRForm, HRPageHeader } from '@components/commons';
import EmployeeRequestLeaveApproval from '@components/pages/transactions/approvals/EmployeeRequestLeaveApproval';
import { Col, DatePicker, Row, Tabs } from 'antd';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const { TabPane } = Tabs;

function TransactionApprovalPage() {
  const methods = useForm();
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
      <HRPageHeader title="My Approvals" />

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
              Get Requests
            </HRButton>
          </Col>
        </Row>
      </HRForm>
      <HRDivider />
      <Tabs defaultActiveKey="leave" destroyInactiveTabPane>
        <TabPane tab="Leave" key="leave">
          <EmployeeRequestLeaveApproval dates={dates} />
        </TabPane>
        {/* <TabPane tab="Overtime" key="overtime">
          Content of Tab Pane
        </TabPane> */}
      </Tabs>
    </div>
  );
}

export default TransactionApprovalPage;
