import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import axios from 'axios';

import { storage } from '../../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import UploadImageComponent from '../../../components/Shared/UploadImageComponent';

import { useQuery, useMutation, useQueryClient } from 'react-query';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        if (dataProfile?.home) {
            setHomeData(dataProfile.home);
        }
    }, [dataProfile]);

    const toggleEdit = () => {
        dispatch(viewProfile(user.id));
        setIsEditing(!isEditing);
    };

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setHomeData(prev => ({ ...prev, [field]: value }));
        if (field === 'maxGuests') {
            if (value < 0) {
                setErrors(prev => ({ ...prev, maxGuests: 'Số lượng tối đa không được nhỏ hơn 0' }));
            } else {
                setErrors(prev => ({ ...prev, maxGuests: '' }));
            }
        }
    };

    const renderDataOrFallback = (data) => {
        return data ? data : <span style={{ fontStyle: 'italic', color: '#6c757d' }}>Chưa cập nhật</span>;
    };

    const handleSaveChanges = async () => {
        if (homeData.maxGuests < 0) {
            toast.error("Số lượng tối đa không được nhỏ hơn 0.");
            return;
        }

        try {
            const userHomeId = dataProfile?.home?.userHomeId;
            if (!userHomeId) {
                toast.error("Không tìm thấy ID nhà của bạn.");
                return;
            }
            // Thực hiện cập nhật dữ liệu như bình thường
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
                        Authorization: `${token}`,
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

    const deleteImageFromFirebase = async (imagePath) => {
        try {
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
            console.log(`Ảnh tại ${imagePath} đã được xóa thành công.`);
        } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
            throw new Error("Không thể xóa ảnh trên Firebase.");
        }
    };

    const handleDeleteImage = async (photoId, photoURL) => {
        try {
            const deleteApiUrl = `${import.meta.env.VITE_BASE_API_URL}/api/HomePhoto/${photoId}`;
            await axios.delete(deleteApiUrl, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            deleteImageFromFirebase(photoURL);
            toast.success("Ảnh đã được xóa thành công!");


            dispatch(viewProfile(user.id));
        } catch (error) {
            console.error("Error deleting photo:", error);
            toast.error("Lỗi khi xóa ảnh");
        }
    };

    const [showViewImage, setShowViewImage] = useState(false);
    const [imageToView, setImageToView] = useState('');

    const handleView = (imageUrl) => {
        setImageToView(imageUrl);
        setShowViewImage(true);
    };

    const handleCloseView = () => {
        setShowViewImage(false);
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
                        <>
                            <Form.Control
                                type="number"
                                max={50}
                                min={0}
                                value={homeData.maxGuests || ''}
                                onChange={(e) => handleInputChange('maxGuests', e.target.value)}
                                onBlur={() => {
                                    if (homeData.maxGuests < 0) {
                                        setErrors(prev => ({ ...prev, maxGuests: 'Số lượng tối đa không được nhỏ hơn 0' }));
                                    }
                                }}
                            />
                            {errors.maxGuests && (
                                <Form.Text className="text-danger">{errors.maxGuests}</Form.Text>
                            )}
                        </>
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
                            <option value="">Chọn giới tính ưu tiên</option>
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
                            <option value="">Lựa chọn</option>
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
                                <img src={photo.homePhotoUrl} alt={`House ${photo.photoId}`} className="img-fluid rounded-3" style={{ width: '300px', height: '150px' }} />
                                {isEditing ? (
                                    <ion-icon
                                        name="trash-outline"
                                        className="delete-icon"
                                        onClick={() => handleDeleteImage(photo.photoId, photo.homePhotoUrl)}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            fontSize: '24px',
                                            color: 'white'
                                        }}
                                    ></ion-icon>
                                ) : (
                                    <ion-icon
                                        name="eye-outline"
                                        className="view-icon"
                                        onClick={() => handleView(photo.homePhotoUrl)}
                                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', color: 'white' }}
                                    ></ion-icon>
                                )}
                            </Col>
                        ))}
                    </Row>
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
                                    <span className='text-primary'>thêm ảnh</span>
                                </>
                            )}
                        </Button>
                    </div>
                </Col>
            </Row>

            {isEditing && (
                <Button variant='success' className='rounded-5' onClick={handleSaveChanges}>
                    Lưu thay đổi
                </Button>
            )}
            {showViewImage && (
                <div className="fullscreen-image-container" onClick={handleCloseView}>
                    <img
                        src={imageToView}
                        alt="Ảnh phóng to sự kiện"
                        className="fullscreen-image"
                    />
                </div>
            )}
        </Container>
    );
}

export default React.memo(MyHome);
