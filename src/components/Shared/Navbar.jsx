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
import chatbubble from '../../assets/images/chatbubbles.svg'
import notify from '../../assets/images/notify.svg'
import NotifyItem from "../Shared/NotifyItem";
import MessengerItem from "../Shared/MessengerItem";
import { logout } from "../../redux/actions/authActions";

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //const isAuthenticated = useState(true);
  const [selectedItem, setSelectedItem] = useState('Địa điểm du lịch');
  const [showOffcanvas, setShowOffcanvas] = useState(false); // State để điều khiển Offcanvas
  const dispatch = useDispatch();

  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const isRegisterModalOpen = useSelector((state) => state.modal.isRegisterModalOpen);
  
  const user = useSelector((state) => state.auth.user);

  const handelShowOffcanvas = () => {
    setShowOffcanvas(true);
  }

  const notifications = [
    {
      "id": 1,
      "isRequest": true,
      "avatar": "https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj",
      "content": "Bạn có một yêu cầu kết bạn",
      "name": "Sơn Tùng MTP"
    },
    {
      "id": 2,
      "isRequest": false,
      "avatar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3xjGTAPhRSIQ9TpbJbBKruRQpaTepXiKL3Q&s",
      "content": "Tin nhắn từ nhóm",
      "name": "Đức Phúc"
    },
    {
      "id": 3,
      "isRequest": true,
      "avatar": "https://cdn.tuoitre.vn/zoom/700_525/471584752817336320/2024/8/29/hieuthuhai-6-1724922106140134622997-0-0-994-1897-crop-17249221855301721383554.jpg",
      "content": "Yêu cầu tham gia sự kiện",
      "name": "HIEUTHUHAI"
    }
  ];

  const messages = [
    {
      id: 1,
      avatar: 'https://yt3.googleusercontent.com/oN0p3-PD3HUzn2KbMm4fVhvRrKtJhodGlwocI184BBSpybcQIphSeh3Z0i7WBgTq7e12yKxb=s900-c-k-c0x00ffffff-no-rj',
      name: 'Sơn Tùng MTP',
      message: 'Hello, how are you? ',
      time: '10:30 AM',
    },
    {
      id: 2,
      avatar: 'https://cdn.tuoitre.vn/zoom/700_525/471584752817336320/2024/8/29/hieuthuhai-6-1724922106140134622997-0-0-994-1897-crop-17249221855301721383554.jpg',
      name: 'HIEUTHUHAI',
      message: 'Let’s meet up this weekend!',
      time: '09:45 AM',
    },
    {
      id: 3,
      avatar: 'https://tq10.mediacdn.vn/thumb_w/1000/160588918557773824/2022/11/17/truong-giang-1668657634653863093929.jpg',
      name: 'Trường Giang',
      message: 'I’ve sent you the document.',
      time: 'Yesterday',
    },
    {
      id: 4,
      avatar: 'https://tudienwiki.com/wp-content/uploads/2023/02/Soobin-Hoang-Son.jpg',
      name: 'MCK',
      message: 'I’ve sent you the document.',
      time: 'Yesterday',
    },
  ];

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

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
    console.log(`Selected item: ${eventKey}`);
  };

  const handleShow = () => setShowOffcanvas(true); // Mở Offcanvas
  const handleClose = () => setShowOffcanvas(false); // Đóng Offcanvas

  return (
    <BootstrapNavbar bg="white" expand="lg" className='my-navbar shadow fixed-top'>
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

            {isAuthenticated ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle className="messages_action bg-white rounded-5 border-0 d-flex justify-content-center align-items-center">
                    <ion-icon name="chatbubbles-outline" style={{
                      color: 'black',
                      fontSize: '20px'
                    }}></ion-icon>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="py-3 messenger-dropdown-menu">
                    {messages.map((message) => (
                      <Dropdown.Item key={message.id} href={`#message${message.id}`} className="px-3 py-2">
                        <MessengerItem
                          avatar={message.avatar}
                          name={message.name}
                          message={message.message}
                          time={message.time}
                        />
                      </Dropdown.Item>
                    ))}
                    <Link to={RoutePath.CHAT} className='text-black'>
                      <div className="d-flex align-items-center justify-content-center mt-2 gap-1">
                        <p className="m-0 messege-more">Mở tin nhắn</p>
                        <ion-icon name="chevron-forward-circle-outline" style={{
                          fontSize: '20px'
                        }}></ion-icon>
                      </div>
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown align="end">
                  <Dropdown.Toggle className="notify_action bg-white rounded-5 border-0 d-flex justify-content-center align-items-center">
                    <ion-icon name="notifications-outline" style={{
                      color: 'black',
                      fontSize: '20px'
                    }}></ion-icon>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="py-3 dropdown-menu-notify">
                    {notifications.map((notification) => (
                      <Dropdown.Item key={notification.id} href={`#notification${notification.id}`}>
                        <NotifyItem avatar={notification.avatar} content={notification.content} isRequest={notification.isRequest} name={notification.name} />
                      </Dropdown.Item>
                    ))}
                    <div className="d-flex align-items-center justify-content-center mt-2 gap-1">
                      <p className="m-0 messege-more">Xem thêm thông báo</p>
                      <ion-icon name="chevron-down-circle-outline" style={{
                        fontSize: '20px'
                      }}></ion-icon>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown align="end">
                  <Dropdown.Toggle className="avatar bg-white text-secondary rounded-5 p-1 d-flex justify-content-between px-2 align-items-center gap-1">
                    <img
                      className="object-fit-cover rounded-5"
                      src={user.avatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4g_2Qj3LsNR-iqUAFm6ut2EQVcaou4u2YXw&s"}
                      alt="avatar"
                      width={31}
                      height={31}
                    />
                    <ion-icon name="menu-outline"></ion-icon>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="p-1 avatar-dropdown" >
                    <Dropdown.Item as={Link} to={RoutePath.PROFILE} className="avatar-dropdown-item">
                      Hồ sơ
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={RoutePath.SETTING} className="avatar-dropdown-item">
                      Trang quản lý
                    </Dropdown.Item>
                    <Dropdown.Divider style={{
                      marginBottom: '24px'
                    }} />
                    <Dropdown.Item onClick={handleLogout} className="avatar-dropdown-item">
                      Cài đặt
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout} className="avatar-dropdown-item mb-0">
                      Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button
                  variant="link"
                  className="p-0 d-lg-none text-black btn-canvas"
                  onClick={handelShowOffcanvas}
                >
                  <i className="bi bi-list fs-1"></i>
                </Button>
                <Button variant='outline-secondary' className='d-lg-none' onClick={handleShow}><ion-icon name="menu-outline"></ion-icon></Button>
              </>
            ) : (
              <>
                <Button variant='' className='text-nowrap btn-action rounded-5 fw-normal' onClick={handleRegisterModal}>Đăng kí</Button>
                <Button variant='' className='text-nowrap btn-action rounded-5 fw-normal'
                  onClick={handleLoginModal}
                  style={{
                    background: '#007931',
                    color: 'white',
                  }}>Đăng nhập</Button>
                {/* Nút để mở Offcanvas */}
                <Button variant='outline-secondary' className='d-lg-none' onClick={handleShow}><ion-icon name="menu-outline"></ion-icon></Button></>
            )}


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
