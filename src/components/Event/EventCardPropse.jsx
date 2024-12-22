import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS cho Skeleton
import '../../assets/css/Events/EventCard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { viewEvent } from '../../redux/actions/eventActions';
import { toast } from 'react-toastify';

const EventCardPropse = ({ id, img, startTime, endTime, title, location, text, isProposeEvent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationPath = useLocation();
    const token = useSelector((state) => state.auth.token);

    const [loading, setLoading] = useState(false); // State loading
    const [participantCount, setParticipantCount] = useState(null); // State participant count
    const [isUserJoined, setIsUserJoined] = useState(false);

    const isJoinedPath = locationPath.pathname.includes('/event/joined');
    const isCreatedPath = locationPath.pathname.includes('/event/created');
    const isEventPage = locationPath.pathname.includes('/event');

    useEffect(() => {
        const fetchParticipantCount = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/api/EventParticipants/event/${id}/count-user-join`
                );
                if (response.status === 200) {
                    setParticipantCount(response.data.participantCount);
                }
            } catch (error) {
                console.error("Error fetching participant count:", error);
            }
        };

        const checkUserJoined = async () => {
            try {
                const response = await axios.get(
                    `https://travelmateapp.azurewebsites.net/api/EventParticipants/check-current-user-joined/${id}`,
                    { headers: { Authorization: token } }
                );
                if (response.status === 200) {
                    setIsUserJoined(response.data.isJoined);
                }
            } catch (error) {
                console.error("Error checking if user joined event:", error);
            }
        };
        fetchParticipantCount();
        checkUserJoined();
    }, [id]);

    const handleViewOrJoinEvent = async () => {
        const selectedEvent = { id, img, startTime, endTime, title, location, participantCount, text };

        if (isJoinedPath) {
            // Xem chi tiết khi đã tham gia sự kiện
            dispatch(viewEvent(selectedEvent));
            localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
            navigate(RoutePath.EVENT_DETAILS);
        } else if (!isCreatedPath && isEventPage) {
            // Tham gia sự kiện khi ở trang event
            setLoading(true); // Bắt đầu loading
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_API_URL}/api/EventParticipants/current-user-join-event`,
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
            } finally {
                setLoading(false); // Kết thúc loading
            }
        } else {
            dispatch(viewEvent(selectedEvent));
            localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
            navigate(RoutePath.EVENT_MANAGEMENT);
        }
    };

    const handleCardClick = () => {
        const selectedEvent = { id, img, startTime, endTime, title, location, participantCount, text };
        dispatch(viewEvent(selectedEvent));
        localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
        if (isCreatedPath) {
            navigate(RoutePath.EVENT_MANAGEMENT);
        } else if (isEventPage || isJoinedPath) {
            navigate(RoutePath.EVENT_DETAILS);
        }
    };

    // const buttonText = isCreatedPath ? "Quản lý sự kiện" : isJoinedPath ? "Xem chi tiết" : "Tham gia";

    return (
        <Card className="eventlist-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            {loading ? (
                <>
                    <Skeleton height={180} />
                    <Card.Body className='event-card-body'>
                        <Skeleton height={20} count={1} />
                        <Skeleton height={16} count={1} style={{ margin: '8px 0' }} />
                        <Skeleton height={16} count={1} style={{ margin: '8px 0' }} />
                        <Skeleton height={16} count={1} style={{ margin: '8px 0' }} />
                        <Skeleton height={30} />
                    </Card.Body>
                </>
            ) : (
                <>
                    <Card.Img variant="top" src={img || <Skeleton height={180} />} className="event-card-image" />
                    <Card.Body className='event-card-body'>
                        <div className="location-and-members">
                            <span className='d-flex align-items-center' style={{ fontSize: '12px' }}>
                                {startTime || <Skeleton width={80} />}
                            </span>
                            <span className="group-card-members d-flex align-items-center">
                                <ion-icon name="people-outline" style={{ fontSize: '19px' }}></ion-icon>
                                <p className='m-0' style={{ fontSize: '12px' }}>{participantCount !== null ? participantCount : <Skeleton width={40} />}</p>
                            </span>
                        </div>
                        <Card.Title className='event-title'>
                            {title || <Skeleton width={200} />}
                        </Card.Title>
                        <div className="event-card-info fw-medium">
                            <span><i className='bi bi-geo-alt'></i> {location || <Skeleton width={150} />}</span>
                        </div>
                        <Button
                            variant="outline-success"
                            className="btn-join rounded-5 event-card-button"
                            onClick={(e) => { e.stopPropagation(); handleViewOrJoinEvent(); }}
                            disabled={loading} // Disable button when loading
                        >
                            <div>{'Tham gia' || <Skeleton width={100} />}</div>
                            <ion-icon name="chevron-forward-circle-outline" className="event-card-icon"></ion-icon>
                        </Button>
                    </Card.Body>
                </>
            )}
        </Card>
    );
};

export default EventCardPropse;
