import { useQuery } from '@apollo/client';
import { AccountContext } from '@components/accessControl/AccountContext';
import { GET_EMPLOYEE_REQUEST_LEAVE } from 'pages/transactions/leave';
import { useContext } from 'react';
import * as yup from 'yup';

// const GET_EMPLOYEE_REQUEST = gql``;

const filterValuesSchema = yup.object().shape({
  startDate: yup.string().nullable(),
  endDate: yup.string().nullable(),
});

const useEmployeeMyRequests = (type, status, filterValues = null) => {
  const account = useContext(AccountContext);
  //get based on type of the request
  //get by status of the request
  //can filter based on date range by the created date or requested date property
  if (!type || !status)
    throw new Error(
      'useEmployeeRequest hook: Unmet arguments- type and status argument is required!',
    );
  if (filterValues !== null) {
    filterValuesSchema.validate(filterValues).catch(() => {
      throw new Error(
        'useEmployeeRequest hook: Unmet argument- filterValues must have startDate and endDate values!',
      );
    });
  }

  return useQuery(GET_EMPLOYEE_REQUEST_LEAVE, {
    variables: {
      type,
      status,
      datesType: [],
      withPay: [],
      approvals: [],
      ...filterValues,
      requestedBy: account?.data?.id,
      size: 25,
      page: 0,
    },
    fetchPolicy: 'network-only',
  });
};

export default useEmployeeMyRequests;
