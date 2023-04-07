import { useQuery, gql } from '@apollo/react-hooks';
/*

Description: For fetching departments whose ids falls within an array of UUIDs
Parameters: same with the parameters of useMutation hook except the query

NOTE: The variables object must have the following properties:
    ids ([UUID])        - array of the employee ids to be fetched

*/

const useGetDepartmentsInId = (params) => {
  const { data, loading, refetch } = useQuery(
    gql`
      query($ids: [UUID]) {
        departments: getDepartmentsInId(ids: $ids) {
          id
          departmentCode
          departmentName
          departmentDesc
          parentDepartment {
            id
            departmentName
            departmentCode
          }
        }
      }
    `,
    { ...params },
  );
  return { data, loading, refetch };
};

export default useGetDepartmentsInId;
