import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import GroupCard from '../../components/Group/GroupCard'; // Import GroupCard

// Memoize GroupCard to prevent unnecessary re-renders
const MemoizedGroupCard = React.memo(GroupCard);

// Dữ liệu mẫu (mock data)
const mockGroups = [
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

function GroupList() {
  const PAGE_SIZE = 3; // Số nhóm hiển thị mỗi trang
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem('currentPage')) || 1
  );

  const totalPages = Math.ceil(mockGroups.length / PAGE_SIZE);

  // Lấy danh sách các nhóm cho trang hiện tại
  const getGroupsForPage = useCallback((pageNumber) => {
    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return mockGroups.slice(startIndex, endIndex);
  }, []);

  const [groups, setGroups] = useState(getGroupsForPage(currentPage));

  useEffect(() => {
    setGroups(getGroupsForPage(currentPage));
  }, [currentPage, getGroupsForPage]);

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    localStorage.setItem('currentPage', selectedPage);
  }, []);

  return (
    <div>
      <Row className='p-0 m-0'>
        {groups.map((group) => (
          <Col md={4} xs={6} key={group.groupId} className="mb-4 d-flex justify-content-center">
            <MemoizedGroupCard
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

export default GroupList;
