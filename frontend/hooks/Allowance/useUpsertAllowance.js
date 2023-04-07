import { useMutation, gql } from '@apollo/react-hooks';

/**
 * This hook is used to update/create an allowance.
 * Note: if id is present will update an allowance, else will create a new allowance.
 * @param {function} callback - the function to implement after completing mutation.
 *
 * sample usage -
 * const [upsertAllowance, { loading }] = useUpsertAllowance(upsertCallback);
 * upsertAllowance({ variables: { id: id, fields: fields } });
 *
 */
const useUpsertAllowance = (callback) => {
  return useMutation(
    gql`
      mutation($id: UUID, $fields: Map_String_ObjectScalar) {
        data: upsertAllowance(id: $id, fields: $fields) {
          response {
            id
          }
          success
          message
        }
      }
    `,
    {
      onCompleted: (result) => {
        if (callback) callback(result);
      },
    },
  );
};

export default useUpsertAllowance;
