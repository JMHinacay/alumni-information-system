import React from 'react';
import { PageHeader } from 'antd';
import ComingSoon from 'components/ComingSoon';
import Head from 'next/head';

function sss() {
  return (
    <div>
      <Head>
        <title>Social Security System</title>
      </Head>
      <PageHeader title="Social Security System"></PageHeader>
      <ComingSoon />
    </div>
  );
}

export default sss;
