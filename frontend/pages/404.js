import React from 'react';
import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import MainLayout from '../components/mainlayout';

const PageNotFound = () => {
  const router = useRouter();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => {
            router.back();
          }}
        >
          Back To Previous Page
        </Button>
      }
    />
  );
};

export default PageNotFound;
