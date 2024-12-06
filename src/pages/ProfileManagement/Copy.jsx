// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button, Col, Container, Row } from 'react-bootstrap'
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';
// import Form from 'react-bootstrap/Form';
// import Dropdown from 'react-bootstrap/Dropdown';
// import Modal from 'react-bootstrap/Modal';
// import '../../assets/css/ProfileManagement/MyProfile.css'
// import PostProfile from '../../components/Profile/PostProfile';
// import { useSelector } from 'react-redux';
// import UploadImageComponent from '../../components/Shared/UploadImageComponent';

// import Favorites from '../../components/Profile/Favorites';
// import AboutMe from '../../components/Profile/AboutMe';
// import Friends from '../../components/Profile/Friends';

// function MyProfile() {
//     const [key, setKey] = useState('introduce');
//     const [showModalForm, setShowModalForm] = useState(false);
//     const handleShowModalForm = () => setShowModalForm(true);
//     const handleCloseModalForm = () => setShowModalForm(false);
//     const [uploadedImages, setUploadedImages] = useState([]);
//     const [posts, setPosts] = useState([]);

//     const [languages, setLanguages] = useState([]); // danh sách ngôn ngữ trong hệ thống
//     const [language, setLanguage] = useState();

//     const [hobbies, setHobbies] = useState([]); // danh sách sở thích trong hệ thống
//     const [hobbie, setHobbie] = useState();

//     const [educations, setEducations] = useState([]); // danh sách giáo dục trong hệ thống
//     const [education, setEducation] = useState();

//     const [locations, setLocations] = useState([]);
//     const [city, setCity] = useState();

//     const dataProfile = useSelector(state => state.profile);

//     const handleUploadImages = (urls) => {
//         setUploadedImages(urls);
//     };
//     console.log("profile", dataProfile);
//     useEffect(() => {
//         // Lấy ra trip
//         if (dataProfile?.trip?.$values && Array.isArray(dataProfile.trip.$values)) {
//             setPosts(dataProfile.trip.$values);
//         }
//         fetchLocations();


//         fetchLanguages();
//         fetchHobbies();
//         fetchEducation();
//     }, [dataProfile]);

//     // Lấy ra 64 tỉnh thành
//     const fetchLocations = async () => {
//         try {
//             const response = await axios.get('https://provinces.open-api.vn/api/p/');
//             const locationData = response.data.map((location) => ({
//                 ...location,
//                 name: location.name.replace(/^Tỉnh |^Thành phố /, ''),
//             }));
//             setLocations(locationData);
//         } catch (error) {
//             console.error("Error fetching locations:", error);
//         }
//     };

//     // Lấy ra danh sách sở thích
//     const fetchHobbies = async () => {
//         try {
//             const response = await fetch("https://travelmateapp.azurewebsites.net/api/Activity");
//             const data = await response.json();
//             setHobbies(data.$values || []);
//         } catch (error) {
//             console.error("Lỗi khi lấy danh sách sở thích:", error);
//         }
//     };

//     //Lấy danh sách Education
//     const fetchEducation = async () => {
//         try {
//             const response = await fetch("https://travelmateapp.azurewebsites.net/api/University");
//             const data = await response.json();
//             setEducations(data.$values || []);
//         } catch (error) {
//             console.error("Lỗi khi lấy danh sách giáo dục:", error);
//         }
//     };

//     // API get All ngôn ngữ
//     const fetchLanguages = async () => {
//         try {
//             const response = await fetch("https://travelmateapp.azurewebsites.net/api/Languages");
//             const data = await response.json();
//             setLanguages(data.$values || []);
//         } catch (error) {
//             console.error("Lỗi khi lấy danh sách ngôn ngữ:", error);
//         }
//     };

//     // Thời gian tham gia
//     const registrationDate = dataProfile?.profile?.user?.registrationTime
//         ? new Date(dataProfile.profile.user.registrationTime).toLocaleDateString('vi-VN', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         })
//         : "Không rõ";

//     // Chỉnh sửa Profile
//     const handleEditProfile = async () => {

//     }

//     return (
//         <Container>

//             <div className='info_section'>
//                 <div className='info_user_profile'>
//                     <img
//                         src={dataProfile.profile.imageUser}
//                         alt="avatar"
//                         width={150}
//                         height={150}
//                         className='rounded-circle object-fit-cover'
//                         style={{
//                             border: "2px solid #d9d9d9",
//                         }} />

//                     <div className='info_user_profile_content'>
//                         <h4>{dataProfile.profile.user.fullName}</h4>
//                         <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="location-outline"></ion-icon> {dataProfile.profile.city}</p>
//                         <p className='fw-medium d-flex align-items-center gap-2'><ion-icon name="person-add-outline"></ion-icon> Thành viên tham gia từ {registrationDate}</p>
//                         <p className='text-success fw-medium  d-flex align-items-center gap-2'><ion-icon name="shield-checkmark-outline"></ion-icon> 65% hoàn thành hồ sơ</p>
//                     </div>
//                 </div>
//                 <Button variant='success' className='rounded-5' onClick={handleShowModalForm}>Tạo mẫu thông tin</Button>
//             </div>

//             <div className='edit_section'>

//                 <Button variant='warning' className='rounded-5' onClick={handleEditProfile}>Chỉnh sửa hồ sơ</Button>
//                 <Tabs
//                     id="controlled-tab-example"
//                     activeKey={key}
//                     onSelect={(k) => setKey(k)}
//                     className="mb-3 no-border-radius"
//                 >
//                     {/* Tab giới thiệu */}
//                     <Tab eventKey="introduce" title="GIỚI THIỆU">
//                         <div className='d-flex gap-2 align-items-center'>
//                             <h5 className='text-nowrap'>Tình trạng đón khách</h5>
//                             <Form.Select aria-label="Default select example" className='select_status_traveller'>
//                                 <option>{dataProfile.profile.hostingAvailability}</option>
//                                 <option value="1">Đang bận</option>
//                                 <option value="2">Chào đón khách</option>
//                                 <option value="3">Không nhận khách</option>
//                             </Form.Select>
//                         </div>
//                         <hr className='my-5' />
//                         <Row className='basic_info'>
//                             <Col lg={6}>

