import {
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { HRButton, HRCheckbox, HRForm, HRInput, HRPageHeader, HRTable } from '@components/commons';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import {
  useDeleteAllowanceTemplate,
  useDeleteAllowanceTemplateItem,
  useGetAllowanceTemplate,
  useUpdateAllowanceTemplateItemStatus,
  useUpsertAllowanceTemplate,
} from '@hooks/allowanceTemplateHooks';
import useHasPermission from '@hooks/useHasPermission';
import {
  Button,
  Divider,
  message,
  Modal,
  Result,
  Space,
  Statistic,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { includes } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AllowanceTemplateItemsModal from './AllowanceTemplateItemsModal';

function AllowanceTemplate({ type }) {
  const methods = useForm({ defaultValues: { name: '', active: true } });
  const [templateItems, setTemplateItems] = useState([]);
  const [allowanceIds, setAllowanceIds] = useState([]);
  const [edit, setEdit] = useState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const queryCallback = (result) => {
    let ids = [];
    setTemplateItems(
      result?.data?.response?.templates?.map((item) => {
        ids.push(item.allowance.id);
        return {
          ...item.allowance,
          active: item.active,
          notes: item.notes,
          allowance: { id: item.allowance.id },
        };
      }),
    );
    setAllowanceIds(ids);
    methods.reset({
      name: result?.data?.response?.name,
      active: result?.data?.response?.active,
    });
  };

  const upsertCallback = (result) => {
    if (result?.data?.success) {
      message.success(result?.data?.message);
      if (type !== 'View') router.back();
      else refetch();
    } else message.error(result?.data?.message);
  };

  const deleteTemplateCallback = (result) => {
    if (result?.data?.success) {
      message.success(result?.data?.message);
      router.back();
    } else message.error(result?.data?.message);
  };

  const { data, loading: loadingAllowanceTemplate, refetch } = useGetAllowanceTemplate({
    id: router?.query.id,
    skip: type == 'Create' && true,
    onCompleted: queryCallback,
  });
  const { upsertAllowanceTemplate, loading: loadingUpsert } = useUpsertAllowanceTemplate({
    onCompleted: upsertCallback,
  });
  const { deleteAllowanceTemplate, loading: loadingDeleteTemplate } = useDeleteAllowanceTemplate({
    onCompleted: deleteTemplateCallback,
  });

  const {
    deleteAllowanceTemplateItem,
    loading: loadingDeleteTemplateItem,
  } = useDeleteAllowanceTemplateItem({
    onCompleted: upsertCallback,
  });

  const {
    updateTemplateItemStatus,
    loading: loadingUpdateTemplateItemStatus,
  } = useUpdateAllowanceTemplateItemStatus({
    onCompleted: upsertCallback,
  });

  const updateAllowanceTemplateData = (selectedRows, selectedRowKeys) => {
    setTemplateItems([
      ...templateItems.filter((item) => includes(selectedRowKeys, item?.id)),
      ...selectedRows.filter((item) => !includes(allowanceIds, item?.id) && item?.id),
    ]);
    setAllowanceIds(selectedRowKeys);
  };

  const deleteTemplateItem = (deletedItemId) => {
    if (type === 'View') {
      confirmation('delete_template_item', deletedItemId);
    } else {
      let itemIds = [];
      setTemplateItems(
        templateItems.filter((item) => {
          if (item.id != deletedItemId) {
            itemIds.push(item.id);
            return true;
          } else return false;
        }),
      );
      setAllowanceIds(itemIds);
    }
  };

  const confirmation = (action, deletedItemId, itemStatus) => {
    const message = {
      delete_template: 'delete this allowance template',
      update_template_status: `set this allowance template as ${
        !data?.active ? 'active' : 'inactive'
      }`,
      delete_template_item: 'delete this template item',
      update_template_item_status: `set this allowance template item as ${
        !itemStatus ? 'active' : 'inactive'
      }`,
    };
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${message[action]}?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        if (action === 'delete_template') {
          deleteAllowanceTemplate({
            variables: {
              id: router?.query?.id,
            },
          });
        } else if (action === 'update_template_status') {
          upsertAllowanceTemplate({
            variables: {
              template_fields: { active: !data?.active },
              template_id: router?.query?.id,
            },
          });
        } else if (action === 'delete_template_item') {
          deleteAllowanceTemplateItem({
            variables: {
              templateId: router?.query?.id,
              allowanceId: deletedItemId,
            },
          });
        } else if (action === 'update_template_item_status') {
          updateTemplateItemStatus({
            variables: {
              templateId: router?.query?.id,
              allowanceId: deletedItemId,
            },
          });
        }
      },
    });
  };

  const onSubmit = (data) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${type.toLowerCase()} this allowance template`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        upsertAllowanceTemplate({
          variables: {
            template_fields: data,
            template_id: router?.query?.id || null,
            item_fields: templateItems.map((item) => ({
              active: item.active,
              amount: item.amount,
              allowanceId: item.id,
              notes: item.notes,
            })),
          },
        });
      },
    });
  };

  useEffect(() => {
    console.log(loadingUpdateTemplateItemStatus);
    setLoading(
      loadingAllowanceTemplate ||
        loadingUpsert ||
        loadingDeleteTemplate ||
        loadingDeleteTemplateItem ||
        loadingUpdateTemplateItemStatus,
    );
  }, [
    loadingAllowanceTemplate,
    loadingUpsert,
    loadingDeleteTemplate,
    loadingDeleteTemplateItem,
    loadingUpdateTemplateItemStatus,
  ]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (text) => <NumeralFormatter withPesos={true} value={text} />,
    },

    {
      title: (
        <>
          Notes{' '}
          {type !== 'View' && (
            <Tooltip title={'Double-click to edit'}>
              <InfoCircleOutlined />
            </Tooltip>
          )}
        </>
      ),
      dataIndex: 'notes',
      width: 350,
      onCell: (record) => {
        if (type !== 'View')
          return {
            onDoubleClick: () => {
              setEdit(record.id);
            },
          };
      },
      render: (text, record) => {
        return edit === record.id ? (
          <HRInput
            defaultValue={record.notes}
            size="small"
            autoFocus
            onBlur={(e) => {
              setEdit(null);
              setTemplateItems(
                templateItems.map((item) => {
                  if (item.id === record.id) return { ...item, notes: e.target.value };
                  else return item;
                }),
              );
            }}
          />
        ) : text ? (
          text
        ) : (
          type !== 'View' && <Typography.Text type="secondary">Add notes</Typography.Text>
        );
      },
    },
    ,
    {
      title: 'Taxable',
      dataIndex: 'taxable',
      width: 100,
      render: (text) => (text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      width: 100,
      render: (active, record) => {
        return (useHasPermission(['permission_to_edit_allowance_template_item_status']) &&
          type === 'View') ||
          type === 'Edit' ? (
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={active}
            onChange={(e) => {
              if (type === 'View')
                confirmation('update_template_item_status', record?.id, record?.active);
              else
                setTemplateItems(
                  templateItems.map((item) => {
                    if (item.id === record.id) return { ...item, active: e };
                    else return item;
                  }),
                );
            }}
          />
        ) : (
          <Tag color={active ? 'blue' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
        );
      },
    },

    ...((useHasPermission(['permission_to_delete_allowance_template_item']) && type === 'View') ||
    type === 'Edit'
      ? [
          {
            title: 'Actions',
            dataIndex: 'id',
            key: 'actions',
            width: 100,

            render: (id, record) => {
              return (
                <Space size={'small'}>
                  <HRButton
                    shape="circle"
                    ghost
                    icon={<DeleteOutlined />}
                    type="primary"
                    danger
                    onClick={() => {
                      deleteTemplateItem(id);
                    }}
                  />
                </Space>
              );
            },
          },
        ]
      : []),
  ];

  if (
    (type === 'Edit' && !useHasPermission(['permission_to_edit_allowance_template'])) ||
    (type === 'Create' && !useHasPermission(['permission_to_create_allowance_template']))
  )
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button onClick={() => router.back()} type="primary">
            Go Back
          </Button>
        }
      />
    );

  return (
    <div>
      <HRForm onSubmit={onSubmit} methods={methods} id="allowance-template-form">
        <HRPageHeader
          title={
            <>
              {type == 'View' ? data?.name : `${type} Allowance Template`}{' '}
              {type !== 'Create' && (
                <Tag color={data?.active ? 'blue' : 'red'}>
                  {data?.active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
              )}
            </>
          }
          onBack={router.back}
          extra={
            <>
              {type !== 'View' && (
                <HRButton htmlType="submit" type="primary">
                  Save
                </HRButton>
              )}
              {type === 'View' && (
                <>
                  <HRButton
                    allowedPermissions={['permission_to_edit_allowance_template_status']}
                    type="primary"
                    onClick={() => confirmation('update_template_status')}
                    loading={loading}
                    danger={data?.active && true}
                  >
                    Set as {!data?.active ? 'Active' : 'Inactive'}
                  </HRButton>
                  {data?.active && data?.total > 0 && (
                    <HRButton
                      type="primary"
                      href={`/allowance/employee-allowance/assign/${router?.query.id}`}
                      allowedPermissions={['permission_to_assign_allowance_to_employees']}
                      loading={loading}
                    >
                      Assign
                    </HRButton>
                  )}
                  <HRButton
                    allowedPermissions={['permission_to_delete_allowance_template']}
                    icon={<DeleteOutlined />}
                    tooltipTitle="Delete Allowance Template"
                    type="primary"
                    danger
                    onClick={() => confirmation('delete_template')}
                    loading={loading}
                  />

                  <HRButton
                    href={`/allowance/allowance-template/${router?.query.id}/edit`}
                    icon={<EditOutlined />}
                    tooltipTitle="Edit Allowance Template"
                    htmlType="submit"
                    type="primary"
                    allowedPermissions={['permission_to_edit_allowance_template']}
                    loading={loading}
                  />
                </>
              )}
            </>
          }
        >
          <Statistic title="Total" prefix="₱" value={data?.total} precision={2} />
        </HRPageHeader>
        {type !== 'View' && (
          <>
            <HRInput name="name" label="Name" allowClear rules={{ required: true }} />
            <HRCheckbox name="active">Active</HRCheckbox>
          </>
        )}
      </HRForm>
      <Divider />
      <HRPageHeader
        title="Template Items"
        extra={
          type !== 'View' && (
            <AllowanceTemplateItemsModal
              allowanceIds={allowanceIds}
              updateAllowanceTemplateData={updateAllowanceTemplateData}
            />
          )
        }
      />
      <HRTable
        dataSource={templateItems}
        columns={columns}
        pagination={{
          position: ['topRight', 'bottomRight'],
          showSizeChanger: true,
          size: 'default',
        }}
        size={'small'}
        rowKey={(record) => record?.id}
        loading={loading}
      />
    </div>
  );
}

export default AllowanceTemplate;
