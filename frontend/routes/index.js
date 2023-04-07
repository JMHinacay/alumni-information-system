import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { FaFingerprint } from 'react-icons/fa';
import { MdFingerprint, MdOutlineSecurity } from 'react-icons/md';
import {
  SolutionOutlined,
  AccountBookOutlined,
  WalletOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  UserOutlined,
  ProfileOutlined,
  SettingOutlined,
  ContactsOutlined,
  MoneyCollectOutlined,
  FileSyncOutlined,
  RedEnvelopeOutlined,
  TransactionOutlined,
  PercentageOutlined,
  LineChartOutlined,
  LockOutlined,
  UserSwitchOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';

import { isInAnyRole } from 'components/accessControl/AccessManager';

export const pages = [
  {
    icon: <LineChartOutlined />,
    title: 'Dashboard',
    url: '/dashboard',
    roles: '*',
  },
  {
    icon: <FiUsers style={{ marginRight: 10 }} className="anticon" />,
    title: 'Employees',
    url: '/employees',
    roles: ['HR_ACCESS', 'WORK_SCHEDULER'],
    children: [
      {
        icon: <UserOutlined />,
        title: 'List',
        url: '/list',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FieldTimeOutlined />,
        title: 'Attendance',
        url: '/employee-attendance',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <CalendarOutlined />,
        title: 'Work Schedule',
        url: '/work-schedule',
        roles: ['HR_ACCESS', 'WORK_SCHEDULER'],
      },
    ],
  },
  {
    icon: <TransactionOutlined />,
    title: 'Employee Requests',
    url: '/transactions',
    roles: ['HR_ACCESS', 'LEAVE_REQUEST_APPROVER', 'LEAVE_REQUEST_MANAGER'],
    children: [
      {
        icon: <ContactsOutlined />,
        title: 'Leave',
        url: '/leave',
        roles: ['HR_ACCESS', 'LEAVE_REQUEST_MANAGER'],
      },
    ],
  },
  {
    icon: <MdFingerprint className="anticon" />,
    title: 'Biometrics',
    url: '/biometrics',
    roles: ['HR_ACCESS'],
    children: [
      {
        icon: <ProfileOutlined />,
        title: 'Attendance Logs',
        url: '/attendance-logs',
        roles: ['HR_ACCESS'],
      },
    ],
  },

  {
    icon: <RedEnvelopeOutlined />,
    title: 'Payroll',
    url: '/payroll',
    roles: ['HR_ACCESS'],
    children: [
      {
        icon: <FileSyncOutlined />,
        title: 'Timekeeping',
        url: '/timekeeping',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FileSyncOutlined />,
        title: 'Payroll',
        url: '/payroll',
        roles: ['HR_ACCESS'],
      },
    ],
  },
  {
    icon: <MoneyCollectOutlined />,
    title: 'Allowance',
    url: '/allowance',
    roles: ['ALLOWANCE_ROLE', 'ALLOWANCE_TEMPLATE_ROLE', 'EMPLOYEE_ALLOWANCE_ROLE'],
    children: [
      {
        icon: <SolutionOutlined />,
        title: 'Employee Allowance',
        url: '/employee-allowance',
        roles: ['EMPLOYEE_ALLOWANCE_ROLE'],
      },
      {
        icon: <AccountBookOutlined />,
        title: 'Allowance Template',
        url: '/allowance-template',
        roles: ['ALLOWANCE_TEMPLATE_ROLE'],
      },
      {
        icon: <WalletOutlined />,
        title: 'Allowances',
        url: '/allowances',
        roles: ['ALLOWANCE_ROLE'],
      },
    ],
  },
  {
    icon: <SettingOutlined />,
    title: 'Configuration',
    url: '/configuration',
    roles: ['HR_ACCESS', 'BIOMETRIC_MANAGEMENT', 'SCHEDULE_LOCK', 'WORK_SCHEDULER'],
    children: [
      {
        icon: <CalendarOutlined />,
        title: 'Holiday/Events Calendar',
        url: '/event',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <PercentageOutlined />,
        title: 'Salary Calculation Rates',
        url: '/salary-calculation',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <ContactsOutlined />,
        title: 'Department Schedule',
        url: '/department-schedule',
        roles: ['HR_ACCESS', 'WORK_SCHEDULER'],
      },
      {
        icon: <FaFingerprint />,
        title: 'Biometric',
        url: '/biometric',
        roles: ['BIOMETRIC_MANAGEMENT'],
      },
      {
        icon: <LockOutlined />,
        title: 'Schedule Lock Control',
        url: '/schedule-lock',
        roles: ['SCHEDULE_LOCK'],
      },
      {
        icon: <SettingOutlined />,
        title: 'Configuration',
        url: '/',
        roles: ['HR_ACCESS'],
      },
    ],
  },
  {
    icon: <MdOutlineSecurity className="anticon" />,
    title: 'Roles & Permissions',
    url: '/roles-permissions',
    roles: ['ROLE_USER_ACCESS_MANAGER', 'ROLE_ADMIN'],
    children: [
      {
        icon: <UserSwitchOutlined />,
        title: 'Employees',
        url: '/',
        roles: ['ROLE_USER_ACCESS_MANAGER', 'ROLE_ADMIN'],
      },
      {
        icon: <SecurityScanOutlined />,
        title: 'Search',
        url: '/search',
        roles: ['ROLE_USER_ACCESS_MANAGER', 'ROLE_ADMIN'],
      },
    ],
  },
  {
    icon: <ContactsOutlined />,
    title: 'My Corner',
    url: '/mine',
    roles: ['ROLE_USER'],
    children: [
      {
        icon: <ContactsOutlined />,
        title: 'My Approvals',
        url: '/approvals',
        roles: ['LEAVE_REQUEST_APPROVER'],
      },
      {
        icon: <ContactsOutlined />,
        title: 'Leave Requests',
        url: '/my-leave',
        roles: ['ROLE_USER'],
      },
    ],
  },
  // {
  //   icon: <FontAwesomeIcon icon={faUserCog} />,
  //   title: 'Account',
  //   url: '/account',
  //   roles: '*',
  // },

  // Format for nested menus
  // {
  //   icon: <AppstoreOutlined />,
  //   title: 'Sample Nested',
  //   url: '/sample',
  //   children: [
  //     {
  //       icon: <AppstoreOutlined />,
  //       title: 'Sample Nested 1',
  //       url: '/sample1',
  //       children: [
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 1-1',
  //           url: '/sample1-1',
  //         },
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 1-2',
  //           url: '/sample1-2',
  //           asUrl: '/patients',
  //           children: [
  //             {
  //               icon: <AppstoreOutlined />,
  //               title: 'Sample Nested 1-2-1',
  //               url: '/sample1-2-1',
  //               asUrl: '/patients',
  //             },
  //             {
  //               icon: <AppstoreOutlined />,
  //               title: 'Sample Nested 1-2-2',
  //               url: '/sample1-2-2',
  //               asUrl: '/patients',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       icon: <AppstoreOutlined />,
  //       title: 'Sample Nested 2',
  //       url: '/sample2',
  //       asUrl: '/patients',
  //       children: [
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 2-1',
  //           url: '/sample2-1',
  //           asUrl: '/patients',
  //         },
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 2-2',
  //           url: '/sample2-2',
  //           asUrl: '/patients',
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export const filterRoute = (rolesRepo) => {
  return (accumulator, value) => {
    let { roles, children } = value;
    if (children?.length > 0) {
      value.children = children.reduce(filterRoute(rolesRepo), []);
    }
    if (roles === '*') return accumulator.concat(value);

    if (isInAnyRole(roles, rolesRepo)) return accumulator.concat(value);
    else return accumulator;
  };
};

export const getPages = (roleRepo) => {
  const allowedPages = pages.reduce(filterRoute(roleRepo), []);
  return allowedPages;
};