//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Quê quán</Form.Label>
//                                     <span className="m-0">
//                                         {dataProfile.profile.address}
//                                     </span>
//                                 </Form.Group>
//                                 {/* Edit */}
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Quê quán</Form.Label>
//                                     <Form.Select
//                                         onChange={(e) => setCity(e.target.value)}
//                                     >
//                                         {locations.map((location) => (
//                                             <option key={location.code} value={location.name}>{location.name}</option>
//                                         ))}
//                                     </Form.Select>
//                                 </Form.Group>

//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Giáo dục</Form.Label>
//                                     <span className="m-0">
//                                         {dataProfile.education && dataProfile.education.$values && dataProfile.education.$values.length > 0
//                                             ? dataProfile.education.$values[0].university.universityName
//                                             : "Không có thông tin"}
//                                     </span>
//                                 </Form.Group>
//                                 {/* Edit */}
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Thêm giáo dục</Form.Label>
//                                     <Form.Select
//                                         onChange={(e) => setLanguage(e.target.value)}
//                                     >
//                                         {educations.length > 0 ? (
//                                             educations.map(education => (
//                                                 <option key={education.universityId} value={education.universityId}>
//                                                     {education.universityName}
//                                                 </option>
//                                             ))
//                                         ) : (
//                                             <option>Đang tải...</option>
//                                         )}
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>

//                             <Col lg={6}>

//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Ngôn ngữ sử dụng</Form.Label>
//                                     <span className="m-0">
//                                         {dataProfile.languages && dataProfile.languages.$values && dataProfile.languages.$values.length > 0
//                                             ? dataProfile.languages.$values.map((lang) => lang.languages.languagesName).join(", ")
//                                             : "Không có thông tin"}
//                                     </span>
//                                 </Form.Group>
//                                 {/* Edit */}
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Thêm ngôn ngữ</Form.Label>
//                                     <Form.Select
//                                         onChange={(e) => setLanguage(e.target.value)}
//                                     >
//                                         {languages.length > 0 ? (
//                                             languages.map(language => (
//                                                 <option key={language.languagesId} value={language.languagesId}>
//                                                     {language.languagesName}
//                                                 </option>
//                                             ))
//                                         ) : (
//                                             <option>Đang tải...</option>
//                                         )}
//                                     </Form.Select>
//                                 </Form.Group>

//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Ngôn ngữ sử dụng</Form.Label>
//                                     <span className="m-0">
//                                         {dataProfile.profile.city}
//                                     </span>
//                                 </Form.Group>
//                                 {/* Edit */}
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Địa phương đăng kí</Form.Label>
//                                     <Form.Select
//                                         onChange={(e) => setCity(e.target.value)}
//                                     >
//                                         {locations.map((location) => (
//                                             <option key={location.code} value={location.name}>{location.name}</option>
//                                         ))}
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                         </Row>
//                         <hr className='my-5' />
//                         <div className='mb-4'>
//                             <h5>Giới thiệu</h5>
//                             <Form.Group className="mb-3">
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     value={dataProfile.profile.description} />
//                             </Form.Group>
//                         </div>
//                         <div className='mb-4'>
//                             <h5>Tại sao tôi sử dụng Travel Mate</h5>
//                             <Form.Group className="mb-3">
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     value={dataProfile.profile.whyUseTravelMate}
//                                 />
//                             </Form.Group>
//                         </div>
//                         <div className='mb-4'>
//                             <h5>Sở thích</h5>
//                             <div className='d-flex flex-wrap gap-1 hobbies_container'>
//                                 <div className='item_hobbies d-flex align-items-center gap-2'>
//                                     {dataProfile.activities && dataProfile.activities.$values && dataProfile.activities.$values.length > 0
//                                         ? dataProfile.activities.$values.map((activityItem, index) => (
//                                             <div key={index} className='item_hobbies d-flex align-items-center gap-2'>
//                                                 <p className='m-0'>{activityItem.activity.activityName}</p>
//                                                 <ion-icon name="close-outline"></ion-icon>
//                                             </div>
//                                         ))
//                                         : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Người dùng chưa cập nhập</span>
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Edit */}
//                         <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                             <Form.Label className='text-nowrap'>Thêm sở thích</Form.Label>
//                             <Form.Select
//                                 onChange={(e) => setHobbie(e.target.value)}
//                             >
//                                 {hobbies.length > 0 ? (
//                                     hobbies.map(hobbie => (
//                                         <option key={hobbie.activityId} value={hobbie.activityId}>
//                                             {hobbie.activityName}
//                                         </option>
//                                     ))
//                                 ) : (
//                                     <option>Đang tải...</option>
//                                 )}
//                             </Form.Select>
//                         </Form.Group>

//                         <div className='mb-4'>
//                             <h5>Âm nhạc, phim ảnh & sách</h5>
//                             <Form.Group className="mb-3">
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     value={dataProfile.profile.musicMoviesBooks}
//                                 />
//                             </Form.Group>
//                         </div>
//                         <Button variant='success' className='rounded-5'>Lưu thay đổi</Button>
//                     </Tab>

