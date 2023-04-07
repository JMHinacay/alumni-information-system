import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/react-hooks";
import { HRButton, HRForm, HRInput } from "@components/commons";
import HRTable from "@components/commons/HRTable";
import { Col, PageHeader, Row, DatePicker, Pagination, Tooltip, message } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Head from "next/head";
import { useRouter } from "next/router";
import { WarningOutlined } from "@ant-design/icons";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";

const GET_EMPLOYEES = gql`
	query($filter: String, $department: UUID, $page: Int, $size: Int) {
		employees: searchActiveEmployeesPageable(filter: $filter, department: $department, page: $page, size: $size) {
			content {
				key: id
				id
				fullName
				isActive
				basicSalary
				department {
					id
					departmentName
				}
				departmentOfDuty {
					id
					departmentName
				}
			}
			totalElements
		}
	}
`;

const UPSERT_PAYROLL = gql`
	mutation($id: UUID, $fields: Map_String_ObjectScalar, $employees: [UUID]) {
		data: upsertPayroll(id: $id, fields: $fields, employees: $employees) {
			payload {
				id
			}
			success
			message
		}
	}
`;

const initialState = {
	filter: "",
	department: null,
	size: 25,
	page: 0,
};

const GeneratePayrollPage = (props) => {
	const router = useRouter();
	const methods = useForm();
	const [state, setState] = useState(initialState);
	const [selectedEmployees, setSelectedEmployees] = useState([]);

	const { data, loading } = useQuery(GET_EMPLOYEES, {
		variables: {
			filter: state.filter,
			department: state.department,
			page: state.page,
			size: state.size,
		},
	});

	const [upsertPayroll, { loading: loadingUpsertPayroll }] = useMutation(UPSERT_PAYROLL, {
		onCompleted: (data) => {
			data = data?.data || {};
			if (data?.success) {
				message.success(data?.message ?? "Successfully created payroll.");
				if (data?.payload?.id) router.replace(`/payroll/view/${data?.payload?.id}`);
			} else message.error(data?.message ?? "Failed to created payroll.");
		},
	});

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			let employeesWithBasicSalary = selectedRows.filter((employee) => employee.basicSalary).map((employee) => employee.id);
			setSelectedEmployees(employeesWithBasicSalary);
			// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		getCheckboxProps: (record) => ({
			disabled: record.employee === "Disabled User",
			// Column configuration not to be checked
			name: record.fullName,
			// value: record.id,
			key: record.id,
		}),
		preserveSelectedRowKeys: true,
		renderCell: (checked, record, index, originNode) => {
			if (!record?.basicSalary) {
				return (
					<Tooltip title="Please configure employee basic salary.">
						<WarningOutlined style={{ color: "#e74c3c" }} />
					</Tooltip>
				);
			}
			return <Checkbox {...originNode?.props} />;
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			if (true) {
				// console.log(selected, selectedRows, changeRows);
				let employeesWithBasicSalary = changeRows.filter((employee) => employee?.basicSalary);

				let difference = changeRows.length - employeesWithBasicSalary.length;
				if (difference > 0) message.error(`${difference} selected employees have unconfigured basic salary. Selection was undone.`);
			}
		},
		selectedRowKeys: selectedEmployees,
	};

	const onQueryChange = (field, value) => {
		setState({
			...state,
			page: 0,
			[field]: value,
		});
	};

	const onNexPage = (page, size) => {
		setState({ ...state, page: page - 1, size });
	};

	const handleDateChange = (datesValue) => {
		methods.setValue("dates", datesValue, { shouldValidate: true });
	};

	const onSubmit = (values) => {
		if (selectedEmployees.length === 0) message.error("No employees selected. Please select employees.");
		else
			upsertPayroll({
				variables: {
					fields: {
						name: values?.name || null,
						dateStart: moment(values?.dates[0]).startOf("day").utc().format(),
						dateEnd: moment(values?.dates[1]).endOf("day").utc().format(),
					},
					employees: selectedEmployees,
				},
			});
	};

	return (
		<>
			<Head>
				<title>Generate Payroll</title>
			</Head>
			<HRForm onSubmit={onSubmit} methods={methods}>
				<PageHeader
					title="Generate Payroll"
					onBack={() => router.back()}
					extra={[
						<HRButton key="create-payroll" type="primary" htmlType="submit" loading={loadingUpsertPayroll}>
							Create Payroll
						</HRButton>,
					]}
				/>
				<Row gutter={[20, 20]}>
					<Col span={12}>
						<HRInput label="Payroll Name" name="name" rules={{ required: true }} />
					</Col>
					<Col span={12}>
						<Controller
							name="dates"
							rules={{
								validate: (value) => {
									if (!value) return "Please select date range.";
									if (!Array.isArray(value)) {
										return "Please select date range.";
									} else if (Array.isArray(value)) {
										if (value[0] === null || value[1] === null) return "Please select date range.";
									}
									return true;
								},
							}}
							render={(inputProps) => (
								<>
									<label>
										Date Range
										<label style={{ color: "red" }}>{methods.errors?.dates && `(${methods.errors?.dates?.message})`}</label>
									</label>
									<DatePicker.RangePicker
										style={{ width: "100%" }}
										format="MMMM D, YYYY"
										onCalendarChange={handleDateChange}
										value={inputProps.value}
										onBlur={inputProps.onBlur}
										allowClear
										allowEmpty
									/>
								</>
							)}
						/>
					</Col>
				</Row>
			</HRForm>

			<Pagination defaultCurrent={1} total={data?.employees?.totalElements} pageSize={state.size} onChange={onNexPage} current={state.page + 1} />
			<HRTable
				preserveSelectedRowKeys={true}
				style={{ margin: "10px 0" }}
				dataSource={data?.employees?.content || []}
				rowSelection={{
					type: "checkbox",
					...rowSelection,
				}}
				columns={[
					{
						title: "Employee",
						dataIndex: "fullName",
					},
					{
						title: "Department",
						dataIndex: ["department", "departmentName"],
					},
				]}
				bordered
				pagination={false}
				rowKey={(record) => record?.id}
			/>

			<Pagination defaultCurrent={1} total={data?.employees?.totalElements} pageSize={state.size} onChange={onNexPage} current={state.page + 1} />
		</>
	);
};

export default GeneratePayrollPage;
