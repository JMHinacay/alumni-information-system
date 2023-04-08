import React from 'react';
import { PageHeader } from 'antd';
import Head from 'next/head';
import ComingSoon from '@components/ComingSoon';

function EventsPage() {
  return (
    <div>
      <Head>
        <title>Events</title>
      </Head>
      {/* <PageHeader title="Payroll Processing"></PageHeader> */}
      <ComingSoon />
    </div>
  );
}

export default EventsPage;
