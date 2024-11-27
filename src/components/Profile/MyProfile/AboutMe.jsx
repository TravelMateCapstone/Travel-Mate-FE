import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function AboutMe() {
    const [isEditing, setIsEditing] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [educations, setEducations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [profileData, setProfileData] = useState({});

    const dataProfile = useSelector(state => state.profile);

    const toggleEdit = () => {
        setIsEditing(!isEditing);

        if (!isEditing) {
            setProfileData({
                ...dataProfile.profile,
                education: dataProfile.education?.$values?.[0]?.university.universityId || '',
                hostingAvailability: dataProfile.profile?.hostingAvailability || '',
                city: dataProfile.profile?.city || '',  // Dùng trực tiếp city thay vì registeredLocation
            });
        }
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        fetchLocations();
        fetchLanguages();
        fetchHobbies();
        fetchEducation();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            const locationData = response.data.map(location => ({
                ...location,
                name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
            }));
            setLocations(locationData);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    const fetchLanguages = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/Languages");
            const data = await response.json();
            setLanguages(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ngôn ngữ:", error);
        }
    };

    const fetchHobbies = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/Activity");
            const data = await response.json();
            setHobbies(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sở thích:", error);
        }
    };

    const fetchEducation = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/University");
            const data = await response.json();
            setEducations(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách giáo dục:", error);
        }
    };

    const handleEditProfile = () => {
        // Tìm kiếm ngôn ngữ bằng languagesId
        const selectedLanguage = languages.find(lang => lang.languagesId === profileData.languages);
        console.log("Dữ liệu đã chỉnh sửa:", profileData);
    };

    const renderDataOrFallback = (data) => {
        return data ? data : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Chưa cập nhật</span>;
    };

    return (
        <Container>
            <div className='d-flex justify-content-between align-items-center'>
                <h5>Thông tin cá nhân</h5>
                <Button variant='warning' className='rounded-5' onClick={toggleEdit}>
                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
            </div>

            <hr className='my-4' />
            {/* Tình trạng đón khách */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Tình trạng đón khách</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            value={profileData.hostingAvailability || ''}
                            onChange={(e) => handleInputChange('hostingAvailability', e.target.value)}
                        >
                            <option value="Đang bận">Đang bận</option>
                            <option value="Chào đón khách">Chào đón khách</option>
                            <option value="Không nhận khách">Không nhận khách</option>
                        </Form.Select>
                    ) : (
                        renderDataOrFallback(dataProfile.profile?.hostingAvailability || null)
                    )}
                </Col>
            </Row>

            <hr />
            {/* Giáo dục */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Giáo dục</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            value={profileData.education || ''}
                            onChange={(e) => handleInputChange('education', e.target.value)}
                        >
                            {educations.length > 0 ? (
                                educations.map(education => (
                                    <option key={education.universityId} value={education.universityId}>
                                        {education.universityName}
                                    </option>
                                ))
                            ) : (
                                <option>Đang tải...</option>
                            )}
                        </Form.Select>
                    ) : (
                        renderDataOrFallback(dataProfile.education?.$values?.[0]?.university.universityName)
                    )}
                </Col>
            </Row>

            <hr />
            {/* Ngôn ngữ */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Ngôn ngữ sử dụng</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            value={profileData.languages || ''}
                            onChange={(e) => handleInputChange('languages', e.target.value)} // Gửi languagesId thay vì languagesName
                        >
                            {languages.length > 0 ? (
                                languages.map(language => (
                                    <option key={language.languagesId} value={language.languagesId}> {/* Lưu languagesId */}
                                        {language.languagesName}
                                    </option>
                                ))
                            ) : (
                                <option>Đang tải...</option>
                            )}
                        </Form.Select>
                    ) : (
                        renderDataOrFallback(
                            dataProfile.languages?.$values?.map((lang) => lang.languages.languagesName).join(", ")
                        )
                    )}
                </Col>
            </Row>

            <hr />
            {/* Quê quán */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Quê quán</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            value={profileData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                        >
                            {locations.map(location => (
                                <option key={location.code} value={location.name}>
                                    {location.name}
                                </option>
                            ))}
                        </Form.Select>
                    ) : (
                        renderDataOrFallback(dataProfile.profile?.address)
                    )}
                </Col>
            </Row>

            <hr />

            {/*Địa phương đăng ký */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Địa phương đăng ký</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            value={profileData.city || ''}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        >
                            {locations.map(location => (
                                <option key={location.code} value={location.name}>
                                    {location.name}
                                </option>
                            ))}
                        </Form.Select>
                    ) : (
                        renderDataOrFallback(dataProfile.profile?.city)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Sở thích */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Sở thích</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            onChange={(e) => handleInputChange('hobbie', e.target.value)}
                        >
                            {hobbies.map(hobbie => (
                                <option key={hobbie.activityId} value={hobbie.activityName}>
                                    {hobbie.activityName}
                                </option>
                            ))}
                        </Form.Select>
                    ) : (
                        dataProfile.activities?.$values?.map(activity => (
                            <span key={activity.activityId} className="badge bg-secondary">
                                {activity.activity.activityName}
                            </span>
                        )) || renderDataOrFallback(null)
                    )}
                </Col>
            </Row>
            <hr />
            {/* Giới thiệu */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Giới thiệu</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={profileData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(dataProfile.profile?.description)
                    )}
                </Col>
            </Row>
            <hr />
            {/* Tại sao tôi sử dụng Travel Mate */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Tại sao tôi sử dụng Travel Mate</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={profileData.whyUseTravelMate || ''}
                            onChange={(e) => handleInputChange('whyUseTravelMate', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(dataProfile.profile?.whyUseTravelMate)
                    )}
                </Col>
            </Row>

            <hr />
            {/* Âm nhạc, phim ảnh & sách */}
            <Row className='mb-3'>
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Âm nhạc, phim ảnh & sách</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={profileData.musicMoviesBooks || ''}
                            onChange={(e) => handleInputChange('musicMoviesBooks', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(dataProfile.profile?.musicMoviesBooks)
                    )}
                </Col>
            </Row>

            {
                isEditing && (
                    <Button variant='success' className='rounded-5' onClick={handleEditProfile}>
                        Lưu thay đổi
                    </Button>
                )
            }
        </Container >
    );
}

export default React.memo(AboutMe);