//                     {/* Tab nhà của tôi */}
//                     <Tab eventKey="myHome" title="NHÀ CỦA TÔI">
//                         <Row className='basic_info'>
//                             <Col lg={6}>
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Số lượng tối đa</Form.Label>
//                                     <Form.Control
//                                         type='number'
//                                         value={dataProfile.home.maxGuests} />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Giới tính ưu tiên</Form.Label>
//                                     <Form.Select aria-label="Default select example" className=''>
//                                         <option>{dataProfile.home.guestPreferences}</option>
//                                         <option value="1">Nam</option>
//                                         <option value="1">Nữ</option>
//                                         <option value="1">Khác</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Cấm hút thuốc</Form.Label>
//                                     <Form.Select aria-label="Default select example" className=''>
//                                         <option>{dataProfile.home.allowedSmoking}</option>
//                                         <option value="1">Có</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Col>
//                             <Col lg={6}>
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Giới thiệu</Form.Label>
//                                     <Form.Control
//                                         type='text'
//                                         value={dataProfile.home.roomDescription}
//                                     />
//                                 </Form.Group>
//                                 {/* <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Địa chỉ cư trú</Form.Label>
//                                     <Form.Control type='text' />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                     <Form.Label className='text-nowrap'>Giáo dục</Form.Label>
//                                     <Form.Control type='text' />
//                                 </Form.Group> */}
//                             </Col>
//                         </Row>
//                         <hr className='my-5' />
//                         <h5>CHI TIẾT</h5>
//                         <div className='detail_data'>
//                             <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                 <Form.Label className='text-nowrap'>Bạn cùng phòng</Form.Label>
//                                 <Form.Control
//                                     type='text'
//                                     value={dataProfile.home.roomMateInfo}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                 <Form.Label className='text-nowrap'>Tiện nghi</Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     value={dataProfile.home.amenities}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                 <Form.Label className='text-nowrap'>Phương tiện di chuyến</Form.Label>
//                                 <Form.Control
//                                     type='text'
//                                     value={dataProfile.home.transportation}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3 d-flex align-items-center gap-2">
//                                 <Form.Label className='text-nowrap'>Mô tả chung</Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     value={dataProfile.home.overallDescription}
//                                 />
//                             </Form.Group>
//                         </div>


//                         <div className="mb-3 ms-lg-4 rounded-3 cus-images">
//                             <h5 className="mx-4 mt-3 d-flex">HÌNH ẢNH NHÀ CỦA BẠN</h5>
//                             <Row className="px-3 py-3">
//                                 {dataProfile.home?.homePhotos && dataProfile.home.homePhotos.$values.map((photo) => (
//                                     <Col xs={12} md={4} className="mb-3" key={photo.photoId}>
//                                         <img src={photo.homePhotoUrl} alt={`House ${photo.photoId}`} className="img-fluid rounded-3" />
//                                     </Col>
//                                 ))
//                                 }
//                             </Row>
//                         </div>
//                         <UploadImageComponent onUpload={handleUploadImages} />


//                         <div className='d-flex justify-content-end'><Button variant='success' className='rounded-5'>Lưu thay đổi</Button></div>
//                     </Tab>
//                     {/* Tab Chuyến đi */}
//                     <Tab eventKey="trip" title="CHUYẾN ĐI">
//                         {posts.length > 0 ? (
//                             posts.map(post => (
//                                 <PostProfile key={post.pastTripPostId} {...post} />
//                             ))
//                         ) : (
//                             <div className=''>
//                                 <p>Bạn chưa có chuyến đi nào</p>
//                             </div>
//                         )}
//                     </Tab>

//                     {/* Tab bạn bè  */}
//                     <Tab eventKey="friend" title="BẠN BÈ">
//                         <Friends />
//                     </Tab>
//                     <Tab eventKey="destination" title="ĐỊA ĐIỂM">
//                         <Favorites />
//                     </Tab>
//                 </Tabs>
//             </div>
//             <Modal show={showModalForm} onHide={handleCloseModalForm} className="modal_extraDetailForm">
//                 <Modal.Body>
//                     <div className='modal-title'>
//                         <h4>Mẫu khảo sát thông tin</h4>
//                     </div>
//                     <h5>Dịch vụ</h5>
//                     <h5>Câu hỏi</h5>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseModalForm}>
//                         Đóng
//                     </Button>
//                     <Button variant="primary" onClick={handleCloseModalForm}>
//                         Lưu thay đổi
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//         </Container>
//     )
// }

// export default MyProfile


// {/* <h2 className="mb-4 text-success fw-bold text-header-profile mt-3">NHÀ CỦA TÔI</h2>

//             <div className="mb-3 ms-lg-4 rounded-3 cus-prioritize">
//                 <h4 className="mx-4 mt-3">ƯU TIÊN</h4>
//                 <div className="px-3">
//                     <div className="small ms-3 d-flex gap-2">
//                         <ion-icon name="people-outline" style={{ fontSize: '16px' }}></ion-icon>
//                         <p className='fw-medium'>
//                             {loading ? <Skeleton width={150} /> : renderDataOrFallback(`Số lượng khách tối đa: ${dataProfile.home.maxGuests}`)}
//                         </p>
//                     </div>
//                     <div className="small ms-3 d-flex gap-2">
//                         <ion-icon name="male-female-outline" style={{ fontSize: '16px' }}></ion-icon>
//                         <p className='fw-medium'>
//                             {loading ? <Skeleton width={150} /> : renderDataOrFallback(`Giới tính tôi muốn đón: ${dataProfile.home.guestPreferences}`)}
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             <div className="mb-3 ms-lg-4 rounded-3 cus-home">
//                 <h4 className="mx-4 mt-3">NƠI TÁ TÚC</h4>
//                 <div className="px-3">
//                     <div className="small ms-3 d-flex gap-2">
//                         <ion-icon name="bed-outline" style={{ fontSize: '24px' }}></ion-icon>
//                         <p className='fw-medium m-0 home-room-type'>
//                             {loading ? <Skeleton width={100} /> : renderDataOrFallback(dataProfile.home.roomDescription)}
//                         </p>
//                     </div>
//                     <p className="small ms-3 home-room-mate-info">
//                         {loading ? <Skeleton width={250} /> : renderDataOrFallback(dataProfile.home.roomMateInfo)}
//                     </p>
//                     <hr />
//                 </div>
//             </div>

