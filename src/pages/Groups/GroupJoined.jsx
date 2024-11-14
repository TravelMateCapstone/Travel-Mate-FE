import React, { useState, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import GroupCard from '../../components/Group/GroupCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Placeholder, Card, Button } from 'react-bootstrap';
import { useQuery } from 'react-query';

function GroupJoined() {
  const token = useSelector((state) => state.auth.token);
  const refreshGroups = useSelector((state) => state.group.refreshGroups); 

  const [currentPage, setCurrentPage] = useState(1);

  const fetchGroups = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/JoinedGroups?pageNumber=${page}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  };

  const { data, isLoading } = useQuery(['groups', currentPage, refreshGroups], fetchGroups, {
    keepPreviousData: true,
    retry: false, 
    onSuccess: (data) => {
      if (data.message === "No joined groups found.") {
        setIsLoading(false);
      }
    },
  });

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '42px',
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
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
          ))}
        </div>
      ) : !data || data.message === "No joined groups found." ? (
        <p>Bạn chưa tham gia nhóm nào.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '42px',
          }}
        >
          {data.groups.$values.map((group) => (
            <GroupCard
              id={group.groupId}
              key={group.groupId}
              img={group.groupImageUrl}
              title={group.groupName}
              location={group.location}
              members={`${group.numberOfParticipants}`}
              text={group.description}
            />
          ))}
        </div>
      )}

      {!isLoading && data && data.groups.$values.length > 0 && (
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

export default GroupJoined;
