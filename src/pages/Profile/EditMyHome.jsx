import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import RoutePath from '../../routes/RoutePath';
import '../../assets/css/Profile/EditMyHome.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LazyLoadImage } from 'react-lazy-load-image-component'; 
const EditMyHome = () => {
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
  const [userHomeId, setUserHomeId] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const apiUrl = 'https://travelmateapp.azurewebsites.net/api/UserHome/current-user';
  const updateApiUrl = 'https://travelmateapp.azurewebsites.net/api/UserHome/edit-current-user';
  const addImagesApiUrl = 'https://travelmateapp.azurewebsites.net/api/HomePhoto/currentAddImagesHome';
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const fetchUserData = useCallback(async () => {
    const { data } = await axios.get(apiUrl, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return data;
  }, [apiUrl, token]);

  const { data, error } = useQuery('userData', fetchUserData, {
    onSuccess: (data) => {
      setUserHomeId(data.userHomeId);
      setFormData({
        maxGuests: data.maxGuests || 0,
        guestPreferences: data.guestPreferences || '',
        allowedSmoking: data.allowedSmoking || '',
        roomDescription: data.roomDescription || '',
        roomType: data.roomType || '',
        roomMateInfo: data.roomMateInfo || '',
        amenities: data.amenities || '',
        transportation: data.transportation || '',
        overallDescription: data.overallDescription || '',
        homePhotos: data.homePhotos?.$values || []
      });
    },
  });

  const updateUserHome = useCallback(async (formData) => {
    await axios.put(`${updateApiUrl}/${userHomeId}`, formData, {
      headers: {
        Authorization: `${token}`,
      },
    });
  }, [updateApiUrl, userHomeId, token]);

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

  const mutation = useMutation(updateUserHome, {
    onSuccess: () => {
      toast.success("Thông tin nhà của tôi đã được cập nhật");
      queryClient.invalidateQueries('userData');
    },
    onError: (error) => {
      console.error("Error updating data:", error);
    },
  });

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: id === "maxGuests" ? parseInt(value) : value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!userHomeId) {
      console.error("No userHomeId available for update.");
      return;
    }
    setIsSubmitting(true);
    mutation.mutate(formData, {
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  }, [userHomeId, mutation, formData]);

  const triggerFileInput = useCallback(() => {
    document.getElementById('fileInputGroup').click();
  }, []);

  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4 edit-pro-container-myhome border-0 w-100 box-shadow">
      <div className="d-flex justify-content-start mb-4">
        <h5 className="me-4">
          <Link to={RoutePath.PROFILE_EDIT} className='text-black fw-bolder'>GIỚI THIỆU</Link>
        </h5>
        <h5 className='text-success fw-bolder'>NHÀ CỦA TÔI</h5>
      </div>
      {error ? (
        <div>Error loading data</div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3 align-items-start">
            <Col md={5}>
              <h5 className="text-danger fw-medium">ƯU TIÊN</h5>
              <Form.Group controlId="maxGuests" className="mb-3">
                <Form.Label className='fw-medium'>Số lượng khách tối đa</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  className='label-small-form-myhome rounded-5'
                />
              </Form.Group>

              <Form.Group controlId="guestPreferences" className="mb-3">
                <Form.Label className='fw-medium'>Giới tính tôi muốn đón</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.guestPreferences}
                  onChange={handleInputChange}
                  className='label-small-form-myhome rounded-5'
                />
              </Form.Group>

              <Form.Group controlId="allowedSmoking" className="mb-3">
                <Form.Label className='fw-medium'>Cho phép hút thuốc</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.allowedSmoking}
                  onChange={handleInputChange}
                  className='label-small-form-myhome rounded-5'
                />
              </Form.Group>
            </Col>

            <Col md={1} className="d-flex justify-content-center align-items-center">
              <div className="vertical-divider"></div>
            </Col>

            <Col md={6}>
              <h5 className="text-danger">NƠI TÁ TÚC</h5>
              <Form.Group controlId="roomType" className="mb-3">
                <Form.Label className='fw-medium'>Loại phòng</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className='label-small-form-myhome rounded-5 form-input-myhome w-100'
                />
              </Form.Group>

              <Form.Group controlId="roomDescription" className="mb-3">
                <Form.Label className='fw-medium'>Mô tả phòng</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.roomDescription}
                  onChange={handleInputChange}
                  className='text-form-myhome-2 rounded-4'
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <h5 className="text-danger fw-medium">CHI TIẾT</h5>
          <Row>
            <Col md={12}>
              <Form.Group controlId="roomMateInfo" className="mb-3">
                <Form.Label className='fw-medium'>Bạn cùng phòng</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.roomMateInfo}
                  onChange={handleInputChange}
                  className='label-small-form-myhome rounded-5'
                />
              </Form.Group>

              <Form.Group controlId="amenities" className="mb-3">
                <Form.Label className='fw-medium'>Tôi có thể chia sẻ gì với bạn</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.amenities}
                  onChange={handleInputChange}
                  className='text-form-myhome rounded-4'
                />
              </Form.Group>

              <Form.Group controlId="transportation" className="mb-3">
                <Form.Label className='fw-medium'>Phương tiện di chuyển</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.transportation}
                  onChange={handleInputChange}
                  className='label-small-form-myhome rounded-5'
                />
              </Form.Group>

              <Form.Group controlId="overallDescription" className="mb-3">
                <Form.Label className='fw-medium'>Thông tin bổ sung</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.overallDescription}
                  onChange={handleInputChange}
                  className='text-form-myhome rounded-4'
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Image Section */}
          <div className="display-form-myhome mt-4">
            <h3 className="fw-medium image-tiltle">Hình ảnh nhà của bạn</h3>
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

          <div className="container px-5">
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
        </div>
          <div className="d-flex justify-content-end mt-4">
            <Button type="submit" variant="success" className="me-2 rounded-20" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
            <Button variant="secondary" className="rounded-20 border-1 bg-white text-black" disabled={isSubmitting}>
              Hủy
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default React.memo(EditMyHome);
