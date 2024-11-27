import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import "../../../assets/css/Profile/MyHome.css";
import UploadImageComponent from '../../../components/Shared/UploadImageComponent';

import Form from 'react-bootstrap/Form';

function MyHome() {

    const dataProfile = useSelector(state => state.profile);

    const handleUploadImages = (urls) => {
        setUploadedImages(urls);
    };
    console.log("profile", dataProfile);
    useEffect(() => {
        fetchLocations();
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

    return (
        <Container className='py-3 px-0 border-0 rounded-5 my-home-container'>


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
        </Container>
    );
}

export default React.memo(MyHome);
