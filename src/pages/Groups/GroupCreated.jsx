import React, { useState, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import GroupCard from '../../components/Group/GroupCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Placeholder, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery } from 'react-query';

function GroupCreated() {
  const token = useSelector((state) => state.auth.token);

  const [currentPage, setCurrentPage] = useState(1);

  const fetchGroups = async ({ queryKey }) => {
    const [, page] = queryKey;
    const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/CreatedGroups?pageNumber=${page}`, { headers: { Authorization: `${token}` } });
    return response.data;
  };

  const { data, isLoading } = useQuery(['groups', currentPage], fetchGroups, {
    keepPreviousData: true,
  });

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
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
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
                <Button variant="outline-success" className="group-card-button" disabled>
                  <div></div>
                  <div>Vào nhóm</div>
                  <ion-icon name="chevron-forward-circle-outline" className="group-card-icon"></ion-icon>
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : data && data.groups.$values.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>Chưa có nhóm nào được tạo</div>
        ) : (
          data && data.groups.$values.map((group) => (
            <GroupCard
              description={group.description}
              id={group.groupId}
              key={group.groupId}
              img={group.groupImageUrl}
              title={group.groupName}
              location={group.location}
              members={`${group.numberOfParticipants}`}
              text={group.description}
            />
          ))
        )}
      </div>

      {data && data.groups.$values.length > 0 && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={data.totalPages}
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

export default GroupCreated;

