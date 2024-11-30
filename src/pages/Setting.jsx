import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import '../assets/css/Setting.css';

import { toast } from 'react-toastify';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { useSelector } from 'react-redux';

function Setting() {
  const [frontImage, setFrontImage] = useState(null);

  const [frontImageUrl, setFrontImageUrl] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const handleFrontImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFrontImage(file);

    try {
      // Upload image to Firebase
      const storageRef = ref(storage, `cccd/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update state with the image URL
      setFrontImageUrl(downloadURL);
      console.log("Ảnh đã tải lên:", downloadURL);

      // Prepare the data to send to the create-imageFront API
      const imageFrontData = {
        imageUrl: downloadURL
      };

      // Log the data being sent
      console.log("Gửi dữ liệu:", imageFrontData);

      // Call FPT API for OCR (nếu cần thiết)
      const formData = new FormData();
      formData.append('image', file);
      const ocrResponse = await axios.post(
        'https://api.fpt.ai/vision/idr/vnm',
        formData,
        {
          headers: {
            'api-key': '8JIYV5d32XHGakgucP899sGDv0QBej5R',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { errorCode, data } = ocrResponse.data;
      if (errorCode !== 0) {
        toast.error('Không thể lấy được thông tin CCCD.');
        return;
      }

      const cccdData = data[0];
      console.log("Dữ liệu CCCD nhận được:", cccdData);

      // Send image URL to your backend to create imageFront
      const createImageFrontResponse = await axios.post(
        'https://travelmateapp.azurewebsites.net/api/CCCD/create-imageFront',
        `${imageFrontData}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,  // Use Bearer token
          },
        }
      );

      console.log("Kết quả trả về từ API create-imageFront:", createImageFrontResponse.data);

      if (createImageFrontResponse.status === 200) {
        await axios.put(
          'https://travelmateapp.azurewebsites.net/api/CCCD/update-details-front',
          {
            id: cccdData.id,
            name: cccdData.name,
            dob: cccdData.dob.split('/').reverse().join('-'),
            sex: cccdData.sex,
            nationality: cccdData.nationality,
            home: cccdData.home,
            address: cccdData.address,
            doe: cccdData.doe.split('/').reverse().join('-'),
          },
          {
            headers: {
              'Authorization': `${token}`, // Make sure the token is passed here as well
            },
          }
        );

        toast.success('Xác thực CCCD thành công.');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      toast.error('Đã xảy ra lỗi trong quá trình xác thực CCCD.');
    }
  };



  const handleBackImageUpload = (event) => {
    // Handle logic upload image
    console.log(event.target.files);
  };
  return (
    <Container>
      <h2>Cài đặt</h2>
      <Row>
        <Col md={3} className="bg-light p-4 rounded bg-white">
          <Nav className="flex-column setting-menu">
            <Nav.Link href="#account" className="nav-link-custom">
              Tài Khoản
            </Nav.Link>
            <Nav.Link href="#notifications" className="nav-link-custom">
              Thông Báo
            </Nav.Link>
            <Nav.Link href="#membership" className="nav-link-custom">
              Đăng Kí Thành Viên
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9} className="p-4 rounded shadow-sm bg-white border">
          <h4>Chi Tiết Tài Khoản</h4>

          <section id="account-info" className="mb-4">
            <h5 style={{ color: '#E65C00' }}>Thông Tin Người Dùng</h5>
            <Row>
              <Col md={12}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2" style={{ width: '11.5%' }}>Tên tài khoản</Form.Label>
                  <Form.Control type="text" placeholder="Tên tài khoản" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Họ</Form.Label>
                  <Form.Control type="text" placeholder="Họ" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" placeholder="Tên" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select>
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              {/* <Form.Label className="me-2" style={{ width: '10%' }}>Ảnh 2 mặt CCCD</Form.Label> */}
              <Col md={6}>
                <div className="image-upload-wrapper d-flex align-items-center">
                  <p className="me-2" style={{ width: '28%' }}>Ảnh CCCD mặt trước</p>
                  {frontImageUrl ? (
                    <div className="uploaded-image">
                      <img src={frontImageUrl} alt="CCCD Mặt Trước" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  ) : (
                    <div className="image-upload">
                      <label htmlFor="front-image" className="upload-icon">
                        <ion-icon name="camera-outline"></ion-icon>
                      </label>
                      <input
                        type="file"
                        id="front-image"
                        accept="image/*"
                        onChange={handleFrontImageUpload}
                      />
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <div className="image-upload-wrapper d-flex align-items-center">
                  <p className="me-2" style={{ width: '28%' }}>Ảnh CCCD mặt sau</p>
                  <div className="image-upload">
                    <label htmlFor="back-image" className="upload-icon">
                      <ion-icon name="camera-outline"></ion-icon>
                    </label>
                    <input
                      type="file"
                      id="back-image"
                      accept="image/*"
                      onChange={handleBackImageUpload}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Form.Group className="d-flex align-items-center my-3">
                  <Form.Label className="me-2" style={{ width: '11.5%' }}>Ảnh 2 mặt CCCD</Form.Label>
                  <Form.Control type="file" multiple />
                </Form.Group>
              </Col>
            </Row> */}
          </section>

          <section id="account-details" className="mb-4">
            <h5 style={{ color: '#E65C00' }}>Thông Tin Tài Khoản</h5>
            <Form.Group className="d-flex align-items-center">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label className="me-2" style={{ width: '12.5%' }}>Mật khẩu</Form.Label>
              <p className="text-muted">Đổi mật khẩu</p>
            </Form.Group>
          </section>

          <section id="contact-info" className="mb-4">
            <h5 style={{ color: '#E65C00' }}>Thông Tin Liên Lạc</h5>
            <Form.Group className="d-flex align-items-center">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="text" placeholder="Số điện thoại" />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Địa chỉ nhà</Form.Label>
              <Form.Control type="text" placeholder="Địa chỉ nhà" />
            </Form.Group>
          </section>

          <section id="emergency-contact" className="mb-4">
            <h5 style={{ color: '#E65C00' }}>Liên Hệ Khẩn Cấp</h5>
            <p className="text-muted">
              Bạn cho phép chúng tôi thông báo cho người này nếu chúng tôi cho rằng bạn đang gặp tình huống khẩn cấp và chia sẻ thông tin về hoạt động cũng như vị trí của bạn với họ nếu có yêu cầu.
            </p>
            <Form.Group className="d-flex align-items-center">
              <Form.Label>Tên</Form.Label>
              <Form.Control type="text" placeholder="Tên" />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="text" placeholder="Số điện thoại" />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group className="d-flex align-items-center mt-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control as="textarea" rows={5} placeholder="Ghi chú" />
            </Form.Group>
          </section>

          <div className="d-flex justify-content-end">
            <Button variant="success" className="mt-3">
              Lưu Thông Tin
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Setting;
