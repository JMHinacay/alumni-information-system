import { MoreOutlined } from '@ant-design/icons';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { AccountContext } from '@components/accessControl/AccountContext';
import {
  HRButton,
  HRCheckbox,
  HRDatePicker,
  HRDivider,
  HRForm,
  HRSelect,
  HRTable,
  HRTextarea,
} from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import useConstantsService from '@hooks/constants/useConstantsService';
import useHasPermission from '@hooks/useHasPermission';
import { employeeRequestDatesType, employeeRequestScheduleType } from '@utils/constants';
import { DatePicker, Dropdown, Menu, message, Result, Spin, Typography } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

const GET_ONE_EMPLOYEE_REQUEST = gql`
  query($id: UUID) {
    leaveRequest(id: $id) {
      id
      status
      reason
      remarks
      datesType
      withPay
      hrApprovedDate
      requestedDate
      revertedDate
      requestedBy {
        id
        firstName
        lastName
        fullName
      }
      approvals {
        id
        employee {
          id
          fullName
          firstName
          lastName
          department {
            id
            departmentName
          }
        }
        approvedDate
        status
        remarks
      }
      hrApprovedBy {
        id
        fullName
      }
      revertedBy {
        id
        fullName
      }
      department {
        id
        description
        departmentCode
        departmentDesc
      }
      dates {
        startDatetime
        endDatetime
        hours
        scheduleType
      }
    }
  }
`;

const SAVE_EMPLOYEE_REQUEST = gql`
  mutation(
    $id: UUID
    $fields: Map_String_ObjectScalar
    $department: UUID
    $requestedBy: UUID
    $approvals: [UUID]
    $hrApprovedBy: UUID
    $approvedByHrOverride: Boolean
  ) {
    data: upsertEmployeeRequest(
      id: $id
      fields: $fields
      department: $department
      approvals: $approvals
      requestedBy: $requestedBy
      hrApprovedBy: $hrApprovedBy
      approvedByHrOverride: $approvedByHrOverride
    ) {
      success
      message
    }
  }
`;

// TODO: add excluded employee
const EMPLOYEE_QUERY = gql`
  query($filter: String, $option: String, $department: UUID, $excludeUser: Boolean) {
    employees: getEmployeeActiveAndIncldInPayrollAndDeptExcldUser(
      filter: $filter
      option: $option
      department: $department
      excludeUser: $excludeUser
    ) {
      id
      value: id
      label: fullName
    }
  }
`;

const DEPARTMENT_QUERY = gql`
  {
    departments {
      id
      value: id
      label: departmentName
    }
  }
`;

