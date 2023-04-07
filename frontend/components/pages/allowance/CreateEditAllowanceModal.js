import {
  HRButton,
  HRForm,
  HRInput,
  HRInputNumber,
  HRSelect,
  HRTextarea,
} from '@components/commons';
import { Modal, Spin } from 'antd';
import { useForm } from 'react-hook-form';
import allowanceHooks from '@hooks/Allowance';

export default function CreateEditAllowanceModal({
  selectedAllowance,
  title,
  visible,
  setIsModalVisible,
  upsertCallback,
}) {
  const queryCallback = (result) => {
    let values = {
      name: result?.name,
      amount: result?.amount,
      taxable: result?.taxable,
      notes: result?.notes,
    };
    methods.reset({
      ...values,
    });
  };
  const { useUpsertAllowance, useGetOneAllowance } = allowanceHooks;
  const { data, loading } = useGetOneAllowance(selectedAllowance, queryCallback);
  const methods = useForm({ defaultValues: {} });
  const [upsertAllowance, { loading: isUpserting }] = useUpsertAllowance(upsertCallback);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onSubmit = (values) => {
    let fields = {
      name: values?.name,
      amount: values?.amount,
      taxable: values?.taxable,
      notes: values?.notes,
    };
    upsertAllowance({ variables: { id: data?.id, fields: fields } });
  };
  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      destroyOnClose={true}
      onCancel={handleCancel}
    >
      <Spin spinning={loading}>
        <HRForm onSubmit={onSubmit} methods={methods}>
          <HRInput
            name="name"
            label="Name"
            allowClear
            rules={{
              required: true,
            }}
          />
          <HRInputNumber
            name="amount"
            label="Amount"
            formatter={(value) => `₱ ${value}`}
            rules={{
              required: true,
            }}
          />
          <HRSelect
            label="Taxable"
            name="taxable"
            placeholder={'Taxable'}
            allowClear={true}
            showSearch
            options={[
              { value: true, label: 'Yes' },
              { value: false, label: 'No' },
            ]}
            rules={{
              validate: (value) => {
                if (value == true || value == false) {
                  return true;
                } else {
                  return false;
                }
              },
            }}
          />
          <HRTextarea
            name="notes"
            label="Notes"
            placeholder={'Notes'}
            allowClear
            style={{ width: '100%' }}
          />
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <HRButton style={{ marginRight: 10 }} onClick={handleCancel}>
              Cancel
            </HRButton>
            <HRButton htmlType="submit" type="primary" loading={isUpserting}>
              Submit
            </HRButton>
          </div>
        </HRForm>
      </Spin>
    </Modal>
  );
}
