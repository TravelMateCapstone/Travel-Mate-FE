import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import 'moment/locale/vi';
import { useSelector } from 'react-redux';
moment.locale('vi');
const localizer = momentLocalizer(moment);

function CalendarManagement() {
  const [eventsData, setEventsData] = useState([]);
  const token = useSelector((state) => state.auth.token);

  // Hàm chuẩn hóa dữ liệu lịch trình
  const parseTourDataToEvents = (tours) => {
    const events = [];
    tours.forEach((tour) => {
      const tourName = tour.tourName;
      const startDate = new Date(tour.startDate);
      const endDate = new Date(tour.endDate);
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
          const activityStart = moment(
            `${day.date.split('T')[0]} ${activity.startTime}`,
            'YYYY-MM-DD HH:mm:ss'
          ).toDate();
          const activityEnd = moment(
            `${day.date.split('T')[0]} ${activity.endTime}`,
            'YYYY-MM-DD HH:mm:ss'
          ).toDate();

          events.push({
            id: `${tour.tourId}_activity_${index}`,
            title: `${activity.title} - ${activity.description}`,
            allDay: false,
            start: activityStart,
            end: activityEnd,
            resource: 'activity',
          });
        });
      });
    });
    return events;
  };

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios
      .get('https://travelmateapp.azurewebsites.net/api/Tour/toursStatus/1', {
        headers: {
          Authorization: `${token}`,
        },
      }) // Thay URL nếu cần
      .then((response) => {
        const tours = response.data.$values; // Lấy tất cả các tour
        const events = parseTourDataToEvents(tours); // Chuẩn hóa dữ liệu
        setEventsData(events);
      })
      .catch((error) => console.error('Error fetching tour data:', error));
  }, [token]);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt('Nhập tên sự kiện mới');
    if (title) {
      setEventsData([...eventsData, { start, end, title }]);
    }
  };

  const handleEventSelect = (event) => {
    const action = window.prompt(
      "Nhập 'sửa' để chỉnh sửa hoặc 'xóa' để xóa sự kiện",
      'sửa'
    );
    if (action === 'sửa') {
      const newTitle = window.prompt('Chỉnh sửa tên sự kiện', event.title);
      if (newTitle) {
        setEventsData(
          eventsData.map((evt) =>
            evt.id === event.id ? { ...evt, title: newTitle } : evt
          )
        );
      }
    } else if (action === 'xóa') {
      setEventsData(eventsData.filter((evt) => evt.id !== event.id));
    }
  };

  return (
    <div>
      <Calendar
        views={['day', 'agenda', 'work_week', 'month']}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: '88vh' }}
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleSelect}
      />
    </div>
  );
}

export default CalendarManagement;
