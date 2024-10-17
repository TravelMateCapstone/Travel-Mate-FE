import React from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';
import '../../assets/css/Profile/EditProfile.css';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

const EditProfile = () => {
  return (
    <div className="p-4 edit-pro-container border-0 w-100" style={{
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)',
    }}>
      <Form>
        {/* Title */}
        <div className="d-flex justify-content-start mb-4">
          <h5 className="text-success me-4 fw-bolder">GIỚI THIỆU</h5>
          <h5 className=''><Link to={RoutePath.PROFILE_EDIT_MY_HOME} className='text-black fw-bolder'>NHÀ CỦA TÔI</Link></h5>
        </div>

        {/* Guest Status */}
        <Form.Group controlId="status" className="mb-3 align-items-center">
          <Form.Label className='fw-medium'>Tình trạng đón khách</Form.Label>
          <Form.Control type="text" className='label-small-form rounded-input' />
        </Form.Group>

        {/* Horizontal Divider */}
        <hr />

        {/* Two Columns with Vertical Divider */}
        <Row>
          {/* Left Column */}
          <Col md={6} className="pe-md-4">
            <Form.Group controlId="birthplace" className="mb-3">
              <Form.Label className='fw-medium'>Nơi tôi sinh ra</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' />
            </Form.Group>

            <Form.Group controlId="address" className="mb-3">
              <Form.Label className='fw-medium'>Địa chỉ cư trú</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' />
            </Form.Group>

            <Form.Group controlId="education" className="mb-3">
              <Form.Label className='fw-medium'>Giáo dục</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' />
            </Form.Group>
          </Col>

          {/* Vertical Divider */}
          <Col md={1} className="d-flex justify-content-center align-items-center">
            <div style={{ borderLeft: '1px solid #ddd', height: '100%' }}></div>
          </Col>

          {/* Right Column */}
          <Col md={5} className="">
            <Form.Group controlId="knownLanguages" className="mb-3">
              <Form.Label className='fw-medium'>Ngôn ngữ đã biết</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' />
            </Form.Group>

            <Form.Group controlId="learningLanguages" className="mb-3">
              <Form.Label className='fw-medium'>Ngôn ngữ đang học</Form.Label>
              <Form.Control type="text" className='label-small-form rounded-input' />
            </Form.Group>
          </Col>
        </Row>

        {/* Horizontal Divider */}
        <hr />

        {/* Bio Section */}
        <Form.Group controlId="bio" className="mb-3">
          <Form.Label className='fw-medium'>Giới thiệu</Form.Label>
          <Form.Control as="textarea" rows={3} className='text-form text-decription rounded-input' />
        </Form.Group>

        {/* Why Use Travel Mate */}
        <Form.Group controlId="whyTravelMate" className="mb-3">
          <Form.Label className='fw-medium'>Tại sao tôi sử dụng Travel Mate</Form.Label>
          <Form.Control as="textarea" rows={3} className='text-form text-decription rounded-input' />
        </Form.Group>

        {/* Hobbies Section */}
        <Form.Group controlId="hobbies" className="mb-3">
          <Form.Label className='fw-medium'>Sở thích</Form.Label>
          <div className="p-2 d-flex gap-3" style={{ minHeight: '40px', borderRadius: '20px',  border: '1px solid black' }}>
            <div className='px-3 rounded-5 fw-medium' style={{
              fontSize: '24px',
              border: '1px solid black'
            }}>Thể thao</div>


            <div className='px-3 rounded-5 fw-medium' style={{
              fontSize: '24px',
               border: '1px solid black'
            }}>Du lịch</div>
          </div>
        </Form.Group>

        {/* Music, Movies, Books Section */}
        <Form.Group controlId="musicMoviesBooks" className="mb-3">
          <Form.Label className='fw-medium'>Âm nhạc, phim ảnh & sách</Form.Label>
          <Form.Control as="textarea" rows={3} className='text-form text-decription rounded-input' />
        </Form.Group>

        {/* Save/Cancel Buttons */}
        <div className="d-flex justify-content-end mt-4">
          <Button variant="success" className="me-2" style={{ borderRadius: '20px' }}>
            Lưu thay đổi
          </Button>
          <Button variant="secondary" style={{
            borderRadius: '20px',
            border: '1px solid',
            backgroundColor: 'white',
            color: 'black',
          }}>
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditProfile;
