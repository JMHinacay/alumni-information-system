import React from 'react';
import Head from 'next/head';
import { HRPageHeader } from '@components/commons';
import { useRouter } from 'next/router';

function AssignRolesPermissionsPage() {
  const router = useRouter();
  // TODO: add implementation for assigning roles to one or more empmloyees
  return (
    <div style={{ margin: '20px 0' }}>
      <Head>
        <title>Assign Roles</title>
      </Head>
      <HRPageHeader title="Assign Roles" onBack={router.back} />
    </div>
  );
}

export default AssignRolesPermissionsPage;
