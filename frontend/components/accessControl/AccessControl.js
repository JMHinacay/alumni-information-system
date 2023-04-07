import React, { useContext } from 'react';
import { isInAnyRole } from './AccessManager';
import { AccountContext } from './AccountContext';

const AccessControl = ({ allowedPermissions = [], renderNoAccess = null, children, ...props }) => {
  const accountContext = useContext(AccountContext);

  if (allowedPermissions.length === 0) return children;
  const isAllowed = isInAnyRole(accountContext?.data?.user?.access, allowedPermissions);
  if (!isAllowed) return renderNoAccess;
  else return children;
};

export default AccessControl;
