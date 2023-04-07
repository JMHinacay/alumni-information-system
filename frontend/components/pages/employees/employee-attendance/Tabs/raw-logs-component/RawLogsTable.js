import React, { Fragment, useContext } from 'react';
import { Pagination, Tag } from 'antd';
import { BsEyeSlash, BsEye } from 'react-icons/bs';

import { EditOutlined } from '@ant-design/icons';
import { hasPermission } from '@utils/accessFunctions';

import HRTable from '@components/commons/HRTable';
import { AccountContext } from '@components/accessControl/AccountContext';
import MomentFormatter from '@components/utils/MomentFormatter';
import { HRButton } from '@components/commons';

import AttendanceModal from '../AttendanceModal';

export default function RawLogsTable({
  totalElements,
  pageSize,
  onNextPage,
  currentPage,
  attendanceModal,
  handleAttendanceModal,
  onClickIgnored,
  loading,
  dataSource = [],
  showTags = true,
  useStaticDate = false
}) {

  const accountContext = useContext(AccountContext);

  const hasAttendancePermission = hasPermission(
    ['manage_raw_logs', 'ignore_unignore_attendance_logs'],
    accountContext?.data?.user?.access,
  );

  let columns = [
    {
      title: <strong>Date/Time</strong>,
      dataIndex: 'attendance_time',
      key: 'date-time',
      render: (
        text,
        { isManual, isIgnored, type, originalType, attendance_time, original_attendance_time },
      ) => (
        <>
          <span style={{ marginRight: 5 }}>
            <MomentFormatter value={text} format="ddd, MMMM D, YYYY, h:mm:ss A" />
          </span>
          {showTags && (
            <>
              {isManual && <Tag color="blue">MANUAL</Tag>}
              {isIgnored && <Tag color="red">IGNORED</Tag>}
              {(type !== originalType || attendance_time !== original_attendance_time) &&
                !isManual && <Tag color="green">EDITED</Tag>}
            </>
          )}
        </>
      ),
    },
    {
      title: <strong>Status</strong>,
      dataIndex: 'type',
      key: 'age',
    },
    {
      title: <strong>Device</strong>,
      dataIndex: 'source',
      key: 'source',
    },
    ...(hasAttendancePermission ? [{
      title: <strong>Actions</strong>,
      dataIndex: 'address',
      key: 'address',
      width: 150,
      render: (_, log) => {
        let { isIgnored } = log;
        return (
          <Fragment>
            <HRButton
              icon={
                isIgnored ? <BsEye className="anticon" /> : <BsEyeSlash className="anticon" />
              }
              shape="circle"
              type="danger"
              ghost
              onClick={() => onClickIgnored(log)}
              allowedPermissions={['ignore_unignore_attendance_logs']}
              style={{ marginRight: 5 }}
            />

            <HRButton
              icon={<EditOutlined />}
              shape="circle"
              type="primary"
              onClick={() => handleAttendanceModal(log, false)}
              allowedPermissions={['manage_raw_logs']}
            />
          </Fragment>
        );
      },
    }] : [])
  ];

  return (
    <Fragment>

      {
        !useStaticDate && <Pagination
          defaultCurrent={1}
          total={totalElements}
          pageSize={pageSize}
          onChange={onNextPage}
          current={currentPage}
        />
      }

      <HRTable
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        style={{ margin: '10px 0' }}
        pagination={false}
      />

      {
        !useStaticDate && <Pagination
          defaultCurrent={1}
          total={totalElements}
          pageSize={pageSize}
          onChange={onNextPage}
          current={currentPage}
        />
      }

      <AttendanceModal {...attendanceModal} handleModal={handleAttendanceModal} />

    </Fragment>
  );
}