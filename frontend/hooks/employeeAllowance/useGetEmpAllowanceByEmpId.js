import { useQuery, gql } from '@apollo/react-hooks';
/*

Description: This hook is for fetching one employee allowance 
Parameters: employee id

*/

const useGetEmpAllowanceByEmpId = ({ id, ...params }) => {
  const { data, loading, refetch } = useQuery(
    gql`
      query($id: UUID) {
        employee(id: $id) {
          fullName
          totalAllowance
          employeeAllowance {
            id
            name
            amount
            taxable
            notes
          }
        }
      }
    `,
    { variables: { id: id }, ...params },
  );
  return { data: data?.employee, loading, refetch };
};

export default useGetEmpAllowanceByEmpId;
