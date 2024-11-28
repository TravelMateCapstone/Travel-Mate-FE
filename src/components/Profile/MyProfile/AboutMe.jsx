import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { viewProfile } from '../../../redux/actions/profileActions';


function AboutMe() {
    const [isEditing, setIsEditing] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [educations, setEducations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [citys, setCitys] = useState([]);

    const [profileData, setProfileData] = useState({});

    const dataProfile = useSelector(state => state.profile);

    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        fetchCitys();
    }, []);

    const fetchCitys = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            const cityData = response.data.map(city => ({
                ...city,
                name: city.name.replace(/^Tỉnh |^Thành phố /, ''),
            }));
            setCitys(cityData);
        } catch (error) {
            console.error("Error fetching city:", error);
        }
    };

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

    const handleEditProfile = async () => {
        try {
            const dataToSubmit = {
                fullName: profileData.fullName || null,
                firstName: profileData.firstName || null,
                lastName: profileData.lastName || null,
                address: profileData.address || null,
                phone: profileData.phone || null,
                gender: profileData.gender || null,
                birthdate: profileData.birthdate || null,
                city: profileData.city || null,
                description: profileData.description || null,
                hostingAvailability: profileData.hostingAvailability || null,
                whyUseTravelMate: profileData.whyUseTravelMate || null,
                musicMoviesBooks: profileData.musicMoviesBooks || null,
                whatToShare: profileData.whatToShare || null,
                imageUser: profileData.imageUser || null,
            };

            await axios.put(
                'https://travelmateapp.azurewebsites.net/api/Profile/edit-by-current-user',
                dataToSubmit,
                { headers: { Authorization: `${token}` } }
            );

            // Kiểm tra và gọi API thêm ngôn ngữ nếu cần
            const selectedLanguage = languages.find(lang => lang.languagesId === parseInt(profileData.languages));
            const isLanguageExist = dataProfile.languages?.$values?.some(lang => lang.languages.languagesId === selectedLanguage?.languagesId);

            if (!isLanguageExist && selectedLanguage) {
                await axios.post(
                    'https://travelmateapp.azurewebsites.net/api/SpokenLanguages/add-by-current-user',
                    { languagesId: selectedLanguage.languagesId, proficiency: 'Tốt' },
                    { headers: { Authorization: `${token}` } }
                );
            }

            // Kiểm tra và gọi API thêm giáo dục nếu cần
            const selectedEducation = educations.find(edu => edu.universityId === parseInt(profileData.education));
            const isEducationExist = dataProfile.education?.$values?.some(edu => edu.university.universityId === selectedEducation?.universityId);

            if (!isEducationExist && selectedEducation) {
                await axios.post(
                    'https://travelmateapp.azurewebsites.net/api/UserEducation/add-by-current-user',
                    {
                        universityId: selectedEducation.universityId,
                        graduationYear: '2025-02-25T15:16:15.239' // Thay thế bằng giá trị thật từ form nếu có
                    },
                    { headers: { Authorization: `${token}` } }
                );
            }

            // Kiểm tra và gọi API thêm sở thích nếu cần
            const selectedHobby = hobbies.find(hobby => hobby.activityId === parseInt(profileData.hobbie));

            const isHobbyExist = dataProfile.activities?.$values?.some(act => act.activity.activityId === selectedHobby?.activityId);
            console.log("id", selectedHobby);

            if (!isHobbyExist && selectedHobby) {
                await axios.post(
                    'https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/edit-by-current-user',
                    { activityId: selectedHobby.activityId },
                    { headers: { Authorization: `${token}` } }
                );
            }

            dispatch(viewProfile(user.id));

            toast.success('Cập nhật hồ sơ thành công!');

        } catch (error) {
            toast.error('Lỗi khi cập nhật hồ sơ hoặc thêm thông tin!');
            console.error('Lỗi khi cập nhật hồ sơ:', error);
        } finally {
            setIsEditing(false); // Đóng chế độ chỉnh sửa
        }
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
                        renderDataOrFallback(
                            dataProfile.education?.$values?.map((edu) => `${edu.university.universityName}`).join(", ")
                            // dataProfile.education?.$values?.map((edu) => `${edu.university.universityName} (${new Date(edu.graduationYear).getFullYear()})`).join(", ")
                        )
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
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        >
                            {citys.map(city => (
                                <option key={city.code} value={city.name}>
                                    {city.name}
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
                            value={profileData.hobbie || ''}  // Sử dụng activityId làm giá trị
                            onChange={(e) => handleInputChange('hobbie', e.target.value)} // Lưu activityId
                        >
                            {hobbies.map(hobbie => (
                                <option key={hobbie.activityId} value={hobbie.activityId}> {/* Lưu activityId */}
                                    {hobbie.activityName}
                                </option>
                            ))}
                        </Form.Select>

                    ) : (
                        dataProfile.activities?.$values?.map(activity => (
                            <span key={activity.activityId} className="badge bg-secondary mr-2">
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
                    <Form.Label>Công việc hiện tại</Form.Label>
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