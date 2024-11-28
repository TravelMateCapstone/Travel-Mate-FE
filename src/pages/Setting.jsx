import React from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import '../assets/css/Setting.css';

function Setting() {
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
            <Row>
              <Col>
                <Form.Group className="d-flex align-items-center my-3">
                  <Form.Label className="me-2" style={{ width: '11.5%' }}>Ảnh 2 mặt CCCD</Form.Label>
                  <Form.Control type="file" multiple />
                </Form.Group>
              </Col>
            </Row>
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
