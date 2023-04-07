import MainLayout from '../components/mainlayout';
import React from 'react';
import { Alert } from 'antd';

const Forbidden = (props) => {
  return (
    <>
      <div>
        <Alert message="You are forbidden to access this page" type="error" />
      </div>

      <style jsx>{`
        .forbiddencontainer {
          margin-top: 10em;
        }
      `}</style>
    </>
  );
};

export default Forbidden;
