import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../assets/css/Events/EventCard.css';
import { Link, useLocation } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { viewEvent } from '../../redux/actions/eventActions';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EventCard = ({ id, img, startTime, endTime, title, location, members, text, loading }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationPath = useLocation();

    const isJoinedPath = locationPath.pathname.includes('/event/joined');
    const isCreatedPath = locationPath.pathname.includes('/event/created');

    const handleJoinEvent = async () => {
        const eventDetails = { img, startTime, endTime, title, location, members, text };
        dispatch(viewEvent(eventDetails));
        navigate(isCreatedPath ? RoutePath.MANAGE_EVENT : RoutePath.JOINEVENTDETAILS);
    };

    if (loading) {
        return (
            <Card className="eventlist-card">
                <Skeleton height={200} width="100%" />
                <Card.Body className='event-card-body'>
                    <Skeleton height={20} width="60%" className="mb-2" />
                    <Skeleton height={15} width="80%" />
                    <Skeleton height={15} width="50%" />
                    <div className="location-and-members mt-2">
                        <Skeleton height={15} width="30%" className="me-2" />
                        <Skeleton height={15} width="20%" />
                    </div>
                    <Skeleton height={35} width="100%" className="mt-3" />
                </Card.Body>
            </Card>
        );
    }

    // Determine button text and path
    const buttonText = isCreatedPath ? "Quản lý sự kiện" : isJoinedPath ? "Xem chi tiết" : "Tham gia";
    const buttonPath = isCreatedPath ? RoutePath.MANAGE_EVENT : isJoinedPath ? RoutePath.EVENT_JOINED : RoutePath.JOINEVENTDETAILS;

    // Render the actual card content when loading is false
    return (
        <Card className="eventlist-card">
            <Card.Img variant="top" src={img} className="event-card-image" />
            <Card.Body className='event-card-body'>
                <div className="location-and-members">
                    <span className='d-flex align-items-center' style={{ fontSize: '12px' }}>
                        {startTime}
                    </span>
                    <span className="group-card-members d-flex align-items-center ">
                        <ion-icon name="people-outline" style={{ fontSize: '19px' }}></ion-icon>
                        <p className='m-0' style={{ fontSize: '12px' }}>{members}</p>
                    </span>
                </div>
                <Card.Title className='event-title'>{title}</Card.Title>
                <div className="event-card-info fw-medium">
                    <span><i className='bi bi-geo-alt'></i> {location}</span>
                </div>
                <Button
                    variant="outline-success"
                    className="btn-join rounded-5"
                    onClick={handleJoinEvent}
                    as={Link}
                    to={buttonPath}
                >
                    <div></div>
                    <div>{buttonText}</div>
                    <ion-icon name="chevron-forward-circle-outline"></ion-icon>
                </Button>
            </Card.Body>
        </Card>
    );
};

export default EventCard;
