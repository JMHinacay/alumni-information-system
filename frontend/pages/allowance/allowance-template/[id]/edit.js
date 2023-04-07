import Head from 'next/head';
import AllowanceTemplate from '@components/pages/allowance/AllowanceTemplate';

function EditAllowanceTemplate() {
  return (
    <div>
      <Head>
        <title>View Allowance Template</title>
      </Head>

      <AllowanceTemplate type="Edit" />
    </div>
  );
}

export default EditAllowanceTemplate;
