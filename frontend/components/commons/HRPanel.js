import { Collapse, Tooltip } from 'antd';
import { HRDivider } from 'components/commons';
import { CaretDownOutlined } from '@ant-design/icons';
import MomentFormatter from 'components/utils/MomentFormatter';

const Panel = Collapse.Panel;

const HRPanel = ({ title, tooltipTitle, ...props }) => {
  return (
    <Panel
      {...props}
      key={props.itemKey}
      showArrow={false}
      header={
        <HRDivider orientation="left">
          <Tooltip title={tooltipTitle ?? 'Click to Expand'}>
            <CaretDownOutlined
              size="small"
              style={{
                marginTop: 10,
                marginRight: 10,
                color: 'gray',
                transition: 'transform 0.3s',
                transform: !props.isActive && 'rotate(-90deg)',
              }}
            />
            <MomentFormatter value={title} format="MMMM Do YYYY, h:mm A" />
          </Tooltip>
        </HRDivider>
      }
    >
      {props.children}
    </Panel>
  );
};

export default HRPanel;
