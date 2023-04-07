import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { HRButton, HRInput, HRPageHeader, HRTable } from '@components/commons';
import CreateEditAllowanceModal from '@components/pages/allowance/CreateEditAllowanceModal';
import MomentFormatter from '@components/utils/MomentFormatter';
import allowanceHooks from '@hooks/Allowance';
import { Button, message, Modal, Pagination, Space, Tooltip } from 'antd';
import { debounce } from 'lodash';
import Head from 'next/head';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import { useState } from 'react';
import useHasPermission from '@hooks/useHasPermission';

const initialState = {
  pageSize: 10,
  page: 0,
  filter: '',
};
function AllowancesPage() {
  const [state, setState] = useState(initialState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedAllowance, setSelectedAllowance] = useState();
  const { useAllowancePagination, useDeleteAllowance } = allowanceHooks;
  const {
    data: allowanceData,
    loading: allowanceLoading,
    refetch: allowanceRefetch,
  } = useAllowancePagination(state.page, state.pageSize, state.filter);
  const [deleteAllowance, { loading: isDeleting }] = useDeleteAllowance();

  function upsertCallback(result) {
    message[result.data.success ? 'success' : 'error'](result.data.message);
    allowanceRefetch(state);
    setSelectedAllowance(null);
    setIsModalVisible(false);
  }
  const onNexPage = (page, pageSize) => {
    setState({ ...state, page: page - 1, pageSize });
  };
  const delayedFilterAllowace = debounce(
    (e) =>
      setState({
        ...state,
        filter: e,
      }),
    500,
  );
  function searchFilter(e) {
    delayedFilterAllowace(e);
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => {
        return <NumeralFormatter format={'0,0.00'} withPesos={true} value={text} />;
      },
    },
    {
      title: 'Taxable',
      dataIndex: 'taxable',
      key: 'taxable',
      render: (text) => {
        return text ? 'Yes' : 'No';
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (value) => {
        {
          return <MomentFormatter value={value} format={'MMM D, YYYY'} />;
        }
      },
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      render: (value) => {
        {
          return <MomentFormatter value={value} format={'MMM D, YYYY'} />;
        }
      },
    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
    },
    ...(useHasPermission(['permission_to_edit_allowance', 'permission_to_delete_allowance'])
      ? [
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
              return (
                <Space size={'small'}>
                  <HRButton
                    allowedPermissions={['permission_to_edit_allowance']}
                    tooltipTitle="Edit Allowance"
                    shape="circle"
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={() => {
                      setSelectedAllowance(record.id);
                      setIsModalVisible(true);
                      setModalTitle('Edit Allowance');
                    }}
                  />
                  <HRButton
                    allowedPermissions={['permission_to_delete_allowance']}
                    tooltipTitle={'Delete Allowance'}
                    shape="circle"
                    danger
                    icon={<DeleteOutlined />}
                    type="primary"
                    loading={isDeleting}
                    onClick={() => {
                      Modal.confirm({
                        title: 'Confirmation',
                        content: `Are you sure you want to delete this allowance?`,
                        okText: 'Yes',
                        cancelText: 'No',
                        async onOk() {
                          await deleteAllowance({
                            variables: {
                              id: record.id,
                            },
                          });
                          allowanceRefetch();
                        },
                      });
                    }}
                  />
                </Space>
              );
            },
          },
        ]
      : []),
    ,
  ];
  return (
    <div style={{ margin: '20px 0' }}>
      <Head>
        <title>Allowances</title>
      </Head>
      <HRPageHeader
        title="Allowances"
        extra={
          <HRButton
            allowedPermissions={['permission_to_create_allowance']}
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
              setModalTitle('Create Allowance');
              setSelectedAllowance();
            }}
          >
            Create
          </HRButton>
        }
      />
      <HRInput
        name="filter"
        label="Search Allowance"
        allowClear
        onChange={(e) => {
          searchFilter(e.target.value);
        }}
      />
      <Pagination
        style={{ margin: '20px 0', float: 'right' }}
        defaultCurrent={1}
        pageSize={state.pageSize}
        total={allowanceData?.totalElements}
        onChange={onNexPage}
        current={state.page + 1}
      />
      <HRTable
        bordered
        columns={columns}
        dataSource={allowanceData?.content}
        rowKey={(record) => record.id}
        pagination={false}
        loading={allowanceLoading}
      />
      <Pagination
        style={{ margin: '20px 0', float: 'right' }}
        defaultCurrent={1}
        pageSize={state.pageSize}
        total={allowanceData?.totalElements}
        onChange={onNexPage}
        current={state.page + 1}
      />
      <CreateEditAllowanceModal
        selectedAllowance={selectedAllowance}
        visible={isModalVisible}
        title={modalTitle}
        setIsModalVisible={setIsModalVisible}
        upsertCallback={upsertCallback}
      />
    </div>
  );
}

export default AllowancesPage;
