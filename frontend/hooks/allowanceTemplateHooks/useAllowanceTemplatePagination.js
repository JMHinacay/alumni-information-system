import { useQuery, gql } from '@apollo/react-hooks';
/*
Description: This hook is for fetching paginated allowance templates
Parameters: same with the parameters of useMutation hook except the query

NOTE: The variables object must have the following properties:
    filter (string)     - used for filtering template name
    showActive (boolean)- show only active or all templates
    size (int)          - page size
    page (int)          - page number

Sample hook usage: 
  const { data, loading, refetch } = useAllowanceTemplatePagination({
    variables: {  //the values are hardcoded here, but they should by dynamic by using useState
      filter: '',
      showActive: true,
      size: 25,
      page: 0
    },
    onCompleted: (result)=>{
      //logic here
    },
    onError: ()=>{
      //logic here
    },
    });
*/

const useAllowanceTemplatePagination = (params) => {
  const { data, loading, refetch } = useQuery(
    gql`
      query($filter: String, $showActive: Boolean, $size: Int, $page: Int) {
        list: getAllowanceTemplatesByPagination(
          filter: $filter
          page: $page
          pageSize: $size
          showActive: $showActive
        ) {
          totalElements
          content {
            id
            name
            total
            active
            createdDate
            lastModifiedDate
            lastModifiedBy
          }
        }
      }
    `,
    {
      ...params,
    },
  );
  return { data: data?.list, loading, refetch }; //we are only exposing the data, loading, and refetch properties of useQuery
};

export default useAllowanceTemplatePagination;
