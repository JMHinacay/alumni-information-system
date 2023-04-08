import {
  StarOutlined,
  SolutionOutlined,
  IdcardOutlined,
  LineChartOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { FiUsers } from 'react-icons/fi';

import { isInAnyRole } from 'components/accessControl/AccessManager';

export const pages = [
  {
    icon: <LineChartOutlined />,
    title: 'Dashboard',
    url: '/dashboard',
    roles: '*',
  },
  {
    icon: <MessageOutlined />,
    title: 'Chats',
    url: '/chats',
    roles: '*',
  },
  {
    icon: <ProfileOutlined />,
    title: 'Forum',
    url: '/forum',
    roles: '*',
  },
  {
    icon: <StarOutlined />,
    title: 'Events',
    url: '/events',
    roles: '*',
  },
  {
    icon: <UserOutlined />,
    title: 'Employees',
    url: '/employees/list',
    roles: ['ROLE_ADMIN'],
  },
  {
    icon: <SolutionOutlined />,
    title: 'Alumni',
    url: '/alumni',
    roles: '*',
  },

  {
    icon: <MoneyCollectOutlined />,
    title: 'Donations',
    url: '/donations',
    roles: '*',
  },
  {
    icon: <IdcardOutlined />,
    title: 'Job Hirings',
    url: '/job-hirings',
    roles: '*',
  },
  ,
  {
    icon: <LineChartOutlined />,
    title: 'Reports',
    url: '/reports',
    roles: '*',
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
