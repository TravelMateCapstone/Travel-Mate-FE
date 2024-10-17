import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EventCard from '../../components/Event/EventCard';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Shared/Pagination.css';
import '../../assets/css/Events/Event.css'

function EventList() {

  const eventData = [
    {
      id: 1,
      title: "Surfing Club Surfing ClubSurfing Club",
      location: "Da Nang, Viet Nam",
      membersCount: 35,
      time: "10:00 AM - 2:00 PM",
      member: 35,
      description: "Our expert instructors and fun community will help you improve your skills and enjoy the ocean.",
      imageURL: "https://toquoc.mediacdn.vn/280518851207290880/2024/1/7/dsdgtdy-1704616308047440689926.jpg"
    },
    {
      id: 2,
      title: "Yoga Retreat Retreat Retreat",
      location: "Hoi An, Viet Nam",
      membersCount: 20,
      time: "8:00 AM - 12:00 PM",
      member: 20,
      description: "Find your balance and peace with our rejuvenating yoga retreat program.",
      imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHoMev2VPeG81wrzcm0l7YanrC8N8rkApsCQ&s"
    },
    {
      id: 3,
      title: "Sự kiện âm nhạc Hội An kỷ niệm 20 năm độc lập",
      location: "Da Lat, Viet Nam",
      membersCount: 40,
      time: "9:00 AM - 3:00 PM",
      member: 40,
      description: "Join our adventurous group for mountain biking through breathtaking landscapes.",
      imageURL: "https://img.freepik.com/free-vector/music-event-poster-with-photo-2021_52683-42065.jpg"
    },
    {
      id: 4,
      title: "Mountain Biking ClubClubClub",
      location: "Da Lat, Viet Nam",
      membersCount: 40,
      time: "9:00 AM - 3:00 PM",
      member: 40,
      description: "Join our adventurous group for mountain biking through breathtaking landscapes.",
      imageURL: "https://img.freepik.com/free-vector/music-event-poster-with-photo-2021_52683-42065.jpg"
    },
    {
      id: 5,
      title: "Mountain Biking Club Club",
      location: "Da Lat, Viet Nam",
      membersCount: 40,
      time: "9:00 AM - 3:00 PM",
      member: 40,
      description: "Join our adventurous group for mountain biking through breathtaking landscapes.",
      imageURL: "https://img.freepik.com/free-vector/music-event-poster-with-photo-2021_52683-42065.jpg"
    },
    {
      id: 6,
      title: "Mountain Biking Club ClubClub",
      location: "Da Lat, Viet Nam",
      membersCount: 40,
      time: "9:00 AM - 3:00 PM",
      member: 40,
      description: "Join our adventurous group for mountain biking through breathtaking landscapes.",
      imageURL: "https://img.freepik.com/free-vector/music-event-poster-with-photo-2021_52683-42065.jpg"
    },
    {
      id: 7,
      title: "Sự kiện âm nhạc Hội An kỷ niệm 20 năm độc lập",
      location: "Da Lat, Viet Nam",
      membersCount: 40,
      time: "9:00 AM - 3:00 PM",
      member: 40,
      description: "Join our adventurous group for mountain biking through breathtaking landscapes.",
      imageURL: "https://img.freepik.com/free-vector/music-event-poster-with-photo-2021_52683-42065.jpg"
    },
    {
      id: 8,
      title: "Mountain Biking ClubClubClub",
      location: "Da Lat, Viet Nam",
      membersCount: 40,
      time: "9:00 AM - 3:00 PM",
      member: 40,
      description: "Join our adventurous group for mountain biking through breathtaking landscapes.",
      imageURL: "https://img.freepik.com/free-vector/music-event-poster-with-photo-2021_52683-42065.jpg"
    },
    // Thêm các sự kiện khác
  ];


  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; // Number of items you want per page

  // Calculate the items to display based on the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = eventData.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };
  return (
    <div>
      <Row className='p-0 m-0'>
        {currentItems.map((card) => (
          <Col lg={4} md={6} sm={6} xs={12} key={card.id} className="mb-4 d-flex justify-content-center">
            <EventCard
              img={card.imageURL}
              time={card.time}
              title={card.title}
              location={card.location}
              members={card.member}
              text={card.description}
            />
          </Col>
        ))}
      </Row>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(eventData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active-pagination'}
        previousClassName={'previous'}
        nextClassName={'next'}
      />
    </div>
  )
}

export default EventList