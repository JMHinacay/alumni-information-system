import React, { forwardRef } from 'react';
import { Input, Popconfirm } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

function HRInput(props) {
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
        <Input
          style={{ marginBottom: 5 }}
          {...props}
          placeholder={props?.placeholder ?? props?.label}
        />
      </>
    );
  }

  return func ? (
    <>
      {props?.label ? (
        <div>
          <label>
            {props?.label}{' '}
            <span style={{ color: 'red' }}>
              {func?.errors[props?.name] &&
                (func?.errors[props?.name].message
                  ? func?.errors[props?.name].message
                  : ` (required)`)}
            </span>
          </label>
        </div>
      ) : null}

      <Controller
        control={func?.control}
        style={{ marginBottom: 5 }}
        as={custom ? CustomInput : Input}
        type={'text'}
        placeholder={props?.placeholder ?? props?.label}
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
        <CustomInput
          {...props}
          style={{ marginBottom: 5 }}
          placeholder={props?.placeholder ?? props?.label}
        />
      ) : (
        <Input
          style={{ marginBottom: 5 }}
          {...props}
          placeholder={props?.placeholder ?? props?.label}
        />
      )}
    </>
  );
}

export default HRInput;
