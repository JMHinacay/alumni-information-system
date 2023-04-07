import { Collapse } from 'antd';

const HRCollapse = ({ defaultActiveKey, onChange, itemKey, ...props }) => {
  return (
    <Collapse
      {...props}
      defaultActiveKey={defaultActiveKey}
      onChange={onChange}
      ghost
    >
      {props.children}
    </Collapse>
  );
};

export default HRCollapse;
