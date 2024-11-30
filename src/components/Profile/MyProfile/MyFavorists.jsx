import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../../routes/RoutePath';
import { useDispatch } from 'react-redux';
import { fetchTour } from '../../../redux/actions/tourActions';

function MyFavorites() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 8;
  const dispatch = useDispatch();

  const fetchFavorites = async () => {
    const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Tour/local');
    return response.data;
  };

  const { data: dataProfile, isLoading: loading } = useQuery('favorites', fetchFavorites);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handeleViewTour = (tour) => {
    dispatch(fetchTour(tour.tourId));
    navigate(RoutePath.TOUR_DETAIL);
  }

  const displayedFavorites = loading || !dataProfile || !dataProfile.$values
    ? []
    : dataProfile.$values;

  return (
    <Container className='py-3 px-0 border-0 rounded-5'>
      {/* Content */}
      {loading ? (
        <Skeleton height={200} count={4} style={{ marginBottom: '20px' }} />
      ) : (
        <div>
          {displayedFavorites.length === 0 ? (
            <div className="text-center" style={{ fontStyle: 'italic', color: '#6c757d' }}>
              Không có tours nào
            </div>
          ) : (
            <div className='px-3'>
              {displayedFavorites.map((favorite, index) => (
                <Row key={index} className="border-bottom rounded p-3 mb-3 bg-white" onClick={() => handeleViewTour(favorite)}>
                  {/* Phần Ảnh */}
                  <Col md={2} className="d-flex align-items-center">
                    <img
                      src={favorite.tourImage}
                      alt={favorite.tourName}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </Col>

                  {/* Phần thông tin */}
                  <Col md={4}>
                    <h5>{favorite.tourName}</h5>
                    <p className="d-flex align-items-center">
                      <ion-icon name="location-outline" style={{ marginRight: '8px' }}></ion-icon> {favorite.location}</p>
                    <p className="d-flex align-items-center">
                      <ion-icon name="time-outline" style={{ marginRight: '8px' }}></ion-icon> {favorite.numberOfDays} ngày {favorite.numberOfNights} đêm</p>
                  </Col>

                  {/* Phần giá và số lượng */}
                  <Col md={2} className="d-flex align-items-center">
                    <p>{formatPrice(favorite.price)}</p>
                  </Col>

                  <Col md={3} className="d-flex flex-column justify-content-center align-items-center">
                    <p className="d-flex align-items-center">
                      <ion-icon name="people-outline" style={{ marginRight: '8px' }}></ion-icon>
                      {favorite.maxGuests}
                    </p>
                    <p className="d-flex align-items-center">
                      {favorite.status}
                    </p>
                    <p className="d-flex align-items-center">
                      {favorite.startDate}
                    </p>
                  </Col>

                  {/* Icon cài đặt */}
                  <Col md={1} className="d-flex align-items-center justify-content-center">
                    <ion-icon name="settings-outline"></ion-icon>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default MyFavorites;
