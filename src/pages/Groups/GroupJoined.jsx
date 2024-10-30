import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Shared/Pagination.css';
import GroupCard from '../../components/Group/GroupCard';
import '../../assets/css/Groups/GroupJoined.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function GroupJoined() {
  const token = useSelector((state) => state.auth.token);

  const savedPage = parseInt(localStorage.getItem('currentPageJoined')) || 0;
  const savedData = JSON.parse(localStorage.getItem('joinedGroupsData')) || {};

  const [groups, setGroups] = useState(savedData[savedPage] || []);
  const [totalPages, setTotalPages] = useState(savedData.totalPages || 0);
  const [currentPage, setCurrentPage] = useState(savedPage);
  const [loading, setLoading] = useState(!savedData[savedPage]);

  const itemsPerPage = 6;

  useEffect(() => {
    if (savedData[currentPage]) {
      setGroups(savedData[currentPage]);
      setTotalPages(savedData.totalPages || 0);
      setLoading(false);
      return;
    }

    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/api/Groups/JoinedGroups?pageNumber=${currentPage + 1}`,
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );

        const groupsData = response.data.groups.$values;
        const pages = response.data.totalPages;

        setGroups(groupsData);
        setTotalPages(pages);

        const updatedData = { ...savedData, [currentPage]: groupsData, totalPages: pages };
        localStorage.setItem('joinedGroupsData', JSON.stringify(updatedData));
        localStorage.setItem('currentPageJoined', currentPage);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentPage, token]);

  const handlePageChange = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
    localStorage.setItem('currentPage', selectedPage);
  };

  return (
    <div className='container-group-list'>
      <Row className='p-0 m-0'>
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <Col md={4} xs={6} key={index} className="mb-4 d-flex justify-content-center">
              <div style={{ width: '100%' }}>
                <Skeleton height={200} />
                <Skeleton height={30} style={{ marginTop: '10px' }} />
                <Skeleton height={20} style={{ marginTop: '5px' }} />
                <Skeleton height={20} style={{ marginTop: '5px' }} />
              </div>
            </Col>
          ))
        ) : groups.length === 0 ? (
          <div className="text-center w-100">
            <p>Bạn chưa tham gia nhóm nào.</p>
          </div>
        ) : (
          groups.map((group) => (
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

      {groups.length > 0 && (
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
      )}
    </div>
  );
}

export default GroupJoined;
