import { gql, useMutation } from '@apollo/client';
import { HRButton, HRList } from '@components/commons';
import LeaveItem from '@components/pages/transactions/leave/LeaveItem';
import useEmployeeMyRequests from '@hooks/useEmployeeMyRequests';
import { employeeRequestApprovalStatus, employeeRequestStatus } from '@utils/constants';
import { message, Modal } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const UPSERT_EMPLOYEE_REQUEST = gql`
  mutation($id: UUID) {
    data: submitEmployeeRequest(id: $id) {
      success
      message
      id: returnId
    }
  }
`;

function LeaveTab(props) {
  const router = useRouter();
  const { data, loading, refetch } = useEmployeeMyRequests('LEAVE', props.status, {
    startDate: props?.dates[0] && moment(props?.dates[0]).utc().format(),
    endDate: props?.dates[1] && moment(props?.dates[1]).utc().format(),
  });

  const [upsertEmployeeRequest] = useMutation(UPSERT_EMPLOYEE_REQUEST, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved employee request.');

        refetch();
      } else message.error(data?.message ?? 'Failed to save employee request.');
    },
  });

  const onSubmitEmployeeRequest = (request) => {
    let { id } = request;
    Modal.confirm({
      title: 'Submit Request?',
      content: 'Are you sure you want to submit request?',
      onOk: () =>
        upsertEmployeeRequest({
          variables: {
            id,
          },
        }),
    });
  };

  return (
    <>
      <HRList
        itemLayout="vertical"
        dataSource={data?.leaves?.content || []}
        loading={loading}
        rowKey={(i) => i.id}
        renderItem={(item) => {
          let actions = [];
          if (item.status === employeeRequestStatus.DRAFT) {
            actions = [
              <HRButton
                type="ghost"
                danger
                key="cancel-button"
                onClick={() => onCancelRequest(item)}
              >
                Cancel
              </HRButton>,
              <HRButton
                type="primary"
                ghost
                key="edit-button"
                onClick={() => router.push(`/mine/my-leave/${item?.id}`)}
              >
                Edit
              </HRButton>,
              <HRButton
                type="primary"
                key="submit-button"
                onClick={() => onSubmitEmployeeRequest(item)}
              >
                Submit
              </HRButton>,
            ];
          }

          const forApproval = item?.approvals?.filter(
            (approval) => approval.status === employeeRequestApprovalStatus.PENDING,
          ).length;

          return (
            <LeaveItem forApproval={forApproval} actions={actions} item={item} key={item.id} isUser />
          );
        }}
      />
    </>
  );
}

export default LeaveTab;
