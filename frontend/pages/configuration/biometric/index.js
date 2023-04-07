import React, { useState } from 'react';
import { Col, message, Typography, Tooltip, Modal } from 'antd';
import Head from 'next/head';
import { HRButton, HRDivider, HRList, HRListItem, HRPageHeader } from '@components/commons';
import {
  WifiOutlined,
  UnorderedListOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { SettingOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import UpsertBiometricsModal from '@components/pages/configuration/biometric/UpsertBiometricsModal';
import BiometricsServiceSettingsModal from '@components/pages/configuration/biometric/BiometricsServiceSettingsModal';
import useHasPermission from '@hooks/useHasPermission';
import AccessControl from '@components/accessControl/AccessControl';

const GET_BIOMETRICS = gql`
  query {
    biometrics: get_all_biometric_device {
      id
      deviceName
      deviceUsername
      devicePassword
      ipAddress
      port
    }
  }
`;
const DELETE_BIOMETRICS = gql`
  mutation($id: UUID) {
    data: delete_biometric_device(id: $id) {
      success
      message
    }
  }
`;

const PING_BIOMETRICS = gql`
  mutation($id: UUID) {
    data: ping_device(id: $id) {
      message
      success
    }
  }
`;

function Biometric() {
  const [biometricsSettingsModal, setBiometricsSettingsModal] = useState(false);
  const [biometricsModal, setBiometricsModal] = useState({ selectedData: {}, visible: false });
  const { data, loading, refetch } = useQuery(GET_BIOMETRICS);
  const isAllowed = useHasPermission(['manage_biometric_device']);

  const [deleteBiometrics, { loading: loadingDeleteBiometrics }] = useMutation(DELETE_BIOMETRICS, {
    onCompleted: (result) => {
      let { data } = result || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved biometrics device');
        refetch();
      } else message.error(data?.message ?? 'Failed to update biometrics device');
    },
  });
  const [pingBiometrics] = useMutation(PING_BIOMETRICS, {
    onCompleted: (result) => {
      let { data } = result || {};
      if (data?.success) {
        message.success(data?.message || 'Successfully saved biometrics device');
        refetch();
      } else message.error(data?.message || 'Failed to update biometrics device');
    },
  });

  const handleBiometricsModal = (data, willRefetch) => {
    let newData = {};
    if (willRefetch) refetch();
    if (data) newData = { ...newData, selectedData: data };
    setBiometricsModal({
      ...newData,
      visible: !biometricsModal.visible,
    });
  };

  const handleBiometricsConfigModal = () => setBiometricsSettingsModal(!biometricsSettingsModal);

  const renderRow = (row, index) => {
    return (
      <HRListItem noAction key={row?.id}>
        <Col md={7}>
          <Typography.Text>{row?.deviceName}</Typography.Text>
        </Col>
        <Col md={7}>
          <Typography.Text>{row?.ipAddress}</Typography.Text>
        </Col>
        <Col md={7}>
          <Typography.Text>{row?.port}</Typography.Text>
        </Col>
        <Col md={7}>
          <Tooltip title="Test Connection">
            <HRButton
              shape="circle"
              ghost
              icon={<WifiOutlined />}
              type="primary"
              onClick={() => pingBiometrics({ variables: { id: row?.id } })}
            />
          </Tooltip>
          <AccessControl allowedPermissions={['manage_biometric_device']}>
            <HRDivider type="vertical" />
            <Tooltip title="Edit">
              <HRButton
                shape="circle"
                ghost
                icon={<EditOutlined />}
                type="primary"
                onClick={() => handleBiometricsModal(row, false)}
              />
            </Tooltip>
          </AccessControl>
          <AccessControl allowedPermissions={['manage_biometric_device']}>
            <HRDivider type="vertical" />
            <Tooltip title="Delete">
              <HRButton
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                type="primary"
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you sure?',
                    icon: <ExclamationCircleOutlined />,
                    content: 'Are you sure you want to delete this device?',
                    onOk: () => deleteBiometrics({ variables: { id: row?.id } }),
                  });
                }}
              />
            </Tooltip>
          </AccessControl>
        </Col>
      </HRListItem>
    );
  };

  const headers = [
    {
      text: 'Device Name',
      span: 7,
    },
    {
      text: 'IP Address',
      span: 7,
    },
    {
      text: 'Port',
      span: 7,
    },
    {
      text: 'Action',
      span: 3,
    },
  ];

  return (
    <>
      <Head>
        <title>Biometrics</title>
      </Head>
      <div>
        <HRPageHeader
          title="Biometrics Devices"
          extra={[
            <HRButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleBiometricsModal({}, false)}
              allowedPermissions={['manage_biometric_device']}
            >
              Add Device
            </HRButton>,
          ]}
        />
        <HRList
          title="Biometrics"
          headers={headers}
          dataSource={data?.biometrics || []}
          renderItem={renderRow}
          onRefresh={() => refetch()}
          loading={loading}
          // titleActions={[
          //   <Tooltip title="Settings">
          //     <HRButton
          //       shape="circle"
          //       size="small"
          //       type="link"
          //       icon={<SettingOutlined />}
          //       onClick={handleBiometricsConfigModal}
          //     />
          //   </Tooltip>,
          // ]}
        />
      </div>
      <UpsertBiometricsModal {...biometricsModal} handleModal={handleBiometricsModal} />
      <BiometricsServiceSettingsModal
        visible={biometricsSettingsModal}
        handleModal={handleBiometricsConfigModal}
      />
    </>
  );
}

export default Biometric;
