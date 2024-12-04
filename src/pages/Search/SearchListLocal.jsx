import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho Toast
import '../../assets/css/Search/Search.css';
import { useDispatch } from 'react-redux';
import { viewProfile } from '../../redux/actions/profileActions';
import RoutePath from '../../routes/RoutePath';
import { useNavigate } from 'react-router-dom';

function SearchListLocal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [locals, setLocals] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [allHobbies, setAllHobbies] = useState([]);
  const itemsPerPage = 4;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
    fetchLocals();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Locations');
      const locationData = response.data.$values.map(location => ({
        code: location.locationId,
        name: location.locationName,
      }));
      setLocations(locationData);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchLocals = async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Profile');
      const profiles = response.data.$values.map(profile => ({
        id: profile.profileId,
        avatar: profile.imageUser || '',
        name: profile.user.fullName || 'Chưa xác định',
        age: profile.user.birthdate ? new Date().getFullYear() - new Date(profile.user.birthdate).getFullYear() : 'Chưa xác định',
        gender: profile.gender || 'Chưa xác định',
        address: `${profile.address}, ${profile.city}` || 'Chưa xác định',
        description: profile.description || 'Không có mô tả',
        guestStatus: profile.hostingAvailability || 'Không rõ',
        rating: 'Chưa xác định',
        connections: 'Chưa xác định',
        activeTime: new Date(profile.user.registrationTime).toLocaleDateString() || 'Chưa xác định',
        userId: profile.user.id,
        hobbies: []
      }));
      const profilesWithHobbies = await Promise.all(profiles.map(async (profile) => {
        const hobbies = await fetchUserHobbies(profile.userId);
        return { ...profile, hobbies };
      }));
      setLocals(profilesWithHobbies);
      setAllHobbies([...new Set(profilesWithHobbies.flatMap(local => local.hobbies))]);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const fetchUserHobbies = async (userId) => {
    try {
      const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/user/${userId}`);
      return response.data.$values.map(activity => activity.activity.activityName);
    } catch (error) {
      console.error(`Error fetching hobbies for user ${userId}:`, error);
      return [];
    }
  };

  const handleUserClick = (userId) => {
    dispatch(viewProfile(userId));
    navigate(RoutePath.OTHERS_PROFILE);
  };

  const filteredLocals = locals.filter((local) => {
    const matchesName = local.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAddress = local.address.toLowerCase().includes(address.toLowerCase());
    const matchesGender = !gender || local.gender.toLowerCase() === gender.toLowerCase();
    const matchesAge = local.age === 'Chưa xác định' || (local.age >= ageRange[0] && local.age <= ageRange[1]);
    const matchesHobby = selectedHobbies.length === 0 || selectedHobbies.some(hobby => local.hobbies.includes(hobby));
    const matchesLocation = !selectedLocation || local.address.includes(selectedLocation);
    return matchesName && matchesAddress && matchesGender && matchesAge && matchesHobby && matchesLocation;
  });

  const displayedLocals = filteredLocals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Container fluid style={{ padding: '10px', width: '90%' }}>
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị Toast */}
      <Row>
        <h3 className="mb-3">Người địa phương</h3>
        {/* Phần Lọc */}
        <Col md={3} className="border-end">
          <Form.Group className="mb-3">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa điểm</Form.Label>
            <Form.Select
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

          <Form.Group className="mb-3">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
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
            <div className="hobby-list" style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '10px' }}>
              {allHobbies.map((item, index) => (
                <Button
                  key={index}
                  variant={selectedHobbies.includes(item) ? 'primary' : 'outline-secondary'}
                  onClick={() => {
                    setSelectedHobbies((prev) =>
                      prev.includes(item) ? prev : [...prev, item]
                    );
                  }}
                  style={{ margin: '2px', padding: '5px 10px' }}
                >
                  {item}
                </Button>
              ))}
            </div>

            <div className="selected-hobbies">
              {selectedHobbies.map((hobby, index) => (
                <span key={index} className="selected-hobby">
                  {hobby}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
                    }}
                    style={{ marginLeft: '5px', padding: '2px 5px' }}
                  >
                    &times;
                  </Button>
                </span>
              ))}
            </div>
          </Form.Group>
        </Col>

        {/* Phần Danh Sách */}
        <Col md={9}>
          {filteredLocals.length === 0 ? (
            <div className="text-center">Không tìm thấy kết quả.</div>
          ) : (
            displayedLocals.map((local) => (
              <Row key={local.id} className="border-bottom p-3" onClick={() => handleUserClick(local.userId)} style={{ cursor: 'pointer' }}>
                <Col md={2}>
                  <img
                    src={local.avatar}
                    alt="Avatar"
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Col>
                <Col md={8}>
                  <h6>{local.name} ({local.age} tuổi, {local.gender})</h6>
                  <p><ion-icon name="location-outline"></ion-icon> {local.address}</p>
                  <p>Mô tả: {local.description}</p>
                  <p>Sở thích: {local.hobbies.join(', ')}</p>
                  <p style={{ color: 'green' }}><ion-icon name="walk-outline"></ion-icon> {local.guestStatus}</p>
                </Col>
                <Col md={2}>
                  <p><ion-icon name="star-outline"></ion-icon> {local.rating} sao</p>
                  <p><ion-icon name="people-outline"></ion-icon> {local.connections} kết nối</p>
                  <p>Tham gia từ {local.activeTime}</p>
                </Col>
              </Row>
            ))
          )}
          {filteredLocals.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={'Trước'}
              nextLabel={'Sau'}
              breakLabel={'...'}
              pageCount={Math.ceil(filteredLocals.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={({ selected }) => setCurrentPage(selected)}
              containerClassName={'pagination justify-content-center'}
              activeClassName={'active'}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchListLocal;
