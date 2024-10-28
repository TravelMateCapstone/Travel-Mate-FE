import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Shared/Pagination.css';
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/GroupJoined.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

function GroupJoined() {
  const [groups, setGroups] = useState([]); // State to hold fetched groups
  const [totalPages, setTotalPages] = useState(0); // Total pages from API
  const [currentPage, setCurrentPage] = useState(0); // Current page state

  const itemsPerPage = 6; // Items per page
  const token = useSelector((state) => state.auth.token); // Get token from Redux store

  // Fetch data from API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups?pageNumber=${currentPage + 1}`,
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );

        setGroups(response.data.groups.$values); // Set groups data from API response
        setTotalPages(response.data.totalPages); // Set total pages from API response
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGroups();
  }, [currentPage, token]); // Refetch data when page or token changes

  // Handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className='container-group-list'>
      <Row className='p-0 m-0'>
        {groups.map((group) => (
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

export default GroupJoined;
