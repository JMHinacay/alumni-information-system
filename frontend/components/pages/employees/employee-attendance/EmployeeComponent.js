import { Typography } from 'antd';

const EmployeeComponent = ({ fullName, departmentName }) => {
  return (
    <>
      <Typography.Title level={4}>
        Employee: {fullName}
        <br />
        Department: {departmentName}
      </Typography.Title>
    </>
  );
};

export default EmployeeComponent;
