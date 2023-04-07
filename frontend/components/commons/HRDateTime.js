import React, { forwardRef, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AccountContext } from '@components/accessControl/AccountContext';
import _ from 'lodash';

function HRDateTime(props, ref) {
  const account = useContext(AccountContext);
  const [disabled, setDisabled] = useState(false);

  HRDateTime.propTypes = {
    field: PropTypes.string.isRequired,
  };

  useEffect(() => {
    if (props?.applyPermissionPolicy) {
      if (_.indexOf(account?.user?.access, props?.permission) > -1) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(false);
    }
  }, []);

  let showTime = false,
    dateTimeFormat = 'MM/DD/YYYY';

  if (props.showTime) {
    showTime = { defaultValue: moment('00:00', 'hh:mm A') };
    dateTimeFormat = 'MM/DD/YYYY hh:mm A';
  }

  return (
    <Div>
      {props.error ? (
        <label htmlFor={props.field} className={'error'}>
          {props.error}
        </label>
      ) : (
        <label htmlFor={props.field} className={'label'}>
          {props.label}
        </label>
      )}
      <div>
        <DatePicker
          ref={ref}
          {...props}
          id={props.field}
          format={dateTimeFormat}
          showTime={showTime}
          disabled={disabled}
        />
      </div>
    </Div>
  );
}

export default forwardRef(HRDateTime);

const Div = styled.div`
  margin-bottom: 16px;

  .label {
    font-weight: bold;
    color: #222f3e;
  }

  .ant-calendar-picker {
    width: 100%;
    min-width: 0px !important;
  }

  .error {
    font-weight: bold;
    color: #d63031;
  }
`;
