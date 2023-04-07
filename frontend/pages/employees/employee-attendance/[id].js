import { HRDivider, EmployeeComponent } from '@components/commons';
import { Spin, Tabs } from 'antd';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/react-hooks';
import Head from 'next/head';

import AccumulatedLogsTabV2 from '@components/pages/employees/employee-attendance/Tabs/accumulated-logs-v2';
import RawEmployeeLogs from '@components/pages/employees/employee-attendance/Tabs/raw-logs';
import PerformanceSummaryTab from '@components/pages/employees/employee-attendance/Tabs/performance-summary';

const GET_EMPLOYEE_INFO = gql`
  query($id: UUID) {
    employee(id: $id) {
      id
      fullName
      department {
        id
        name: departmentName
      }
    }
  }
`;

const ViewEmployeeAttendanceLogsPage = (props) => {
  const router = useRouter();
  const { data, loading } = useQuery(GET_EMPLOYEE_INFO, {
    variables: {
      id: router?.query?.id || null,
    },
  });

  const onChangeTab = (activeKey) => {
    router.push(
      `/employees/employee-attendance/${router?.query?.id}/?activeTab=${activeKey}`,
      `/employees/employee-attendance/${router?.query?.id}/?activeTab=${activeKey}`,
      { shallow: true },
    );
  };

  return (
    <>
      <Head>
        <title>Employee Attendance</title>
      </Head>
      <Tabs
        defaultActiveKey="accumulated-logs"
        activeKey={router?.query?.activeTab}
        onChange={onChangeTab}
      >
        {/* <Tabs.TabPane tab="Accumulated Logs" key="accumulated-logs">
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
              <AccumulatedLogsTab />
            </>
          )}
        </Tabs.TabPane> */}
        <Tabs.TabPane tab="Accumulated Logs" key="accumulated-logs">
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
              <AccumulatedLogsTabV2 />
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Raw Logs" key="raw-logs">
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
              <RawEmployeeLogs />
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Performance Summary" key="performance-summary">
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
              <PerformanceSummaryTab />
            </>
          )}
        </Tabs.TabPane>
      </Tabs>
      {/* <HRPageHeader title="View Employee Attendance Logs" onBack={() => router.back()} /> */}
    </>
  );
};

export default ViewEmployeeAttendanceLogsPage;
