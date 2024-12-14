import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { viewProfile } from '../../redux/actions/profileActions';
import RoutePath from '../../routes/RoutePath';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Search/Search.css';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';

function SearchListTraveller() {
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const itemsPerPage = 4;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchActivities = async () => {
    const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Activity');
    return response.data.$values.map((activity) => ({
      id: activity.activityId,
      name: activity.activityName,
    }));
  };

  const fetchTravellers = async () => {
    const response = await axios.get('https://travelmateapp.azurewebsites.net/GetUsersWithDetail-byRole/traveler');
    return response.data.$values.map((user) => ({
      id: user.userId,
      avatar: user.profile?.imageUser || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon_561158-3467.jpg',
      name: user.fullName || 'Chưa xác định',
      age: user.cccd?.age || 'Chưa xác định',
      gender: user.cccd?.sex || 'Chưa xác định',
      address: user.profile?.address || 'Chưa xác định',
      description: '',
      rating: user.star || 0,
      connections: user.countConnect || 0,
      activeTime: 'Chưa xác định',
      hobbies: user.activityIds.$values || [],
      locations: user.locationIds.$values || []
    }));
  };

  const fetchLocations = async () => {
    const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Locations');
    return response.data.$values.map((location) => ({
      code: location.locationId,
      name: location.locationName,
    }));
  };

  const { data: allHobbies = [] } = useQuery('activities', fetchActivities);
  const { data: locals = [], isLoading: isLoadingTravellers } = useQuery('travellers', fetchTravellers);
  const { data: locations = [] } = useQuery('locations', fetchLocations);

  const token = useSelector((state) => state.auth.token);

  const renderPlaceholder = () => (
    <Row className="border-bottom p-3">
      <Col md={2}>
        <div className="placeholder-avatar" style={{ width: '100%', height: '150px', backgroundColor: '#e0e0e0' }}></div>
      </Col>
      <Col md={8}>
        <div className="placeholder-text" style={{ width: '50%', height: '20px', backgroundColor: '#e0e0e0', marginBottom: '10px' }}></div>
        <div className="placeholder-text" style={{ width: '80%', height: '15px', backgroundColor: '#e0e0e0', marginBottom: '10px' }}></div>
        <div className="placeholder-text" style={{ width: '60%', height: '15px', backgroundColor: '#e0e0e0' }}></div>
      </Col>
      <Col md={2}>
        <div className="placeholder-stars" style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', marginBottom: '10px' }}></div>
        <div className="placeholder-text" style={{ width: '50%', height: '15px', backgroundColor: '#e0e0e0' }}></div>
      </Col>
    </Row>
  );

  const handleUserClick = (userId) => {
    dispatch(viewProfile(userId, token));
    navigate(RoutePath.OTHERS_PROFILE);
  };

  const filteredLocals = locals.filter((local) => {
    const matchesName = local.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAddress = local.address.toLowerCase().includes(address.toLowerCase());
    const matchesGender = !gender || local.gender.toLowerCase() === gender.toLowerCase();
    const matchesAge = local.age === 'Chưa xác định' || (local.age >= ageRange[0] && local.age <= ageRange[1]);
    const matchesHobby = selectedHobbies.length === 0 || selectedHobbies.every((hobby) => local.hobbies.includes(hobby));
    const matchesLocation = !selectedLocation || local.locations.includes(selectedLocation);

    return matchesName && matchesAddress && matchesGender && matchesAge && matchesHobby && matchesLocation;
  });

  const displayedLocals = filteredLocals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Container fluid style={{ padding: '0 70px' }}>
      <ToastContainer />
      <Row>
        <Col md={3} style={{
          borderRadius: '20px',
          borderColor: '#e0e0e0',
          padding: '20px',
          height: 'fit-content',
          border: '1px solid #e0e0e0',
        }}>
          <Form.Group className="mb-4">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              className='rounded-3'
              type="text"
              placeholder="Nhập tên người dùng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Địa điểm</Form.Label>
            <Form.Select
              className='rounded-3'
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Tất cả</option>
              {locations.map((location) => (
                <option key={location.code} value={location.name}>
                  {location.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select
              className='rounded-3'
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Độ tuổi</Form.Label>
            <Form.Range
              value={ageRange[1]}
              min={18}
              max={60}
              onChange={(e) => setAgeRange([18, parseInt(e.target.value)])}
            />
            <div>{ageRange[0]} - {ageRange[1]} tuổi</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sở thích</Form.Label>
            <div>
              {allHobbies.map((hobby) => (
                <Button
                  key={hobby.id}
                  variant={selectedHobbies.includes(hobby.name) ? 'success' : 'outline-secondary'}
                  onClick={() => {
                    setSelectedHobbies((prev) =>
                      prev.includes(hobby.name)
                        ? prev.filter((h) => h !== hobby.name)
                        : [...prev, hobby.name]
                    );
                  }}
                  className="m-1"
                >
                  {hobby.name}
                </Button>
              ))}
            </div>
          </Form.Group>
        </Col>
        <Col md={9}>
          {isLoadingTravellers ? (
            <div className="">
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <React.Fragment key={index}>
                  {renderPlaceholder()}
                </React.Fragment>
              ))}
            </div>
          ) : filteredLocals.length === 0 ? (
            <div className="text-center">Không tìm thấy kết quả.</div>
          ) : (
            displayedLocals.map((local) => (
              <Row key={local.id} className="border-bottom p-3" onClick={() => handleUserClick(local.id)}>
                <Col md={2}>
                  <img src={local.avatar} alt="Avatar" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                </Col>
                <Col md={8}>
                  <h6>{local.name} ({local.age} tuổi, {local.gender})</h6>
                  <p>Địa chỉ: {local.address}</p>
                  <p>Sở thích: {local.hobbies.join(', ')}</p>
                </Col>
                <Col md={2}>
                  <p>{local.rating} sao</p>
                  <p>{local.connections} kết nối</p>
                </Col>
              </Row>
            ))
          )}
          <ReactPaginate
            previousLabel={'Trước'}
            nextLabel={'Tiếp'}
            pageCount={Math.ceil(filteredLocals.length / itemsPerPage)}
            onPageChange={(data) => setCurrentPage(data.selected)}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default SearchListTraveller;