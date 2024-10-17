import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Row, Col, Container, Dropdown, Button, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import '../../assets/css/Shared/NavBar.css';
import logo from '../../assets/images/logo.png';
import logoMobile from '../../assets/images/logo.svg'
import { useDispatch, useSelector } from "react-redux";
import Login from './Login';
import Register from './Register'
import { openLoginModal, closeLoginModal, openRegisterModal, closeRegisterModal } from "../../redux/actions/modalActions";

function Navbar() {
  const [selectedItem, setSelectedItem] = useState('Địa điểm du lịch');
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State để điều khiển Offcanvas
  const dispatch = useDispatch();

  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const isRegisterModalOpen = useSelector((state) => state.modal.isRegisterModalOpen);

  const handleLoginModal = () => {
    if (isLoginModalOpen) {
      dispatch(closeLoginModal());
    } else {
      dispatch(openLoginModal());
    }
  };

  const handleRegisterModal = () => {
    if (isRegisterModalOpen) {
      dispatch(closeRegisterModal());
    } else {
      dispatch(openRegisterModal());
    }
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
    console.log(`Selected item: ${eventKey}`);
  };

  const handleShow = () => setShowOffcanvas(true); // Mở Offcanvas
  const handleClose = () => setShowOffcanvas(false); // Đóng Offcanvas

  return (
    <BootstrapNavbar bg="light" expand="lg" className='my-navbar'>
      <Container fluid >
        <Row className="w-100">
          <Col xs={4} className='d-flex align-items-center'>
            <BootstrapNavbar.Brand as={Link} to={RoutePath.HOMEPAGE}>
              {/* Ảnh cho màn hình lớn (desktop, tablet) */}
              <img src={logo} alt="logo" className="d-none d-sm-block" />

              {/* Ảnh cho màn hình nhỏ (mobile) */}
              <img src={logoMobile} width={40} alt="logo" className="d-block d-sm-none" />
            </BootstrapNavbar.Brand>

            {/* Hiển thị thanh tìm kiếm và dropdown cho màn hình lớn hơn */}
            <div className='d-none d-lg-flex align-items-center'>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '5px', height: '38px', background: 'white' }} className='rounded-start-5 border-end-0'>
                <ion-icon name="search" style={{ marginRight: '10px', padding: '0 10px', background: 'white' }}></ion-icon>
                <input className='search-input bg-white' type="text" placeholder="Nhập từ khóa..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: '12px' }} />
              </div>

              <div className='d-flex'>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderLeft: '0px solid white',
                  borderRight: '0px solid white',
                  borderTop: '1px solid #ccc',
                  borderBottom: '1px solid #ccc',
                  height: '38px',
                  color: '#ccc',
                }} className=''>|</div>

                <Dropdown onSelect={handleSelect} align="end">
                  <Dropdown.Toggle variant="success" id="dropdown-basic" style={{
                    fontSize: '12px'
                  }} className='rounded-start-0 rounded-end-5 border-start-0 d-flex align-items-center gap-2'>
                    <p className='m-0 fw-semibold'>{selectedItem}</p>
                    <ion-icon name="chevron-down-outline" style={{
                      fontSize: '10px'
                    }}></ion-icon>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      border: '0px',
                      boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.17)',
                      width: '313px',
                    }}
                  >
                    <Dropdown.Item eventKey="Địa điểm du lịch" className="custom-dropdown-item px-0 d-flex flex-column">
                      <p className="m-0 fw-medium">Địa điểm du lịch</p>
                      <p className="m-0 fw-light">Khám phá điểm đến thú vị</p>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Người địa phương" className="custom-dropdown-item px-0 d-flex flex-column">
                      <p className="m-0">Người địa phương</p>
                      <p className="m-0 fw-light">Tìm bạn cùng khám phá thành phố</p>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Khách du lịch" className="custom-dropdown-item px-0 d-flex flex-column">
                      <p className="m-0">Khách du lịch</p>
                      <p className="m-0 fw-light">Kết nối với bạn bè để trải nghiệm</p>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Col>
          <Col xs={4} className="d-flex justify-content-center align-items-center">
            <div className='d-none d-md-flex gap-lg-4 gap-md-2'>
              <Nav.Link className='fw-medium' as={NavLink} to={RoutePath.HOMEPAGE} style={{
                fontSize: '16px',
              }}>Trang chủ</Nav.Link>
              <Nav.Link className='fw-medium' as={NavLink} to={RoutePath.EVENT} style={{
                fontSize: '16px'
              }}>Sự kiện</Nav.Link>
              <Nav.Link className='fw-medium' as={NavLink} to={RoutePath.GROUP} style={{
                fontSize: '16px'
              }}>Nhóm</Nav.Link>
            </div>
          </Col>
          <Col xs={4} className="d-flex justify-content-end gap-2 align-items-center pe-0">
            <Button variant='' className='text-nowrap btn-action rounded-5 fw-normal' onClick={handleRegisterModal}>Đăng kí</Button>
            <Button variant='' className='text-nowrap btn-action rounded-5 fw-normal'
              onClick={handleLoginModal}
              style={{
                background: '#007931',
                color: 'white',
              }}>Đăng nhập</Button>
            {/* Nút để mở Offcanvas */}
            <Button variant='outline-secondary' className='d-lg-none' onClick={handleShow}><ion-icon name="menu-outline"></ion-icon></Button>
          </Col>
        </Row>
      </Container>

      {/* Offcanvas cho các mục điều hướng và thanh tìm kiếm */}
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Thanh tìm kiếm */}
          <div className='d-flex'>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '5px', height: '38px' }} className='rounded-start-5'>
              <link rel="stylesheet" href="https://unpkg.com/ionicons@5.5.2/dist/ionicons.min.css" />
              <ion-icon name="search" style={{ marginRight: '5px', padding: '0 10px' }}></ion-icon>
              <input type="text" placeholder="Tìm kiếm..." style={{ border: 'none', outline: 'none', flex: 1 }} />
            </div>
            <Dropdown onSelect={handleSelect} align="end">
              <Dropdown.Toggle variant="success" id="" style={
                { borderTopLeftRadius: '0', borderBottomLeftRadius: '0', borderTopRightRadius: '20px', borderBottomRightRadius: '20px', width: '120px', fontSize: '10px', height: '38px' }
              }>
                {selectedItem}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Địa điểm du lịch">Địa điểm du lịch</Dropdown.Item>
                <Dropdown.Item eventKey="Người địa phương">Người địa phương</Dropdown.Item>
                <Dropdown.Item eventKey="Khách du lịch">Khách du lịch</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Nav className="flex-column mt-3">
            <Nav.Link as={NavLink} to={RoutePath.HOMEPAGE}>Trang chủ</Nav.Link>
            <Nav.Link as={NavLink} to={RoutePath.EVENT}>Sự kiện</Nav.Link>
            <Nav.Link as={NavLink} to={RoutePath.GROUP}>Nhóm</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <Login show={isLoginModalOpen} handleClose={handleLoginModal} />
      <Register show={isRegisterModalOpen} handleClose={handleRegisterModal} />
    </BootstrapNavbar>
  );
}

export default Navbar;
