import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import UploadImageComponent from '../../../components/Shared/UploadImageComponent';

function MyHome() {
    const [isEditing, setIsEditing] = useState(false);
    const [locations, setLocations] = useState([]);
    const [homeData, setHomeData] = useState({});
    const dataProfile = useSelector(state => state.profile);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (dataProfile?.home) {
            setHomeData(dataProfile.home);
        }
    }, [dataProfile]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field, value) => {
        setHomeData(prev => ({ ...prev, [field]: value }));
    };

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

    const handleUploadImages = (urls) => {
        setHomeData(prev => ({ ...prev, homePhotos: urls }));
    };

    const renderDataOrFallback = (data) => {
        return data ? data : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Chưa cập nhật</span>;
    };

    return (
        <Container>
            <div className='d-flex justify-content-between align-items-center'>
                <h5>Thông tin nhà của bạn</h5>
                <Button variant='warning' className='rounded-5' onClick={toggleEdit}>
                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
            </div>

            <hr className='my-4' />

            {/* Số lượng tối đa */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Số lượng tối đa</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            type="number"
                            value={homeData.maxGuests || ''}
                            onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(homeData.maxGuests)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Giới tính ưu tiên */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Giới tính ưu tiên</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            value={homeData.guestPreferences || ''}
                            onChange={(e) => handleInputChange('guestPreferences', e.target.value)}
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </Form.Select>
                    ) : (
                        renderDataOrFallback(homeData.guestPreferences)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Cấm hút thuốc */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Cấm hút thuốc</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Select
                            value={homeData.allowedSmoking || ''}
                            onChange={(e) => handleInputChange('allowedSmoking', e.target.value)}
                        >
                            <option value="Có">Có</option>
                            <option value="Không">Không</option>
                        </Form.Select>
                    ) : (
                        renderDataOrFallback(homeData.allowedSmoking)
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
                            value={homeData.roomDescription || ''}
                            onChange={(e) => handleInputChange('roomDescription', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(homeData.roomDescription)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Bạn cùng phòng */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Bạn cùng phòng</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            type="text"
                            value={homeData.roomMateInfo || ''}
                            onChange={(e) => handleInputChange('roomMateInfo', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(homeData.roomMateInfo)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Tiện nghi */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Tiện nghi</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={homeData.amenities || ''}
                            onChange={(e) => handleInputChange('amenities', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(homeData.amenities)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Phương tiện di chuyển */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Phương tiện di chuyển</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            type="text"
                            value={homeData.transportation || ''}
                            onChange={(e) => handleInputChange('transportation', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(homeData.transportation)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Mô tả chung */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Mô tả chung</Form.Label>
                </Col>
                <Col lg={8}>
                    {isEditing ? (
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={homeData.overallDescription || ''}
                            onChange={(e) => handleInputChange('overallDescription', e.target.value)}
                        />
                    ) : (
                        renderDataOrFallback(homeData.overallDescription)
                    )}
                </Col>
            </Row>

            <hr />

            {/* Hình ảnh nhà */}
            <Row className="mb-3">
                <Col lg={4} className="d-flex align-items-center">
                    <Form.Label>Hình ảnh nhà của bạn</Form.Label>
                </Col>
                <Col lg={8}>
                    <Row>
                        {homeData.homePhotos?.$values?.map(photo => (
                            <Col xs={12} md={4} className="mb-3" key={photo.photoId}>
                                <img src={photo.homePhotoUrl} alt={`House ${photo.photoId}`} className="img-fluid rounded-3" />
                            </Col>
                        ))}
                    </Row>
                    {isEditing && <UploadImageComponent onUpload={handleUploadImages} />}
                </Col>
            </Row>

            {isEditing && (
                <Button variant='success' className='rounded-5' onClick={() => console.log('Save Changes:', homeData)}>
                    Lưu thay đổi
                </Button>
            )}
        </Container>
    );
}

export default React.memo(MyHome);
