import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS cho Skeleton
import '../../assets/css/Events/EventCard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { viewProfile } from '../../redux/actions/profileActions';
import { toast } from 'react-toastify';

const UserCard = ({ id, img, name, address, numberOfConnect, descriptions }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);

    const data = useSelector(state => state.profile);

    const handleCardClick = () => {
        console.log("card")
        dispatch(viewProfile(id, token));
        navigate(RoutePath.OTHERS_PROFILE);
    };

    return (
        <Card className="eventlist-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <Card.Img variant="top" src={img || <Skeleton height={180} />} className="event-card-image" />
            <Card.Body className='event-card-body'>
                <div className="location-and-members">
                    <span className="group-card-members d-flex align-items-center">
                        <ion-icon name="people-outline" style={{ fontSize: '19px' }}></ion-icon>
                        <p className='m-0' style={{ fontSize: '12px' }}>{numberOfConnect}</p>
                    </span>
                </div>
                <Card.Title className='event-title'>
                    {name}
                </Card.Title>
                <div className="event-card-info fw-medium">
                    <span><i className='bi bi-geo-alt'></i> {address}</span>
                </div>
                <div className="event-card-info fw-medium">
                    <span>{descriptions}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default UserCard;
