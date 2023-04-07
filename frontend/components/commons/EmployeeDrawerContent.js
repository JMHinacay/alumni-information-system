import React, { useMemo, useState } from 'react';
import {
  Drawer,
  Button,
  List,
  Row,
  Col,
  Affix,
  Typography,
  Card,
  Modal,
  PageHeader,
  Input,
  Select,
} from 'antd';
import {
  HRButton,
  HRForm,
  HRTable,
  HRDivider,
  HRSelect,
  HRInput,
  EmployeeByDepartmentList,
} from '@components/commons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import _, { set } from 'lodash';
import { dummyEmployeeLogs } from '@utils/dummyDataConstants';

const EmployeeDrawerContent = ({
  drawerUsage,
  selectedIdDrawer,
  confirmClear,
  selectedEmployeeByDept,
  onChangeFilter,
  filterState,
  setFilterState,
  filteredEmployees,
  filterEmployee,
  rowSelection,
  columns,
}) => {
  return (
    <>
      {drawerUsage === 'create_timekeeping' ||
        (drawerUsage === 'edit_employee' && (
          <Affix offsetTop={56}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 16,
                marginTop: -2,
                marginLeft: -24,
                marginRight: -24,
                backgroundColor: 'white',
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <HRButton
                danger
                type="primary"
                disabled={_.isEmpty(selectedIdDrawer)}
                ghost
                block
                style={{ marginLeft: 10, marginRight: 10 }}
                onClick={() => {
                  confirmClear('selected');
                }}
              >
                Clear Selected
              </HRButton>
              <HRButton
                type="primary"
                disabled={_.isEmpty(selectedEmployeeByDept)}
                danger
                block
                style={{ marginLeft: 10, marginRight: 10 }}
                onClick={() => {
                  confirmClear('all');
                }}
              >
                Clear All
              </HRButton>
            </div>
          </Affix>
        ))}

      <Row gutter={[12, 12]}>
        <Col md={24}>
          <Input.Search
            style={{ paddingTop: 16, width: '100%' }}
            placeholder="Search Employees"
            onSearch={(value) => {
              if (filterEmployee) {
              } else onChangeFilter({ ...filterState, filter: value });
            }}
            onChange={(e) => {
              e.preventDefault;
              setFilterState({ ...filterState, filter: e.target.value });
            }}
            allowClear
            value={filterState.filter}
          />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col md={24}>
          <Select
            style={{ paddingTop: 10, width: '100%' }}
            name="department"
            placeholder="Search Department"
            showSearch
            value={filterState.department || []}
            onChange={(value) => {
              if (filterEmployee) {
              } else {
                onChangeFilter({ ...filterState, department: value });
              }
            }}
            disabled={_.isEmpty(selectedEmployeeByDept)}
            options={
              selectedEmployeeByDept?.map((item) => ({
                value: item.department,
                label: item.departmentName,
              })) || []
            }
            allowClear
          />
        </Col>
      </Row>

      <HRDivider />

      <Row>
        <Col md={24}>
          <div>
            <EmployeeByDepartmentList
              dataSource={filteredEmployees}
              rowSelection={rowSelection}
              columns={columns}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

function areEqual(prevProps, nextProps) {
  return (
    JSON.stringify(prevProps.drawerUsage) === JSON.stringify(nextProps.drawerUsage) &&
    JSON.stringify(prevProps.selectedIdDrawer) === JSON.stringify(nextProps.selectedIdDrawer) &&
    JSON.stringify(prevProps.selectedEmployeeByDept) ===
      JSON.stringify(nextProps.selectedEmployeeByDept) &&
    JSON.stringify(prevProps.filterState) === JSON.stringify(nextProps.filterState) &&
    JSON.stringify(prevProps.setFilterState) === JSON.stringify(nextProps.setFilterState) &&
    JSON.stringify(prevProps.filteredEmployees) === JSON.stringify(nextProps.filteredEmployees) &&
    JSON.stringify(prevProps.filterEmployee) === JSON.stringify(nextProps.filterEmployee) &&
    JSON.stringify(prevProps.rowSelection) === JSON.stringify(nextProps.rowSelection) &&
    JSON.stringify(prevProps.columns) === JSON.stringify(nextProps.columns) &&
    JSON.stringify(prevProps.dataSource) === JSON.stringify(nextProps.dataSource)
  );
}
export default React.memo(EmployeeDrawerContent, areEqual);
