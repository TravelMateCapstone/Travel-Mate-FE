import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import MonthlySpendingChart from '../../components/Local/MonthlySpendingChart';
import TourChart from '../../components/Local/TourChart';
import TourPieChart from '../../components/Local/TourPieChart';

function LocalIncomeStatistics() {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const [transactions, setTransactions] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTours();
  }, [user]);

  
  // Lấy dữ liệu từ API
  useEffect(() => {
    setEventsData(tours);
  }, [token]);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt('Nhập tên sự kiện mới');
    if (title) {
      setEventsData([...eventsData, { start, end, title }]);
    }
  };

  const fetchTours = async () => {
    try {
      const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/toursStatus/1`, {
        headers: { 'Authorization': `${token}` }
      });
      setTours(response.data.$values);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

    const [eventsData, setEventsData] = useState([]);
  
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
  

  return (
    <div>
      <h2>Thống kê</h2>
      
      <Row>
        <Col lg={6}>
          <TourChart tours={tours} token={token} />
        </Col>
        <Col lg={6}>
          <TourPieChart tours={tours} />
        </Col>
      </Row>
    </div>
  );
}

export default LocalIncomeStatistics;
