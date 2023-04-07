import { gql, useMutation } from '@apollo/react-hooks';
/*
Description: This hook is for fetching paginated allowance templates
Parameters: same with the parameters of useQuery hook except the query

Sample hook usage: 
  const { upsertAllowanceTemplate, loading } = useUpsertAllowanceTemplate({
    onCompleted: (result)=>{
      //logic here
    },
  });
}
  
*/
const useUpsertAllowanceTemplate = (params) => {
  const [upsertAllowanceTemplate, { loading }] = useMutation(
    gql`
      mutation(
        $template_fields: Map_String_ObjectScalar
        $template_id: UUID
        $item_fields: [Map_String_ObjectScalar]
      ) {
        data: upsertAllowanceTemplate(
          template_fields: $template_fields
          template_id: $template_id
          item_fields: $item_fields
        ) {
          payload {
            id
          }
          message
          success
        }
      }
    `,
    {
      ...params,
    },
  );

  return { upsertAllowanceTemplate, loading };
};

export default useUpsertAllowanceTemplate;
