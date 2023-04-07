import React, { useState } from 'react';
import { PageHeader, Modal, Row, Col, Switch, Select } from 'antd';
import { HRForm, HRInput } from '@components/commons';
import { useForm } from 'react-hook-form';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { transform } from 'lodash';

const { Option } = Select;

function form(props) {
  const [state, setState] = useState({ search: '' });
  const methods = useForm();

  const { loading, data, refetch } = useQuery(
    gql`
      query($search: String) {
        employeeLoan: getEmployeeLoanByIdWithFilter(search: $search) {
          id
          status
          laonType
        }
      }
    `,
    {
      variables: {
        search: state.search,
      },
    },
  );

  function selectItem(value) {
    let ObjItem = _.find(data?.employeeLoan, (row) => {
      return row?.id === value;
    });
  }

  function transformItem() {
    return data?.employeeLoan?.map((row, i) => {
      return { value: row?.id, label: row?.loanType };
    });
  }

  function handleSubmit() {
    // console.log('test');
  }

  function onChange(value) {
    // console.log(`selected ${value}`);
  }

  function onBlur() {
    // console.log('blur');
  }

  function onFocus() {
    // console.log('focus');
  }

  function onSearch(val) {
    // console.log('search:', val);
  }

  return (
    <div>
      <Modal
        title="Edit Employee Loan"
        centered
        maskClosable={false}
        visible={props?.visible}
        onOk={() => setVisible(false)}
        onCancel={props?.handleCancel}
        width={1000}
      >
        <HRForm onSubmit={handleSubmit} methods={methods}>
          <Row gutter={2}>
            <Col md={12}>
              Employee
              <Select
                label={'Employee'}
                showSearch
                style={{ width: 475 }}
                placeholder="select employee"
                optionFilterProp="children"
                onChange={selectItem}
                onSearch={onSearch}
                options={transformItem()}
                // filterOption={(input, option) =>
                //   option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </Col>
            <Col md={12}>
              <HRInput label={'Loan Type'} name={'loanType'} placeHolder={'Loan Type'} />
            </Col>
            <Col md={12}>
              <HRInput label={'Loan Amount'} name={'loanAmount'} placeHolder={'Loan Amount'} />
            </Col>
            <Col md={12}>
              <HRInput
                label={'Loan Total Payable'}
                name={'loanTotalPayable'}
                placeHolder={'Loan Total Payable'}
              />
            </Col>
            <Col md={12}>
              <HRInput
                label={'Loan Monthly Payable'}
                name={'loanMonthlyPayable'}
                placeHolder={'Loan Monthly Payable'}
              />
            </Col>
            <Col md={12}>
              <HRInput label={'Note'} name={'Note'} placeHolder={'Note'} />
            </Col>
          </Row>
        </HRForm>
      </Modal>
    </div>
  );
}

export default form;
