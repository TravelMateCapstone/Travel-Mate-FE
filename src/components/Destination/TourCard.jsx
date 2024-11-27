import React from 'react'
import { Col, Row } from 'react-bootstrap'
import '../../assets/css/Tour/TourCard.css'
function TourCard({ tour }) {

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<ion-icon key={i} name="star"></ion-icon>);
        }
        return stars;
    };

    return (
        <Row className='w-100 d-flex m-0 mb-3'>
            <Col lg={3}>
                <img src={tour.image} alt="" className='tour-image' />
            </Col>
            <Col lg={7} className='d-flex align-items-center'>
                <div className='info_tour_container d-flex flex-column'>
                    <h5 className='m-0'>{tour.name}</h5>
                    <p className='m-0 d-flex align-items-center gap-2'><ion-icon name="location-outline"></ion-icon>{tour.destination}</p>
                    <p className='m-0 d-flex align-items-center gap-2'><ion-icon name="time-outline"></ion-icon> {tour.duration}</p>
                    <p className='m-0 d-flex align-items-center gap-2'><ion-icon name="people-outline"></ion-icon> {tour.participants}</p>
                    <div className='d-flex justify-content-between align-items-end'>
                        <p className='tour-description'>{tour.description}</p>
                        <p className='tour-price'>{tour.price}</p>
                    </div>
                </div>
            </Col>
            <Col lg={2} className='d-flex flex-column align-items-center'>
                <img src={tour.localAvatar} alt="localAvatar" className='local-avatar' />
                <label className='fw-semibold mb-0'>{tour.localName}</label>
                <p className='m-0'>{tour.localLocation}</p>
                <div className='d-flex gap-2 m-0 p-0 align-items-center'>
                <p className='m-0'>{tour.rating}</p>
                    {renderStars(tour.rating)}
                </div>
                <p>{tour.trip} chuyến đi</p>
                <p>{tour.timeParticipate}</p>
            </Col>
        </Row>
    )
}

export default TourCard