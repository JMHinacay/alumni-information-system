import { HRPageHeader } from '@components/commons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import EmployeeForm from '@components/pages/employees/manage/EmployeeForm';

const ManageEmployeePage = (props) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Edit Employee</title>
      </Head>
      <HRPageHeader title="Edit Employee Information" onBack={router.back} />
      <EmployeeForm />
    </>
  );
};

export default ManageEmployeePage;
