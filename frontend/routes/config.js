export const config = ['/', '/register', '/login'];

export const newConfig = {
  '/': {
    isPublic: true,
  },
  '/migrate-employee-id': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/dashboard': {
    isPublic: false,
    roles: ['ROLE_USER', 'ROLE_STAFF'],
  },
  '/account': {
    isPublic: false,
    roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF'],
  },
  //====================================EMPLOYEES===================================\\
  '/employees/list': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/employee-attendance': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/employee-attendance/[id]': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/manage/[id]': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/manage': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/salary': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/work-schedule': {
    isPublic: false,
    roles: ['HR_ACCESS', 'WORK_SCHEDULER'],
  },
  //====================================EMPLOYEES===================================\\
  //====================================BIOMETRICS==================================\\

  //====================================BIOMETRICS==================================\\
  //===================================JOB-OPENING==================================\\

  //===================================JOB-OPENING==================================\\
  //===================================TRANSACTION==================================\\

  //===================================TRANSACTION==================================\\
  //==================================CONFIGURATION=================================\\

  //=====================================PAYROLL====================================\\
  //=====================================ALLOWANCE====================================\\

  //=====================================ALLOWANCE====================================\\
  //=====================================REPORTS====================================\\

  //=====================================REPORTS====================================\\
  //====================================ROLES & PERMISSIONS===================================\\
  // TODO: add roles for roles & permission pages

  //====================================ROLES & PERMISSIONS===================================\\
  //====================================MY CORNER===================================\\

  //====================================MY CORNER===================================\\
};
