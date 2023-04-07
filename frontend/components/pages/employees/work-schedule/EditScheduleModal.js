import { useEffect, useContext } from 'react';
import { HRButton, HRForm, HRModal, HRSelect, HRCheckbox } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import { Alert, message, Spin, DatePicker, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { gql, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { isTimeGreaterThan, isTimeGreaterThanOrEqual, isTimeLessThanOrEqual } from '@utils/moment';

const UPDATE_EMPLOYEE_SCHED = gql`
  mutation($id: UUID, $employee_id: UUID, $department: UUID, $fields: Map_String_ObjectScalar) {
    data: createEmployeeSchedule(
      id: $id
      employee_id: $employee_id
      department: $department
      fields: $fields
    ) {
      success
      message
    }
  }
`;

const GET_SCHEDULE = gql`
  query($id: UUID) {
    schedule: getSchedule(id: $id) {
      id
      color
      dateTimeEndRaw
      dateTimeStartRaw
      isOvertime
      isRestDay
      label
      locked
      mealBreakEnd
      mealBreakStart
      title
      department {
        id
        departmentName
        departmentCode
      }
    }
  }
`;

const GET_DEPARTMENT = gql`
  query {
    departments {
      value: id
      label: departmentName
    }
  }
`;

const EditScheduleModal = (props) => {
  const methods = useForm({
    defaultValues: {
      dateTimeStartRaw: null,
      dateTimeEndRaw: null,
      mealBreakStart: null,
      mealBreakEnd: null,
      department: null,
      isOIC: false,
    },
  });
  const [getDepartment, { data: departmentData, loading: loadingDepartment }] = useLazyQuery(
    GET_DEPARTMENT,
  );
  const [setEmployeeSched, { loading: loadingSetEmployeeSched }] = useMutation(
    UPDATE_EMPLOYEE_SCHED,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          props?.handleModal({}, true);
          message.success(data?.message ?? 'Successfully updated employee schedule.');
        } else message.error(data?.message ?? 'Failed to update employee schedule.');
      },
      fetchPolicy: 'no-cache',
    },
  );
  const [getSchedule, { data, loading: loadingGetSchedule }] = useLazyQuery(GET_SCHEDULE, {
    onCompleted: (result) => {
      let { schedule } = result || {};
      if (schedule?.id) {
        methods?.reset({
          dateTimeEndRaw: moment(schedule?.dateTimeEndRaw),
          dateTimeStartRaw: moment(schedule?.dateTimeStartRaw),
          mealBreakEnd: schedule?.mealBreakEnd ? moment(schedule?.mealBreakEnd) : null,
          mealBreakStart: schedule?.mealBreakStart ? moment(schedule?.mealBreakStart) : null,
          department: schedule?.department?.id,
          isOIC: schedule?.isOIC,
        });
      }
    },
  });

  const onCancelModal = () => {
    props?.handleModal({}, false);
  };

  const handleSubmit = (values) => {
    // console.log(values);
    let dateTimeStart = moment(values.dateTimeStartRaw);
    let dateTimeEnd = moment(values.dateTimeEndRaw);
    // This code is not correct, it does not match the process
    // This is removed so that users can have freedom when choosing 
    // the correct schedule.
    // dateTimeEnd.hour(values.dateTimeEndRaw.hour());
    // dateTimeEnd.seconds(values.dateTimeEndRaw.seconds());
    // dateTimeEnd.millisecond(values.dateTimeEndRaw.millisecond());
    dateTimeEnd.millisecond(0);
    // if (isTimeGreaterThan(dateTimeStart, dateTimeEnd)) {
    //   dateTimeEnd.add(1, 'day');
    // }

    // console.log(`Start: ${moment(dateTimeStart).format('dddd, MMMM D, YYYY, h:mm A')}`);
    // console.log(`End: ${moment(dateTimeEnd).format('dddd, MMMM D, YYYY, h:mm A')}`);
    // console.log(values?.department);

    let { department, departmentName, ...schedule } = props?.schedule || {};

    setEmployeeSched({
      variables: {
        id: props?.schedule?.id || null,
        employee_id: props?.employee?.id || null,
        department: values?.department,
        fields: {
          ...schedule,
          dateTimeStartRaw: dateTimeStart.utc().format(),
          dateTimeEndRaw: dateTimeEnd.utc().format(),
          isOvertime: props?.isOvertime,
          isOIC: values?.isOIC || false,
          assignedDate: props?.selectedDate ? moment(props?.selectedDate).utc().format() : null,
        },
      },
    });
  };

  useEffect(() => {
    if (props?.visible) {
      if (props?.schedule?.id) {
        //get schedule
        getDepartment();
        getSchedule({
          variables: {
            id: props?.schedule?.id,
          },
        });
      } else {
        getDepartment();
        methods?.reset({
          dateTimeStartRaw: moment(props?.selectedDate).startOf('day'),
          dateTimeEndRaw: moment(props?.selectedDate).startOf('day').add(1, 'hour').minutes(0),
          department: props?.employee?.department,
          mealBreakEnd: null,
          mealBreakStart: null,
          isOIC: false,
        });
      }
    } else methods.reset();
  }, [props?.visible, props?.schedule]);

  const disabledDate = (current) => {
    if (props?.isOvertime) {
      if (
        moment(current).startOf('day').format('MM_DD_YYYY') ==
        moment(props?.selectedDate).startOf('day').format('MM_DD_YYYY')
      )
        return false;
      return (
        current < moment(props?.selectedDate).endOf('day') ||
        current > moment(props?.selectedDate).add(1, 'days').endOf('day')
      );
    } else return false;
  };

  const disabledDateEnd = (current) => {
    if (props?.isOvertime) {
      let date = methods?.getValues('dateTimeStartRaw');
      if (
        moment(current).startOf('day').format('MM_DD_YYYY') ==
        moment(date).startOf('day').format('MM_DD_YYYY')
      )
        return false;
      return (
        current < moment(date).endOf('day') || current > moment(date).add(1, 'days').endOf('day')
      );
    } else return false;
  };

  let { dateTimeStartRaw: timeStart, dateTimeEndRaw: timeEnd } = methods.watch([
    'dateTimeStartRaw',
    'dateTimeEndRaw',
  ]);

  let isLessThan = false;
  if (timeEnd) isLessThan = isTimeGreaterThanOrEqual(timeStart, timeEnd);
  return (
    <HRModal
      visible={props?.visible}
      title={`${props?.schedule ? 'Edit' : 'Create'} Schedule`}
      onCancel={onCancelModal}
      footer={null}
    >
      <Spin spinning={loadingDepartment || loadingGetSchedule}>
        <HRForm onSubmit={handleSubmit} methods={methods}>
          <Typography.Title level={4}>
            Date: <MomentFormatter value={props?.selectedDate} format="dddd, MMMM D, YYYY" />
            <br />
          </Typography.Title>
          {isLessThan && (
            <Alert
              style={{ marginTop: 10 }}
              message={`If the "Time End" is less than or earlier than "Time Start", this means it will end the "Next Day".`}
              message={
                <Typography.Text>
                  If the <Typography.Text strong>"Time End"</Typography.Text> is less than or
                  earlier than <Typography.Text strong>"Time Start"</Typography.Text>, this means it
                  will end the <Typography.Text strong>"Next Day"</Typography.Text>.
                </Typography.Text>
              }
              type="info"
              showIcon
            />
          )}

          <div style={{ marginTop: 10 }}>
            {props?.isOvertime && <HRCheckbox name="isOIC">OIC</HRCheckbox>}
          </div>

          <HRSelect
            name="department"
            label="Select Department"
            options={departmentData?.departments || []}
            placeholder="Search Department"
            allowClear={true}
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={props?.schedule?.isOIC}
            disabledDate={disabledDate}
          />
          <Controller
            name="dateTimeStartRaw"
            render={(inputProps) => {
              return (
                <>
                  <label>Time Start</label>
                  <DatePicker
                    showNow={false}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabled={
                      props?.schedule?.isOIC
                        ? false
                        : !props?.isOvertime && !props?.schedule?.isCustom
                    }
                  />
                </>
              );
            }}
          />
          <Controller
            name="dateTimeEndRaw"
            render={(inputProps) => {
              return (
                <>
                  <label>Time End</label>
                  <DatePicker
                    showNow={false}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabled={
                      props?.schedule?.isOIC
                        ? false
                        : !props?.isOvertime && !props?.schedule?.isCustom
                    }
                    disabledDate={disabledDateEnd}
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
                  if (props?.schedule?.isCustom) {
                    if (!methods.getValues('mealBreakEnd')) return true;
                    let breakTimeEnd = moment(methods.getValues('mealBreakEnd'));
                    if (breakTimeEnd.isValid() && breakTimeEnd !== null)
                      if (!value) return 'required';
                  }
                },
                mustBeLessThanBreakEnd: (value) => {
                  if (props?.schedule?.isCustom) {
                    if (!methods.getValues('mealBreakEnd')) return true;
                    let breakEnd = moment(methods.getValues('mealBreakEnd'));
                    if (breakEnd.isValid() && value !== null)
                      if (isTimeGreaterThanOrEqual(value, breakEnd))
                        return 'Must be less than Meal Break End';
                  }
                },
                mustBetweenStartAndEnd: (value) => {
                  if (props?.schedule?.isCustom) {
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
                  }
                },
              },
            }}
            render={(inputProps) => {
              return (
                <div style={{ marginBottom: 5 }}>
                  <DatePicker
                    showNow={true}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabledDate={disabledDateEnd}
                    disabled={!props?.schedule?.isCustom && !props?.schedule?.isOIC}
                  />
                </div>
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
                  if (props?.schedule?.isCustom) {
                    if (!methods.getValues('mealBreakStart')) return true;
                    let breakTimeStart = moment(methods.getValues('mealBreakStart'));
                    if (breakTimeStart.isValid() && breakTimeStart !== null)
                      if (!value) return 'required';
                  }
                },
                mustBeGreaterThanBreakStart: (value) => {
                  if (props?.schedule?.isCustom) {
                    if (!methods.getValues('mealBreakStart')) return true;
                    let breakTimeStart = moment(methods.getValues('mealBreakStart'));
                    if (breakTimeStart.isValid() && value !== null)
                      if (isTimeLessThanOrEqual(value, breakTimeStart))
                        return 'Must be greater than Meal Break Start';
                  }
                },
                mustBetweenStartAndEnd: (value) => {
                  if (props?.schedule?.isCustom) {
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
                  }
                },
              },
            }}
            render={(inputProps) => {
              return (
                <div style={{ marginBottom: 5 }}>
                  <DatePicker
                    showNow={true}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabledDate={disabledDateEnd}
                    disabled={!props?.schedule?.isCustom && !props?.schedule?.isOIC}
                  />
                </div>
              );
            }}
          />

          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <HRButton style={{ marginRight: 10 }} onClick={onCancelModal}>
              Cancel
            </HRButton>
            <HRButton htmlType="submit" type="primary" loading={loadingSetEmployeeSched}>
              Submit
            </HRButton>
          </div>
        </HRForm>
      </Spin>
    </HRModal>
  );
};

export default EditScheduleModal;
