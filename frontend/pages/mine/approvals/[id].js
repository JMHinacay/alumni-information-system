import { useQuery } from '@apollo/react-hooks';
import { AccountContext } from '@components/accessControl/AccountContext';
import { HRList, HRPageHeader } from '@components/commons';
import LeaveItem from '@components/pages/transactions/leave/LeaveItem';
import LeaveRemarksModal from '@components/pages/transactions/leave/LeaveRemarksModal';
import { employeeRequestApprovalStatus } from '@utils/constants';
import { Button, Result, Spin, message } from 'antd';
import { gql } from 'apollo-boost';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';

const GET_EMPLOYEE_REQUEST = gql`
  query($id: UUID) {
    request: leaveRequest(id: $id) {
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

function EmployeeRequest() {
  const user = useContext(AccountContext);
  const router = useRouter();
  const [request, setRequest] = useState({});
  const [hasError, setHasError] = useState(false);
  const [remarksModal, setRemarksModal] = useState({
    visible: false,
    value: false,
    type: null,
  });

  const { data, loading, refetch, called } = useQuery(GET_EMPLOYEE_REQUEST, {
    variables: {
      id: router?.query?.id || null,
    },
    pollInterval: 8000,
    onCompleted: (data) => {
      let { request } = data || {};
      if (!request) setHasError(true);
      else {
        setRequest(request);
      }
    },
    onError: () => {
      setHasError(true);
      message.error('Something went wrong. Please try again later.');
    },
  });

  const handleRemarksModal = (value, willRefetch = false) => {
    if (willRefetch) refetch();
    setRemarksModal(value);
  };

  const onRejectSupervisor = (request, approval) => {
    setRemarksModal({
      visible: !remarksModal.visible,
      value: {
        id: approval,
        request,
      },
      type: 'APPROVE_REJECT',
    });
  };

  const onApproveSupervisor = (request, approval) => {
    setRemarksModal({
      visible: !remarksModal.visible,
      value: {
        id: approval,
        request,
      },
      type: 'APPROVE_APPROVAL',
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
      {loading && !data?.request ? (
        <div style={{ textAlign: 'center', width: '100%', marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <HRList
          itemLayout="vertical"
          dataSource={data?.request ? [data?.request] : []}
          pagination={false}
          bordered={false}
          header={null}
          rowKey={(i) => i?.id}
          renderItem={(item) => {
            const forApproval = item?.approvals?.filter(
              (approval) =>
                approval.status === employeeRequestApprovalStatus.PENDING &&
                approval.employee.id === user?.data?.id,
            ).length;

            return (
              <LeaveItem
                forApproval={forApproval}
                item={item}
                key={item.id}
                onRejectSupervisor={onRejectSupervisor}
                onApproveSupervisor={onApproveSupervisor}
                isApprover
              />
            );
          }}
        />
      )}
      <LeaveRemarksModal
        visible={remarksModal.visible}
        request={remarksModal.value}
        handleModal={handleRemarksModal}
        type={remarksModal.type}
      />
    </div>
  );
}

export default EmployeeRequest;
