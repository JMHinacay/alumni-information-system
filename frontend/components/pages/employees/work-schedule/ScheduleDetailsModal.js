import { useState, useEffect, useRef } from 'react';
import { gql } from 'apollo-boost';
import { useRouter } from 'next/router';
import moment from 'moment';
import { Tabs } from 'antd';
import RawEmployeeLogs from '@components/pages/employees/employee-attendance/Tabs/raw-logs';

import {
  message,
  Spin,
  Typography,
  Modal,
  List,
  Tag,
  Row,
  Col,
  Tooltip,
  Dropdown,
  Menu,
} from 'antd';
import { LockOutlined, MoreOutlined } from '@ant-design/icons';

import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import useHasPermission from '@hooks/useHasPermission';
import EditScheduleModal from './EditScheduleModal';

import { HRButton, HRDivider, HRList, HRListItem, HRModal } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import MomentDifferenceFormatter from '@components/utils/MomentDifferenceFormatter';

const GET_EMPLOYEE_SCHED_DETAILS = gql`
  query($employee: UUID, $startDate: Instant, $endDate: Instant) {
    employee: getEmployeeScheduleDetails(
      employee: $employee
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      fullName
      department
      departmentName
      employeeSchedule
    }
    lockedDates: getScheduleLock(endDate: $endDate, startDate: $startDate)
  }
`;

const REMOVE_EMPLOYEE_SCHED_DETAILS = gql`
  mutation($id: UUID) {
    data: removeEmployeeSchedule(id: $id) {
      success
      message
    }
  }
`;

const SET_EMPLOYEE_SCHED = gql`
  mutation($id: UUID, $employee_id: UUID, $department: UUID, $fields: Map_String_ObjectScalar) {
    data: createEmployeeSchedule(
      id: $id
      employee_id: $employee_id
      department: $department
      fields: $fields
    ) {
      success
      message
    }
  }
`;
const { TabPane } = Tabs;

