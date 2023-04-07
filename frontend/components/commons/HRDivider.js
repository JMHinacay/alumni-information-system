import { Divider } from 'antd';

export default function HRDivider(props) {
  return (
    <Divider orientation="left" style={{ fontSize: 18, fontWeight: 'bold' }} {...props}>
      {props.children}
    </Divider>
  );
}
