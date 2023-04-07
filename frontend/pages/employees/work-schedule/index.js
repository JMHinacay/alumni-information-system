import { LockOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import AccessControl from '@components/accessControl/AccessControl';
import { AccountContext } from '@components/accessControl/AccountContext';
import {
  HRButton,
  HRCheckbox,
  HRDivider,
  HRForm,
  HRPageHeader,
  HRSelect,
} from '@components/commons';
import CustomScheduleModal from '@components/pages/employees/work-schedule/CustomScheduleModal';
import PrintScheduleModal from '@components/pages/employees/work-schedule/PrintScheduleModal';
import ScheduleCell from '@components/pages/employees/work-schedule/ScheduleCell';
import ScheduleDetailsModal from '@components/pages/employees/work-schedule/ScheduleDetailsModal';
import useHasPermission from '@hooks/useHasPermission';
import { hasPermission } from '@utils/accessFunctions';
import {
  REST_DAY_SCHEDULE_COLOR,
  REST_DAY_SCHEDULE_LABEL,
  REST_DAY_SCHEDULE_TITLE,
} from '@utils/constants';
import { isTimeGreaterThanOrEqual, isTimeLessThan, isTimeLessThanOrEqual } from '@utils/moment';
import { Col, DatePicker, Input, message, Pagination, Row, Spin, Table, Typography } from 'antd';
import { gql } from 'apollo-boost';
import moment from 'moment';
import Head from 'next/head';
import { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBed, FaRegCalendarCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { MdAvTimer } from 'react-icons/md';

const { Search } = Input;

const GET_EMPLOYEES = gql`
  query(
    $department: UUID
    $size: Int
    $page: Int
    $startDate: Instant
    $endDate: Instant
    $withChildren: Boolean
    $filter: String
  ) {
    employees: getAllEmployeeSchedule(
      department: $department
      size: $size
      page: $page
      startDate: $startDate
      endDate: $endDate
      withChildren: $withChildren
      filter: $filter
    ) {
      content {
        id
        fullName
        department
        departmentName
        departmentOfDuty
        departmentOfDutyName
        employeeSchedule
        schedule {
          id
          title
          label
          dateTimeStart
          dateTimeStartRaw
          dateTimeEnd
          dateTimeEndRaw
          mealBreakStart
          mealBreakEnd
          color
        }
      }
      totalElements
    }
    legend: getEmployeeScheduleLegend(
      department: $department
      startDate: $startDate
      endDate: $endDate
    ) {
      color
      title
      label
    }
    holidays: mapEventsToDates(startDate: $startDate, endDate: $endDate)
    lockedDates: getScheduleLock(endDate: $endDate, startDate: $startDate)
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

const SET_EMPLOYEE_SCHED = gql`
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

const defaultColumn = {
  title: 'Date',
  dataIndex: 'fullName',
  key: 'fullName',
  width: 400,
  fixed: 'left',
  onCell: () => ({
    style: {
      minHeight: 75,
      height: 60,
    },
  }),
  render: (text) => {
    return {
      children: <span style={{ fontWeight: '700' }}>{text}</span>,
    };
  },
};

const EmployeeWorkSchedulePage = (props) => {
  const methods = useForm({
    defaultValues: {
      dates: null,
    },
  });
  const filterMethods = useForm({
    defaultValues: {
      filter: null,
    },
  });
  const userContext = useContext(AccountContext);
  const withPermission = useHasPermission(['manage_all_department_schedule']);

  const [detailsModal, setDetailsModal] = useState({
    status: false,
    date: null,
    employee: null,
    isCustom: false,
    isOIC: false,
  });

  const [state, setState] = useState({
    department: '',
    startDate: null,
    endDate: null,
    page: 0,
    size: 10,
    withChildren: false,
    filter: '',
  });
  const prevState = useRef({
    previous: {},
    new: {
      department: '',
      startDate: null,
      endDate: null,
      page: 0,
      size: 10,
    },
  });
  const prevData = useRef({
    previous: { lockedDates: {} },
    new: { lockedDates: {} },
  });

  const [columns, setColumns] = useState([defaultColumn]);
  const [printScheduleModal, setPrintScheduleModal] = useState({
    visible: false,
    withSubDepartment: false,
  });

  const [
    getEmployeeSchedule,
    { data, loading, refetch: refetchEmployeeSchedule, fetchMore, previousData },
  ] = useLazyQuery(GET_EMPLOYEES, {
    onCompleted: (result) => {
      formatColumns();
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [
    getDepartments,
    { data: dataDepartment, loading: loadingDepartment, refetch: refetchDepartment },
  ] = useLazyQuery(GET_DEPARTMENT);

  const [setEmployeeSched, { loading: loadingSetEmployeeSched }] = useMutation(SET_EMPLOYEE_SCHED, {
    onCompleted: (result) => {
      let { data } = result || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully updated employee schedule.', 1.5);

        refetchEmployeeSchedule({
          ...state,
          startDate: moment(state.startDate).startOf('day').utc().format(),
          endDate: moment(state.endDate).endOf('day').utc().format(),
        });
      } else {
        if (data?.message === 'Date is locked.')
          refetchEmployeeSchedule({
            variables: {
              ...state,
              startDate: moment(state.startDate).startOf('day').utc().format(),
              endDate: moment(state.endDate).endOf('day').utc().format(),
            },
          });
        message.error(data?.message ?? 'Failed to update employee schedule.');
      }
    },
  });

  useEffect(() => {
    if (hasPermission(userContext?.data?.user?.access, ['manage_all_department_schedule']))
      getDepartments();
  }, []);

  useEffect(() => {
    prevState.current = {
      previous: prevState.current.new,
      new: { ...state },
    };
    if (data) {
      prevData.current = {
        previous: prevData.current.new,
        new: { ...data },
      };
    }
  }, [state, data]);

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const colSpanCalculator = (record, key, providedState = null) => {
    const { employeeSchedule } = record;
    const currentSchedule = employeeSchedule[key];
    const dateTimeStart = currentSchedule?.dateTimeStartRaw;
    const dateTimeEnd = currentSchedule?.dateTimeEndRaw;
    const start = moment(dateTimeStart);
    const end = moment(dateTimeEnd);

    let usedState = state;
    if (providedState) usedState = providedState;
    const queryStartDay = moment(usedState.startDate).startOf('day');
    const queryStartDayKey = moment(usedState.startDate).format('MM_DD_YYYY');
    const queryEndDay = moment(usedState.endDate).startOf('day');

    const duration = end.diff(start, 'days');
    let colSpan = duration > 1 ? duration : 1;
    if (!currentSchedule) {
      colSpan = 1;
    } else if (start < queryStartDay && end > queryEndDay) {
      if (queryStartDayKey === key) {
        colSpan = queryEndDay.diff(queryStartDay, 'day') + 1;
      } else colSpan = 0;
    } else {
      if (
        queryStartDayKey === key &&
        dateTimeStart &&
        dateTimeEnd &&
        !currentSchedule?.isMultiDay
      ) {
        // if (record?.id === 'a405bf90-9ec1-465e-bfbf-c5a49649a39b') {
        //   console.log('end diff ', end.diff(queryStartDay, 'days'));
        // }
        colSpan = end.diff(queryStartDay, 'days');
        if (!currentSchedule?.isMultiDay) colSpan = 1;
        else if (dateDiff === 0) colSpan = 1;
      } else if (dateTimeStart && dateTimeEnd) {
        // if (record?.id === 'a405bf90-9ec1-465e-bfbf-c5a49649a39b') {
        //   console.log('multi-day end diff ', end.diff(queryStartDay, 'days'));
        // }
        if (queryStartDayKey === key) {
          colSpan = end.diff(queryStartDay, 'days');
        } else if (currentSchedule?.isContinuation) return (colSpan = 0);
        else {
          if (end.diff(queryEndDay, 'day') > 1) colSpan = end.diff(queryEndDay, 'day');
        }
      }
    }

    return colSpan;
  };

  // function for creating/saving employee schedule
  // this will run when a menu in dropdown is selected
  const onClickSchedule = (date /*date selected*/, schedule, record, scheduleKey) => {
    let employeeScheduleDateTimeStart = moment(date);
    let employeeScheduleDateTimeEnd = moment(date);
    let employeeMealBreakDateTimeStart = moment(date);
    let employeeMealBreakDateTimeEnd = moment(date);
    let employeeId = record?.id;
    if (schedule === 'REST_DAY') {
      let currentSchedule = record?.employeeSchedule[`${scheduleKey}`] || {};
      let { id, department, ...restSchedule } = currentSchedule;
      let scheduleId = currentSchedule?.id;
      let restDayStartRaw = moment(employeeScheduleDateTimeStart).startOf('day').utc().format();
      let restDayEndRaw = moment(employeeScheduleDateTimeStart)
        .startOf('day')
        .add(1, 'day')
        .utc()
        .format();
      let fields = {
        ...restSchedule,
        isRestDay: true,
        isOvertime: false,
      };
      if (!scheduleId) {
        fields = {
          ...fields,
          label: REST_DAY_SCHEDULE_LABEL,
          title: REST_DAY_SCHEDULE_TITLE,
          color: REST_DAY_SCHEDULE_COLOR,
          dateTimeStartRaw: restDayStartRaw,
          dateTimeEndRaw: restDayEndRaw,
        };
      }
      setEmployeeSched({
        variables: {
          id: scheduleId || null,
          employee_id: employeeId,
          department: record?.department,
          fields,
        },
      });
    } else {
      let scheduleId = record?.employeeSchedule[scheduleKey]?.id;
      let { id, ...restSchedule } = schedule;
      // console.log(restSchedule);

      //==============COMPUTING SCHEDULE==============\\
      // get the dateTimeStart and dateTimeEnd and create new moment objects
      restSchedule.dateTimeStart = moment(restSchedule.dateTimeStartRaw);
      restSchedule.dateTimeEnd = moment(restSchedule.dateTimeEndRaw);
      // set the date and hour of the schedule date time start
      employeeScheduleDateTimeStart.hour(restSchedule.dateTimeStart.hour());
      employeeScheduleDateTimeStart.minute(restSchedule.dateTimeStart.minute());
      // set the date and hour of the schedule date time end
      employeeScheduleDateTimeEnd.hour(restSchedule.dateTimeEnd.hour());
      employeeScheduleDateTimeEnd.minute(restSchedule.dateTimeEnd.minute());
      //==============COMPUTING SCHEDULE==============\\

      //==============COMPUTING MEAL BREAK==============\\
      // check if there is meal break start and end in the schedule
      if (restSchedule.mealBreakStart && restSchedule.mealBreakEnd) {
        restSchedule.mealBreakStart = moment(restSchedule.mealBreakStart);
        restSchedule.mealBreakEnd = moment(restSchedule.mealBreakEnd);
        //set the date, hour and minutes of the meal break start
        employeeMealBreakDateTimeStart.hour(restSchedule.mealBreakStart.hour());
        employeeMealBreakDateTimeStart.minute(restSchedule.mealBreakStart.minute());
        //set the date, hour and minutes of the meal break end
        employeeMealBreakDateTimeEnd.hour(restSchedule.mealBreakEnd.hour());
        employeeMealBreakDateTimeEnd.minute(restSchedule.mealBreakEnd.minute());
      }
      //==============COMPUTING MEAL BREAK==============\\

      if (isTimeLessThan(restSchedule.dateTimeEnd, restSchedule.dateTimeStart)) {
        // add one day to the schedule time end
        employeeScheduleDateTimeEnd.add(1, 'day');
        if (
          isTimeGreaterThanOrEqual(employeeMealBreakDateTimeStart, moment(date).startOf('day')) &&
          isTimeLessThanOrEqual(employeeMealBreakDateTimeStart, employeeScheduleDateTimeEnd)
        )
          employeeMealBreakDateTimeStart.add(1, 'day');
        if (
          isTimeGreaterThanOrEqual(employeeMealBreakDateTimeEnd, moment(date).startOf('day')) &&
          isTimeLessThanOrEqual(employeeMealBreakDateTimeEnd, employeeScheduleDateTimeEnd)
        )
          employeeMealBreakDateTimeEnd.add(1, 'day');
      }

      setEmployeeSched({
        variables: {
          id: scheduleId || null,
          employee_id: employeeId,
          department: record?.departmentOfDuty,
          fields: {
            ...restSchedule,
            dateTimeStartRaw: employeeScheduleDateTimeStart.utc().format(),
            dateTimeEndRaw: employeeScheduleDateTimeEnd.utc().format(),
            mealBreakStart: employeeMealBreakDateTimeStart.utc().format(),
            mealBreakEnd: employeeMealBreakDateTimeEnd.utc().format(),
            isOvertime: false,
            isCustom: false,
          },
        },
      });
    }
  };

  // schedule details modal handler
  const handleDetailsModal = (
    selected = {},
    willRefetch = false,
    isCustom = false,
    isOIC = false,
  ) => {
    if (willRefetch) {
      // console.log(state);
      refetchEmployeeSchedule({
        ...state,
        startDate: moment(state.startDate).startOf('day').utc().format(),
        endDate: moment(state.endDate).endOf('day').utc().format(),
      });
    }

    setDetailsModal({
      ...detailsModal,
      ...selected,
      status: !detailsModal.status,
      isCustom,
      isOIC,
    });
  };

  //handler when the user clicks the cells
  const handleSelectCell = (record, date, isCustom, isOIC) => {
    let selectedDate = moment(date).format('MM_DD_YYYY');
    // console.log(record, selectedDate, date);
    let employee = {
      ...record,
    };
    handleDetailsModal({ date, employee }, false, isCustom, isOIC);
  };

  const handleClickCustom = (record, date) => {
    let employee = {
      ...record,
    };
    handleDetailsModal({ date, employee }, false, true);
  };

  // this function will format the columns. Use this when user selects new
  // date range
  const formatColumns = () => {
    let firstDate = moment(state.startDate);
    let secondDate = moment(state.endDate);
    let dateDiff = secondDate.diff(firstDate, 'days');
    let newColumns = [];
    if (state.withChildren) {
      newColumns.push({
        key: 'department',
        title: 'Department',
        align: 'left',
        width: 300,
        render: (text, record) => record?.departmentName,
      });
    }
    const width = 150;
    for (let i = 0; i <= dateDiff; i++) {
      let date = moment(firstDate).add(i, 'days');
      let key = date.format('MM_DD_YYYY');
      newColumns.push({
        key,
        title: date.format('MMM D'),
        align: 'center',
        width,
        children: [
          {
            width,
            dataIndex: key,
            align: 'center',
            title: (
              <div>
                <Typography.Text
                  type={date.format('ddd') === 'Sun' && 'danger'}
                  strong
                  style={{ fontSize: 16 }}
                >
                  {date.format('ddd')}
                </Typography.Text>
                {data?.holidays[key]?.map((item) => {
                  return (
                    <div key={item?.id}>
                      <Typography.Text strong type="danger" style={{ color: 'red' }}>
                        {item?.name}
                      </Typography.Text>
                    </div>
                  );
                })}
                <div>
                  {data?.lockedDates[key]?.isLocked && <LockOutlined style={{ fontSize: 20 }} />}
                </div>
              </div>
            ),
            onCell: (record) => {
              const { employeeSchedule } = record;
              const props = {
                style: {
                  // padding: -20,
                  // height: 60
                  textAlign: 'center',
                  margin: 0,
                  padding: '0px',
                  minHeight: 70,
                },
                colSpan: 2,
              };
              const schedule = employeeSchedule[key];
              const leaveSchedule = employeeSchedule[`${key}_LEAVE`];
              const leaveRestSchedule = employeeSchedule[`${key}_LEAVE_REST`];
              if (leaveSchedule) {
                if (schedule?.isCustom) {
                  props.style.backgroundColor = 'white';
                  props.style.border = '2px solid #3498db';
                } else if (schedule) {
                  props.style.backgroundColor = schedule?.color;
                } else {
                  props.style.backgroundColor = 'white';
                  props.style.border = `2px solid ${leaveSchedule.color}`;
                }
              } else if (leaveRestSchedule) {
                if (schedule) props.style.backgroundColor = schedule?.color;
                else props.style.backgroundColor = leaveRestSchedule.color;
              } else if (schedule?.isCustom) {
                props.style.backgroundColor = 'white';
                props.style.border = '2px solid #3498db';
              } else if (schedule?.color) {
                props.style.backgroundColor = schedule?.color;
              } else if (employeeSchedule[key + '_REST'])
                props.style.backgroundColor = employeeSchedule[key + '_REST']?.color;
              return props;
            },
            shouldCellUpdate: (record, prevRecord) => {
              let schedule = record?.employeeSchedule[key];
              let OICSchedule = record?.employeeSchedule[`${key}_OIC`];
              let restSchedule = record?.employeeSchedule[`${key}_REST`];
              let overtimeSchedule = record?.employeeSchedule[`${key}_OVERTIME`] || [];
              let overtimeOICSchedule = record?.employeeSchedule[`${key}_OVERTIME_OIC`] || [];
              let prevSchedule = prevRecord?.employeeSchedule[key];
              let prevOICSchedule = prevRecord?.employeeSchedule[`${key}_OIC`];
              let prevRestSchedule = prevRecord?.employeeSchedule[`${key}_REST`];
              let prevOvertimeSchedule = prevRecord?.employeeSchedule[`${key}_OVERTIME`] || [];
              let prevOvertimeOICSchedule =
                prevRecord?.employeeSchedule[`${key}_OVERTIME_OIC`] || [];

              let overtimeString = JSON.stringify(overtimeSchedule);
              let prevOvertimeString = JSON.stringify(prevOvertimeSchedule);
              let overtimeOICString = JSON.stringify(overtimeOICSchedule);
              let prevOvertimeOICString = JSON.stringify(prevOvertimeOICSchedule);
              let departmentSchedule = JSON.stringify(record?.schedule);
              let prevDepartmentSchedule = JSON.stringify(prevRecord?.schedule);

              let isOvertimeIsEqual = overtimeString !== prevOvertimeString;
              let isOvertimeOICIsEqual = overtimeOICString !== prevOvertimeOICString;
              let departmentScheduleIsEqual = departmentSchedule !== prevDepartmentSchedule;

              let colSpan = colSpanCalculator(record, key, prevState.current.new);
              let prevColSpan = colSpanCalculator(prevRecord, key, prevState.current.previous);

              let isLocked = prevData?.current?.new?.lockedDates[key]?.isLocked;
              let prevIsLocked = prevData?.current?.previous?.lockedDates[key]?.isLocked;

              // if (record?.id === 'a405bf90-9ec1-465e-bfbf-c5a49649a39b') {
              //   console.log('current', isLocked, 'previous', prevIsLocked);
              // }

              // // for testing only.. this if for 5A and BUSINESS FINANCE departments
              // if (
              //   (record?.id === 'fafc4899-1a2d-4941-ae90-0d6afc8f1695' ||
              //     record?.id === 'a405bf90-9ec1-465e-bfbf-c5a49649a39b') &&
              //   key === '03_01_2021'
              // ) {
              //   console.time('isEqual' + record?.id);

              //   console.timeEnd('isEqual' + record?.id);
              //   overtimeSchedule.forEach(
              //     (sched) =>
              //       (overtimeString += `${sched?.department} ${sched?.dateTimeStartRaw} ${sched?.dateTimeEndRaw}`),
              //   );
              //   prevOvertimeSchedule.forEach(
              //     (sched) =>
              //       (prevOvertimeString += `${sched?.department} ${sched?.dateTimeStartRaw} ${sched?.dateTimeEndRaw}`),
              //   );
              // }

              // return true;
              return (
                `${schedule?.label} ${schedule?.dateTimeStartRaw} ${schedule?.dateTimeEndRaw} ${schedule?.color} ${schedule?.isRestDay} ${schedule?.withNSD} ${schedule?.withHoliday}` !==
                  `${prevSchedule?.label} ${prevSchedule?.dateTimeStartRaw} ${prevSchedule?.dateTimeEndRaw} ${prevSchedule?.color} ${prevSchedule?.isRestDay} ${prevSchedule?.withNSD} ${prevSchedule?.withHoliday}` ||
                `${restSchedule?.label} ${restSchedule?.dateTimeStartRaw} ${restSchedule?.dateTimeEndRaw} ${restSchedule?.color} ${restSchedule?.isRestDay} ${restSchedule?.withNSD} ${restSchedule?.withHoliday}` !==
                  `${prevRestSchedule?.label} ${prevRestSchedule?.dateTimeStartRaw} ${prevRestSchedule?.dateTimeEndRaw} ${prevRestSchedule?.color} ${prevRestSchedule?.isRestDay} ${prevRestSchedule?.withNSD} ${prevRestSchedule?.withHoliday}` ||
                `${OICSchedule?.label} ${OICSchedule?.dateTimeStartRaw} ${OICSchedule?.dateTimeEndRaw} ${OICSchedule?.color} ${OICSchedule?.isRestDay} ${OICSchedule?.withNSD} ${OICSchedule?.withHoliday}` !==
                  `${prevOICSchedule?.label} ${prevOICSchedule?.dateTimeStartRaw} ${prevOICSchedule?.dateTimeEndRaw} ${prevOICSchedule?.color} ${prevOICSchedule?.isRestDay} ${prevOICSchedule?.withNSD} ${prevOICSchedule?.withHoliday}` ||
                colSpan !== prevColSpan ||
                isLocked !== prevIsLocked ||
                isOvertimeIsEqual ||
                departmentScheduleIsEqual ||
                isOvertimeOICIsEqual
              );
            },
            render: (text, record, index) => {
              const { employeeSchedule } = record;
              const colSpan = colSpanCalculator(record, key);

              return {
                props: { colSpan },
                children: (
                  <ScheduleCell
                    employeeSchedule={employeeSchedule}
                    employeeRecord={record}
                    date={date}
                    cellKey={key}
                    onClickSchedule={onClickSchedule}
                    handleSelectCell={handleSelectCell}
                    isLocked={data?.lockedDates[key]?.isLocked}
                  />
                ),
              };
            },
          },
        ],
      });
    }
    setColumns([defaultColumn, ...newColumns]);
  };

  // Submit handler when the user clicks the "Get Schedule" button
  const handleSubmit = (values) => {
    let datesValue = values?.dates;
    if (Array.isArray(datesValue)) {
      if (datesValue[0] && datesValue[1]) {
        let startDate = moment(datesValue[0]).startOf('day').utc().format();
        let endDate = moment(datesValue[1]).endOf('day').utc().format();
        const department = userContext?.data?.department?.id;
        setState({
          ...state,
          startDate,
          endDate,
          page: 0,
          department: withPermission ? values?.department : department,
          withChildren: values?.withChildren,
          filter: state.filter,
        });
        getEmployeeSchedule({
          variables: {
            ...state,
            startDate,
            page: 0,
            endDate,
            department: withPermission ? values?.department : department,
            withChildren: values?.withChildren,
            filter: state.filter,
          },
        });
      }
    }
  };

  const handleSubmitFilter = (filter) => {
    let formDates = methods.getValues('dates');
    if (
      (state.startDate && state.endDate) ||
      (formDates !== null && formDates[0] && formDates[1])
    ) {
      let startDate, endDate;
      if (state.startDate && state.endDate && formDates[0] && formDates[1]) {
        if (
          moment(state.startDate).format('MM_DD_YYYY') !==
            moment(formDates[0]).format('MM_DD_YYYY') ||
          moment(state.endDate).format('MM_DD_YYYY') !== moment(formDates[1]).format('MM_DD_YYYY')
        ) {
          if (!formDates[0] || !formDates[1]) {
            methods?.setError('department', {
              type: 'manual',
              message: 'Please select date range.',
            });
            return message.error('Please select date range.');
          }
          startDate = moment(formDates[0]).startOf('day').utc().format();
          endDate = moment(formDates[1]).endOf('day').utc().format();
        } else {
          startDate = moment(state.startDate).startOf('day').utc().format();
          endDate = moment(state.endDate).endOf('day').utc().format();
        }
      } else if (state.startDate && state.endDate) {
        startDate = moment(state.startDate).startOf('day').utc().format();
        endDate = moment(state.endDate).endOf('day').utc().format();
      } else {
        startDate = moment(formDates[0]).startOf('day').utc().format();
        endDate = moment(formDates[1]).endOf('day').utc().format();
      }
      if (withPermission && !state.department && !methods?.getValues('department')) {
        methods?.setError('department', { type: 'manual', message: 'Please select Department' });
        return message.error('Please select Department');
      }
      const department = userContext?.data?.department?.id;
      let withPermissionDepartment;

      if (state.department && methods?.getValues('department')) {
        if (state.department !== methods?.getValues('department'))
          withPermissionDepartment = methods?.getValues('department');
        else withPermissionDepartment = state.department;
      } else if (!state.department && methods?.getValues('department'))
        withPermissionDepartment = methods?.getValues('department');

      setState({
        ...state,
        startDate,
        endDate,
        department: withPermission ? withPermissionDepartment : department,
        page: 0,
        filter,
        withChildren: methods?.getValues('withChildren') || false,
      });
      getEmployeeSchedule({
        variables: {
          ...state,
          page: 0,
          startDate,
          endDate,
          department: withPermission ? withPermissionDepartment : department,
          filter,
          withChildren: methods?.getValues('withChildren') || false,
        },
      });
    } else {
      if (!methods?.getValues('department'))
        methods?.setError('department', { type: 'manual', message: 'Please select Department' });
      methods?.setError('dates', { type: 'manual', message: 'Please select date range.' });
      message.error('Please select date range.');
    }
  };

  const manualRefetchEmployeeSchedule = () => {
    refetchEmployeeSchedule({
      variables: {
        ...state,
        startDate: moment(state.startDate).startOf('day').utc().format(),
        endDate: moment(state.endDate).endOf('day').utc().format(),
      },
    });
  };

  // handler for the pagination e.g. page selection
  // and changing the size of the pagination
  const onNexPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
    fetchMore({
      variables: {
        ...state,
        page: page - 1,
        size,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        return fetchMoreResult;
      },
    });
  };

  const handlePrintScheduleModal = () => {
    const withSubDepartment = methods.getValues('withChildren');
    setPrintScheduleModal({ visible: !printScheduleModal.visible, withSubDepartment });
  };

  const scrollProps = { x: 0, y: 'calc(100vh - 330px)' };
  let legends = [];
  if (Array.isArray(data?.legend)) {
    legends = [...legends, ...data?.legend];
    legends = [
      ...legends,
      {
        label: REST_DAY_SCHEDULE_LABEL,
        title: REST_DAY_SCHEDULE_TITLE,
        color: REST_DAY_SCHEDULE_COLOR,
      },
      {
        type: 'icon',
        icon: (
          <div
            style={{
              height: 20,
              width: 20,
              backgroundColor: 'white',
              borderColor: '#3498db',
              borderWidth: 2,
              borderStyle: 'solid',
              borderRadius: 30,
              display: 'inline-block',
              marginRight: 10,
            }}
          />
        ),
        title: 'Custom Schedule',
      },
      {
        type: 'icon',
        icon: (
          <div
            style={{
              height: 20,
              width: 20,
              backgroundColor: 'white',
              borderColor: '#2ecc71',
              borderWidth: 2,
              borderStyle: 'solid',
              borderRadius: 30,
              display: 'inline-block',
              marginRight: 10,
            }}
          />
        ),
        title: 'Leave Schedule',
      },
      {
        type: 'icon',
        icon: <BsFillPersonFill style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'OIC',
        key: 'oic-schedule',
      },
      {
        type: 'icon',
        icon: <MdAvTimer style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'Overtime',
        key: 'overtime-schedule',
      },
      {
        type: 'icon',
        icon: <FaBed style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'Rest Day with Scheduled Duty',
        key: 'rest-day-with-scheduled-duty',
      },
      {
        type: 'icon',
        icon: <FaRegCalendarTimes style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'No Holiday Schedule',
        key: 'no-holiday',
      },
      {
        type: 'icon',
        icon: <FaRegCalendarCheck style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'With Leave Schedule',
        key: 'leave-icon',
      },
    ];
  }
  let { status: detailsModalStatus, isCustom, isOIC, ...selectedData } = detailsModal;
  const departments = [
    {
      label: 'No Departments',
      value: null,
    },
    ...(dataDepartment?.departments || []),
  ];
  return (
    <>
      <Head>
        <title>Schedule</title>
      </Head>
      <HRPageHeader title="Employee Work Schedule" />
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Row type="flex" gutter={[12, 12]} align="bottom">
          <Col span={12}>
            <Row gutter={12}>
              <Col span={24}>
                <Controller
                  name="dates"
                  rules={{
                    validate: (value) => {
                      if (!value) return 'Please select date range.';
                      if (!Array.isArray(value)) {
                        return 'Please select date range.';
                      } else if (Array.isArray(value)) {
                        if (value[0] === null || value[1] === null)
                          return 'Please select date range.';
                      }
                      return true;
                    },
                  }}
                  render={(inputProps) => (
                    <>
                      <label>
                        Date Range{' '}
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
              </Col>
            </Row>
          </Col>
          <AccessControl allowedPermissions={['manage_all_department_schedule']}>
            <Col span={12}>
              <Spin spinning={loadingDepartment}>
                <HRSelect
                  name="department"
                  label="Select Department"
                  options={departments || []}
                  placeholder="Search Department"
                  style={{ width: '100%', margin: 0 }}
                  allowClear={true}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </Spin>
            </Col>
          </AccessControl>

          <AccessControl allowedPermissions={['manage_child_department_work_schedule']}>
            <Col span={12}>
              <HRCheckbox name="withChildren">Include Sub-Departments</HRCheckbox>
            </Col>
          </AccessControl>
          <Col span={withPermission ? 24 : 12}>
            <HRButton block type="primary" htmlType="submit">
              Get Schedule
            </HRButton>
          </Col>
        </Row>
      </HRForm>
      {legends.length > 0 && (
        <div style={{ margin: '30px 0' }}>
          <Typography.Title level={4}>Legend</Typography.Title>
          {legends?.map((item) => {
            if (item?.type === 'icon') {
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}
                  key={`${item?.title}-${item.label}-${item?.key}`}
                >
                  {item?.icon}
                  <Typography.Text strong>{`${item?.title}`}</Typography.Text>
                </div>
              );
            } else
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}
                  key={`${item?.title}-${item.label}-${item.color}`}
                >
                  <div
                    style={{
                      height: 20,
                      width: 20,
                      backgroundColor: item?.color,
                      borderRadius: 30,
                      display: 'inline-block',
                      marginRight: 10,
                    }}
                  />

                  <Typography.Text strong>
                    {`${item?.title}(${item.label})`}
                    {/* {item?.timeStart && item?.timeEnd && ` — ${item?.timeStart}-${item?.timeEnd}`} */}
                  </Typography.Text>
                </div>
              );
          })}
        </div>
      )}
      <HRDivider />
      {data && (
        <HRButton type="primary" onClick={handlePrintScheduleModal} style={{ marginTop: 10 }}>
          Print Schedule
        </HRButton>
      )}
      <div style={{ marginTop: 20 }}>
        <Col span={24}>
          <Search
            placeholder="Search Employee"
            enterButton="Search"
            loading={loading}
            onSearch={handleSubmitFilter}
            size="large"
          />
        </Col>
      </div>
      <Row style={{ marginTop: 20 }}>
        <div style={{ width: '100%' }}>
          <Pagination
            defaultCurrent={1}
            total={data?.employees?.totalElements}
            pageSize={state.size}
            onChange={onNexPage}
            current={state.page + 1}
            style={{ marginBottom: 20 }}
            pageSizeOptions={[10, 15, 20, 25]}
          />
          <Table
            columns={columns}
            loading={loading}
            dataSource={data?.employees?.content || []}
            bordered
            size="middle"
            scroll={scrollProps}
            pagination={false}
            rowKey="id"
          />
          <Pagination
            defaultCurrent={1}
            total={data?.employees?.totalElements}
            pageSize={state.size}
            onChange={onNexPage}
            current={state.page + 1}
            style={{ marginTop: 20 }}
            pageSizeOptions={[10, 15, 20, 25]}
          />
        </div>
      </Row>
      <ScheduleDetailsModal
        visible={detailsModalStatus && !isCustom && !isOIC}
        selectedData={selectedData}
        handleModal={handleDetailsModal}
        manualRefetchEmployeeSchedule={manualRefetchEmployeeSchedule}
        lockedDates={data?.lockedDates || {}}
      />

      <CustomScheduleModal
        visible={detailsModalStatus && (isCustom || isOIC)}
        isOIC={isOIC}
        isCustom={isCustom}
        selectedData={selectedData}
        handleModal={handleDetailsModal}
        manualRefetchEmployeeSchedule={manualRefetchEmployeeSchedule}
      />
      <PrintScheduleModal
        state={state}
        handleModal={handlePrintScheduleModal}
        visible={printScheduleModal.visible}
        withPermission={withPermission}
        withSubDepartment={printScheduleModal.withSubDepartment}
      />
    </>
  );
};

export default EmployeeWorkSchedulePage;
