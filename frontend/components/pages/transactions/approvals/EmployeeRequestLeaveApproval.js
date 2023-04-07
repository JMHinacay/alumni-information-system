import { AccountContext } from '@components/accessControl/AccountContext';
import { HRList } from '@components/commons';
import useEmployeeMyApproval from '@hooks/useEmployeeMyApproval';
import { employeeRequestApprovalStatus, employeeRequestType } from '@utils/constants';
import moment from 'moment';
import React, { useContext } from 'react';
import LeaveItem from '../leave/LeaveItem';

function EmployeeRequestLeaveApproval(props) {
  const account = useContext(AccountContext);
  const { data, loading, refetch } = useEmployeeMyApproval(employeeRequestType.LEAVE, {
    startDate: props?.dates[0] && moment(props?.dates[0]).utc().format(),
    endDate: props?.dates[1] && moment(props?.dates[1]).utc().format(),
  });

  return (
    <div>
      <HRList
        itemLayout="vertical"
        dataSource={data?.leaves?.content || []}
        loading={loading}
        rowKey={(i) => i.id}
        renderItem={(item) => {
          const forApproval = item?.approvals?.filter(
            (approval) =>
              approval.status === employeeRequestApprovalStatus.PENDING &&
              account?.data?.id === approval?.employee?.id,
          ).length;
          return <LeaveItem forApproval={forApproval} item={item} key={item.id} compact />;
        }}
      />
    </div>
  );
}

export default EmployeeRequestLeaveApproval;
