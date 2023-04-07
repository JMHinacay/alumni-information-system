import { AccountContext } from './AccountContext';
import React, { useContext, useEffect } from 'react';
import _ from 'lodash';
import Forbidden from '../../pages/forbidden';
// import ResetPassword from '../../pages/resetPassword';
import { newConfig } from 'routes/config';
import { useRouter } from 'next/router';
import MainLayout from '../mainlayout';

export function isInRole(role, rolesRepo) {
  return _.includes(rolesRepo || [], role);
}

export function isInAnyRole(roles, rolesRepo) {
  roles = _.isArray(roles) ? roles : [];
  var found = false;
  roles.forEach(function (i) {
    if (isInRole(i, rolesRepo)) {
      found = true;
    }
  });

  return found;
}

const AccessManager = (props) => {
  const accountContext = useContext(AccountContext);
  const router = useRouter();

  //allowedRoles
  const allowedRoles = newConfig[router.pathname]?.roles;
  // you need to specify the allowed roles of thte path in the route config
  // in the routes/config.js file
  if (!allowedRoles) throw new Error('No allowed roles specified.');
  const roles = allowedRoles || ['ROLE_USER'];

  const account = accountContext;

  const currentRoles = account?.data?.user?.roles;
  const selectedClinic = account?.data?.selectedClinic;

  // the usual role checking
  if (Array.isArray(roles)) {
    if (isInAnyRole(roles, currentRoles)) {
      return props.children;
    }
  } else if (typeof roles === 'string') {
    if (isInRole(roles, currentRoles)) {
      return props.children;
    }
  }

  // or else the user is forbidden to access the page
  return (
    <MainLayout>
      <Forbidden />
    </MainLayout>
  );
};

export default AccessManager;
