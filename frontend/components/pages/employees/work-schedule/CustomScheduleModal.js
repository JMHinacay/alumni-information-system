import { useEffect } from 'react';

import { HRButton, HRCheckbox, HRForm, HRModal, HRSelect } from '@components/commons';
import { Alert, DatePicker, message, Spin, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { gql, useLazyQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';

import { isTimeGreaterThan, isTimeGreaterThanOrEqual, isTimeLessThanOrEqual } from '@utils/moment';
import MomentFormatter from '@components/utils/MomentFormatter';

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

const CustomScheduleModal = (props) => {
  const methods = useForm({
    defaultValues: {
      dateTimeStartRaw: null,
      dateTimeEndRaw: null,
      mealBreakStart: null,
      mealBreakEnd: null,
      department: null,
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
      let currentScheduleString = moment(props?.selectedData?.date).format('MM_DD_YYYY');
      let currentSchedule = props?.selectedData?.employee?.employeeSchedule[currentScheduleString];
      if (schedule?.id) {
        // console.log(moment(schedule?.dateTimeEndRaw).format('dddd, MMMM D, YYYY, h:mm A'));
        methods?.reset({
          dateTimeEndRaw: moment(schedule?.dateTimeEndRaw),
          dateTimeStartRaw: moment(schedule?.dateTimeStartRaw),
          mealBreakStart: schedule?.mealBreakStart ? moment(schedule?.mealBreakStart) : null,
          mealBreakEnd: schedule?.mealBreakEnd ? moment(schedule?.mealBreakEnd) : null,
          department: props?.isOIC ? schedule?.department?.id : currentSchedule?.department,
        });
      }
    },
  });

  const onCancelModal = () => {
    props?.handleModal({}, false);
  };

  const handleSubmit = (values) => {
    let dateTimeStart = moment(values.dateTimeStartRaw).second(0).millisecond(0);
    let dateTimeEnd = moment(values.dateTimeEndRaw).second(0).millisecond(0);

    let mealBreakStart = null;
    let mealBreakEnd = null;
    if (values?.mealBreakStart) {
      mealBreakStart = moment(values?.mealBreakStart).second(0).millisecond(0);
    }
    if (values?.mealBreakEnd) {
      mealBreakEnd = moment(values?.mealBreakEnd).second(0).millisecond(0);
    }

    let { date = {}, employee = {} } = props?.selectedData || {};
    let dateKey = moment(date).format('MM_DD_YYYY');
    let dateStartKey = moment(dateTimeStart).startOf('day').format('MM_DD_YYYY');

    let selectedSchedule = props?.isOIC
      ? employee?.employeeSchedule[`${dateKey}_OIC`]
      : employee?.employeeSchedule[dateKey];
    let { department, departmentName, ...schedule } = selectedSchedule || {};

    setEmployeeSched({
      variables: {
        id: schedule?.id || null,
        employee_id: employee?.id || null,
        department: values?.department,
        fields: {
          ...schedule,
          dateTimeStartRaw: dateTimeStart.utc().format(),
          dateTimeEndRaw: dateTimeEnd.utc().format(),
          mealBreakStart,
          mealBreakEnd,
          assignedDate:
            dateKey !== dateStartKey ? moment(date).startOf('day').utc().format() : null,
          isOvertime: false,
          isCustom: props?.isCustom,
          isOIC: props?.isOIC,
          isMultiDay: values?.isMultiDay,
          title: null,
          label: null,
        },
      },
    });
  };

  useEffect(() => {
    if (props?.visible) {
      let { employee, date } = props?.selectedData || {};
      let dateKey = date.format('MM_DD_YYYY');
      let selectedSchedule = employee?.employeeSchedule[dateKey];
      let { department, departmentName, ...schedule } = selectedSchedule || {};
      if (schedule?.id) {
        //get schedule
        getDepartment();
        getSchedule({
          variables: {
            id: schedule?.id,
          },
        });
      } else {
        getDepartment();
        methods?.reset({
          dateTimeStartRaw: moment(date).startOf('day'),
          dateTimeEndRaw: moment(date).startOf('day').add(1, 'hour').minutes(0),
          department: employee?.department,
        });
      }
    } else methods.reset();
  }, [props?.visible, props?.schedule, props?.selectedData?.department]);

  let { dateTimeStartRaw: timeStart, dateTimeEndRaw: timeEnd } = methods.watch([
    'dateTimeStartRaw',
    'dateTimeEndRaw',
  ]);

  const disabledDate = (current) => {
    const key = moment(current).startOf('day').format('MM_DD_YYYY');
    const dateKey = moment(props?.selectedData?.date).startOf('day').format('MM_DD_YYYY');
    const leaveSchedule = props?.selectedData?.employee?.employeeSchedule[`${dateKey}_LEAVE`];
    if (
      key === moment(props?.selectedData?.date).add(1, 'day').startOf('day').format('MM_DD_YYYY') &&
      leaveSchedule &&
      !props?.isOIC &&
      !props?.isOvertime
    )
      return false;
    if (key === moment(props?.selectedData?.date).startOf('day').format('MM_DD_YYYY')) {
      return false;
    } else return true;
  };

  const disabledDateEnd = (current) => {
    const isMultiDay = methods?.getValues('isMultiDay');
    if (!isMultiDay) {
      if (
        moment(current).startOf('day').format('MM_DD_YYYY') ==
        moment(props?.selectedData?.date).startOf('day').format('MM_DD_YYYY')
      )
        return false;
      return (
        current < moment(props?.selectedData?.date).endOf('day') ||
        current > moment(props?.selectedData?.date).add(1, 'days').endOf('day')
      );
    } else {
      if (
        moment(current).startOf('day').format('MM_DD_YYYY') ==
        moment(props?.selectedData?.date).startOf('day').format('MM_DD_YYYY`')
      )
        return false;
      return current < moment(props?.selectedData?.date).endOf('day');
    }
  };

  let isLessThan = false;
  if (timeEnd) isLessThan = isTimeGreaterThanOrEqual(timeStart, timeEnd);
  return (
    <HRModal
      visible={props?.visible}
      title={`${props?.isCustom ? 'Custom' : 'OIC'} Schedule`}
      onCancel={onCancelModal}
      footer={null}
    >
      <Spin spinning={loadingDepartment || loadingGetSchedule}>
        <HRForm onSubmit={handleSubmit} methods={methods}>
          <Typography.Title level={4}>
            Date: <MomentFormatter value={props?.selectedData?.date} format="dddd, MMMM D, YYYY" />
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
            <HRCheckbox name="isMultiDay">Multi-Day</HRCheckbox>
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
            disabled={props?.isOIC}
          />
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
              validate: {
                mustBetweenStartAndEnd: (value) => {
                  let timeStart = moment(data?.schedule?.dateTimeStartRaw);

                  if (!value) return true;
                  if (isTimeGreaterThan(timeStart, value) && props.isOIC) {
                    return `Must not be earlier than ${timeStart.format('MMM D, YYYY, h:mm A')}`;
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
                    disabledDate={disabledDate}
                  />
                </div>
              );
            }}
          />
          <Typography.Text>
            Time End
            <label style={{ color: 'red' }}>
              {methods?.errors?.dateTimeEndRaw?.message &&
                `(${methods?.errors?.dateTimeEndRaw?.message})`}
            </label>
          </Typography.Text>
          <Controller
            name="dateTimeEndRaw"
            rules={{
              validate: {
                mustBetweenStartAndEnd: (value) => {
                  let timeEnd = moment(data?.schedule?.dateTimeEndRaw);
                  if (!value) return true;
                  if (isTimeGreaterThan(value, timeEnd) && props.isOIC) {
                    return `Must not be later than ${timeEnd.format('MMM D, YYYY, h:mm A')}`;
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
                  />
                </div>
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
                  if (breakTimeEnd.isValid() && breakTimeEnd !== null)
                    if (!value) return 'required';
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
                <div style={{ marginBottom: 5 }}>
                  <DatePicker
                    showNow={true}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabledDate={disabledDateEnd}
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
                <div style={{ marginBottom: 5 }}>
                  <DatePicker
                    showNow={true}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabledDate={disabledDateEnd}
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

export default CustomScheduleModal;
