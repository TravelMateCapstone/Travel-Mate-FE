import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import 'moment/locale/vi';
moment.locale('vi');
const localizer = momentLocalizer(moment);
function CalendarManagement() {
  const [eventsData, setEventsData] = useState([]);
  useEffect(() => {
    axios.get('https://travelmateapp.azurewebsites.net/api/Tour/toursStatus/1')
      .then(response => {
        const tour = response.data.$values[0]; 
        const tourName = tour.tourName;
        const startDate = new Date(tour.startDate);
        const endDate = new Date(tour.endDate);
        const events = [];
        events.push({
          id: tour.tourId,
          title: tourName,
          allDay: true,
          start: startDate,
          end: endDate,
          resource: 'tour',
        });
        tour.itinerary.$values.forEach((day) => {
          day.activities.$values.forEach((activity, index) => {
            const activityStart = moment(`${day.date} ${activity.time}`, 'YYYY-MM-DD HH:mm').toDate();
            events.push({
              id: `${tour.tourId}_activity_${index}`,
              title: activity.description,
              allDay: false,
              start: activityStart,
              end: activityStart, 
              resource: 'activity',
            });
          });
        });
        setEventsData(events);
      })
      .catch(error => console.error("Error fetching tour data:", error));
  }, []);
  const handleSelect = ({ start, end }) => {
    const title = window.prompt("Nhập tên sự kiện mới");
    if (title) {
      setEventsData([
        ...eventsData,
        { start, end, title },
      ]);
    }
  };
  const handleEventSelect = (event) => {
    const action = window.prompt("Nhập 'sửa' để chỉnh sửa hoặc 'xóa' để xóa sự kiện", "sửa");
    if (action === "sửa") {
      const newTitle = window.prompt("Chỉnh sửa tên sự kiện", event.title);
      if (newTitle) {
        setEventsData(eventsData.map(evt => evt.id === event.id ? { ...evt, title: newTitle } : evt));
      }
    } else if (action === "xóa") {
      setEventsData(eventsData.filter(evt => evt.id !== event.id));
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
  );
}

export default CalendarManagement;
