import { AccountContext } from '@components/accessControl/AccountContext';
import { HRButton, HRDivider, HRList, HRListItem } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import {
  employeeRequestApprovalStatusColorGenerator,
  employeeRequestApprovalStatusFormatter,
  employeeRequestDatesTypeFormatter,
  employeeRequestStatusColorGenerator,
  employeeRequestStatusFormatter,
} from '@utils/constantFormatters';
import { employeeRequestApprovalStatus, employeeRequestStatus } from '@utils/constants';
import { Avatar, Badge, Col, Comment, List, Row, Tabs, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import React, { useContext } from 'react';
import LeaveRequestDateRenderer from './LeaveRequestDateRenderer';
import Link from 'next/link';

const { TabPane } = Tabs;

const LeaveItem = (props) => {
  const account = useContext(AccountContext);
  const { forApproval, actions, item, compact } = props;

  if (compact)
    return (
      <HRListItem actions={actions}>
        <Link href={`/mine/approvals/${item?.id}`}>
          <List.Item.Meta
            style={{ cursor: 'pointer' }}
            avatar={
              <Avatar size="large" style={{ backgroundColor: '#3498db' }}>
                {item?.requestedBy?.firstName && item?.requestedBy?.firstName[0]}
                {item?.requestedBy?.lastName && item?.requestedBy?.lastName[0]}
              </Avatar>
            }
            title={
              <>
                <div>
                  <Typography.Title strong level={4} style={{ margin: 0 }}>
                    {item?.requestedBy?.fullName}
                    <Typography.Text
                      style={{ fontStyle: 'italic', fontSize: 16, marginLeft: 10, opacity: 0.7 }}
                    >
                      {item?.department?.description}
                    </Typography.Text>
                  </Typography.Title>
                  {item?.requestedDate && (
                    <Typography.Text style={{ fontStyle: 'italic', fontSize: 16 }}>
                      <MomentFormatter value={item?.requestedDate} />
                    </Typography.Text>
                  )}
                </div>
              </>
            }
            description={[
              <Tag key="request-status" color={employeeRequestStatusColorGenerator(item?.status)}>
                {employeeRequestStatusFormatter(item?.status)}
              </Tag>,
              <Tag key="date-type" color="blue">
                {employeeRequestDatesTypeFormatter(item?.datesType)}
              </Tag>,
              <Tag key="with-pay" color="blue">{`${item?.withPay ? 'With' : 'Without'} Pay`}</Tag>,
            ]}
          />
        </Link>
      </HRListItem>
    );

  return (
    <HRListItem actions={actions}>
      <List.Item.Meta
        avatar={
          <Avatar size="large" style={{ backgroundColor: '#3498db' }}>
            {item?.requestedBy?.firstName && item?.requestedBy?.firstName[0]}
            {item?.requestedBy?.lastName && item?.requestedBy?.lastName[0]}
          </Avatar>
        }
        title={
          <>
            <div>
              <Typography.Title strong level={4} style={{ margin: 0 }}>
                {item?.requestedBy?.fullName}
              </Typography.Title>
              <Typography.Text style={{ fontStyle: 'italic', fontSize: 16 }}>
                {item?.department?.description}
              </Typography.Text>
              <br />
              {item?.requestedDate && (
                <Typography.Text style={{ fontStyle: 'italic', fontSize: 16 }}>
                  <MomentFormatter value={item?.requestedDate} />
                </Typography.Text>
              )}
            </div>
          </>
        }
        description={
          <>
            <Tag color={employeeRequestStatusColorGenerator(item?.status)}>
              {employeeRequestStatusFormatter(item?.status)}
            </Tag>
            <Tag color="blue">{employeeRequestDatesTypeFormatter(item?.datesType)}</Tag>
            <Tag color="blue">{`${item?.withPay ? 'With' : 'Without'} Pay`}</Tag>
          </>
        }
      />
      <HRDivider>Details</HRDivider>
      <Row gutter={[24, 24]}>
        <Col
          xxl={item?.status !== employeeRequestStatus.DRAFT ? 12 : 24}
          xl={item?.status !== employeeRequestStatus.DRAFT ? 12 : 24}
          lg={24}
          md={24}
        >
          <div>
            <Typography.Text strong>Reason</Typography.Text>
          </div>
          <div>
            <Typography.Text style={{ textAlign: 'justify' }}>{item?.reason}</Typography.Text>
          </div>
        </Col>
        {item?.status !== employeeRequestStatus.DRAFT && (
          <Col xxl={12} xl={12} lg={24} md={24}>
            <div>
              <Typography.Text strong>Remarks</Typography.Text>
            </div>
            <div>
              <Typography.Text style={{ textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
                {item?.remarks}
              </Typography.Text>
            </div>
          </Col>
        )}
      </Row>
      {item?.status !== employeeRequestStatus.DRAFT && <HRDivider />}
      <Row gutter={[24, 24]}>
        {item?.status !== employeeRequestStatus.DRAFT && (
          <>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
              <div>
                <Typography.Text strong>
                  HR
                  {item?.status === employeeRequestStatus.REJECTED ? ` Rejected ` : ` Approved `}
                  By
                </Typography.Text>
              </div>
              <div>
                {item?.hrApprovedBy ? (
                  <Typography.Text>{item?.hrApprovedBy?.fullName}</Typography.Text>
                ) : (
                  'N/A'
                )}
              </div>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
              <div>
                <Typography.Text strong>
                  HR
                  {item?.status === employeeRequestStatus.REJECTED ? ` Rejected ` : ` Approved `}
                  Date
                </Typography.Text>
              </div>
              <div>
                {item?.hrApprovedDate ? <MomentFormatter value={item?.hrApprovedDate} /> : 'N/A'}
              </div>
            </Col>
          </>
        )}
        {item?.status === employeeRequestStatus.REVERTED && (
          <>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
              <div>
                <Typography.Text strong>Reverted By</Typography.Text>
              </div>
              <div>
                {item?.revertedBy ? (
                  <Typography.Text>{item?.revertedBy?.fullName}</Typography.Text>
                ) : (
                  'N/A'
                )}
              </div>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={12} sm={24}>
              <div>
                <Typography.Text strong>Revert Date</Typography.Text>
              </div>
              <div>
                {item?.revertedDate ? <MomentFormatter value={item?.revertedDate} /> : 'N/A'}
              </div>
            </Col>
          </>
        )}
      </Row>
      <HRDivider>More Details</HRDivider>
      <Tabs defaultActiveKey="dates">
        <TabPane tab="Dates" key="dates">
          <LeaveRequestDateRenderer type={item?.datesType} dates={item?.dates} />
        </TabPane>
        <TabPane
          tab={
            <Badge
              count={item?.status === employeeRequestStatus.DRAFT ? 0 : forApproval}
              style={{ marginLeft: 5 }}
              offset={[10, 0]}
            >
              <Typography.Text>Approvals</Typography.Text>
            </Badge>
          }
          key="approvals"
        >
          <Row>
            <Col span={24}>
              <HRList
                itemLayout="horizontal"
                className="comment-list"
                dataSource={item?.approvals}
                bordered={false}
                renderItem={(approval) => {
                  let actions = [];
                  if (
                    approval.status === employeeRequestApprovalStatus.PENDING &&
                    account?.data?.id === approval?.employee?.id
                  ) {
                    if (!props.isUser || props.isApprover) {
                      actions = actions.concat(
                        <HRButton
                          type="ghost"
                          danger
                          key="decline-button"
                          onClick={() => props?.onRejectSupervisor(item?.id, approval?.id)}
                        >
                          Reject
                        </HRButton>,
                        <HRButton
                          type="primary"
                          key="accept-button"
                          onClick={() => props?.onApproveSupervisor(item?.id, approval?.id)}
                        >
                          Approve
                        </HRButton>,
                      );
                    }
                  }
                  return (
                    <>
                      <HRListItem actions={actions} style={{ padding: 0 }}>
                        <Comment
                          author={
                            <Typography.Text style={{ fontSize: 14 }}>
                              {approval?.employee?.fullName}
                            </Typography.Text>
                          }
                          avatar={
                            <Avatar
                              alt="employee-approve"
                              size="large"
                              style={{ backgroundColor: '#3498db' }}
                            >
                              {approval.employee.firstName && approval.employee.firstName[0]}
                              {approval.employee.lastName && approval.employee.lastName[0]}
                            </Avatar>
                          }
                          content={
                            <div>
                              {item?.status !== employeeRequestStatus.DRAFT && (
                                <div style={{ marginBottom: 10 }}>
                                  <Tag
                                    color={employeeRequestApprovalStatusColorGenerator(
                                      approval.status,
                                    )}
                                  >
                                    {employeeRequestApprovalStatusFormatter(approval.status)}
                                  </Tag>
                                </div>
                              )}
                              {approval.remarks ?? 'N/A'}
                            </div>
                          }
                          datetime={
                            approval?.approvedDate && (
                              <Tooltip
                                title={moment(approval?.approvedDate).format(
                                  'ddd, MMMM D, YYYY, h:mm A',
                                )}
                              >
                                <span>{moment(approval?.approvedDate).fromNow()}</span>
                              </Tooltip>
                            )
                          }
                        />
                      </HRListItem>
                    </>
                  );
                }}
              />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </HRListItem>
  );
};

export default LeaveItem;
