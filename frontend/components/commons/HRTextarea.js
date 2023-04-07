import React, { forwardRef } from 'react';
import { Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

function HRTextarea(props) {
  const func = useFormContext();
  const { custom } = props;
  const CustomInput = custom;

  if (props?.useNative) {
    return (
      <>
        {props?.label ? (
          <div>
            <label>{props?.label}</label>
          </div>
        ) : null}
        <Input style={{ marginBottom: 5 }} {...props} />
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

      <Controller
        control={func?.control}
        style={{ marginBottom: 5 }}
        as={custom ? CustomInput : Input.TextArea}
        type={'text'}
        {...props}
      />
    </>
  ) : (
    <>
      {props?.label ? (
        <div>
          <label>{props?.label}</label>
        </div>
      ) : null}

      {custom ? (
        <CustomInput {...props} style={{ marginBottom: 5 }} />
      ) : (
        <Input.TextArea style={{ marginBottom: 5 }} {...props} />
      )}
    </>
  );
}

export default HRTextarea;
