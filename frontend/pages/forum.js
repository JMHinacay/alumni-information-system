import React from 'react';
import { PageHeader } from 'antd';
import Head from 'next/head';
import ComingSoon from '@components/ComingSoon';

function ForumPage() {
  return (
    <div>
      <Head>
        <title>Forum</title>
      </Head>
      {/* <PageHeader title="Payroll Processing"></PageHeader> */}
      <ComingSoon />
    </div>
  );
}

export default ForumPage;
