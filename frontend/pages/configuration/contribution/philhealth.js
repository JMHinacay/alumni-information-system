import React from 'react';
import { PageHeader } from 'antd';
import ComingSoon from 'components/ComingSoon';
import Head from 'next/head';

function philhealth() {
  return (
    <div>
      <Head>
        <title>PhilHealth</title>
      </Head>
      <PageHeader title="PhilHealth"></PageHeader>
      <ComingSoon />
    </div>
  );
}

export default philhealth;
