import {
  employeeRequestDatesTypeFormatter,
  employeeRequestStatusFormatter,
} from './constantFormatters';

export const employeeStatus = [
  { label: 'PERMANENT - FULLTIME', value: 'PERMANENT - FULLTIME' },
  { label: 'CONTRACTUAL - FULLTIME', value: 'CONTRACTUAL - FULLTIME' },
  { label: 'PERMANENT - PARTTIME', value: 'PERMANENT - PARTTIME' },
  { label: 'CONTRACTUAL - PARTTIME', value: 'CONTRACTUAL - PARTTIME' },
  { label: 'ACTIVE ROTATING', value: 'ACTIVE ROTATING' },
  { label: 'OUTSOURCED', value: 'OUTSOURCED' },
];

export const civilStatuses = [
  { label: 'NEW BORN', value: 'NEW BORN' },
  { label: 'CHILD', value: 'CHILD' },
  { label: 'SINGLE', value: 'SINGLE' },
  { label: 'MARRIED', value: 'MARRIED' },
  { label: 'WIDOWED', value: 'WIDOWED' },
  { label: 'ANNULED', value: 'ANNULED' },
  { label: 'SEPARATED', value: 'SEPARATED' },
];

export const DoctorServiceType = [
  'Not Applicable',
  'EENT',
  'Eye Care Center',
  'Gynecology',
  'Medicine',
  'Newborn',
  'Obstetrics',
  'Opthalmology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonary',
  'Surgery (Adult)',
  'Surgery (Pediatrics)',
  'Adult',
  'Antenatal Care',
  'Postnatal Care',
];

export const DoctorServiceClass = [
  'Not Applicable',
  'Pulmonary',
  'Hematology',
  'Allergology',
  'Dermatology',
  'Cardiology',
  'Endocrinology',
  'Oncology',
  'Psychiatry',
  'Rhuematology',
  'Infectious',
  'Nephrology',
  'Toxicology',
  'Neurology',
  'Executive Check-up',
  'Urology',
  'General',
  'Pulmonary',
  'Neurology',
  'Nephrology',
  'Dermatology',
  'Cardiology',
  'Endocrinology',
  'Gastroenterology',
  'General Surgery',
  'Vascular',
  'ENT-Surgery',
  'Orthopedic',
  'Urology',
];

// export const scheduleTypes = [
//   { label: 'Regular (Office Hours)', value: 'Regular (Office Hours)' },
//   { label: 'Regular (Shift Hours)', value: 'Regular (Shift Hours)' },
//   { label: 'Confidential', value: 'Confidential' },
// ];

export const frequency = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Semi-Monthly', value: 'SEMI_MONTHLY' },
];

export const payrollTypes = [
  { label: 'Regular (Office Hours)', value: 'Regular (Office Hours)' },
  { label: 'Regular (Shift Hours)', value: 'Regular (shift Hours)' },
  { label: 'Confidential', value: 'Confidential' },
];

export const payFrequency = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Semi-Monthly', value: 'Semi-Monthly' },
];

export const AddOn = [
  { label: 'Fuel Allowance', value: 'Fuel Allowance' },
  { label: 'Food', value: 'Food' },
  { label: 'Uniform', value: 'Uniform' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Laundry', value: 'Laundry' },
  { label: 'Rice', value: 'Rice' },
  { label: 'Honorarium', value: 'Honorarium' },
  { label: 'Other Compensation', value: 'Other Compensation' },
];
//====================HOLIDAY TRANSFERABILITY====================\\

export const HolidayTransferability = [
  {
    label: 'Fixed',
    value: 'FIXED',
  },
  {
    label: 'Movable',
    value: 'MOVABLE',
  },
];

export const HolidayTransferabilityTypes = {
  MOVABLE: 'MOVABLE',
  FIXED: 'FIXED',
};

//====================HOLIDAY TRANSFERABILITY====================\\

//==========================HOLIDAY TYPE==========================\\

export const HolidayType = [
  {
    label: 'Regular Holiday',
    value: 'REGULAR',
  },
  {
    label: 'Special Non-working Holiday',
    value: 'SPECIAL_NON_WORKING',
  },
  {
    label: 'Non-Holiday',
    value: 'NON_HOLIDAY',
  },
];

export const HolidayTypes = {
  REGULAR: 'REGULAR',
  SPECIAL: 'SPECIAL_NON_WORKING',
  NON_HOLIDAY: 'NON_HOLIDAY',
};

//==========================HOLIDAY TYPE==========================\\

//==========================REST DAY SETTINGS==========================\\

export const REST_DAY_SCHEDULE_LABEL = 'R';
export const REST_DAY_SCHEDULE_TITLE = 'Rest Day';
export const REST_DAY_SCHEDULE_COLOR = '#95a5a6';

//==========================REST DAY SETTINGS==========================\\

//==========================PAYROLL STATUS==========================\\

export const PAYROLL_STATUS_NEW = 'NEW';
export const PAYROLL_STATUS_CALCULATED = 'CALCULATED';
export const PAYROLL_STATUS_CALCULATING = 'CALCULATING';
export const PAYROLL_STATUS_FINALIZED = 'FINALIZED';

//==========================PAYROLL STATUS==========================\\

//==========================EMPLOYEE ATTENDANCE METHODS==========================\\
export const employeeAttendanceMethods = {
  FINGER: 'FINGER',
  MANUAL: 'MANUAL',
};
//==========================EMPLOYEE ATTENDANCE METHODS==========================\\
//==========================EMPLOYEE REQUEST TYPE==========================\\
export const employeeRequestType = {
  LEAVE: 'LEAVE',
  OVERTIME: 'OVERTIME',
};
//==========================EMPLOYEE REQUEST TYPE==========================\\

//==========================EMPLOYEE REQUEST STATUS==========================\\
export const employeeRequestStatus = {
  DRAFT: 'DRAFT',
  PENDING_SUPERVISOR: 'PENDING_SUPERVISOR',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REJECTED_SUPERVISOR: 'REJECTED_SUPERVISOR',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
  REVERTED: 'REVERTED',
};
//==========================EMPLOYEE REQUEST STATUS==========================\\

//==========================EMPLOYEE REQUEST STATUS LIST==========================\\
export const employeeRequestStatusList = [
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.APPROVED),
    value: employeeRequestStatus.APPROVED,
  },
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.CANCELLED),
    value: employeeRequestStatus.CANCELLED,
  },
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.DRAFT),
    value: employeeRequestStatus.DRAFT,
  },
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.PENDING),
    value: employeeRequestStatus.PENDING,
  },
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.PENDING_SUPERVISOR),
    value: employeeRequestStatus.PENDING_SUPERVISOR,
  },
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.REJECTED),
    value: employeeRequestStatus.REJECTED,
  },
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.REJECTED_SUPERVISOR),
    value: employeeRequestStatus.REJECTED_SUPERVISOR,
  },
  {
    label: employeeRequestStatusFormatter(employeeRequestStatus.REVERTED),
    value: employeeRequestStatus.REVERTED,
  },
];
//==========================EMPLOYEE REQUEST STATUS LIST==========================\\

