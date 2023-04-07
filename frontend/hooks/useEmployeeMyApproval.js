import { useQuery } from '@apollo/client';
import { AccountContext } from '@components/accessControl/AccountContext';
import { employeeRequestStatus } from '@utils/constants';
import { GET_EMPLOYEE_REQUEST_LEAVE } from 'pages/transactions/leave';
import { useContext } from 'react';
import * as yup from 'yup';

const filterValuesSchema = yup.object().shape({
  startDate: yup.string().nullable(),
  endDate: yup.string().nullable(),
});

const useEmployeeMyApproval = (type, filterValues) => {
  const account = useContext(AccountContext);
  //get based on type of the request
  //can filter based on date range by the created date or requested date property
  if (!type)
    throw new Error('useEmployeeMyApproval hook: Unmet arguments- type argument is required!');

  if (filterValues !== null) {
    filterValuesSchema.validate(filterValues).catch(() => {
      throw new Error(
        'useEmployeeMyApproval hook: Unmet argument- filterValues must have startDate and endDate values!',
      );
    });
  }

  return useQuery(GET_EMPLOYEE_REQUEST_LEAVE, {
    variables: {
      type,
      status: [employeeRequestStatus.PENDING_SUPERVISOR],
      datesType: [],
      withPay: [],
      approvals: [account?.data?.id],
      size: 20,
      page: 0,
      ...filterValues,
    },
    fetchPolicy: 'network-only',
  });
};

export default useEmployeeMyApproval;
