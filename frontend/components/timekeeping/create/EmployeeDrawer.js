import React, { useState } from 'react';
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
  Spin,
} from 'antd';
import { HRButton, HRForm, HRTable, HRDivider, HRSelect, HRInput } from '@components/commons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';

const columns = [
  {
    title: 'Full Name',
    dataIndex: 'id',
    render: (text, record) => <Card.Meta title={record.fullName} description={record.gender} />,
  },
];

const EmployeeDrawer = ({
  empDrawerVisibility,
  setEmpDrawerVisibility,
  selectedEmployeeByDept,
  updateSelectedEmployeesByDept,
  selectedId,
  setSelectedId,
}) => {
  const [selectedIdDrawer, setSelectedIdDrawer] = useState([]);
  const [selectedRowsDrawer, setSelectedRowsDrawer] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState('All');
  const onCloseDrawer = () => {
    setSelectedRowsDrawer([]);
    setSelectedIdDrawer([]);
    setEmpDrawerVisibility(false);
    setFilterDepartment('All');
  };
  const rowSelection = {
    onSelectAll: (selected, selectedRows, changeRows) => {
      const changeRowKeys = changeRows.map((item) => item.id);
      if (selected === true) {
        setSelectedIdDrawer(_.uniq([...changeRowKeys, ...selectedIdDrawer]));
      } else {
        setSelectedIdDrawer(_.remove(selectedIdDrawer, (id) => !changeRowKeys.includes(id)));
      }
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      if (selected === true) {
        setSelectedIdDrawer(_.uniq([...selectedIdDrawer, record.id]));
      } else {
        setSelectedIdDrawer(
          _.remove(selectedIdDrawer, (id) => {
            return id !== record.id;
          }),
        );
      }
    },
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedIdDrawer,
  };
  const confirmClear = (clear) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to clear ${
        clear === 'selected' ? 'all selected' : 'all'
      } employees?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        if (clear === 'selected') {
          let newSelectedId = selectedId.filter((item) => {
            return selectedIdDrawer.indexOf(item) < 0;
          });
          updateSelectedEmployeesByDept(newSelectedId);
          setSelectedIdDrawer([]);
          setSelectedId(newSelectedId);
        } else if (clear === 'all') {
          setSelectedRowsDrawer([]);
          setSelectedIdDrawer([]);
          updateSelectedEmployeesByDept([]);
          setSelectedId([]);
        }
        setFilterDepartment('All');
      },
    });
  };

  const checkFilter = () => {
    if (filterDepartment === 'All') return selectedEmployeeByDept;
    else {
      return selectedEmployeeByDept.filter((item) => item.department === filterDepartment);
    }
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
        extra={
          <div>
            <Button>Cancel</Button>
            <Button type="primary">Submit</Button>
          </div>
        }
      >
        <Affix offsetTop={56}>
          {/* "Clear Selected" and "Clear All" buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: 16,
              marginTop: -2,
              marginLeft: -24,
              marginRight: -24,
              backgroundColor: 'white',
              borderBottom: '1px solid #f0f0f0',
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

        <Row gutter={[12, 12]}>
          <Col md={24}>
            <HRSelect
              name="department"
              label="Department Filter"
              disabled={_.isEmpty(selectedEmployeeByDept)}
              value={filterDepartment}
              options={[
                { label: 'All', value: 'All' },
                ...selectedEmployeeByDept.map((item) => ({
                  value: item.department,
                  label: item.departmentName,
                })),
              ]}
              onChange={(value) => {
                setFilterDepartment(value);
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col md={24}>
            <div>
              <List
                size="small"
                bordered={false}
                itemLayout={'vertical'}
                dataSource={checkFilter()}
                renderItem={(item) => (
                  <>
                    <List.Item>
                      <PageHeader
                        style={{ paddingTop: 10, padding: 0 }}
                        title={<Typography.Title level={4}>{item.departmentName}</Typography.Title>}
                      ></PageHeader>
                      <HRTable
                        preserveSelectedRowKeys={true}
                        size="small"
                        style={{ marginTop: 5, marginBottom: 5 }}
                        rowSelection={{
                          type: 'checkbox',
                          ...rowSelection,
                        }}
                        columns={columns}
                        rowKey={(record) => record?.id}
                        pagination={false}
                        dataSource={item.data}
                        scroll={{ y: 400 }}
                      />
                    </List.Item>
                  </>
                )}
              />
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default EmployeeDrawer;
