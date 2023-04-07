import React from 'react';
import Head from 'next/head';
import { HRPageHeader } from '@components/commons';
import { useRouter } from 'next/router';

function AssignPermissionsPage() {
  const router = useRouter();
  // TODO: add implementation for assigning permissions to one or more empmloyees
  return (
    <div style={{ margin: '20px 0' }}>
      <Head>
        <title>Assign Permissions</title>
      </Head> 
      <HRPageHeader title="Assign Permissions" onBack={router.back} />
    </div>
  );
}

export default AssignPermissionsPage;
