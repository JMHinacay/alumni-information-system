import LeaveForm from '@components/pages/transactions/leave/LeaveForm';
import React from 'react';
import Head from 'next/head';
import { HRPageHeader } from '@components/commons';
import { useRouter } from 'next/router';
import { employeeRequestStatus } from '@utils/constants';

export default function MyLeaveCreateLeavePage() {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Leave Requests</title>
      </Head>
      <HRPageHeader onBack={router.back} title="Create Leave Requests" />
      <LeaveForm
        status={employeeRequestStatus.DRAFT}
        requestedByUser
        id={router?.query?.id || null}
      />
    </div>
  );
}
