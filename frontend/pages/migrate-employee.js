import { gql, useMutation } from '@apollo/react-hooks';
import { HRButton, HRForm, HRInput } from '@components/commons';
import { message } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';

const MIGRATE_EMPLOYEE_ID = gql`
  mutation($list: [Map_String_ObjectScalar]) {
    data: migrateEmployee(list: $list) {
      success
      message
    }
  }
`;

export default function MigrateEmployeeIDPage(props) {
  const methods = useForm({ defaultValues: { employeeId: null } });

  const [migrateEmployeeId, { loading }] = useMutation(MIGRATE_EMPLOYEE_ID, {
    onCompleted: (value) => {
      const data = value?.data || {};
      if (data?.success) {
        message.success(data?.message);
      } else {
        message.error(data?.message);
      }
    },
  });

  const handleSubmit = ({ employeeId }) => {
    migrateEmployeeId({ variables: { list: JSON.parse(employeeId) } });
  };

  return (
    <div>
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <HRInput name="employeeId" />
        <HRButton htmlType="submit" type="primary" loading={loading}>
          Submit
        </HRButton>
      </HRForm>
    </div>
  );
}
