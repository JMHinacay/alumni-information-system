import { Col, List, Tooltip, Typography } from 'antd';
import { HRButton, HRDivider } from 'components/commons';
import { SyncOutlined } from '@ant-design/icons';
import HRListItem from './HRListItem';
import React from 'react';

const HRList = ({
  header,
  title,
  onRefresh,
  onRefreshIcon,
  dataSource = [],
  headers = [],
  titleActions = [],
  renderItem,
  ...props
}) => {
  let finalDataSource = [];
  if (headers.length > 0) finalDataSource = ['header', ...dataSource];
  else finalDataSource = [...dataSource];

  const finalRenderRow = (item, index) => {
    if (headers.length > 0) {
      if (item === 'header') {
        return (
          <HRListItem style={{ fontWeight: 'bold' }}>
            {headers.map((item, i) => {
              let colProps = {};
              if (item?.span) colProps.span = item?.span;
              else colProps.flex = 1;
              return (
                <Col key={item?.text} {...colProps}>
                  {item?.text}
                </Col>
              );
            })}
          </HRListItem>
        );
      } else {
        return renderItem(item, index - 1);
      }
    } else return renderItem(item, index);
  };

  let finalTitleActions = [];
  if (titleActions.length > 0) finalTitleActions = [...finalTitleActions, ...titleActions];
  if (onRefresh)
    finalTitleActions = finalTitleActions.concat(
      <Tooltip title="Refresh">
        <HRButton
          shape="circle"
          size="small"
          type="primary"
          icon={onRefreshIcon ?? <SyncOutlined />}
          onClick={onRefresh}
        />
      </Tooltip>,
    );

  // console.log(finalTitleActions);

  const renderTitleActions = (actions) => {
    return actions.map((item, index, array) => {
      return (
        <React.Fragment key={item?.key}>
          {item}
          {array.length !== 1 && array.length !== index + 1 && <HRDivider type="vertical" />}
        </React.Fragment>
      );
    });
  };

  return (
    <List
      bordered
      {...props}
      header={
        header
          ? header
          : (title || onRefresh || titleActions.length > 0) && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: title ? 'space-between' : 'flex-end',
                  alignItems: 'center',
                }}
              >
                {title && (
                  <Typography.Text style={{ fontSize: 16 }} strong>
                    {title}
                  </Typography.Text>
                )}
                {finalTitleActions.length > 0 && <div>{renderTitleActions(finalTitleActions)}</div>}
              </div>
            )
      }
      dataSource={dataSource?.length === 0 ? [] : finalDataSource}
      renderItem={finalRenderRow}
    />
  );
};

export default HRList;
