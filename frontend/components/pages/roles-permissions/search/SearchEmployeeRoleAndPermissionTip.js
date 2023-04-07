import { Alert } from 'antd';
import React from 'react';

function SearchEmployeeRoleAndPermissionTip({
  filter,
  department,
  permissions = [],
  roles = [],
  permissionOperation,
  rolesOperation,
  ...props
}) {
  let message = [];

  if (filter) {
    message = message.concat(
      <span key="name">
        Name that contains <strong>{filter} </strong>
      </span>,
    );
  }
  if (department) {
    let connecting = '';
    if (message.length > 0) connecting = ' AND';
    message = message.concat(
      <span key="department">
        {connecting} in
        <strong> {department}</strong> Department
      </span>,
    );
  }
  if (permissions.length > 0) {
    let connecting = '';
    if (message.length > 0) connecting = ' AND';
    message = message.concat(
      <span key="napermissionsme">
        {connecting} having <strong>{permissions.join(` ${permissionOperation} `)}</strong>{' '}
        Permission(s)
      </span>,
    );
  }
  if (roles.length > 0) {
    let connecting = '';
    if (message.length > 0) connecting = ' AND';
    message = message.concat(
      <span key="permissions">
        {connecting} having <strong>{roles.join(` ${rolesOperation} `)} </strong>
        Role(s)
      </span>,
    );
  }

  if (filter || department || permissions?.length > 0 || roles?.length > 0) {
    return (
      <Alert
        message={
          <>
            <strong>Searching For: </strong>Employee {message} .
          </>
        }
        type="info"
      />
    );
  } else return null;
}

export default SearchEmployeeRoleAndPermissionTip;
