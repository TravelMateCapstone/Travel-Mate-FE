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
            <div style={{
                height: '100px',
                marginBottom: '10px',
            }} className='h-100 position-relative destination_card d-flex border-1 bg-white rounded-4 gap-3 justify-content-between'>
             <img className='h-100 object-fit-cover rounded-4 h-100 w-100' src={destination.imageUrl } alt={destination.name} height={100} width={100} />
               <div className='position-absolute d-flex align-items-center justify-content-between mx-3 rounded-3' style={{
                width: '90%',
                bottom: '14px',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
               }}>
                    <div className='d-flex gap-3 '>
                        <div className='d-flex  gap-3'>
                            <label style={{
                                fontSize: '18px',
                            }} className='fw-semibold m-0'>{destination.locationName}</label>
                        </div>
                    </div>
                    <div className='d-flex align-items-end'>
                        <Button variant='outline-dark' className='rounded-circle p-0 m-0 justify-content-center d-flex align-items-center destination_card_button'>
                            <ion-icon name="chevron-forward-outline"></ion-icon>
                        </Button>
                    </div>
               </div>
            </div>
        </Col>
    )
}

export default DestinationCard