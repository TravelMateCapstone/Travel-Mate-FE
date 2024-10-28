import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import GroupCard from '../../components/Group/GroupCard';
import axios from 'axios';
import { useSelector } from 'react-redux';

function GroupList() {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector((state) => (state.auth.token));

  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/groups?pageNumber=${page}`,{
          headers: {
            Authorization: `${token}`
          }
        });
        console.log(response.data.groups.$values);
        setData(response.data.groups.$values);
        setPageCount(response.data.totalPages); // Set page count from API response
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(currentPage); // Fetch data for the current page on load
  }, [currentPage]);

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage); // Update current page
    localStorage.setItem('currentPage', selectedPage); // Save current page in local storage if needed
  }, []);

  return (
    <div>
      <Row className='p-0 m-0'>
        {data.map((group) => (
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
        pageCount={pageCount}
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
