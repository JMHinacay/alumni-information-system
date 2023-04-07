import LeaveForm from '@components/pages/transactions/leave/LeaveForm';
import React from 'react';
import Head from 'next/head';
import { HRPageHeader } from '@components/commons';
import { useRouter } from 'next/router';

export default function CreateLeavePage() {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Leave Requests</title>
      </Head>
      <HRPageHeader onBack={router.back} title="Create Leave Requests" />
      <LeaveForm />
    </div>
  );
}
