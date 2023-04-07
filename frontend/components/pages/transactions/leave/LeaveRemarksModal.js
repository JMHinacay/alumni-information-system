import { gql, useMutation } from '@apollo/client';
import { HRButton, HRForm, HRModal, HRTextarea } from '@components/commons';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { message, Modal } from 'antd';
import { AccountContext } from '@components/accessControl/AccountContext';
import { employeeRequestApprovalStatus, employeeRequestStatus } from '@utils/constants';

const UPSERT_EMPLOYEE_REQUEST = gql`
  mutation(
    $requestedBy: UUID
    $approvedBy: UUID
    $id: UUID
    $department: UUID
    $fields: Map_String_ObjectScalar
    $hrApprovedBy: UUID
  ) {
    data: upsertEmployeeRequest(
      requestedBy: $requestedBy
      approvedBy: $approvedBy
      id: $id
      fields: $fields
      department: $department
      hrApprovedBy: $hrApprovedBy
    ) {
      success
      message
      id: returnId
    }
  }
`;

const HR_APPROVE_REJECT_EMPLOYEE_REQUEST = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar, $hrApprovedBy: UUID) {
    data: hrApprovalOrRejectEmployeeRequest(id: $id, fields: $fields, hrApprovedBy: $hrApprovedBy) {
      success
      message
    }
  }
`;

const REVERT_EMPLOYEE_REQUEST = gql`
  mutation($id: UUID, $remarks: String) {
    data: revertEmployeeRequest(id: $id, remarks: $remarks) {
      success
      message
    }
  }
`;

const UPSERT_EMPLOYEE_REQUEST_APPROVAL = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar, $request: UUID) {
    data: upsertEmployeeRequestApproval(id: $id, fields: $fields, request: $request) {
      success
      message
    }
  }
`;

export default function LeaveRemarksModal(props) {
  const user = useContext(AccountContext);
  const methods = useForm({
    defaultValue: {
      reason: null,
    },
  });

  const [hrApproveRejectEmployeeRequest] = useMutation(HR_APPROVE_REJECT_EMPLOYEE_REQUEST, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved employee request.');

        props.handleModal(
          {
            visible: false,
            value: null,
            type: null,
          },
          true,
        );
      } else message.error(data?.message ?? 'Failed to save employee request.');
    },
  });

  const [upsertEmployeeRequestApproval] = useMutation(UPSERT_EMPLOYEE_REQUEST_APPROVAL, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved employee approval request.', 5);
        props.handleModal(
          {
            visible: false,
            value: null,
            type: null,
          },
          true,
        );
      } else message.error(data?.message ?? 'Failed to save employee approval request.');
    },
  });

  const [upsertEmployeeRequest] = useMutation(UPSERT_EMPLOYEE_REQUEST, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully saved employee request.');
        props.handleModal(
          {
            visible: false,
            value: null,
            type: null,
          },
          true,
        );
      } else message.error(data?.message ?? 'Failed to save employee request.');
    },
  });

  const [revertEmployeeRequest] = useMutation(REVERT_EMPLOYEE_REQUEST, {
    onCompleted: (data) => {
      data = data?.data || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully reverted employee request.');

        props.handleModal(
          {
            visible: false,
            value: null,
            type: null,
          },
          true,
        );
      } else message.error(data?.message ?? 'Failed to revert employee request.');
    },
  });

  const handleSubmit = ({ remarks }) => {
    let { type, request } = props;
    if (type === 'REJECT_HR') onHrReject(request, remarks);
    else if (type === 'REJECT_SUPERVISOR') onRejectSupervisor(request, remarks);
    else if (type === 'APPROVE_HR') onHrApprove(request, remarks);
    else if (type === 'REVERT') onRevertEmployeeRequest(request, remarks);
    else if (type === 'APPROVE_APPROVAL') onApproveEmployeeRequestApproval(request, remarks);
    else if (type === 'APPROVE_REJECT') onRejectEmployeeRequestApproval(request, remarks);
  };

  const onHrApprove = (request, remarks) => {
    let { id } = request;
    Modal.confirm({
      title: 'Approve Request?',
      content: 'Are you sure you want to approve request?',
      onOk: () =>
        hrApproveRejectEmployeeRequest({
          variables: {
            id,
            hrApprovedBy: user.data.id,
            fields: {
              status: employeeRequestStatus.APPROVED,
              remarks,
            },
          },
        }),
    });
  };

  const onHrReject = (request, remarks) => {
    let { id } = request;
    Modal.confirm({
      title: 'Reject Request?',
      content: 'Are you sure you want to reject request?',
      onOk: () =>
        hrApproveRejectEmployeeRequest({
          variables: {
            id,
            hrApprovedBy: user.data.id,
            fields: {
              status: employeeRequestStatus.REJECTED,
              remarks,
            },
          },
        }),
    });
  };

  const onRejectSupervisor = (request, remarks) => {
    let { id, requestedBy, department } = request;
    Modal.confirm({
      title: 'Reject Request?',
      content: 'Are you sure you want to reject request?',
      onOk: () =>
        upsertEmployeeRequest({
          variables: {
            id,
            requestedBy,
            department,
            remarks: 'This is a remarks from supervisor reject',
            approvedBy: user.data.id,
            fields: {
              status: employeeRequestStatus.REJECTED_SUPERVISOR,
              remarks,
            },
          },
        }),
    });
  };

  const onRevertEmployeeRequest = (request, remarks) => {
    let { id } = request;
    Modal.confirm({
      title: 'Cancel Request?',
      content: 'Are you sure you want to revert request?',
      onOk: () =>
        revertEmployeeRequest({
          variables: {
            id,
            remarks,
          },
        }),
    });
  };

  const onApproveEmployeeRequestApproval = ({ id, request }, remarks) => {
    Modal.confirm({
      title: 'Cancel Request?',
      content: 'Are you sure you want to approve request? This action is irreversable',
      onOk: () =>
        upsertEmployeeRequestApproval({
          variables: {
            id,
            fields: {
              remarks,
              status: employeeRequestApprovalStatus.APPROVED,
            },
            request,
          },
        }),
    });
  };
  const onRejectEmployeeRequestApproval = ({ id, request }, remarks) => {
    Modal.confirm({
      title: 'Cancel Request?',
      content: 'Are you sure you want to reject request? This action is irreversable',
      onOk: () =>
        upsertEmployeeRequestApproval({
          variables: {
            id,
            fields: {
              remarks,
              status: employeeRequestApprovalStatus.REJECTED,
            },
            request,
          },
        }),
    });
  };

  const onCancel = (params) => {
    props.handleModal(
      {
        visible: false,
        value: null,
        type: null,
      },
      false,
    );
  };

  return (
    <HRModal
      title="Remarks"
      visible={props.visible}
      footer={null}
      style={{ top: 50 }}
      centered={false}
      width="45%"
      onCancel={onCancel}
    >
      <HRForm methods={methods} onSubmit={handleSubmit}>
        <HRTextarea
          autoSize={{ minRows: 4, maxRows: 6 }}
          name="remarks"
          label="Remarks"
          placeholder="Enter remarks"
          rules={{ required: true }}
        />
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
          <HRButton style={{ marginRight: 10 }} onClick={onCancel}>
            Cancel
          </HRButton>
          <HRButton type="primary" htmlType="submit">
            Submit
          </HRButton>
        </div>
      </HRForm>
    </HRModal>
  );
}
