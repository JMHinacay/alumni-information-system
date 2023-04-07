import {
  EditOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
  SelectOutlined,
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { gql, useQuery, useMutation } from '@apollo/react-hooks';
import {
  AccumulatedLogsTable,
  EditTimekeepingDetailsModal,
  EmployeeComponent,
  EmployeeDrawer,
  HRButton,
  HRDivider,
  HRPageHeader,
} from '@components/commons';
import HourAllocatorModal from '@components/commons/HourAllocatorModal';
import { UPDATE_TIMEKEEPING_STATUS } from '@components/commons/TimekeepingForm';
import { timekeepingStatusColorGenerator } from '@utils/constantFormatters';
import { Space, Spin, Tooltip, Typography, Result, message, Modal, Tag } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DEPARTMENT_QUERY } from 'pages/employees/list';
import React, { useState } from 'react';

const GET_TIMEKEEPING = gql`
  query($id: UUID) {
    timekeeping: getTimekeepingById(id: $id) {
      id
      title
      dateStart
      dateEnd
      description
      status
    }
  }
`;

const GET_EMPLOYEES = gql`
  query($id: UUID) {
    timekeepingEmployee: getTimekeepingEmployeesV2(id: $id) {
      id
      status
      employee {
        id
        fullName
        gender
        department {
          id
          departmentName
        }
      }
    }
  }
`;

const GET_EMPLOYEE_LOGS = gql`
  query($id: UUID, $startDate: Instant, $endDate: Instant) {
    employeeLogs: getTimekeepingEmployeeAccumulatedLogsById(id: $id) {
      id
      date
      scheduleStart
      scheduleEnd
      inTime
      outTime
      message
      isError

      finalLogs {
        late
        undertime
        hoursAbsent
        worked
        hoursRestDay
        hoursSpecialHoliday
        hoursSpecialHolidayAndRestDay
        hoursRegularHoliday
        hoursRegularHolidayAndRestDay
        hoursDoubleHoliday
        hoursDoubleHolidayAndRestDay
        hoursRegularOvertime
        hoursRestOvertime
        hoursSpecialHolidayOvertime
        hoursSpecialHolidayAndRestDayOvertime
        hoursRegularHolidayOvertime
        hoursRegularHolidayAndRestDayOvertime
        hoursDoubleHolidayOvertime
        hoursDoubleHolidayAndRestDayOvertime

        hoursWorkedNSD
        hoursRestDayNSD
        hoursSpecialHolidayNSD
        hoursSpecialHolidayAndRestDayNSD
        hoursRegularHolidayNSD
        hoursRegularHolidayAndRestDayNSD
        hoursDoubleHolidayNSD
        hoursDoubleHolidayAndRestDayNSD
        hoursDoubleHolidayAndRestDay
        workedOIC
        hoursSpecialHolidayOIC
        hoursRegularHolidayOIC
        hoursDoubleHolidayOIC
        hoursRegularOICOvertime
        hoursSpecialHolidayOICOvertime
        hoursRegularHolidayOICOvertime
        hoursDoubleHolidayOICOvertime
        hoursWorkedOICNSD
        hoursSpecialHolidayOICNSD
        hoursRegularHolidayOICNSD
        hoursDoubleHolidayOICNSD
      }

      isOvertimeOnly
      isAbsentOnly
      isRestDay
      isRestDayOnly
      isEmpty
    }
    holidays: mapEventsToDates(startDate: $startDate, endDate: $endDate)
  }
`;

const CALCULATE_LOGS = gql`
  mutation($timekeepingId: UUID, $startDate: Instant, $endDate: Instant, $ids: [UUID]) {
    calculateAccumulatedLogs(
      timekeepingId: $timekeepingId
      startDate: $startDate
      endDate: $endDate
      ids: $ids
    ) {
      message
    }
  }
`;

const RECALCULATE_ONE_LOG = gql`
  mutation($id: UUID, $empId: UUID, $startDate: Instant, $endDate: Instant) {
    recalculateOneLog(id: $id, empId: $empId, startDate: $startDate, endDate: $endDate) {
      message
    }
  }
`;

