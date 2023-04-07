import { useEffect } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { message, Spin } from 'antd';
const { HRModal, HRForm, HRInput, HRButton } = require('@components/commons');
const { useForm } = require('react-hook-form');

const BIOMETRIC_SERVICE_CONFIG = gql`
  query {
    data: get_biometric_service_config {
      payload {
        id
        ipAddress
        port
      }
      success
    }
  }
`;

const UPSERT_BIOMETRIC_SERVICE_CONFIG = gql`
  mutation($fields: Map_String_ObjectScalar) {
    data: upsert_biometric_service_config(fields: $fields) {
      payload {
        id
        ipAddress
        port
      }
      message
      success
    }
  }
`;

const BiometricsServiceSettingsModal = ({ visible, ...props }) => {
  const methods = useForm();
  const [
    getBiometricsConfig,
    { data: biometricsConfig, loading: loadingGetBiometricsConfig },
  ] = useLazyQuery(BIOMETRIC_SERVICE_CONFIG, {
    onCompleted: (result) => {
      methods.reset({ ...result?.data?.payload });
    },
  });

  useEffect(() => {
    if (visible) getBiometricsConfig();
  }, [visible]);

  const [saveBiometricsConfig, { loading: loadingSaveBiometricsConfig }] = useMutation(
    UPSERT_BIOMETRIC_SERVICE_CONFIG,
    {
      onCompleted: (value) => {
        const data = value?.data || {};
        if (data?.success) {
          message.success(data?.message || 'Successfully saved biometrics config');
          props?.handleModal();
        } else {
          message.error(data?.message || 'Failed to save biometrics config');
        }
      },
    },
  );

  const handleSubmit = (values) => {
    saveBiometricsConfig({
      variables: {
        fields: { ...(biometricsConfig?.data?.payload || {}), ...values },
      },
    });
  };

  return (
    <HRModal
      visible={visible}
      title="Biometrics Service Settings"
      footer={null}
      onCancel={props?.handleModal}
    >
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Spin spinning={loadingGetBiometricsConfig}>
          <HRInput name="ipAddress" label="PC/VM IP Address" rules={{ required: true }} />
          <HRInput name="port" label="Port" rules={{ required: true }} />
        </Spin>
        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
          <HRButton onClick={props.handleModal} style={{ marginRight: 10 }}>
            Cancel
          </HRButton>
          <HRButton htmlType="submit" type="primary" loading={loadingSaveBiometricsConfig}>
            Save
          </HRButton>
        </div>
      </HRForm>
    </HRModal>
  );
};

export default BiometricsServiceSettingsModal;
