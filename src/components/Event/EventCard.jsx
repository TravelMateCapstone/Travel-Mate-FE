import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../assets/css/Events/EventCard.css';
import { Link, useLocation } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom';
import { viewEvent } from '../../redux/actions/eventActions';  // Đảm bảo đường dẫn tới file actions chính xác


const EventCard = ({ id, img, time, title, location, members, text }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();  // Sử dụng useNavigate

    const handleJoinEvent = () => {
        const eventDetails = { img, time, title, location, members, text };
        dispatch(viewEvent(eventDetails));

        // Điều hướng sau khi dispatch
        navigate(RoutePath.JOINEVENTDETAILS);
    };


    return (
        <Card className="eventlist-card">
            <Card.Img variant="top" src={img} className="event-card-image" />
            <Card.Body className='event-card-body'>
                <div className="location-and-members">
                    <span className='d-flex align-items-center' style={{
                        fontSize: '12px',
                    }}>
                        {time}
                    </span>
                    <span className="group-card-members d-flex align-items-center ">
                        <ion-icon name="people-outline" style={{
                            fontSize: '19px',
                        }}></ion-icon>
                        <p className='m-0' style={{
                            fontSize: '12px',
                        }}>{members}</p>
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
                >
                    <div></div>
                    <div>Tham gia</div>
                    <ion-icon name="chevron-forward-circle-outline"></ion-icon>
                </Button>
            </Card.Body>
        </Card >
    );
};

export default EventCard;
