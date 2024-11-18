import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { viewGroup } from '../../redux/actions/groupActions';
import '../../assets/css/Groups/GroupCard.css';
import RoutePath from '../../routes/RoutePath';
const GroupCard = ({ group, userJoinedStatus }) => {
  const dispatch = useDispatch();

  if (!group) {
    return null;
  }

  const handleViewGroup = () => {
    dispatch(viewGroup(group, userJoinedStatus));
  };

  const { groupId, groupName, location, createAt, description, groupImageUrl, numberOfParticipants, createdById } = group;
  return (
    <Card as={Link} to={RoutePath.GROUP_DETAILS} className="group-card p-0 custom-link" onClick={handleViewGroup}>
      <Card.Img variant="top" src={groupImageUrl} className="group-card-img" />
      <Card.Body className="group-card-body">
        <Card.Title className="group-name">{groupName}</Card.Title>
        <div className="group-card-info">
          <span className="d-flex align-items-center"><ion-icon name="location-outline" className="icon-margin"></ion-icon>{location}</span>
          <span className="group-card-members"><ion-icon name="people-outline" className="icon-margin"></ion-icon>{numberOfParticipants} members</span>
        </div>
        <Card.Text className="group-card-text">{description}</Card.Text>
        <Button variant="outline-success" className="group-card-button">
          <div></div>
          <div>
            {userJoinedStatus === 'Pending' ? 'Đã gửi yêu cầu' : userJoinedStatus === 'Joined' || userJoinedStatus === 'Owner' ? 'Vào nhóm' : 'Tham gia'}
          </div>
          <ion-icon name="chevron-forward-circle-outline" className="group-card-icon"></ion-icon>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default GroupCard;
