import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

  const fetchUserData = () => {
    axios.get(apiUrl, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then(response => {
        const data = response.data;
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
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchUserData(); // Load user data on component mount
  }, [token]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: id === "maxGuests" ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userHomeId) {
      console.error("No userHomeId available for update.");
      return;
    }

    // Submit updated data to the API with the token
    axios.put(`${updateApiUrl}/${userHomeId}`, formData, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then(response => {
        toast.success("Home details updated successfully!");
      })
      .catch(error => {
        console.error("Error updating data:", error);
      });
  };

  const handleFileSelect = async (event) => {
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
      fetchUserData();
    }
  };

  const updateHomePhotos = async (photoUrls) => {
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
  };

  const triggerFileInput = () => {
    document.getElementById('fileInputGroup').click();
  };

  return (
    <div className="p-4 edit-pro-container-myhome border-0 w-100" style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
    }}>
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-start mb-4 ">
          <h5 className="me-4">
            <Link to={RoutePath.PROFILE_EDIT} className='text-black fw-bolder'>GIỚI THIỆU</Link>
          </h5>
          <h5 className='text-success fw-bolder'>NHÀ CỦA TÔI</h5>
        </div>

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
            <div style={{ borderLeft: '1px solid #ddd', height: '100%' }}></div>
          </Col>

          <Col md={6}>
            <h5 className="text-danger">NƠI TÁ TÚC</h5>
            <Form.Group controlId="roomType" className="mb-3">
              <Form.Label className='fw-medium'>Loại phòng</Form.Label>
              <Form.Control
                type="text"
                value={formData.roomType}
                onChange={handleInputChange}
                className='label-small-form-myhome rounded-5'
                style={{
                  height: '30px'
                }}
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
            className="mb-3"
            style={{
              borderRadius: '20px',
              border: '1px dashed black',
              backgroundColor: '#F2F7FF',
              color: 'black',
            }}
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
          <Button type="submit" variant="success" className="me-2" style={{
            borderRadius: '20px',
          }}>Lưu thay đổi</Button>
          <Button variant="secondary" style={{
            borderRadius: '20px',
            border: '1px solid',
            backgroundColor: 'white',
            color: 'black',
          }}>Hủy</Button>
        </div>
      </Form>
    </div>
  );
};

export default EditMyHome;