const ScheduleDetailsModal = (props) => {
  let { date, employee } = props?.selectedData || {};
  const [selectedData, setselectedData] = useState({
    useStaticDate: null,
    staticStartDate: null,
    staticEndDate: null,
  });
  const router = useRouter();
  const willRefetch = useRef(false);
  const [overtimeEdit, setOvertimeEdit] = useState({
    status: false,
    schedule: null,
    isOvertime: false,
  });
  const [
    getEmployeSchedDetails,
    {
      data: employeeSchedDetails,
      loading: loadingEmployeeSchedDetails,
      refetch: refetchEmployeeSchedDetails,
    },
  ] = useLazyQuery(GET_EMPLOYEE_SCHED_DETAILS, {
    variables: {
      employee: employee?.id || null,
      startDate: moment(date).startOf('day').utc().format(),
      endDate: moment(date).endOf('day').utc().format(),
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  const [removeSchedule, { loading: loadingRemoveSchedule }] = useMutation(
    REMOVE_EMPLOYEE_SCHED_DETAILS,
    {
      onCompleted: (data) => {
        data = data?.data || {};
        if (data?.success) {
          willRefetch.current = true;
          message.success(data?.message ?? 'Successfully removed employee schedule.');
          refetchEmployeeSchedDetails();
        } else message.error(data?.message ?? 'Failed to remove employeeSchedule.');
      },
    },
  );

  const [setEmployeeSched, { loading: loadingSetEmployeeSched }] = useMutation(SET_EMPLOYEE_SCHED, {
    onCompleted: (result) => {
      let { data } = result || {};
      if (data?.success) {
        willRefetch.current = true;
        message.success(data?.message ?? 'Successfully updated employee schedule.', 1.5);

        refetchEmployeeSchedDetails();
      } else {
        if (data?.message === 'Date is locked.') {
          willRefetch.current = true;
          refetchEmployeeSchedDetails();
        }
        message.error(data?.message ?? 'Failed to update employee schedule.');
      }
    },
  });

  useEffect(() => {
    if (props.visible) {
      let dateKey = props?.selectedData?.date.format('MM_DD_YYYY');
      let schedule = props?.selectedData?.employee?.employeeSchedule[dateKey];
      let startDate = moment(props?.selectedData?.date).startOf('day');
      let endDate = moment(props?.selectedData?.date).endOf('day');
      if (schedule?.isMultiDay) {
        startDate = moment(schedule?.dateTimeStartRaw).startOf('day');
        endDate = moment(schedule?.dateTimeEndRaw).endOf('day');
      }
      if (schedule) {
        getEmployeSchedDetails({
          variables: {
            employee: props?.selectedData?.employee?.id,
            startDate: startDate.utc().format(),
            endDate: endDate.utc().format(),
          },
        });
      } else getEmployeSchedDetails();
    } else {
      willRefetch.current = false;
      setOvertimeEdit({ status: false, schedule: null });
    }
    setselectedData({
      useStaticDate: true,
      staticStartDate: date,
      staticEndDate: date,
    });
  }, [props?.visible, props?.selectedData]);

  const allowManageOvertime = useHasPermission(['manage_ot_work_schedule']);
  const allowManageRestDay = useHasPermission(['manage_rest_day_work_schedule']);
  const allowManageOIC = useHasPermission(['manage_oic_work_schedule']);
  const allowManageCustom = useHasPermission(['add_custom_work_schedule']);
  const allowManageLockedDates = useHasPermission(['manage_locked_work_schedule']);
  const allowManageRestDayDuty = useHasPermission(['allow_user_to_manage_rest_day_duty_schedule']);

  const handleOvertimeEdit = (schedule, initiateRefetch, isOvertime) => {
    if (initiateRefetch) refetchEmployeeSchedDetails();
    if (!willRefetch.current && initiateRefetch) {
      willRefetch.current = initiateRefetch;
    }
    setOvertimeEdit({ schedule: { ...schedule }, status: !overtimeEdit.status, isOvertime });
  };

  const handleEdit = (item, isOvertime) => {
    handleOvertimeEdit(item, false, isOvertime);
  };

  const onCancelModal = () => {
    props.handleModal({}, willRefetch.current);
  };

  const handleAddOvertime = () => {
    setOvertimeEdit({ status: true, schedule: null, isOvertime: true });
  };

  const handleDeleteSchedule = (id) => {
    Modal.confirm({
      title: 'Are you sure you?',
      content: 'Are you sure you want to delete this schedule?',
      onOk: () =>
        removeSchedule({
          variables: {
            id,
          },
        }),
    });
  };

  const setWithRestAndWithNSDSchedule = (details, isRestDay, withNSD, withHoliday) => {
    let dateFormat = moment(date).format('MM_DD_YYYY');
    let oicSchedule = employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_OIC`];
    let leaveSchedule = employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_LEAVE`];
    if (oicSchedule) message.error('You are not allowed to add Rest Schedule with OIC Schedule.');
    else if (leaveSchedule && isRestDay)
      message.error('You are not allowed to add Rest Schedule with Leave Schedule.');
    else {
      let { id, employeeId, department, schedule } = details;
      let { department: assignedDepartment, departmentName, ...restSchedule } = schedule;
      setEmployeeSched({
        variables: {
          id,
          employee_id: employeeId,
          department,
          fields: {
            ...restSchedule,
            isRestDay,
            withNSD,
            withHoliday,
          },
        },
      });
    }
  };

  const isAllowedToManageRegularSchedule = (schedule) => {
    if (isLocked && !allowManageLockedDates) return false;
    let isAllowed = true;
    if (schedule.isRestDay) isAllowed = allowManageRestDay;
    if (schedule.isOIC) isAllowed = allowManageOIC;
    if (schedule.isCustom) isAllowed = allowManageCustom;
    return isAllowed;
  };

  const dateFormat = moment(date).format('MM_DD_YYYY');
  let schedule = [];

  if (employeeSchedDetails?.employee?.employeeSchedule[dateFormat])
    schedule = [employeeSchedDetails?.employee?.employeeSchedule[dateFormat]];

  if (employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_OIC`])
    schedule = [...schedule, employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_OIC`]];
  if (employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_REST`])
    schedule = [
      ...schedule,
      employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_REST`],
    ];
  if (employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_LEAVE`]) {
    schedule = [
      ...schedule,
      employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_LEAVE`],
    ];
  }
  if (employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_LEAVE_REST`]) {
    schedule = [
      ...schedule,
      employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_LEAVE_REST`],
    ];
  }

  let overtime =
    [
      ...(employeeSchedDetails?.employee?.employeeSchedule?.[dateFormat + '_OVERTIME'] || []),
      ...(employeeSchedDetails?.employee?.employeeSchedule?.[dateFormat + '_OVERTIME_OIC'] || []),
    ] || [];

  let regularSchedule = employeeSchedDetails?.employee?.employeeSchedule[dateFormat] || null;
  let isLocked = false;
  if (employeeSchedDetails?.lockedDates)
    isLocked = employeeSchedDetails?.lockedDates[dateFormat]?.isLocked;

  return (
    <>
      <HRModal
        visible={props?.visible}
        title="Employee Schedule Details"
        width="55%"
        onCancel={onCancelModal}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Details" key="1">
            <Spin
              spinning={
                loadingEmployeeSchedDetails || loadingRemoveSchedule || loadingSetEmployeeSched
              }
            >
              <Row>
                <Col span={18}>
                  <Typography.Title level={4}>
                    Date:{' '}
                    <MomentFormatter
                      value={
                        regularSchedule?.dateTimeStartRaw?.isMultiDay
                          ? regularSchedule?.dateTimeStartRaw
                          : date
                      }
                      format="dddd, MMMM D, YYYY"
                    />{' '}
                    <br />
                    Name: {employee?.fullName} <br />
                    Department: {employee?.departmentName} <br />
                  </Typography.Title>
                </Col>
                <Col span={6}>
                  {isLocked && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        flexDirection: 'column',
                      }}
                    >
                      <LockOutlined style={{ fontSize: 40 }} />
                      <Typography.Title level={3} style={{ margin: 0 }}>
                        Locked
                      </Typography.Title>
                    </div>
                  )}
                </Col>
              </Row>
              <HRDivider>Regular Schedule</HRDivider>
              <HRList
                title={null}
                dataSource={schedule || []}
                renderItem={(item) => {
                  let actions = [];
                  if (isAllowedToManageRegularSchedule(item) && !item?.isLeave) {
                    actions = [
                      <Tooltip title="More Options" key="more-button">
                        <Dropdown
                          placement="bottomRight"
                          overlay={
                            <Menu>
                              {!item?.isOIC && (
                                <Menu.Item
                                  key="with-rest-day"
                                  onClick={() =>
                                    setWithRestAndWithNSDSchedule(
                                      {
                                        id: item?.id,
                                        employeeId: employee?.id,
                                        department: item?.department,
                                        schedule: item,
                                      },
                                      !item.isRestDay,
                                      item.withNSD,
                                      item.withHoliday,
                                    )
                                  }
                                >
                                  {allowManageRestDayDuty && (
                                    <>{`${item?.isRestDay ? 'Without' : 'With'} Rest Day`}</>
                                  )}
                                </Menu.Item>
                              )}
                              <Menu.Item
                                key="with-nsd"
                                danger={item.withNSD}
                                onClick={() =>
                                  setWithRestAndWithNSDSchedule(
                                    {
                                      id: item?.id,
                                      employeeId: employee?.id,
                                      department: item?.department,
                                      schedule: item,
                                    },
                                    item.isRestDay,
                                    item.withNSD,
                                    !item.withHoliday,
                                  )
                                }
                              >
                                {`${item?.withHoliday ? 'Without' : 'With'} Holiday`}
                              </Menu.Item>
                              <Menu.Item
                                key="with-nsd"
                                danger={item.withNSD}
                                onClick={() =>
                                  setWithRestAndWithNSDSchedule(
                                    {
                                      id: item?.id,
                                      employeeId: employee?.id,
                                      department: item?.department,
                                      schedule: item,
                                    },
                                    item.isRestDay,
                                    !item.withNSD,
                                    item.withHoliday,
                                  )
                                }
                              >
                                {`${item?.withNSD ? 'Without' : 'With'} NSD`}
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={['click']}
                        >
                          <HRButton shape="circle" icon={<MoreOutlined />} />
                        </Dropdown>
                      </Tooltip>,
                    ];
                  } else if (item.isLeave) {
                    actions = [
                      <Tooltip title="More Options" key="more-button">
                        <Dropdown
                          placement="bottomRight"
                          overlay={
                            <Menu>
                              <Menu.Item
                                key="view-reques-details"
                                onClick={() =>
                                  router.push(`/transactions/leave/${item?.requestId}`)
                                }
                              >
                                View Request Detail
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={['click']}
                        >
                          <HRButton shape="circle" icon={<MoreOutlined />} />
                        </Dropdown>
                      </Tooltip>,
                    ];
                  }
                  return (
                    <HRListItem
                      handleDelete={
                        isAllowedToManageRegularSchedule(item) && !item.isLeave
                          ? () => handleDeleteSchedule(item?.id)
                          : null
                      }
                      handleEdit={
                        isAllowedToManageRegularSchedule(item) && !item.isLeave
                          ? () => handleEdit(item, false)
                          : null
                      }
                      actions={actions}
                    >
                      <List.Item.Meta
                        title={
                          <>
                            <Typography.Text strong>
                              {!item?.isCustom && !item.isOIC && `${item?.title} (${item?.label})—`}
                            </Typography.Text>
                            {item?.isLeave && !item?.isRestDay ? (
                              <Typography.Text strong>
                                <MomentFormatter
                                  value={item.dateTimeStartRaw}
                                  format={'MM/DD/YY'}
                                />{' '}
                                (
                                <MomentDifferenceFormatter
                                  secondDate={item.dateTimeStartRaw}
                                  firstDate={item.dateTimeEndRaw}
                                />
                                {' hours'})
                              </Typography.Text>
                            ) : (
                              <>
                                <Typography.Text type="success" strong={item?.isCustom}>
                                  <MomentFormatter
                                    value={item.dateTimeStartRaw}
                                    format={'MM/DD/YY hh:mmA'}
                                  />
                                </Typography.Text>
                                -
                                <Typography.Text type="danger" strong={item?.isCustom}>
                                  <MomentFormatter
                                    value={item.dateTimeEndRaw}
                                    format="MM/DD/YY hh:mmA"
                                  />
                                </Typography.Text>
                              </>
                            )}
                          </>
                        }
                        description={
                          <>
                            <Tag color="blue" style={{ marginRight: 0 }}>
                              {item?.departmentName}
                            </Tag>
                            {item?.isLeave && (
                              <Tag color="green" style={{ marginLeft: 5, marginRight: 0 }}>
                                LEAVE
                              </Tag>
                            )}
                            {item?.isOIC && (
                              <Tag color="red" style={{ marginLeft: 5, marginRight: 0 }}>
                                OIC
                              </Tag>
                            )}
                            {item?.isCustom && (
                              <Tag color="green" style={{ marginLeft: 5, marginRight: 0 }}>
                                CUSTOM
                              </Tag>
                            )}
                            {item?.isRestDay && !item?.isLeave && (
                              <Tag color="blue" style={{ marginLeft: 5, marginRight: 0 }}>
                                WITH REST
                              </Tag>
                            )}
                            {!item?.withNSD && !item?.isLeave && (
                              <Tag color="blue" style={{ marginLeft: 5, marginRight: 0 }}>
                                NO NSD
                              </Tag>
                            )}
                            {!item?.withHoliday && !item?.isLeave && (
                              <Tag color="blue" style={{ marginLeft: 5, marginRight: 0 }}>
                                NO HOLIDAY
                              </Tag>
                            )}
                            {!item?.withPay && item?.isLeave && !item.isRestDay && (
                              <Tag color="blue" style={{ marginLeft: 5, marginRight: 0 }}>
                                NO PAY
                              </Tag>
                            )}
                          </>
                        }
                      />
                    </HRListItem>
                  );
                }}
              />

              <HRDivider>Overtime Schedule</HRDivider>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                {(!isLocked || allowManageLockedDates) && allowManageOvertime && (
                  <HRButton type="primary" onClick={handleAddOvertime}>
                    Add
                  </HRButton>
                )}
              </div>
              <HRList
                title={null}
                dataSource={overtime}
                renderItem={(item) => {
                  let startDate = moment(item?.dateTimeStartRaw).format('MM/DD/YY');
                  let endDate = moment(item?.dateTimeEndRaw).format('MM/DD/YY');
                  return (
                    <HRListItem
                      handleEdit={
                        isLocked || !allowManageOvertime ? null : () => handleEdit(item, true)
                      }
                      handleDelete={
                        isLocked || !allowManageOvertime
                          ? null
                          : () => handleDeleteSchedule(item?.id)
                      }
                      actions={
                        isAllowedToManageRegularSchedule(item)
                          ? [
                              <Tooltip title="Delete" key="more-button">
                                <Dropdown
                                  placement="bottomRight"
                                  overlay={
                                    <Menu>
                                      {!item?.isOIC && (
                                        <Menu.Item
                                          key="with-rest-day"
                                          onClick={() =>
                                            setWithRestAndWithNSDSchedule(
                                              {
                                                id: item?.id,
                                                employeeId: employee?.id,
                                                department: item?.department,
                                                schedule: item,
                                              },
                                              !item.isRestDay,
                                              item.withNSD,
                                            )
                                          }
                                        >
                                          {`${item?.isRestDay ? 'Without' : 'With'} Rest Day`}
                                        </Menu.Item>
                                      )}
                                    </Menu>
                                  }
                                  trigger={['click']}
                                >
                                  <HRButton shape="circle" icon={<MoreOutlined />} />
                                </Dropdown>
                              </Tooltip>,
                            ]
                          : []
                      }
                    >
                      <Typography.Text type="success" strong>
                        {startDate} {item?.timeStart}
                      </Typography.Text>
                      —
                      <Typography.Text type="danger" strong>
                        {endDate} {item?.timeEnd}
                      </Typography.Text>
                      {item?.isOIC && (
                        <Tag color="red" style={{ marginLeft: 5, marginRight: 0 }}>
                          OIC
                        </Tag>
                      )}
                      {employee?.department !== item?.department && (
                        <Tag style={{ marginLeft: 5 }} color="blue">
                          {item?.departmentName}
                        </Tag>
                      )}
                      {item?.isRestDay && (
                        <Tag color="blue" style={{ marginLeft: 5, marginRight: 0 }}>
                          WITH REST
                        </Tag>
                      )}
                      {!item?.withNSD && (
                        <Tag color="blue" style={{ marginLeft: 5, marginRight: 0 }}>
                          NO NSD
                        </Tag>
                      )}
                    </HRListItem>
                  );
                }}
              />
            </Spin>
            <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
              <HRButton type="primary" onClick={onCancelModal}>
                Close
              </HRButton>
            </div>
          </TabPane>
          <TabPane tab="Raw Logs" key="2">
            <RawEmployeeLogs selectedData={selectedData} empID={props.selectedData} />
          </TabPane>
        </Tabs>
      </HRModal>
      <EditScheduleModal
        visible={overtimeEdit.status}
        handleModal={handleOvertimeEdit}
        schedule={overtimeEdit.schedule}
        isOvertime={overtimeEdit.isOvertime}
        employee={employeeSchedDetails?.employee}
        selectedDate={
          regularSchedule?.dateTimeStartRaw?.isMultiDay ? regularSchedule?.dateTimeStartRaw : date
        }
      />
    </>
  );
};

export default ScheduleDetailsModal;