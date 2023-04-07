import { HRButton, HRForm, HRInput, HRModal } from '@components/commons';
import { apiUrlPrefix } from '@shared/settings';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { AccountContext } from '@components/accessControl/AccountContext';

export default function PrintScheduleModal({ state, ...props }) {
  const userContext = useContext(AccountContext);
  const methods = useForm({
    defaultValues: { title: '', subtitle: '' },
  });

  const handleSubmit = ({ title, subtitle }) => {
    let startDate = moment(state.startDate).utc().format();
    let endDate = moment(state.endDate).utc().format();
    const contextDepartment = userContext?.data?.department?.id;
    let department = props?.withPermission ? state.department : contextDepartment;
    window.open(
      `${apiUrlPrefix}/api/hrm/printschedule?startDate=${startDate}&endDate=${endDate}&department=${department}&title=${title}&subtitle=${subtitle}`,
    );
    props?.handleModal();
  };

  return (
    <HRModal title="Print Schedule" visible={props?.visible} footer={null}>
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <HRInput name="title" label="Title" />
        <HRInput name="subtitle" label="Sub-Title" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <HRButton style={{ marginRight: 10 }} onClick={props?.handleModal}>
            Cancel
          </HRButton>
          <HRButton htmlType="submit" type="primary">
            Submit
          </HRButton>
        </div>
      </HRForm>
    </HRModal>
  );
}
