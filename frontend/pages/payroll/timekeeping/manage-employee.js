import Head from 'next/head';

import { TimekeepingForm } from '@components/commons';

function AddEmployee() {
  return (
    <div>
      <Head>
        <title>Add Employees</title>
      </Head>
      <TimekeepingForm isEditEmployee={true} isDraftTimekeeping={false} />
    </div>
  );
}

export default AddEmployee;
