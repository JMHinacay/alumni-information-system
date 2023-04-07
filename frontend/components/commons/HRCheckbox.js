import React, { forwardRef } from 'react';
import { Checkbox, Input } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

function HRCheckbox(props) {
  const func = useFormContext();
  const { custom } = props;

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
        type={'text'}
        {...props}
        render={({ value, ...inputProps }) => {
          const onChange = props?.onChange
            ? props?.onChange
            : (e) => inputProps.onChange(e.target.checked);
          return (
            <Checkbox {...inputProps} {...props} checked={value} onChange={onChange}>
              {props?.children}
            </Checkbox>
          );
        }}
      />
    </>
  ) : (
    <>
      {props?.label && (
        <div>
          <label>{props?.label}</label>
        </div>
      )}

      <Checkbox style={{ marginBottom: 5 }} {...props}>
        {props?.children}
      </Checkbox>
    </>
  );
}

export default HRCheckbox;
