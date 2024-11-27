import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import axios from 'axios';

import { storage } from '../../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import UploadImageComponent from '../../../components/Shared/UploadImageComponent';

import { useQuery, useMutation, useQueryClient } from 'react-query';

import { toast } from 'react-toastify';  // Thêm phần này
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho toastify
import { useNavigate } from 'react-router-dom';
import { viewProfile } from '../../../redux/actions/profileActions';

function MyHome() {
    const [isEditing, setIsEditing] = useState(false);
    const [locations, setLocations] = useState([]);
    const [homeData, setHomeData] = useState({});
    const dataProfile = useSelector(state => state.profile);

    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    const userHomeId = dataProfile?.home?.userHomeId;

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleSaveChanges = async () => {
        try {
            const userHomeId = dataProfile?.home?.userHomeId;
            if (!userHomeId) {
                toast.error("Không tìm thấy ID nhà của bạn.");
                return;
            }

            // In toàn bộ dữ liệu ra console để kiểm tra
            console.log("Data to be sent:", homeData);

            const response = await axios.put(
                `https://travelmateapp.azurewebsites.net/api/UserHome/edit-current-user/${userHomeId}`,
                {
                    maxGuests: homeData.maxGuests,
                    guestPreferences: homeData.guestPreferences,
                    allowedSmoking: homeData.allowedSmoking,
                    roomDescription: homeData.roomDescription,
                    roomType: homeData.roomType || "",
                    roomMateInfo: homeData.roomMateInfo,
                    amenities: homeData.amenities,
                    transportation: homeData.transportation,
                    overallDescription: homeData.overallDescription,
                },
                {
                    headers: {
                        Authorization: `${token}`, // Bổ sung Bearer nếu cần
                    },
                }
            );

            if (response.status === 200) {
                dispatch(viewProfile(user.id));
                setIsEditing(false);
                toast.success("Cập nhật thành công!");
            } else {
                toast.error("Cập nhật thất bại.");
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            toast.error("Đã xảy ra lỗi khi lưu thay đổi.");
        }
    };

    //Home photos
    const [isUploading, setIsUploading] = useState(false);

    const updateApiUrl = `${import.meta.env.VITE_BASE_API_URL}/api/UserHome/edit-current-user`;
    const addImagesApiUrl = `${import.meta.env.VITE_BASE_API_URL}/api/HomePhoto/currentAddImagesHome`;

    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        maxGuests: 0,
        guestPreferences: '',
        allowedSmoking: '',
        roomDescription: '',
        roomType: '',
        roomMateInfo: '',
        amenities: '',
        transportation: '',
        overallDescription: '',
        homePhotos: [],
    });
    const triggerFileInput = useCallback(() => {
        document.getElementById('fileInputGroup').click();
    }, []);

    const updateHomePhotos = useCallback(async (photoUrls) => {
        console.log(userHomeId);
        console.log(photoUrls);
        try {
            await axios.post(addImagesApiUrl, {
                userHomeId: userHomeId,
                photoUrls: photoUrls,
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            dispatch(viewProfile(user.id, token));
            toast.success("Ảnh đã được cập nhật thành công trên server!");
        } catch (error) {
            console.error("Error updating photos:", error);
            toast.error("Lỗi khi cập nhật ảnh trên server.");
        }
    }, [addImagesApiUrl, userHomeId, token]);

    const handleFileSelect = useCallback(async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setIsUploading(true);
            const uploadedUrls = [];
            for (const file of files) {
                const storageRef = ref(storage, `images/${file.name}`);
                try {
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    uploadedUrls.push(url);
                } catch (error) {
                    toast.error(`Lỗi khi tải lên ảnh: ${file.name}`);
                }
            }

            // Cập nhật trạng thái với các URL ảnh mới
            setFormData((prevState) => ({
                ...prevState,
                homePhotos: [...prevState.homePhotos, ...uploadedUrls],
            }));

            // Chỉ truyền các URL ảnh mới được tải lên vào hàm updateHomePhotos
            await updateHomePhotos(uploadedUrls);

            toast.success('Ảnh đã được tải lên thành công');
            setIsUploading(false);

            // Tải lại dữ liệu sau khi cập nhật ảnh
            queryClient.invalidateQueries('userData');
        }
    }, [updateHomePhotos, queryClient]);




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

            {/* <div className="container px-5">
                <div className="row">
                    {formData.homePhotos.map((image, index) => (
                        <div
                            key={index}
                            className="col col-lg-4 col-md-6 col-6 image-grid-container"
                        >
                            <div className="img-thumbnail shadow p-3">
                                <LazyLoadImage
                                    src={image.homePhotoUrl}
                                    alt={`image-${index}`}
                                    effect="blur" // Tạo hiệu ứng làm mờ khi tải
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}


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
                    {isEditing &&
                        <div className="display-form-myhome mt-4">
                            <input
                                type="file"
                                id="fileInputGroup"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                                multiple // Cho phép chọn nhiều ảnh
                            />
                            <Button
                                variant=""
                                onClick={triggerFileInput}
                                disabled={isUploading}
                                className="mb-3 input-save"
                            >
                                {isUploading ? (
                                    'Đang tải lên...'
                                ) : (
                                    <>
                                        Nhấn vào đây để{' '}
                                        <span className='text-primary'>upload</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    }
                </Col>
            </Row>

            {isEditing && (
                <Button variant='success' className='rounded-5' onClick={handleSaveChanges}>
                    Lưu thay đổi
                </Button>
            )}
        </Container>
    );
}

export default React.memo(MyHome);
