import React, { forwardRef } from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import _ from 'lodash';

function NumericInput(props, ref) {
  function onChange(e) {
    const { value } = e.target;
    const reg = props?.reg || /^-?[0-9]*(\.[0-9]*)?$/;
		if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      props.onChange(value);
    }
  }

  function onBlur() {
    const { value, onBlur, onChange } = props;
    if (!_.isEmpty(value)) {
      let valueTemp = value;
      if (value.charAt(value.length - 1) === '.' || value === '-') {
        valueTemp = value.slice(0, -1);
      }
      onChange(valueTemp.replace(/0*(\d+)/, '$1'));
      if (onBlur) {
        onBlur();
      }
    }
  }

  return (
    <Div style={{ marginBottom: 5, ...props?.containerStyle }}>
      {props.error ? (
        <label htmlFor={props.field} className={'error'}>
          {props.error}
        </label>
      ) : (
        <label htmlFor={props.field} className={'label'}>
          {props.label}
        </label>
      )}
      <Input
        ref={ref}
        autoComplete={'off'}
        {...props}
        id={props.field}
        placeholder={props.placeholder || props.label}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={25}
        onPressEnter={props.onPressEnter}
      />
    </Div>
  );
}

export default forwardRef(NumericInput);

const defaultProps = Input.propTypes;

NumericInput.propTypes = {
  ...defaultProps,
};

const Div = styled.div`
  .label {
    font-weight: bold;
    color: #222f3e;
  }

  .error {
    font-weight: bold;
    color: #d63031;
  }
`;
