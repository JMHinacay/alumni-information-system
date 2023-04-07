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
  EmployeeDrawerContent,
} from '@components/commons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import _, { set } from 'lodash';
import { dummyEmployeeLogs } from '@utils/dummyDataConstants';

const columns = [
  {
    title: 'Full Name',
    dataIndex: 'id',
    render: (text, record) => <Card.Meta title={record.fullName} description={record.gender} />,
  },
];

const initialFilterState = {
  filter: '',
  department: null,
};
const filterEmployees = (filterState, selectedEmployeeByDept, drawerUsage) => {
  if (filterState.filter === '' && filterState.department == null) {
    return selectedEmployeeByDept;
  } else {
    let tempSelectedEmployeeByDept = selectedEmployeeByDept;

    tempSelectedEmployeeByDept = tempSelectedEmployeeByDept.map((item) => {
      return {
        department: item.department,
        departmentName: item.departmentName,
        data: item.data.filter((item) => {
          var lower = item.fullName.toLowerCase();
          return lower.includes(filterState.filter.toLowerCase());
        }),
      };
    });
    tempSelectedEmployeeByDept = tempSelectedEmployeeByDept.filter(
      (item) => item.data.length !== 0,
    );

    if (filterState.department)
      tempSelectedEmployeeByDept = tempSelectedEmployeeByDept.filter(
        (item) => item.department === filterState.department,
      );
    drawerUsage === 'create_timekeeping';
    return tempSelectedEmployeeByDept;
  }
};

const EmployeeDrawer = ({
  drawerUsage,
  empDrawerVisibility,
  setEmpDrawerVisibility,
  selectedEmployeeByDept,
  updateSelectedEmployeesByDept,
  selectedId,
  selectedRows,
  updateDisplayedEmployee,
  filterEmployee,
}) => {
  const [selectedIdDrawer, setSelectedIdDrawer] = useState([]);
  const [filterState, setFilterState] = useState(initialFilterState);
  const [departmentFilter, setDepartmentFilter] = useState(null);

  const filteredEmployees =
    useMemo(() => filterEmployees(filterState, selectedEmployeeByDept, drawerUsage), [
      filterState,
      selectedEmployeeByDept,
      drawerUsage,
    ]) || [];

  const onCloseDrawer = () => {
    drawerUsage === 'create_timekeeping' && setSelectedIdDrawer([]);
    setEmpDrawerVisibility(false);
    setFilterState(initialFilterState);
  };

  const rowSelection = {
    type: `${
      drawerUsage === 'create_timekeeping' || drawerUsage === 'edit_employee' ? `checkbox` : `radio`
    }`,
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (drawerUsage === 'create_timekeeping' || drawerUsage === 'edit_employee') {
        const changeRowKeys = changeRows.map((item) => item.id);
        if (selected === true) {
          setSelectedIdDrawer(_.uniq([...changeRowKeys, ...selectedIdDrawer]));
        } else {
          setSelectedIdDrawer(_.remove(selectedIdDrawer, (id) => !changeRowKeys.includes(id)));
        }
      }
    },
    onSelect:
      drawerUsage === 'create_timekeeping' || drawerUsage === 'edit_employee'
        ? (record, selected, selectedRows, nativeEvent) => {
            if (selected === true) {
              setSelectedIdDrawer(_.uniq([...selectedIdDrawer, record.id]));
            } else {
              setSelectedIdDrawer(
                _.remove(selectedIdDrawer, (id) => {
                  return id !== record.id;
                }),
              );
            }
          }
        : null,
    onChange:
      drawerUsage === 'view_timekeeping'
        ? (selectedRowKeys, selectedRows) => {
            updateDisplayedEmployee(selectedRows[0]);
            setSelectedIdDrawer(selectedRowKeys);
          }
        : null,
    preserveSelectedRowKeys:
      drawerUsage === 'create_timekeeping' || drawerUsage === 'edit_employee' ? true : false,
    selectedRowKeys: selectedIdDrawer,
  };

  const confirmClear = (clear) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to clear ${
        clear === 'selected' ? 'all selected' : 'all'
      } employees? Any changes made will be lost upon saving the  timekeeping.`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        if (clear === 'selected') {
          let newSelectedId = selectedId.filter((item) => {
            return selectedIdDrawer.indexOf(item) < 0;
          });
          let tempSelectedRows = selectedRows.filter((item) => {
            return selectedIdDrawer.indexOf(item.id) < 0;
          });
          updateSelectedEmployeesByDept(newSelectedId, tempSelectedRows);
        } else if (clear === 'all') {
          updateSelectedEmployeesByDept([], []), 'clear_all';
        }
        setSelectedIdDrawer([]);
      },
    });
  };

  const onChangeFilter = (newFilterValue) => {
    setFilterState(newFilterValue);
  };

  return (
    <>
      <Drawer
        title="Selected Employees"
        placement="right"
        width={720}
        bodyStyle={{ paddingTop: 0 }}
        onClose={onCloseDrawer}
        visible={empDrawerVisibility}
        getContainer={false}
      >
        <EmployeeDrawerContent
          drawerUsage={drawerUsage}
          selectedIdDrawer={selectedIdDrawer}
          confirmClear={confirmClear}
          selectedEmployeeByDept={selectedEmployeeByDept}
          onChangeFilter={onChangeFilter}
          filterState={filterState}
          setFilterState={setFilterState}
          filteredEmployees={filteredEmployees}
          filterEmployee={filterEmployee}
          rowSelection={rowSelection}
          columns={columns}
        />
      </Drawer>
    </>
  );
};

export default EmployeeDrawer;
