import { Col, Input, Row, Link, Tooltip, Button, Tag, Modal, Checkbox, message } from 'antd';
import { HRTable, HRInput, HRCheckbox, HRForm, HRSelect, HRButton } from '@components/commons';
import { gql, useQuery, useMutation } from '@apollo/client';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { jobTitleStatusColorGenerator } from '@utils/constantFormatters';
import MomentFormatter from '../../../utils/MomentFormatter';
import _ from 'lodash';
import { jobTitleStatus } from '@utils/constants';
const GET_JOBTITLES = gql`
  query {
    list: jobTitleList {
      value
      status
      createdDate
    }
  }
`;

const UPSERT_JOBTITLE = gql`
  mutation($value: String, $fields: Map_String_ObjectScalar) {
    upsertJobTitle(value: $value, fields: $fields) {
      message
      success
    }
  }
`;
const JobTitle = () => {
  const methods = useForm({
    defaultValues: { label: '', value: '', status: '' },
  });
  const [modalProps, setModalProps] = useState({ visible: false, record: null, isEdit: false });

  const { data: getJobTitles, loading: loadingJobTitles, refetch } = useQuery(GET_JOBTITLES);

  const [upsertJobTitle, { loading: loadingUpsertJobTitle }] = useMutation(UPSERT_JOBTITLE, {
    onCompleted: (result) => {
      if (result?.upsertJobTitle?.success === true) {
        message.success(result?.upsertJobTitle?.message);
        setModalProps({ record: null, visible: false, isEdit: null });
        refetch();
      } else {
        message.error(result?.upsertJobTitle?.message);
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
    upsertJobTitle({
      variables: {
        fields: data,
        value: modalProps?.record?.value,
      },
    });
  };

  const columns = [
    { title: 'Value', dataIndex: 'value', key: 'value' },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text) => {
        {
          return <MomentFormatter value={text} />;
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        return <Tag color={jobTitleStatusColorGenerator(text)}>{_.capitalize(text)}</Tag>;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text, record) => {
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
        Add Job Title <PlusOutlined />
      </Button>
      <HRTable dataSource={getJobTitles?.list} columns={columns} rowKey={(record) => record?.id} />

      <Modal
        footer={null}
        title="Edit Job Title"
        visible={modalProps.visible}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <HRForm onSubmit={onSubmit} methods={methods}>
          <HRInput
            name="value"
            label="Value"
            rules={{ required: true, message: 'This field is requred' }}
          />
          <HRSelect
            label="Status"
            name="status"
            options={jobTitleStatus}
            rules={{ required: true, message: 'This field is requred' }}
          />
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

export default JobTitle;
