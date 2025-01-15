import { Tabs, Tab, } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchTourByStatus } from '../../apis/local_trip_history';
import TourCard from '../../components/ProfileManagement/TourCard';
import CreateTour from '../../components/ProfileManagement/CreateTour';

function LocalTripHistory() {
  const [pendingTours, setPendingTours] = useState([]);
  const [approvedTours, setApprovedTours] = useState([]);
  const [rejectedTours, setRejectedTours] = useState([]);
  const [activeKey, setActiveKey] = useState('pending');
  const token = useSelector((state) => state.auth.token);

  const fetchData = async () => {
    const pending = await fetchTourByStatus(0);
    setPendingTours(pending);
    const approved = await fetchTourByStatus(1);
    setApprovedTours(approved);
    const rejected = await fetchTourByStatus(2);
    setRejectedTours(rejected);
  };

  useEffect(() => {
    fetchData();
  }, [token, activeKey]);

  return (
    <div >
      <h1>Quản lý chuyến đi</h1>
      <CreateTour onTourCreated={fetchData} />
      <div className=''>
        <Tabs 
          activeKey={activeKey} 
          onSelect={(k) => setActiveKey(k)} 
          id="local-trip-history-tabs" 
          className='no-border-radius'
        >
          <Tab eventKey="pending" title="Đang chờ duyệt">
            {pendingTours.map(tour => (
              <TourCard key={tour.tourId} tour={tour} onTourDeleted={fetchData} />
            ))}
          </Tab>
          <Tab eventKey="approved" title="Đã Được Duyệt">
            {approvedTours.map(tour => (
              <TourCard key={tour.tourId} tour={tour} onTourDeleted={fetchData} />
            ))}
          </Tab>
          <Tab eventKey="rejected" title="Đã Từ Chối">
            {rejectedTours.map(tour => (
              <TourCard key={tour.tourId} tour={tour} onTourDeleted={fetchData} />
            ))}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default LocalTripHistory;