export const UPDATE_TIMEKEEPING_EMPLOYEE_STATUS = gql`
  mutation($id: UUID, $status: String) {
    data: updateTimekeepingEmployeeStatus(id: $id, status: $status) {
      payload {
        id
        status
      }
      message
    }
  }
`;
function ViewTimekeeping() {
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [empDrawerVisibility, setEmpDrawerVisibility] = useState(false);
  const [selectedEmployeeByDept, setSelectedEmployeeByDept] = useState();
  const [displayedEmployee, setDisplayedEmployee] = useState(null);
  const [isAllocatorModalVisible, setIsAllocatorModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  //======================================Queries=================================
  const { data: departmentData, loading: loadingDepartment } = useQuery(DEPARTMENT_QUERY);
  const { data: employees, loading: employeesLoading, refetch: refetchEmployees } = useQuery(
    GET_EMPLOYEES,
    {
      variables: {
        id: router.query?.id,
      },
      onCompleted: (result) => {
        if (result) {
          const selectedEmployees = result?.timekeepingEmployee?.map((item) => {
            if (item.id == displayedEmployee?.id)
              setDisplayedEmployee({ ...displayedEmployee, status: item.status });

            return {
              id: item.id,
              status: item.status,
              employeeId: item?.employee?.id,
              fullName: item?.employee.fullName,
              gender: item?.employee.gender,
              department: {
                id: item.employee.department?.id,
                departmentName: item?.employee.department?.departmentName,
              },
            };
          });

          let tempSelectedEmployeeByDept = departmentData?.departments?.map(
            ({ id, departmentName }) => {
              return {
                department: id,
                departmentName: departmentName,
                data:
                  selectedEmployees.filter((item) => {
                    return id === item?.department?.id;
                  }) || [],
              };
            },
          );

          tempSelectedEmployeeByDept = tempSelectedEmployeeByDept?.filter(
            (item) => item?.data?.length !== 0,
          );
          setSelectedEmployeeByDept(tempSelectedEmployeeByDept);
        }
      },
    },
  );
  const {
    data: getTimekeeping,
    loading: loadingGetTimekeeping,
    refetch: refetchTimekeeping,
  } = useQuery(GET_TIMEKEEPING, {
    variables: {
      id: router?.query.id,
    },
    fetchPolicy: 'network-only',
  });
  const {
    data: getEmployeeLogs,
    loading: loadingGetEmployeeLogs,
    refetch: refetchEmployeeLogs,
  } = useQuery(GET_EMPLOYEE_LOGS, {
    skip: !displayedEmployee,
    variables: {
      id: displayedEmployee?.id,
      dateStart: getTimekeeping?.timekeeping?.dateStart,
      dateEnd: getTimekeeping?.timekeeping?.dateEnd,
    },
    nextFetchPolicy: 'network-only',
  });

  //======================================Queries=================================
  //======================================Mutation================================
  const [calcAccumulatedLogs, { loading: loadingCalcAccumulatedLogs }] = useMutation(
    CALCULATE_LOGS,
    {
      onCompleted: (result) => {
        message.success(result.calculateAccumulatedLogs.message);
        refetchEmployeeLogs();
        refetchEmployees();
      },
    },
  );

  const [calculateOneLog, { loading: loadingCalculateOneLog }] = useMutation(RECALCULATE_ONE_LOG, {
    onCompleted: (result) => {
      message.success(result.recalculateOneLog.message);
      refetchEmployeeLogs();
    },
  });

  const [updateTimekeepingStatus, { loading: loadingUpdateStatus }] = useMutation(
    UPDATE_TIMEKEEPING_STATUS,
    {
      onCompleted: (data) => {
        refetchTimekeeping();
      },
      onError: () => {
        message.error('Something went wrong, Please try again later.');
      },
    },
  );

  const [updateEmployeeStatus, { loading: loadingUpdateEmployeeStatus }] = useMutation(
    UPDATE_TIMEKEEPING_EMPLOYEE_STATUS,
    {
      onCompleted: (result) => {
        message.success(result.data.message);
        refetchEmployees();
      },
      onError: () => {
        message.error('Something went wrong, Please try again later.');
      },
    },
  );
  //======================================Mutation================================

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showAllocatorModal = () => {
    setIsAllocatorModalVisible(true);
  };

  const showDrawer = () => {
    setEmpDrawerVisibility(true);
  };

  const updateDisplayedEmployee = (employee) => {
    setDisplayedEmployee(employee);
    refetchEmployeeLogs();
  };

  const confirmRecalculate = (type, record) => {
    const messageContent = {
      this: 'this log',
      all: 'all employee logs for this timekeeping',
      this_employee: 'all logs for this employee',
    };

    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to recalculate ${messageContent[type]}?`,

      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        if (type === 'this') {
          calculateOneLog({
            variables: {
              id: record.id,
              empId: displayedEmployee.employeeId,
              startDate: moment(record.date).startOf('day').utc().format(),
              endDate: moment(record.date).endOf('day').utc().format(),
            },
          });
        } else if (type === 'this_employee') {
          var empIds = employees.timekeepingEmployee.map((item) => item.employee.id);
          calcAccumulatedLogs({
            variables: {
              timekeepingId: router.query?.id,
              ids: [displayedEmployee.employeeId],
              endDate: getTimekeeping.timekeeping.dateEnd,
              startDate: getTimekeeping.timekeeping.dateStart,
            },
          });
        } else if (type === 'all') {
          Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure? This action is irreversible.`,
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: () => {
              var empIds = employees.timekeepingEmployee.map((item) => item.employee.id);
              calcAccumulatedLogs({
                variables: {
                  timekeepingId: router.query?.id,
                  ids: empIds,
                  endDate: getTimekeeping.timekeeping.dateEnd,
                  startDate: getTimekeeping.timekeeping.dateStart,
                },
              });
            },
          });
        }
      },
    });
  };

  const confirmFinalize = (type) => {
    const formatStatus = {
      FINALIZED: 'DRAFT',
      DRAFT: 'FINALIZED',
    };

    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to set ${type.replace('_', ' ')} as ${
        type == 'this_employee' ? formatStatus[displayedEmployee?.status] : 'FINALIZED'
      }?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        if (type == 'this_employee') {
          updateEmployeeStatus({
            variables: {
              id: displayedEmployee?.id,
              status: formatStatus[displayedEmployee?.status],
            },
          });
        } else if ((type = 'this_timekeeping')) {
          Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure?',
            okText: 'Confirm',
            cancelText: 'Cancel',
            onOk: () => {
              updateTimekeepingStatus({
                variables: { id: router?.query?.id, status: 'FINALIZED' },
              });
            },
          });
        }
      },
    });
  };

  const confirmCancelTimekeeping = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to cancel this timekeeping?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        Modal.confirm({
          title: 'Confirm',
          icon: <ExclamationCircleOutlined />,
          content: `Are you sure?`,
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => {
            updateTimekeepingStatus({ variables: { id: router.query?.id, status: 'CANCELLED' } });
          },
        });
      },
    });
  };

  const updateLogs = () => {
    refetchEmployeeLogs();
  };

  const transformDataSource = () => {
    return getEmployeeLogs?.employeeLogs?.map((item) => {
      let data = { ...item, ...item.finalLogs };
      delete data.finalLogs;
      return data;
    });
  };

  const actionColumn = {
    title: 'Actions',
    key: 'actions',
    dataIndex: 'actions',
    width: 100,
    fixed: 'right',
    align: 'center',
    render: (text, record) => (
      <Space size={6}>
        <Tooltip title="Recalculate Logs">
          <HRButton
            type="primary"
            shape="circle"
            ghost
            icon={<ReloadOutlined />}
            onClick={(e) => {
              confirmRecalculate('this', record);
            }}
          />
        </Tooltip>
        <Tooltip title="Reallocate hours">
          <HRButton
            type="primary"
            shape="circle"
            onClick={(e) => {
              showAllocatorModal(record.id);

              setSelectedId(record.id);
            }}
            ghost
            icon={<EditOutlined />}
          />
        </Tooltip>
      </Space>
    ),
  };

  return (
    <div>
      <Head>
        <title>View Timekeeping</title>
      </Head>
      {loadingGetTimekeeping ? (
        <div
          style={{
            height: 'calc(100vh - 160px)',
          }}
        >
          <Spin style={{ position: 'relative', top: '40%', left: '50%' }} size="large" />
        </div>
      ) : (
        <>
          {['ACTIVE', 'CANCELLED', 'FINALIZED'].includes(getTimekeeping?.timekeeping?.status) ? (
            <>
              <HRPageHeader
                title={
                  <>
                    {getTimekeeping?.timekeeping?.title}{' '}
                    <Tag
                      color={timekeepingStatusColorGenerator(getTimekeeping?.timekeeping?.status)}
                    >
                      {getTimekeeping?.timekeeping?.status}
                    </Tag>
                  </>
                }
                onBack={router.back}
                extra={
                  getTimekeeping?.timekeeping?.status == 'ACTIVE' && (
                    <Space size={'small'}>
                      <Link href={`/payroll/timekeeping/${router?.query?.id}/manage-employee`}>
                        <Tooltip title="Add/Remove Employees">
                          <HRButton
                            shape="circle"
                            icon={<UserSwitchOutlined />}
                            type="primary"
                            ghost
                          />
                        </Tooltip>
                      </Link>
                      <Tooltip title="Edit Details">
                        <HRButton
                          shape="circle"
                          icon={<EditOutlined />}
                          type="primary"
                          onClick={showModal}
                          ghost
                        />
                      </Tooltip>
                      <Tooltip title="Recalculate All Logs">
                        <HRButton
                          shape="circle"
                          icon={<ReloadOutlined />}
                          type="danger"
                          onClick={(e) => {
                            confirmRecalculate('all', null);
                          }}
                          ghost
                        />
                      </Tooltip>
                      <Tooltip title="Cancel Timekeeping">
                        <HRButton
                          shape="circle"
                          icon={<CloseOutlined />}
                          type="default"
                          danger
                          onClick={() => confirmCancelTimekeeping()}
                        />
                      </Tooltip>
                      <HRButton
                        icon={<CheckOutlined />}
                        type="primary"
                        onClick={() => {
                          confirmFinalize('this_timekeeping');
                        }}
                      >
                        Finalize Timekeeping
                      </HRButton>
                    </Space>
                  )
                }
              />
              <Typography.Title level={5}>
                {moment(getTimekeeping?.timekeeping?.dateStart).format(' MMMM D, YYYY')} -
                {moment(getTimekeeping?.timekeeping?.dateEnd).format(' MMMM D, YYYY')}
              </Typography.Title>

              <Typography.Text>{getTimekeeping?.timekeeping?.description}</Typography.Text>
              <HRDivider />

              <HRPageHeader
                title={
                  <div className="card-container">
                    {displayedEmployee == null ? (
                      <Typography.Title level={4}>Select an Employee</Typography.Title>
                    ) : (
                      <>
                        <EmployeeComponent
                          loading={loadingGetEmployeeLogs || loadingUpdateEmployeeStatus}
                          fullName={loadingGetEmployeeLogs ? '' : displayedEmployee?.fullName}
                          departmentName={
                            loadingGetEmployeeLogs
                              ? ''
                              : displayedEmployee?.department?.departmentName
                          }
                          status={displayedEmployee?.status}
                        />
                        {getTimekeeping?.timekeeping?.status == 'ACTIVE' && (
                          <>
                            <HRButton
                              type="primary"
                              ghost
                              onClick={(e) => {
                                confirmFinalize('this_employee');
                              }}
                            >
                              Set as{' '}
                              {displayedEmployee?.status != 'FINALIZED' ? 'Finalized' : 'Draft'}
                            </HRButton>

                            <HRButton
                              type="danger"
                              ghost
                              onClick={(e) => {
                                confirmRecalculate('this_employee');
                              }}
                              style={{ marginLeft: 10 }}
                            >
                              Recalculate Employee's Logs
                            </HRButton>
                          </>
                        )}
                      </>
                    )}
                  </div>
                }
                extra={
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                    <HRButton type="primary" onClick={showDrawer}>
                      <SelectOutlined />
                      Select Employee
                    </HRButton>
                  </div>
                }
              />

              <HRDivider />

              <AccumulatedLogsTable
                dataSource={transformDataSource()}
                holidays={getEmployeeLogs?.holidays}
                allowReallocateHours={
                  !['CANCELLED', 'FINALIZED'].includes(getTimekeeping?.timekeeping?.status) &&
                  displayedEmployee?.status != 'FINALIZED'
                }
                loading={
                  loadingGetEmployeeLogs ||
                  loadingCalcAccumulatedLogs ||
                  loadingUpdateEmployeeStatus
                }
                actionColumn={actionColumn}
                status={getTimekeeping?.timekeeping?.status}
              />

              <EditTimekeepingDetailsModal
                visible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                timekeepingId={router.query?.id}
              />

              <HourAllocatorModal
                visible={isAllocatorModalVisible}
                setIsModalVisible={setIsAllocatorModalVisible}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                updateLogs={updateLogs}
              />

              <EmployeeDrawer
                drawerUsage={'view_timekeeping'}
                empDrawerVisibility={empDrawerVisibility}
                setEmpDrawerVisibility={setEmpDrawerVisibility}
                selectedEmployeeByDept={selectedEmployeeByDept}
                setSelectedEmployeeByDept={setSelectedEmployeeByDept}
                selectedId={[]}
                updateDisplayedEmployee={updateDisplayedEmployee}
              />
            </>
          ) : (
            <>
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                  <HRButton type="primary" onClick={router.back}>
                    Go Back
                  </HRButton>
                }
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ViewTimekeeping;
