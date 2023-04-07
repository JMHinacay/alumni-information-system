import Head from 'next/head';

import { TimekeepingForm } from '@components/commons';

function CreateTimekeeping() {
  return (
    <div>
      <Head>
        <title>Create Timekeeping</title>
      </Head>
      <TimekeepingForm
        isCreateTimekeeping={true}
        isEditEmployee={false}
        isDraftTimekeeping={false}
      />
    </div>
  );
}

export default CreateTimekeeping;
