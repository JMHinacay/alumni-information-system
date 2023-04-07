import React, { useState } from 'react';
import {
  PageHeader,
  Row,
  Col,
  Divider,
  Input,
  Typography,
  Tag,
  List,
  Tooltip,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { HRList, HRListItem, HRButton } from 'components/commons';
import { gql } from 'apollo-boost';
import AllowanceForm from '@components/pages/configuration/allowance/form';

function allowance() {
  const [state, setState] = useState({ search: '' });
  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const methods = useForm();
  const { Search } = Input;

  function handleCancel() {
    setVisible(!visible);
  }

  function handleModal(selectedRow, willRefetch) {
    setSelectedRow(selectedRow);
    if (willRefetch) refetch();
    setVisible(!visible);
  }

  const { loading, data, refetch } = useQuery(
    gql`
      query($search: String) {
        allowance: findAllLikeAllowance(search: $search) {
          id
          templateName
          taxable
          maxAmount
          minAmount
          payFrequency
        }
      }
    `,
    {
      variables: {
        search: state.search,
      },
    },
  );

  function handleEdit(row) {
    // console.log(row);
    handleModal(row, false);
  }

  const [deleteAllowance] = useMutation(
    gql`
      mutation($id: UUID) {
        deleteAllowance(id: $id) {
          message
        }
      }
    `,
    {
      onCompleted: () => {
        refetch();
      },
    },
  );

  function handleDelete(row) {
    // console.log(row);
    deleteAllowance({
      variables: {
        id: row?.id,
      },
    });
  }

  const renderRow = (row) => {
    if (row === 'header') {
      return (
        <List.Item itemKey="header" key="header">
          <Row gutter={2} style={{ width: '100%', marginLeft: 30 }}>
            <Col md={6}>
              <Typography.Text style={{ fontWeight: 'bold' }}>Template Name </Typography.Text>
            </Col>
            <Col md={4}>
              <Typography.Text style={{ fontWeight: 'bold', marginBottom: -10 }}>
                Min Amount
              </Typography.Text>
            </Col>
            <Col md={4}>
              <Typography style={{ fontWeight: 'bold', marginBottom: -10 }}>Max Amount</Typography>
            </Col>
            <Col md={3}>
              <Typography style={{ fontWeight: 'bold', marginBottom: -10 }}>
                Pay Frequency
              </Typography>
            </Col>
            <Col md={3}>
              <Typography style={{ fontWeight: 'bold', marginBottom: -10 }}>Taxable</Typography>
            </Col>
            <Col md={2}>
              <Typography style={{ fontWeight: 'bold', marginBottom: -10 }}>Action</Typography>
            </Col>
          </Row>
        </List.Item>
      );
    } else
      return (
        <>
          <HRListItem noAction key={row?.id}>
            <Row
              gutter={2}
              style={{ width: '100%', marginLeft: 30, fontWeight: 'bold', fontSize: 20 }}
            >
              <Col md={6}>
                <Tag color="blue" style={{ fontSize: 15 }}>
                  {row?.templateName}
                </Tag>
              </Col>
              <Col md={4}>
                <Tag color="blue" style={{ fontSize: 15 }}>
                  {row?.minAmount}
                </Tag>
              </Col>
              <Col md={4}>
                <Tag color="blue" style={{ fontSize: 15 }}>
                  {row?.maxAmount}
                </Tag>
              </Col>
              <Col md={3}>
                <Tag color="blue" style={{ fontSize: 15 }}>
                  {row?.payFrequency}
                </Tag>
              </Col>
              <Col md={3}>
                <Tag color="blue" style={{ fontSize: 15 }}>
                  {row?.taxable ? 'Taxable' : 'Non-Taxable'}
                </Tag>
              </Col>
              <Col md={2}>
                <Tooltip title="Edit" key="edit-button">
                  <HRButton
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(row)}
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="Delete" key="delete-button">
                  <Popconfirm
                    title={'Are you sure you want to delete this record?'}
                    onConfirm={() => handleDelete(row)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <HRButton type="primary" shape="circle" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              </Col>
            </Row>
          </HRListItem>
        </>
      );
  };

  return (
    <div>
      <Head>
        <title>Allowance</title>
      </Head>
      <PageHeader title="Allowances"></PageHeader>
      <div>
        <Row gutter={2} style={{ marginBottom: 10 }}>
          <Col md={20}>
            <Search
              name={'Allowance'}
              placeHolder={'Search Allowance here'}
              enterButton
              onChange={(e) => setState({ ...state, search: e.target.value })}
            />
          </Col>
          <Col md={4}>
            <HRButton
              block
              icon={
                <>
                  <PlusOutlined />
                </>
              }
              type="primary"
              onClick={handleModal}
            >
              Add Allowance
            </HRButton>
          </Col>
        </Row>
        <HRList
          onRefresh={() => refetch()}
          title={<div>List of Allowance</div>}
          bordered
          dataSource={['header', ...(data?.allowance || [])]}
          // renderRow={data}
          renderItem={renderRow}
        />
        <AllowanceForm
          visible={visible}
          handleModal={handleModal}
          handleCancel={handleCancel}
          selectedRow={selectedRow}
        />
      </div>
    </div>
  );
}

export default allowance;
