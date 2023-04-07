import Head from 'next/head';

import { PayrollForm } from '@components/commons';

function AddEmployee() {
  return (
    <div>
      <Head>
        <title>Add Employees</title>
      </Head>
      <PayrollForm isCreatePayroll={false} isEditEmployee={true} isDraftPayroll={false} />
    </div>
  );
}

export default AddEmployee;
