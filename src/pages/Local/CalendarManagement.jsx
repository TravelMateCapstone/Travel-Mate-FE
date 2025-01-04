import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import 'moment/locale/vi'; // Import ngôn ngữ tiếng Việt
import { useSelector } from 'react-redux';
import 'date-fns/locale/pt-BR';

// Cập nhật locale cho tiếng Việt
moment.locale('vi');
moment.updateLocale('vi', {
  week: {
    dow: 1, 
    doy: 4, 
  },
  
});
const localizer = momentLocalizer(moment);



const messages = {
  allDay: 'Cả ngày',
  previous: 'Trước',
  next: 'Tiếp',
  today: 'Hôm nay',
  month: 'Tháng',
  week: 'Tuần',
  day: 'Ngày',
  agenda: 'Lịch trình',
  date: 'Ngày',
  time: 'Thời gian',
  event: 'Sự kiện',
  noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này.',
  showMore: (count) => `+ xem thêm (${count})`,
};

function CalendarManagement() {
  const [eventsData, setEventsData] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const parseTourDataToEvents = (tours) => {
    const events = [];
    tours.forEach((tour) => {
      const tourName = tour.tourName;
      const startDate = moment(tour.startDate).toDate();
      const endDate = moment(tour.endDate).toDate();
      events.push({
        id: tour.tourId,
        title: tourName,
        allDay: true,
        start: startDate,
        end: endDate,
        resource: 'tour',
      });

      tour.itinerary?.$values.forEach((day) => {
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
      })
      .then((response) => {
        const tours = response.data.$values;
        const events = parseTourDataToEvents(tours);
        setEventsData(events);
      })
      .catch((error) => console.error('Lỗi khi lấy dữ liệu tour:', error));
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
        messages={messages} // Thông báo tiếng Việt
        localizer={localizer} // Cài đặt localizer
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: '88vh', width: '1670px' }}
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleSelect}
        culture="vi"
      />
    </div>
  );
}

export default CalendarManagement;
