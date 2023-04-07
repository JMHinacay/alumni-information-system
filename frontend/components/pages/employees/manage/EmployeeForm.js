import { CheckOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { gql, useMutation, useQuery } from '@apollo/react-hooks';
import { Col, message, Row, Select, Skeleton, List, Button, Space } from 'antd';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import {
  civilStatuses,
  DoctorServiceClass,
  DoctorServiceType,
  employeeStatus,
  frequency,
  payrollTypes,
} from '@utils/constants';
import {
  HRButton,
  HRCheckbox,
  HRDatePicker,
  HRDivider,
  HRForm,
  HRInput,
  HRInputNumber,
  HRInputNumberNiAyingzkie,
  HRPageHeader,
  HRSelect,
  HRSignaturerField,
} from '@components/commons';
import useDialog from '@hooks/useDialog';
import EducationalBackground from './EducationalBackground';
import moment from 'moment/moment';
import { MdDeleteOutline } from 'react-icons/md';
import { useCallback, useState } from 'react';

const { Option, OptGroup } = Select;

const SAVE_USER = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $departmentId: UUID
    $departmentOfDutyId: UUID
  ) {
    upsertEmployee(
      id: $id
      fields: $fields
      departmentId: $departmentId
      departmentOfDutyId: $departmentOfDutyId
    ) {
      message
      success
      payload {
        id
      }
    }
  }
`;

const GET_USER = gql`
  query ($id: UUID) {
    employee(id: $id) {
      employeeId
      lastName
      firstName
      middleName
      nameSuffix
      gender
      dob
      address
      country
      stateProvince
      cityMunicipality
      barangay
      gender
      emergencyContactName
      emergencyContactAddress
      emergencyContactRelationship
      emergencyContactNo
      zipCode
      address2
      employeeTelNo
      employeeCelNo
      employeeType
      philhealthNo
      sssNo
      tinNo
      bloodType
      basicSalary
      payFreq
      scheduleType
      positionType
      careProvider
      prcLicenseType
      prcExpiryDate
      prcLicenseNo
      ptrNo
      s2No
      vatable
      pmmcNo
      pfVatRate
      expandedVatRate
      phicGroup
      phicNo
      phicExpiryDate
      serviceType
      specialization
      serviceClass
      bankAccountName
      bankAccountNo
      pagIbigId
      emailAddress
      nationality
      witholdTaxRate
      civilStatus
      signature1
      signature2
      signature3
      excludePayroll
      titleInitials
      excludePayroll
      isSpecialtyBoardCertified
      birthplace
      educationalBackgroundList {
        educationalBackgrounds {
          degreeCourse
          highestEducation
          school
          yearGraduated
        }
      }
      user {
        login
        password
        access
        roles
      }
      department {
        id
        departmentName
      }
      departmentOfDuty {
        id
        departmentName
      }
    }
    departments {
      id
      departmentName
    }
    phicGroup: getPHICGroup {
      id
      phicGroupName
      description
    }
    positions: getDOHPositions {
      id
      postdesc
      poscode
      postype
    }

    otherPositions: getOtherPositionsActive {
      id
      postdesc
      poscode
    }

    specialties: activeSpecialties {
      id
      name
    }
  }
`;

const GET_JOBTITLES = gql`
  query {
    list: jobTitleActive {
      value
      label: value
    }
  }
