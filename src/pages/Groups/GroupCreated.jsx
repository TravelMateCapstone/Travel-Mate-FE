import React, { useState, useEffect, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Shared/Pagination.css';
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/GroupCreate.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

function GroupCreated() {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async (page = 1) => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Groups/CreatedGroups?pageNumber=${page}`, {
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
      setLoading(false); // End loading
    };

    fetchData(currentPage); // Fetch data for the current page on load
  }, [currentPage, token]);

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage); // Update current page
    localStorage.setItem('currentPage', selectedPage); // Save current page in local storage if needed
  }, []);

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default GroupCreated;
