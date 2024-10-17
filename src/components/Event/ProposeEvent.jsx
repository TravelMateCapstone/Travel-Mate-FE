import React, { memo } from 'react'
import EventCard from './EventCard'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function ProposeEvent() {
  const eventData = [
    {
      title: "Surfing Club Surfing Club Surfing Club",
      location: "Da Nang, Viet Nam",
      membersCount: 35,
      time: "10:00 AM - 2:00 PM",
      member: 35,
      description: "Our expert instructors and fun community will help you improve your skills and enjoy the ocean.",
      imageURL: "https://toquoc.mediacdn.vn/280518851207290880/2024/1/7/dsdgtdy-1704616308047440689926.jpg"
    },
    {
      title: "Yoga Retreat Surfing Club Club",
      location: "Hoi An, Viet Nam",
      membersCount: 20,
      time: "8:00 AM - 12:00 PM",
      member: 20,
      description: "Find your balance and peace with our rejuvenating yoga retreat program.",
      imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHoMev2VPeG81wrzcm0l7YanrC8N8rkApsCQ&s"
    },
  ];
  return (
    <div className='d-flex flex-column gap-4'>
      {eventData.map((card) => (
        <EventCard
          img={card.imageURL}
          time={card.time}
          title={card.title}
          location={card.location}
          members={card.member}
          text={card.description}
        />
      ))}
    </div>
  )
}

export default memo(ProposeEvent);