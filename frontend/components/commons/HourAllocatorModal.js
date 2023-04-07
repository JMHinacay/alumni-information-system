import { gql, useMutation, useQuery } from '@apollo/react-hooks';
import MomentFormatter from '@components/utils/MomentFormatter';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import { hourAllocationAmount } from '@utils/constants';
import {
  Col,
  Divider,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import HourAllocator from './HourAllocator';

const GET_LOG = gql`
  query($id: UUID) {
    accumulatedLog: getAccumulatedLogById(id: $id) {
      date
      scheduleStart
      scheduleEnd
      inTime
      outTime
      message
      isError
      finalLogs {
        late
        undertime
        worked
        hoursRestDay
        hoursSpecialHoliday
        hoursSpecialHolidayAndRestDay
        hoursRegularHoliday
        hoursRegularHolidayAndRestDay
        hoursDoubleHoliday
        hoursDoubleHolidayAndRestDay
        hoursRegularOvertime
        hoursRestOvertime
        hoursSpecialHolidayOvertime
        hoursSpecialHolidayAndRestDayOvertime
        hoursRegularHolidayOvertime
        hoursRegularHolidayAndRestDayOvertime
        hoursDoubleHolidayOvertime
        hoursDoubleHolidayAndRestDayOvertime

        hoursWorkedNSD
        hoursRestDayNSD
        hoursSpecialHolidayNSD
        hoursSpecialHolidayAndRestDayNSD
        hoursRegularHolidayNSD
        hoursRegularHolidayAndRestDayNSD
        hoursDoubleHolidayNSD
        hoursDoubleHolidayAndRestDayNSD
        hoursDoubleHolidayAndRestDay
        workedOIC
        hoursSpecialHolidayOIC
        hoursRegularHolidayOIC
        hoursDoubleHolidayOIC
        hoursRegularOICOvertime
        hoursSpecialHolidayOICOvertime
        hoursRegularHolidayOICOvertime
        hoursDoubleHolidayOICOvertime
        hoursWorkedOICNSD
        hoursSpecialHolidayOICNSD
        hoursRegularHolidayOICNSD
        hoursDoubleHolidayOICNSD
        hoursAbsent
      }
      isOvertimeOnly
      isAbsentOnly
      isRestDay
      isRestDayOnly
      isEmpty
    }
  }
`;

const UPDATE_HOURS = gql`
  mutation($id: UUID, $logs: Map_String_ObjectScalar) {
    updateHours(id: $id, logs: $logs) {
      message
      payload
    }
  }
`;
const modalBodyStyle = {
  overflowY: 'scroll',
  height: 'calc(100vh - 174px)',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 0,
};

export default function HourAllocatorModal({
  visible,
  setIsModalVisible,
  selectedId,
  setSelectedId,
  refetchEmployeeLogs,
  updateLogs,
  ...props
}) {
  //=============STATES=================
  const [unallocated, setUnallocated] = useState(0);
  const [customValue, setCustomValue] = useState(0);
  const [predefinedValue, setPredefinedValue] = useState(1);
  const [toggleValue, setToggleValue] = useState(1);
  const [toggleMode, setToggleMode] = useState('predefined');
  const [logState, setLogState] = useState({});
  //==============QUERIES===============
  const { data, loading, refetch } = useQuery(GET_LOG, {
    variables: {
      id: selectedId,
    },
    onCompleted: (result) => {
      setLogState(result?.accumulatedLog?.finalLogs);
    },
  });
  //==============MUTATIONS=============
  const [updateHours, { loading: loadingUpdateHours }] = useMutation(UPDATE_HOURS, {
    onCompleted: (result) => {
      message.success(result?.updateHours?.message);
    },
    onError: () => {
      message.error('Something went wrong, Please try again later.');
    },
  });
  //==============FUNCTIONS=============
  const handleOk = () => {
    if (JSON.stringify(data?.log) === JSON.stringify(logState)) {
      message.success('No changes were made');
    } else {
      updateHours({
        variables: {
          id: selectedId,
          logs: logState,
        },
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeToggleMode = (e) => {
    setToggleMode(e.target.value);
    if (e.target.value === 'custom') {
      setToggleValue(customValue);
    } else if (e.target.value === 'predefined') {
      setToggleValue(predefinedValue);
    }
  };

  const onChangeToggleValue = (value) => {
    setToggleValue(value);
    if (toggleMode === 'custom') setCustomValue(value);
    else if (toggleMode === 'predefined') setPredefinedValue(value);
  };

  const ModalTitleContent = () => {
    return (
      <Space direction="vertical">
        <Typography.Text strong>
          Date: <MomentFormatter format={'ddd, MMMM D, YYYY'} value={data?.log?.date} />
        </Typography.Text>

        <Typography.Text strong>
          Unallocated Hours:{' '}
          {<NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={unallocated} />}
        </Typography.Text>

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Typography.Text strong>Hour Allocation Amount: </Typography.Text>

          <Radio.Group style={{ marginLeft: 8 }} onChange={onChangeToggleMode} value={toggleMode}>
            <Radio value={'predefined'}></Radio>
            <Select
              disabled={toggleMode !== 'predefined' ? true : false}
              value={predefinedValue}
              style={{ width: 120, marginRight: 10 }}
              onChange={onChangeToggleValue}
              options={hourAllocationAmount}
              size="small"
            />
            <Radio value={'custom'}>
              <InputNumber
                step={0.0001}
                disabled={toggleMode !== 'custom' ? true : false}
                placeholder={'Custom'}
                value={customValue}
                min={0}
                size="small"
                onChange={(value) => onChangeToggleValue(value)}
              />
            </Radio>
          </Radio.Group>
        </div>
      </Space>
    );
  };

  return (
    <Modal
      title={ModalTitleContent()}
      visible={visible}
      style={{
        top: 0,
        paddingBottom: 0,
      }}
      bodyStyle={modalBodyStyle}
      onOk={handleOk}
      okText="Save Changes"
      okButtonProps={{ disabled: unallocated != 0, loading }}
      cancelButtonProps={{ loading }}
      onCancel={handleCancel}
      width={570}
      destroyOnClose={true}
      getContainer={false}
      afterClose={() => {
        setUnallocated(0);
        setSelectedId(logState);
        !(JSON.stringify(data?.accumulatedLog?.finalLogs) === JSON.stringify(logState)) &&
          updateLogs();
      }}
    >
      {/* ============Underperformance================ */}

      <Spin size="large" spinning={loading}>
        <>
          <Typography.Title level={4}>Underperformances</Typography.Title>
          <Row>
            <Col span={16}>Late</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="late"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Undertime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="undertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Absent</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursAbsent"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Work Day================ */}
          <Typography.Title level={4}>Work Day</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="worked"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursWorkedNSD"
              />
            </Col>
          </Row>

          <Divider />

          {/* ============Rest Day================ */}
          <Typography.Title level={4}>Work Day OIC</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRestDay"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRestOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRestDayNSD"
              />
            </Col>
          </Row>
          <Divider />
          {/* ============Rest Day================ */}
          <Typography.Title level={4}>Special Holiday</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHoliday"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayNSD"
              />
            </Col>
          </Row>

          <Divider />

          {/* ============Special Holiday OIC================ */}
          <Typography.Title level={4}>Special Holiday OIC</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayOIC"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayOICOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayOICNSD"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Special Holiday and Rest Day================ */}
          <Typography.Title level={4}>Special Holiday and Rest Day</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayAndRestDay"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayAndRestDayOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursSpecialHolidayAndRestDayNSD"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Regular Holiday================ */}
          <Typography.Title level={4}>Regular Holiday</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHoliday"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayNSD"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Regular Holiday OIC================ */}
          <Typography.Title level={4}>Regular Holiday OIC</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayOIC"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayOICOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayOICNSD"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Regular Holiday OIC================ */}
          <Typography.Title level={4}>Regular Holiday and Rest Day</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayAndRestDay"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayAndRestDayOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursRegularHolidayAndRestDayNSD"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Double Holiday================ */}
          <Typography.Title level={4}>Double Holiday</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHoliday"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayNSD"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Double Holiday OIC================ */}
          <Typography.Title level={4}>Double Holiday OIC</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayOIC"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayOICOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayOICOvertime"
              />
            </Col>
          </Row>

          <Divider />
          {/* ============Double Holiday and Rest Day================ */}
          <Typography.Title level={4}>Double Holiday and Rest Day</Typography.Title>
          <Row>
            <Col span={16}>Regular</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayAndRestDay"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Overtime</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayAndRestDayOvertime"
              />
            </Col>
          </Row>
          <Row>
            <Col span={16}>Nightshift Differential</Col>
            <Col span={8} style={{ display: 'flex' }}>
              <HourAllocator
                isModal={true}
                unallocated={unallocated}
                setUnallocated={setUnallocated}
                toggleValue={toggleValue}
                logState={logState}
                setLogState={setLogState}
                logName="hoursDoubleHolidayAndRestDayNSD"
              />
            </Col>
          </Row>
        </>
      </Spin>
    </Modal>
  );
}
