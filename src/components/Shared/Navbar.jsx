import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar as BootstrapNavbar, Nav, Row, Col, Container, Dropdown, Button, Offcanvas, Badge } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import '../../assets/css/Shared/NavBar.css';
import logo from '../../assets/images/logo.png';
import logoMobile from '../../assets/images/logo.svg';
import { useDispatch, useSelector } from "react-redux";
import Login from './Login';
import Register from './Register';
import { openLoginModal, closeLoginModal, openRegisterModal, closeRegisterModal } from "../../redux/actions/modalActions";
import axios from 'axios';
import NotifyItem from "../Shared/NotifyItem";
import MessengerItem from "../Shared/MessengerItem";
import { logout } from "../../redux/actions/authActions";
import { toast } from 'react-toastify';
import { viewProfile } from '../../redux/actions/profileActions';
import * as signalR from '@microsoft/signalr';
import { searchTour } from '../../redux/actions/searchAction';

const Navbar = React.memo(() => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]); // Added messages state
  const [showMoreNotifications, setShowMoreNotifications] = useState(false);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const connectionRef = useRef(null);
  const [chats, setChats] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const isRegisterModalOpen = useSelector((state) => state.modal.isRegisterModalOpen);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const SIGNALR_HUB_URL = 'https://travelmateapp.azurewebsites.net/serviceHub';

  const handelShowOffcanvas = useCallback(() => {
    setShowOffcanvas(true);
  });

  const handleSearchDestination = useCallback(() => {
    navigate(RoutePath.DESTINATION); // Điều hướng đến trang "Khách du lịch"
  }, [navigate]);

  const handleSearchLocal = useCallback(() => {
    navigate(RoutePath.SEARCH_LIST_LOCAL); // Điều hướng đến trang "Người địa phương"
  }, [navigate]);

  const handleSearchTraveller = useCallback(() => {
    navigate(RoutePath.SEARCH_LIST_TRAVELLER); // Điều hướng đến trang "Khách du lịch"
  }, [navigate]);

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const fetchChats = async () => {
    try {
      // const response = await axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Chats', {
      //   headers: {
      //     Authorization: `${token}`
      //   }
      // });
      // setChats(response.data?.$values);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Fetch thông báo từ API
  const fetchNotifications = async () => {
    if (isAuthenticated && token) {
      axios.get('https://travelmateapp.azurewebsites.net/api/Notification/current-user/notifications', {
        headers: {
          Authorization: `${token}`
        }
      })
        .then(response => {
          if (response.data?.$values) {
            const updatedNotifications = response.data.$values.map(notification => {
              return {
                ...notification,
                isRequest: notification.message.includes("Bạn đã nhận được một lời mời kết bạn từ "),
                senderId: notification.senderId ? notification.senderId : null
              };
            });
            setNotifications(updatedNotifications);
            // Đếm số lượng thông báo chưa đọc
            const unreadCount = updatedNotifications.filter(notification => !notification.isRead).length;
            setUnreadNotificationsCount(unreadCount); // Cập nhật số lượng thông báo chưa đọc
            // console.log("Notifications data: ", updatedNotifications);
          }
        })
        .catch(error => {
          console.error('Error fetching notifications:', error);
        });
    }
  };

  const setupSignalRConnection = () => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://travelmateapp.azurewebsites.net/serviceHub', {
        skipNegotiation: true,  // Optional: You can try skipping the negotiation if you're having issues with CORS
        transport: signalR.HttpTransportType.WebSockets // Use WebSockets if available
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    connectionRef.current = connection;
    connection
      .start()
      .then(() => {
        console.log('SignalR connected successfully.');
        // Lắng nghe sự kiện "NotificationReceived"
        connection.on('NotificationCreated', (newNotification) => {
          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);
        });
        // Lắng nghe sự kiện "ReadNotification"
        connection.on('ReadNotification', (updatedNotification) => {
          console.log(updatedNotification);
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.notificationId === updatedNotification.notificationId
                ? updatedNotification
                : notification
            )
          );
        });
      })
      .catch((error) => {
        console.error('Error connecting to SignalR hub:', error);
        console.error(error.response || error.message || error);
      });
  };

  useEffect(() => {
    setupSignalRConnection();
    fetchChats();
    fetchNotifications();
    // Cleanup on unmount or logout
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop()
          // .then(() => {
          //   console.log("SignalR connection stopped on unmount.");
          // })
          .catch((error) => {
            console.error("Error stopping SignalR connection on unmount:", error);
          });
      }
    };
  }, [isAuthenticated, token]);

  const updateUnreadCount = useCallback(() => {
    setUnreadNotificationsCount((prevCount) => prevCount - 1);
  }, []);

  const handleLoginModal = useCallback(() => {
    if (isLoginModalOpen) {
      dispatch(closeLoginModal());
    } else {
      dispatch(openLoginModal());
    }
  }, [dispatch, isLoginModalOpen]);

  const handleRegisterModal = useCallback(() => {
    if (isRegisterModalOpen) {
      dispatch(closeRegisterModal());
    } else {
      dispatch(openRegisterModal());
    }
  }, [dispatch, isRegisterModalOpen]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    // Clear token from state
    dispatch(logout());
    // Stop SignalR connection
    if (connectionRef.current) {
      connectionRef.current.stop()
        .then(() => {
          console.log("SignalR connection stopped.");
        })
        .catch((error) => {
          console.error("Error stopping SignalR connection:", error);
        });
    }
  }, [dispatch]);

  const handleSelect = useCallback((eventKey) => {
    setSelectedItem(eventKey);
  }, []);

  const handleShow = useCallback(() => setShowOffcanvas(true), []);
  const handleClose = useCallback(() => setShowOffcanvas(false), []);

  const handleAcceptFriendRequest = async (senderId) => {
    try {
      const response = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/Friendship/accept?fromUserId=${senderId}`,
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      if (response.status === 200) {

        toast.success("Chấp nhận kết bạn thành công!");
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error("Lỗi khi chấp nhận kết bạn!");
    }
  };

  const handleRejectFriendRequest = async (userIdRequest) => {
    try {
      const response = await axios.delete(
        `https://travelmateapp.azurewebsites.net/api/Friendship/remove?friendUserId=${userIdRequest}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Từ chối kết bạn thành công!");
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error("Lỗi khi từ chối kết bạn!");
    }
  };

  const handleShowMoreNotifications = () => {
    if (showMoreNotifications) {
      const initialNotifications = notifications.slice(0, 5);
      setDisplayedNotifications(initialNotifications);
      setShowMoreNotifications(false);
    } else {
      const moreNotifications = notifications.slice(0, 100);
      setDisplayedNotifications(moreNotifications);
      setShowMoreNotifications(true);
    }
  };

  useEffect(() => {
    const initialNotifications = notifications.slice(0, 5);
    setDisplayedNotifications(initialNotifications);
  }, [notifications]);

  // search

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedItem, setSelectedItem] = useState('Địa điểm du lịch');

  const location = useLocation(); // Lấy Route hiện tại

  // Hàm chuyển chuỗi thành không dấu
  const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  // Gọi API để lấy danh sách địa điểm
  const fetchLocations = useCallback(async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Locations');
      setLocations(response.data.$values);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    const savedLocations = JSON.parse(localStorage.getItem('selectedLocations')) || [];
    console.log('Địa điểm đã lưu:', savedLocations);
  }, []);


  // Hàm xử lý tìm kiếm theo từng loại
  const handleEnterSearch = (e) => {
    if (e.key === 'Enter') {
      if (selectedItem === 'Địa điểm du lịch') {
        navigate(RoutePath.DESTINATION, { state: { searchInput } });
      } else if (selectedItem === 'Người địa phương') {
        navigate(RoutePath.SEARCH_LIST_LOCAL, { state: { searchInput } });
      } else if (selectedItem === 'Khách du lịch') {
        navigate(RoutePath.SEARCH_LIST_TRAVELLER, { state: { searchInput } });
      }
    }
    dispatch(searchTour(searchInput));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    const filtered = locations.filter((location) =>
      removeVietnameseTones(location.locationName.toLowerCase()).includes(removeVietnameseTones(value.toLowerCase()))
    );
    setFilteredLocations(filtered.slice(0, 5));
  };

  const handleLocationSelect = (location) => {
    setSearchInput(location.locationName);
    setFilteredLocations([]);
    localStorage.setItem('selectedLocation', JSON.stringify(location)); // Lưu vào localStorage

    if (selectedItem === "Địa điểm du lịch") {
      navigate(RoutePath.DESTINATION, { state: { selectedLocation: location } });
    } else if (selectedItem === "Người địa phương") {
      navigate(RoutePath.SEARCH_LIST_LOCAL, { state: { selectedLocation: location } });
    } else if (selectedItem === "Khách du lịch") {
      navigate(RoutePath.SEARCH_LIST_TRAVELLER, { state: { selectedLocation: location } });
    }
  };
  

  // Cập nhật giao diện khi thay đổi `location.pathname`
  useEffect(() => {
    if (location.pathname.includes(RoutePath.SEARCH_LIST_LOCAL)) {
      localStorage.removeItem('selectedLocation');
      setSelectedItem("Người địa phương");
    } else if (location.pathname.includes(RoutePath.SEARCH_LIST_TRAVELLER)) {
      localStorage.removeItem('selectedLocation');
      setSelectedItem("Khách du lịch");
    } else {
      localStorage.removeItem('selectedLocation');
      setSelectedItem("Địa điểm du lịch");
    }
  }, [location.pathname]);

  return (
    <BootstrapNavbar bg="white" expand="lg" className='my-navbar fixed-top'>
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
                <input
                  className="search-input bg-white"
                  type="text"
                  placeholder="Bạn muốn đến..."
                  value={searchInput}
                  onChange={handleInputChange}
                  onKeyDown={handleEnterSearch}
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '12px' }}
                />
                {filteredLocations.length > 0 && (
                  <Dropdown.Menu show className="w-100">
                    {filteredLocations.map((location) => (
                      <Dropdown.Item key={location.locationId} onClick={() => handleLocationSelect(location)}>
                        {location.locationName}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                )}
              </div>

              <div className='d-flex'>
                <Dropdown onSelect={handleSelect} align="end">
                  <Dropdown.Toggle variant="success" id="dropdown-basic-Navbar" style={{
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
                    <Dropdown.Item
                      eventKey="Địa điểm du lịch"
                      className="custom-dropdown-item px-0 d-flex flex-column"
                      onClick={handleSearchDestination}
                    >
                      <p className="m-0 fw-medium">Địa điểm du lịch</p>
                      <p className="m-0 fw-light">Khám phá điểm đến thú vị</p>
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Người địa phương"
                      className="custom-dropdown-item px-0 d-flex flex-column"
                      onClick={handleSearchLocal} // Gọi hàm điều hướng
                    >
                      <p className="m-0">Người địa phương</p>
                      <p className="m-0 fw-light">Tìm bạn cùng khám phá thành phố</p>
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="Khách du lịch"
                      className="custom-dropdown-item px-0 d-flex flex-column"
                      onClick={handleSearchTraveller} // Gọi hàm điều hướng
                    >
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
                  <Dropdown.Toggle className="messages_action bg-white rounded-5 border-0 d-flex justify-content-center align-items-center shadow-none">
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
                  <Dropdown.Toggle className="notify_action shadow-none bg-white rounded-5 border-0 d-flex justify-content-center align-items-center position-relative">
                    <ion-icon name="notifications-outline" style={{ color: 'black', fontSize: '20px' }}></ion-icon>
                    {unreadNotificationsCount > 0 && (
                      <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                        {unreadNotificationsCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="py-3 dropdown-menu-notify">
                    <div className="notification-scroll">
                      {displayedNotifications.map((notification) => (
                        <Dropdown.Item key={notification.notificationId}>
                          <NotifyItem
                            notificationId={notification.notificationId}
                            typeNotification={notification.typeNotification}
                            senderId={notification.senderId}
                            avatar={user?.avatarUrl || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                            content={notification.message}
                            isRequest={notification.isRequest}
                            name={user?.username || 'User'}
                            isRead={notification.isRead}
                            onAccept={() => handleAcceptFriendRequest(notification.senderId)}
                            onDecline={() => handleRejectFriendRequest(notification.senderId)}
                            updateUnreadCount={updateUnreadCount}
                          />
                        </Dropdown.Item>
                      ))}
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-center mt-2 gap-1"
                      onClick={handleShowMoreNotifications}
                    >
                      <p className="m-0 messege-more">
                        {showMoreNotifications ? "Hiển thị ít hơn" : "Xem thêm thông báo"}
                      </p>
                      <ion-icon
                        name={showMoreNotifications ? "chevron-up-circle-outline" : "chevron-down-circle-outline"}
                        style={{ fontSize: '20px' }}
                      ></ion-icon>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown align="end">
                  <Dropdown.Toggle className="avatar bg-white text-secondary rounded-5 p-1 d-flex justify-content-between px-2 align-items-center gap-1">
                    <img
                      className="object-fit-cover rounded-5"
                      src={user?.avatarUrl || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                      alt="avatar"
                      width={31}
                      height={31}
                    />
                    <ion-icon name="menu-outline"></ion-icon>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="p-1 avatar-dropdown">
                    <Dropdown.Item onClick={
                      () => {
                        dispatch(viewProfile(user.id, token));
                        navigate(RoutePath.PROFILE_MY_PROFILE);
                      }
                    } className="avatar-dropdown-item">
                      Hồ sơ
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={RoutePath.CONTRACT} className="avatar-dropdown-item">
                      Hợp đồng
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={RoutePath.LOCAL_STATICTIS} className="avatar-dropdown-item">
                      Trang quản lý
                    </Dropdown.Item>
                    <Dropdown.Divider style={{
                      marginBottom: '24px'
                    }} />
                    <Dropdown.Item as={Link} to={RoutePath.SETTING} className="avatar-dropdown-item">
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
                <Button variant='' className='text-nowrap btn-action rounded-5 fw-normal' onClick={handleRegisterModal}>Đăng ký</Button>
                <Button variant='' className='text-nowrap btn-action rounded-5 fw-normal'
                  onClick={handleLoginModal}
                  style={{
                    background: '#007931',
                    color: 'white',
                  }}>Đăng nhập</Button>
                {/* Nút để mở Offcanvas */}
                <Button variant='outline-secondary' className='d-lg-none' onClick={handleShow}><ion-icon name="menu-outline"></ion-icon></Button></>
            )}
          </Col >
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
              <Dropdown.Toggle variant="success" id="" style={{
                borderTopLeftRadius: '0',
                borderBottomLeftRadius: '0',
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
                width: '120px',
                fontSize: '10px',
                height: '38px'
              }} />
              <Dropdown.Toggle variant="success" id="" style={{
                borderTopLeftRadius: '0',
                borderBottomLeftRadius: '0',
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
                width: '120px',
                fontSize: '10px',
                height: '38px'
              }}>
                {selectedItem}
              </Dropdown.Toggle>
              <Dropdown.Menu className='text-start'>
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
});

export default Navbar;