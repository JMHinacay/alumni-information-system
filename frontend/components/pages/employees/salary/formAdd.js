import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Typography, Row, Col, Divider, Popconfirm, message } from 'antd';
import {
  HRListItem,
  HRButton,
  HRForm,
  HRSelect,
  HRInputNumber,
  HRDivider,
} from 'components/commons';
import { useForm } from 'react-hook-form';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';
import { AddOn } from '@utils/constants';
import { values } from 'lodash';


const initialState = {
  template: '',
  Amount: '',
};

// useEffect((data) => {
//   effect
//   return () => {
//     cleanup
//   }
// }, [data])

function FormAdd(props) {
  const [addOn, setAddOn] = useState([]);
  const itemMethods = useForm();
  const methods = useForm({
    defaultValues: initialState,
  });

  // function handleRemoved(index) {
  //   console.log(index);
  //   let deleteItem = [...addOn];
  //   deleteItem.splice(index, 1);
  //   console.log(deleteItem);
  //   setAddOn(deleteItem);
  // }

  const [deleteAddOn] = useMutation(
    gql`
      mutation($id: UUID) {
        deleteAddOn(id: $id) {
          message
        }
      }
    `,
    {
      onCompleted: () => {
        refetch();
        message.success({ content: 'Successfully Deleted' });
      },
    },
  );

  function handleRemoved(row) {
    // console.log(row, 'this is id');
    deleteAddOn({
      variables: {
        id: row?.id,
      },
    });
  }

  const { loading, data, refetch } = useQuery(
    gql`
      query($id: UUID) {
        addOn: employeeAddOns(id: $id) {
          id
          addOn
          amount
        }
      }
    `,
    {
      variables: {
        id: props?.selectedRow?.id,
      },
    },
  );

  // function handleAddOn() {}

  useEffect(
    (addOn) => {
      // console.log(addOn);
    },
    [addOn],
  );

  const [POST_ADD_ON] = useMutation(
    gql`
      mutation($add_on: [Map_String_ObjectScalar], $employee_id: UUID) {
        postAddOn(add_on: $add_on, employee_id: $employee_id) {
          message
          payload
        }
      }
    `,
    {
      onCompleted: () => {
        // methods.reset({});
        // setValue(initialState);
        resetInputValue();
        message.success({ content: 'Successfully Saved' });
        refetch();
        // props?.handleAddOn(true, null);
      },
    },
  );

  function resetInputValue() {
    methods.setValue('addOn', null);
    methods.setValue('amount', null);
  }

  // function handleAddList(value) {
  //   setAddOn([...addOn, value]);
  //   methods.reset(initialState);
  // }

  function handleSubmit(values) {
    POST_ADD_ON({
      variables: {
        employee_id: props?.selectedRow?.id,
        add_on: values,
      },
    });
  }

  function renderRow(row) {
    if (row === 'header') {
      return (
        <List.Item itemKey="header" key="header">
          <Row gutter={2} style={{ width: '100%' }}>
            <Col md={4}>
              <Typography.Text>Add-on</Typography.Text>
            </Col>
            <Col md={3}>
              <Typography.Text>Amount</Typography.Text>
            </Col>
            <Col md={5}>
              <Typography.Text>Effective Until Date</Typography.Text>
            </Col>
            <Col md={5}>
              <Typography.Text>Effective Until Count</Typography.Text>
            </Col>
            <Col md={5}>
              <Typography.Text>Current Count</Typography.Text>
            </Col>
            <Col md={2}>
              <Typography.Text>Action</Typography.Text>
            </Col>
          </Row>
        </List.Item>
      );
    } else
      return (
        <div>
          <HRListItem noAction key={row?.id}>
            <Row gutter={2} style={{ width: '100%' }}>
              <Col md={4}>{row?.addOn}</Col>
              <Col md={3}>{row?.amount}</Col>
              <Col md={5}>{}</Col>
              <Col md={5}>{}</Col>
              <Col md={5}>{}</Col>
              <Col md={2}>
                <Popconfirm
                  title={'Your going to delete this record'}
                  onConfirm={() => handleRemoved(row)}
                  okText={'Yes'}
                  cancelText={'No'}
                >
                  <HRButton type={'danger'} shape={'circle'} icon={<DeleteOutlined />} />
                </Popconfirm>
              </Col>
            </Row>
          </HRListItem>
        </div>
      );
  }

  return (
    <Modal
      title={`Employee Salary Add-ons (Allowances) : ${props?.selectedRow?.fullName}`}
      centered
      bordered={false}
      visible={props?.enable}
      // onOk={() => handleAddOn()}
      footer={null}
      onCancel={props.handleCan}
      width={1000}
      maskClosable={false}
      destroyOnClose={true}
    >
      <div>
        <HRForm onSubmit={handleSubmit} methods={methods} key itemKey>
          <div style={{ padding: 10 }}>
            <Row gutter={4}>
              <Col md={12}>
                <HRSelect
                  label={'ADDON TEMPLATE'}
                  name={'addOn'}
                  placeHolder={'ADDON TEMPLATE'}
                  showSearch
                  rules={{ required: true }}
                  allowClear
                  options={AddOn}
                  // defaultValue={props?.selectedRow?.scheduleType}
                />
              </Col>
              <Col md={12}>
                <HRInputNumber
                  label={'AMOUNT'}
                  name={'amount'}
                  placeHolder={'AMOUNT'}
                  rules={{ required: true }}
                  // defaultValue={props?.selectedRow?.basicSalary}
                />
              </Col>
            </Row>
          </div>
          <Row gutter={4}>
            <Col md={2}>
              <HRButton type={'primary'} key="submit" htmlType="submit">
                <SaveOutlined /> Save Add-On
              </HRButton>
            </Col>
          </Row>
        </HRForm>
      </div>
      <Divider />
      <div>
        <List
          size="large"
          bordered={false}
          // dataSource={addOn.length > 0 ? ['header', ...data?.addOn] : []}
          dataSource={['header', ...(data?.addOn || [])]}
          renderItem={renderRow}
        />
      </div>
      <HRDivider />
      <div style={{ marginTop: 30 }}>
        <Row gutter={2}>
          <Col>
            <HRButton onClick={props?.handleCan} type={'primary'}>
              Done
            </HRButton>
          </Col>
          {/* <Col>
            <HRButton onClick={() => handleSave()} type={'primary'}>
              Save
            </HRButton>
          </Col> */}
        </Row>
      </div>
    </Modal>
  );
}
export default FormAdd;
