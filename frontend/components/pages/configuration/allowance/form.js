import React, { useEffect } from 'react';
import { Modal, Row, Col, Switch } from 'antd';
import { HRInput, HRForm, HRSelect, HRInputNumber, HRButton, HRDivider } from 'components/commons';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, gql } from '@apollo/react-hooks';

function form(props) {
  const methods = useForm({
    defaultValues: {
      taxable: true,
    },
  });

  const [POST_ALLOWANCE] = useMutation(
    gql`
      mutation($id: UUID, $fields: Map_String_ObjectScalar) {
        POST_ALLOWANCE: postAllowance(id: $id, fields: $fields) {
          success
          payload
        }
      }
    `,
    {
      onCompleted: () => {
        props?.handleModal(null, true);
      },
    },
  );

  useEffect(() => {
    if (props?.visible)
      methods.reset({
        ...props?.selectedRow,
      });
    else methods.reset({});
  }, [props?.selectedRow, props?.visible]);

  function handleSubmit(values) {
    POST_ALLOWANCE({
      variables: {
        id: !_.isEmpty(props?.selectedRow) ? props?.selectedRow?.id : null,
        fields: values,
      },
    });
  }

  function handleSwitchChange(check) {
    // console.log(check);
    methods.setValue('taxable', check, { shouldValidate: true });
  }

  return (
    <div>
      <Modal
        title="Allowances"
        centered
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
        visible={props?.visible}
        onCancel={props?.handleCancel}
        // onOk={() => setVisible(false)}
        // onCancel={props?.handleCancel}
        width={1000}
      >
        <HRForm onSubmit={handleSubmit} methods={methods}>
          <Row gutter={4}>
            <Col md={24}>
              <HRInput
                label={'Template Name'}
                name={'templateName'}
                placeHolder={'Template Name'}
                rules={{ required: true }}
                defaultValue={props?.selectedRow?.templateName}
              />
            </Col>
            <Col md={24}>
              <HRSelect
                label={'Pay-frequency'}
                name={'payFrequency'}
                placeHolder={'Pay-frequency'}
                showSearch
                rules={{ required: true }}
                allowClear
                options={[
                  { key: 1, value: 'Monthly' },
                  { key: 2, value: 'Semi-Monthly' },
                ]}
                defaultValue={props?.selectedRow?.payFrequency}
              />
            </Col>
            <Col md={12}>
              <HRInputNumber
                rules={{ required: true }}
                label={'Allowed Minimum Amount'}
                name={'minAmount'}
                placeHolder={'Allowed Minimum Amount'}
                defaultValue={props?.selectedRow?.minAmount}
              />
            </Col>
            <Col md={12}>
              <HRInputNumber
                rules={{ required: true }}
                label={'Allowed Maximum Amount'}
                name={'maxAmount'}
                placeHolder={'Allowed Maximum Amount'}
                defaultValue={props?.selectedRow?.maxAmount}
              />
            </Col>
            <Col md={24} style={{ marginTop: 10 }}>
              Taxables
              <Controller
                name="taxable"
                render={(inputProps) => {
                  //   console.log(inputProps);
                  return (
                    <Switch
                      rules={{ required: true }}
                      style={{ marginLeft: 10 }}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      name={inputProps.name}
                      checked={inputProps.value}
                      onChange={handleSwitchChange}
                      defaultValue={props?.selectedRow?.taxable}
                    />
                  );
                }}
              />
            </Col>
          </Row>
          <HRDivider />
          <Row gutter={2}>
            <Col md={2}>
              <HRButton type={'primary'} danger onClick={props?.handleCancel}>
                Cancel
              </HRButton>
            </Col>
            <Col md={2} style={{ marginLeft: 5 }}>
              <HRButton type={'primary'} key="submit" htmlType="submit">
                Submit
              </HRButton>
            </Col>
          </Row>
        </HRForm>
      </Modal>
    </div>
  );
}

export default form;
