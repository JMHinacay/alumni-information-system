import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { HRButton, HRDivider, HRList, HRPageHeader } from '@components/commons';
import Head from 'next/head';
import { employeeRequestStatusFormatter } from '@utils/constantFormatters';
import { message, Modal } from 'antd';
import { useContext, useEffect, useState } from 'react';
import {
  employeeRequestApprovalStatus,
  employeeRequestStatus,
  employeeRequestType,
} from '@utils/constants';
import { AccountContext } from '@components/accessControl/AccountContext';
import LeaveRemarksModal from '@components/pages/transactions/leave/LeaveRemarksModal';
import { useRouter } from 'next/router';
import LeaveFilterDrawer from '@components/pages/transactions/leave/LeaveFilterDrawer';
import LeaveFilterListRenderer from '@components/pages/transactions/leave/LeaveFilterListRenderer';
import LeaveItem from '@components/pages/transactions/leave/LeaveItem';
import useHasPermission from '@hooks/useHasPermission';

export const GET_EMPLOYEE_REQUEST_LEAVE = gql`
  query(
    $status: [String]
    $startDate: Instant
    $endDate: Instant
    $withPay: [Boolean]
    $datesType: [String]
    $approvals: [UUID]
    $requestedBy: UUID
    $hrApprovedBy: UUID
    $revertedBy: UUID
    $department: UUID
    $type: String
    $page: Int
    $size: Int
  ) {
    leaves: findEmployeeRequests(
      status: $status
      startDate: $startDate
      endDate: $endDate
      withPay: $withPay
      datesType: $datesType
      requestedBy: $requestedBy
      revertedBy: $revertedBy
      approvals: $approvals
      hrApprovedBy: $hrApprovedBy
      department: $department
      type: $type
      page: $page
      size: $size
    ) {
      content {
        id
        status
        reason
        remarks
        datesType
        withPay
        hrApprovedDate
        requestedDate
        revertedDate
        requestedBy {
          id
          firstName
          lastName
          fullName
        }
        approvals {
          id
          employee {
            id
            fullName
            firstName
            lastName
            department {
              id
              departmentName
            }
          }
          approvedDate
          status
          remarks
        }
        hrApprovedBy {
          id
          fullName
        }
        revertedBy {
          id
          fullName
        }
        department {
          id
          description
          departmentCode
          departmentDesc
        }
        dates {
          startDatetime
          endDatetime
          hours
          scheduleType
        }
      }
      totalElements
    }
  }
`;

const UPSERT_EMPLOYEE_REQUEST = gql`
  mutation(
    $requestedBy: UUID
    $id: UUID
    $department: UUID
    $fields: Map_String_ObjectScalar
    $hrApprovedBy: UUID
  ) {
    data: upsertEmployeeRequest(
      requestedBy: $requestedBy
      id: $id
      fields: $fields
      department: $department
      hrApprovedBy: $hrApprovedBy
    ) {
      success
      message
      id: returnId
    }
  }
`;

