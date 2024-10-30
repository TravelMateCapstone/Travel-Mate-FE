import React, { useState, useEffect, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Shared/Pagination.css';
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/GroupCreate.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function GroupCreated() {
  const token = useSelector((state) => state.auth.token);

  const savedPage = parseInt(localStorage.getItem('currentPageCreated')) || 1;
  const savedData = JSON.parse(localStorage.getItem('pageDataCreated')) || {};

  const [data, setData] = useState(savedData[savedPage] || []);
  const [pageCount, setPageCount] = useState(savedData.totalPages || 0);
  const [currentPage, setCurrentPage] = useState(savedPage);
  const [loading, setLoading] = useState(!savedData[savedPage]); 

  useEffect(() => {
    if (savedData[currentPage]) {
      setData(savedData[currentPage]);
      setPageCount(savedData.totalPages || 0);
      setLoading(false);
      return;
    }
    
    const fetchData = async (page = 1) => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/CreatedGroups?pageNumber=${page}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        const groupsData = response.data.groups.$values;
        const totalPages = response.data.totalPages;

        setData(groupsData);
        setPageCount(totalPages);

        const updatedData = { ...savedData, [page]: groupsData, totalPages };
        localStorage.setItem('pageDataCreated', JSON.stringify(updatedData));
        localStorage.setItem('currentPageCreated', page);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(currentPage);
  }, [currentPage, token]);

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    localStorage.setItem('currentPage', selectedPage);
  }, []);

  return (
    <div>
      {loading ? (
        <Row className='p-0 m-0'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col md={4} xs={6} key={index} className="mb-4 d-flex justify-content-center">
              <div style={{ width: '100%' }}>
                <Skeleton height={200} />
                <Skeleton height={30} style={{ marginTop: '10px' }} />
                <Skeleton height={20} style={{ marginTop: '5px' }} />
                <Skeleton height={20} style={{ marginTop: '5px' }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : data.length === 0 ? (
        <p className='text-center'>Bạn chưa tạo nhóm nào</p>
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
