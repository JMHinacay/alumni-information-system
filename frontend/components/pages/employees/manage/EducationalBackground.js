import { HRDatePicker, HRForm, HRInput, HRSelect } from '@components/commons';
import { Modal } from 'antd';
import moment from 'moment';
import React from 'react';
import { useForm } from 'react-hook-form';

const highestEducationList = [
  { value: 'High School Level', key: 'High School Level' },
  { value: 'High School Graduate', key: 'High School Graduate' },
  { value: 'College Level', key: 'College Level' },
  { value: 'College Graduate', key: 'College Graduate' },
  { value: 'Vocational', key: 'Vocational' },
  { value: 'Post Graduate', key: 'Post Graduate' },
];

export default function EducationalBackground(props) {
  const { hide, data, rows } = props;
  const methods = useForm({
    defaultValues: {
      highestEducation: data?.highestEducation || '',
      degreeCourse: data?.degreeCourse || '',
      school: data?.school || '',
      yearGraduated: data?.yearGraduated ? moment().year(parseInt(data?.yearGraduated)) : '' || '',
    },
  });

  const { getValues } = methods;

  const handleSubmit = () => {
    const values = getValues();
    if (!data) {
      values.key = rows + 1;
      hide(values);
    } else {
      hide({ ...data, ...values });
    }
  };
  return (
    <Modal visible={true} title="Add Education" onCancel={() => hide(null)} onOk={handleSubmit}>
      <HRForm methods={methods}>
        <HRSelect
          label="Highest Educational Attainment"
          name="highestEducation"
          options={highestEducationList}
          rules={{ required: true }}
        />
        <HRInput label="Degree/Course" name="degreeCourse" />
        <HRInput label="Name Of School" name="school" />
        <HRDatePicker label="Year Graduated" name="yearGraduated" picker="year" />
      </HRForm>
    </Modal>
  );
}
