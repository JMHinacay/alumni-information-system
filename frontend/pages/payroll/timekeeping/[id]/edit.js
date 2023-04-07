import Head from 'next/head';

import { TimekeepingForm } from '@components/commons';

function EditTimekeeping() {
  return (
    <div>
      <Head>
        <title>Edit Timekeeping</title>
      </Head>
      <TimekeepingForm
        isCreateTimekeeping={false}
        isEditEmployee={false}
        isDraftTimekeeping={true}
      />
    </div>
  );
}

export default EditTimekeeping;
