import { isInAnyRole } from '@components/accessControl/AccessManager';
import { AccountContext } from '@components/accessControl/AccountContext';
import { useContext } from 'react';

const useHasPermission = (allowedPermissions) => {
  const accountContext = useContext(AccountContext) || {};
  const { access } = accountContext?.data?.user || {};

  if (allowedPermissions.length === 0) throw new Error('Must provide array of allowed permission.');
  return isInAnyRole(access, allowedPermissions);
};

export default useHasPermission;
