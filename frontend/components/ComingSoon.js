import { Result } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

const ComingSoon = (props) => {
  return (
    <div>
      <Result icon={<DashboardOutlined />} title={props.title ?? 'Coming Soon!'} />
    </div>
  );
};

export default ComingSoon;
