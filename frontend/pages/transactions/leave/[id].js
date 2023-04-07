import { gql, useQuery } from '@apollo/client';
import { HRButton, HRList, HRPageHeader } from '@components/commons';
import LeaveItem from '@components/pages/transactions/leave/LeaveItem';
import LeaveRemarksModal from '@components/pages/transactions/leave/LeaveRemarksModal';
import { employeeRequestApprovalStatus, employeeRequestStatus } from '@utils/constants';
import { message, Spin } from 'antd';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import useHasPermission from '@hooks/useHasPermission';

const GET_ONE_EMPLOYEE_REQUEST = gql`
  query($id: UUID) {
    leave: leaveRequest(id: $id) {
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
  }
`;

function ViewOneLeavePage(props) {
  const hasRejectRequestPermission = useHasPermission(['allow_reject_leave_request']);
  const hasApproveRequestPermission = useHasPermission(['allow_approve_leave_request']);
  const hasHrRejectRequestPermission = useHasPermission(['allow_hr_reject_leave_request']);
  const hasHrApproveRequestPermission = useHasPermission(['allow_hr_approve_leave_request']);
  const hasHrRevertRequestPermission = useHasPermission(['allow_hr_revert_leave_request']);

  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [remarksModal, setRemarksModal] = useState({ visible: false, value: null, type: null });
  const { data, loading, refetch } = useQuery(GET_ONE_EMPLOYEE_REQUEST, {
    variables: {
      id: router.query.id,
    },
    onError: () => {
      setHasError(true);
      message.error('Something went wrong. Please try again later.');
    },
  });

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
        approvedBy,
        department,
        hrApprovedBy: user.data.id,
      },
      type: 'REJECT_SUPERVISOR',
    });
    Modal.confirm({
      title: 'Reject Request?',
      content: 'Are you sure you want to reject request?',
      onOk: () =>
        upsertEmployeeRequest({
          variables: {
            id,
            requestedBy,
            department,
            remarks: 'This is a remarks from supervisor reject',
            approvedBy: user.data.id,
            fields: {
              status: employeeRequestStatus.REJECTED_SUPERVISOR,
            },
          },
        }),
    });
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

  return (
    <div>
      <Head>
        <title>View Leave Request</title>
      </Head>
      <HRPageHeader onBack={router.back} title="View Leave Request" />
      {hasError && !loading && (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={
            <Button type="primary" onClick={router.back}>
              Go Back
            </Button>
          }
        />
      )}
      {loading && !data ? (
        <Spin size="large" />
      ) : (
        <>
          <HRList
            loading={loading}
            itemLayout="vertical"
            dataSource={[data?.leave] || []}
            pagination={false}
            bordered={false}
            header={null}
            rowKey={(i) => i.id}
            renderItem={(item) => {
              let actions = [];
              if (
                item.status === employeeRequestStatus.PENDING ||
                item.status === employeeRequestStatus.PENDING_SUPERVISOR ||
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
              if (item.status === employeeRequestStatus.PENDING_SUPERVISOR) {
                if (hasRejectRequestPermission)
                  actions = actions.concat(
                    <HRButton
                      type="ghost"
                      danger
                      key="decline-button"
                      onClick={() => onRejectSupervisor(item)}
                    >
                      Reject
                    </HRButton>,
                  );
                if (hasApproveRequestPermission)
                  actions = actions.concat(
                    <HRButton
                      type="primary"
                      key="accept-button"
                      onClick={() => onApproveSupervisor(item)}
                    >
                      Approve
                    </HRButton>,
                  );
              } else if (item.status === employeeRequestStatus.PENDING) {
                if (hasHrRejectRequestPermission) {
                  actions = actions.concat(
                    <HRButton
                      type="ghost"
                      danger
                      key="decline-button"
                      onClick={() => onHrReject(item)}
                    >
                      HR Reject
                    </HRButton>,
                  );
                }
                if (hasHrApproveRequestPermission) {
                  actions = actions.concat(
                    <HRButton type="primary" key="accept-button" onClick={() => onHrApprove(item)}>
                      HR Approve
                    </HRButton>,
                  );
                }
              } else if (item.status === employeeRequestStatus.APPROVED)
                if (hasHrRevertRequestPermission)
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
      )}
    </div>
  );
}

export default ViewOneLeavePage;
