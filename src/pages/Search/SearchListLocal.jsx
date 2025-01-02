import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { viewProfile } from '../../redux/actions/profileActions';
import RoutePath from '../../routes/RoutePath';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/Search/Search.css';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';

function SearchListLocal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locals, setLocals] = useState([]);
  const [allHobbies, setAllHobbies] = useState([]);
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

  const fetchLocals = async () => {
    const response = await axios.get('https://travelmateapp.azurewebsites.net/GetUsersWithDetail');
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

  const { data: activitiesData, error: activitiesError } = useQuery('activities', fetchActivities);
  const { data: localsData, error: localsError } = useQuery('locals', fetchLocals);
  const { data: locationsData, error: locationsError } = useQuery('locations', fetchLocations);

  useEffect(() => {
    if (activitiesData) setAllHobbies(activitiesData);
    if (localsData) setLocals(localsData);
    if (locationsData) setLocations(locationsData);
  }, [activitiesData, localsData, locationsData]);

  const token = useSelector((state) => state.auth.token);

  const handleUserClick = useCallback((userId) => {
    dispatch(viewProfile(userId, token));
    navigate(RoutePath.OTHERS_PROFILE);
  }, [dispatch, token, navigate]);

  const filteredLocals = useMemo(() => locals.filter((local) => {
    const matchesName = local.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAddress = local.address.toLowerCase().includes(address.toLowerCase());
    const matchesGender = !gender || local.gender.toLowerCase() === gender.toLowerCase();
    const matchesAge = local.age === 'Chưa xác định' || (local.age >= ageRange[0] && local.age <= ageRange[1]);
    // const matchesHobby = selectedHobbies.length;
    // const matchesHobby = selectedHobbies.length === 0 || selectedHobbies.every((hobby) => local.hobbies.includes(hobby));
    const matchesHobby = selectedHobbies.length === 0 || local.hobbies.some((hobby) => selectedHobbies.includes(hobby));
    const matchesLocation = !selectedLocation || local.locations.includes(selectedLocation);

    return matchesName && matchesAddress && matchesGender && matchesAge && matchesHobby && matchesLocation;
  }), [locals, searchTerm, address, gender, ageRange, selectedHobbies, selectedLocation]);

  const displayedLocals = useMemo(() => filteredLocals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage), [filteredLocals, currentPage, itemsPerPage]);

  const renderStars = useCallback((rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <ion-icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          style={{ color: i <= rating ? '#FFD700' : '#000000', fontSize: '20px' }}
        />
      );
    }
    return stars;
  }, []);

  const renderPlaceholder = useCallback(() => (
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
  ), []);

  return (
    <Container fluid style={{ padding: '0 70px' }}>
      <h4 className='text-uppercase text-success'>Người đồng hành</h4>
      <Row className='mt-4'>
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
            <Form.Label>Địa chỉ hiện tại</Form.Label>
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
              <option value="NAM">Nam</option>
              <option value="NỮ">Nữ</option>
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
        <Col md={9} style={{
          height: 'fit-content',
        }}>
          {localsData === undefined ? (
            <>
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <React.Fragment key={index}>
                  {renderPlaceholder()}
                </React.Fragment>
              ))}
            </>
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
                  <p>Quê quán: {local.address}</p>
                  <p>Địa điểm hiện tại: {local.locations.length > 0 ? local.locations.join(', ') : 'Chưa xác định'}</p>
                  <p>Sở thích: {local.hobbies.join(', ')}</p>
                </Col>

                <Col md={2}>
                  <div>{renderStars(local.rating)}</div>
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

export default SearchListLocal;