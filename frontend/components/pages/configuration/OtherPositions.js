import {
  Col,
  Input,
  Row,
  Link,
  Tooltip,
  Button,
  Tag,
  Modal,
  Checkbox,
  message,
  Switch,
} from 'antd';
import { HRTable, HRInput, HRCheckbox, HRForm, HRSelect, HRButton } from '@components/commons';
import { gql, useQuery, useMutation } from '@apollo/client';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { positionDesignationTextFormatter } from '@utils/constantFormatters';
import MomentFormatter from '../../utils/MomentFormatter';
import _ from 'lodash';
import { jobTitleStatus, positionDesignationParents } from '@utils/constants';
const GET_OTHERS_POSITIONS = gql`
  query {
    list: getOtherPositions {
      id
      postdesc
      poscode
      status
    }
  }
`;

const UPSERT_POSITION = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertOtherPosition(id: $id, fields: $fields) {
      message
      success
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation($id: UUID, $status: Boolean) {
    data: updatePositionStatus(id: $id, status: $status) {
      message
      success
    }
  }
`;
const OtherPositions = () => {
  const methods = useForm({
    defaultValues: { poscodeParent: '', postdesc: '', status: true },
  });
  const [modalProps, setModalProps] = useState({ visible: false, record: null, isEdit: false });

  const { data: getPosition, loading: loadingJobTitles, refetch } = useQuery(GET_OTHERS_POSITIONS);

  const [upsertPosition, { loading: loadingUpsertPosition }] = useMutation(UPSERT_POSITION, {
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
  });

  const [updateStatus, { loading: loadingUpdateStatus }] = useMutation(UPDATE_STATUS, {
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
    upsertPosition({
      variables: {
        fields: data,
        id: modalProps?.record?.id,
      },
    });
  };

  const updateActiveStatus = (id, value) => {
    updateStatus({
      variables: { id: id, status: value },
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
      title: 'Description',
      dataIndex: 'postdesc',
      key: 'postdesc',
    },
    {
      title: 'Profession/Position/Designation',
      dataIndex: 'poscode',
      key: 'poscode',
      render: (value) => {
        return positionDesignationTextFormatter(value);
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => {
        return (
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={value}
            onChange={(val) => updateActiveStatus(record.id, val)}
          />
        );
      },
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (value, record) => {
        return (
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
        );
      },
    },
  ];
  return (
    <div>
      <Button type="primary" onClick={() => showModal(null, false)} style={{ marginBottom: 10 }}>
        Add Position <PlusOutlined />
      </Button>
      <HRTable
        dataSource={getPosition?.list}
        columns={columns}
        rowKey={(record) => record?.id}
        size="small"
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
            name="postdesc"
            label="Position Description"
            rules={{ required: true, message: 'This field is requred' }}
          />
          <HRSelect
            label="Profession/Position/Designation"
            name="poscode"
            options={positionDesignationParents}
            rules={{ required: true, message: 'This field is requred' }}
          />
          <HRCheckbox name="status">Active</HRCheckbox>

          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <Button style={{ marginRight: 10 }} onClick={handleCancel}>
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

export default OtherPositions;
