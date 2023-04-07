import { useQuery, gql } from '@apollo/react-hooks';
/*

Description: For fetching employees whose ids falls within an array of UUIDs. Results are filtered and paginated
Parameters: same with the parameters of useMutation hook except the query

NOTE: The variables object must have the following properties:
    filter (string)     - used for filtering template name
    department (int)    - department id of the employees to be fetched
    ids ([UUID])        - array of the employee ids to be fetched
    size (int)          - page size
    page (int)          - page number
*/

const useGetEmployeesInIds = (params) => {
  const { data, loading, refetch } = useQuery(
    gql`
      query($filter: String, $department: UUID, $ids: [UUID], $page: Int, $size: Int) {
        employees: getEmployeesInIdsByFilter(
          filter: $filter
          department: $department
          ids: $ids
          page: $page
          size: $size
        ) {
          content {
            id
            fullName
            gender
            department {
              id
              departmentName
            }
          }
          totalElements
        }
      }
    `,
    { ...params },
  );
  return { data, loading, refetch };
};

export default useGetEmployeesInIds;
