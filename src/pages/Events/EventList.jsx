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
import { useSelector } from 'react-redux';

function EventList() {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [notJoinedEvents, setNotJoinedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const token = useSelector((state) => state.auth.token);

  // API URLs
  const joinedUrl = 'https://travelmateapp.azurewebsites.net/api/EventControllerWOO/user/joined';
  const notJoinedUrl = 'https://travelmateapp.azurewebsites.net/api/EventControllerWOO/user/not-joined';
  const createdUrl = 'https://travelmateapp.azurewebsites.net/api/EventControllerWOO/get-event-current-user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch joined events
        const joinedResponse = await axios.get(joinedUrl, {
          headers: { Authorization: `${token}` },
        });
        setJoinedEvents(joinedResponse.data.$values);

        // Fetch not-joined events
        const notJoinedResponse = await axios.get(notJoinedUrl, {
          headers: { Authorization: `${token}` },
        });
        setNotJoinedEvents(notJoinedResponse.data.$values);

        // Fetch created events
        const createdResponse = await axios.get(createdUrl, {
          headers: { Authorization: `${token}` },
        });
        setCreatedEvents(createdResponse.data.$values);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Determine which events to display based on the URL path
  const path = window.location.pathname;
  const eventData = path.includes('/event/joined')
    ? joinedEvents
    : path.includes('/event/created')
      ? createdEvents
      : notJoinedEvents;

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
                members={card.eventParticipants?.$values?.length || 0}
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
