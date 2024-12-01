import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

// Import Vietnamese locale
import 'moment/locale/vi';

// Set moment locale to Vietnamese
moment.locale('vi');

// Initialize localizer with Vietnamese locale
const localizer = momentLocalizer(moment);

function CalendarManagement() {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ API
    axios.get('https://travelmateapp.azurewebsites.net/api/Tour/toursStatus/1')
      .then(response => {
        const tour = response.data.$values[0]; // Giả sử lấy tour đầu tiên trong dữ liệu
        const tourName = tour.tourName;
        const startDate = new Date(tour.startDate);
        const endDate = new Date(tour.endDate);

        const events = [];

        // Thêm sự kiện cho tên tour trải dài qua các ngày
        events.push({
          id: tour.tourId,
          title: tourName,
          allDay: true,
          start: startDate,
          end: endDate,
          resource: 'tour',
        });

        // Thêm các sự kiện cho từng hoạt động của tour
        tour.itinerary.$values.forEach((day) => {
          day.activities.$values.forEach((activity, index) => {
            const activityStart = moment(`${day.date} ${activity.time}`, 'YYYY-MM-DD HH:mm').toDate();
            events.push({
              id: `${tour.tourId}_activity_${index}`,
              title: activity.description,
              allDay: false,
              start: activityStart,
              end: activityStart, // Giả sử mỗi hoạt động chỉ có một thời gian duy nhất
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
