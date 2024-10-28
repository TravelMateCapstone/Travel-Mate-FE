import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Shared/Pagination.css';
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/GroupCreate.css';

function GroupCreated() {
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const itemsPerPage = 3; // Items per page

  // Static group data
  const groups = [
    {
      groupId: 1,
      groupImageUrl: 'https://example.com/image1.jpg',
      groupName: 'Group 1',
      location: 'Location 1',
      numberOfParticipants: 10,
      description: 'This is Group 1 description',
    },
    {
      groupId: 2,
      groupImageUrl: 'https://example.com/image2.jpg',
      groupName: 'Group 2',
      location: 'Location 2',
      numberOfParticipants: 15,
      description: 'This is Group 2 description',
    },
    {
      groupId: 3,
      groupImageUrl: 'https://example.com/image3.jpg',
      groupName: 'Group 3',
      location: 'Location 3',
      numberOfParticipants: 8,
      description: 'This is Group 3 description',
    },
    {
      groupId: 4,
      groupImageUrl: 'https://example.com/image1.jpg',
      groupName: 'Group 4',
      location: 'Location 4',
      numberOfParticipants: 10,
      description: 'This is Group 1 description',
    },
    {
      groupId: 5,
      groupImageUrl: 'https://example.com/image2.jpg',
      groupName: 'Group 5',
      location: 'Location 5',
      numberOfParticipants: 15,
      description: 'This is Group 2 description',
    },
    {
      groupId: 6,
      groupImageUrl: 'https://example.com/image3.jpg',
      groupName: 'Group 6',
      location: 'Location 6',
      numberOfParticipants: 8,
      description: 'This is Group 3 description',
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(groups.length / itemsPerPage);

  // Get current page items
  const currentGroups = groups.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
      <Row className='p-0 m-0'>
        {currentGroups.map((group) => (
          <Col md={4} xs={6} key={group.groupId} className="mb-4 d-flex justify-content-center">
            <GroupCard
              img={group.groupImageUrl}
              title={group.groupName}
              location={group.location}
              members={`${group.numberOfParticipants} thành viên`}
              text={group.description}
            />
          </Col>
        ))}
      </Row>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active-pagination'}
        previousClassName={'previous'}
        nextClassName={'next'}
      />
    </div>
  );
}

export default GroupCreated;
