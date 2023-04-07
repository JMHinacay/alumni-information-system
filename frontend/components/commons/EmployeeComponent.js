import { timekeepingStatusColorGenerator } from '@utils/constantFormatters';
import { Typography, Spin, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import HRButton from './HRButton';
import { LinkOutlined } from '@ant-design/icons';

const EmployeeComponent = ({ fullName, departmentName, loading, status, link, target }) => {
  const employeeProfileLink = (
    <Link href={link}>
      <a target={target}>
        <Tooltip placement="top" title="View Employee Profile">
          <HRButton icon={<LinkOutlined />} type="link" shape="circle" />
        </Tooltip>
      </a>
    </Link>
  );

  return (
    <>
      <Typography.Title level={4}>
        Employee: <Spin spinning={loading || false} size="small" />{' '}
        {!loading && (
          <>
            {fullName} {link && target ? employeeProfileLink : null}
          </>
        )}{' '}
        {status && <Tag color={timekeepingStatusColorGenerator(status)}>{status}</Tag>}
        <br />
        Department: <Spin spinning={loading || false} size="small" />
        {!loading && departmentName}
      </Typography.Title>
    </>
  );
};

export default EmployeeComponent;
