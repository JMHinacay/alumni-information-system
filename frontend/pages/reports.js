import React from 'react';
import { PageHeader } from 'antd';
import Head from 'next/head';
import ComingSoon from '@components/ComingSoon';

function ReportsPage() {
  return (
    <div>
      <Head>
        <title>Reports</title>
      </Head>
      {/* <PageHeader title="Payroll Processing"></PageHeader> */}
      <ComingSoon />
    </div>
  );
}

export default ReportsPage;
