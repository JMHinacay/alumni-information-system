import React, { forwardRef } from 'react';
import { InputNumber } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

function HRInputNumber(props) {
  const func = useFormContext();

  if (props?.useNative) {
    return (
      <>
        {props?.label ? (
          <div>
            <label>{props?.label}</label>
          </div>
        ) : null}
        <InputNumber style={{ marginBottom: 5, width: '100%' }} {...props} />
      </>
    );
  }

  return func ? (
    <>
      {props?.label ? (
        <div>
          <label>
            {props?.label}{' '}
            <span style={{ color: 'red' }}>{func?.errors[props?.name] && ' (required)'}</span>
          </label>
        </div>
      ) : null}
      <div>
        <Controller
          control={func?.control}
          style={{ marginBottom: 5, width: '100%' }}
          as={InputNumber}
          type={'text'}
          {...props}
        />
      </div>
    </>
  ) : null;
}

export default HRInputNumber;
