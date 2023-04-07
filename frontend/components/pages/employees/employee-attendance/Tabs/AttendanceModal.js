import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { HRButton, HRDatePicker, HRForm, HRInput, HRModal, HRSelect } from '@components/commons';
import { Input, message, Spin, Tag, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const GET_ATTENDANCE = gql`
  query($id: UUID!) {
    log: getOneRawLog(id: $id) {
      id
      additionalNote
      attendance_time
      original_attendance_time
      isIgnored
      isManual
      method
      source
      type
      originalType
      createdBy
      createdDate
      lastModifiedBy
      lastModifiedDate
    }
  }
`;

const UPSERT_EMPLOYEE_ATTENDANCE = gql`
  mutation($id: UUID, $employee: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertEmployeeAttendance(id: $id, employee: $employee, fields: $fields) {
      payload {
        additionalNote
        attendance_time
        createdBy
        createdDate
        id
        isIgnored
        isManual
        lastModifiedBy
        lastModifiedDate
        method
        original_attendance_time
        source
        type
        originalType
      }
      success
      message
    }
  }
`;

const AttendanceModal = (props) => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      attendance_time: null,
      additionalNote: '',
      type: null,
    },
  });

  const [getAttendance, { data, loading, refetch }] = useLazyQuery(GET_ATTENDANCE, {
    onCompleted: (result) => {
      let { log } = result || {};
      // console.log('sdf', log);
      methods?.reset({
        ...log,
      });
    },
  });

  const [upsertEmployeeAttendance, { loading: loadingUpsertEmployeeAttendance }] = useMutation(
    UPSERT_EMPLOYEE_ATTENDANCE,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully updated employee attendance.');
          props?.handleModal(null, true);
        } else message.error(data?.message ?? 'Failed to update employee attendance.');
      },
    },
  );
  const [revertEmployeeAttendance, { loading: loadingRevertEmployeeAttendance }] = useMutation(
    UPSERT_EMPLOYEE_ATTENDANCE,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully updated employee attendance.');
          props?.handleModal(null, true);
        } else message.error(data?.message ?? 'Failed to update employee attendance.');
      },
    },
  );

  useEffect(() => {
    if (props?.visible) {
      if (props?.selectedAttendance?.id) {
        getAttendance({
          variables: {
            id: props?.selectedAttendance?.id,
          },
        });
      }
    } else {
      methods?.reset({});
    }
  }, [props?.visible, props?.selectedAttendance]);

  const handleSubmit = (values) => {
    let log = { ...values, isManual: true };
    if (props.selectedAttendance)
      log = { ...data?.log, ...values, isManual: data?.log?.id ? log?.isManual : true };

    upsertEmployeeAttendance({
      variables: {
        id: log?.id,
        employee: router?.query?.id || null,
        fields: { ...log },
      },
    });
  };
  const handleRevert = () => {
    let values = methods?.getValues();
    let log = { ...data?.log, ...values, isManual: data?.log?.id ? log?.isManual : true };
    revertEmployeeAttendance({
      variables: {
        id: log?.id,
        employee: router?.query?.id || null,
        fields: {
          ...log,
          attendance_time: data?.log?.original_attendance_time,
          type: data?.log?.originalType,
        },
      },
    });
  };

  const types = [
    {
      value: 'IN',
      label: 'IN',
    },
    {
      value: 'OUT',
      label: 'OUT',
    },
  ];

  let isEdited =
    (data?.log?.type !== data?.log?.originalType ||
      data?.log?.attendance_time !== data?.log?.original_attendance_time) &&
    !data?.log?.isManual;
  return (
    <HRModal
      title={
        <>
          <Typography.Text style={{ marginRight: 5 }}>
            {`${props?.selectedAttendance?.id ? 'Edit' : 'Add'} Raw Log`}
          </Typography.Text>
          {isEdited && <Tag color="green">EDITED</Tag>}
        </>
      }
      visible={props?.visible}
      footer={null}
      onCancel={() => props?.handleModal(null, false)}
    >
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Spin spinning={loading}>
          <HRDatePicker
            name="attendance_time"
            label="Date/Time"
            placeholder="Date/Time"
            showTime={{ format: 'h:mm:ss A' }}
            format="MMMM D, YYYY, h:mm:ss A"
          />
          <HRSelect name="type" label="Type" placeholder={'Type'} options={types} />

          <HRInput
            custom={Input.TextArea}
            name="additionalNote"
            label="Notes"
            placeholder="Notes"
          />
        </Spin>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <HRButton style={{ marginRight: 10 }} onClick={() => props?.handleModal(null, false)}>
            Cancel
          </HRButton>
          {!data?.log?.isManual && (
            <HRButton
              style={{ marginRight: 10 }}
              onClick={handleRevert}
              type="primary"
              ghost
              disabled={!isEdited}
              loading={loadingRevertEmployeeAttendance}
            >
              Revert
            </HRButton>
          )}
          <HRButton type="primary" htmlType="submit" loading={loadingUpsertEmployeeAttendance}>
            Submit
          </HRButton>
        </div>
      </HRForm>
    </HRModal>
  );
};

export default AttendanceModal;
