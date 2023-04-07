import { gql, useMutation } from '@apollo/react-hooks';
/*
Description: This hook is for updating an allowance template item's status
Parameters: same with the parameters of useQuery hook except the query
Sample hook usage: 
  const { useUpdateAllowanceTemplateItemStatus, loading } = useUpsertAllowanceTemplate({
    onCompleted: (result)=>{
      //logic here
    },
  });
}
  
*/
const useUpdateAllowanceTemplateItemStatus = (params) => {
  const [updateTemplateItemStatus, { loading }] = useMutation(
    gql`
      mutation($allowanceId: UUID, $templateId: UUID) {
        data: updateAllowanceTemplateItemStatus(
          allowanceId: $allowanceId
          templateId: $templateId
        ) {
          message
          success
        }
      }
    `,
    {
      ...params,
    },
  );

  return { updateTemplateItemStatus, loading };
  //we are only exposing the deleteAllowanceTemplate, and loading of useMutation
};

export default useUpdateAllowanceTemplateItemStatus;
