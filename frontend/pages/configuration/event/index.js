import React, { useState, useEffect } from 'react';
import { message, PageHeader } from 'antd';
import Head from 'next/head';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '@styles/configuration/event.module.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { reject } from 'lodash';
import { HRButton } from '@components/commons';
import { HolidayTransferabilityTypes, HolidayTypes } from '@utils/constants';
import EventModal from '@components/pages/configuration/event/EventModal';

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const GET_EVENTS = gql`
  {
    events: getCalendarEvents {
      id
      name
      startDate
      endDate
      holidayType
      fixed
    }
  }
`;

const CREATE_EVENT = gql`
  mutation($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertEventCalendar(id: $id, fields: $fields) {
      payload {
        id
        name
        startDate
        endDate
        fixed
        holidayType
      }
      message
      success
    }
  }
`;

function Event() {
  const [eventsList, setEventsList] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [eventModal, setEventModal] = useState(false);

  const { data, loading, refetch } = useQuery(GET_EVENTS);

  const [upsertEvent, { loading: loadingUpdateEvent }] = useMutation(CREATE_EVENT, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        message.success(data?.message ?? 'Successfully updated event calendar.');
        refetch();
      } else {
        message.error(data?.message ?? 'Failed to update event calendar.');
      }
    },
  });

  // useEffect(() => {
  //   if (Array.isArray(data?.events))
  //     setEventsList(
  //       data?.events.map((value) => {
  //         value.allDay = true;
  //         return value;
  //       }),
  //     );
  // }, [data]);

  const handleEventModal = (selectedEvent, willRefetch, removeOptions, event) => {
    let { clearPendingEvents, removeOneEvent = false, isEdit } = removeOptions || {};
    if (selectedEvent) setEvent(selectedEvent);
    if (willRefetch) refetch();
    else if (clearPendingEvents) {
      if (removeOneEvent) {
        let newEvents = reject(eventsList, (item) => item.id === event.id);
        setEventsList(newEvents);
      } else {
        setPendingEvents([]);
        if (!isEdit) {
          if (event) {
            refetch();
            setEventsList([...eventsList, event]);
          }
        }
      }
    }

    setEventModal(!eventModal);
  };

  const moveEvent = ({ event, start: startDate, end: endDate, isAllDay: droppedOnAllDaySlot }) => {
    if (event.fixed === 'FIXED')
      message.error(`${event.name} is a fixed holiday. You are not allowed to move it`);
    else {
      const events = eventsList;

      const nextEvents = events.map((existingEvent) => {
        return existingEvent.id == event.id
          ? { ...existingEvent, startDate, endDate }
          : existingEvent;
      });

      // upsert new event details
      upsertEvent({
        variables: {
          id: event.id,
          fields: { ...event, startDate, endDate },
        },
      });

      setEventsList(nextEvents);
    }
  };

  const resizeEvent = ({ event, start, end }) => {
    const events = eventsList;
    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id == event.id ? { ...existingEvent, start, end } : existingEvent;
    });

    setEventsList(nextEvents);

    //alert(`${event.title} was resized to ${start}-${end}`)
  };

  const newEvent = (event) => {
    let newEvent = {
      name: null,
      startDate: event?.start ? moment(event.start).startOf('days').utc().format() : null,
      endDate: event?.end ? moment(event.end).add(1, 'days').startOf('days').utc().format() : null,
      allDay: true,
    };

    handleEventModal(newEvent);
    setPendingEvents([...pendingEvents, newEvent]);
  };

  const onDropFromOutside = ({ start, end, allDay }) => {
    const draggedEvent = event;

    const selectedEvent = {
      id: draggedEvent.id,
      name: draggedEvent.title,
      start,
      end,
      allDay: allDay,
    };

    setEvent(null);
    moveEvent({ selectedEvent, start, end });
  };

  const handleDragStart = (event) => {
    // this.setState({ draggedEvent: event });
    if (event.fixed === 'FIXED') return false;
    setEvent(event);
  };

  const dragFromOutsideItem = () => {
    return event;
  };

  const onSelectEvent = (event) => {
    handleEventModal(event, false);
  };

  return (
    <div>
      <Head>
        <title>Holiday/Events Calendar</title>
      </Head>
      <PageHeader
        title="Holiday/Events Calendar"
        extra={[
          <HRButton
            type="primary"
            onClick={() => newEvent()}
            key="add-event"
            allowedPermissions={['manage_holiday_event']}
          >
            Add Event
          </HRButton>,
        ]}
      />
      <div style={{ height: '100vh' }}>
        <DragAndDropCalendar
          views={['month']}
          localizer={localizer}
          events={data?.events || []}
          onEventDrop={moveEvent}
          onSelectSlot={(e) => {
            // console.log('onSelectSlot');
            newEvent(e);
          }}
          onSelectEvent={onSelectEvent}
          startAccessor={(e) => (e ? moment(e?.startDate).toDate() : null)}
          endAccessor={(e) => (e ? moment(e?.endDate).toDate() : null)}
          titleAccessor="name"
          defaultView={Views.MONTH}
          popup
          components={{
            eventWrapper: CustomEventWrapperComponent,
          }}
          // dragFromOutsideItem={dragFromOutsideItem}
          // onDropFromOutside={onDropFromOutside}
          // handleDragStart={handleDragStart}
          // selectable
          // resizable
          // draggableAccessor={(e) => !(e.fixed === 'FIXED')}
          // showMultiDayTimes
        />
      </div>
      <EventModal selectedEvent={event} visible={eventModal} handleModal={handleEventModal} />
    </div>
  );
}

const CustomEventComponent = ({ accessors, ...props }) => {
  // console.log(props);
  return (
    <div style={{ cursor: 'pointer' }} className="rbc-event-content">
      {/* {props?.children} */}
      {props?.event?.name}
    </div>
  );
};
const CustomEventWrapperComponent = ({ accessors, event = {}, ...props }) => {
  let className = '';
  if (event.holidayType === HolidayTypes.REGULAR) className += ` ${styles['event-regular']}`;
  else if (event.holidayType === HolidayTypes.SPECIAL) className += ` ${styles['event-special']}`;
  else if (event.holidayType === HolidayTypes.NON_HOLIDAY)
    className += ` ${styles['event-non-holiday']}`;

  if (event.fixed === HolidayTransferabilityTypes.FIXED) className += ` ${styles['fixed']}`;

  return (
    <div>
      {React.Children.map(props.children, (child) => {
        return React.cloneElement(
          child,
          {},
          React.cloneElement(child.props.children, {
            className,
          }),
        );
      })}
    </div>
  );
};
export default Event;
