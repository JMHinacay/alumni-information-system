import React from 'react';
import Head from 'next/head';
import { HRPageHeader } from '@components/commons';
import LeaveForm from '@components/pages/transactions/leave/LeaveForm';
import { employeeRequestStatus } from '@utils/constants';
import { useRouter } from 'next/router';

function EditEmployeeLeaveRequest() {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>Edit Leave Requests</title>
      </Head>
      <HRPageHeader onBack={router.back} title="Edit Leave Requests" />
      <LeaveForm
        status={employeeRequestStatus.DRAFT}
        requestedByUser
        id={router?.query?.id || null}
      />
    </div>
  );
}

export default EditEmployeeLeaveRequest;
