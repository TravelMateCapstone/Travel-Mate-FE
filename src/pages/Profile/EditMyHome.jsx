import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import '../../assets/css/Profile/EditMyHome.css';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

const EditMyHome = () => {
  const images = [
    'https://i.imgur.com/dlKmQ5B_d.jpeg?maxwidth=520&shape=thumb&fidelity=high',
    'https://i.imgur.com/76YvkdU_d.jpeg?maxwidth=520&shape=thumb&fidelity=high',
    'https://i.imgur.com/K1WyfPn_d.jpeg?maxwidth=520&shape=thumb&fidelity=high',
    'https://i.imgur.com/AOKbQXM_d.jpeg?maxwidth=520&shape=thumb&fidelity=high',
    'https://i.imgur.com/T6TtzcC_d.jpeg?maxwidth=520&shape=thumb&fidelity=high',
    'https://i.imgur.com/rdxtw3S_d.jpeg?maxwidth=520&shape=thumb&fidelity=high'
  ];

  return (
    <div className="p-4 edit-pro-container-myhome border-0 w-100" style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
    }}>
      <Form>
        {/* Title */}
        <div className="d-flex justify-content-start mb-4 ">
          <h5 className="me-4"><Link to={RoutePath.PROFILE_EDIT} className='text-black fw-bolder'>GIỚI THIỆU</Link></h5>
          <h5 className='text-success fw-bolder'>NHÀ CỦA TÔI</h5>
        </div>

        {/* Form Fields */}
        <Row className="mb-3 align-items-start" style={{ position: 'relative' }}>
          {/* Left Section */}
          <Col md={5}>
            <h5 className="text-danger fw-medium">ƯU TIÊN</h5>
            <Form.Group controlId="maxGuests" className="mb-3">
              <Form.Label className='fw-medium'>Số lượng khách tối đa</Form.Label>
              <Form.Control type="text" placeholder=""  className='label-small-form-myhome rounded-5' />
            </Form.Group>

            <Form.Group controlId="genderPreference" className="mb-3">
              <Form.Label className='fw-medium'>Giới tính tôi muốn đón</Form.Label>
              <Form.Control type="text" placeholder="" className='label-small-form-myhome rounded-5' />
            </Form.Group>

            <Form.Group controlId="smokingAllowed" className="mb-3">
              <Form.Label className='fw-medium'>Cho phép hút thuốc</Form.Label>
              <Form.Control type="text" placeholder="" className='label-small-form-myhome rounded-5' />
            </Form.Group>
          </Col>

          {/* Vertical Divider */}
          <Col md={1} className="d-flex justify-content-center align-items-center">
            <div style={{ borderLeft: '1px solid #ddd', height: '100%' }}></div>
          </Col>

          {/* Right Section */}
          <Col md={6}>
            <h5 className="text-danger">NƠI TÁ TÚC</h5>
            <Form.Group controlId="roomType" className="mb-3">
              <Form.Label className='fw-medium'>Loại phòng</Form.Label>
              <Form.Control type="text" placeholder="" className='label-small-form-myhome rounded-5' />
            </Form.Group>

            <Form.Group controlId="roomDescription" className="mb-3">
              <Form.Label className='fw-medium'>Mô tả phòng</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="" className='text-form-myhome-2 rounded-4' />
            </Form.Group>
          </Col>
        </Row>

        {/* Horizontal Divider */}
        <hr />

        {/* Additional Form Fields (Vertical Layout) */}
        <h5 className="text-danger fw-medium">CHI TIẾT</h5>
        <Row>
          <Col md={12}>
            <Form.Group controlId="roommate" className="mb-3">
              <Form.Label className='fw-medium'>Bạn cùng phòng</Form.Label>
              <Form.Control type="text" placeholder="" className='label-small-form-myhome rounded-5' />
            </Form.Group>

            <Form.Group controlId="sharedItems" className="mb-3">
              <Form.Label className='fw-medium'>Tôi có thể chia sẻ gì với bạn</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="" className='text-form-myhome rounded-4' />
            </Form.Group>

            <Form.Group controlId="transportation" className="mb-3">
              <Form.Label className='fw-medium'>Phương tiện di chuyển</Form.Label>
              <Form.Control type="text" placeholder="" className='label-small-form-myhome rounded-5' />
            </Form.Group>

            <Form.Group controlId="additionalInfo" className="mb-3">
              <Form.Label className='fw-medium'>Thông tin bổ sung</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="" className='text-form-myhome rounded-4' />
            </Form.Group>
          </Col>
        </Row>

        {/* Image Section */}
        <div className='display-form-myhome mt-4'>
          <h3 className="fw-medium image-tiltle">Hình ảnh nhà của bạn</h3>
          <div className="d-flex justify-content-start">
            <button className="btn btn-outline-primary input-save d-flex gap-1" style={{
              background: '#F2F7FF',
            }}><div style={{
              color: '#636363'
            }}>Nhấn vào đây để</div> <div style={{
              color: '#00A3FF'
            }}> upload</div></button>
          </div>
        </div>
        <div className="container px-5">
          <div className="row">
            {images.map((image, index) => (
              <div key={index} className='col col-lg-4 col-md-6 col-6 image-grid-container'>
                <div className='img-thumbnail shadow p-3'>
                  <img src={image} alt={`image-${index}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="d-flex justify-content-end mt-4">
          <Button variant="success" className="me-2" style={{
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
