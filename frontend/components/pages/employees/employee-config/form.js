import React, { useState } from 'react';
import {
  Modal,
  Row,
  Col,
  Card,
  List,
  Divider,
  Radio,
  Popconfirm,
  Tooltip,
  message,
  Badge,
  Empty,
  Typography,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  SafetyOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { HRButton, HRModal } from '@components/commons';
import { useQuery, useMutation, gql } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { icon } from '@fortawesome/fontawesome-svg-core';

function BiometricForm(props) {
  const [show, setShow] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [disable, setDisable] = useState(true);

  const { loading, data, refetch } = useQuery(
    gql`
      query {
        devices: get_all_biometric_device {
          id
          ipAddress
          deviceName
        }
      }
    `,
    {
      variables: {
        id: props?.selectedRow?.id,
      },
    },
  );

  const { loading: load, data: deviceData, refetch: refetchData } = useQuery(
    gql`
      query($id: UUID) {
        device: findAllEmployeeBiometric(id: $id) {
          id
          biometricDevice {
            id
            deviceName
          }
        }
      }
    `,
    {
      variables: {
        id: props?.selectedRow?.id,
      },
    },
  );

  function afterClose() {
    setShow(false);
  }

  function handleShow() {
    setShow(!show);
  }

  function handleShowExtra(id) {
    // console.log(id, 'test');
    setShowExtra(!showExtra);
    setDisable(!disable);
  }

  const [deleteBiometric] = useMutation(
    gql`
      mutation($id: UUID) {
        deleteBiometricAssign(id: $id) {
          message
        }
      }
    `,
    {
      onCompleted: () => {
        refetchData();
        message.success({ content: 'Successfully Deleted' });
      },
    },
  );

  function handleDelete(id) {
    deleteBiometric({
      variables: {
        id: id,
      },
    });
  }

  const [ASSIGN_EMPLOYEE] = useMutation(
    gql`
      mutation($id: UUID, $biometric_id: UUID, $employee_id: UUID) {
        data: getEmployeeNo(id: $id, biometric_id: $biometric_id, employee_id: $employee_id) {
          message
          success
          payload
        }
      }
    `,
    {
      onCompleted: (result) => {
        let { data } = result || {};

        if (data?.success) {
          message.success(data?.message ?? 'Successfully Assign');
          refetchData();
        } else message.error(data?.message ?? 'unsuccessful Assign');
      },
    },
  );

  const handleSelect = (id) => {
    // console.log(id, 'test');
    ASSIGN_EMPLOYEE({
      variables: {
        id: !_.isEmpty() ? id : null,
        biometric_id: id,
        employee_id: props?.selectedRow?.id,
      },
    });
  };

  function cancel(e) {
    // console.log(e);
  }

  return (
    <div>
      <HRModal
        title="Biometric User"
        centered
        // footer={null}
        visible={props?.visible}
        onOk={props?.handleClose}
        maskClosable={true}
        onCancel={props?.handleClose}
        destroyOnClose={false}
        width={1000}
        afterClose={afterClose}
      >
        <div style={listStyle}>
          <List>
            <Row>
              <Col md={12}>{props?.selectedRow?.fullName}</Col>
              <Col md={12}>
                {show ? (
                  <Tooltip title={'Hide Device'}>
                    <FontAwesomeIcon
                      icon={faEye}
                      style={showButtton}
                      onClick={() => handleShow()}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={'Show Device'}>
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      style={showButtton}
                      onClick={() => handleShow()}
                    />
                  </Tooltip>
                )}
              </Col>
            </Row>
          </List>
        </div>
        {show &&
          (deviceData?.device?.length === 1 ? (
            <div style={divStyle}>
              {deviceData?.device?.map(({ id, biometricDevice }) => {
                return (
                  <>
                    <Row gutter={6}>
                      <Col md={6}>
                        <Badge.Ribbon
                          style={{ backgroundColor: 'red', color: 'black' }}
                          text={showExtra ? 'selected' : null}
                        >
                          <Card
                            style={gridStyle}
                            hoverable={true}
                            bordered={false}
                            // style={gridStyle}
                            onClick={() => handleShowExtra(id)}
                          >
                            {biometricDevice?.deviceName}
                          </Card>
                        </Badge.Ribbon>
                      </Col>
                    </Row>
                    <Row gutter={6}>
                      <Col md={24}>
                        <HRButton
                          onClick={() => handleDelete(id)}
                          disabled={disable}
                          type={'primary'}
                          danger
                          style={{ marginTop: 10, float: 'right' }}
                        >
                          Delete
                        </HRButton>
                      </Col>
                    </Row>
                    <Divider />
                  </>
                );
              })}
            </div>
          ) : (
            <Empty />
          ))}
        <div>
          <Card title={'Biometric Devices'} bordered={false} style={divStyle}>
            <Row gutter={6}>
              {/* {data?.devices?.map((devName) => (
                <Col md={6}>
                  <Card.Grid style={gridStyle}>{devName?.deviceName}</Card.Grid>
                </Col>
              ))} */}
              {data?.devices?.map(({ id, ipAddress, deviceName }) => {
                return (
                  <Col md={6} style={mapStyle}>
                    <Popconfirm
                      key={id}
                      title={`Add ${props?.selectedRow?.fullName} to this Device `}
                      onConfirm={() => handleSelect(id)}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Card hoverable={true} bordered={false} style={gridStyle} key={id}>
                        {deviceName}
                      </Card>
                    </Popconfirm>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </div>
      </HRModal>
    </div>
  );
}

const gridStyle = {
  width: '100%',
  textAlign: 'center',
  display: 'block',
  backgroundColor: '#4C94FD',
  color: 'white',
  size: 15,
  borderRadius: '5px',
};

const listStyle = {
  marginTop: 10,
};

const mapStyle = {
  marginTop: 5,
};

const showButtton = {
  float: 'right',
};

const divStyle = {
  marginTop: 30,
};

export default BiometricForm;
