import { HRButton } from 'components/commons';
import { List, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const HRListItem = ({
  item,
  handleEdit,
  handleDelete,
  itemKey,
  noAction,
  index,
  actions = [],
  ...props
}) => {
  let finalActions = [];
  if (handleEdit)
    finalActions.push(
      <Tooltip title="Edit" key="edit-button">
        <HRButton type="primary" shape="circle" icon={<EditOutlined />} onClick={handleEdit} />
      </Tooltip>,
    );
  if (handleDelete)
    finalActions.push(
      <Tooltip title="Delete" key="delete-button">
        <HRButton
          type="primary"
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        />
      </Tooltip>,
    );
  finalActions = [...finalActions, ...actions];
  return (
    <List.Item key={itemKey ?? index} actions={noAction ? [] : finalActions} {...props}>
      {props?.children}
    </List.Item>
  );
};

export default HRListItem;