//             <div className="mb-3 ms-lg-4 rounded-3 cus-details">
//                 <h4 className="mx-4 mt-3">CHI TIẾT</h4>
//                 <div className="px-3">
//                     <div className="small ms-3 d-flex gap-2">
//                         <ion-icon name="accessibility-outline" style={{ fontSize: '24px' }}></ion-icon>
//                         <p className="fw-medium m-0">Thông tin phòng</p>
//                     </div>
//                     <p className="small ms-5 home-room-description">
//                         {loading ? <Skeleton width={200} /> : renderDataOrFallback(dataProfile.home.roomDescription)}
//                     </p>

//                     <div className="small ms-3 d-flex gap-2">
//                         <ion-icon name="link-outline" style={{ fontSize: '24px' }}></ion-icon>
//                         <p className='fw-medium m-0 home-amenities'>Tiện ích</p>
//                     </div>
//                     <p className="small ms-5 home-amenities-description">
//                         {loading ? <Skeleton width={250} /> : renderDataOrFallback(dataProfile.home.amenities)}
//                     </p>

//                     <div className="small ms-3 d-flex gap-2">
//                         <ion-icon name="bus-outline" style={{ fontSize: '24px' }}></ion-icon>
//                         <p className='fw-medium m-0 home-transportation'>{loading ? <Skeleton width={100} /> : 'Phương tiện di chuyển'}</p>
//                     </div>
//                     <p className="small ms-5 home-transportation-description">
//                         {loading ? <Skeleton width={200} /> : renderDataOrFallback(dataProfile.home.transportation)}
//                     </p>
//                 </div>
//             </div>

//             <div className="mb-3 ms-lg-4 rounded-3 cus-images">
//                 <h5 className="mx-4 mt-3 d-flex">HÌNH ẢNH NHÀ CỦA BẠN</h5>
//                 <Row className="px-3 py-3">
//                     {loading ? (
//                         [1, 2, 3].map((index) => (
//                             <Col xs={12} md={4} className="mb-3" key={index}>
//                                 <Skeleton height={200} className="rounded-3" />
//                             </Col>
//                         ))
//                     ) : (
//                         dataProfile.home?.homePhotos && dataProfile.home.homePhotos.$values.map((photo) => (
//                             <Col xs={12} md={4} className="mb-3" key={photo.photoId}>
//                                 <img src={photo.homePhotoUrl} alt={`House ${photo.photoId}`} className="img-fluid rounded-3" />
//                             </Col>
//                         ))
//                     )}
//                 </Row>
//             </div> */}




// //             import React from 'react'
// // import axios from 'axios';

// // function Setting() {
// //   const uploadImage = async (file) => {
// //     const formData = new FormData();
// //     formData.append('image', file);

// //     try {
// //       const response = await axios.post('https://api.fpt.ai/vision/idr/vnm', formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //           'api-key': '8JIYV5d32XHGakgucP899sGDv0QBej5R' // Replace with your actual API key
// //         }
// //       });
// //       console.log(response.data.data);
// //     } catch (error) {
// //       console.error('Error uploading image:', error);
// //     }
// //   };

// //   const handleFileChange = (event) => {
// //     const file = event.target.files[0];
// //     if (file) {
// //       uploadImage(file);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Setting</h1>
// //       <input type="file" onChange={handleFileChange} />
// //     </div>
// //   );
// // }

// // export default Setting




// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import ReactPaginate from 'react-paginate';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import axios from 'axios';
// import '../../assets/css/Search/Search.css';

// const mockData = [
//   {
//     id: 1,
//     avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
//     name: 'Nguyễn Văn A',
//     age: 28,
//     gender: 'Nam',
//     address: 'Hà Nội, Việt Nam',
//     description: 'Thích đi phượt.',
//     guestStatus: 'Có thể đón khách',
//     rating: 4.5,
//     connections: 12,
//     activeTime: '19 tháng 11, 2024',
//     hobbies: ['Thể thao', 'Du lịch'],
//   },
//   {
//     id: 2,
//     avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
//     name: 'Trần Thị B',
//     age: 24,
//     gender: 'Nữ',
//     address: 'Đà Nẵng, Việt Nam',
//     description: 'Thích giao lưu văn hóa.',
//     guestStatus: 'Không thể đón khách',
//     rating: 4.8,
//     connections: 18,
//     activeTime: '19 tháng 11, 2024',
//     hobbies: ['Đọc sách', 'Nấu ăn'],
//   },
//   {
//     id: 3,
//     avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
//     name: 'Lê Văn C',
//     age: 30,
//     gender: 'Nam',
//     address: 'Sài Gòn, Việt Nam',
//     description: 'Yêu thích thể thao.',
//     guestStatus: 'Có thể đón khách',
//     rating: 4.2,
//     connections: 10,
//     activeTime: '19 tháng 11, 2024',
//     hobbies: ['Thể thao', 'Chụp ảnh'],
//   },
// ];

// function SearchListLocal() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [address, setAddress] = useState('');
//   const [gender, setGender] = useState('');
//   const [ageRange, setAgeRange] = useState([18, 40]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [locations, setLocations] = useState([]);
//   const [locals, setLocals] = useState([]);
//   const [selectedHobbies, setSelectedHobbies] = useState([]);
//   const [allHobbies, setAllHobbies] = useState([]);
//   const itemsPerPage = 2;

//   useEffect(() => {
//     fetchLocations();
//     fetchLocals();
//   }, []);

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Locations');
//       const locationData = response.data.$values.map(location => ({
//         code: location.locationId,
//         name: location.locationName,
//       }));
//       setLocations(locationData);
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//     }
//   };

