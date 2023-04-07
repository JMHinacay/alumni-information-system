import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { HRButton, HRCheckbox, HRInput, HRPageHeader, HRTable } from '@components/commons';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import {
  useAllowanceTemplatePagination,
  useUpsertAllowanceTemplate,
  useDeleteAllowanceTemplate,
} from '@hooks/allowanceTemplateHooks';
import useHasPermission from '@hooks/useHasPermission';
import { message, Modal, Pagination, Space, Switch, Tag } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
const initialFilterState = {
  filter: '',
  showActive: true,
  size: 10,
  page: 0,
};
function AllowanceTemplatePage() {
  const [filterState, setFilterState] = useState(initialFilterState);

  const { data, loading, refetch } = useAllowanceTemplatePagination({ variables: filterState });

  const upsertCallback = (result) => {
    refetch();
    message.success(result?.data?.message);
  };

  const { upsertAllowanceTemplate, loadingUpsert } = useUpsertAllowanceTemplate({
    onCompleted: upsertCallback,
  });
  const { deleteAllowanceTemplate, loadingDelete } = useDeleteAllowanceTemplate({
    onCompleted: upsertCallback,
  });

  const onChange = debounce((value) => {
    setFilterState({ ...filterState, filter: value });
  }, 500);

  const onNexPage = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, size });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete this allowance template?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        deleteAllowanceTemplate({
          variables: {
            id: id,
          },
        });
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (text) => <NumeralFormatter withPesos={true} value={text} />,
    },

    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text) => {
        return <div>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</div>;
      },
    },

    {
      title: 'Last Modified Date',
      dataIndex: 'lastModifiedDate',
      key: 'createdDate',
      render: (text) => {
        return <div>{moment(text).format('MMMM Do YYYY, h:mm:ss a')}</div>;
      },
    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      render: (active, record) =>
        useHasPermission(['permission_to_edit_allowance_template_status']) ? (
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={active}
            onChange={(e) =>
              upsertAllowanceTemplate({
                variables: {
                  template_fields: { active: e },
                  template_id: record.id,
                },
              })
            }
          />
        ) : (
          <Tag color={active ? 'blue' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
        ),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      width: 100,

      render: (id, record) => {
        return (
          <Space size={'small'}>
            <HRButton
              href={`/allowance/allowance-template/${id}`}
              shape="circle"
              ghost
              icon={<EyeOutlined />}
              type="primary"
            />
            <HRButton
              allowedPermissions={['permission_to_delete_allowance_template']}
              shape="circle"
              ghost
              icon={<DeleteOutlined />}
              loading={loadingDelete}
              type="primary"
              danger={true}
              onClick={() => {
                confirmDelete(id);
              }}
            />
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Head>
        <title>Allowance Template</title>
      </Head>
      <HRPageHeader
        title="Allowance Template"
        extra={
          <HRButton
            allowedPermissions={['permission_to_create_allowance_template']}
            type="primary"
            href={'/allowance/allowance-template/create'}
            icon={<PlusOutlined />}
          >
            Create
          </HRButton>
        }
      />
      <HRInput label="Search" onChange={(e) => onChange(e.target.value)} />
      <HRCheckbox
        checked={filterState.showActive}
        onChange={() => setFilterState({ ...filterState, showActive: !filterState.showActive })}
      >
        Show Active Only
      </HRCheckbox>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Pagination
          defaultCurrent={1}
          total={data?.totalElements}
          pageSize={filterState.size}
          onChange={onNexPage}
          current={filterState.page + 1}
          showSizeChanger
        />
      </div>
      <HRTable
        dataSource={data?.content}
        columns={columns}
        pagination={false}
        rowKey={(record) => record?.id}
        loading={loading || loadingUpsert || loadingDelete}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <Pagination
          defaultCurrent={1}
          total={data?.totalElements}
          pageSize={filterState.size}
          onChange={onNexPage}
          current={filterState.page + 1}
          showSizeChanger
        />
      </div>
    </div>
  );
}

export default AllowanceTemplatePage;