export const initialLeaveFilterState = {
  status: [employeeRequestStatus.PENDING],
  dates: [null, null],
  withPay: [],
  datesType: [],
  approvals: [],
  hrApprovedBy: null,
  revertedBy: null,
  requestedBy: null,
  department: null,
  size: 25,
  page: 0,
  startDate: null,
  endDate: null,
};
export const initialFilterValues = {
  approvals: [],
  revertedBy: null,
  department: null,
  hrApprovedBy: null,
  requestedBy: null,
  status: [
    {
      label: employeeRequestStatusFormatter(employeeRequestStatus.PENDING),
      value: employeeRequestStatus.PENDING,
    },
  ],
  dates: null,
  withPay: [],
  datesType: [],
};
const TransactionsLeavePage = (props) => {
  const router = useRouter();
  const [remarksModal, setRemarksModal] = useState({ visible: false, value: null, type: null });
  const user = useContext(AccountContext);
  const [filterState, setFilterState] = useState(initialLeaveFilterState);
  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const [leaveFilter, setLeaveFilter] = useState(false);

  const hasCreateRequestPermission = useHasPermission(['allow_create_leave_request']);

  const [getEmployeeLeaveRequests, { data, loading, refetch }] = useLazyQuery(
    GET_EMPLOYEE_REQUEST_LEAVE,
    {
      variables: {
        ...filterState,
        type: employeeRequestType.LEAVE,
      },
    },
  );

  const [upsertEmployeeRequest] = useMutation(UPSERT_EMPLOYEE_REQUEST, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved employee request.');

        refetch({
          ...filterState,
          type: employeeRequestType.LEAVE,
        });
      } else message.error(data?.message ?? 'Failed to save employee request.');
    },
  });

  useEffect(() => {
    if (filterState.dates) {
      if (
        (filterState.dates[0] === null && filterState.dates[1] === null) ||
        (filterState.dates[0] && filterState.dates[1])
      ) {
        //run query
        getEmployeeLeaveRequests({
          variables: {
            ...filterState,
            startDate: filterState.dates[0],
            endDate: filterState.dates[1],
          },
        });
      }
    }
  }, [filterState]);

  const handleRemarksModal = (visible, willRefetch = false) => {
    if (willRefetch)
      getEmployeeLeaveRequests({
        variables: {
          ...filterState,
          startDate: filterState.dates[0],
          endDate: filterState.dates[1],
        },
      });

    setRemarksModal(visible);
  };

  const handleFilterDrawer = (visible, filterState, filterValues) => {
    if (filterState) setFilterState(filterState);
    if (filterValues) setFilterValues(filterValues);
    setLeaveFilter(visible);
  };

  const onNextPage = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };

  const onSubmitEmployeeRequest = (request) => {
    let { id, requestedBy, department } = request;
    requestedBy = requestedBy?.id;
    department = department?.id;
    Modal.confirm({
      title: 'Submit Request?',
      content: 'Are you sure you want to submit request?',
      onOk: () =>
        upsertEmployeeRequest({
          variables: {
            id,
            requestedBy,
            department,
            fields: {
              status: employeeRequestStatus.PENDING_SUPERVISOR,
            },
          },
        }),
    });
  };

  const onRejectSupervisor = (request) => {
    let { id, requestedBy, department } = request;
    requestedBy = requestedBy?.id;
    department = department?.id;

    handleRemarksModal({
      visible: true,
      value: {
        id,
        requestedBy,
        department,
        hrApprovedBy: user.data.id,
      },
      type: 'REJECT_SUPERVISOR',
    });
    // Modal.confirm({
    //   title: 'Reject Request?',
    //   content: 'Are you sure you want to reject request?',
    //   onOk: () =>
    //     upsertEmployeeRequest({
    //       variables: {
    //         id,
    //         requestedBy,
    //         department,
    //         remarks: 'This is a remarks from supervisor reject',
    //         approvedBy: user.data.id,
    //         fields: {
    //           status: employeeRequestStatus.REJECTED_SUPERVISOR,
    //         },
    //       },
    //     }),
    // });
  };

  const onApproveSupervisor = (request) => {
    let { id, requestedBy, department } = request;
    requestedBy = requestedBy?.id;
    department = department?.id;
    Modal.confirm({
      title: 'Approve Request?',
      content: 'Are you sure you want to approve request?',
      onOk: () =>
        upsertEmployeeRequest({
          variables: {
            id,
            requestedBy,
            department,
            approvedBy: user.data.id,
            fields: {
              status: employeeRequestStatus.PENDING,
            },
          },
        }),
    });
  };

  const onHrApprove = (request) => {
    let { id, requestedBy, department, approvedBy } = request;
    requestedBy = requestedBy?.id;
    approvedBy = approvedBy?.id;
    department = department?.id;
    handleRemarksModal({
      visible: true,
      value: {
        id,
        requestedBy,
        approvedBy,
        department,
        hrApprovedBy: user.data.id,
      },
      type: 'APPROVE_HR',
    });
  };
  const onHrReject = (request) => {
    let { id, requestedBy, department, approvedBy } = request;
    requestedBy = requestedBy?.id;
    approvedBy = approvedBy?.id;
    department = department?.id;

    handleRemarksModal({
      visible: true,
      value: {
        id,
        requestedBy,
        approvedBy,
        department,
        hrApprovedBy: user.data.id,
      },
      type: 'REJECT_HR',
    });
  };
  const onCancelRequest = (request) => {
    let { id, requestedBy, department, approvedBy } = request;
    requestedBy = requestedBy?.id;
    approvedBy = approvedBy?.id;
    department = department?.id;
    Modal.confirm({
      title: 'Cancel Request?',
      content: 'Are you sure you want to cancel request?',
      onOk: () =>
        upsertEmployeeRequest({
          variables: {
            id,
            requestedBy,
            department,
            hrApprovedBy: user.data.id,
            fields: {
              status: employeeRequestStatus.CANCELLED,
            },
          },
        }),
    });
  };
  const onRevertEmployeeRequest = (request) => {
    let { id, requestedBy, department, approvedBy } = request;
    requestedBy = requestedBy?.id;
    approvedBy = approvedBy?.id;
    department = department?.id;

    handleRemarksModal({
      visible: true,
      value: {
        id,
        requestedBy,
        approvedBy,
        department,
        hrApprovedBy: user.data.id,
      },
      type: 'REVERT',
    });
  };

  let pageHeaderExtra = [];
  if (hasCreateRequestPermission)
    pageHeaderExtra = pageHeaderExtra.concat(
      <HRButton
        type="primary"
        onClick={() => router.push('/transactions/leave/create')}
        key="add request"
      >
        Create Request
      </HRButton>,
    );

  return (
    <>
      <Head>
        <title>Leave Requests</title>
      </Head>
      {/* <LeaveForm visible={handleLeaveForm} handleModal={handleLeaveFormModal} /> */}
      <LeaveFilterDrawer
        visible={leaveFilter}
        handleModal={handleFilterDrawer}
        filterState={filterState}
        filterValues={filterValues}
      />
      <HRPageHeader title="Leave Requests" extra={pageHeaderExtra} />
      <LeaveFilterListRenderer
        filters={filterValues}
        filterState={filterState}
        setFilterValues={setFilterValues}
        setFilterState={setFilterState}
        handleFilterDrawer={handleFilterDrawer}
      />
      <HRDivider />
      <HRList
        loading={loading}
        itemLayout="vertical"
        // size="large"
        dataSource={data?.leaves?.content || []}
        pagination={{
          position: 'both',
          onChange: onNextPage,
          pageSize: filterState.size,
          defaultCurrent: 1,
          total: data?.leaves?.totalElements,
          onChange: onNextPage,
          current: filterState.page,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        rowKey={(i) => i.id}
        renderItem={(item) => {
          let actions = [];
          if (
            item.status === employeeRequestStatus.PENDING ||
            item.status === employeeRequestStatus.APPROVED
          ) {
            actions = actions.concat(
              <HRButton
                type="ghost"
                danger
                key="cancel-button"
                onClick={() => onCancelRequest(item)}
              >
                Cancel
              </HRButton>,
            );
          }

          if (item.status === employeeRequestStatus.PENDING)
            actions = actions.concat(
              <HRButton type="ghost" danger key="decline-button" onClick={() => onHrReject(item)}>
                HR Reject
              </HRButton>,
              <HRButton type="primary" key="accept-button" onClick={() => onHrApprove(item)}>
                HR Approve
              </HRButton>,
            );
          else if (item.status === employeeRequestStatus.APPROVED)
            actions = actions.concat(
              <HRButton
                type="primary"
                danger
                key="revert-button"
                onClick={() => onRevertEmployeeRequest(item)}
              >
                Revert Request
              </HRButton>,
            );

          const forApproval = item?.approvals?.filter(
            (approval) => approval.status === employeeRequestApprovalStatus.PENDING,
          ).length;

          return (
            <LeaveItem forApproval={forApproval} actions={actions} item={item} key={item.id} />
          );
        }}
      />
      <LeaveRemarksModal
        visible={remarksModal.visible}
        request={remarksModal.value}
        handleModal={handleRemarksModal}
        type={remarksModal.type}
      />
    </>
  );
};

export default TransactionsLeavePage;
