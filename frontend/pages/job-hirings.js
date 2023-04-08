import React from 'react';
import { PageHeader } from 'antd';
import Head from 'next/head';
import ComingSoon from '@components/ComingSoon';

function JobHiringsPage() {
  return (
    <div>
      <Head>
        <title>Job Hirings</title>
      </Head>
      {/* <PageHeader title="Payroll Processing"></PageHeader> */}
      <ComingSoon />
    </div>
  );
}

export default JobHiringsPage;
