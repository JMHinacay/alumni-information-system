import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import { Button } from 'antd';
import React from 'react';

function HourAllocator({
  rowIndex,
  text,
  record,
  tableData,
  setTableData,
  logName,
  toggleValue,
  isModal,
  unallocated,
  setUnallocated,
  logState,
  setLogState,
}) {
  const onClickPlusMinus = (type) => {
    if (isModal === true) {
      if (type === 'plus') {
        let result = unallocated - toggleValue;
        if (result <= 0) {
          let newVal = logState[logName] + unallocated;
          setLogState({ ...logState, [logName]: newVal });
          setUnallocated(0);
        } else {
          setUnallocated(result);
          let newVal = logState[logName] + toggleValue;
          setLogState({ ...logState, [logName]: newVal });
        }
      } else if (type === 'minus') {
        let result = logState[logName] - toggleValue;
        if (result <= 0) {
          setLogState({ ...logState, [logName]: 0 });
          setUnallocated(unallocated + logState[logName]);
        } else {
          let newVal = logState[logName] - toggleValue;
          setLogState({ ...logState, [logName]: newVal });
          setUnallocated(unallocated + toggleValue);
        }
      }
    } else {
      var newRecord;
      if (type === 'plus') {
        let result = record?.unallocated - toggleValue;
        if (result <= 0) {
          newRecord = {
            ...record,
            [logName]: record > [logName] + record?.unallocated,
            unallocated: 0,
          };
        } else {
          newRecord = {
            ...record,
            [logName]: record[logName] + toggleValue,
            unallocated: record?.unallocated - toggleValue,
          };
        }
      } else if (type === 'minus') {
        let result = record[logName] - toggleValue;

        if (result <= 0) {
          let val = record[logName];
          newRecord = {
            ...record,
            [logName]: 0,
            unallocated: record?.unallocated + val,
          };
        } else {
          newRecord = {
            ...record,
            [logName]: record[logName] - toggleValue,
            unallocated: record?.unallocated + toggleValue,
          };
        }
      }

      let newTableData = tableData;
      newTableData[rowIndex] = newRecord;
      setTableData([...newTableData]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
      <Button
        disabled={logState?.[logName] <= 0 ? true : false}
        type="link"
        size={'small'}
        icon={<MinusOutlined />}
        danger
        onClick={() => {
          onClickPlusMinus('minus');
        }}
      ></Button>
      <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={logState[logName]} />
      <Button
        disabled={record?.unallocated <= 0 || unallocated <= 0 ? true : false}
        type="link"
        size={'small'}
        icon={<PlusOutlined />}
        onClick={() => onClickPlusMinus('plus')}
      ></Button>
    </div>
  );
}

export default HourAllocator;
