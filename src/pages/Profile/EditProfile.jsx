import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import '../../assets/css/Profile/EditProfile.css';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';

const fetchProfile = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Profile/current-profile`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data;
};

const fetchActivity = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Activity`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data.$values;
};

const fetchLanguage = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/SpokenLanguages/current-user`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data.$values;
};

const fetchUniversities = async (token) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/University`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return response.data.$values;
};

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
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
    imageUser: user.avatarUrl || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw',
  });
  const [isSaving, setIsSaving] = useState(false);

  const { data: profileData } = useQuery(['profile', token], () => fetchProfile(token), { enabled: !!token });
  const { data: activityData } = useQuery(['activity', token], () => fetchActivity(token), { enabled: !!token });
  const { data: languageData } = useQuery(['language', token], () => fetchLanguage(token), { enabled: !!token });
  const { data: universitiesData } = useQuery(['universities', token], () => fetchUniversities(token), { enabled: !!token });

  useEffect(() => {
    if (profileData) {
      setFormData(prevState => ({
        ...prevState,
        fullName: profileData.fullName || '',
        guestStatus: profileData.hostingAvailability || '',
        whereBorn: profileData.address || '',
        addressLiving: profileData.city || '',
        introduction: profileData.description || '',
        whyTravelMate: profileData.whyUseTravelMate || '',
        musicFilmPhotos: profileData.musicMoviesBooks || '',
      }));
    }
  }, [profileData]);

  useEffect(() => {
    if (activityData) {
      const hobbies = activityData.map(activity => activity.activityName);
      setFormData(prevState => ({
        ...prevState,
        hobbies: hobbies,
      }));
    }
  }, [activityData]);

  useEffect(() => {
    if (languageData) {
      const languages = languageData.map(lang => `${lang.languages.languagesName} (${lang.proficiency})`).join(', ');
      setFormData(prevState => ({
        ...prevState,
        languageKnowned: languages,
      }));
    }
  }, [languageData]);

  const universities = useMemo(() => universitiesData || [], [universitiesData]);

  const handleSaveChanges = useCallback(async () => {
    setIsSaving(true);
    const payload = {
      fullName: formData.fullName,
      address: formData.whereBorn,
      city: formData.addressLiving,
      description: formData.introduction,
      hostingAvailability: formData.guestStatus,
      whyUseTravelMate: formData.whyTravelMate,
      musicMoviesBooks: formData.musicFilmPhotos,
      imageUser: user.avatarUrl || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw',
    };

    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/api/Profile/edit-by-current-user`, payload, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
      alert("An error occurred while updating the profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [formData, token, user.avatarUrl]);

  return (
    <div className="p-4 edit-pro-container border-0 w-100 box-shadow">
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
          <Button variant="success" className="me-2 rounded-button" onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <><Spinner animation="border" size="sm" /> Đang lưu</> : 'Lưu thay đổi'}
          </Button>
          <Button variant="secondary" className="rounded-button cancel-button" disabled={isSaving}>
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProfile;
