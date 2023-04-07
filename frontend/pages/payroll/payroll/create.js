import Head from 'next/head';

import { PayrollForm } from '@components/commons';

function CreatePayroll() {
  return (
    <div>
      <Head>
        <title>Create Payroll</title>
      </Head>
      <PayrollForm isCreatePayroll={true} isEditEmployee={false} isDraftPayroll={false} />
    </div>
  );
}

export default CreatePayroll;
