import React from 'react';
import { PageHeader } from 'antd';
import Head from 'next/head';
import ComingSoon from '@components/ComingSoon';

function AccountPage() {
  return (
    <div>
      <Head>
        <title>Account</title>
      </Head>
      {/* <PageHeader title="Payroll Processing"></PageHeader> */}
      <ComingSoon />
    </div>
  );
}

export default AccountPage;
