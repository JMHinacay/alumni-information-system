import { gql, useMutation } from '@apollo/react-hooks';
/*
Description: This hook is for deleting an allowance template item
Parameters: same with the parameters of useQuery hook except the query
Sample hook usage: 
  const { useDeleteAllowanceTemplateItem, loading } = useUpsertAllowanceTemplate({
    onCompleted: (result)=>{
      //logic here
    },
  });
}
  
*/
const useDeleteAllowanceTemplateItem = (params) => {
  const [deleteAllowanceTemplateItem, { loading }] = useMutation(
    gql`
      mutation($allowanceId: UUID, $templateId: UUID) {
        data: deleteAllowanceTemplateItem(allowanceId: $allowanceId, templateId: $templateId) {
          message
          success
        }
      }
    `,
    {
      ...params,
    },
  );

  return { deleteAllowanceTemplateItem, loading };
  //we are only exposing the deleteAllowanceTemplate, and loading of useMutation
};

export default useDeleteAllowanceTemplateItem;
