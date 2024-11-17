import React, { memo, useEffect, useState } from 'react';
import EventCard from './EventCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ProposeEvent() {
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://travelmateapp.azurewebsites.net/api/EventParticipants/top-events?topCount=2');
        const data = await response.json();
        if (data && data.$values) {
          const formattedData = data.$values.map((item) => {
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              const formattedDate = `${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
              return formattedDate;
            };
            return {
              id: item.event.eventId,
              img: item.event.eventImageUrl,
              startTime: formatDate(item.event.startAt),
              endTime: formatDate(item.event.endAt),
              title: item.event.eventName,
              location: item.event.eventLocation,
              text: item.event.description,
            };
          });
          setEventData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='d-flex flex-column gap-4' style={{ padding: '0 85px' }}>
      {eventData.map((card) => (
        <EventCard
          key={card.id} // Sử dụng id làm key
          id={card.id}
          img={card.img}
          startTime={card.startTime}
          endTime={card.endTime}
          title={card.title}
          location={card.location}
          text={card.text}
        />
      ))}
    </div>
  );
}

export default memo(ProposeEvent);
