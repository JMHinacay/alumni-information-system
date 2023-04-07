import { gql, useQuery } from '@apollo/react-hooks';
import { HRButton, HRInput, HRTable } from '@components/commons';
import { Divider, message, Modal, Pagination, Tag } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useLazyAllowancePagination } from '@hooks/allowanceTemplateHooks';

const initialFilterState = {
  pageSize: 10,
  page: 0,
  filter: '',
};

export default function AllowanceTemplateItemsModal({ allowanceIds, updateAllowanceTemplateData }) {
  const [visible, setVisible] = useState(false);
  const [filterState, setFilterState] = useState(initialFilterState);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(allowanceIds);
  const { loadAllowanceTemplates, data, loading } = useLazyAllowancePagination({
    variables: filterState,
  });
  useEffect(() => setSelectedRowKeys(allowanceIds), [allowanceIds]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Taxable',
      dataIndex: 'taxable',
      render: (text) => (text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const onChange = debounce((value) => {
    setFilterState({ ...filterState, filter: value });
  }, 500);

  const handleCancel = () => {
    setSelectedRowKeys(allowanceIds);
    setFilterState({ ...filterState, filter: '' });
    setVisible(false);
  };

  const handleOk = () => {
    updateAllowanceTemplateData(selectedRows, selectedRowKeys);
    message.success('Template items updated successfully.');
    handleCancel();
  };

  const onNexPage = (page, size) => {
    setFilterState({ ...filterState, page: page - 1, pageSize: size });
  };

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows.map((item) => ({ ...item, active: true, notes: '' })));
    },
    selectedRowKeys: selectedRowKeys,
    preserveSelectedRowKeys: true,
  };

  return (
    <>
      <HRButton
        type="primary"
        onClick={() => {
          setVisible(true);
          loadAllowanceTemplates();
        }}
      >
        Add Items
      </HRButton>
      <Modal
        title="Add Allowance Template Items"
        visible={visible}
        width={'70vw'}
        destroyOnClose={true}
        maskClosable={false}
        onOk={handleOk}
        okText="Submit"
        onCancel={handleCancel}
      >
        <HRInput label="Search" onChange={(e) => onChange(e.target.value)} />
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Pagination
            defaultCurrent={1}
            total={data?.totalElements}
            pageSize={filterState.pageSize}
            onChange={onNexPage}
            current={filterState.page + 1}
            showSizeChanger
          />
        </div>
        <HRTable
          dataSource={data?.content}
          columns={columns}
          pagination={false}
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          rowKey={(record) => record?.id}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Pagination
            defaultCurrent={1}
            total={data?.totalElements}
            pageSize={filterState.pageSize}
            onChange={onNexPage}
            current={filterState.page + 1}
            showSizeChanger
          />
        </div>
      </Modal>
    </>
  );
}
