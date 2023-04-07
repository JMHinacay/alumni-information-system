import React from 'react';
import { PageHeader, Tabs } from 'antd';
import Head from 'next/head';
import { HRTable } from '@components/commons';
import JobTitle from '@components/pages/configuration/employee-config/JobTitle';
import OtherPositions from '@components/pages/configuration/OtherPositions';
import LeaveScheduleTypes from '@components/pages/configuration/LeaveScheduleTypes';

const Configuration = () => {
  const { TabPane } = Tabs;
  return (
    <div>
      <Head>
        <title>Configuration</title>
      </Head>
      <PageHeader title="Configuration"></PageHeader>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Job Titles" key="1">
          <JobTitle />
        </TabPane>
        <TabPane tab="Other Positions" key="2">
          <OtherPositions />
        </TabPane>
        <TabPane tab="Leave Schedule Types" key="3">
          <LeaveScheduleTypes />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Configuration;
