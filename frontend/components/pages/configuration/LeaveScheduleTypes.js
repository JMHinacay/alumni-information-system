import { Tooltip, Button, Modal, message, Switch } from 'antd';
import {
  HRTable,
  HRInput,
  HRCheckbox,
  HRForm,
  HRSelect,
  HRButton,
  HRInputNumber,
} from '@components/commons';
import { gql, useQuery, useMutation } from '@apollo/client';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import MomentFormatter from '@components/utils/MomentFormatter';

import _ from 'lodash';
import useConstantsService from '@hooks/constants/useConstantsService';

const defaultScheduleTypes = ['Half Day Leave', 'Full Day Leave'];

const LeaveScheduleTypes = () => {
  const methods = useForm({
    defaultValues: { poscodeParent: '', postdesc: '', status: true },
  });
  const [modalProps, setModalProps] = useState({ visible: false, record: null, isEdit: false });

  const { data, loading, refetch, upsert } = useConstantsService('leaveScheduleType', false, {
    mutationParams: {
      onCompleted: (result) => {
        if (result?.data?.success === true) {
          message.success(result?.data?.message);
          setModalProps({ record: null, visible: false, isEdit: null });
          refetch();
        } else {
          message.error(result?.data?.message);
        }
      },
      onError: (error) => {
        message.error('Something went wrong. Please try again later.');
      },
    },
  });

  const showModal = (record, isEdit) => {
    setModalProps({ record: record, visible: true, isEdit });
    methods.reset({
      ...record,
    });
  };

  const handleCancel = () => {
    setModalProps({ record: null, visible: false, isEdit: null });
  };

  const onSubmit = (data) => {
    data.status = data.status === null || data.status === undefined ? false : data.status;
    upsert({
      variables: {
        fields: data,
        id: modalProps?.record?.id || data?.id,
      },
    });
  };

  const columns = [
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 300,
      render: (value) => {
        {
          return <MomentFormatter value={value} />;
        }
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Short Code',
      dataIndex: 'shortCode',
      key: 'shortCode',
    },
    {
      title: 'Hours',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={value}
          onChange={() => onSubmit({ ...record, status: !record.status })}
        />
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (value, record) => (
        <Tooltip title="Edit Job Title">
          <HRButton
            shape="circle"
            ghost
            icon={<EditOutlined />}
            type="primary"
            onClick={(e) => {
              showModal(record, true);
            }}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <div>
      <Button type="primary" onClick={() => showModal(null, false)} style={{ marginBottom: 10 }}>
        Add Schedule Type <PlusOutlined />
      </Button>
      <HRTable
        dataSource={data?.list}
        columns={columns}
        rowKey={(record) => record?.id}
        size="small"
        loading={loading}
      />

      <Modal
        footer={null}
        title="Positon Information"
        visible={modalProps.visible}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <HRForm onSubmit={onSubmit} methods={methods}>
          <HRInput
            name="name"
            label="Name"
            rules={{ required: true, message: 'This field is requred' }}
          />

          <HRInput
            name="shortCode"
            label="Short Code"
            rules={{ required: true, message: 'This field is requred' }}
          />

          <HRInputNumber
            name="value"
            label="Hours"
            rules={{ required: true, message: 'This field is requred' }}
            min={0}
            max={24}
          />

          <HRCheckbox name="status">Active</HRCheckbox>

          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <Button style={{ marginRight: 10 }} onClick={handleCancel} loading={loading}>
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </div>
        </HRForm>
      </Modal>
    </div>
  );
};

export default LeaveScheduleTypes;
