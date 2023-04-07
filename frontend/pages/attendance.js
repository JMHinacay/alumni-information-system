import { Col, Input, Layout, message, Row, Spin, Tabs } from 'antd';
import React, { useState } from 'react';
import { HRDivider } from '@components/commons';

import styles from '@styles/header.module.css';
import EmployeeComponent from '@components/pages/employees/employee-attendance/EmployeeComponent';
import { gql, useLazyQuery } from '@apollo/react-hooks';
import AccumulatedLogsTab from '@components/pages/attendance/Tabs/accumulated-logs-v2';
import RawEmployeeLogs from '@components/pages/attendance/Tabs/raw-logs';
import PerformanceSummaryTab from '@components/pages/attendance/Tabs/performance-summary';
import { get } from '@shared/global';

const { Header, Content } = Layout;
const { Search } = Input;

const GET_EMPLOYEE_INFO = gql`
  query($id: String) {
    employee: searchEmployeeByEmployeeId(id: $id) {
      id
      fullName
      department {
        id
        name: departmentName
      }
    }
  }
`;

export default function AttendancePage() {
  const [currentTab, setCurrentTab] = useState('ACCUMULATED_LOG');

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  let searchEmployeeByEmployeeId = (id) => {
    setLoading(true);
    return get(`/hrm/getEmployeeByIdNumber?id=${id}`);
  };

  // const [getEmployee, { data, loading }] = useLazyQuery(GET_EMPLOYEE_INFO);

  const onSearch = async (id) => {
    try {
      let data = await searchEmployeeByEmployeeId(id);
      if (data) {
        setData({ employee: data });
        setLoading(false);
      } else message.error('Failed to get employee data');
    } catch (err) {
      message.error('Failed to get employee data');
    }
  };

  const onChangeTab = (key) => setCurrentTab(key);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={`${styles['header-transition']}`} style={{ backgroundColor: '#fff' }}>
        <span style={{ fontSize: '24px' }}>
          <b>HUMAN RESOURCE</b>
        </span>
      </Header>
      <Content
        style={{
          padding: 24,
          // height: window.innerHeight - 112 + 'px',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
      >
        <div style={{ backgroundColor: '#fff', padding: 24 }}>
          <Row justify="center" style={{ marginBottom: 10 }}>
            <Col lg={18}>
              <Search
                placeholder="Enter your Employee ID #"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
              />
            </Col>
          </Row>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 20 }}>
              <Spin size="large" />
            </div>
          )}
          {data && (
            <Tabs defaultActiveKey="accumulated-logs" activeKey={currentTab} onChange={onChangeTab}>
              <Tabs.TabPane tab="Accumulated Logs" key="ACCUMULATED_LOG">
                {loading ? (
                  <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <Spin size="large" spinning />
                  </div>
                ) : (
                  <>
                    <EmployeeComponent
                      fullName={data?.employee?.fullName}
                      departmentName={data?.employee?.department?.name}
                    />
                    <HRDivider />
                    <AccumulatedLogsTab employeeId={data?.employee?.id}  />
                  </>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Raw Logs" key="RAW_LOGS">
                {loading ? (
                  <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <Spin size="large" spinning />
                  </div>
                ) : (
                  <>
                    <EmployeeComponent
                      fullName={data?.employee?.fullName}
                      departmentName={data?.employee?.department?.name}
                    />
                    <HRDivider />
                    <RawEmployeeLogs employeeId={data?.employee?.id}  />
                  </>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Performance Summary" key="PERF_SUMMARY">
                {loading ? (
                  <div style={{ textAlign: 'center', marginTop: 30 }}>
                    <Spin size="large" spinning />
                  </div>
                ) : (
                  <>
                    <EmployeeComponent
                      fullName={data?.employee?.fullName}
                      departmentName={data?.employee?.department?.name}
                    />
                    <HRDivider />
                    <PerformanceSummaryTab employeeId={data?.employee?.id}  />
                  </>
                )}
              </Tabs.TabPane>
            </Tabs>
          )}
        </div>
      </Content>
    </Layout>
  );
}
