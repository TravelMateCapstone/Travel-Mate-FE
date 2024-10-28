import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../assets/css/Groups/GroupCard.css';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import RoutePath from '../../routes/RoutePath';
import { viewGroup } from '../../redux/actions/groupActions';
import { useDispatch } from 'react-redux';

const GroupCard = ({ img, title, location, members, text }) => {
  const locationRoute = useLocation(); 
  const dispatch = useDispatch(); 
  const isCreatedOrJoined = locationRoute.pathname === RoutePath.GROUP_CREATED || locationRoute.pathname === RoutePath.GROUP_JOINED;
  const buttonText = isCreatedOrJoined ? 'Vào nhóm' : 'Tham gia';
  const handleJoinGroup = () => {
    const groupDetails = { img, title, location, members, text }; 
    dispatch(viewGroup(groupDetails)); // Dispatch action viewGroup
  };
  

  return (
    <Card className="group-card">
      <Card.Img
        variant="top"
        src={img}
        className="group-card-img"
      />
      <Card.Body className="group-card-body">
        <Card.Title className='group-name'>{title}</Card.Title>
        <div className="group-card-info">
          <span className='d-flex align-items-center'>
            <ion-icon name="location-outline" className="icon-margin"></ion-icon>
            {location}
          </span>
          <span className="group-card-members">
            <ion-icon name="people-outline" className="icon-margin"></ion-icon>
            {members}
          </span>
        </div>
        <Card.Text className="group-card-text">
          {text}
        </Card.Text>
        <Button as={Link} to={RoutePath.GROUP_DETAILS} variant="outline-success" className="group-card-button" onClick={handleJoinGroup}>
          <div></div>
          <div>{buttonText}</div>
          <ion-icon name="chevron-forward-circle-outline" className="group-card-icon"></ion-icon>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default GroupCard;
