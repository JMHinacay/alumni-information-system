import { isInAnyRole } from '@components/accessControl/AccessManager';

export const hasPermission = (allowedPermissions = [], userPermissions = []) => {
  if ((allowedPermissions.length === 0 && userPermissions.length) === 0) return true;

  return isInAnyRole(allowedPermissions, userPermissions);
};
