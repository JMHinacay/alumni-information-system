import React from 'react';
import { PageHeader } from 'antd';
import ComingSoon from 'components/ComingSoon';
import Head from 'next/head';

function job() {
  return (
    <div>
      <Head>
        <title>Job Type</title>
      </Head>
      <PageHeader title="Job Type"></PageHeader>
      <ComingSoon />
    </div>
  );
}

export default job;