export default function LeaveForm(props) {
  const methods = useForm({
    defaultValues: {
      datesType: employeeRequestDatesType.SINGLE,
      mixedDates: [],
      rangeDates: [null, null],
      singleDate: null,
      withPay: false,
      department: null,
      reason: null,
      scheduleType: null,
      approvals: [],
    },
  });
  const router = useRouter();
  const account = useContext(AccountContext);
  const [mixedDates, setMixedDates] = useState([]);
  const datesType = useWatch({ name: 'datesType', control: methods?.control });

  const hasPermissionCreateLeaveRequest = useHasPermission(['allow_create_leave_request']);
  const { data: scheduleTypes, loadingScheduleTypes } = useConstantsService(
    'leaveScheduleType',
    true,
  );

  const [[reqDepartment, appDepartment], setDepartments] = useState([null, null]);

  const [getOneEmployeeRequest, { loading: loadingGetOneEmployeeRequest }] = useLazyQuery(
    GET_ONE_EMPLOYEE_REQUEST,
    {
      onCompleted: (data) => {
        const { leaveRequest } = data || {};
        if (leaveRequest) {
          const { withPay, department, reason, approvals, datesType, dates } = leaveRequest;
          let scheduleType = null;
          let singleDate = null;
          let rangeDates = [null, null];
          if (datesType === employeeRequestDatesType.SINGLE) {
            let date = dates[0];
            scheduleType = date.scheduleType;
            singleDate = moment(date.startDatetime);
          } else if (
            datesType === employeeRequestDatesType.MIXED ||
            datesType === employeeRequestDatesType.RANGE
          ) {
            setMixedDates(leaveRequest?.dates || []);
            if (datesType === employeeRequestDatesType.RANGE) {
              rangeDates = [
                moment(leaveRequest?.dates[0].startDatetime),
                moment(leaveRequest?.dates[leaveRequest?.dates?.length - 1]?.startDatetime),
              ];
            }
          }
          methods?.reset({
            withPay,
            department: department?.id,
            reason,
            approvals: approvals.map(({ employee }) => employee?.id),
            datesType,
            scheduleType,
            singleDate,
            rangeDates,
          });
        }
      },
    },
  );

  const { data: departmentData, loading: loadingAppDepartment } = useQuery(DEPARTMENT_QUERY);

  const { data: appDataEmployee, loading: loadingAppEmployee } = useQuery(EMPLOYEE_QUERY, {
    variables: {
      filter: '',
      option: 'ACTIVE_EMPLOYEE_INCLUDED_PAYROLL',
      department: appDepartment,
      excludeUser: true,
    },
  });

  const { data: reqDataEmployee, loading: loadingReqEmployee } = useQuery(EMPLOYEE_QUERY, {
    variables: {
      filter: '',
      option: 'ACTIVE_EMPLOYEE_INCLUDED_PAYROLL',
      department: reqDepartment,
      excludeUser: false,
    },
  });

  const [saveRequest, { loading: loadingSaveRequest }] = useMutation(SAVE_EMPLOYEE_REQUEST, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved employee request.');
        router.back();
      } else message.error(data?.message ?? 'Failed to save employee request.');
    },
  });

  useEffect(() => {
    if (props.id)
      getOneEmployeeRequest({
        variables: {
          id: props?.id,
        },
      });
  }, [props.id]);

  const handleDateChange = (datesValue) => {
    if (datesValue) {
      if ((datesValue[0], datesValue[1])) {
        let firstDate = datesValue[0];
        let lastDate = datesValue[1];
        let mixedDates = [];
        let hours = 0;
        let scheduleHours = 0;

        while (firstDate <= lastDate) {
          mixedDates = mixedDates.concat({
            startDatetime: moment(firstDate).startOf('day').utc().format(),
            endDatetime: moment(firstDate).startOf('day').add(scheduleHours, 'hour').utc().format(),
            hours,
            scheduleType: null,
          });
          firstDate = moment(firstDate).add(1, 'day');
        }
        setMixedDates(mixedDates);
      }
    }
    methods.setValue('rangeDates', datesValue, { shouldValidate: true });
  };

  function disabledDate(current) {
    let formDates = mixedDates.map((date) => moment(date.startDatetime).format('MM_DD_YYYY'));
    return formDates.includes(moment(current).format('MM_DD_YYYY'));
  }

  const onRemoveDate = (index) => {
    let dates = [...mixedDates];
    dates.splice(index, 1);
    setMixedDates(dates);
  };

  const onAddDate = (e) => {
    let dates = [...mixedDates];
    let selectedDate = methods.getValues('singleDate');
    let hours = 0;
    let scheduleHours = 0;
    dates = [
      ...dates,
      {
        startDatetime: moment(selectedDate).startOf('day').utc().format(),
        endDatetime: moment(selectedDate).startOf('day').add(scheduleHours, 'hour').utc().format(),
        hours,
        scheduleType: null,
      },
    ];
    dates = dates.sort(
      (a, b) =>
        moment(a.startDatetime).format('MMDDYYYY') - moment(b.startDatetime).format('MMDDYYYY'),
    );

    setMixedDates(dates);
    methods.setValue('singleDate', null, { shouldValidate: true, shouldDirty: true });
  };

  const handleChangeDepartment = (type, value) => {
    if (type === 'appDepartment') {
      setDepartments([reqDepartment, value]);
    } else if (type === 'reqDepartment') {
      setDepartments([value, appDepartment]);
    }
  };

  const onChangeScheduleType = (index, scheduleType) => {
    let dates = [...mixedDates];
    let date = { ...dates[index] };
    date.scheduleType = scheduleType;
    let hours = 0;
    let scheduleHours = 0;
    let withPay = methods.getValues('withPay') || false;

    hours = withPay ? date.scheduleType.value : 0;
    scheduleHours = date.scheduleType.value;

    date.startDatetime = moment(date.startDatetime).startOf('day').utc().format();
    date.endDatetime = moment(date.startDatetime)
      .startOf('day')
      .add(scheduleHours, 'hour')
      .utc()
      .format();
    date.hours = hours;

    dates[index] = date;
    setMixedDates(dates);
  };

  const handleDatesTypeChange = (value) => {
    setMixedDates([]);
    methods.setValue('datesType', value);
  };

  const handleWithPayChange = (e) => {
    let withPay = e.target.checked;
    let newMixedDates = [...mixedDates];
    newMixedDates = newMixedDates.map((d) => {
      let newDate = { ...d };
      if (withPay) {
        newDate.hours = newDate.scheduleType?.value || 0;
      } else {
        newDate.hours = 0;
      }
      return newDate;
    });
    setMixedDates(newMixedDates);
    methods.setValue('withPay', withPay, { shouldDirty: true });
  };

  const onSubmit = (values) => {
    if (values.datesType === employeeRequestDatesType.MIXED && mixedDates.length <= 0) {
      return message.error('Please select one or more leave schedule dates.');
    }

    let variables = {
      id: props?.id ? props.id : null,
      requestedBy: props?.requestedByUser ? account?.data?.id : values.requestedBy,
      department: values?.department,
      approvals: values?.approvals || [],
      fields: {
        // status: 'DRAFT',
        status: props.status || 'PENDING',
        reason: values.reason,
        type: 'LEAVE',
        datesType: values.datesType,
        withPay: values.withPay,
        dates: [],
      },
      approvedByHrOverride: !props.requestedByUser ? true : false,
    };

    //format selectedDates
    let dates = [];
    const withPay = values.withPay;
    if (
      values.datesType === employeeRequestDatesType.RANGE ||
      values.datesType === employeeRequestDatesType.MIXED
    ) {
      dates = mixedDates.map((item) => ({ ...item, scheduleType: item.scheduleType?.name }));
      const nullScheduleTypes = dates.filter((item) => !item.scheduleType);
      if (nullScheduleTypes?.length > 0)
        return message.error('Please fill out schedule types for every date.');
    } else if (values.datesType === employeeRequestDatesType.SINGLE) {
      let hours = 0;
      let scheduleHours = 8;
      let scheduleType = values?.scheduleType;

      scheduleHours = parseInt(scheduleType);
      hours = withPay ? scheduleType : 0;


      dates = [
        {
          startDatetime: moment(values.singleDate).startOf('day').utc().format(),
          endDatetime: moment(values.singleDate)
            .startOf('day')
            .add(scheduleHours, 'hour')
            .utc()
            .format(),
          hours: hours,
          scheduleType: values.scheduleType,
        },
      ];
    }
    variables.fields.dates = dates;
    saveRequest({ variables });
  };

  const datesTypeOption = [
    {
      label: 'Single Date',
      value: employeeRequestDatesType.SINGLE,
    },
    {
      label: 'Date Range',
      value: employeeRequestDatesType.RANGE,
    },
    {
      label: 'Mixed Dates',
      value: employeeRequestDatesType.MIXED,
    },
  ];

  let columns = [
    {
      title: <Typography.Text strong>Date</Typography.Text>,
      dataIndex: 'startDatetime',
      render: (_, item) => {
        return <MomentFormatter value={item.startDatetime} format="dddd, MMMM Do YYYY" />;
      },
    },
    {
      title: <Typography.Text strong>Hours</Typography.Text>,
      dataIndex: 'hours',
    },
    {
      title: <Typography.Text strong>Schedule Type</Typography.Text>,
      dataIndex: 'scheduleType',
      render: (t) => t?.name,
    },
    {
      title: <Typography.Text strong>Action</Typography.Text>,
      render: (_, item, index) => {
        return (
          <>
            {(datesType === employeeRequestDatesType.RANGE ||
              datesType === employeeRequestDatesType.MIXED) && (
              <Dropdown
                overlay={
                  <Menu>
                    {scheduleTypes?.list?.map((sched) => (
                      <Menu.Item
                        disabled={item.name === sched.name}
                        onClick={() => onChangeScheduleType(index, sched)}
                      >
                        {sched.name}
                      </Menu.Item>
                    ))}
                    <Menu.Item
                      disabled={item.name === employeeRequestDatesType.MIXED.name}
                      onClick={() => onChangeScheduleType(index, employeeRequestScheduleType.REST)}
                    >
                      Rest Day
                    </Menu.Item>

                    {datesType === employeeRequestDatesType.MIXED && (
                      <Menu.Item onClick={() => onRemoveDate(index)} danger>
                        Delete
                      </Menu.Item>
                    )}
                  </Menu>
                }
                trigger={['click']}
                placement="bottomRight"
              >
                <HRButton type="primary" key="remove-date" shape="circle" size="small">
                  <MoreOutlined />
                </HRButton>
              </Dropdown>
            )}
          </>
        );
      },
    },
  ];

  if (loadingGetOneEmployeeRequest) {
    return (
      <div style={{ width: '100%', textAlign: 'center', marginTop: 30 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!hasPermissionCreateLeaveRequest) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <HRButton type="primary" onClick={router.back}>
            Go Back
          </HRButton>
        }
      />
    );
  }

  return (
    <HRForm methods={methods} onSubmit={onSubmit}>
      {/* <Typography.Title level={5}>Requested By: John Bill Suarez</Typography.Title> */}
      {!props.requestedByUser && (
        <>
          <HRDivider>Request Details</HRDivider>

          <Spin spinning={loadingAppDepartment}>
            <HRSelect
              useNative
              showSearch
              placeholder={'Select Department'}
              options={departmentData?.departments || []}
              label="Search Department"
              allowClear
              onChange={(v) => handleChangeDepartment('reqDepartment', v)}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Spin>
          <Spin spinning={loadingReqEmployee}>
            <HRSelect
              name="requestedBy"
              options={reqDataEmployee?.employees}
              showSearch
              label="Requested By"
              placeholder="Requested By"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              rules={{
                required: true,
              }}
            />
          </Spin>
        </>
      )}

      <HRDivider>Approve Details</HRDivider>

      <Spin spinning={loadingAppDepartment}>
        <HRSelect
          useNative
          showSearch
          value={appDepartment}
          label="Search Department"
          placeholder={'Select Department'}
          allowClear
          options={departmentData?.departments || []}
          onChange={(v) => handleChangeDepartment('appDepartment', v)}
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </Spin>
      <Spin spinning={loadingAppEmployee}>
        <HRSelect
          name="approvals"
          options={appDataEmployee?.employees}
          showSearch
          label={props.requestedByUser ? 'To Be Approved By' : 'Approved By'}
          placeholder="Approved By"
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          rules={{
            required: true,
          }}
          mode="multiple"
          allowClear
        />
      </Spin>

      <HRDivider>Leave Details</HRDivider>
      <Spin spinning={loadingAppDepartment}>
        <HRSelect
          name="department"
          showSearch
          placeholder={'Select Department'}
          options={departmentData?.departments || []}
          label="Assigned Schedule Department"
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          rules={{
            required: true,
          }}
        />
      </Spin>
      <HRTextarea
        name="reason"
        placeholder="Reason for leave."
        label="Reason"
        rules={{
          required: true,
        }}
      />
      <HRCheckbox name="withPay" onChange={handleWithPayChange}>
        With Pay
      </HRCheckbox>
      <HRDivider>Dates</HRDivider>
      <HRSelect
        name="datesType"
        options={datesTypeOption}
        placeholder="Leave Date Type"
        label="Date Type"
        onChange={handleDatesTypeChange}
      />
      {(datesType === employeeRequestDatesType.SINGLE ||
        datesType === employeeRequestDatesType.MIXED) && (
        <>
          <HRDatePicker
            name="singleDate"
            placeholder="Select Date"
            label="Date"
            disabledDate={disabledDate}
            format="MMMM D, YYYY"
            rules={{
              validate: (value) => {
                if (datesType === employeeRequestDatesType.SINGLE) {
                  if (!value) return 'Required';
                }
              },
            }}
          />
          {datesType === employeeRequestDatesType.SINGLE && (
            <HRSelect
              name="scheduleType"
              rules={{
                validate: (value) => {
                  if (datesType === employeeRequestDatesType.SINGLE) {
                    if (!value) return 'Required';
                  }
                },
              }}
              options={scheduleTypes?.list?.map((item) => {
                return {
                  label: item?.name,
                  value: item?.value,
                };
              })}
              placeholder="Leave Date Type"
              label="Schedule Type"
            />
          )}
        </>
      )}

      {datesType === employeeRequestDatesType.RANGE && (
        <>
          <Controller
            name="rangeDates"
            rules={{
              validate: (value) => {
                if (datesType === employeeRequestDatesType.RANGE) {
                  if (!value) return 'Please select date range.';
                  if (!Array.isArray(value)) {
                    return 'Please select date range.';
                  } else if (Array.isArray(value)) {
                    if (value[0] === null || value[1] === null) return 'Please select date range.';
                  }
                  return true;
                }
              },
            }}
            render={(inputProps) => (
              <>
                <label>
                  Date Range
                  <label style={{ color: 'red' }}>
                    {methods.errors?.rangeDates && `(${methods.errors?.rangeDates?.message})`}
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
        </>
      )}
      {datesType === employeeRequestDatesType.MIXED && (
        <HRButton block type="primary" onClick={onAddDate}>
          Add Date
        </HRButton>
      )}
      {(datesType === employeeRequestDatesType.MIXED ||
        datesType === employeeRequestDatesType.RANGE) && (
        <div style={{ marginTop: 20 }}>
          <HRTable pagination={false} columns={columns} dataSource={mixedDates} />
        </div>
      )}

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          alignContent: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <HRButton
          style={{ marginRight: 10 }}
          disabled={loadingSaveRequest}
          onClick={() => props.handleModal(false, false)}
        >
          Cancel
        </HRButton>
        <HRButton type="primary" htmlType="submit" loading={loadingSaveRequest}>
          Submit
        </HRButton>
      </div>
    </HRForm>
  );
}
