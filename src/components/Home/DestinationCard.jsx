import React from 'react'
import { use } from 'react'
import { Button, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import RoutePath from '../../routes/RoutePath';
import '../../assets/css/Home/DestinationCard.css'

function DestinationCard({ destination }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const handleDestinationClick = () => {
        localStorage.setItem('selectedLocation', JSON.stringify(destination));
        console.log('Selected location set in localStorage:', localStorage.getItem('selectedLocation')); 
        navigate(RoutePath.DESTINATION);
    }
    return (
        <Col lg={3} className='mb-4' onClick={handleDestinationClick}>
            <div className='destination_card p-3 d-flex border-1 bg-white rounded-4 gap-3 justify-content-between'>
                <div className='d-flex gap-3'>
                    <img className='rounded-circle object-fit-cover' src={destination.imageUrl} alt={destination.name} height={100} width={100} />
                    <div className='d-flex flex-column justify-content-center gap-3'>
                        <label className='fw-semibold m-0'>{destination.locationName}</label>
                        <small className='m-0 text-muted'><ion-icon name="flag"></ion-icon> {destination.tours} tours</small>
                    </div>
                </div>
                <div className='d-flex align-items-end'>
                    <Button variant='outline-dark' className='rounded-circle p-0 m-0 justify-content-center d-flex align-items-center destination_card_button'>
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </Button>
                </div>
            </div>
        </Col>
    )
}

export default DestinationCard