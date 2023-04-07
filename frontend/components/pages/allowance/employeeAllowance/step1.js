import { WarningFilled } from '@ant-design/icons';
import { gql, useQuery } from '@apollo/react-hooks';
import { HRButton, HRSelect, HRTable } from '@components/commons';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import { useGetAllowanceTemplateItemsByTemplateId } from '@hooks/allowanceTemplateItems';
import { Alert, Spin, Tag, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Step1 = (props) => {
  const router = useRouter();
  const [templateItems, setTemplateItems] = useState([]);
  const { data: allowanceTemplates, loading: templateLoading } = useQuery(gql`
    query {
      list: getActiveAllowanceTemplates {
        id
        name
      }
    }
  `);

  const { loading: itemLoading } = useGetAllowanceTemplateItemsByTemplateId({
    variables: { id: props?.selectedData?.selectedTemplate, showActive: true },
    onCompleted: queryCallback,
    skip: !props?.selectedData?.selectedTemplate ? true : false,
  });
  function queryCallback(result) {
    setTemplateItems(result?.list?.map(({ allowance }) => ({ ...allowance })));
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
      width: 100,
      render: (text) => (text ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  return (
    <div style={{ marginTop: '50px' }}>
      <Spin spinning={templateLoading}>
        <HRSelect
          label="Select Template"
          placeholder={'Select Template'}
          allowClear={true}
          showSearch
          options={allowanceTemplates?.list?.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          value={props?.selectedData?.selectedTemplate}
          onChange={(value) => {
            props?.setSelectedData({
              ...props?.selectedData,
              selectedTemplate: value,
            });
          }}
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      </Spin>
      <Alert
        style={{ margin: '20px 0px' }}
        message="Warning"
        description={
          <Typography.Text style={{ fontSize: 15 }}>
            <ul>
              <li>
                All inactive allowance template items will not be added to the employee allowance.
              </li>
              <li>
                Templates with a total amount of less than or equal to one(1) will not be
                selectable.
              </li>
            </ul>
          </Typography.Text>
        }
        type="warning"
        showIcon
        icon={<WarningFilled />}
      />
      <HRTable
        bordered
        dataSource={templateItems}
        columns={columns}
        rowKey={(record) => record?.id}
        pagination={false}
        loading={itemLoading}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <HRButton disabled type="primary" style={{ marginTop: 10, marginRight: 10 }}>
          Previous
        </HRButton>
        <HRButton
          disabled={props?.selectedData?.selectedTemplate ? false : true}
          type="primary"
          style={{ marginTop: 10 }}
          onClick={() => {
            props.setCurrent(props.current + 1);
          }}
        >
          Next
        </HRButton>
      </div>
    </div>
  );
};

export default Step1;
