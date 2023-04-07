import React, { forwardRef } from 'react';
import { Input, Popconfirm } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
const { Search } = Input;
function HRInput(props) {
  const func = useFormContext();
  const { custom } = props;
  const CustomInput = custom;

  return (
    <>
      {props?.label ? (
        <div>
          <label>{props?.label}</label>
        </div>
      ) : null}
      <Search
        style={{ marginBottom: 5 }}
        {...props}
        placeholder={props?.placeholder ?? props?.label}
      />
    </>
  );
}

export default HRInput;
