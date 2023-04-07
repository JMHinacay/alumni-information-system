import { HRTable } from '@components/commons';
import { List, PageHeader, Typography } from 'antd';
import React from 'react';

const EmployeeByDepartmentList = ({ dataSource, rowSelection, columns }) => {
  return (
    <List
      size="small"
      bordered={false}
      itemLayout={'vertical'}
      dataSource={dataSource}
      renderItem={(item) => (
        <>
          <List.Item>
            <PageHeader
              style={{ paddingTop: 10, padding: 0 }}
              title={<Typography.Title level={4}>{item.departmentName}</Typography.Title>}
            />
            <HRTable
              preserveSelectedRowKeys={true}
              size="small"
              style={{ marginTop: 5, marginBottom: 5 }}
              rowSelection={rowSelection}
              columns={columns}
              rowKey={(record) => record?.id}
              pagination={false}
              dataSource={item.data}
            />
          </List.Item>
        </>
      )}
    />
  );
};

function areEqual(prevProps, nextProps) {
  return (
    JSON.stringify(prevProps.dataSource) === JSON.stringify(nextProps.dataSource) &&
    JSON.stringify(prevProps.rowSelection) === JSON.stringify(nextProps.rowSelection) &&
    JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns)
  );
}
export default React.memo(EmployeeByDepartmentList, areEqual);
