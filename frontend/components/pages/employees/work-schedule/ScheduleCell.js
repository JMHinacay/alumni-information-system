import React, { useContext } from 'react';
import moment from 'moment';

import { Dropdown, Menu, message, Typography } from 'antd';
import { FaBed, FaRegCalendarCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdAvTimer } from 'react-icons/md';

import { REST_DAY_SCHEDULE_LABEL } from '@utils/constants';
import { hasPermission } from '@utils/accessFunctions';
import useHasPermission from '@hooks/useHasPermission';

import { AccountContext } from '@components/accessControl/AccountContext';
import MomentDifferenceFormatter from '@components/utils/MomentDifferenceFormatter';

const ScheduleCell = ({
  employeeSchedule = {},
  employeeRecord = {},
  date,
  cellKey,
  onClickSchedule,
  handleSelectCell,
  isLocked,
  ...props
}) => {
  const accountContext = useContext(AccountContext);
  const allowManageRestDay = useHasPermission(['manage_rest_day_work_schedule']);
  const allowManageOIC = useHasPermission(['manage_oic_work_schedule']);
  const allowManageCustom = useHasPermission(['add_custom_work_schedule']);
  const allowManageRestDayDayDuty = useHasPermission([
    'allow_user_to_manage_rest_day_duty_schedule',
  ]);

  const onClickOIC = (record, date, isCustom, isOIC) => {
    let dateFormat = moment(date).format('MM_DD_YYYY');
    let regularSchedule = employeeSchedule[dateFormat];
    if (regularSchedule?.isRestDay || regularSchedule?.label === REST_DAY_SCHEDULE_LABEL)
      message.error('You are not allowed to add OIC Schedule with Rest Schedule.');
    else if (!regularSchedule)
      message.error('Must have regular schedule before adding OIC Schedule.');
    else handleSelectCell(record, date, false, isOIC);
  };

  const onClickRestDay = (date, schedule, record, scheduleKey) => {
    let dateFormat = moment(date).format('MM_DD_YYYY');
    let oicSchedule = employeeSchedule[`${dateFormat}_OIC`];
    let leaveSchedule = employeeSchedule[`${dateFormat}_LEAVE`];
    let leaveRestSchedule = employeeSchedule[`${dateFormat}_LEAVE_REST`];
    if (oicSchedule) message.error('You are not allowed to add Rest Schedule with OIC Schedule.');
    if (leaveSchedule || leaveRestSchedule)
      message.error('You are not allowed to add Rest Schedule with Leave Schedule.');
    else onClickSchedule(date, schedule, record, scheduleKey);
  };

  const renderIcons = () => {
    let mockIcons = [];

    if (employeeSchedule[`${cellKey}_OIC`]) mockIcons = mockIcons.concat('person');
    if (employeeSchedule[`${cellKey}_LEAVE`] && employeeSchedule[`${cellKey}`])
      mockIcons = mockIcons.concat('leave');
    if (employeeSchedule[`${cellKey}_OVERTIME_OIC`]) {
      mockIcons = mockIcons.concat('person');
      mockIcons = mockIcons.concat('overtime');
    }
    if (employeeSchedule[`${cellKey}_OVERTIME`]) mockIcons = mockIcons.concat('overtime');
    if (
      (employeeSchedule[`${cellKey}`]?.isRestDay &&
        employeeSchedule[`${cellKey}`]?.label !== REST_DAY_SCHEDULE_LABEL) ||
      (employeeSchedule[`${cellKey}_LEAVE_REST`]?.isRestDay &&
        employeeSchedule[`${cellKey}_LEAVE_REST`]?.label !== REST_DAY_SCHEDULE_LABEL)
    )
      mockIcons = mockIcons.concat('rest');

    let oicHoliday = employeeSchedule[`${cellKey}_OIC`]?.withHoliday ?? true;
    let overtimeOICHoliday = employeeSchedule[`${cellKey}_OVERTIME_OIC`]?.withHoliday ?? true;
    let overtimeHoliday = employeeSchedule[`${cellKey}_OVERTIME`] ?? true;
    let holiday = employeeSchedule[`${cellKey}`]?.withHoliday ?? true;

    if (!oicHoliday || !overtimeOICHoliday || !overtimeHoliday || !holiday)
      mockIcons = mockIcons.concat('no-holiday');

    var uniqueIcons = mockIcons
      .filter((value, i, arr) => arr.indexOf(value) === i)
      .map((icon, i) => {
        if (icon === 'person')
          return <BsFillPersonFill style={{ fontSize: 18, marginLeft: i > 0 && 1 }} key="oic" />;
        else if (icon === 'overtime')
          return <MdAvTimer style={{ fontSize: 18, marginleft: i > 0 && 1 }} key="overtime" />;
        else if (icon === 'rest')
          return <FaBed style={{ fontSize: 18, marginLeft: i > 0 && 1 }} key="rest" />;
        else if (icon === 'no-holiday')
          return (
            <FaRegCalendarTimes style={{ fontSize: 18, marginLeft: i > 0 && 1 }} key="no-holiday" />
          );
        else if (icon === 'leave')
          return (
            <FaRegCalendarCheck style={{ fontSize: 18, marginLeft: i > 0 && 1 }} key="leave" />
          );
      });

    return uniqueIcons;
  };

  const { schedule = [], ...record } = employeeRecord;

  const isAllowed = hasPermission(['manage_work_schedule'], accountContext?.data?.user?.access);
  const hrPermissioned = hasPermission(
    ['manage_locked_work_schedule'],
    accountContext?.data?.user?.access,
  );

  let icons = renderIcons();
  if (employeeSchedule[`${cellKey}_LEAVE`]) {
    const currentSchedule = employeeSchedule[`${cellKey}_LEAVE`];
    const regularSchedule = employeeSchedule[`${cellKey}`];
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={(isAllowed && !isLocked) || hrPermissioned ? ['contextMenu'] : []}
        overlay={
          <Menu>
            {schedule.map((item, i) => {
              return (
                <React.Fragment key={item?.id}>
                  <Menu.Item
                    key={item?.id}
                    style={{ textAlign: 'center' }}
                    onClick={() => onClickSchedule(date, item, record, cellKey)}
                  >
                    {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                  </Menu.Item>
                  {i === schedule.length - 1 && <Menu.Divider />}
                </React.Fragment>
              );
            })}
            {allowManageCustom && (
              <Menu.Item
                key={'CUSTOM'}
                style={{ textAlign: 'center' }}
                onClick={() => handleSelectCell(record, date, true)}
              >
                Custom
              </Menu.Item>
            )}
            {allowManageOIC && (
              <Menu.Item
                key={'OIC'}
                style={{ textAlign: 'center' }}
                onClick={() => onClickOIC(record, date, false, true)}
              >
                OIC
              </Menu.Item>
            )}
            {allowManageRestDay && (
              <Menu.Item
                key={'REST_DAY'}
                style={{ textAlign: 'center' }}
                onClick={() => onClickRestDay(date, 'REST_DAY', record, cellKey)}
              >
                Rest Day
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <div
          style={{
            textAlign: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 1.2,
            position: icons.length > 0 ? 'relative' : 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '8px 0',
          }}
          onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
        >
          {icons.length > 0 && <div>{icons}</div>}
          <Typography.Text strong={!currentSchedule.isRestDay}>
            {!regularSchedule && currentSchedule?.label}
            {regularSchedule && regularSchedule?.label}
          </Typography.Text>
          {!regularSchedule && !currentSchedule.isRestDay && (
            <div>
              <MomentDifferenceFormatter
                secondDate={currentSchedule.dateTimeStartRaw}
                firstDate={currentSchedule.dateTimeEndRaw}
              />{' '}
              hours
            </div>
          )}
          {currentSchedule.isRestDay && (
            <>
              <div>
                {currentSchedule?.timeStart}-{currentSchedule?.timeEnd}
              </div>
            </>
          )}
          {regularSchedule && (
            <div>
              {regularSchedule?.timeStart}-{regularSchedule?.timeEnd}
            </div>
          )}
        </div>
      </Dropdown>
    );
  } else if (employeeSchedule[`${cellKey}_LEAVE_REST`]) {
    const currentSchedule = employeeSchedule[`${cellKey}_LEAVE_REST`];
    if (employeeSchedule[cellKey]) {
      return (
        <Dropdown
          placement="bottomCenter"
          trigger={(isAllowed && !isLocked) || hrPermissioned ? ['contextMenu'] : []}
          overlay={
            <Menu>
              {schedule.map((item, i) => {
                return (
                  <React.Fragment key={item?.id}>
                    <Menu.Item
                      key={item?.id}
                      style={{ textAlign: 'center' }}
                      onClick={() => onClickSchedule(date, item, record, cellKey)}
                    >
                      {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                    </Menu.Item>
                    {i === schedule.length - 1 && <Menu.Divider />}
                  </React.Fragment>
                );
              })}
              {allowManageCustom && (
                <Menu.Item
                  key={'CUSTOM'}
                  style={{ textAlign: 'center' }}
                  onClick={() => handleSelectCell(record, date, true)}
                >
                  Custom
                </Menu.Item>
              )}
              {allowManageOIC && (
                <Menu.Item
                  key={'OIC'}
                  style={{ textAlign: 'center' }}
                  onClick={() => onClickOIC(record, date, false, true)}
                >
                  OIC
                </Menu.Item>
              )}
              {allowManageRestDay && (
                <Menu.Item
                  key={'REST_DAY'}
                  style={{ textAlign: 'center' }}
                  onClick={() => onClickRestDay(date, 'REST_DAY', record, cellKey)}
                >
                  Rest Day
                </Menu.Item>
              )}
            </Menu>
          }
        >
          <div
            style={{
              textAlign: 'center',
              padding: 0,
              margin: 0,
              lineHeight: 1.2,
              position: icons.length > 0 ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: '8px 0',
            }}
            onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
          >
            {icons.length > 0 && <div>{icons}</div>}
            <Typography.Text strong>
              {!employeeSchedule[cellKey]?.isCustom && employeeSchedule[cellKey]?.label}
            </Typography.Text>
            {employeeSchedule[cellKey]?.isCustom &&
              employeeSchedule[cellKey]?.isMultiDay &&
              `${moment(employeeSchedule[cellKey]?.dateTimeStartRaw).format('MM/DD')} — ${moment(
                employeeSchedule[cellKey]?.dateTimeEndRaw,
              ).format('MM/DD')}`}
            {/* </span> */}
            {employeeSchedule[cellKey] && (
              <>
                <div>
                  {employeeSchedule[cellKey]?.timeStart}-{employeeSchedule[cellKey]?.timeEnd}
                </div>
              </>
            )}
          </div>
        </Dropdown>
      );
    }
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={(isAllowed && !isLocked) || hrPermissioned ? ['contextMenu'] : []}
        overlay={
          <Menu>
            {schedule.map((item, i) => {
              return (
                <React.Fragment key={item?.id}>
                  <Menu.Item
                    key={item?.id}
                    style={{ textAlign: 'center' }}
                    onClick={() => onClickSchedule(date, item, record, cellKey)}
                  >
                    {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                  </Menu.Item>
                  {i === schedule.length - 1 && <Menu.Divider />}
                </React.Fragment>
              );
            })}
            {allowManageCustom && (
              <Menu.Item
                key={'CUSTOM'}
                style={{ textAlign: 'center' }}
                onClick={() => handleSelectCell(record, date, true)}
              >
                Custom
              </Menu.Item>
            )}
            {allowManageOIC && (
              <Menu.Item
                key={'OIC'}
                style={{ textAlign: 'center' }}
                onClick={() => onClickOIC(record, date, false, true)}
              >
                OIC
              </Menu.Item>
            )}
            {allowManageRestDay && (
              <Menu.Item
                key={'REST_DAY'}
                style={{ textAlign: 'center' }}
                onClick={() => onClickRestDay(date, 'REST_DAY', record, cellKey)}
              >
                Rest Day
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <div
          style={{
            textAlign: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 1.2,
            position: icons.length > 0 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '8px 0',
          }}
          onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
        >
          <Typography.Text strong={!currentSchedule.isRestDay}>
            {currentSchedule?.label}
          </Typography.Text>
          {!currentSchedule.isRestDay && (
            <div>
              <MomentDifferenceFormatter
                secondDate={currentSchedule.dateTimeStartRaw}
                firstDate={currentSchedule.dateTimeEndRaw}
              />{' '}
              hours
            </div>
          )}
          {currentSchedule.isRestDay && (
            <>
              <div>
                {currentSchedule?.timeStart}-{currentSchedule?.timeEnd}
              </div>
            </>
          )}
        </div>
      </Dropdown>
    );
  } else if (employeeSchedule[cellKey])
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={(isAllowed && !isLocked) || hrPermissioned ? ['contextMenu'] : []}
        overlay={
          <Menu>
            {(allowManageRestDayDayDuty === employeeSchedule[cellKey]?.isRestDay ||
              !employeeSchedule[cellKey]?.isRestDay) && (
              <>
                {schedule.map((item, i) => {
                  return (
                    <>
                      <React.Fragment key={item?.id}>
                        <Menu.Item
                          key={item?.id}
                          style={{ textAlign: 'center' }}
                          onClick={() => onClickSchedule(date, item, record, cellKey)}
                        >
                          {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                        </Menu.Item>

                        {i === schedule.length - 1 && <Menu.Divider />}
                      </React.Fragment>
                    </>
                  );
                })}
              </>
            )}
            {allowManageCustom && (
              <Menu.Item
                key={'CUSTOM'}
                style={{ textAlign: 'center' }}
                onClick={() => handleSelectCell(record, date, true)}
              >
                Custom
              </Menu.Item>
            )}
            {allowManageOIC && (
              <Menu.Item
                key={'OIC'}
                style={{ textAlign: 'center' }}
                onClick={() => onClickOIC(record, date, false, true)}
              >
                OIC
              </Menu.Item>
            )}
            {(allowManageRestDayDayDuty || employeeSchedule[cellKey]?.isRestDay) && (
              <>
                {allowManageRestDay && (
                  <Menu.Item
                    key={'REST_DAY'}
                    style={{ textAlign: 'center' }}
                    onClick={() => onClickRestDay(date, 'REST_DAY', record, cellKey)}
                  >
                    Rest Day
                  </Menu.Item>
                )}
              </>
            )}
          </Menu>
        }
      >
        <div
          style={{
            textAlign: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 1.2,
            position: icons.length > 0 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '8px 0',
          }}
          onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
        >
          {icons.length > 0 && <div>{icons}</div>}
          <Typography.Text strong>
            {!employeeSchedule[cellKey]?.isCustom && employeeSchedule[cellKey]?.label}
          </Typography.Text>
          {employeeSchedule[cellKey]?.isCustom &&
            employeeSchedule[cellKey]?.isMultiDay &&
            `${moment(employeeSchedule[cellKey]?.dateTimeStartRaw).format('MM/DD')} — ${moment(
              employeeSchedule[cellKey]?.dateTimeEndRaw,
            ).format('MM/DD')}`}
          {employeeSchedule[cellKey] && (
            <>
              <div>
                {employeeSchedule[cellKey]?.timeStart}-{employeeSchedule[cellKey]?.timeEnd}
              </div>
            </>
          )}
        </div>
      </Dropdown>
    );
  else
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={(isAllowed && !isLocked) || hrPermissioned ? ['contextMenu'] : []}
        overlay={
          <Menu>
            {schedule.map((item, i) => {
              return (
                <React.Fragment key={item?.id}>
                  <Menu.Item
                    key={item?.id}
                    style={{ textAlign: 'center' }}
                    onClick={() => onClickSchedule(date, item, record, cellKey)}
                  >
                    {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                  </Menu.Item>
                  {i === schedule.length - 1 && <Menu.Divider />}
                </React.Fragment>
              );
            })}
            {allowManageCustom && (
              <Menu.Item
                key={'CUSTOM'}
                style={{ textAlign: 'center' }}
                onClick={() => handleSelectCell(record, date, true)}
              >
                Custom
              </Menu.Item>
            )}
            {allowManageOIC && (
              <Menu.Item
                key={'OIC'}
                style={{ textAlign: 'center' }}
                onClick={() => onClickOIC(record, date, false, true)}
              >
                OIC
              </Menu.Item>
            )}
            {allowManageRestDay && (
              <Menu.Item
                key={'REST_DAY'}
                style={{ textAlign: 'center' }}
                onClick={() => onClickSchedule(date, 'REST_DAY', record, cellKey)}
              >
                Rest Day
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            position: 'relative',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: '8px 0',
          }}
          onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!employeeSchedule[cellKey]?.isCustom ? employeeSchedule[cellKey]?.label : 'N/A'}
            {employeeSchedule[`${cellKey}_OVERTIME`]?.length > 0 && (
              <MdAvTimer style={{ fontSize: 18 }} />
            )}
          </div>
          {employeeSchedule[cellKey] && (
            <div>
              {employeeSchedule[cellKey]?.timeStart}-{employeeSchedule[cellKey]?.timeEnd}
            </div>
          )}
        </div>
      </Dropdown>
    );
};

export default ScheduleCell;
