import React from 'react';
import { PageHeader } from 'antd';
import ComingSoon from 'components/ComingSoon';
import Head from 'next/head';

function pagibig() {
  return (
    <div>
      <Head>
        <title>PagIbig</title>
      </Head>
      <PageHeader title="PagIbig"></PageHeader>
      <ComingSoon />
    </div>
  );
}

export default pagibig;
