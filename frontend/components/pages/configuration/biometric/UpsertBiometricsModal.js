import { useMutation } from '@apollo/react-hooks';
import { HRButton, HRForm, HRInput, HRModal } from '@components/commons';
import { Input, message } from 'antd';
import { gql } from 'apollo-boost';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const UPSERT_BIOMETRICS = gql`
  mutation($fields: Map_String_ObjectScalar) {
    data: add_biometric_device(fields: $fields) {
      success
      message
    }
  }
`;

const UpsertBiometricsModal = ({ visible, selectedData, ...props }) => {
  const methods = useForm();
  const [upsertBiometrics, { loading: loadingUpsertBiometrics }] = useMutation(UPSERT_BIOMETRICS, {
    onCompleted: (value) => {
      const data = value?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved biometrics');
        props?.handleModal({}, true);
      } else {
        message.error(data?.message ?? 'Failed to save biometrics');
      }
    },
  });

  const handleSubmit = (values) => {
    upsertBiometrics({
      variables: { fields: { ...selectedData, ...values } },
    });
  };

  useEffect(() => {
    if (visible) {
      methods.reset({ ...selectedData });
    }
  }, [visible, selectedData]);

  return (
    <HRModal
      title={`${selectedData?.id ? 'Edit' : 'Add'} Biometrics Device`}
      visible={visible}
      footer={null}
      onCancel={() => props.handleModal({}, false)}
    >
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <HRInput
          name="deviceName"
          placeholder="Device Name"
          label="Device Name"
          rules={{ required: true }}
        />
        <HRInput
          name="ipAddress"
          placeholder="Device IP Address"
          label="IP Address"
          rules={{ required: true }}
        />
        <HRInput name="port" placeholder="Device Port" label="Port" rules={{ required: true }} />
        <HRInput
          name="deviceUsername"
          placeholder="Device Username"
          label="Username"
          rules={{ required: true }}
        />
        <HRInput
          as={Input.Password}
          name="devicePassword"
          placeholder="Device Password"
          label="Password"
          rules={{ required: true }}
        />
        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
          <HRButton onClick={() => props.handleModal({}, false)} style={{ marginRight: 10 }}>
            Cancel
          </HRButton>
          <HRButton htmlType="submit" type="primary" loadaing={loadingUpsertBiometrics}>
            Add Device
          </HRButton>
        </div>
      </HRForm>
    </HRModal>
  );
};

export default UpsertBiometricsModal;
