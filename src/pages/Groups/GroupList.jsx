import React, { useState, useEffect, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import GroupCard from '../../components/Group/GroupCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Placeholder, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GroupList() {
  const token = useSelector((state) => state.auth.token);

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/groups?pageNumber=${page}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const groupsData = response.data.groups.$values;
        const totalPages = response.data.totalPages;
        setData(groupsData);
        setPageCount(totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(currentPage);
  }, [currentPage, token]);

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '42px',
        }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="group-card" style={{ width: '100%' }}>
                <Placeholder as={Card.Img} variant="top" className="group-card-img" />
                <Card.Body className="group-card-body">
                  <Placeholder as={Card.Title} animation="glow" className="group-name">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <div className="group-card-info">
                    <Placeholder animation="glow">
                      <Placeholder xs={4} />
                    </Placeholder>
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  </div>
                  <Placeholder as={Card.Text} animation="glow" className="group-card-text">
                    <Placeholder xs={8} />
                    <Placeholder xs={6} />
                  </Placeholder>
                </Card.Body>
              </Card>
            ))
          : data.map((group) => (
              <GroupCard
                key={group.groupId}
                img={group.groupImageUrl}
                title={group.groupName}
                location={group.location}
                members={`${group.numberOfParticipants}`}
                text={group.description}
              />
            ))}
      </div>

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
