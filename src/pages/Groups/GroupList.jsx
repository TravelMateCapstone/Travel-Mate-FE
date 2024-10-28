import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import GroupCard from '../../components/Group/GroupCard'; // Import GroupCard

// Memoize GroupCard to prevent unnecessary re-renders
const MemoizedGroupCard = React.memo(GroupCard);

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem('currentPage')) || 1
  );

  const fetchGroups = useCallback(async (pageNumber) => {
    const cachedGroups = localStorage.getItem(`groupsPage_${pageNumber}`);
    if (cachedGroups) {
      const parsedData = JSON.parse(cachedGroups);
      setGroups(parsedData.groups);
      setTotalPages(parsedData.totalPages);
    } else {
      try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/groups?pageNumber=${pageNumber}`);
        const data = {
          groups: response.data.groups,
          totalPages: response.data.totalPages,
        };
        setGroups(data.groups);
        setTotalPages(data.totalPages);
        localStorage.setItem(`groupsPage_${pageNumber}`, JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    }
  }, []);

  const refreshGroups = useCallback(() => {
    fetchGroups(currentPage);
  }, [fetchGroups, currentPage]);

  useEffect(() => {
    fetchGroups(currentPage);
  }, [currentPage, fetchGroups]);

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
