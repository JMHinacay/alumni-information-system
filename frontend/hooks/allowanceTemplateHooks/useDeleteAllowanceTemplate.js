import { gql, useMutation } from '@apollo/react-hooks';
/*
Description: This hook is for fetching paginated allowance templates
Parameters: same with the parameters of useQuery hook except the query
Sample hook usage: 
  const { useDeleteAllowanceTemplate, loading } = useUpsertAllowanceTemplate({
    onCompleted: (result)=>{
      //logic here
    },
  });
}
  
*/
const useDeleteAllowanceTemplate = (params) => {
  const [deleteAllowanceTemplate, { loading }] = useMutation(
    gql`
      mutation($id: UUID) {
        data: deleteAllowanceTemplates(id: $id) {
          message
          success
        }
      }
    `,
    {
      ...params,
    },
  );

  return { deleteAllowanceTemplate, loading };
  //we are only exposing the deleteAllowanceTemplate, and loading of useMutation
};

export default useDeleteAllowanceTemplate;
