import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import GroupCard from '../../components/Group/GroupCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function GroupList() {
  const token = useSelector((state) => state.auth.token);
  const savedPage = parseInt(localStorage.getItem('currentPageList')) || 1;
  const savedData = JSON.parse(localStorage.getItem('pageDataList')) || {};
  
  const [data, setData] = useState(savedData[savedPage] || []);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(savedPage);
  const [isLoading, setIsLoading] = useState(!savedData[savedPage]);

  useEffect(() => {
    // Nếu dữ liệu trang hiện tại đã có trong localStorage, không gọi API
    if (savedData[currentPage]) {
     
      setData(savedData[currentPage]);
      console.log("call local tại " + currentPage);
      setIsLoading(false);
      setPageCount(savedData.totalPages || 0);
      return;
    }
    // Gọi API khi không có dữ liệu trang hiện tại trong localStorage
    const fetchData = async (page = 1) => {
      console.log("call api");
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/groups?pageNumber=${page}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        const groupsData = response.data.groups.$values;
        const totalPages = response.data.totalPages;
        setData(groupsData);
        setPageCount(totalPages);
        // Lưu dữ liệu và trang vào localStorage
        const updatedData = { ...savedData, [page]: groupsData, totalPages };
        localStorage.setItem('pageDataList', JSON.stringify(updatedData));
        localStorage.setItem('currentPageList', page);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(currentPage); // Fetch data for the current page
  }, [currentPage, token]);

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  }, []);

  return (
    <div>
      <Row className="p-0 m-0">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Col md={4} xs={6} key={index} className="mb-4 d-flex justify-content-center">
              <div style={{ width: '100%' }}>
                <Skeleton height={200} />
                <Skeleton height={30} style={{ marginTop: '10px' }} />
                <Skeleton height={20} style={{ marginTop: '5px' }} />
                <Skeleton height={20} style={{ marginTop: '5px' }} />
              </div>
            </Col>
          ))
        ) : (
          data.map((group) => (
            <Col md={4} xs={6} key={group.groupId} className="mb-4 d-flex justify-content-center">
              <GroupCard
                img={group.groupImageUrl}
                title={group.groupName}
                location={group.location}
                members={`${group.numberOfParticipants} thành viên`}
                text={group.description}
              />
            </Col>
          ))
        )}
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
