import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Dữ liệu cứng
const mockData = {
  location: {
    $values: [
      {
        location: { locationName: 'Tour Đà Lạt', city: 'Đà Lạt' },
        tourTime: '3 ngày 2 đêm',
        price: '3,000,000',
        participants: 15,
        maxParticipants: 20,
        status: 'approved',
        startDate: '2024-12-01',
      },
      {
        location: { locationName: 'Tour Hà Nội', city: 'Hà Nội' },
        tourTime: '2 ngày 1 đêm',
        price: '2,000,000',
        participants: 10,
        maxParticipants: 20,
        status: 'pending',
        startDate: '2024-12-05',
      },
      {
        location: { locationName: 'Tour Sapa', city: 'Sapa' },
        tourTime: '4 ngày 3 đêm',
        price: '4,500,000',
        participants: 20,
        maxParticipants: 20,
        status: 'approved',
        startDate: '2024-12-10',
      },
      {
        location: { locationName: 'Tour Hạ Long', city: 'Hạ Long' },
        tourTime: '3 ngày 2 đêm',
        price: '3,800,000',
        participants: 12,
        maxParticipants: 20,
        status: 'pending',
        startDate: '2024-12-15',
      },
    ],
  },
};

function MyFavorites() {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('approved');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  const dataProfile = mockData;

  const handlePageChange = (data) => setCurrentPage(data.selected);
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusFilterChange = (status) => setStatusFilter(status);

  const filteredFavorites = loading || !dataProfile.location || !dataProfile.location.$values
    ? []
    : dataProfile.location.$values.filter(fav =>
      fav.location.locationName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      fav.status === statusFilter
    );

  const displayedFavorites = filteredFavorites.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Container className='py-3 px-0 border-0 rounded-5'>
      {/* Header */}
      <Row className='align-items-center mb-3'>
        <Col lg={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm tours..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col lg={6} className="d-flex justify-content-end">
          <Button
            variant={statusFilter === 'approved' ? 'primary' : 'outline-primary'}
            className='me-2'
            onClick={() => handleStatusFilterChange('approved')}
          >
            Đã được duyệt
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'primary' : 'outline-primary'}
            onClick={() => handleStatusFilterChange('pending')}
          >
            Đang chờ duyệt
          </Button>
        </Col>
      </Row>

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
                <Row key={index} className="border-bottom rounded p-3 mb-3 bg-white">
                  {/* Phần Ảnh */}
                  <Col md={2} className="d-flex align-items-center">
                    <img
                      src={'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg'}
                      alt={favorite.location.locationName}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </Col>

                  {/* Phần thông tin */}
                  <Col md={4}>
                    <h5>{favorite.location.locationName}</h5>
                    <p className="d-flex align-items-center">
                      <ion-icon name="location-outline" style={{ marginRight: '8px' }}></ion-icon> {favorite.location.city}</p>
                    <p className="d-flex align-items-center">
                      <ion-icon name="time-outline" style={{ marginRight: '8px' }}></ion-icon> {favorite.tourTime}</p>
                  </Col>

                  {/* Phần giá và số lượng */}
                  <Col md={2} className="d-flex align-items-center">
                    <p>{favorite.price} VND</p>

                  </Col>

                  <Col md={3} className="d-flex flex-column justify-content-center align-items-center">
                    <p className="d-flex align-items-center">
                      <ion-icon name="people-outline" style={{ marginRight: '8px' }}></ion-icon>
                      {favorite.participants}/{favorite.maxParticipants}
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
          {Math.ceil(filteredFavorites.length / itemsPerPage) > 1 && (
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              pageCount={Math.ceil(filteredFavorites.length / itemsPerPage)}
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active-pagination'}
            />
          )}
        </div>
      )}
    </Container>
  );
}

export default MyFavorites;
