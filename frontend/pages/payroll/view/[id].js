import React, { useState } from "react";
import { PageHeader, Table, Tag, Tooltip, Typography, Modal, Menu, Dropdown, Spin, message, Progress, Badge, Drawer, Row, Col, List } from "antd";
import { useRouter } from "next/router";
import { HRButton, HRDivider, HRList, HRListItem } from "@components/commons";
import Head from "next/head";
import Checkbox from "antd/lib/checkbox/Checkbox";
import {
	ProfileOutlined,
	DeleteOutlined,
	PrinterOutlined,
	LockOutlined,
	DownloadOutlined,
	ExclamationCircleOutlined,
	CalculatorOutlined,
	MoreOutlined,
	ReloadOutlined,
	UnorderedListOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import { BiLinkExternal } from "react-icons/bi";
import { gql, useMutation, useQuery } from "@apollo/client";
import MomentFormatter from "@components/utils/MomentFormatter";
import { employeePayFrequency, payrollProcessingStatusColor, payrollLogFlagStatusColor } from "@utils/constantFormatters";
import { PAYROLL_STATUS_NEW, PAYROLL_STATUS_CALCULATED, PAYROLL_STATUS_FINALIZED, PAYROLL_STATUS_CALCULATING } from "@utils/constants";
import SockJsClient from "react-stomp";
import { apiUrlPrefix } from "@shared/settings";
import DescriptionsItem from "antd/lib/descriptions/Item";
import moment from "moment";

const GET_ONE_PAYROLL = gql`
	query($id: UUID) {
		payroll: getOnePayroll(id: $id) {
			id
			name
			dateEnd
			dateStart
			status
			logFlags {
				id
				status
				date
				employee {
					id
					fullName
				}
			}
			payslip {
				id
				employee {
					id
					fullName
					payFreq
					basicSalary
					department {
						id
						departmentName
					}
				}
				payFreq
				adjustment
				adjustmentReason
				basicSalary
				deductCashAdvance
				deductGsis
				deductGsisEmployer
				deductHdmf
				deductHdmfEmployer
				deductOthers
				deductPhilhealth
				deductPhilhealthEmployer
				deductSss
				deductSssEmployer
				hoursAbsent
				hoursDoubleHoliday
				hoursDoubleHolidayAndRestDay
				hoursDoubleHolidayAndRestDayOvertime
				hoursLate
				hoursRegular
				hoursRegularHoliday
				hoursRegularHolidayAndRestDay
				hoursRegularHolidayAndRestDayOvertime
				hoursRegularOvertime
				hoursRestDay
				hoursRestOvertime
				hoursSpecialHoliday
				hoursSpecialHolidayAndRestDay
				hoursSpecialHolidayAndRestDayOvertime
				hoursSpecialHolidayOvertime
				includeInPayroll
				withholdingTax
			}
		}
	}
`;

const REMOVE_EMPLOYEE_FROM_PAYROLL = gql`
	mutation($id: UUID) {
		data: removeEmployeeFromPayroll(id: $id) {
			success
			message
			payload {
				id
				fullName
			}
		}
	}
`;

const CALCULATE_PAYROLL = gql`
	mutation($id: UUID) {
		data: calculatePayroll(id: $id) {
			payload {
				id
				name
				dateEnd
				dateStart
				status
			}
			message
			success
		}
	}
`;

const ViewPayrollPage = (props) => {
	const router = useRouter();
	const [selectedPhilHealth, setSelectedPhilHealth] = useState([]);
	const [selectedSss, setSelectedSss] = useState([]);
	const [selectedPagibig, setSelectedPagibig] = useState([]);
	const [progress, setProgress] = useState(0);
	const [flagDrawer, setFlagDrawer] = useState(false);

	const { data, loading, refetch } = useQuery(GET_ONE_PAYROLL, {
		variables: {
			id: router?.query?.id || null,
		},
	});

	const [removeEmployeeFromPayroll, { loading: loadingRemoveEmployeeFromPayroll }] = useMutation(REMOVE_EMPLOYEE_FROM_PAYROLL, {
		onCompleted: (data) => {
			data = data?.data || {};
			if (data?.success) {
				refetch();
				message.success(data?.message ?? "Successfully remove employee from payroll.");
			} else message.error(data?.message ?? "Failed to remove employee from payroll.");
		},
	});

	const [calculatePayroll, { loading: loadingCalculatePayroll }] = useMutation(CALCULATE_PAYROLL, {
		onCompleted: (data) => {
			data = data?.data || {};
			if (data?.success) {
				// refetch();
				message.success(data?.message ?? "Started calculating payroll.");
			} else message.error(data?.message ?? "Failed to start calculating payroll.");
		},
	});

	const onRemoveEmployeeFromPayroll = (id) => {
		removeEmployeeFromPayroll({
			variables: {
				id,
			},
		});
	};

	const onCalculatePayroll = () => {
		setProgress(0);
		calculatePayroll({
			variables: {
				id: router?.query?.id || null,
			},
		});
	};

	const onRefreshPayroll = () => {
		refetch();
	};

	const handleFlagDrawer = () => {
		setFlagDrawer(!flagDrawer);
	};

	const menu = (
		<Menu>
			<Menu.Item icon={<PrinterOutlined />}>Print List</Menu.Item>
			<Menu.Item icon={<DownloadOutlined />}>Download</Menu.Item>
		</Menu>
	);

	let columns = [
		{
			title: "Employee",
			fixed: "left",
			dataIndex: ["employee", "fullName"],
			width: 350,
		},
		{
			title: "Department",
			width: 250,
			dataIndex: ["employee", "department", "departmentName"],
		},
		{
			title: "Pay Frequency",
			width: 200,
			dataIndex: "payFreq",
			render: (text) => employeePayFrequency(text),
		},
		{
			title: "Gross Taxable Earnings",
			width: 150,
			dataIndex: "basicSalary",
			render: (text, record, index) => <>{text || 0}</>,
		},
		{
			title: "Tax (1/2 of Monthly)",
			width: 150,
			dataIndex: "tax",
			render: (text, record, index) => <>{text || 0}</>,
		},
		{
			title: () => (
				<>
					<Tooltip title="Check all">
						<Checkbox>
							<Typography.Text>PhilHealth</Typography.Text>
						</Checkbox>
					</Tooltip>
				</>
			),
			render: (text, record, index) => (
				<>
					<Checkbox>0</Checkbox>
				</>
			),
			width: 200,
			dataIndex: "philhealth",
		},
		{
			title: () => (
				<>
					<Tooltip title="Check all">
						<Checkbox>
							<Typography.Text>SSS</Typography.Text>
						</Checkbox>
					</Tooltip>
				</>
			),
			render: (text, record, index) => (
				<>
					<Checkbox>0</Checkbox>
				</>
			),
			width: 200,
			dataIndex: "sss",
		},
		{
			title: () => (
				<>
					<Tooltip title="Check all">
						<Checkbox>
							<Typography.Text>PAG-IBIG</Typography.Text>
						</Checkbox>
					</Tooltip>
				</>
			),
			render: (text, record, index) => (
				<>
					<Checkbox>0</Checkbox>
				</>
			),
			width: 200,
			dataIndex: "pagibig",
		},
		{
			title: "LOANS",
			width: 150,
			dataIndex: "loans",
			render: (text, record, index) => <>{text || 0}</>,
		},
		{
			title: "ALLOWANCES",
			width: 150,
			dataIndex: "allowances",
			render: (text, record, index) => <>{text || 0}</>,
		},
		{
			title: "ADJUSTMENT",
			width: 150,
			dataIndex: "adjustment",
			render: (text, record, index) => <>{text || 0}</>,
		},
		{
			title: "TAKE-HOME PAY",
			width: 150,
			dataIndex: "takeHomePay",
			render: (text, record, index) => <>{text || 0}</>,
		},
	];
	if (data?.payroll?.status !== PAYROLL_STATUS_FINALIZED) {
		columns = columns.concat({
			title: "ACTIONS",
			width: 150,
			fixed: "right",
			render: (_, record) => {
				return (
					<>
						{data?.payroll?.status !== PAYROLL_STATUS_NEW && (
							<Tooltip title="View payslip">
								<HRButton icon={<ProfileOutlined />} shape="circle" type="primary" style={{ marginRight: 5 }} />
							</Tooltip>
						)}
						<Tooltip title="Remove employee">
							<HRButton icon={<DeleteOutlined />} shape="circle" type="danger" onClick={() => onRemoveEmployeeFromPayroll(record?.id)} />
						</Tooltip>
					</>
				);
			},
		});
	}

	const scrollProps = { x: 0, y: "calc(100vh - 330px)" };

	const statusColor = payrollProcessingStatusColor(data?.payroll?.status);
	let tags = [
		<Tag color={statusColor} key="status">
			{data?.payroll?.status}
		</Tag>,
	];
	if (data?.payroll?.logFlags?.length > 0)
		tags = tags.concat(
			<Tag color="red" key="log-flags">
				{data?.payroll?.logFlags?.length} LOG FLAG(S)
			</Tag>
		);

	if (!data && loading)
		return (
			<div style={{ display: "flex", justifyContent: "center", paddingTop: 30 }}>
				<Spin size="large" />
			</div>
		);
	else
		return (
			<>
				<Head>
					<title>View Payroll</title>
				</Head>
				<SockJsClient
					url={`${apiUrlPrefix}/ws`}
					topics={["/user/channel/payroll"]}
					onMessage={(msg) => {
						if (msg.type === "PAYROLL_CALCULATION_PROGRESS") {
							if (msg.progress === msg.total) {
								refetch();
							}
							setProgress((msg.progress / msg.total) * 100);
						}
						// if (msg.type === 'STOCK_REQUEST_LIST_NEW') {
						//   this.loadList(this.state.filter);
						// }`~
					}}
				/>
				<PageHeader
					title={data?.payroll?.name}
					subTitle={
						<>
							<MomentFormatter value={data?.payroll?.dateStart} format="MMMM D, YYYY" />—
							<MomentFormatter value={data?.payroll?.dateEnd} format="MMMM D, YYYY" />
						</>
					}
					onBack={() => router.back()}
					extra={[
						<HRButton
							key="lock-finalize"
							icon={<LockOutlined />}
							disabled={data?.payroll?.status !== PAYROLL_STATUS_CALCULATED}
							onClick={() =>
								Modal.confirm({
									icon: <ExclamationCircleOutlined />,
									title: "Are you sure?",
									content: "This action is irreversable. Are you sure you want to lock and finalize?",
									onOk() {
										// console.log("OK");
									},
								})
							}
						>
							Lock &amp; Finalize
						</HRButton>,
						<HRButton
							icon={<CalculatorOutlined />}
							type="primary"
							key="calculate"
							disabled={data?.payroll?.status === PAYROLL_STATUS_FINALIZED}
							onClick={onCalculatePayroll}
							loading={loadingCalculatePayroll}
						>
							{data?.payroll?.status === PAYROLL_STATUS_CALCULATED ? "Recalculate" : "Calculate"}
						</HRButton>,
						<HRButton icon={<ReloadOutlined />} shape="circle" key="refresh" type="primary" onClick={onRefreshPayroll} />,
						<Badge count={data?.payroll?.logFlags?.length} key="log-flags" showZero={false}>
							<Tooltip title="View Log Flags">
								<HRButton icon={<UnorderedListOutlined />} shape="circle" onClick={handleFlagDrawer} disabled={data?.payroll?.logFlags?.length == 0} />
							</Tooltip>
						</Badge>,
						<Tooltip title="More Options" key="more-options">
							<Dropdown overlay={menu} trigger={["click"]}>
								<HRButton icon={<MoreOutlined />} shape="circle" />
							</Dropdown>
						</Tooltip>,
					]}
					tags={tags}
				/>

				{data?.payroll?.status === PAYROLL_STATUS_CALCULATING && <Progress percent={Math.trunc(progress)} status="active" />}
				<Table
					loading={loading || data?.payroll?.status === PAYROLL_STATUS_CALCULATING || loadingCalculatePayroll || loadingRemoveEmployeeFromPayroll}
					columns={columns}
					dataSource={data?.payroll?.payslip || []}
					bordered
					scroll={scrollProps}
					pagination={false}
					size="small"
					rowKey={(record) => record?.id}
				/>

				{/* Payroll Log Flag Drawer */}
				<Drawer width={"35%"} placement="right" closable={true} visible={flagDrawer} title="Payroll Log Flags" onClose={handleFlagDrawer}>
					<HRList
						bordered
						dataSource={data?.payroll?.logFlags || []}
						renderItem={(item) => (
							<HRListItem
								actions={[
									<Tooltip title="View Logs" key="view-logs">
										<HRButton
											icon={<BiLinkExternal className="anticon" />}
											shape="circle"
											onClick={() =>
												router.push(
													`/employees/employee-attendance/${item?.employee?.id}?activeTab=${"raw-logs"}&startDate=${moment(item?.date)
														.subtract(2, "days")
														.valueOf()}&endDate=${moment(item?.date).add(2, "days").valueOf()}&prefetch=true`
												)
											}
										/>
									</Tooltip>,
									<Tooltip title="Resolve" key="resolve">
										<HRButton icon={<SyncOutlined />} type="primary" shape="circle" />
									</Tooltip>,
								]}
							>
								<List.Item.Meta
									title={
										<Typography.Text>
											<MomentFormatter value={item?.date} format={"dddd, MMMM D, YYYY"} />
											<Tag style={{ marginLeft: 5 }} color={() => payrollLogFlagStatusColor(item?.status)}>
												{item?.status}
											</Tag>
										</Typography.Text>
									}
									description={item?.employee?.fullName}
								/>
							</HRListItem>
						)}
					/>
				</Drawer>
			</>
		);
};

export default ViewPayrollPage;
