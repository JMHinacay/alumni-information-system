import { useMutation, gql } from '@apollo/react-hooks';
import { message } from 'antd';

/**
 * This hook is used to delete an allowance.
 * sample usage -
 * const [deleteAllowance, { loading: isDeleting }] = useDeleteAllowance();
 * deleteAllowance({ variables: { id: id } })
 */
const useDeleteAllowance = () => {
  return useMutation(
    gql`
      mutation($id: UUID) {
        deleteAllowance(id: $id) {
          response
          success
          message
        }
      }
    `,
    {
      onCompleted: (result) => {
        message[result.deleteAllowance.success ? 'success' : 'error'](
          result.deleteAllowance.success
            ? result.deleteAllowance.message
            : 'Cannot delete allowance if it is used as an allowance item.',
        );
      },
    },
  );
};

export default useDeleteAllowance;
