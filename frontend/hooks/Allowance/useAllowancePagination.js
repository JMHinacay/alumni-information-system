import { useQuery, gql } from '@apollo/react-hooks';

export const GET_ALLOWANCE_PAGINATION = gql`
  query($page: Int, $pageSize: Int, $filter: String) {
    getAllowanceByPagination(page: $page, pageSize: $pageSize, filter: $filter) {
      content {
        id
        name
        payFrequency
        taxable
        notes
        payrollType
        amount
        lastModifiedBy
      }
      totalElements
    }
  }
`;
/**
 * This hook is used to get Allowances in pagination format.
 * @param {integer} page - the index of the page (Pages are zero indexed)
 * thus providing zero will return the first page.
 * @param {integer} pageSize - the size of the page to be returned.
 * @param {string} filter - the name of the allowance to be filtered.
 * 
 * sample usage - 
    const {data, loading, refetch } = useAllowancePagination( page, pageSize, filter);
 */
const useAllowancePagination = (page, pageSize, filter) => {
  const { data, loading, refetch } = useQuery(GET_ALLOWANCE_PAGINATION, {
    variables: { page: page, pageSize: pageSize, filter: filter },
  });
  return {
    data: data?.getAllowanceByPagination,
    loading,
    refetch,
  };
};

export default useAllowancePagination;

// only exposing data, refetch, and loading properties from useQuery
