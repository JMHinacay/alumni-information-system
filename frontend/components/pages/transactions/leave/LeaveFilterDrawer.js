import { gql, useQuery } from '@apollo/client';
import { HRButton, HRSelect } from '@components/commons';
import { employeeRequestStatusColorGenerator } from '@utils/constantFormatters';
import {
  employeeRequestDatesTypeList,
  employeeRequestStatus,
  employeeRequestStatusList,
} from '@utils/constants';
import { Drawer, Row, Col, DatePicker, Spin, Tag } from 'antd';
import moment from 'moment';
import { initialFilterValues, initialLeaveFilterState } from 'pages/transactions/leave';
import React, { useEffect, useState } from 'react';

const statusList = employeeRequestStatusList.filter((s) => s.value !== employeeRequestStatus.DRAFT);

const EMPLOYEE_QUERY = gql`
  query($filter: String, $option: String, $department: UUID) {
    employees: getEmployeeActiveAndIncldInPayrollAndDeptExcldUser(
      filter: $filter
      option: $option
      department: $department
    ) {
      id
      value: id
      label: fullName
    }
  }
`;

const DEPARTMENT_QUERY = gql`
  {
    departments {
      id
      value: id
      label: departmentName
    }
  }
`;

const LeaveFilterDrawer = (props) => {
  const [filterState, setFilterState] = useState(initialLeaveFilterState);
  const [filterValues, setFilterValues] = useState(initialFilterValues);

  const { loading: loadingEmployeeQuery, data: employeeData } = useQuery(EMPLOYEE_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      option: null,
      filter: '',
    },
  });
  const { data: departmentData, loading: loadingDepartment } = useQuery(DEPARTMENT_QUERY);

  useEffect(() => {
    setFilterState(props.filterState);
    setFilterValues(props.filterValues);
  }, [props.filterState, props.filterValues, props.visible]);

  const tagRenderStatus = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={employeeRequestStatusColorGenerator(value)}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  const tagRenderWithPay = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    let colors = {
      true: 'green',
      false: 'red',
    };
    return (
      <Tag
        color={colors[value.toString()]}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  const tagRenderBlue = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={'blue'}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const handleDateChange = (datesValue) => {
    let value = null;
    if (datesValue) {
      if (datesValue[0] && datesValue[1]) {
        value = {
          label: `${moment(datesValue[0]).format('MMMM Do YYYY')}— ${moment(datesValue[1]).format(
            'MMMM Do YYYY',
          )}`,
          value: null,
        };
      }
    }
    handleChangeFilter('dates', datesValue, value);
  };

  const handleChangeFilter = (field, value, option) => {
    let newFilter = { ...filterState };
    newFilter[field] = value ?? null;
    let newFilterValues = { ...filterValues };
    newFilterValues[field] = option ?? null;

    setFilterValues(newFilterValues);
    setFilterState(newFilter);
  };

  const onClose = () => {
    setFilterState(props.filterState);
    setFilterValues(props.filterValues);
    handleModal(false, props.filterState, props.filterValues);
  };

  const handleReset = () => {
    setFilterValues(initialFilterValues);
    setFilterState(initialLeaveFilterState);
  };

  const { visible, handleModal } = props;
  return (
    <Drawer
      title={`Leave Filters`}
      placement="right"
      width="50%"
      onClose={onClose}
      visible={visible}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <HRButton onClick={onClose}>Cancel</HRButton>
        <HRButton type="primary" ghost style={{ marginLeft: 10 }} onClick={handleReset}>
          Reset Filters
        </HRButton>
        <HRButton
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={() => handleModal(false, filterState, filterValues)}
        >
          Submit
        </HRButton>
      </div>
      <Row gutter={[12, 6]}>
        <Col span={24}>
          {/* TODO: add error message for not completed date range */}
          <label>Request Date Range</label>
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            format="MMMM D, YYYY"
            onCalendarChange={handleDateChange}
            value={filterState.dates}
            allowClear
            allowEmpty
          />
        </Col>
        <Col span={24}>
          <HRSelect
            useNative
            options={statusList}
            label="Status"
            showArrow
            tagRender={tagRenderStatus}
            placeholder="Select status"
            allowClear={true}
            showSearch
            maxTagCount={'responsive'}
            name="status"
            value={filterState.status}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(v, o) => handleChangeFilter('status', v, o)}
            mode="multiple"
          />
        </Col>

        <Col span={24}>
          <HRSelect
            useNative
            value={filterState.withPay}
            name="withPay"
            label="With Pay"
            placeholder="Select with pay"
            options={[
              { label: 'YES', value: true },
              { label: 'NO', value: false },
            ]}
            onChange={(v, o) => handleChangeFilter('withPay', v, o)}
            mode="multiple"
            allowClear={true}
            tagRender={tagRenderWithPay}
          />
        </Col>
        <Col span={24}>
          <HRSelect
            useNative
            name="datesType"
            value={filterState.datesType}
            label="Request Date Type"
            placeholder="Select request date type."
            options={employeeRequestDatesTypeList}
            onChange={(v, o) => handleChangeFilter('datesType', v, o)}
            mode="multiple"
            allowClear={true}
            tagRender={tagRenderBlue}
          />
        </Col>
        <Col span={24}>
          <Spin spinning={loadingDepartment}>
            <HRSelect
              useNative
              showSearch
              value={filterState.department}
              placeholder={'Select Department'}
              options={departmentData?.departments || []}
              label="Search Department"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v, o) => handleChangeFilter('department', v, o)}
              allowClear={true}
            />
          </Spin>
        </Col>
        <Col span={24}>
          <Spin spinning={loadingEmployeeQuery}>
            <HRSelect
              name="requestedBy"
              showSearch
              allowClear
              value={filterState.requestedBy}
              label="Requested By"
              placeholder="Select requested by"
              options={employeeData?.employees}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v, o) => handleChangeFilter('requestedBy', v, o)}
            />
          </Spin>
        </Col>
        <Col span={24}>
          <Spin spinning={loadingEmployeeQuery}>
            <HRSelect
              useNative
              name="approvals"
              value={filterState.approvals}
              label="Approved By"
              showSearch
              allowClear
              placeholder="Select approved by"
              options={employeeData?.employees}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v, o) => handleChangeFilter('approvals', v, o)}
              mode="multiple"
              tagRender={tagRenderBlue}
            />
          </Spin>
        </Col>

        <Col span={24}>
          <Spin spinning={loadingEmployeeQuery}>
            <HRSelect
              name="hrApprovedBy"
              value={filterState.hrApprovedBy}
              showSearch
              allowClear
              label="HR Approved By"
              placeholder="Select HR approved by"
              options={employeeData?.employees}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v, o) => handleChangeFilter('hrApprovedBy', v, o)}
            />
          </Spin>
        </Col>
        <Col span={24}>
          <Spin spinning={loadingEmployeeQuery}>
            <HRSelect
              name="revertedBy"
              value={filterState.revertedBy}
              showSearch
              allowClear
              label="Reverted By"
              placeholder="Select reverted by"
              options={employeeData?.employees}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(v, o) => handleChangeFilter('revertedBy', v, o)}
            />
          </Spin>
        </Col>
      </Row>
    </Drawer>
  );
};

export default LeaveFilterDrawer;
