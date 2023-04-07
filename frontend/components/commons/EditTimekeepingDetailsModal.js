import { HRInput, HRForm, HRButton, HRTextarea } from '@components/commons';
import { Spin, DatePicker, Modal, message } from 'antd';
import React from 'react';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, gql } from '@apollo/react-hooks';

const GET_TIMEKEEPING_DETAILS = gql`
  query($id: UUID) {
    timekeeping: getTimekeepingById(id: $id) {
      id
    }
  }
`;

const UPDATE_TIMEKEEPING_DETAILS = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar) {
    result: updateTimekeepingDetails(id: $id, fields: $fields) {
      message
      success
    }
  }
`;

export default function EditTimekeepingDetailsModal({ visible, setIsModalVisible, timekeepingId }) {
  const methods = useForm({ defaultValues: { title: '', dates: null } });

  const { data, loading, refetch } = useQuery(GET_TIMEKEEPING_DETAILS, {
    variables: {
      id: timekeepingId,
    },
    fetchPolicy: 'network-only',
    onCompleted: (result) => {
      let values = {
        title: result?.timekeeping?.title,
        description: result?.timekeeping?.description,
        dates: [
          result?.timekeeping?.dateStart ? moment(result?.timekeeping?.dateStart) : null,
          result?.timekeeping?.dateEnd ? moment(result?.timekeeping?.dateEnd) : null,
        ],
        description: result?.timekeeping?.description,
      };
      methods.reset({
        ...values,
      });
    },
  });

  const [updateTimekeepingDetails, { loading: loadingUpdateTimekepeing }] = useMutation(
    UPDATE_TIMEKEEPING_DETAILS,
    {
      onCompleted: (data) => {
        message.success(data.result?.message);
        refetch();
      },
      onError: (error) => {
        message.error('Something went wrong. Please try again later.');
      },
    },
  );

  const onSubmit = (values) => {
    let fields = {
      title: values?.title,
      description: values?.description,
      dateStart: moment(values?.dates[0]).startOf('day').utc().format(),
      dateEnd: moment(values?.dates[1]).endOf('day').utc().format(),
    };

    updateTimekeepingDetails({
      variables: {
        fields: fields,
        id: data?.timekeeping.id,
      },
    });
    methods.reset({
      ...values,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  return (
    <Modal
      title="Edit Timekeeping Details"
      visible={visible}
      destroyOnClose={true}
      footer={null}
      onCancel={handleCancel}
    >
      <Spin spinning={loading}>
        <HRForm onSubmit={onSubmit} methods={methods}>
          <HRInput name="title" label="Title" allowClear />
          <Controller
            name="dates"
            rules={{
              validate: (value) => {
                if (!value) return 'please select date range';
                if (!Array.isArray(value)) {
                  return 'please select date range';
                } else if (Array.isArray(value)) {
                  if (value[0] === null || value[1] === null) return 'please select date range';
                }
                return true;
              },
            }}
            render={(inputProps) => (
              <>
                <label>
                  Date Range
                  <label style={{ color: 'red' }}>
                    {methods.errors?.dates && `(${methods.errors?.dates?.message})`}
                  </label>
                </label>
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  format="MMMM D, YYYY"
                  onCalendarChange={handleDateChange}
                  value={inputProps.value}
                  onBlur={inputProps.onBlur}
                  allowClear
                  allowEmpty
                />
              </>
            )}
          />
          <HRTextarea name="description" label="Description" allowClear style={{ width: '100%' }} />

          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <HRButton style={{ marginRight: 10 }} onClick={handleCancel}>
              Cancel
            </HRButton>
            <HRButton htmlType="submit" type="primary" loading={loadingUpdateTimekepeing}>
              Submit
            </HRButton>
          </div>
        </HRForm>
      </Spin>
    </Modal>
  );
}
