import React, { useState } from "react";
import { message, Modal, PageHeader, Progress, Table, Tag, Tooltip } from "antd";
import Head from "next/head";
import HRTable from "@components/commons/HRTable";
import { HRButton } from "@components/commons";
import { BsArrowRepeat } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { payrollProcessingStatusColor } from "@utils/constantFormatters";
import { gql, useMutation, useQuery } from "@apollo/client";
import MomentFormatter from "@components/utils/MomentFormatter";
import { PAYROLL_STATUS_CALCULATED, PAYROLL_STATUS_FINALIZED, PAYROLL_STATUS_NEW } from "@utils/constants";
import SockJsClient from "react-stomp";
import { apiUrlPrefix } from "@shared/settings";
import _ from "lodash";

const GET_PAYROLLS = gql`
	query {
		payrolls: getAllPayrolls {
			id
			name
			dateEnd
			dateStart
			status
			generated
		}
	}
`;

const DELETE_PAYROLL = gql`
	mutation($id: UUID) {
		data: deletePayroll(id: $id) {
			message
			success
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

function PayrollProcessingPage() {
	const router = useRouter();
	const [processing, setProcessing] = useState({});
	const [isProcessing, setIsProcessing] = useState(false);

	const { data, loading, refetch } = useQuery(GET_PAYROLLS, {
		onCompleted: () => {
			setProcessing({});
			setIsProcessing(false);
		},
	});
	const [deletePayroll, { loading: loadingDeletePayroll }] = useMutation(DELETE_PAYROLL, {
		onCompleted: (data) => {
			data = data?.data || {};
			if (data?.success) {
				refetch();
				message.success(data?.message ?? "Successfully delete payroll.");
			} else message.error(data?.message ?? "Failed to delete payroll.");
		},
	});

	const [calculatePayroll, { loading: loadingCalculatePayroll }] = useMutation(CALCULATE_PAYROLL, {
		onCompleted: (data) => {
			data = data?.data || {};
			if (data?.success) {
				// refetch();
				setProcessing({ payroll: { id: data?.payload?.id }, progress: 0, total: 0 });
				setIsProcessing(true);
				message.success(data?.message ?? "Started calculating payroll.");
			} else message.error(data?.message ?? "Failed to start calculating payroll.");
		},
	});

	const onDeletePayroll = (id) => {
		Modal.confirm({
			title: "Are you sure?",
			content: "Are you sure you want to delete this payroll?",
			onOk: () =>
				deletePayroll({
					variables: {
						id,
					},
				}),
		});
	};

	const onCalculatePayroll = (id) => {
		calculatePayroll({
			variables: {
				id,
			},
		});
	};

	// console.log(processing);
	return (
		<div>
			<SockJsClient
				url={`${apiUrlPrefix}/ws`}
				topics={["/user/channel/payroll"]}
				onMessage={(msg) => {
					if (msg.type === "PAYROLL_CALCULATION_PROGRESS") {
						if (msg.progress === msg.total) {
							refetch();
						}
						setIsProcessing(true);
						setProcessing(msg);
					}
					// if (msg.type === 'STOCK_REQUEST_LIST_NEW') {
					//   this.loadList(this.state.filter);
					// }`~
				}}
			/>
			<Head>
				<title>Payroll Processing</title>
			</Head>
			<PageHeader
				title="Payroll Processing"
				extra={[
					<HRButton key="add-payroll" type="primary" onClick={() => router.push("/payroll/generate")}>
						New Payroll
					</HRButton>,
				]}
			></PageHeader>
			<HRTable
				dataSource={data?.payrolls || []}
				loading={loading || loadingDeletePayroll || isProcessing}
				columns={[
					{
						title: "Payroll Name",
						dataIndex: "name",
					},
					{
						title: "Date Range",
						render: (_, record, index) => {
							return (
								<>
									<MomentFormatter value={record?.dateStart} format="ddd, MMMM D, YYYY" /> —
									<MomentFormatter value={record?.dateEnd} format="ddd, MMMM D, YYYY" />
								</>
							);
						},
					},
					{
						title: "Status",
						dataIndex: "status",
						render: (text, record) => {
							const color = payrollProcessingStatusColor(text);
							return (
								<>
									{processing?.payroll?.id === record?.id && isProcessing && (
										<Progress type="circle" percent={Math.trunc((processing?.progress / processing?.total) * 100)} width={30} style={{ marginRight: 10 }} />
									)}
									<Tag color={color}>{text}</Tag>
								</>
							);
						},
					},
					{
						title: "Actions",
						render: (_, record, index) => {
							return (
								<>
									{record?.status !== PAYROLL_STATUS_FINALIZED && (
										<Tooltip title="Process Payroll">
											<HRButton
												shape="circle"
												icon={<BsArrowRepeat className="anticon" />}
												style={{ marginRight: 5 }}
												type="primary"
												onClick={() => onCalculatePayroll(record?.id)}
											/>
										</Tooltip>
									)}
									<Tooltip title="View Payroll">
										<HRButton
											shape="circle"
											icon={<FiExternalLink className="anticon" />}
											style={{ marginRight: 5 }}
											type="primary"
											onClick={() => router.push(`/payroll/view/${record?.id}`)}
										/>
									</Tooltip>
									<Tooltip title="Delete Payroll">
										<HRButton shape="circle" icon={<DeleteOutlined />} type="danger" onClick={() => onDeletePayroll(record?.id)} />
									</Tooltip>
								</>
							);
						},
					},
				]}
				bordered
				pagination={false}
				size="middle"
				rowKey={(record) => record?.id}
			/>
		</div>
	);
}

export default PayrollProcessingPage;
