import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { HRButton, HRDivider, HRPageHeader, HRSelect } from '@components/commons';
import { AutoComplete, Col, Input, message, Row, Spin } from 'antd';
import { gql } from 'apollo-boost';
import Head from 'next/head';

import DepartmentSchedule from '@components/pages/configuration/department-schedule/DepartmentSchedule';

const GET_DEPT_SCHED = gql`
  query($id: UUID) {
    schedule: getDepartmentSchedule(id: $id) {
      id
      departmentName
      schedules: workSchedule {
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

const DepartmentSchedulePage = (props) => {
  const [filter, setFilter] = useState(null);
  const [formModal, setFormModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({
    value: '',
    department: '',
  });
  const { data, loading, refetch } = useQuery(GET_DEPT_SCHED, {
    variables: {
      id: filter,
    },
  });
  const { data: departmentData, loading: loadingDepartment, refetch: refetchDepartment } = useQuery(
    DEPARTMENT_QUERY,
  );

  const handleFormModal = (selectedRow = {}, willRefetch) => {
    setSelectedRow({ ...selectedRow });
    if (willRefetch) refetch();
    setFormModal(!formModal);
  };

  const onChange = (value) => {
    setFilter(value);
  };

  return (
    <>
      <Head>
        <title>Department Work Schedule</title>
      </Head>
      <HRPageHeader title="Department Work Schedule" />

      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <HRSelect
            options={departmentData?.departments}
            placeholder="Search Department"
            allowClear={true}
            onChange={onChange}
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Col>
      </Row>

      <Spin spinning={loading}>
        {(data?.schedule || []).map((dept) => {
          return <DepartmentSchedule key={dept?.id} department={dept} refetch={refetch} />;
        })}
      </Spin>
    </>
  );
};

export default DepartmentSchedulePage;