//   const fetchLocals = async () => {
//     try {
//       const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Profile');
//       const profiles = response.data.$values.map(profile => ({
//         id: profile.profileId,
//         avatar: profile.imageUser || '',
//         name: profile.user.fullName || 'Chưa xác định',
//         age: profile.user.birthdate ? new Date().getFullYear() - new Date(profile.user.birthdate).getFullYear() : 'Chưa xác định',
//         gender: profile.gender || 'Chưa xác định',
//         address: `${profile.address}, ${profile.city}` || 'Chưa xác định',
//         description: profile.description || 'Không có mô tả',
//         guestStatus: profile.hostingAvailability || 'Không rõ',
//         rating: 'Chưa xác định',
//         connections: 'Chưa xác định',
//         activeTime: new Date(profile.user.registrationTime).toLocaleDateString() || 'Chưa xác định',
//         userId: profile.user.id,
//         hobbies: []
//       }));
//       const profilesWithHobbies = await Promise.all(profiles.map(async (profile) => {
//         const hobbies = await fetchUserHobbies(profile.userId);
//         return { ...profile, hobbies };
//       }));
//       setLocals(profilesWithHobbies);
//       setAllHobbies([...new Set(profilesWithHobbies.flatMap(local => local.hobbies))]);
//     } catch (error) {
//       console.error("Error fetching profiles:", error);
//     }
//   };

//   const fetchUserHobbies = async (userId) => {
//     try {
//       const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/user/${userId}`);
//       return response.data.$values.map(activity => activity.activity.activityName);
//     } catch (error) {
//       console.error(`Error fetching hobbies for user ${userId}:`, error);
//       return [];
//     }
//   };

//   const filteredLocals = locals.filter((local) => {
//     const matchesName = local.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesAddress = local.address.toLowerCase().includes(address.toLowerCase());
//     const matchesGender = !gender || local.gender === gender;
//     const matchesAge = local.age >= ageRange[0] && local.age <= ageRange[1];
//     const matchesHobby = selectedHobbies.length === 0 || selectedHobbies.some(hobby => local.hobbies.includes(hobby));
//     const matchesLocation = !selectedLocation || local.address.includes(selectedLocation);
//     return matchesName && matchesAddress && matchesGender && matchesAge && matchesHobby && matchesLocation;
//   });

//   const displayedLocals = filteredLocals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

//   return (
//     <Container fluid style={{ padding: '10px', width: '90%' }}>
//       <Row>

//         <h3 className="mb-3">Người địa phương</h3>
//         {/* Phần Lọc */}
//         <Col md={3} className="border-end">
//           <Form.Group className="mb-3">
//             <Form.Label>Tên</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Nhập tên"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Địa điểm</Form.Label>
//             <Form.Select
//               value={selectedLocation}
//               onChange={(e) => setSelectedLocation(e.target.value)}
//             >
//               <option value="">Tất cả</option>
//               {locations.map((location) => (
//                 <option key={location.code} value={location.name}>
//                   {location.name}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Giới tính</Form.Label>
//             <Form.Select
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//             >
//               <option value="">Tất cả</option>
//               <option value="Nam">Nam</option>
//               <option value="Nữ">Nữ</option>
//             </Form.Select>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Độ tuổi</Form.Label>
//             <Form.Range
//               value={ageRange[1]}
//               min={18}
//               max={60}
//               onChange={(e) => setAgeRange([18, parseInt(e.target.value)])}
//             />
//             <div>{ageRange[0]} - {ageRange[1]} tuổi</div>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Sở thích</Form.Label>
//             <div className="hobby-list" style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '10px' }}>
//               {allHobbies.map((item, index) => (
//                 <Button
//                   key={index}
//                   variant={selectedHobbies.includes(item) ? 'primary' : 'outline-secondary'}
//                   onClick={() => {
//                     setSelectedHobbies((prev) =>
//                       prev.includes(item) ? prev : [...prev, item]
//                     );
//                   }}
//                   style={{ margin: '2px', padding: '5px 10px' }}
//                 >
//                   {item}
//                 </Button>
//               ))}
//             </div>

