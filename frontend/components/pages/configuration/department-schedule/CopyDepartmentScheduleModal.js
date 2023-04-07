import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { HRButton, HRList, HRListItem, HRModal, HRSelect } from '@components/commons';
import MainLayout from '@components/mainlayout';
import { Col, message, Modal, Row, Spin, Typography } from 'antd';
import React, { useState, useEffect } from 'react';

const DEPARTMENT_QUERY = gql`
  {
    departments {
      id
      value: id
      label: departmentName
    }
  }
`;

// getOneDepartmentSchedule
const GET_ONE_DEPT_SCHED = gql`
  query($id: UUID) {
    schedules: getOneDepartmentSchedule(id: $id) {
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
`;

const COPY_DEPT_SCHED = gql`
  mutation($id: UUID, $department: UUID) {
    data: copyDepartmentSchedule(id: $id, department: $department) {
      success
      message
    }
  }
`;

const scheduleHeaders = [
  {
    text: 'Title',
    span: 8,
  },
  {
    text: 'Label',
    span: 4,
  },
  {
    text: 'Time Start',
    span: 4,
  },
  {
    text: 'Time End',
    span: 4,
  },
  {
    text: 'Color',
    span: 4,
  },
];

const CopyDepartmentScheduleModal = (props) => {
  const [selected, setSelected] = useState(null);
  let { data, loading, refetch } = useQuery(DEPARTMENT_QUERY);
  const [copyDepartmentSchedule, { loading: loadingCopyDepartmentSchedule }] = useMutation(
    COPY_DEPT_SCHED,
    {
      onCompleted: (result) => {
        const data = result?.data || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully copied department schedule config.');
          props?.handleModal(true);
        } else message.error(data?.message ?? 'Failed to copy department schedule config.');
      },
    },
  );
  let [
    getOneDepartmentSchedule,
    { data: departmentData, loading: loadingGetOneDepartmentSchedule },
  ] = useLazyQuery(GET_ONE_DEPT_SCHED);

  useEffect(() => {
    if (!props?.visible) {
      setSelected(null);
    }
  }, [props?.visible]);

  const handleSelectDeparment = (id) => {
    setSelected(id);
    getOneDepartmentSchedule({
      variables: {
        id,
      },
    });
  };

  const handleSubmit = () => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This will override the department schedule. Do you still want to proceed?',
      onOk: () =>
        copyDepartmentSchedule({
          variables: {
            id: props?.department,
            department: selected,
          },
        }),
    });
  };

  return (
    <>
      <HRModal
        visible={props?.visible}
        title="Copy Schedule From Other Departments"
        width={'50%'}
        footer={null}
        onCancel={() => props?.handleModal(false)}
      >
        <Spin spinning={loading}>
          <HRSelect
            showSearch
            value={selected}
            placeholder={'Select Department'}
            options={data?.departments || []}
            onSelect={handleSelectDeparment}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Spin>

        <div style={{ marginTop: 20 }}>
          <Spin size="large" spinning={loadingGetOneDepartmentSchedule}>
            <HRList
              title="Department Schedule"
              headers={scheduleHeaders}
              dataSource={selected ? departmentData?.schedules || [] : []}
              renderItem={(item) => {
                return (
                  <HRListItem noAction>
                    <Row style={{ width: '100%' }}>
                      <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography.Text>{item.title || 'N/A'}</Typography.Text>
                      </Col>
                      <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography.Text>{item.label || 'N/A'}</Typography.Text>
                      </Col>
                      <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography.Text>{item?.dateTimeStart ?? 'N/A'}</Typography.Text>
                      </Col>
                      <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography.Text>{item?.dateTimeEnd ?? 'N/A'}</Typography.Text>
                      </Col>
                      <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                        {item?.color ? (
                          <span
                            style={{
                              width: 25,
                              height: 25,
                              backgroundColor: item?.color,
                              display: 'inline-block',
                              borderRadius: 25,
                            }}
                          />
                        ) : (
                          'N/A'
                        )}
                      </Col>
                    </Row>
                  </HRListItem>
                );
              }}
            />
          </Spin>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <div>
            <HRButton style={{ marginRight: 10 }} onClick={() => props?.handleModal(false)}>
              Cancel
            </HRButton>
            <HRButton type="primary" onClick={handleSubmit} loading={loadingCopyDepartmentSchedule}>
              Submit
            </HRButton>
          </div>
        </div>
      </HRModal>
    </>
  );
};

export default CopyDepartmentScheduleModal;
