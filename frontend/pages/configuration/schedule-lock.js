import React, { useState } from 'react';
import { HRForm, HRPageHeader, HRButton } from '@components/commons';
import { Col, DatePicker, message, Row, Tag } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import HRTable from '@components/commons/HRTable';
import { useMutation, gql, useQuery, useLazyQuery } from '@apollo/client';
import moment from 'moment';
import MomentFormatter from '@components/utils/MomentFormatter';
import useHasPermission from '@hooks/useHasPermission';
import AccessControl from '@components/accessControl/AccessControl';

const SET_SCHEDULE_LOCK = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar!) {
    data: upsertScheduleLock(id: $id, fields: $fields) {
      payload {
        id
        isLocked
      }
      success
      message
    }
  }
`;

const GET_SCHEDULE_LOCK = gql`
  query($endDate: Instant, $startDate: Instant) {
    dates: getScheduleLock(endDate: $endDate, startDate: $startDate)
  }
`;

const ScheduleLockPage = (props) => {
  const methods = useForm({
    defaultValues: {
      dates: null,
    },
  });
  const [dates, setDates] = useState([]);
  const [queryDates, setQueryDates] = useState(null);
  const isAllowed = useHasPermission(['manage_schedule_lock']);

  const [getScheduleLock, { data, loading }] = useLazyQuery(GET_SCHEDULE_LOCK, {
    onCompleted: (data) => {
      // console.log('oncompleted');
      calculateDates(data?.dates);
    },
    fetchPolicy: 'network-only',
  });

  const [setScheduleLock, { loading: loadingSetScheduleLock }] = useMutation(SET_SCHEDULE_LOCK, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved schedule lock.');
        getScheduleLock({
          variables: {
            startDate: moment(queryDates[0]).startOf('day').utc().format(),
            endDate: moment(queryDates[1]).endOf('day').utc().format(),
          },
        });
      } else message.error(data?.message ?? 'Failed to save schedule lock.');
    },
  });

  const handleSubmit = (values) => {
    setQueryDates(values?.dates);
    getScheduleLock({
      variables: {
        startDate: moment(values?.dates[0]).startOf('day').utc().format(),
        endDate: moment(values?.dates[1]).endOf('day').utc().format(),
      },
    });
  };

  const calculateDates = (dates) => {
    const start = moment(queryDates[0]);
    const end = moment(queryDates[1]);
    let finalDates = [];
    while (start <= end) {
      let formattedDate = start.format('MM_DD_YYYY');
      // console.log(formattedDate);
      if (dates[formattedDate]) {
        finalDates = finalDates.concat({
          date: moment(start),
          status: dates[formattedDate]?.isLocked,
          id: dates[formattedDate]?.id,
        });
      } else {
        finalDates = finalDates.concat({
          date: moment(start),
          status: false,
          id: null,
        });
      }

      start.add(1, 'day');
    }
    setDates(finalDates);
    // console.log(finalDates);
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const handleSetScheduleLock = ({ id, ...fields }) => {
    setScheduleLock({
      variables: { id, fields },
    });
  };

  let columns = [
    {
      title: 'Date',
      key: 'date',
      render: (value, record) => {
        return <MomentFormatter value={record?.date} format="dddd, MMMM D, YYYY" />;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (value, { status }) =>
        status ? <Tag color="red">LOCKED</Tag> : <Tag color="green">OPEN</Tag>,
    },
  ];
  if (isAllowed)
    columns.push({
      title: 'Action',
      key: 'action',
      render: (value, { status, ...record }) => (
        <HRButton
          type={!status ? 'danger' : 'primary'}
          onClick={() => handleSetScheduleLock({ ...record, isLocked: !status })}
        >
          {!status ? 'Lock' : 'Unlock'}
        </HRButton>
      ),
    });

  return (
    <>
      <HRPageHeader title="Schedule Lock Control" />
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Row type="flex" align="bottom" gutter={[12, 12]}>
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
          <Col span={12}>
            <HRButton block type="primary" htmlType="submit">
              Submit
            </HRButton>
          </Col>
        </Row>
      </HRForm>
      <div style={{ marginTop: 20 }}>
        <HRTable
          dataSource={dates || []}
          columns={columns}
          pagination={false}
          rowKey={(r) => r.id ?? moment(r.date).format('MM_DD_YYYY')}
        />
      </div>
    </>
  );
};

export default ScheduleLockPage;
