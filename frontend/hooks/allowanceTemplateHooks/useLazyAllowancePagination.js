import { useLazyQuery } from '@apollo/react-hooks';
import { GET_ALLOWANCE_PAGINATION } from '@hooks/Allowance/useAllowancePagination';
/*
Description: This hook is for lazy fetching allowances
Parameters: same with the parameters of useLazyQuery hook except the query

NOTE: The variables object must have the following properties:
    filter (string)     - used for filtering template name
    pageSize (int)      - page size
    page (int)          - page number


Sample hook usage: 
  const { data, loading: loadingAllowanceTemplate, refetch } = useGetAllowanceTemplate({
    id: router?.query.id, //we directly pass the id instead of putting it inside an object
    skip: true,
    onCompleted: ()=>{
      //logic here
    },
    onError: ()=>{
      //logic here
    },
  });
*/
const useLazyAllowancePagination = (params) => {
  const [loadAllowanceTemplates, { data, loading }] = useLazyQuery(GET_ALLOWANCE_PAGINATION, {
    ...params,
  });
  return {
    loadAllowanceTemplates,
    data: data?.getAllowanceByPagination,
    loading,
  };
  //we are only exposing the loadAllowanceTemplates, data, and loading of useLazyQuery
};

export default useLazyAllowancePagination;
