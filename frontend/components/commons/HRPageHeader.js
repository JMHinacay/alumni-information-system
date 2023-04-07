import React from 'react';
import { PageHeader, Row, Col } from 'antd';

export default function HRPageHeader(props) {
  return (
    <PageHeader style={{ padding: 0, paddingBottom: 20 }} {...props}>
      {props.children}
    </PageHeader>
  );
}
