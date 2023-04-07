import React, { forwardRef } from 'react';
import { DatePicker } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import moment from 'moment';

function HRDatePicker(props) {
  const func = useFormContext();
  const { custom } = props;

  if (props?.useNative) {
    return (
      <>
        {props?.label ? (
          <div>
            <label>{props?.label}</label>
          </div>
        ) : null}
        <DatePicker style={{ marginBottom: 5, width: '100%' }} {...props} />
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
        style={{ marginBottom: 5, width: '100%' }}
        render={({ onChange, onBlur, value }) => (
          <DatePicker
            onChange={onChange}
            onBlur={onBlur}
            value={value && moment(value)}
            style={{ marginBottom: 5, width: '100%' }}
            allowClear={false}
            {...props}
          />
        )}
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

      <DatePicker style={{ marginBottom: 5, width: '100%' }} {...props} />
    </>
  );
}

export default HRDatePicker;
