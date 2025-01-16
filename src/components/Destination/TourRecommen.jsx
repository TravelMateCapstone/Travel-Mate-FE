import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTour } from '../../redux/actions/tourActions';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import '../../assets/css/Tour/TourRecommen.css';

function TourRecommen({ tour }) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();

    // Hàm định dạng giá
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Hàm định dạng ngày và đêm
    const formatDaysNights = (days, nights) => {
        if (days === 0 && nights === -1) {
            return '1 ngày, 0 đêm';
        }
        return `${days + 1} ngày, ${nights + 1} đêm`;
    };

    // Hàm định dạng ngày thành kiểu Việt Nam
    const formatDateToVietnamese = (date) => {
        const parsedDate = new Date(date);
        const day = String(parsedDate.getUTCDate()).padStart(2, '0');
        const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    // Xử lý khi click vào tour
    const handleTourClick = () => {
        dispatch(fetchTour(tour.tourId, token));
        navigate(RoutePath.TOUR_DETAIL);
    };

    return (
        <Card className="recommen-tour-card" onClick={handleTourClick}>
            <Card.Img
                variant="top"
                src={tour.tourImage}
                alt={tour.tourName}
                className="recommen-tour-card-img"
            />
            <Card.Body className="recommen-tour-card-body">
                <Card.Title className="recommen-tour-card-title">{tour.tourName}</Card.Title>
                <Card.Text className="recommen-tour-card-text">
                    <strong>Địa điểm:</strong> {tour.location} <br />
                    <strong>Mô tả:</strong> {tour.tourDescription} <br />
                    <strong>Ngày khởi hành:</strong> {tour.startDates.$values.map(formatDateToVietnamese).join(', ')} <br />
                    <strong>Thời gian:</strong> {formatDaysNights(tour.numberOfDays, tour.numberOfNights)} <br />
                    <strong>Số khách tối đa:</strong> {tour.maxGuests} <br />
                    <strong>Giá:</strong> {formatPrice(tour.price)}
                </Card.Text>
            </Card.Body>
            <div className="recommen-tour-card-footer m-2">
                <Button className="recommen-tour-card-button">Đặt ngay</Button>
            </div>
        </Card>
    );
}

export default TourRecommen;