//==========================EMPLOYEE REQUEST DATES TYPE==========================\\
export const employeeRequestDatesType = {
  RANGE: 'RANGE',
  MIXED: 'MIXED',
  SINGLE: 'SINGLE',
};
//==========================EMPLOYEE REQUEST DATES TYPE==========================\\

//==========================EMPLOYEE REQUEST DATES TYPE==========================\\
export const employeeRequestDatesTypeList = [
  {
    label: employeeRequestDatesTypeFormatter(employeeRequestDatesType.RANGE),
    value: employeeRequestDatesType.RANGE,
  },

  {
    label: employeeRequestDatesTypeFormatter(employeeRequestDatesType.MIXED),
    value: employeeRequestDatesType.MIXED,
  },
  {
    label: employeeRequestDatesTypeFormatter(employeeRequestDatesType.SINGLE),
    value: employeeRequestDatesType.SINGLE,
  },
];
//==========================EMPLOYEE REQUEST DATES TYPE==========================\\

//==========================EMPLOYEE REQUEST DATES TYPE==========================\\

export const employeeRequestScheduleType = {
  LEAVE: 'LEAVE',
  LEAVE_HALF: 'LEAVE_HALF',
  TWELVE_HR_LEAVE: 'TWELVE_HR_LEAVE',
  TWELVE_HR_LEAVE_HALF: 'TWELVE_HR_LEAVE_HALF',
  REST: { shortCode: 'REST', name: 'REST', value: '24' },
};
//==========================EMPLOYEE REQUEST DATES TYPE==========================\\

//==========================EMPLOYEE REQUEST APPROVAL STATUS==========================\\
export const employeeRequestApprovalStatus = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
};
//==========================EMPLOYEE REQUEST APPROVAL STATUS==========================\\

//==========================HOUR ALLOCATION AMOUNT ==========================\\
export const hourAllocationAmount = [
  {
    label: 0.0001,
    value: 0.0001,
  },
  {
    label: 0.001,
    value: 0.001,
  },
  {
    label: 0.01,
    value: 0.01,
  },
  {
    label: 0.1,
    value: 0.1,
  },
  {
    label: 0.5,
    value: 0.5,
  },
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 5,
    value: 5,
  },
];
//==========================HOUR ALLOCATION AMOUNT ==========================\\
//==========================TIMEKEEPING STATUS==========================\\
export const timekeepingStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  FINALIZED: 'FINALIZED',
};
//==========================TIMEKEEPING STATUS==========================\\

//==========================EMPLOYEE REQUEST APPROVAL STATUS==========================\\
export const jobTitleStatus = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];
//==========================EMPLOYEE REQUEST APPROVAL STATUS==========================\\

//==========================PROFESSION/POSITION DESIGNATION PARENT==========================\\
export const positionDesignationParents = [
  { value: 10, label: 'Medical - Internal Medicine' },
  { value: 17, label: 'Medical - Post-Graduate Fellows' },
  { value: 22, label: 'Medical - Residents' },
  { value: 35, label: 'Allied Medical' },
  { value: 42, label: 'Non-Medical' },
  { value: 46, label: 'General Support Staff' },
];
//==========================PROFESSION/POSITION DESIGNATION PARENT==========================\\
