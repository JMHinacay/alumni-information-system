export const config = ['/', '/register', '/login'];

export const newConfig = {
  '/': {
    isPublic: true,
  },
  '/migrate-employee-id': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/dashboard': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/account': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  //====================================EMPLOYEES===================================\\
  '/employees/list': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/employees/employee-attendance': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/employees/employee-attendance/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/employees/manage/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/employees/manage': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/employees/salary': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/employees/work-schedule': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  //====================================EMPLOYEES===================================\\

  '/forum': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/alumni': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/events': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/chats': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/donations': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/job-hirings': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  '/reports': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
};
