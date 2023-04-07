import { useQuery, gql, useMutation } from '@apollo/react-hooks';
/*
Description: Used for getting and upserting constants by constant type
Parameters: 
1. type = the constant type you want to get/upsert e.g "leaveRequestType"
2. activeOnly = Bolean variable. Set to true to return only active constants
2. * queryParams = useQuery parameters e.g {variables, onCompleted, onError}
   * mutationParams = useMutation parameters e.g {variables, onCompleted, onError}

Notes
  3rd parameter accepts an object
  3rd parameter is optional
*/

//TODO: Create generic hook for graphql query and mutation (useQueryMutation)

const GET_SCHEDULE_TYPES = gql`
  query($type: String, $activeOnly: Boolean) {
    list: constantsByType(type: $type, activeOnly: $activeOnly) {
      id
      shortCode
      name
      value
      status
    }
  }
`;

const UPSERT_SCHEDULE_TYPES = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar, $type: String) {
    data: upsertConstantsByType(type: $type, id: $id, fields: $fields) {
      message
      success
    }
  }
`;

const useConstantsService = (
  type,
  activeOnly = false,
  { queryParams, mutationParams } = { queryParams, mutationParams },
) => {
  const { data, loading: loadingJobTitles, refetch } = useQuery(GET_SCHEDULE_TYPES, {
    ...queryParams,
    variables: { type, activeOnly },
  });

  const [upsert, { loading: loadingUpsert }] = useMutation(UPSERT_SCHEDULE_TYPES, {
    ...mutationParams,
    variables: { ...mutationParams?.variables, type: type },
  });

  return { data, loading: loadingJobTitles || loadingUpsert, refetch, upsert };
};

export default useConstantsService;
