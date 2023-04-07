import { useEffect, useState } from 'react';
import { HRButton, HRForm, HRInput, HRModal } from '@components/commons';
import React from 'react';
import { Alert, message, TimePicker, Typography } from 'antd';
import { BlockPicker, SliderPicker } from 'react-color';
import { useForm, Controller } from 'react-hook-form';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import {
  REST_DAY_SCHEDULE_COLOR,
  REST_DAY_SCHEDULE_LABEL,
  REST_DAY_SCHEDULE_TITLE,
} from '@utils/constants';
import {
  isTimeLessThan,
  isTimeGreaterThanOrEqual,
  isTimeLessThanOrEqual,
  isTimeGreaterThan,
} from '@utils/moment';

const ADD_DEPARTMENT_SCHEDULE = gql`
  mutation($id: UUID, $department_id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertDepartementSchedule(id: $id, department_id: $department_id, fields: $fields) {
      payload {
        id
        label
        title
        dateTimeStart
        dateTimeEnd
        mealBreakStart
        mealBreakEnd
        color
      }
      success
      message
    }
  }
`;

const DepartmentScheduleFormModal = ({ visible, ...props }) => {
  const methods = useForm({
    defaultValues: {
      dateTimeStartRaw: null,
      dateTimeEndRaw: null,
      mealBreakStart: null,
      mealBreakEnd: null,
    },
  });
  const [addDepartmentSchedule, { loading: loadingAddDepartmentSchedule }] = useMutation(
    ADD_DEPARTMENT_SCHEDULE,
    {
      onCompleted: (value) => {
        const data = value?.data || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully created department schedule');
          props?.handleModal({}, true);
        } else {
          message.error(data?.message ?? 'Failed to create department schedule');
        }
      },
    },
  );

  useEffect(() => {
    if (visible) {
      if (props?.value) {
        const {
          title,
          label,
          dateTimeStartRaw,
          dateTimeEndRaw,
          color,
          mealBreakStart,
          mealBreakEnd,
        } = props?.value || {};
        methods.reset({
          title,
          label,
          dateTimeStartRaw,
          dateTimeEndRaw,
          mealBreakStart,
          mealBreakEnd,
          color: { hex: color },
        });
      }
    } else methods.reset({});
  }, [visible, props?.selectedRow?.value]);

  const handleSubmit = (values) => {
    // console.log(values);
    let dateTimeStartRaw = moment(values?.dateTimeStartRaw).utc().format();
    let dateTimeEndRaw = moment(values?.dateTimeEndRaw).utc().format();
    let mealBreakStart = values?.mealBreakStart
      ? moment(values?.mealBreakStart).utc().format()
      : null;
    let mealBreakEnd = values?.mealBreakStart ? moment(values?.mealBreakEnd).utc().format() : null;
    addDepartmentSchedule({
      variables: {
        id: props?.value?.id ?? null,
        department_id: props?.department,
        fields: {
          label: values?.label || null,
          title: values?.title || null,
          dateTimeStartRaw,
          dateTimeEndRaw,
          mealBreakEnd,
          mealBreakStart,
          color: values?.color?.hex,
        },
      },
    });
  };

  let { dateTimeStartRaw, dateTimeEndRaw } = methods.watch(['dateTimeStartRaw', 'dateTimeEndRaw']);
  let isLessThan = false;
  if (dateTimeEndRaw) isLessThan = isTimeGreaterThanOrEqual(dateTimeStartRaw, dateTimeEndRaw);

  return (
    <HRModal
      title="Create Department Schedule"
      visible={visible}
      footer={null}
      onCancel={() => props?.handleModal({}, false)}
      width="600px"
    >
      <Alert
        style={{ marginBottom: 20 }}
        message="Reminder"
        description={
          <Typography.Text>
            The <Typography.Text strong>"Overtime"</Typography.Text> title,{' '}
            <Typography.Text strong>"{REST_DAY_SCHEDULE_TITLE}"</Typography.Text> title,{' '}
            <Typography.Text strong>"{REST_DAY_SCHEDULE_LABEL}"</Typography.Text> label and{' '}
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: REST_DAY_SCHEDULE_COLOR,
                display: 'inline-block',
                borderRadius: 30,
              }}
            />{' '}
            color(<Typography.Text strong>{REST_DAY_SCHEDULE_COLOR}</Typography.Text>) are reserved
            for the Rest day. Please refrain from using them.
          </Typography.Text>
        }
        type="info"
        showIcon
      />
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <HRInput
          label="Schedule Title"
          name="title"
          rules={{
            required: true,
            validate: (value) => {
              if (value?.toUpperCase() === 'Overtime'.toUpperCase())
                return `${value} is a reserved title`;
              else if (value?.toUpperCase() === REST_DAY_SCHEDULE_TITLE.toUpperCase())
                return `${REST_DAY_SCHEDULE_TITLE} is reserved title`;
            },
          }}
        />
        <HRInput label="Schedule Label" name="label" rules={{ required: true }} />

        <div style={{ marginBottom: 10 }}>
          <Typography.Text>
            Time Start
            <label style={{ color: 'red' }}>
              {methods?.errors?.dateTimeStartRaw?.message &&
                `(${methods?.errors?.dateTimeStartRaw?.message})`}
            </label>
          </Typography.Text>
          <Controller
            name="dateTimeStartRaw"
            rules={{
              validate: (value) => (value ? true : 'required'),
            }}
            render={(inputProps) => {
              return (
                <>
                  <TimePicker
                    showNow={false}
                    use12Hours
                    format="h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps?.value && moment(inputProps?.value)}
                    // style={{ marginBottom: 10 }}
                  />
                </>
              );
            }}
          />
        </div>
        {isLessThan && (
          <Alert
            style={{ marginTop: 10 }}
            message={`If the "Time End" is less than or earlier than "Time Start", this means it will end the "Next Day".`}
            message={
              <Typography.Text>
                If the <Typography.Text strong>"Time End"</Typography.Text> is less than or earlier
                than <Typography.Text strong>"Time Start"</Typography.Text>, this means it will end
                the <Typography.Text strong>"Next Day"</Typography.Text>.
              </Typography.Text>
            }
            type="info"
            showIcon
          />
        )}
        <Typography.Text>
          Time End
          <label style={{ color: 'red' }}>
            {methods?.errors?.dateTimeEndRaw?.message &&
              `(${methods?.errors?.dateTimeEndRaw?.message})`}
          </label>
        </Typography.Text>
        <Controller
          name="dateTimeEndRaw"
          rules={{ validate: (value) => (value ? true : 'required') }}
          render={(inputProps) => {
            return (
              <>
                <TimePicker
                  showNow={false}
                  use12Hours
                  format="h:mm A"
                  style={{ width: '100%', marginBottom: 10 }}
                  {...inputProps}
                  value={inputProps?.value && moment(inputProps?.value)}
                />
              </>
            );
          }}
        />
        <Typography.Text>
          Meal Break Start
          <label style={{ color: 'red' }}>
            {methods?.errors?.mealBreakStart?.message &&
              `(${methods?.errors?.mealBreakStart?.message})`}
          </label>
        </Typography.Text>
        <Controller
          name="mealBreakStart"
          rules={{
            validate: {
              requiredWithMealBreakEnd: (value) => {
                if (!methods.getValues('mealBreakEnd')) return true;
                let breakTimeEnd = moment(methods.getValues('mealBreakEnd'));
                if (breakTimeEnd.isValid() && breakTimeEnd !== null) if (!value) return 'required';
              },
              mustBeLessThanBreakEnd: (value) => {
                if (!methods.getValues('mealBreakEnd')) return true;
                let breakEnd = moment(methods.getValues('mealBreakEnd'));
                if (breakEnd.isValid() && value !== null)
                  if (isTimeGreaterThanOrEqual(value, breakEnd))
                    return 'Must be less than Meal Break End';
              },
              mustBetweenStartAndEnd: (value) => {
                let timeStart = moment(methods.getValues('dateTimeStartRaw'));
                let timeEnd = moment(methods.getValues('dateTimeEndRaw'));
                if (!value) return true;
                if (isTimeGreaterThan(timeStart, timeEnd)) {
                  if (
                    isTimeGreaterThanOrEqual(timeStart, value) &&
                    isTimeLessThanOrEqual(value, moment().hour(23).minute(59)) &&
                    isTimeGreaterThanOrEqual(value, moment().hour(0).minute(0)) &&
                    isTimeLessThanOrEqual(timeEnd, value)
                  )
                    return 'Must be between Time Start and Time End';
                } else {
                  if (
                    isTimeGreaterThanOrEqual(timeStart, value) &&
                    isTimeLessThanOrEqual(timeEnd, value)
                  )
                    return 'Must be between Time Start and Time End';
                }
              },
            },
          }}
          render={(inputProps) => {
            return (
              <>
                <TimePicker
                  showNow={false}
                  use12Hours
                  format="h:mm A"
                  style={{ width: '100%', marginBottom: 10 }}
                  {...inputProps}
                  value={inputProps?.value && moment(inputProps?.value)}
                  allowClear
                />
              </>
            );
          }}
        />
        <Typography.Text>
          Meal Break End
          <label style={{ color: 'red' }}>
            {methods?.errors?.mealBreakEnd?.message &&
              `(${methods?.errors?.mealBreakEnd?.message})`}
          </label>
        </Typography.Text>
        <Controller
          name="mealBreakEnd"
          rules={{
            validate: {
              requiredWithMealBreakStart: (value) => {
                if (!methods.getValues('mealBreakStart')) return true;
                let breakTimeStart = moment(methods.getValues('mealBreakStart'));
                if (breakTimeStart.isValid() && breakTimeStart !== null)
                  if (!value) return 'required';
              },
              mustBeGreaterThanBreakStart: (value) => {
                if (!methods.getValues('mealBreakStart')) return true;
                let breakTimeStart = moment(methods.getValues('mealBreakStart'));
                if (breakTimeStart.isValid() && value !== null)
                  if (isTimeLessThanOrEqual(value, breakTimeStart))
                    return 'Must be greater than Meal Break Start';
              },
              mustBetweenStartAndEnd: (value) => {
                let timeStart = moment(methods.getValues('dateTimeStartRaw'));
                let timeEnd = moment(methods.getValues('dateTimeEndRaw'));
                if (!value) return true;
                if (isTimeGreaterThan(timeStart, timeEnd)) {
                  if (
                    isTimeGreaterThanOrEqual(timeStart, value) &&
                    isTimeLessThanOrEqual(value, moment().hour(23).minute(59)) &&
                    isTimeGreaterThanOrEqual(value, moment().hour(0).minute(0)) &&
                    isTimeLessThanOrEqual(timeEnd, value)
                  )
                    return 'Must be between Time Start and Time End';
                } else {
                  if (
                    isTimeGreaterThanOrEqual(timeStart, value) &&
                    isTimeLessThanOrEqual(timeEnd, value)
                  )
                    return 'Must be between Time Start and Time End';
                }
              },
            },
          }}
          render={(inputProps) => {
            return (
              <>
                <TimePicker
                  showNow={false}
                  use12Hours
                  format="h:mm A"
                  style={{ width: '100%' }}
                  {...inputProps}
                  value={inputProps?.value && moment(inputProps?.value)}
                  allowClear
                />
              </>
            );
          }}
        />
        <div style={{ marginTop: 20 }}>
          <Typography.Text>
            Schedule Color{' '}
            <label style={{ color: 'red' }}>
              {methods?.errors?.color?.message && `(${methods?.errors?.color?.message})`}
            </label>
          </Typography.Text>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <Controller
              name="color"
              rules={{
                validate: (value) => value || 'required',
              }}
              render={(inputProps) => {
                return (
                  <>
                    <BlockPicker
                      triangle="hide"
                      color={inputProps?.value?.hex || '#000'}
                      onChange={(e) => inputProps.onChange(e)}
                      width={'100%'}
                      colors={[
                        '#1abc9c',
                        '#16a085',
                        '#2ecc71',
                        '#27ae60',
                        '#3498db',
                        '#2980b9',
                        '#9b59b6',
                        '#8e44ad',
                        '#34495e',
                        '#2c3e50',
                        '#f1c40f',
                        '#f39c12',
                        '#e67e22',
                        '#d35400',
                        '#e74c3c',
                        '#c0392b',
                        '#ecf0f1',
                        '#bdc3c7',
                        '#7f8c8d',
                      ]}
                    />
                    {/* in case needed */}
                    {/* <div style={{ width: '100%' }}>
                      <SliderPicker
                        color={inputProps.value?.hex || '#000'}
                        onChange={(e) => inputProps.onChange(e)}
                        onChangeComplete={(e) => inputProps.onChange(e)}
                      />
                    </div> */}
                  </>
                );
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
          <HRButton style={{ marginRight: 10 }} onClick={() => props?.handleModal({}, false)}>
            Cancel
          </HRButton>
          <HRButton type="primary" htmlType="submit" loading={loadingAddDepartmentSchedule}>
            Submit
          </HRButton>
        </div>
      </HRForm>
    </HRModal>
  );
};

export default DepartmentScheduleFormModal;
