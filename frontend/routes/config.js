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
  '/biometrics/employee-config': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/biometrics/attendance-logs': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  //====================================BIOMETRICS==================================\\
  //===================================JOB-OPENING==================================\\
  '/job-openings': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  //===================================JOB-OPENING==================================\\
  //===================================TRANSACTION==================================\\
  '/transactions/loans': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },

  '/transactions/leave': {
    isPublic: false,
    roles: ['HR_ACCESS', 'LEAVE_REQUEST_MANAGER'],
  },
  '/transactions/leave/[id]': {
    isPublic: false,
    roles: ['HR_ACCESS', 'LEAVE_REQUEST_MANAGER'],
  },
  '/transactions/leave/create': {
    isPublic: false,
    roles: ['HR_ACCESS', 'LEAVE_REQUEST_MANAGER'],
  },
  '/transactions/overtime': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  //===================================TRANSACTION==================================\\
  //==================================CONFIGURATION=================================\\
  '/configuration/allowance': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/biometric': {
    isPublic: false,
    roles: ['BIOMETRIC_MANAGEMENT'],
  },
  '/configuration/contribution/pagibig': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/contribution/philhealth': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/contribution/sss': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/department-schedule': {
    isPublic: false,
    roles: ['HR_ACCESS', 'WORK_SCHEDULER'],
  },
  '/configuration/event': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/configuration/job': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },

  '/configuration': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/configuration/salary-calculation': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/configuration/schedule-lock': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'SCHEDULE_LOCK'],
  },
  //==================================CONFIGURATION=================================\\
  //=====================================PAYROLL====================================\\

  '/payroll/payroll': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/payroll/create': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/payroll/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/payroll/[id]/edit': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/payroll/[id]/manage-employee': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/generate': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/processing': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/view/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/timekeeping': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/timekeeping/create': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/timekeeping/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },

  '/payroll/timekeeping/[id]/manage-employee': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/timekeeping/[id]/edit': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  //=====================================PAYROLL====================================\\
  //=====================================ALLOWANCE====================================\\
  '/allowance/employee-allowance': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'EMPLOYEE_ALLOWANCE_ROLE'],
  },
  '/allowance/employee-allowance/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'EMPLOYEE_ALLOWANCE_ROLE'],
  },
  '/allowance/employee-allowance/assign': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'EMPLOYEE_ALLOWANCE_ROLE'],
  },
  '/allowance/employee-allowance/assign/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'EMPLOYEE_ALLOWANCE_ROLE'],
  },
  '/allowance/allowance-template': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'ALLOWANCE_TEMPLATE_ROLE'],
  },
  '/allowance/allowance-template/create': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'ALLOWANCE_TEMPLATE_ROLE'],
  },
  '/allowance/allowance-template/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'ALLOWANCE_TEMPLATE_ROLE'],
  },
  '/allowance/allowance-template/[id]/edit': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'ALLOWANCE_TEMPLATE_ROLE'],
  },
  '/allowance/allowances': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'ALLOWANCE_ROLE'],
  },
  //=====================================ALLOWANCE====================================\\
  //=====================================REPORTS====================================\\
  '/reports': {
    isPublic: false,
    roles: ['ROLE_ADMIN'],
  },
  //=====================================REPORTS====================================\\
  //====================================ROLES & PERMISSIONS===================================\\
  // TODO: add roles for roles & permission pages
  '/roles-permissions': {
    isPublic: false,
    roles: ['ROLE_USER_ACCESS_MANAGER', 'ROLE_ADMIN'],
  },
  '/roles-permissions/[id]': {
    isPublic: false,
    roles: ['ROLE_USER_ACCESS_MANAGER', 'ROLE_ADMIN'],
  },
  '/roles-permissions/[id]/assign': {
    isPublic: false,
    roles: ['ROLE_USER_ACCESS_MANAGER', 'ROLE_ADMIN'],
  },
  '/roles-permissions/search': {
    isPublic: false,
    roles: ['ROLE_USER_ACCESS_MANAGER', 'ROLE_ADMIN'],
  },
  //====================================ROLES & PERMISSIONS===================================\\
  //====================================MY CORNER===================================\\
  '/mine/my-leave': {
    isPublic: false,
    roles: ['ROLE_USER'],
  },
  '/mine/my-leave/create': {
    isPublic: false,
    roles: ['ROLE_USER'],
  },
  '/mine/my-leave/[id]': {
    isPublic: false,
    roles: ['ROLE_USER'],
  },
  '/mine/approvals': {
    isPublic: false,
    roles: ['HR_ACCESS', 'LEAVE_REQUEST_APPROVER'],
  },
  '/mine/approvals/[id]': {
    isPublic: false,
    roles: ['HR_ACCESS', 'LEAVE_REQUEST_APPROVER'],
  },
  //====================================MY CORNER===================================\\
};
