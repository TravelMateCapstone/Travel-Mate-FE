import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import '../../assets/css/ProfileManagement/MyProfile.css'
import PostProfile from '../../components/Profile/PostProfile';
import { useSelector } from 'react-redux';
import UploadImageComponent from '../../components/Shared/UploadImageComponent';

import Favorites from '../../components/Profile/Favorites';
import AboutMe from '../../components/Profile/AboutMe';
import Friends from '../../components/Profile/Friends';

function MyProfile() {
    const [key, setKey] = useState('introduce');
    const [showModalForm, setShowModalForm] = useState(false);
    const handleShowModalForm = () => setShowModalForm(true);
    const handleCloseModalForm = () => setShowModalForm(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [posts, setPosts] = useState([]);

    const [languages, setLanguages] = useState([]); // danh sách ngôn ngữ trong hệ thống
    const [language, setLanguage] = useState();

    const [hobbies, setHobbies] = useState([]); // danh sách sở thích trong hệ thống
    const [hobbie, setHobbie] = useState();

    const [educations, setEducations] = useState([]); // danh sách giáo dục trong hệ thống
    const [education, setEducation] = useState();

    const [locations, setLocations] = useState([]);
    const [city, setCity] = useState();

    const dataProfile = useSelector(state => state.profile);

    const handleUploadImages = (urls) => {
        setUploadedImages(urls);
    };
    console.log("profile", dataProfile);
    useEffect(() => {
        // Lấy ra trip
        if (dataProfile?.trip?.$values && Array.isArray(dataProfile.trip.$values)) {
            setPosts(dataProfile.trip.$values);
        }
        fetchLocations();


        fetchLanguages();
        fetchHobbies();
        fetchEducation();
    }, [dataProfile]);

    // Lấy ra 64 tỉnh thành
    const fetchLocations = async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/p/');
            const locationData = response.data.map((location) => ({
                ...location,
                name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
            }));
            setLocations(locationData);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    // Lấy ra danh sách sở thích
    const fetchHobbies = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/Activity");
            const data = await response.json();
            setHobbies(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sở thích:", error);
        }
    };

    //Lấy danh sách Education
    const fetchEducation = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/University");
            const data = await response.json();
            setEducations(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách giáo dục:", error);
        }
    };

    // API get All ngôn ngữ 
    const fetchLanguages = async () => {
        try {
            const response = await fetch("https://travelmateapp.azurewebsites.net/api/Languages");
            const data = await response.json();
            setLanguages(data.$values || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ngôn ngữ:", error);
        }
    };

    // Thời gian tham gia
    const registrationDate = dataProfile?.profile?.user?.registrationTime
        ? new Date(dataProfile.profile.user.registrationTime).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Không rõ";

    // Chỉnh sửa Profile
    const handleEditProfile = async () => {

    }

    return (
        <Container>

            <div className='info_section'>
                <div className='info_user_profile'>
                    <img
                        src={dataProfile.profile.imageUser}
                        alt="avatar"
                        width={150}
                        height={150}
                        className='rounded-circle object-fit-cover'
                        style={{
                            border: "2px solid #d9d9d9",
                        }} />

                    <div className='info_user_profile_content'>
                        <h4>{dataProfile.profile.user.fullName}</h4>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="location-outline"></ion-icon> {dataProfile.profile.city}</p>
                        <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="person-add-outline"></ion-icon> Thành viên tham gia từ {registrationDate}</p>
                        <p className='text-success fw-medium  d-flex align-items-center gap-2'><ion-icon name="shield-checkmark-outline"></ion-icon> 65% hoàn thành hồ sơ</p>
                    </div>
                </div>
                <Button variant='success' className='rounded-5' onClick={handleShowModalForm}>Tạo mẫu thông tin</Button>
            </div>

            <div className='edit_section'>

                <Button variant='warning' className='rounded-5' onClick={handleEditProfile}>Chỉnh sửa hồ sơ</Button>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 no-border-radius"
                >
                    {/* Tab giới thiệu */}
                    <Tab eventKey="introduce" title="GIỚI THIỆU">
                        <div className='d-flex gap-2 align-items-center'>
                            <h5 className='text-nowrap'>Tình trạng đón khách</h5>
                            <Form.Select aria-label="Default select example" className='select_status_traveller'>
                                <option>{dataProfile.profile.hostingAvailability}</option>
                                <option value="1">Đang bận</option>
                                <option value="2">Chào đón khách</option>
                                <option value="3">Không nhận khách</option>
                            </Form.Select>
                        </div>
                        <hr className='my-5' />
                        <Row className='basic_info'>
                            <Col lg={6}>

                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Quê quán</Form.Label>
                                    <span className="m-0">
                                        {dataProfile.profile.address}
                                    </span>
                                </Form.Group>
                                {/* Edit */}
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Quê quán</Form.Label>
                                    <Form.Select
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        {locations.map((location) => (
                                            <option key={location.code} value={location.name}>{location.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Giáo dục</Form.Label>
                                    <span className="m-0">
                                        {dataProfile.education && dataProfile.education.$values && dataProfile.education.$values.length > 0
                                            ? dataProfile.education.$values[0].university.universityName
                                            : "Không có thông tin"}
                                    </span>
                                </Form.Group>
                                {/* Edit */}
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Thêm giáo dục</Form.Label>
                                    <Form.Select
                                        onChange={(e) => setLanguage(e.target.value)}
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
                                </Form.Group>
                            </Col>

                            <Col lg={6}>

                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Ngôn ngữ sử dụng</Form.Label>
                                    <span className="m-0">
                                        {dataProfile.languages && dataProfile.languages.$values && dataProfile.languages.$values.length > 0
                                            ? dataProfile.languages.$values.map((lang) => lang.languages.languagesName).join(", ")
                                            : "Không có thông tin"}
                                    </span>
                                </Form.Group>
                                {/* Edit */}
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Thêm ngôn ngữ</Form.Label>
                                    <Form.Select
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        {languages.length > 0 ? (
                                            languages.map(language => (
                                                <option key={language.languagesId} value={language.languagesId}>
                                                    {language.languagesName}
                                                </option>
                                            ))
                                        ) : (
                                            <option>Đang tải...</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Ngôn ngữ sử dụng</Form.Label>
                                    <span className="m-0">
                                        {dataProfile.profile.city}
                                    </span>
                                </Form.Group>
                                {/* Edit */}
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Địa phương đăng kí</Form.Label>
                                    <Form.Select
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        {locations.map((location) => (
                                            <option key={location.code} value={location.name}>{location.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <hr className='my-5' />
                        <div className='mb-4'>
                            <h5>Giới thiệu</h5>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={dataProfile.profile.description} />
                            </Form.Group>
                        </div>
                        <div className='mb-4'>
                            <h5>Tại sao tôi sử dụng Travel Mate</h5>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={dataProfile.profile.whyUseTravelMate}
                                />
                            </Form.Group>
                        </div>
                        <div className='mb-4'>
                            <h5>Sở thích</h5>
                            <div className='d-flex flex-wrap gap-1 hobbies_container'>
                                <div className='item_hobbies d-flex align-items-center gap-2'>
                                    {dataProfile.activities && dataProfile.activities.$values && dataProfile.activities.$values.length > 0
                                        ? dataProfile.activities.$values.map((activityItem, index) => (
                                            <div key={index} className='item_hobbies d-flex align-items-center gap-2'>
                                                <p className='m-0'>{activityItem.activity.activityName}</p>
                                                <ion-icon name="close-outline"></ion-icon>
                                            </div>
                                        ))
                                        : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Người dùng chưa cập nhập</span>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* Edit */}
                        <Form.Group className="mb-3 d-flex align-items-center gap-2">
                            <Form.Label className='text-nowrap'>Thêm sở thích</Form.Label>
                            <Form.Select
                                onChange={(e) => setHobbie(e.target.value)}
                            >
                                {hobbies.length > 0 ? (
                                    hobbies.map(hobbie => (
                                        <option key={hobbie.activityId} value={hobbie.activityId}>
                                            {hobbie.activityName}
                                        </option>
                                    ))
                                ) : (
                                    <option>Đang tải...</option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <div className='mb-4'>
                            <h5>Âm nhạc, phim ảnh & sách</h5>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={dataProfile.profile.musicMoviesBooks}
                                />
                            </Form.Group>
                        </div>
                        <Button variant='success' className='rounded-5'>Lưu thay đổi</Button>
                    </Tab>

                    {/* Tab nhà của tôi */}
                    <Tab eventKey="myHome" title="NHÀ CỦA TÔI">
                        <Row className='basic_info'>
                            <Col lg={6}>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Số lượng tối đa</Form.Label>
                                    <Form.Control
                                        type='number'
                                        value={dataProfile.home.maxGuests} />
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Giới tính ưu tiên</Form.Label>
                                    <Form.Select aria-label="Default select example" className=''>
                                        <option>{dataProfile.home.guestPreferences}</option>
                                        <option value="1">Nam</option>
                                        <option value="1">Nữ</option>
                                        <option value="1">Khác</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Cấm hút thuốc</Form.Label>
                                    <Form.Select aria-label="Default select example" className=''>
                                        <option>{dataProfile.home.allowedSmoking}</option>
                                        <option value="1">Có</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Giới thiệu</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={dataProfile.home.roomDescription}
                                    />
                                </Form.Group>
                                {/* <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Địa chỉ cư trú</Form.Label>
                                    <Form.Control type='text' />
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                    <Form.Label className='text-nowrap'>Giáo dục</Form.Label>
                                    <Form.Control type='text' />
                                </Form.Group> */}
                            </Col>
                        </Row>
                        <hr className='my-5' />
                        <h5>CHI TIẾT</h5>
                        <div className='detail_data'>
                            <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                <Form.Label className='text-nowrap'>Bạn cùng phòng</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={dataProfile.home.roomMateInfo}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                <Form.Label className='text-nowrap'>Tiện nghi</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={dataProfile.home.amenities}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                <Form.Label className='text-nowrap'>Phương tiện di chuyến</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={dataProfile.home.transportation}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex align-items-center gap-2">
                                <Form.Label className='text-nowrap'>Mô tả chung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={dataProfile.home.overallDescription}
                                />
                            </Form.Group>
                        </div>


                        <div className="mb-3 ms-lg-4 rounded-3 cus-images">
                            <h5 className="mx-4 mt-3 d-flex">HÌNH ẢNH NHÀ CỦA BẠN</h5>
                            <Row className="px-3 py-3">
                                {dataProfile.home?.homePhotos && dataProfile.home.homePhotos.$values.map((photo) => (
                                    <Col xs={12} md={4} className="mb-3" key={photo.photoId}>
                                        <img src={photo.homePhotoUrl} alt={`House ${photo.photoId}`} className="img-fluid rounded-3" />
                                    </Col>
                                ))
                                }
                            </Row>
                        </div>
                        <UploadImageComponent onUpload={handleUploadImages} />


                        <div className='d-flex justify-content-end'><Button variant='success' className='rounded-5'>Lưu thay đổi</Button></div>
                    </Tab>
                    {/* Tab Chuyến đi */}
                    <Tab eventKey="trip" title="CHUYẾN ĐI">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostProfile key={post.pastTripPostId} {...post} />
                            ))
                        ) : (
                            <div className=''>
                                <p>Bạn chưa có chuyến đi nào</p>
                            </div>
                        )}
                    </Tab>

                    {/* Tab bạn bè  */}
                    <Tab eventKey="friend" title="BẠN BÈ">
                        <Friends />
                    </Tab>
                    <Tab eventKey="destination" title="ĐỊA ĐIỂM">
                        <Favorites />
                    </Tab>
                </Tabs>
            </div>
            <Modal show={showModalForm} onHide={handleCloseModalForm} className="modal_extraDetailForm">
                <Modal.Body>
                    <div className='modal-title'>
                        <h4>Mẫu khảo sát thông tin</h4>
                    </div>
                    <h5>Dịch vụ</h5>
                    <h5>Câu hỏi</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalForm}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleCloseModalForm}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    )
}

export default MyProfile


{/* <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">NHÀ CỦA TÔI</h2>

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
            </div> */}