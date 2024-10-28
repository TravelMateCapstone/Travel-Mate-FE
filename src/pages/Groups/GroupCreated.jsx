import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Shared/Pagination.css';
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/GroupCreate.css';

function GroupCreated() {
  const [groups, setGroups] = useState([]); // State to hold fetched groups
  const [totalPages, setTotalPages] = useState(0); // State for total pages
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const itemsPerPage = 6; // Items per page

  // Retrieve token from Redux store
  const token = useSelector((state) => state.auth.token); // Adjust according to your state structure

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://travelmateapp.azurewebsites.net/api/Groups/CreatedGroups?pageNumber=${currentPage + 1}`, {
          headers: {
            'Authorization': `${token}`,
          },
        });
        
        const data = await response.json();

        console.log(data);
        
        
        // Update states with API data
        setGroups(data.groups.$values);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, token]); // Add token to dependency array in case it changes

  // Handle page change
  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
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

export default GroupCreated;
