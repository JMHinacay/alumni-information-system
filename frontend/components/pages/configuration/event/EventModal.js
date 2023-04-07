import { useEffect } from 'react';
import { HRModal, HRInput, HRForm, HRDatePicker, HRSelect, HRButton } from '@components/commons';
import { HolidayTransferability, HolidayType } from '@utils/constants';
import { useForm } from 'react-hook-form';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { message } from 'antd';
import moment from 'moment';

const CREATE_EVENT = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertEventCalendar(id: $id, fields: $fields) {
      payload {
        id
        startDate
        name
        endDate
        fixed
        holidayType
      }
      message
      success
    }
  }
`;

const DELETE_EVENT = gql`
  mutation($id: UUID) {
    data: deleteEventCalendar(id: $id) {
      message
      success
    }
  }
`;

const EventModal = (props) => {
  const methods = useForm();
  const [upsertEvent, { loading }] = useMutation(CREATE_EVENT, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        message.success(data?.message ?? 'Successfully created event calendar.');
        props.handleModal(
          null,
          true,
          { clearPendingEvents: true, isEdit: props?.selectedEvent?.id ? true : false },
          data?.payload,
        );
      } else {
        message.error(data?.message ?? 'Failed created event calendar.');
      }
    },
  });
  const [deleteEvent, { loading: loadingDeleteEvent }] = useMutation(DELETE_EVENT, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        message.success(data?.message ?? 'Successfully created event calendar.');
        props.handleModal(
          null,
          true,
          { clearPendingEvents: true, removeOneEvent: true },
          props.selectedEvent,
        );
      } else {
        message.error(data?.message ?? 'Failed created event calendar.');
      }
    },
  });

  useEffect(() => {
    if (props.visible) methods.reset({ ...props.selectedEvent });
  }, [props.selectedEvent, props.visible]);

  const handleSubmit = (values) => {
    let startDate = moment(values?.startDate).startOf('day').utc().format();
    let endDate = moment(values?.startDate).startOf('day').add(1, 'day').utc().format();
    upsertEvent({
      variables: {
        id: props?.selectedEvent?.id ? props?.selectedEvent?.id : null,
        fields: { ...values, startDate, endDate },
      },
    });
  };

  const onDeleteEvent = () => {
    deleteEvent({
      variables: { id: props?.selectedEvent?.id },
    });
  };

  return (
    <HRModal
      title={`${props?.selectedEvent?.id ? 'Edit' : 'New'} Event`}
      visible={props.visible}
      footer={null}
      onCancel={() => props.handleModal(null, false, { clearPendingEvents: true })}
    >
      <HRForm methods={methods} onSubmit={handleSubmit}>
        <HRInput name="name" label="Event Title" rules={{ required: true }} />
        <HRDatePicker name="startDate" label="Start Date" rules={{ required: true }} />
        <HRDatePicker name="endDate" label="End Date" rules={{ required: true }} />
        <HRSelect
          name="fixed"
          label="Transferability"
          options={HolidayTransferability}
          rules={{ required: true }}
        />
        <HRSelect
          name="holidayType"
          label="Holiday Type"
          options={HolidayType}
          rules={{ required: true }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: props?.selectedEvent?.id ? 'space-between' : 'flex-end',
            marginTop: 20,
          }}
        >
          {props?.selectedEvent?.id && (
            <HRButton
              type="primary"
              danger
              style={{ marginRight: 10 }}
              onClick={onDeleteEvent}
              allowedPermissions={['manage_holiday_event']}
            >
              Delete
            </HRButton>
          )}
          <div>
            <HRButton
              style={{ marginRight: 10 }}
              onClick={() => props.handleModal(null, false, { clearPendingEvents: true })}
            >
              Cancel
            </HRButton>
            <HRButton
              type="primary"
              htmlType="submit"
              allowedPermissions={['manage_holiday_event']}
            >
              Submit
            </HRButton>
          </div>
        </div>
      </HRForm>
    </HRModal>
  );
};

export default EventModal;