`;

const EmployeeForm = (props) => {
  const router = useRouter();
  const onShowEducationalBg = useDialog(EducationalBackground);
  const employeeId = router.query?.id;
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      excludePayroll: false,
    },
  });
  const [educationalBackgrounds, setEducationalBackgrounds] = useState([]);

  const [saveUser, { loading: loadingSaveUser }] = useMutation(SAVE_USER, {
    onCompleted: (data) => {
      if (data?.upsertEmployee?.success === true) {
        message.success('Successfully saved employee information.');
        router.push(`/employees/manage/${data?.upsertEmployee?.payload?.id}`);
      } else {
        message.error(data?.upsertEmployee?.message);
      }
    },
  });

  const { data: jobTitle, loading: loadingJobTitle } = useQuery(GET_JOBTITLES);

  const { loading, data, called } = useQuery(GET_USER, {
    variables: {
      id: employeeId,
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let user = data?.employee?.user || {};
      let department = data?.employee?.department || {};
      let departmentOfDuty = data?.employee?.departmentOfDuty || {};
      methods.reset({
        ...data?.employee,
        login: user?.login,
        password: user?.password,
        departmentId: department?.id,
        departmentOfDutyId: departmentOfDuty?.id,
        excludePayroll: data?.employee?.excludePayroll ?? false,
        titleInitials: data?.employee?.titleInitials?.split(', '),
        birthplace: data?.employee?.birthplace || '',
      });
      setEducationalBackgrounds(
        data?.employee?.educationalBackgroundList?.educationalBackgrounds || [],
      );
    },
  });

  const handleSubmit = (values) => {
    values.excludePayroll =
      values.excludePayroll === null || values.excludePayroll === undefined
        ? false
        : values.excludePayroll;

    values.isSpecialtyBoardCertified =
      values.isSpecialtyBoardCertified === null || values.isSpecialtyBoardCertified === undefined
        ? false
        : values.isSpecialtyBoardCertified;

    saveUser({
      variables: {
        fields: {
          ...values,
          titleInitials: values?.titleInitials?.join(', '),
          educationalBackgroundList: { educationalBackgrounds },
        },
        id: employeeId,
        fields: { ...values, titleInitials: values?.titleInitials?.join(', ') },
        departmentId: values.departmentId,
        departmentOfDutyId: values.departmentOfDutyId,
      },
    });
  };

  let departments = _.map(data?.departments, (item) => ({
    label: item.departmentName,
    value: item.id,
  }));

  let employeePositions = _.map(data?.positions, (item) => ({
    value: item.postdesc,
    postype: item.postype,

    key: item.id,
  }));

  let otherPositions = _.map(data?.otherPositions, (item) => ({
    label: item.postdesc,
    value: item.postdesc,
  }));

  let subDepartments = _.map(data?.subDepartments, (item) => ({
    label: item.departmentName,
    value: item.id,
  }));

  const onAddEducationalBg = useCallback(
    (value) => {
      if (value) {
        const newValues = { ...value };
        delete newValues.yearGraduated;
        newValues.yearGraduated = parseInt(moment(value.yearGraduated).format('YYYY'));
        setEducationalBackgrounds([...educationalBackgrounds, { ...newValues }]);
      }
    },
    [educationalBackgrounds],
  );

  const onEditEducationalBg = useCallback(
    (editedValue) => {
      setEducationalBackgrounds((value) => {
        const dataIndex = value.findIndex((educ) => educ.key == editedValue.key);
        const newValues = { ...editedValue };
        delete newValues.yearGraduated;
        newValues.yearGraduated = parseInt(moment(editedValue.yearGraduated).format('YYYY'));
        value[dataIndex] = { ...newValues };
        return value;
      });
    },
    [educationalBackgrounds],
  );

  const onDeleteEducationalBg = useCallback(
    (item) => {
      setEducationalBackgrounds((value) => {
        const newData = [...value];
        const dataIndex = value.findIndex((educ) => educ.key == item.key);
        const removed = newData.splice(dataIndex, 1);
        return newData;
      });
    },
    [educationalBackgrounds],
  );

  if (loading) return <Skeleton loading={loading} active />;
  return (
    <>
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Row gutter={24}>
          <Col md={24} sm={24} xs={24}>
            <HRPageHeader title={'Employee Information'} />

            <Row gutter={8}>
              <Col md={6}>
                <HRInput label="Firstname" name="firstName" rules={{ required: true }} />
              </Col>
              <Col md={6}>
                <HRInput label="Middle name" name="middleName" />
              </Col>
              <Col md={6}>
                <HRInput label="Lastname" name="lastName" rules={{ required: true }} />
              </Col>
              <Col md={6}>
                <HRInput label="Suffix" name="nameSuffix" />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={6}>
                <HRDatePicker label="Date of birth" name="dob" />
              </Col>
              <Col md={6}>
                <HRInput label="Place of Birth" name="birthplace" />
              </Col>
              <Col md={6}>
                <HRSelect
                  label="Blood Type"
                  name="bloodType"
                  options={[
                    { value: 'O+', key: 'O+' },
                    { value: 'O-', key: 'O-' },
                    { value: 'A+', key: 'A+' },
                    { value: 'A-', key: 'A-' },
                    { value: 'B+', key: 'B+' },
                    { value: 'B-', key: 'B-' },
                    { value: 'AB+', key: 'AB+' },
                    { value: 'AB-', key: 'AB-' },
                  ]}
                  rules={{ required: true }}
                />
              </Col>
              <Col md={6}>
                <HRSelect
                  label="Gender"
                  name="gender"
                  options={[
                    { key: 'MALE', value: 'MALE' },
                    { key: 'FEMALE', value: 'FEMALE' },
                  ]}
                  rules={{ required: true }}
                />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={6}>
                <HRSelect
                  label="Position/Designation"
                  allowClear
                  name="positionType"
                  useChildren={true}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <OptGroup label="Medical">
                    {employeePositions.map((item) => {
                      if (item.postype == 1)
                        return (
                          <Option value={item.value} key={item.key}>
                            {item.value}
                          </Option>
                        );
                    })}
                  </OptGroup>
                  <OptGroup label="Allied Medical">
                    {employeePositions.map((item) => {
                      if (item.postype == 2)
                        return (
                          <Option value={item.value} key={item.key}>
                            {item.value}
                          </Option>
                        );
                    })}
                  </OptGroup>
                  <OptGroup label="Non-Medical">
                    {employeePositions.map((item) => {
                      if (item.postype == 3)
                        return (
                          <Option value={item.value} key={item.key}>
                            {item.value}
                          </Option>
                        );
                    })}
                  </OptGroup>
                  <OptGroup label="Others">
                    {otherPositions.map((item) => {
                      return (
                        <Option value={item.value} key={item.key}>
                          {item.value}
                        </Option>
                      );
                    })}
                  </OptGroup>
                </HRSelect>
              </Col>
              <Col md={6}>
                <HRSelect
                  label="Employment Status"
                  allowClear
                  name="employeeType"
                  options={employeeStatus}
                />
              </Col>
              <Col md={6}>
                <HRSelect
                  label="Title"
                  name="titleInitials"
                  mode="multiple"
                  options={jobTitle?.list || []}
                />
              </Col>
              <Col md={6}>
                <HRInput label="Email Address" name="emailAddress" />
              </Col>
              <Col md={6}>
                <HRInput label="Nationality" name="nationality" />
              </Col>
              <Col md={6}>
                <HRSelect
                  label="Civil/Marital Status"
                  allowClear
                  name="civilStatus"
                  options={civilStatuses}
                />
              </Col>
              <Col md={6}>
                <HRInput label="Employee ID Number" name="employeeId" />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader
              title="Educational Background"
              extra={[
                <Button
                  icon={<PlusCircleOutlined />}
                  type="primary"
                  onClick={() =>
                    onShowEducationalBg({ rows: educationalBackgrounds?.length }, (e) => {
                      onAddEducationalBg(e);
                    })
                  }
                >
                  Add
                </Button>,
              ]}
            />

            <Row gutter={8}>
              <Col md={24}>
                <List
                  loading={false}
                  itemLayout="vertical"
                  dataSource={educationalBackgrounds}
                  renderItem={(item) => (
                    <List.Item
                      actions={[<p>Year Graduated : {item.yearGraduated}</p>]}
                      extra={
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() =>
                              onShowEducationalBg({ data: { ...item } }, (e) => {
                                onEditEducationalBg(e);
                              })
                            }
                          />
                          <Button
                            type="text"
                            color="red"
                            icon={<MdDeleteOutline />}
                            onClick={() => {
                              onDeleteEducationalBg(item);
                            }}
                          />
                        </Space>
                      }
                    >
                      <List.Item.Meta
                        title={item?.school || ''}
                        description={`${item?.degreeCourse ? `${item?.degreeCourse},` : ''} ${
                          item?.highestEducation
                        }`}
                      />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Employee Address" />

            <Row gutter={8} style={{ marginRight: 4 }}>
              <Col md={12}>
                <HRInput label="Street Address" name="address" rules={{ required: true }} />
              </Col>
              <Col md={12}>
                <HRInput label="Street Address Line 2" name="address2" />
              </Col>
            </Row>

            <Row gutter={8} style={{ marginRight: 4 }}>
              <Col md={6}>
                <HRInput
                  label="City / Municipality"
                  name="cityMunicipality"
                  rules={{ required: true }}
                />
              </Col>
              <Col md={6}>
                <HRInput label="State / Province" name="stateProvince" rules={{ required: true }} />
              </Col>
              <Col md={6}>
                <HRInput label="Postal / Zip code" name="zipCode" rules={{ required: true }} />
              </Col>
              <Col md={6}>
                <HRInput label="Country" name="country" rules={{ required: true }} />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={12}>
                <HRDivider />
                <HRPageHeader title="Employee Contact" />

                <Row gutter={8}>
                  <Col md={12}>
                    <HRInput label="Phone number" name="employeeCelNo" />
                  </Col>
                  <Col md={12}>
                    <HRInput label="Telephone number" name="employeeTelNo" />
                  </Col>
                </Row>
              </Col>
              <Col md={12}>
                <HRDivider />
                <HRPageHeader title="Employee Departments" />

                <Row gutter={8}>
                  <Col md={12}>
                    <HRSelect
                      label="Department"
                      name="departmentId"
                      options={departments}
                      rules={{ required: true }}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <HRSelect
                      label="Department Of Duty"
                      name="departmentOfDutyId"
                      options={departments}
                      rules={{ required: true }}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Employee Details" />

            <Row gutter={8}>
              <Col md={6}>
                <HRInput label="PhilHealth #" name="philhealthNo" />
              </Col>
              <Col md={6}>
                <HRInput label="SSS #" name="sssNo" />
              </Col>
              <Col md={6}>
                <HRInput label="TIN #" name="tinNo" />
              </Col>
              <Col md={6}>
                <HRInput label="Pag-Ibig ID" name="pagIbigId" />
              </Col>
            </Row>
            <Row gutter={8}>
              <Col md={6}>
                <HRCheckbox name="isSpecialtyBoardCertified">Specialty Board Certified</HRCheckbox>
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Incase of Emergency" />
            <Row gutter={8}>
              <Col md={8}>
                <HRInput label="Name" name="emergencyContactName" />
              </Col>
              <Col md={8}>
                <HRInput label="Address" name="emergencyContactAddress" />
              </Col>
              <Col md={8}>
                <HRInput label="Contact" name="emergencyContactNo" />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Salary Rate" />

            <Row gutter={[8, 8]}>
              <Col md={8}>
                <HRInputNumber label="Basic Salary" name="basicSalary" />
              </Col>
              <Col md={8}>
                <HRSelect
                  label="Payroll-Type"
                  name="scheduleType"
                  placeholder="Payroll-Type"
                  showSearch
                  allowClear
                  options={payrollTypes}
                />
              </Col>
              <Col md={8}>
                <HRSelect
                  label="Pay-frequency"
                  name="payFreq"
                  placeHolder="Pay-frequency"
                  allowClear
                  options={frequency}
                />
              </Col>
              <Col md={8}>
                <HRCheckbox name="excludePayroll">Exclude From Payroll</HRCheckbox>
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Bank Account Information" />

            <Row gutter={8}>
              <Col md={12}>
                <HRInput label="Account Name" name="bankAccountName" />
              </Col>
              <Col md={12}>
                <HRInput label="Account #" name="bankAccountNo" />
              </Col>
            </Row>

            <HRButton
              allowedPermissions={['edit_employee', 'manage_employee']}
              type="primary"
              style={{ width: '100%' }}
              icon={<CheckOutlined />}
              loading={loadingSaveUser}
              htmlType="submit"
            >
              Save Employee Information
            </HRButton>
            <HRPageHeader title="Signatures" />
            <Row gutter={25}>
              <Col md={8}>
                <Controller
                  control={methods.control}
                  name="signature1"
                  render={(inputProps, { invalid, isTouched, isDirty }) => (
                    <HRSignaturerField
                      label="Signature 1"
                      {...inputProps}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={8}>
                <Controller
                  control={methods.control}
                  name="signature2"
                  render={(inputProps, { invalid, isTouched, isDirty }) => (
                    <HRSignaturerField
                      label="Signature 2"
                      {...inputProps}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={8}>
                <Controller
                  control={methods.control}
                  name="signature3"
                  render={(inputProps, { invalid, isTouched, isDirty }) => (
                    <HRSignaturerField
                      label="Signature 3"
                      {...inputProps}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
            </Row>
            <HRButton
              allowedPermissions={['edit_employee', 'manage_employee']}
              type="primary"
              style={{ width: '100%', margin: '15px 0' }}
              icon={<CheckOutlined />}
              loading={loadingSaveUser}
              htmlType="submit"
            >
              Save Signature/s
            </HRButton>

            <HRDivider />
            <HRPageHeader title="Physician License Details" />

            <Row gutter={8}>
              <Col md={8}>
                <HRInput label="PRC License Type" name="prcLicenseType" />
              </Col>
              <Col md={8}>
                <HRInput label="PRC License Number" name="prcLicenseNo" />
              </Col>
              <Col md={8}>
                <HRDatePicker label="PRC Expiry Date" name="prcExpiryDate" />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={8}>
                <HRInput label="PTR No." name="ptrNo" />
              </Col>
              <Col md={8}>
                <HRInput label="S2 No." name="s2No" />
              </Col>
              <Col md={8}>
                <HRInput label="PMMC No." name="pmmcNo" />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Tax Rates" />
            <Row gutter={8}>
              <Col md={6}>
                <HRSelect
                  label="VAT / Non-VAT"
                  allowClear
                  name="vatable"
                  options={[
                    { label: 'VAT', value: true },
                    { label: 'Non-VAT', value: false },
                  ]}
                />
              </Col>
              <Col md={6}>
                <Controller
                  control={methods.control}
                  name="witholdTaxRate"
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      label="Witholding Tax"
                      {...inputProps}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Controller
                  control={methods.control}
                  name="pfVatRate"
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      {...inputProps}
                      label="PF VAT Rate"
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Controller
                  control={methods.control}
                  name="expandedVatRate"
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      {...inputProps}
                      label="Expanded VAT Rate"
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Physician (PHIC Details)" />

            <Row gutter={8}>
              <Col md={8}>
                <HRSelect
                  label="PHIC Group"
                  allowClear
                  name="phicGroup"
                  options={_.map(data?.phicGroup, (phicgroup, x) => ({
                    key: phicgroup.phicGroupName,
                    value: phicgroup.id,
                  }))}
                />
              </Col>
              <Col md={8}>
                <Controller
                  control={methods.control}
                  name="phicNo"
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      {...inputProps}
                      label="PHIC Number"
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={8}>
                <HRDatePicker label="PHIC Expiry Data" name="phicExpiryDate" />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title="Physician Specialization" />

            <Row gutter={8}>
              <Col md={8}>
                <HRSelect
                  label="Service Type"
                  allowClear
                  name="serviceType"
                  options={_.map(DoctorServiceType, (svType, x) => ({
                    key: svType,
                    value: svType,
                  }))}
                />
              </Col>
              <Col md={8}>
                <HRSelect
                  label="Specialization"
                  allowClear
                  name="specialization"
                  options={_.map(data?.specialties || [], (item) => ({
                    key: item?.name,
                    value: item?.name,
                  }))}
                />
              </Col>
              <Col md={8}>
                <HRSelect
                  label="Service Class"
                  allowClear
                  name="serviceClass"
                  options={_.map(DoctorServiceClass || [], (svType, x) => ({
                    key: svType,
                    value: svType,
                  }))}
                />
              </Col>
            </Row>

            <HRButton
              allowedPermissions={['edit_employee', 'manage_employee']}
              type="primary"
              style={{ width: '100%', marginBottom: 20 }}
              icon={<CheckOutlined />}
              loading={loadingSaveUser}
              htmlType="submit"
            >
              Save Physician Information
            </HRButton>
          </Col>
        </Row>
      </HRForm>
    </>
  );
};

export default EmployeeForm;
