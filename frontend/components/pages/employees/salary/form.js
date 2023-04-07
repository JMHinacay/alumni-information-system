import React, { useEffect, useState } from "react";
import { Col, message, Modal, Row } from "antd";
import { useForm, Controller } from "react-hook-form";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import { HRList, HRListItem, HRInput, HRForm, HRSelect, HRInputNumber, HRButton, HRDivider, HRTextarea } from "components/commons";
import { useRouter } from "next/router";

import { payrollTypes, payFrequency } from "@utils/constants";
import { values } from "lodash";

function FormSalary(props) {
	const methods = useForm({
		defaultValues: {
			basicSalary: 0,
		},
	});
	const router = useRouter();
	const employeedId = router.query?.id;
	const [state, setState] = useState({
		loading: false,
		deletedAuthorities: [],
		deletedPermissions: [],
		groupPolicyID: null,
	});

	// const SAVE_USER = gql`
	//   mutation(
	//     $id: UUID
	//     $fields: Map_String_ObjectScalar
	//     $authorities: [String]
	//     $permissions: [String]
	//     $departmentId: UUID
	//     $departmentOfDutyId: UUID
	//     $deletedAuthorities: [String]
	//     $deletedPermissions: [String]
	//   ) {
	//     upsertEmployee(
	//       id: $id
	//       fields: $fields
	//       authorities: $authorities
	//       permissions: $permissions
	//       departmentId: $departmentId
	//       departmentOfDutyId: $departmentOfDutyId
	//       deletedAuthorities: $deletedAuthorities
	//       deletedPermissions: $deletedPermissions
	//     ) {
	//       lastName
	//       firstName
	//       middleName
	//       nameSuffix
	//       gender
	//       dob
	//       address
	//       country
	//       stateProvince
	//       cityMunicipality
	//       barangay
	//       gender
	//       emergencyContactName
	//       emergencyContactAddress
	//       emergencyContactRelationship
	//       emergencyContactNo
	//       zipCode
	//       address2
	//       employeeTelNo
	//       employeeCelNo
	//       philhealthNo
	//       sssNo
	//       tinNo
	//       bloodType
	//       basicSalary
	//       payFreq
	//       scheduleType
	//       positionType
	//       employeeType
	//       careProvider
	//       prcLicenseType
	//       prcExpiryDate
	//       prcLicenseNo
	//       ptrNo
	//       s2No
	//       vatable
	//       pmmcNo
	//       pfVatRate
	//       expandedVatRate
	//       phicGroup
	//       phicNo
	//       phicExpiryDate
	//       serviceType
	//       specialization
	//       serviceClass
	//       bankAccountName
	//       bankAccountNo
	//       user {
	//         login
	//         password
	//       }
	//     }
	//   }
	// `;
	// const [saveUser, { loading: loadingSaveUser }] = useMutation(SAVE_USER, {
	//   onCompleted: (data) => {
	//     message.success('Successfulyy saved employee Information');
	//   },
	// });

	function handleSubmit(e) {
		// saveUser({
		//   variables: {
		//     fields: values,
		//     id: !_.isEmpty(props?.selectedRow) ? props?.selectedRow?.id : null,
		//     authorities: values?.authorities,
		//     permissions: values?.permissions,
		//     departmentId: values.departmentId,
		//     departmentOfDuty: values.departmentOfDuty,
		//     deletedAuthorities: state.deletedAuthorities,
		//     deletedPermissions: state.deletedPermissions,
		//   },
		// });
	}

	useEffect(() => {
		if (props?.visible)
			methods.reset({
				...props?.selectedRow,
			});
		else
			methods.reset({
				basicSalary: 0,
			});
	}, [props?.selectedRow, props?.visible]);

	const basicSalary = methods.watch("basicSalary");
	// console.log(basicSalary);
	const dailyRate = (basicSalary * 12) / 261;
	const hourlyRate = dailyRate / 8;
	return (
		<div>
			<Modal
				title={`Basic Salary Configuration - ${props?.selectedRow?.fullName} `}
				centered
				footer={null}
				destroyOnClose={false}
				visible={props?.visible}
				// onOk={props?.handleCancel}
				onCancel={props?.handleCancel}
				width={1000}
				maskClosable={false}
			>
				<div>
					<HRForm onSubmit={handleSubmit} methods={methods}>
						<Row gutter={2} style={{ marginBottom: 20 }}>
							<Col md={24}>
								<HRInputNumber
									label={"BASIC MONTHLY SALARY"}
									name={"basicSalary"}
									placeholder={"basic salary"}
									rules={{ required: true }}
									defaultValue={props?.selectedRow?.basicSalary}
								/>
							</Col>
							<Col md={24}>
								<HRInput
									useNative
									label={"Daily Rate (Calculated)"}
									name={"dailyRate"}
									// disabled
									style={{ cursor: "not-allowed" }}
									readOnly
									value={dailyRate.toFixed(2)}
								/>
							</Col>
							<Col md={24}>
								<HRInput
									useNative
									label={"Hourly Rate (Calculated)"}
									name={"hourlyRate"}
									// disabled
									readOnly
									style={{ cursor: "not-allowed" }}
									value={hourlyRate.toFixed(2)}
								/>
							</Col>
							<Col md={12}>
								<HRSelect
									label={"Payroll-Type"}
									name={"scheduleType"}
									placeholder={"Payroll-Type"}
									showSearch
									rules={{ required: true }}
									allowClear
									options={payrollTypes}
									defaultValue={props?.selectedRow?.scheduleType}
								/>
							</Col>
							<Col md={12}>
								<HRSelect
									label={"Pay-Frequency"}
									name={"payFrequency"}
									placeholder={"Pay-frequency"}
									showSearch
									rules={{ required: true }}
									allowClear
									options={payFrequency}
									defaultValue={props?.selectedRow?.payFreq}
								/>
							</Col>
							<Col md={24}>
								<HRTextarea label={"Note"} placeholder={"note"} name={"note"} />
							</Col>
							<Col md={24}>
								<HRInput label={"Custom Contribution for PagIbig"} name={"customContributionPagIbig"} defaultValue="0" />
							</Col>
						</Row>
						<Row gutter={2}>
							<Col md={2} style={{ marginRight: 5 }}>
								<HRButton type={"primary"} danger onClick={props?.handleCancel}>
									Cancel
								</HRButton>
							</Col>
							<Col md={4}>
								<HRButton type={"primary"} key="submit" htmlType="submit">
									Submit
								</HRButton>
							</Col>
						</Row>
					</HRForm>
				</div>
			</Modal>
		</div>
	);
}

export default FormSalary;
