import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import "../../assets/css/Profile/MyHome.css";

function MyHome() {
  const dataProfile = useSelector(state => state.profile);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataProfile && dataProfile.home) {
      setLoading(false);
    }
  }, [dataProfile]);

  const renderDataOrFallback = (data) => {
    return data ? data : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Người dùng chưa cập nhập</span>;
  };

  return (
    <Container className='py-3 px-0 border-0 rounded-5 my-home-container'>
      <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">NHÀ CỦA TÔI</h2>

      <div className="mb-3 ms-lg-4 rounded-3 cus-prioritize">
        <h4 className="mx-4 mt-3">ƯU TIÊN</h4>
        <div className="px-3">
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="people-outline" style={{ fontSize: '16px' }}></ion-icon>
            <p className='fw-medium'>
              {loading ? <Skeleton width={150} /> : renderDataOrFallback(`Số lượng khách tối đa: ${dataProfile.home.maxGuests}`)}
            </p>
          </div>
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="male-female-outline" style={{ fontSize: '16px' }}></ion-icon>
            <p className='fw-medium'>
              {loading ? <Skeleton width={150} /> : renderDataOrFallback(`Giới tính tôi muốn đón: ${dataProfile.home.guestPreferences}`)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 ms-lg-4 rounded-3 cus-home">
        <h4 className="mx-4 mt-3">NƠI TÁ TÚC</h4>
        <div className="px-3">
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="bed-outline" style={{ fontSize: '24px' }}></ion-icon>
            <p className='fw-medium m-0 home-room-type'>
              {loading ? <Skeleton width={100} /> : renderDataOrFallback(dataProfile.home.roomDescription)}
            </p>
          </div>
          <p className="small ms-3 home-room-mate-info">
            {loading ? <Skeleton width={250} /> : renderDataOrFallback(dataProfile.home.roomMateInfo)}
          </p>
          <hr />
        </div>
      </div>

      <div className="mb-3 ms-lg-4 rounded-3 cus-details">
        <h4 className="mx-4 mt-3">CHI TIẾT</h4>
        <div className="px-3">
          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="accessibility-outline" style={{ fontSize: '24px' }}></ion-icon>
            <p className="fw-medium m-0">Thông tin phòng</p>
          </div>
          <p className="small ms-5 home-room-description">
            {loading ? <Skeleton width={200} /> : renderDataOrFallback(dataProfile.home.roomDescription)}
          </p>

          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="link-outline" style={{ fontSize: '24px' }}></ion-icon>
            <p className='fw-medium m-0 home-amenities'>Tiện ích</p>
          </div>
          <p className="small ms-5 home-amenities-description">
            {loading ? <Skeleton width={250} /> : renderDataOrFallback(dataProfile.home.amenities)}
          </p>

          <div className="small ms-3 d-flex gap-2">
            <ion-icon name="bus-outline" style={{ fontSize: '24px' }}></ion-icon>
            <p className='fw-medium m-0 home-transportation'>{loading ? <Skeleton width={100} /> : 'Phương tiện di chuyển'}</p>
          </div>
          <p className="small ms-5 home-transportation-description">
            {loading ? <Skeleton width={200} /> : renderDataOrFallback(dataProfile.home.transportation)}
          </p>
        </div>
      </div>

      <div className="mb-3 ms-lg-4 rounded-3 cus-images">
        <h5 className="mx-4 mt-3 d-flex">HÌNH ẢNH NHÀ CỦA BẠN</h5>
        <Row className="px-3 py-3">
          {loading ? (
            [1, 2, 3].map((index) => (
              <Col xs={12} md={4} className="mb-3" key={index}>
                <Skeleton height={200} className="rounded-3" />
              </Col>
            ))
          ) : (
            dataProfile.home?.homePhotos && dataProfile.home.homePhotos.$values.map((photo) => (
              <Col xs={12} md={4} className="mb-3" key={photo.photoId}>
                <img src={photo.homePhotoUrl} alt={`House ${photo.photoId}`} className="img-fluid rounded-3" />
              </Col>
            ))
          )}
        </Row>
      </div>
    </Container>
  );
}

export default React.memo(MyHome);
