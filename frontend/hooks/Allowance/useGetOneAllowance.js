import { useQuery, gql } from '@apollo/react-hooks';

/**
 * This hook is used to get one allowance.
 * @param {uuid} id - the id of the allowance.
 * @param {function} callback - the function to implement after query completion.
 *
 * sample usage -
 * const { data, loading, refetch } = useGetOneAllowance(id , callback);
 */
const useGetOneAllowance = (id, callback) => {
  const { data, loading, refetch } = useQuery(
    gql`
      query($id: UUID) {
        getOneAllowance(id: $id) {
          response {
            id
            name
            payFrequency
            taxable
            notes
            payrollType
            amount
            lastModifiedBy
          }
        }
      }
    `,
    {
      variables: { id: id },
      onCompleted: (result) => {
        if (callback) callback(result?.getOneAllowance?.response);
      },
    },
  );
  return {
    data: data?.getOneAllowance?.response,
    loading,
    refetch,
  };
};

export default useGetOneAllowance;

// only exposing data, refetch, and loading properties from useQuery
