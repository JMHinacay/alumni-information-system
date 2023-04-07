import { Pagination } from 'antd';
import React from 'react';

function TopBottomPagination(props) {
  return (
    <>
      <Pagination {...props} style={{ margin: '20px 0' }} />
      {props.children}
      <Pagination {...props} style={{ margin: '20px 0' }} />
    </>
  );
}

export default TopBottomPagination;
