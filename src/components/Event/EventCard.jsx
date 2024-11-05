import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../assets/css/Events/EventCard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { viewEvent } from '../../redux/actions/eventActions';
import { toast } from 'react-toastify';

const EventCard = ({ id, img, startTime, endTime, title, location, members, text }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationPath = useLocation();
    const token = useSelector((state) => state.auth.token);

    const isJoinedPath = locationPath.pathname.includes('/event/joined');
    const isCreatedPath = locationPath.pathname.includes('/event/created');
    const isEventPage = locationPath.pathname.includes('/event');

    const handleViewOrJoinEvent = async () => {
        const selectedEvent = { id, img, startTime, endTime, title, location, members, text };

        if (isJoinedPath) {
            // Xem chi tiết khi đã tham gia sự kiện
            dispatch(viewEvent(selectedEvent));
            localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
            navigate(RoutePath.EVENT_DETAILS);
        } else if (!isCreatedPath && isEventPage) {
            // Tham gia sự kiện khi ở trang event
            try {
                const response = await axios.post(
                    'https://travelmateapp.azurewebsites.net/api/EventParticipants/current-user-join-event',
                    { eventId: id, joinedAt: new Date().toISOString(), notification: true },
                    { headers: { Authorization: token } }
                );
                if (response.status === 200) {
                    toast.success("Tham gia sự kiện thành công!");
                    dispatch(viewEvent(selectedEvent));
                    localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
                    navigate(RoutePath.EVENT_DETAILS);
                }
            } catch (error) {
                toast.error("Lỗi khi tham gia sự kiện!");
                console.error("Error joining event:", error);
            }
        } else {
            dispatch(viewEvent(selectedEvent));
            localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
            navigate(RoutePath.EVENT_MANAGEMENT);
        }
    };

    const buttonText = isCreatedPath ? "Quản lý sự kiện" : isJoinedPath ? "Xem chi tiết" : "Tham gia";

    return (
        <Card className="eventlist-card">
            <Card.Img variant="top" src={img} className="event-card-image" />
            <Card.Body className='event-card-body'>
                <div className="location-and-members">
                    <span className='d-flex align-items-center' style={{ fontSize: '12px' }}>
                        {startTime}
                    </span>
                    <span className="group-card-members d-flex align-items-center">
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
                    className="btn-join rounded-5 event-card-button"
                    onClick={handleViewOrJoinEvent}
                >
                    <div>{buttonText}</div>
                    <ion-icon name="chevron-forward-circle-outline" className="event-card-icon"></ion-icon>
                </Button>
            </Card.Body>
        </Card>
    );
};

export default EventCard;
