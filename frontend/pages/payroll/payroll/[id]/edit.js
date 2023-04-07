import Head from 'next/head';

import { PayrollForm } from '@components/commons';

function EditPayroll() {
  return (
    <div>
      <Head>
        <title>Edit Payroll</title>
      </Head>
      <PayrollForm isCreatePayroll={false} isEditEmployee={false} isDraftPayroll={true} />
    </div>
  );
}

export default EditPayroll;
