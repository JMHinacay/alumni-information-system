import { useQuery, gql } from '@apollo/react-hooks';
/*

Description: This hook is for fetching one allowance template
Parameters: same with the parameters of useQuery hook except the query

NOTE: instead of passing a variables object, we directly pass the id of the allowance template

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

const useGetAllowanceTemplateItemsByTemplateId = (params) => {
  const { data, loading, refetch } = useQuery(
    gql`
      query($id: UUID, $showActive: Boolean) {
        list: getAllowanceTemplateItemsByTemplateId(showActive: $showActive, id: $id) {
          active
          allowance {
            id
            amount
            taxable
            name
            notes
          }
        }
      }
    `,
    { ...params },
  );
  return { data: data?.list, loading, refetch };
};

export default useGetAllowanceTemplateItemsByTemplateId;
