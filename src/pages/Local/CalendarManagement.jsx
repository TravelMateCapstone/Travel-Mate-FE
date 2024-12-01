import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

function CalendarManagement() {
  const now = new Date();
  const [eventsData, setEventsData] = useState([
    {
      id: 0,
      title: "All Day Event very long title",
      allDay: true,
      start: new Date(2015, 3, 0),
      end: new Date(2015, 3, 1)
    },
    {
      id: 1,
      title: "Long Event",
      start: now,
      end: now
    },
  ]);

  const handleSelect = ({ start, end }) => {
    console.log(start);
    console.log(end);
    const title = window.prompt("New Event name");
    if (title)
      setEventsData([
        ...eventsData,
        {
          start,
          end,
          title
        }
      ]);
  };

  const handleEventEdit = (event) => {
    const newTitle = window.prompt("Edit Event name", event.title);
    if (newTitle) {
      setEventsData(eventsData.map(evt => evt.id === event.id ? { ...evt, title: newTitle } : evt));
    }
  };

  const handleEventDelete = (event) => {
    if (window.confirm(`Are you sure you want to delete the event '${event.title}'?`)) {
      setEventsData(eventsData.filter(evt => evt.id !== event.id));
    }
  };

  const handleEventSelect = (event) => {
    const action = window.prompt("Enter 'edit' to edit or 'delete' to delete the event", "edit");
    if (action === "edit") {
      handleEventEdit(event);
    } else if (action === "delete") {
      handleEventDelete(event);
    }
  };

  return (
    <div>
       <Calendar
        views={["day", "agenda", "work_week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "88vh" }}
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleSelect}
      />
    </div>
  )
}

export default CalendarManagement