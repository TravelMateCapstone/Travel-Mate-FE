import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import '../../assets/css/Profile/EditProfile.css';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [universities, setUniversities] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const apiUrlProfiel = 'https://travelmateapp.azurewebsites.net/api/Profile/current-profile';
  const apiLanguage = 'https://travelmateapp.azurewebsites.net/api/SpokenLanguages/current-user';
  const apiActivity = 'https://travelmateapp.azurewebsites.net/api/Activity';
  const apiUniversity = 'https://travelmateapp.azurewebsites.net/api/University';
  const apiUpdateProfile = 'https://travelmateapp.azurewebsites.net/api/Profile/edit-by-current-user';
  const [formData, setFormData] = useState({
    fullName: '',
    guestStatus: '',
    whereBorn: '',
    addressLiving: '',
    education: '',
    languageKnowned: '',
    languagueStudying: '',
    introduction: '',
    whyTravelMate: '',
    hobbies: [],
    musicFilmPhotos: '',
    imageUser: user.avatarUrl,
  });

  console.log(formData);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(apiUrlProfiel, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.data) {
          setFormData(prevState => ({
            ...prevState,
            fullName: response.data.fullName || '',
            guestStatus: response.data.hostingAvailability || '',
            whereBorn: response.data.address || '',
            addressLiving: response.data.city || '',
            introduction: response.data.description || '',
            whyTravelMate: response.data.whyUseTravelMate || '',
            musicFilmPhotos: response.data.musicMoviesBooks || '',
          }));
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const fetchActivity = async () => {
      try {
        const response = await axios.get(apiActivity, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.data && response.data.$values) {
          const hobbies = response.data.$values.map(activity => activity.activityName);
          setFormData(prevState => ({
            ...prevState,
            hobbies: hobbies,
          }));
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    const fetchLanguage = async () => {
      try {
        const response = await axios.get(apiLanguage, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.data && response.data.$values) {
          const languages = response.data.$values.map(lang => `${lang.languages.languagesName} (${lang.proficiency})`).join(', ');
          setFormData(prevState => ({
            ...prevState,
            languageKnowned: languages,
          }));
        }
      } catch (error) {
        console.error("Error fetching language data:", error);
      }
    };

    const fetchUniversities = async () => {
      try {
        const response = await axios.get(apiUniversity, {
          headers: {
            Authorization: `${token}`, // Ensure "Bearer" is included if required by the API
          },
        });
        if (response.data && response.data.$values) {
          setUniversities(response.data.$values);
        }
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    if (token) {
      fetchProfile();
      fetchActivity();
      fetchLanguage();
      fetchUniversities();
    }
  }, [token]);

  const handleSaveChanges = async () => {
    const payload = {
      fullName: formData.fullName,
      address: formData.whereBorn,
      city: formData.addressLiving,
      description: formData.introduction,
      hostingAvailability: formData.guestStatus,
      whyUseTravelMate: formData.whyTravelMate,
      musicMoviesBooks: formData.musicFilmPhotos,
      imageUser: user.avatarUrl,
    };

    try {
      const response = await axios.put(apiUpdateProfile, payload, {
        headers: {
          Authorization: `${token}`, // Ensure "Bearer" is included if required by the API
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  return (
    <div className="p-4 edit-pro-container border-0 w-100" style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)',
    }}>
      <Form>
        {/* Title */}
        <div className="d-flex justify-content-start mb-4">
          <h5 className="text-success me-4 fw-bolder">GIỚI THIỆU</h5>
          <h5 className=''><Link to={RoutePath.PROFILE_EDIT_MY_HOME} className='text-black fw-bolder'>NHÀ CỦA TÔI</Link></h5>
        </div>


        <Form.Group controlId="status" className="mb-3 align-items-center">
          <Form.Label className='fw-medium'>Tình trạng đón khách</Form.Label>
          <Form.Control
            as="select"
            className='label-small-form rounded-input'
            value={formData.guestStatus}
            onChange={(e) => setFormData({ ...formData, guestStatus: e.target.value })}
          >
            <option value="">Chọn tình trạng</option>
            <option value="Chào đón khách">Chào đón khách</option>
            <option value="Đang Bận">Đang Bận</option>
            <option value="Có thể nhận khách">Có thể nhận khách</option>
          </Form.Control>
        </Form.Group>


        <hr />


        <Row>
          {/* Left Column */}
          <Col md={6} className="pe-md-4">
            <Form.Group controlId="birthplace" className="mb-3">
              <Form.Label className='fw-medium'>Nơi tôi sinh ra</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' value={formData.whereBorn} onChange={(e) => setFormData({ ...formData, whereBorn: e.target.value })} />
            </Form.Group>

            <Form.Group controlId="address" className="mb-3">
              <Form.Label className='fw-medium'>Địa chỉ cư trú</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' value={formData.addressLiving} onChange={(e) => setFormData({ ...formData, addressLiving: e.target.value })} />
            </Form.Group>

            <Form.Group controlId="education" className="mb-3">
              <Form.Label className='fw-medium'>Giáo dục</Form.Label>
              <Form.Control as="select" className='label-small-form rounded-input' value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })}>
                <option value="">Chọn trường đại học</option>
                {universities.map(university => (
                  <option key={university.universityId} value={university.universityName}>
                    {university.universityName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          {/* Vertical Divider */}
          <Col md={1} className="d-flex justify-content-center align-items-center">
            <div style={{ borderLeft: '1px solid #ddd', height: '100%' }}></div>
          </Col>

          {/* Right Column */}
          <Col md={5} className="">
            <Form.Group controlId="knownLanguages" className="mb-3">
              <Form.Label className='fw-medium'>Ngôn ngữ đã biết</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' value={formData.languageKnowned} readOnly />
            </Form.Group>

            <Form.Group controlId="learningLanguages" className="mb-3">
              <Form.Label className='fw-medium'>Ngôn ngữ đang học</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' value={formData.languagueStudying} onChange={(e) => setFormData({ ...formData, languagueStudying: e.target.value })} />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <Form.Group controlId="bio" className="mb-3">
          <Form.Label className='fw-medium'>Giới thiệu</Form.Label>
          <Form.Control as="textarea" rows={3} className='text-form text-decription rounded-input' value={formData.introduction} onChange={(e) => setFormData({ ...formData, introduction: e.target.value })} />
        </Form.Group>

        <Form.Group controlId="whyTravelMate" className="mb-3">
          <Form.Label className='fw-medium'>Tại sao tôi sử dụng Travel Mate</Form.Label>
          <Form.Control as="textarea" rows={3} className='text-form text-decription rounded-input' value={formData.whyTravelMate} onChange={(e) => setFormData({ ...formData, whyTravelMate: e.target.value })} />
        </Form.Group>

        <Form.Group controlId="hobbies" className="mb-3 ">
          <Form.Label className='fw-medium'>Sở thích</Form.Label>
          <div className="p-2 d-flex gap-3 flex-wrap" style={{ minHeight: '40px', borderRadius: '20px', border: '1px solid black' }}>
            {formData.hobbies.map((hobby, index) => (
              <div key={index} className='px-3 rounded-5 fw-medium' style={{
                fontSize: '24px',
                border: '1px solid black'
              }}>{hobby}</div>
            ))}
          </div>
        </Form.Group>

        {/* Music, Movies, Books Section */}
        <Form.Group controlId="musicMoviesBooks" className="mb-3">
          <Form.Label className='fw-medium'>Âm nhạc, phim ảnh & sách</Form.Label>
          <Form.Control as="textarea" rows={3} className='text-form text-decription rounded-input' value={formData.musicFilmPhotos} onChange={(e) => setFormData({ ...formData, musicFilmPhotos: e.target.value })} />
        </Form.Group>

        {/* Save/Cancel Buttons */}
        <div className="d-flex justify-content-end mt-4">
          <Button variant="success" className="me-2" style={{ borderRadius: '20px' }} onClick={handleSaveChanges}>
            Lưu thay đổi
          </Button>
          <Button variant="secondary" style={{
            borderRadius: '20px',
            border: '1px solid',
            backgroundColor: 'white',
            color: 'black',
          }}>
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProfile;
