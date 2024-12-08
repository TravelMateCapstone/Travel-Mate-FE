import React from 'react';
import { Col, Row } from 'react-bootstrap';
import '../../assets/css/Tour/TourCard.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchTour } from '../../redux/actions/tourActions';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

function TourCard({ tour }) {
    const disPatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<ion-icon key={i} name="star" style={{ color: 'yellow' }}></ion-icon>);
            } else {
                stars.push(<ion-icon key={i} name="star-outline" style={{ color: 'black' }}></ion-icon>);
            }
        }
        return stars;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className='d-flex justify-content-between gap-3 mb-3'>
            <img src={tour.TourImage} alt={tour.TourName} width={322} height={210}  className='rounded-3'/>
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div className='d-flex justify-content-between w-100 pe-3' style={{
                    borderRight: '1px solid #e0e0e0',
                }}>
                    <div>
                        <h4>{tour.TourName}</h4>
                        <p><ion-icon name="location-outline"></ion-icon> {tour.Location}</p>
                        <p><ion-icon name="time-outline"></ion-icon> {tour.NumberOfDays} ngày {tour.NumberOfNights}</p>
                        <p>{tour.RegisteredGuests}/{tour.MaxGuests}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-end'>
                        <div className='fw-medium text-success'>
                            {formatPrice(tour.Price)}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{
                width: '322px',
                height: '210px',
              display: 'flex',
              alignItems: 'center',
                flexDirection: 'column',
            }}>
                <img src={tour.User.Profile.ImageUser}  alt="" width={50} height={50}/>
                <h5>{tour.User.FullName}</h5>
                <small>{tour.User.Profile.Address}</small>
                <div>{renderStars(tour.User.Star)}</div>
                <p>{tour.User.CountConnect} chuyến đi</p>
            </div>
        </div>
    );
}

export default TourCard;
