export const patientStatusFormatter = (value = null) => {
  switch (value) {
    case 'CONFIRM_ARRIVAL':
      return 'Arrival Confirmed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'NO_SHOW':
      return 'No Show';
    case 'OPEN':
      return 'Open';
    case 'CLOSE':
      return 'Close';
    case 'VOID':
      return 'Void';
    default:
      return null;
  }
};

export const paymentTypeFormatter = (value = null) => {
  switch (value) {
    case 'ACKNOWLEDGEMENT_RECEIPT':
      return 'Acknowledgement Receipt';
    case 'OFFICIAL_RECEIPT':
      return 'Official Receipt';
    default:
      return null;
  }
};

export const roleFormatter = (value = null) => {
  switch (value) {
    case 'ROLE_ADMIN':
      return 'Admin';
    case 'ROLE_DOCTOR':
      return 'Doctor';
    case 'ROLE_OWNER':
      return 'Owner';
    case 'ROLE_STAFF':
      return 'Staff';
    case 'ROLE_USER':
      return 'User';
    default:
      return null;
  }
};

export const payrollProcessingStatusColor = (value = null) => {
  switch (value) {
    case 'NEW':
      return 'blue';
    case 'CALCULATING':
      return 'lime';
    case 'CALCULATED':
      return 'orange';
    case 'INVALID':
      return 'red';
    case 'FINALIZED':
      return 'green';
    default:
      return null;
  }
};

export const payrollLogFlagStatusColor = (value = null) => {
  switch (value) {
    case 'UNRESOLVED':
      return 'red';
    case 'RESOLVED':
      return 'green';
    default:
      return null;
  }
};

export const employeePayFrequency = (value = null) => {
  switch (value) {
    case 'MONTHLY':
      return 'Monthly';
    case 'SEMI_MONTHLY':
      return 'Semi-Monthly';
    default:
      return null;
  }
};

export const employeeRequestStatusFormatter = (value = null) => {
  switch (value) {
    case 'DRAFT':
      return 'Draft';
    case 'PENDING_SUPERVISOR':
      return 'Pending Supervisor';
    case 'PENDING':
      return 'Pending';
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'REJECTED_SUPERVISOR':
      return 'Rejected Supervisor';
    case 'CANCELLED':
      return 'Cancelled';
    case 'REVERTED':
      return 'Reverted';
    default:
      return null;
  }
};

export const employeeRequestStatusColorGenerator = (value = null) => {
  switch (value) {
    case 'DRAFT':
      return 'blue';
    case 'PENDING_SUPERVISOR':
      return 'green';
    case 'PENDING':
      return 'green';
    case 'APPROVED':
      return 'green';
    case 'REJECTED':
      return 'red';
    case 'REJECTED_SUPERVISOR':
      return 'red';
    case 'CANCELLED':
      return 'orange';
    case 'REVERTED':
      return 'red';
    default:
      return null;
  }
};

export const employeeRequestDatesTypeFormatter = (value = null) => {
  switch (value) {
    case 'RANGE':
      return 'Date range';
    case 'MIXED':
      return 'Mixed Dates';
    case 'SINGLE':
      return 'Single Date';
    default:
      return null;
  }
};
export const employeeRequestScheduleTypeFormatter = (value = null) => {
  switch (value) {
    case 'LEAVE':
      return 'Leave Schedule';
    case 'LEAVE_HALF':
      return 'Half Day Leave Schedule';
    case 'TWELVE_HR_LEAVE':
      return 'Twelve Hour Leave Schedule';
    case 'TWELVE_HR_LEAVE_HALF':
      return 'Six Hour Leave Schedule';
    case 'REST':
      return 'Rest Schedule';
    default:
      return null;
  }
};
export const employeeRequestApprovalStatusFormatter = (value = null) => {
  switch (value) {
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'PENDING':
      return 'Pending';
    default:
      return null;
  }
};

export const employeeRequestApprovalStatusColorGenerator = (value = null) => {
  switch (value) {
    case 'APPROVED':
      return 'green';
    case 'REJECTED':
      return 'red';
    case 'PENDING':
      return 'yellow';
    default:
      return null;
  }
};

export const timekeepingStatusFormatter = (value = null) => {
  switch (value) {
    case 'DRAFT':
      return 'Draft';
    case 'ACTIVE':
      return 'Active';
    case 'CANCELLED':
      return 'Cancelled';
    case 'FINALIZED':
      return 'Finalized';
    default:
      return null;
  }
};

export const timekeepingStatusColorGenerator = (value = null) => {
  switch (value) {
    case 'DRAFT':
      return 'orange';
    case 'ACTIVE':
      return 'blue';
    case 'CANCELLED':
      return 'red';
    case 'FINALIZED':
      return 'green';
    default:
      return null;
  }
};

export const payrollStatusColorGenerator = (value = null) => {
  switch (value) {
    case 'DRAFT':
      return 'orange';
    case 'ACTIVE':
      return 'blue';
    case 'CANCELLED':
      return 'red';
    case 'FINALIZED':
      return 'green';
    default:
      return null;
  }
};

export const jobTitleStatusColorGenerator = (value = null) => {
  switch (value) {
    case 'ACTIVE':
      return 'green';
    case 'INACTIVE':
      return 'red';
    default:
      return null;
  }
};

export const positionDesignationTextFormatter = (value = null) => {
  switch (value) {
    case 10:
      return 'Medical - Internal Medicine';
    case 17:
      return 'Medical - Post-Graduate Fellows';
    case 22:
      return 'Medical - Residents';
    case 35:
      return 'Allied Medical';
    case 42:
      return 'Non-Medical';
    case 46:
      return 'General Support Staff';
    default:
      return null;
  }
};
