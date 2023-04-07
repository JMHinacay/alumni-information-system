import Head from 'next/head';
import AllowanceTemplate from '@components/pages/allowance/AllowanceTemplate';

function CreateAllowanceTemplate() {
  return (
    <div>
      <Head>
        <title>Allowance Template Page</title>
      </Head>

      <AllowanceTemplate type="Create" />
    </div>
  );
}

export default CreateAllowanceTemplate;
