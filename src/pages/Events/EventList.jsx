import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EventCard from '../../components/Event/EventCard';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../assets/css/Shared/Pagination.css';
import '../../assets/css/Events/Event.css';

function EventList() {
  const [eventData, setEventData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const url = `${import.meta.env.VITE_BASE_API_URL}/api/EventControllerWOO/`;

  useEffect(() => {
    const fetchEvents = async () => {
      const localData = localStorage.getItem('eventData');
      if (localData) {
        setEventData(JSON.parse(localData));
        setLoading(false);
      } else {
        try {
          const response = await axios.get(url);
          const fetchedData = response.data.$values;
          setEventData(fetchedData);
          localStorage.setItem('eventData', JSON.stringify(fetchedData));
        } catch (error) {
          console.error("Error fetching event data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEvents();
  }, [url]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString('vi-VN')}`;
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = eventData.slice(offset, offset + itemsPerPage);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
      <Row className='p-0 m-0'>
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
            <Col lg={4} md={6} sm={6} xs={12} key={index} className="mb-4 d-flex justify-content-center">
              <EventCard loading={true} />
            </Col>
          ))
          : currentItems.map((card) => (
            <Col lg={4} md={6} sm={6} xs={12} key={card.eventId} className="mb-4 d-flex justify-content-center">
              <EventCard
                loading={false}
                id={card.eventId}
                img={card.eventImageUrl}
                startTime={formatDateTime(card.startAt)}
                endTime={formatDateTime(card.endAt)}
                title={card.eventName}
                location={card.eventLocation}
                members={card.eventParticipants.$values.length}
                text={card.description}
              />
            </Col>
          ))
        }

      </Row>

      {!loading && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={Math.ceil(eventData.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active-pagination'}
          previousClassName={'previous'}
          nextClassName={'next'}
        />
      )}
    </div>
  );
}

export default EventList;
