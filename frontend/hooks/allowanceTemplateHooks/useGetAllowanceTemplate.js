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

const useGetAllowanceTemplate = ({ id, ...params }) => {
  const { data, loading, refetch } = useQuery(
    gql`
      query($id: UUID) {
        data: getOneAllowanceTemplate(id: $id) {
          response {
            id
            name
            active
            total
            templates {
              active
              notes
              allowance {
                id
                amount
                taxable
                name
                notes
              }
            }
          }
          success
        }
      }
    `,
    { variables: { id: id }, ...params },
  );
  return { data: data?.data?.response, loading, refetch };
};

export default useGetAllowanceTemplate;
