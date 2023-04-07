import React, { useContext, useState } from 'react';
import { HRButton, HRDivider, HRList, HRListItem, HRTable } from '@components/commons';
import { Col, Row, Typography, Modal, message, Dropdown, Menu } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
import {
  REST_DAY_SCHEDULE_COLOR,
  REST_DAY_SCHEDULE_LABEL,
  REST_DAY_SCHEDULE_TITLE,
} from '@utils/constants';
import CopyDepartmentScheduleModal from './CopyDepartmentScheduleModal';
import DepartmentScheduleFormModal from './DepartmentScheduleFormModal';
import { AccountContext } from '@components/accessControl/AccountContext';
import useHasPermission from '@hooks/useHasPermission';
import MomentFormatter from '@components/utils/MomentFormatter';

const DELETE_DEPT_SCHED = gql`
  mutation($id: UUID) {
    data: deleteDepartmentSchedule(id: $id) {
      success
      message
    }
  }
`;

const CLEAR_DEPT_SCHED = gql`
  mutation($id: UUID) {
    data: clearSchedule(id: $id) {
      success
      message
    }
  }
`;

const DepartmentSchedule = ({ department = {}, ...props }) => {
  const accountContext = useContext(AccountContext);
  const [formModal, setFormModal] = useState(false);
  const [copyModal, setCopyModal] = useState(false);
  const [value, setValue] = useState({});
  const isAllowed = useHasPermission([
    'manage_dept_sched_config',
    'copy_dept_sched_config',
    'clear_department_schedule_config',
  ]);
  const allowedManageDeptSchedule = useHasPermission(['manage_dept_sched_config']);
  const allowedCopyDeptSched = useHasPermission(['copy_dept_sched_config']);
  const allowedClearDeptSched = useHasPermission(['clear_department_schedule_config']);

  const [deleteDepartmentSchedule, { loading: loadingDeleteSchedule }] = useMutation(
    DELETE_DEPT_SCHED,
    {
      onCompleted: (result) => {
        const data = result?.data || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully deleted department schedule config.');
          props?.refetch();
        } else message.error(data?.message ?? 'Failed to delete department schedule config.');
      },
    },
  );
  const [clearDepartmentSchedule, { loading: loadingClearDepartmentSchedule }] = useMutation(
    CLEAR_DEPT_SCHED,
    {
      onCompleted: (result) => {
        const data = result?.data || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully deleted department schedule config.');
          props?.refetch();
        } else message.error(data?.message ?? 'Failed to delete department schedule config.');
      },
    },
  );

  const handleFormModal = (selectedRow = {}, willRefetch) => {
    setValue({ ...selectedRow });
    if (willRefetch) props?.refetch();
    setFormModal(!formModal);
  };
  const handleCopyModal = (willRefetch) => {
    if (willRefetch) props?.refetch();
    setCopyModal(!copyModal);
  };

  const handleClearDepartmentSchedule = () => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to clear department schedule?',
      onOk: () =>
        clearDepartmentSchedule({
          variables: {
            id: department?.id,
          },
        }),
    });
  };

  const handleDeleteSchedule = (id) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this schedule?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => deleteDepartmentSchedule({ variables: { id } }),
    });
  };

  let columns = [
    {
      title: () => <Typography.Text strong>Title</Typography.Text>,
      dataIndex: 'title',
    },
    {
      title: () => <Typography.Text strong>Label</Typography.Text>,
      dataIndex: 'label',
    },
    {
      title: () => <Typography.Text strong>Time Start</Typography.Text>,
      dataIndex: 'dateTimeStartRaw',
      render: (value) => (value ? <MomentFormatter value={value} format={'hh:mm A'} /> : 'N/A'),
    },
    {
      title: () => <Typography.Text strong>Time End</Typography.Text>,
      dataIndex: 'dateTimeEndRaw',
      render: (value) => (value ? <MomentFormatter value={value} format={'hh:mm A'} /> : 'N/A'),
    },
    {
      title: () => <Typography.Text strong>Meal Break Start</Typography.Text>,
      dataIndex: 'mealBreakStart',
      render: (value) => (value ? <MomentFormatter value={value} format={'hh:mm A'} /> : 'N/A'),
    },
    {
      title: () => <Typography.Text strong>Meal Break End</Typography.Text>,
      dataIndex: 'mealBreakEnd',
      render: (value) => (value ? <MomentFormatter value={value} format={'hh:mm A'} /> : 'N/A'),
    },
    {
      title: () => <Typography.Text strong>Color</Typography.Text>,
      dataIndex: 'color',
      render: (value) =>
        value ? (
          <span
            style={{
              width: 25,
              height: 25,
              backgroundColor: value,
              display: 'inline-block',
              borderRadius: 25,
            }}
          />
        ) : (
          'N/A'
        ),
    },
  ];

  if (allowedManageDeptSchedule) {
    columns = columns.concat({
      title: 'Action',
      render: (text, item) => {
        return (
          item?.label !== REST_DAY_SCHEDULE_LABEL && (
            <span>
              <HRButton
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => handleFormModal(item)}
              />
              <HRDivider type="vertical" />
              <HRButton
                danger
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteSchedule(item?.id)}
              />
            </span>
          )
        );
      },
    });
  }

  const dept = department;
  let schedules = dept?.schedules || [];
  schedules = [
    {
      title: REST_DAY_SCHEDULE_TITLE,
      label: REST_DAY_SCHEDULE_LABEL,
      color: REST_DAY_SCHEDULE_COLOR,
    },
    ...schedules,
  ];

  return (
    <span key={dept?.id}>
      <HRDivider>{dept?.departmentName}</HRDivider>
      <HRTable
        bordered
        title={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
            <Typography.Text strong style={{ fontSize: '16px' }}>
              Department Schedule
            </Typography.Text>
            <div style={{ padding: '0 20px' }}>
              {isAllowed && [
                <Dropdown
                  key="options"
                  trigger={['click']}
                  overlay={
                    <Menu>
                      {allowedManageDeptSchedule && (
                        <Menu.Item onClick={() => handleFormModal({ department: dept?.id })}>
                          Create Schedule
                        </Menu.Item>
                      )}
                      {allowedCopyDeptSched && (
                        <Menu.Item onClick={() => handleCopyModal(false)}>Copy Schedule</Menu.Item>
                      )}
                      {allowedClearDeptSched && (
                        <Menu.Item danger onClick={handleClearDepartmentSchedule}>
                          Clear Schedule
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                  placement="bottomRight"
                >
                  <HRButton shape="circle" icon={<MoreOutlined />} />
                </Dropdown>,
              ]}
            </div>
          </div>
        )}
        size={'small'}
        columns={columns}
        dataSource={schedules || []}
        pagination={false}
        rowKey={(row) => row.id}
      />
      <DepartmentScheduleFormModal
        visible={formModal}
        handleModal={handleFormModal}
        department={department?.id}
        value={value}
      />
      <CopyDepartmentScheduleModal
        visible={copyModal}
        handleModal={handleCopyModal}
        department={department?.id}
      />
    </span>
  );
};

// export default DepartmentSchedule;
export default React.memo(DepartmentSchedule, (prevProps, props) => {
  let department = JSON.stringify(props?.department);
  let prevDepartment = JSON.stringify(prevProps?.department);

  return department === prevDepartment;
});
