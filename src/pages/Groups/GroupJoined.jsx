import { useState } from "react";
import GroupCard from "../../components/Group/GroupCard";
import "../../assets/css/Groups/GroupList.css";
import useApi from "../../hooks/useApi";
import ReactPaginate from "react-paginate";
import { Card, Placeholder } from "react-bootstrap";

function GroupJoined() {
  const [pageNumber, setPageNumber] = useState(1);
  const { useFetch } = useApi(
    `https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups?pageNumber=${pageNumber}`
  );
  const { data, isLoading, error } = useFetch();

  if (isLoading) return  <div className="group-list">
  {[...Array(6)].map((_, index) => (
    <Card className="group-card p-0" key={index}>
      <Placeholder as={Card.Img} variant="top" animation="glow" className="group-card-img" />
      <Card.Body className="group-card-body">
        <Placeholder as={Card.Title} animation="glow" className="group-name">
          <Placeholder xs={6} />
        </Placeholder>
        <div className="group-card-info">
          <Placeholder as="span" animation="glow" className="d-flex align-items-center">
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder as="span" animation="glow" className="group-card-members">
            <Placeholder xs={4} />
          </Placeholder>
        </div>
        <Placeholder as={Card.Text} animation="glow" className="group-card-text">
          <Placeholder xs={7} />
          <Placeholder xs={4} />
        </Placeholder>
        <Placeholder.Button variant="outline-success" className="group-card-button" xs={12} />
      </Card.Body>
    </Card>
  ))}
</div>;
  if (error) return <div>Error loading groups</div>;

  const handlePageClick = (event) => {
    setPageNumber(event.selected + 1);
  };

  return (
    <div>
      <div className="group-list">
        {data.groups.$values.length === 0 ? (
          <div>Bạn chưa tham gia nhóm nào</div>
        ) : (
          data.groups.$values.map((group) => (
            <GroupCard key={group.groupId} group={group} userJoinedStatus="Joined" />
          ))
        )}
      </div>
      {data.totalPages > 1 && (
        <ReactPaginate
          previousLabel={"Trang trước"}
          nextLabel={"Trang sau"}
          breakLabel={"..."}
          pageCount={data.totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
}

export default GroupJoined;
