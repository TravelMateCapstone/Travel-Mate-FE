import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../assets/css/Groups/GroupCard.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { viewGroup } from '../../redux/actions/groupActions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const GroupCard = ({ id, img, title, location, members, text, description }) => {
  const locationRoute = useLocation();
  const navigate = useNavigate(); // Add this line
  const dispatch = useDispatch();
  const [requestSent, setRequestSent] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const isCreatedOrJoined =
    locationRoute.pathname === RoutePath.GROUP_CREATED ||
    locationRoute.pathname === RoutePath.GROUP_JOINED;

  const handleViewGroup = () => {
    const groupDetails = { id, img, title, location, members, text, description };
    dispatch(viewGroup(groupDetails));

    // Navigate to different paths based on the current location
    if (locationRoute.pathname === RoutePath.GROUP_JOINED) {
      navigate(RoutePath.GROUP_DETAILS);
    } else if (locationRoute.pathname === RoutePath.GROUP_CREATED) {
      navigate(RoutePath.GROUP_MY_DETAILS);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups/Join/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Yêu cầu tham gia nhóm đã được gửi thành công!');
        setRequestSent(true);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data === 'You have sent join request!'
      ) {
        toast.info('Đang xử lí yêu cầu');
        setRequestSent(true);
      } else {
        toast.error('Có lỗi xảy ra khi gửi yêu cầu tham gia nhóm.');
        console.error('Error joining group:', error);
      }
    }
  };

  return (
    <Card className="group-card">
      <Card.Img variant="top" src={img} className="group-card-img" />
      <Card.Body className="group-card-body">
        <Card.Title className="group-name">{title}</Card.Title>
        <div className="group-card-info">
          <span className="d-flex align-items-center">
            <ion-icon name="location-outline" style={{ marginRight: '5px' }}></ion-icon>
            {location}
          </span>
          <span className="group-card-members">
            <ion-icon name="people-outline" style={{ marginRight: '5px' }}></ion-icon>
            {members}
          </span>
        </div>
        <Card.Text className="group-card-text">{text}</Card.Text>
        {isCreatedOrJoined || requestSent ? (
          <Button
            variant="outline-success"
            className="group-card-button"
            onClick={handleViewGroup}
          >
            <div></div>
            <div>{requestSent ? 'Xem nhóm' : 'Vào nhóm'}</div>
            <ion-icon name="chevron-forward-circle-outline" className="group-card-icon"></ion-icon>
          </Button>
        ) : (
          <Button
            variant="outline-success"
            className="group-card-button"
            onClick={handleJoinGroup}
            disabled={requestSent}
          >
            <div></div>
            <div>{requestSent ? 'Đã gửi yêu cầu' : 'Tham gia'}</div>
            <ion-icon name="chevron-forward-circle-outline" className="group-card-icon"></ion-icon>
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default GroupCard;
