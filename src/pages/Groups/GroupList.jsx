import React, { useState, useCallback, useMemo, useEffect, Suspense, lazy } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Placeholder, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery } from 'react-query';

const GroupCard = lazy(() => import('../../components/Group/GroupCard'));

function GroupList() {
  const token = useSelector((state) => state.auth.token);
  const refreshGroups = useSelector((state) => state.group.refreshGroups);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGroups = useMemo(() => async (page) => {
    const endpoint = token
      ? `https://travelmateapp.azurewebsites.net/api/Groups/UnJoinedGroups?pageNumber=${page}`
      : `https://travelmateapp.azurewebsites.net/api/groups?pageNumber=${page}`;
    const headers = token ? { Authorization: `${token}` } : {};
    const response = await axios.get(endpoint, { headers });
    return response.data;
  }, [token]);

  const { data, isLoading } = useQuery(['groups', currentPage, token, refreshGroups], () => fetchGroups(currentPage), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const handlePageChange = useCallback((data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [token, refreshGroups]);

  const LoadingPlaceholder = useMemo(() => () => (
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
            <div>Tham gia</div>
            <ion-icon name="chevron-forward-circle-outline" className="group-card-icon"></ion-icon>
          </Button>
        </Card.Body>
      </Card>
    ))
  ), []);

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
          <LoadingPlaceholder />
        ) : (
          <Suspense fallback={<LoadingPlaceholder />}>
            {(token ? data?.listUnjoinedGroups?.$values : data?.groups?.$values)?.map((group) => (
              <GroupCard
                id={group.group?.groupId || group.groupId}
                key={group.group?.groupId || group.groupId}
                img={group.group?.groupImageUrl || group.groupImageUrl}
                title={group.group?.groupName || group.groupName}
                location={group.group?.location || group.location}
                members={`${group.group?.numberOfParticipants || group.numberOfParticipants}`}
                text={group.group?.description || group.description}
                isJoined={group.userJoinedStatus}
                loading="lazy"
              />
            ))}
          </Suspense>
        )}
      </div>

      {data?.totalPages > 1 && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={data?.totalPages || 0}
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

export default GroupList;
