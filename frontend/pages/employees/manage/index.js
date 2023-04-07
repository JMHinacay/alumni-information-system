import { HRPageHeader } from '@components/commons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import EmployeeForm from '@components/pages/employees/manage/EmployeeForm';

const ManageEmployeePage = (props) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Create Employee</title>
      </Head>
      <HRPageHeader title="Create Employee" onBack={router.back} />
      <EmployeeForm />
    </>
  );
};

export default ManageEmployeePage;
