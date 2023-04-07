import { Anchor, Badge, Row, Tag, Typography } from 'antd';
import React, { useMemo } from 'react';
import { CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { employeeRequestStatus } from '@utils/constants';
import { initialFilterValues, initialLeaveFilterState } from 'pages/transactions/leave';
import { HRButton } from '@components/commons';

const filterTitles = {
  dates: { title: 'Requested Date', color: 'green' },
  status: { title: 'Request Status', color: 'blue' },
  withPay: { title: 'With Pay', color: 'purple' },
  datesType: { title: 'Dates Type', color: 'geekblue' },
  department: { title: 'Department', color: 'gold' },
  approvals: { title: 'Approvals ', color: 'orange' },
  requestedBy: { title: 'Requested By', color: 'magenta' },
  hrApprovedBy: { title: 'HR Approved By', color: 'red' },
  revertedBy: { title: 'Reverted By', color: 'volcano' },
};

const sortOrder = [
  'dates',
  'status',
  'withPay',
  'datesType',
  'department',
  'requestedBy',
  'approvals',
  'hrApprovedBy',
  'revertedBy',
];
const LeaveFilterListRenderer = (props) => {
  const fontSize = 12;
  const tagPadding = 3;

  const tags = useMemo(() => {
    let formatedTags = Object.keys(props.filters)
      .sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b))
      .reduce((result, value) => {
        let currentValue = props.filters[value];
        if (Array.isArray(currentValue)) {
          const tags = currentValue.map((filter, index) => {
            return (
              <Tag
                visible={true}
                key={`${filterTitles[value].title}-${filter.label}`}
                onClose={() => onChangeFilter(value, index)}
                closable
                color={filterTitles[value].color}
                style={{ padding: tagPadding }}
                closeIcon={<CloseOutlined style={{ fontSize: 12 }} />}
              >
                <Typography.Text style={{ fontSize, color: 'inherit' }}>
                  <Typography.Text strong style={{ color: 'inherit' }}>
                    {filterTitles[value].title}:
                  </Typography.Text>{' '}
                  {filter.label}
                </Typography.Text>
              </Tag>
            );
          });
          return [...result, ...tags];
        } else if (currentValue !== null && currentValue !== undefined) {
          return [
            ...result,
            <Tag
              key={`${filterTitles[value].title}-${currentValue.label}`}
              visible={true}
              onClose={() => onChangeFilter(value)}
              closable
              color={filterTitles[value].color}
              style={{ padding: tagPadding }}
              closeIcon={<CloseOutlined style={{ fontSize: 12 }} />}
            >
              <Typography.Text style={{ fontSize, color: 'inherit' }}>
                <Typography.Text strong style={{ color: 'inherit' }}>
                  {filterTitles[value].title}:
                </Typography.Text>{' '}
                {currentValue.label}
              </Typography.Text>
            </Tag>,
          ];
        }
        return result;
      }, []);

    return formatedTags;
  }, [props.filters]);

  const onChangeFilter = (property, index) => {
    let newFilterState = { ...props.filterState };
    let newFilterValues = { ...props.filters };

    if (property === 'dates') {
      newFilterState.dates = initialLeaveFilterState.dates;
      newFilterValues.dates = initialFilterValues.dates;
    } else if (Array.isArray(newFilterValues[property])) {
      let filterStateArray = [...newFilterState[property]];
      let filterValuesArray = [...newFilterValues[property]];

      filterStateArray.splice(index, 1);
      filterValuesArray.splice(index, 1);

      newFilterState[property] = [...filterStateArray];
      newFilterValues[property] = [...filterValuesArray];
    } else {
      newFilterState[property] = null;
      newFilterValues[property] = null;
    }
    console.log(newFilterState, newFilterValues);

    props.setFilterState(newFilterState);
    props.setFilterValues(newFilterValues);
  };

  const onResetToDefaultFilters = () => {
    props.setFilterState(initialLeaveFilterState);
    props.setFilterValues(initialFilterValues);
  };

  return (
    <div style={{ paddingBottom: 10, paddingTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={4}>Filters ({tags.length})</Typography.Title>
        <Badge count={tags.length} key="filter">
          <HRButton
            type="primary"
            ghost
            icon={<FilterOutlined />}
            onClick={() => props.handleFilterDrawer(true)}
          >
            View Filters
          </HRButton>
        </Badge>
      </div>
      <Row gutter={[6, 6]} style={{ marginTop: 10 }}>
        {tags}
        {tags.length > 0 &&
          !(tags.length === 1 && tags[0].label !== employeeRequestStatus.PENDING) && (
            <Tag
              visible={true}
              closable
              style={{ padding: tagPadding, cursor: 'pointer' }}
              closeIcon={<CloseOutlined style={{ fontSize: 12 }} />}
              onClick={onResetToDefaultFilters}
            >
              <Typography.Text style={{ fontSize, color: 'inherit' }}>
                <Typography.Text strong style={{ color: 'inherit' }}>
                  Reset to Default
                </Typography.Text>
              </Typography.Text>
            </Tag>
          )}
      </Row>
    </div>
  );
};

export default LeaveFilterListRenderer;
