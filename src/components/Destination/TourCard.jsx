import React from 'react';
import { Col, Row } from 'react-bootstrap';
import '../../assets/css/Tour/TourCard.css';

function TourCard({ tour }) {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<ion-icon key={i} name="star"></ion-icon>);
        }
        return stars;
    };

    return (
        <Row className="w-100 d-flex m-0 mb-3">
            <Col lg={3}>
                <img
                    src={tour.TourImage || 'https://via.placeholder.com/150'}
                    alt={tour.TourName || 'Chưa cập nhật'}
                    className="tour-image"
                />
            </Col>
            <Col lg={5} className="d-flex align-items-center">
                <div className="info_tour_container d-flex flex-column">
                    <h5 className="m-0">{tour.TourName || 'Chưa cập nhật'}</h5>
                    <p className="m-0 d-flex align-items-center gap-2">
                        <ion-icon name="location-outline"></ion-icon>
                        {tour.Location || 'Chưa cập nhật'}
                    </p>
                    <p className="m-0 d-flex align-items-center gap-2">
                        <ion-icon name="time-outline"></ion-icon>
                        {tour.NumberOfDays && tour.NumberOfNights
                            ? `${tour.NumberOfDays} ngày ${tour.NumberOfNights} đêm`
                            : 'Chưa cập nhật'}
                    </p>
                    <p className="m-0 d-flex align-items-center gap-2">
                        <ion-icon name="people-outline"></ion-icon>
                        {tour.RegisteredGuests && tour.MaxGuests
                            ? `${tour.RegisteredGuests}/${tour.MaxGuests}`
                            : 'Chưa cập nhật'}
                    </p>
                    <div className="d-flex justify-content-between align-items-end">
                        <p className="tour-description">
                            {tour.Description || 'Chưa cập nhật'}
                        </p>
                    </div>
                </div>
            </Col>
            <Col lg={2} className="d-flex align-items-center">
                <div className="d-flex justify-content-between align-items-end">
                    <p className="tour-price">
                        {tour.Price
                            ? new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(tour.Price)
                            : 'Chưa cập nhật'}
                    </p>
                </div>
            </Col>
            <Col lg={2} className="d-flex flex-column align-items-center">
                <img
                    src={tour.User?.Profile?.ImageUser || 'https://via.placeholder.com/100'}
                    alt="localAvatar"
                    className="local-avatar"
                />
                <label className="fw-semibold mb-0">
                    {tour.User?.FullName || 'Chưa cập nhật'}
                </label>
                <p className="m-0">{tour.User?.Profile?.Address || 'Chưa cập nhật'}</p>
                <div className="d-flex gap-2 m-0 p-0 align-items-center">
                    <p className="m-0">
                        {tour.User?.Star !== undefined ? tour.User.Star : 'Chưa cập nhật'}
                    </p>
                    {renderStars(tour.User?.Star || 0)}
                </div>
                <p>
                    {tour.User?.CountConnect !== undefined
                        ? `${tour.User.CountConnect} chuyến đi`
                        : 'Chưa cập nhật'}
                </p>
                <p>
                    {tour.StartDate
                        ? new Date(tour.StartDate).toLocaleDateString('vi-VN')
                        : 'Chưa cập nhật'}
                </p>
            </Col>
        </Row>
    );
}

export default TourCard;