//             <div className="selected-hobbies">
//               {selectedHobbies.map((hobby, index) => (
//                 <span key={index} className="selected-hobby">
//                   {hobby}
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => {
//                       setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
//                     }}
//                     style={{ marginLeft: '5px', padding: '2px 5px' }}
//                   >
//                     &times;
//                   </Button>
//                 </span>
//               ))}
//             </div>
//           </Form.Group>


//         </Col>

//         {/* Phần Danh Sách */}
//         <Col md={9}>
//           {/* Display locals */}
//           {filteredLocals.length === 0 ? (
//             <div className="text-center">Không tìm thấy kết quả.</div>
//           ) : (
//             displayedLocals.map((local) => (
//               <Row key={local.id} className="border-bottom p-3">
//                 <Col md={2} className="d-flex align-items-center">
//                   <img src={local.avatar} alt={local.name} style={{ width: '100%' }} />
//                 </Col>
//                 <Col md={8}>
//                   <h6>{local.name}</h6>
//                   {/* Add other local details here */}
//                 </Col>
//               </Row>
//             ))
//           )}
//           {filteredLocals.length > itemsPerPage && (
//             <ReactPaginate
//               previousLabel={'<'}
//               nextLabel={'>'}
//               pageCount={Math.ceil(filteredLocals.length / itemsPerPage)}
//               onPageChange={({ selected }) => setCurrentPage(selected)}
//               containerClassName={'pagination'}
//               activeClassName={'active'}
//             />
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default SearchListLocal;

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import ReactPaginate from 'react-paginate';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import axios from 'axios';
// import '../../assets/css/Search/Search.css';

// const mockData = [
//   {
//     id: 1,
//     avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
//     name: 'Nguyễn Văn A',
//     age: 28,
//     gender: 'Nam',
//     address: 'Hà Nội, Việt Nam',
//     description: 'Thích đi phượt.',
//     guestStatus: 'Có thể đón khách',
//     rating: 4.5,
//     connections: 12,
//     activeTime: '19 tháng 11, 2024',
//     hobbies: ['Thể thao', 'Du lịch'],
//   },
//   {
//     id: 2,
//     avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
//     name: 'Trần Thị B',
//     age: 24,
//     gender: 'Nữ',
//     address: 'Đà Nẵng, Việt Nam',
//     description: 'Thích giao lưu văn hóa.',
//     guestStatus: 'Không thể đón khách',
//     rating: 4.8,
//     connections: 18,
//     activeTime: '19 tháng 11, 2024',
//     hobbies: ['Đọc sách', 'Nấu ăn'],
//   },
//   {
//     id: 3,
//     avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
//     name: 'Lê Văn C',
//     age: 30,
//     gender: 'Nam',
//     address: 'Sài Gòn, Việt Nam',
//     description: 'Yêu thích thể thao.',
//     guestStatus: 'Có thể đón khách',
//     rating: 4.2,
//     connections: 10,
//     activeTime: '19 tháng 11, 2024',
//     hobbies: ['Thể thao', 'Chụp ảnh'],
//   },
// ];

// function SearchListLocal() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [address, setAddress] = useState('');
//   const [gender, setGender] = useState('');
//   const [ageRange, setAgeRange] = useState([18, 40]);
//   const [hobby, setHobby] = useState('');
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 2;

//   const [selectedLocation, setSelectedLocation] = useState(''); // State cho địa điểm
//   const [locations, setLocations] = useState([]); // State lưu danh sách địa điểm
//   const allHobbies = [...new Set(mockData.flatMap((local) => local.hobbies))];
//   const [selectedHobbies, setSelectedHobbies] = useState([]);



//   const filteredLocals = mockData.filter((local) => {
//     const matchesName = local.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesAddress = local.address.toLowerCase().includes(address.toLowerCase());
//     const matchesGender = !gender || local.gender === gender;
//     const matchesAge = local.age >= ageRange[0] && local.age <= ageRange[1];
//     const matchesHobby =
//       selectedHobbies.length === 0 ||
//       selectedHobbies.some((hobby) => local.hobbies.includes(hobby));

//     const matchesLocation = !selectedLocation || local.address.includes(selectedLocation);

//     return matchesName && matchesAddress && matchesGender && matchesAge && matchesHobby && matchesLocation;
//   });


//   const displayedLocals = filteredLocals.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );


//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Locations');
//       const locationData = response.data.$values.map(location => ({
//         code: location.locationId,
//         name: location.locationName,
//       }));
//       setLocations(locationData);
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//     }
//   };

//   return (
//     <Container fluid style={{ padding: '10px', width: '90%' }}>
//       <Row>

//         <h3 className="mb-3">Người địa phương</h3>
//         {/* Phần Lọc */}
//         <Col md={3} className="border-end">
//           <Form.Group className="mb-3">
//             <Form.Label>Tên</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Nhập tên"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Địa điểm</Form.Label>
//             <Form.Select
//               value={selectedLocation}
//               onChange={(e) => setSelectedLocation(e.target.value)}
//             >
//               <option value="">Tất cả</option>
//               {locations.map((location) => (
//                 <option key={location.code} value={location.name}>
//                   {location.name}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Giới tính</Form.Label>
//             <Form.Select
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//             >
//               <option value="">Tất cả</option>
//               <option value="Nam">Nam</option>
//               <option value="Nữ">Nữ</option>
//             </Form.Select>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Độ tuổi</Form.Label>
//             <Form.Range
//               value={ageRange[1]}
//               min={18}
//               max={60}
//               onChange={(e) => setAgeRange([18, parseInt(e.target.value)])}
//             />
//             <div>{ageRange[0]} - {ageRange[1]} tuổi</div>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Sở thích</Form.Label>
//             <div className="hobby-list" style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '10px' }}>
//               {allHobbies.map((item, index) => (
//                 <Button
//                   key={index}
//                   variant={selectedHobbies.includes(item) ? 'primary' : 'outline-secondary'}
//                   onClick={() => {
//                     setSelectedHobbies((prev) =>
//                       prev.includes(item) ? prev : [...prev, item]
//                     );
//                   }}
//                   style={{ margin: '2px', padding: '5px 10px' }}
//                 >
//                   {item}
//                 </Button>
//               ))}
//             </div>

//             <div className="selected-hobbies">
//               {selectedHobbies.map((hobby, index) => (
//                 <span key={index} className="selected-hobby">
//                   {hobby}
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => {
//                       setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
//                     }}
//                     style={{ marginLeft: '5px', padding: '2px 5px' }}
//                   >
//                     &times;
//                   </Button>
//                 </span>
//               ))}
//             </div>
//           </Form.Group>


//         </Col>

//         {/* Phần Danh Sách */}
//         <Col md={9}>
//           {filteredLocals.length === 0 ? (
//             <div className="text-center">Không tìm thấy kết quả.</div>
//           ) : (
//             displayedLocals.map((local) => (
//               <Row key={local.id} className="border-bottom p-3">
//                 {/* Avatar */}
//                 <Col md={2} className="d-flex align-items-center">
//                   <img
//                     src={local.avatar}
//                     alt={local.avatar}
//                     style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
//                   />
//                 </Col>

//                 {/* Thông tin */}
//                 <Col md={8}>
//                   <h6>{local.name} ({local.age} tuổi, {local.gender})</h6>
//                   <p><ion-icon name="location-outline"></ion-icon> {local.address}</p>
//                   <p>Mô tả: {local.description}</p>
//                   <p style={{ color: 'green' }}><ion-icon name="walk-outline"></ion-icon> {local.guestStatus}</p>
//                 </Col>

//                 {/* Xếp hạng */}
//                 <Col md={2} className="d-flex flex-column">
//                   <p>
//                     <ion-icon name="star-outline"></ion-icon> {local.rating} sao
//                   </p>
//                   <p>
//                     <ion-icon name="people-outline"></ion-icon> {local.connections} kết nối
//                   </p>
//                   <p>Tham gia từ {local.activeTime}</p>
//                 </Col>
//               </Row>
//             ))
//           )}
//           {filteredLocals.length > itemsPerPage && (
//             <ReactPaginate
//               previousLabel={'<'}
//               nextLabel={'>'}
//               pageCount={Math.ceil(filteredLocals.length / itemsPerPage)}
//               onPageChange={({ selected }) => setCurrentPage(selected)}
//               containerClassName={'pagination'}
//               activeClassName={'active'}
//             />
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default SearchListLocal;



// const file = event.target.files[0];
//     if (!file) return;
//     setFrontImage(file);

//     try {
//       // Upload image to Firebase
//       const storageRef = ref(storage, `cccd/${file.name}`);
//       await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(storageRef);

//       // Update state with the image URL
//       setFrontImageUrl(downloadURL);
//       console.log("Ảnh đã tải lên:", downloadURL);

//       // Prepare the data to send to the create-imageFront API
//       const imageFrontData = {
//         imageUrl: downloadURL
//       };

//       // Log the data being sent
//       console.log("Gửi dữ liệu:", imageFrontData);

//       // Call FPT API for OCR (nếu cần thiết)
//       const formData = new FormData();
//       formData.append('image', file);
//       const ocrResponse = await axios.post(
//         'https://api.fpt.ai/vision/idr/vnm',
//         formData,
//         {
//           headers: {
//             'api-key': 'aHlapDPHrYrQuKWhKa0VsjcrTegwwamr',
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       const { errorCode, data } = ocrResponse.data;
//       if (errorCode !== 0) {
//         toast.error('Không thể lấy được thông tin CCCD.');
//         return;
//       }

//       const cccdData = data[0];
//       console.log("Dữ liệu CCCD nhận được:", cccdData);

//       // Send image URL to your backend to create imageFront
//       // Gọi API để cập nhật thông tin CCCD
//       const createImageFrontResponse = await axios.post(
//         'https://travelmateapp.azurewebsites.net/api/CCCD/create-imageFront',
//         downloadURL,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `${token}`,  // Sử dụng Bearer token
//           },
//         }
//       );

//       console.log("Kết quả trả về từ API create-imageFront:", createImageFrontResponse.data);

//       // Kiểm tra kết quả trả về và gửi yêu cầu cập nhật
//       if (createImageFrontResponse.status === 200) {
//         // Gửi yêu cầu cập nhật thông tin CCCD vào API
//         const updateResponse = await axios.put(
//           'https://travelmateapp.azurewebsites.net/api/CCCD/update-details-front',
//           {
//             id: cccdData.id,
//             name: cccdData.name,
//             dob: cccdData.dob.split('/').reverse().join('-'),
//             sex: cccdData.sex,
//             nationality: cccdData.nationality,
//             home: cccdData.home,
//             address: cccdData.address,
//             doe: cccdData.doe.split('/').reverse().join('-'),
//           },
//           {
//             headers: {
//               'Authorization': `${token}`, // Đảm bảo token được truyền vào đây
//             },
//           }
//         );

//         // In ra kết quả trả về từ API khi cập nhật
//         console.log("Kết quả trả về từ API update-details-front:", updateResponse.data);

//         // Hiển thị thông báo thành công
//         toast.success('Xác thực CCCD thành công.');
//       } else {
//         toast.error('Lỗi khi tạo ảnh CCCD.');
//       }

//     } catch (error) {
//       console.error('Đã xảy ra lỗi:', error);
//       toast.error('Đã xảy ra lỗi trong quá trình xác thực CCCD.');
//     }




// const file = event.target.files[0];
// if (!file) return;
// setBackImage(file);

// try {
//     // Upload image to Firebase
//     const storageRef = ref(storage, `cccd/${file.name}`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);
//     setBackImageUrl(downloadURL);

//     console.log("Ảnh mặt sau đã tải lên:", downloadURL);

//     // Gửi ảnh tới API OCR
//     const formData = new FormData();
//     formData.append('image', file);
//     const ocrResponse = await axios.post(
//         'https://api.fpt.ai/vision/idr/vnm',
//         formData,
//         {
//             headers: {
//                 'api-key': 'aHlapDPHrYrQuKWhKa0VsjcrTegwwamr',
//                 'Content-Type': 'multipart/form-data',
//             },
//         }
//     );

//     const { errorCode, data } = ocrResponse.data;
//     if (errorCode !== 0) {
//         toast.error('Không thể lấy được thông tin mặt sau CCCD.');
//         return;
//     }

//     // Gọi API update-imageBack với link ảnh
//     await axios.put(
//         'https://travelmateapp.azurewebsites.net/api/CCCD/update-imageBack',
//         {
//             imageBack: downloadURL
//         },
//         {
//             headers: {
//                 'Authorization': `${token}`,
//             },
//         }
//     );

//     console.log("Đã cập nhật hình ảnh mặt sau CCCD thành công.");

//     const cccdData = data[0];
//     console.log("Dữ liệu CCCD mặt sau nhận được:", cccdData);

//     // Gửi yêu cầu cập nhật thông tin CCCD mặt sau
//     const updateResponse = await axios.put(
//         'https://travelmateapp.azurewebsites.net/api/CCCD/update-details-back',
//         {
//             issue_date: cccdData.issue_date.split('/').reverse().join('-'),
//             issue_loc: cccdData.issue_loc,
//             features: cccdData.features,
//             mrz: cccdData.mrz,
//         },
//         {
//             headers: {
//                 'Authorization': `${token}`,
//             },
//         }
//     );

//     console.log("Kết quả trả về từ API update-details-back:", updateResponse.data);
//     toast.success('Xác thực CCCD mặt sau thành công.');

//     // Cập nhật thông tin Profile và CCCD
//     const cccdDataFromApi = await fetchCCCDInfo();
//     const profileData = await fetchProfileInfo();
//     await updateProfileInfo(cccdDataFromApi, profileData);

//     dispatch(viewProfile(user.id, token));

// } catch (error) {
//     console.error('Đã xảy ra lỗi:', error);
//     toast.error('Đã xảy ra lỗi trong quá trình xác thực CCCD mặt sau.');
// }


const tours = [
    {
        id: 1,
        name: 'Tour Phú Quốc 5 ngày 4 đêm',
        description: 'Phú Quốc là một hòn đảo xinh đẹp với các bãi biển cát trắng và làn nước trong xanh. Đây là điểm đến lý tưởng để thư giãn, khám phá thiên nhiên và thưởng thức hải sản tươi ngon.',
        destination: 'Phú Quốc',
        duration: '5 ngày 4 đêm',
        participants: 20,
        price: formatPrice(3500000),
        image: 'https://images.unsplash.com/photo-1730270567793-9903004e0f15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG91ciUyMGR1JTIwbCVFMSVCQiU4QmNoJTIwcGh1JTIwcXVvY3xlbnwwfHwwfHx8MA%3D%3D',
        localName: 'Lê Thị Lan Anh',
        localAvatar: 'https://cdn.vietnam.vn/wp-content/uploads/2024/07/Ly-do-Anh-Tu-noi-bat-o-Anh-trai-say.jpg',
        rating: 4.9,
        trip: 30,
        timeParticipate: '2023-08-20',
        localLocation: 'Phú Quốc',
    },
    {
        id: 2,
        name: 'Tour Phú Quốc 5 ngày 4 đêm',
        description: 'Phú Quốc là một hòn đảo xinh đẹp với các bãi biển cát trắng và làn nước trong xanh. Đây là điểm đến lý tưởng để thư giãn, khám phá thiên nhiên và thưởng thức hải sản tươi ngon.',
        destination: 'Phú Quốc',
        duration: '5 ngày 4 đêm',
        participants: 20,
        price: formatPrice(3500000),
        image: 'https://images.unsplash.com/photo-1730270567793-9903004e0f15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG91ciUyMGR1JTIwbCVFMSVCQiU4QmNoJTIwcGh1JTIwcXVvY3xlbnwwfHwwfHx8MA%3D%3D',
        localName: 'Lê Thị Lan Anh',
        localAvatar: 'https://cdn.vietnam.vn/wp-content/uploads/2024/07/Ly-do-Anh-Tu-noi-bat-o-Anh-trai-say.jpg',
        rating: 4.9,
        trip: 30,
        timeParticipate: '2023-08-20',
        localLocation: 'Phú Quốc',
    },
    {
        id: 3,
        name: 'Tour Phú Quốc 5 ngày 4 đêm',
        description: 'Phú Quốc là một hòn đảo xinh đẹp với các bãi biển cát trắng và làn nước trong xanh. Đây là điểm đến lý tưởng để thư giãn, khám phá thiên nhiên và thưởng thức hải sản tươi ngon.',
        destination: 'Phú Quốc',
        duration: '5 ngày 4 đêm',
        participants: 20,
        price: formatPrice(3500000),
        image: 'https://images.unsplash.com/photo-1730270567793-9903004e0f15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG91ciUyMGR1JTIwbCVFMSVCQiU4QmNoJTIwcGh1JTIwcXVvY3xlbnwwfHwwfHx8MA%3D%3D',
        localName: 'Lê Thị Lan Anh',
        localAvatar: 'https://cdn.vietnam.vn/wp-content/uploads/2024/07/Ly-do-Anh-Tu-noi-bat-o-Anh-trai-say.jpg',
        rating: 4.9,
        trip: 30,
        timeParticipate: '2023-08-20',
        localLocation: 'Phú Quốc',
    },
    {
        id: 4,
        name: 'Tour Nha Trang 3 ngày 2 đêm',
        description: 'Nha Trang là thành phố biển nổi tiếng với bãi biển dài, cát trắng và những hòn đảo xinh đẹp. Các hoạt động như lặn biển, tham quan tháp Bà Ponagar hay thưởng thức hải sản đặc sản là những điểm nổi bật của chuyến đi.',
        destination: 'Nha Trang',
        duration: '3 ngày 2 đêm',
        participants: 12,
        price: formatPrice(2200000),
        image: 'https://media.istockphoto.com/id/1744623865/photo/chua-long-son-pagoda-temple-in-nha-trang-vietnam.webp?a=1&b=1&s=612x612&w=0&k=20&c=80nuMaq4y366whXjl9ttVPWScohJ4JeQH5mPl4uqfbs=',
        localName: 'Phạm Minh Tuấn',
        localAvatar: 'https://images2.thanhnien.vn/528068263637045248/2024/1/10/truong-giang-56-1704913245711242412702.jpg',
        rating: 4.6,
        trip: 15,
        timeParticipate: '2023-07-05',
        localLocation: 'Nha Trang',
    },
    {
        id: 5,
        name: 'Tour Sapa 2 ngày 1 đêm',
        description: 'Sapa là một thị trấn vùng cao với cảnh quan tuyệt đẹp, những dãy núi xanh mướt, thung lũng mù sương và các bản làng của người dân tộc H\'Mông, Dao. Đây là nơi lý tưởng để thưởng thức khí hậu mát mẻ và khám phá văn hóa độc đáo.',
        destination: 'Sapa',
        duration: '2 ngày 1 đêm',
        participants: 8,
        price: formatPrice(1500000),
        image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRvdXIlMjBkdSUyMGwlRTElQkIlOEJjaCUyMHNhcGF8ZW58MHx8MHx8fDA%3D',
        localName: 'Hoàng Đức Quang',
        localAvatar: 'https://cafefcdn.com/thumb_w/640/203337114487263232/2023/8/22/avatar1692709004135-16927090046852041812399.jpg',
        rating: 4.4,
        trip: 12,
        timeParticipate: '2023-06-01',
        localLocation: 'Sapa',
    }
]