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
  const [navigateTo, setNavigateTo] = useState(RoutePath.DESTINATION);

  const handleSearchDestination = useCallback(() => {
    setNavigateTo(RoutePath.DESTINATION);
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
            console.log("notify", notifications);
            const unreadCount = updatedNotifications.filter(notification => !notification.isRead).length;
            setUnreadNotificationsCount(unreadCount);
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
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    connectionRef.current = connection;
    connection
      .start()
      .then(() => {
        console.log('SignalR connected successfully.');
        connection.on('NotificationCreated', (newNotification) => {
          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);
        });
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
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop()
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
    if (connectionRef.current) {
      connectionRef.current.stop()
        .then(() => {
          console.log("SignalR connection stopped.");
        })
        .catch((error) => {
          console.error("Error stopping SignalR connection:", error);
        });
    }
    navigate(RoutePath.AUTH);
  }, [dispatch, navigate]);

  const handleSelect = useCallback((eventKey) => {
    setSelectedItem(eventKey);
  }, []);

  const handleShow = useCallback(() => setShowOffcanvas(true), []);
  const handleClose = useCallback(() => setShowOffcanvas(false), []);

  const handleAcceptFriendRequest = async (senderId, notificationId) => {
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

        // Gọi API PUT để cập nhật thông báo
        try {
          const putResponse = await axios.put(
            `https://travelmateapp.azurewebsites.net/api/Notification/${notificationId}/message`,
            JSON.stringify("Lời mời kết bạn đã được xử lý"), // Định dạng JSON
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json" // Đặt Content-Type là application/json
              }
            }
          );
          if (putResponse.status === 200) {
            console.log("Cập nhật thông báo thành công");
          }
        } catch (putError) {
          console.error("Error updating notification:", putError);
          toast.error("Lỗi khi cập nhật thông báo!");
        }
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error("Lỗi khi chấp nhận kết bạn!");
    }
  };

  const handleRejectFriendRequest = async (userIdRequest, notificationId) => {
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
        // Gọi API PUT để cập nhật thông báo
        try {
          const putResponse = await axios.put(
            `https://travelmateapp.azurewebsites.net/api/Notification/${notificationId}/message`,
            JSON.stringify("Lời mời kết bạn đã được xử lý"), // Định dạng JSON
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json" // Đặt Content-Type là application/json
              }
            }
          );
          if (putResponse.status === 200) {
            console.log("Cập nhật thông báo thành công");
          }
        } catch (putError) {
          console.error("Error updating notification:", putError);
          toast.error("Lỗi khi cập nhật thông báo!");
        }
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
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedItem, setSelectedItem] = useState('Địa điểm du lịch');

  const location = useLocation();

  const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

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

  const handleEnterSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchInput.trim() === '') {
        toast.error("Vui lòng nhập nội dung tìm kiếm!");
        return;
      }
      if (filteredLocations.length > 0) {
        handleLocationSelect(filteredLocations[0]);
      } else {
        if (selectedItem === 'Địa điểm du lịch') {
          navigate(RoutePath.DESTINATION, { state: { searchInput } });
        } else if (selectedItem === 'Người địa phương') {
          navigate(RoutePath.SEARCH_LIST_LOCAL, { state: { searchInput } });
        } else if (selectedItem === 'Khách du lịch') {
          navigate(RoutePath.SEARCH_LIST_TRAVELLER, { state: { searchInput } });
        }
      }
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === '') {
      setFilteredLocations([]);
      return;
    }
    const filtered = locations.filter((location) =>
      removeVietnameseTones(location.locationName.toLowerCase()).includes(removeVietnameseTones(value.toLowerCase()))
    );
    setFilteredLocations(filtered.slice(0, 5));
  };

  const handleLocationSelect = (location) => {
    setSearchInput(location.locationName);
    setFilteredLocations([]);
    localStorage.setItem('selectedLocation', JSON.stringify(location));

    if (selectedItem === "Địa điểm du lịch") {
      navigate(RoutePath.DESTINATION, { state: { selectedLocation: location } });
    } else if (selectedItem === "Người địa phương") {
      navigate(RoutePath.SEARCH_LIST_LOCAL, { state: { selectedLocation: location } });
    } else if (selectedItem === "Khách du lịch") {
      navigate(RoutePath.SEARCH_LIST_TRAVELLER, { state: { selectedLocation: location } });
    }
  };
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
            <BootstrapNavbar.Brand as={Link} to={RoutePath.HOMEPAGE} >
              <div >
                <img src={logo} alt="logo" />
                {/* <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120" zoomAndPan="magnify" viewBox="130 0 100 364.999991" height="300" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><g /></defs><path fill="#39da64" d="M 117.789062 162.96875 C 117.640625 163.417969 117.589844 163.8125 117.691406 163.863281 C 117.789062 163.964844 118.832031 164.609375 119.976562 165.355469 C 122.160156 166.746094 122.957031 168.335938 122.359375 170.171875 C 121.714844 172.210938 118.585938 172.457031 117.589844 170.570312 C 116.945312 169.378906 117.640625 168.484375 119.230469 168.433594 C 120.769531 168.433594 120.917969 167.292969 119.476562 166.644531 C 117.09375 165.554688 114.660156 168.285156 115.652344 170.867188 C 116.796875 173.898438 120.769531 174.59375 123.15625 172.210938 C 125.738281 169.578125 124.992188 166.597656 120.96875 163.664062 C 118.683594 162.027344 118.234375 161.925781 117.789062 162.96875 Z M 117.789062 162.96875 " fill-opacity="1" fill-rule="nonzero" /><path fill="#39da64" d="M 138.007812 163.464844 C 138.007812 163.863281 138.652344 164.511719 139.5 164.957031 C 142.976562 166.746094 144.117188 169.925781 141.734375 171.464844 C 140.34375 172.410156 138.753906 172.011719 137.957031 170.570312 C 137.3125 169.378906 137.757812 168.832031 139.5 168.582031 C 141.335938 168.335938 141.085938 166.992188 139.152344 166.796875 C 137.363281 166.597656 135.523438 168.035156 135.523438 169.675781 C 135.523438 171.117188 138.058594 173.652344 139.5 173.75 C 141.785156 173.847656 142.328125 173.652344 143.671875 172.410156 C 145.460938 170.769531 145.460938 167.886719 143.671875 165.703125 C 141.535156 163.21875 138.007812 161.777344 138.007812 163.464844 Z M 138.007812 163.464844 " fill-opacity="1" fill-rule="nonzero" /><path fill="#39da64" d="M 148.640625 171.863281 C 147.695312 172.257812 146.75 173.253906 146.253906 174.394531 C 144.914062 177.175781 145.460938 180.40625 147.992188 184.730469 C 150.328125 188.800781 150.925781 192.082031 149.285156 192.429688 C 147.941406 192.675781 146.453125 191.136719 145.113281 188.058594 C 143.523438 184.53125 142.179688 183.089844 140.390625 183.089844 C 138.40625 183.089844 137.910156 184.679688 138.304688 189.695312 C 138.605469 193.074219 138.503906 193.917969 137.859375 194.464844 C 136.765625 195.359375 135.425781 194.8125 134.332031 193.023438 C 133.238281 191.136719 133.1875 186.21875 134.28125 181.203125 C 135.277344 176.285156 135.226562 175.289062 133.785156 173.898438 C 132.046875 172.109375 129.960938 172.257812 127.773438 174.246094 C 125.488281 176.382812 125.089844 178.269531 125.441406 186.070312 C 125.589844 189.546875 125.589844 193.023438 125.390625 193.820312 L 124.992188 195.261719 L 124.097656 194.117188 C 123.550781 193.472656 123.003906 191.980469 122.804688 190.738281 C 122.457031 188.40625 120.570312 185.574219 119.378906 185.574219 C 119.03125 185.574219 117.988281 187.363281 117.09375 189.546875 C 115.207031 194.066406 114.460938 194.414062 112.96875 191.335938 C 111.578125 188.503906 111.628906 182.34375 113.121094 178.023438 C 114.3125 174.496094 114.113281 173.203125 112.226562 172.210938 C 110.386719 171.214844 105.46875 173.699219 104.921875 175.9375 C 104.425781 177.824219 105.269531 179.808594 106.613281 180.007812 C 107.855469 180.207031 108.003906 179.5625 107.109375 178.121094 C 106.265625 176.828125 106.960938 175.6875 109.34375 174.394531 C 112.125 172.90625 112.574219 173.75 111.132812 177.972656 C 109.09375 183.984375 109.792969 191.1875 112.773438 194.367188 C 114.90625 196.652344 116.894531 195.609375 118.484375 191.335938 C 118.980469 189.996094 119.628906 188.902344 119.875 188.949219 C 120.171875 188.949219 120.621094 189.945312 120.917969 191.136719 C 121.914062 194.863281 122.558594 196.003906 123.898438 196.601562 C 125.089844 197.148438 125.339844 197.097656 126.433594 195.804688 C 127.675781 194.367188 127.675781 194.265625 127.476562 186.019531 C 127.328125 178.222656 127.375 177.625 128.371094 176.285156 C 129.613281 174.59375 132.34375 174.097656 132.890625 175.390625 C 133.039062 175.886719 132.792969 178.417969 132.296875 181.050781 C 131.101562 187.710938 131.402344 192.28125 133.1875 194.714844 C 134.777344 196.75 136.515625 197.394531 138.304688 196.550781 C 140.144531 195.757812 140.640625 193.820312 140.242188 189.148438 C 139.996094 185.621094 140.042969 185.078125 140.738281 185.078125 C 141.238281 185.078125 142.179688 186.515625 143.324219 188.851562 C 145.410156 193.171875 147.246094 194.714844 149.683594 194.265625 C 153.210938 193.621094 153.257812 190.839844 149.929688 184.332031 C 147 178.667969 146.703125 176.332031 148.6875 174.394531 C 150.179688 172.855469 150.773438 172.855469 153.65625 174.246094 C 155.941406 175.390625 156.734375 175.238281 156.191406 173.898438 C 155.890625 173.054688 152.214844 171.167969 150.925781 171.214844 C 150.527344 171.214844 149.484375 171.515625 148.640625 171.863281 Z M 148.640625 171.863281 " fill-opacity="1" fill-rule="nonzero" /><g fill="#39da64" fill-opacity="1"><g transform="translate(164.21801, 186.962229)"><g><path d="M 3.421875 0.140625 C 2.578125 0.140625 1.992188 -0.0351562 1.671875 -0.390625 C 1.359375 -0.742188 1.203125 -1.316406 1.203125 -2.109375 L 1.203125 -10.53125 L 0.296875 -10.53125 L 0.296875 -12.984375 L 1.203125 -12.984375 L 1.203125 -15.84375 L 4.328125 -15.84375 L 4.328125 -12.984375 L 5.25 -12.984375 L 5.25 -10.53125 L 4.328125 -10.53125 L 4.328125 -2.953125 C 4.328125 -2.710938 4.34375 -2.535156 4.375 -2.421875 C 4.414062 -2.316406 4.519531 -2.265625 4.6875 -2.265625 C 4.8125 -2.265625 4.925781 -2.269531 5.03125 -2.28125 C 5.144531 -2.289062 5.21875 -2.296875 5.25 -2.296875 L 5.25 -0.09375 C 5.070312 -0.0390625 4.804688 0.0078125 4.453125 0.0625 C 4.097656 0.113281 3.753906 0.140625 3.421875 0.140625 Z M 3.421875 0.140625 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(169.471481, 186.962229)"><g><path d="M 0.640625 -13.5 L 3.875 -13.5 L 3.875 -12 C 4.03125 -12.53125 4.304688 -12.9375 4.703125 -13.21875 C 5.109375 -13.507812 5.601562 -13.65625 6.1875 -13.65625 L 6.1875 -10.96875 C 5.738281 -10.96875 5.238281 -10.898438 4.6875 -10.765625 C 4.144531 -10.640625 3.875 -10.492188 3.875 -10.328125 L 3.875 0 L 0.640625 0 Z M 0.640625 -13.5 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(175.443858, 186.962229)"><g><path d="M 3.09375 0.140625 C 2.050781 0.140625 1.335938 -0.203125 0.953125 -0.890625 C 0.566406 -1.585938 0.375 -2.582031 0.375 -3.875 C 0.375 -4.925781 0.507812 -5.734375 0.78125 -6.296875 C 1.0625 -6.867188 1.445312 -7.285156 1.9375 -7.546875 C 2.425781 -7.816406 3.175781 -8.109375 4.1875 -8.421875 L 5.0625 -8.71875 L 5.0625 -10.109375 C 5.0625 -10.460938 4.988281 -10.734375 4.84375 -10.921875 C 4.707031 -11.109375 4.539062 -11.203125 4.34375 -11.203125 C 4.175781 -11.203125 4.023438 -11.125 3.890625 -10.96875 C 3.765625 -10.8125 3.703125 -10.597656 3.703125 -10.328125 L 3.703125 -9.515625 L 0.578125 -9.515625 L 0.578125 -9.953125 C 0.578125 -11.285156 0.882812 -12.234375 1.5 -12.796875 C 2.125 -13.359375 3.132812 -13.640625 4.53125 -13.640625 C 5.65625 -13.640625 6.566406 -13.347656 7.265625 -12.765625 C 7.960938 -12.179688 8.3125 -11.351562 8.3125 -10.28125 L 8.3125 0 L 5.109375 0 L 5.109375 -1.609375 C 4.953125 -1.054688 4.695312 -0.625 4.34375 -0.3125 C 3.988281 -0.0078125 3.570312 0.140625 3.09375 0.140625 Z M 4.375 -2.359375 C 4.613281 -2.359375 4.785156 -2.457031 4.890625 -2.65625 C 4.992188 -2.863281 5.046875 -3.113281 5.046875 -3.40625 L 5.046875 -7.171875 C 4.566406 -6.984375 4.210938 -6.75 3.984375 -6.46875 C 3.765625 -6.1875 3.65625 -5.796875 3.65625 -5.296875 L 3.65625 -3.5625 C 3.65625 -2.757812 3.894531 -2.359375 4.375 -2.359375 Z M 4.375 -2.359375 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(183.978499, 186.962229)"><g><path d="M 2.359375 0 L 0.203125 -13.5 L 3.421875 -13.5 L 4.09375 -6.671875 L 4.203125 -4.484375 L 4.328125 -6.6875 L 5.0625 -13.5 L 8.296875 -13.5 L 6.109375 0 Z M 2.359375 0 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(192.107606, 186.962229)"><g><path d="M 4.421875 0.140625 C 3.035156 0.140625 2.039062 -0.238281 1.4375 -1 C 0.832031 -1.757812 0.53125 -2.894531 0.53125 -4.40625 L 0.53125 -9.828125 C 0.53125 -11.066406 0.882812 -12.007812 1.59375 -12.65625 C 2.3125 -13.3125 3.3125 -13.640625 4.59375 -13.640625 C 7.1875 -13.640625 8.484375 -12.367188 8.484375 -9.828125 L 8.484375 -8.84375 C 8.484375 -7.863281 8.46875 -7.066406 8.4375 -6.453125 L 3.765625 -6.453125 L 3.765625 -3.828125 C 3.765625 -3.367188 3.8125 -3.003906 3.90625 -2.734375 C 4.007812 -2.472656 4.21875 -2.34375 4.53125 -2.34375 C 4.78125 -2.34375 4.957031 -2.414062 5.0625 -2.5625 C 5.164062 -2.707031 5.222656 -2.875 5.234375 -3.0625 C 5.253906 -3.257812 5.265625 -3.539062 5.265625 -3.90625 L 5.265625 -5.21875 L 8.484375 -5.21875 L 8.484375 -4.4375 C 8.484375 -2.863281 8.175781 -1.707031 7.5625 -0.96875 C 6.957031 -0.226562 5.910156 0.140625 4.421875 0.140625 Z M 5.265625 -8.0625 L 5.265625 -9.796875 C 5.265625 -10.765625 5.023438 -11.25 4.546875 -11.25 C 4.015625 -11.25 3.75 -10.765625 3.75 -9.796875 L 3.75 -8.0625 Z M 5.265625 -8.0625 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(200.734416, 186.962229)"><g><path d="M 0.640625 0 L 0.640625 -15.9375 L 3.921875 -15.9375 L 3.921875 0 Z M 0.640625 0 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(204.93717, 186.962229)"><g><path d="M 0.640625 -13.5 L 3.796875 -13.5 L 3.796875 -11.921875 C 3.941406 -12.503906 4.191406 -12.9375 4.546875 -13.21875 C 4.910156 -13.5 5.414062 -13.640625 6.0625 -13.640625 C 6.59375 -13.640625 7.050781 -13.519531 7.4375 -13.28125 C 7.820312 -13.039062 8.097656 -12.710938 8.265625 -12.296875 C 8.535156 -12.765625 8.832031 -13.101562 9.15625 -13.3125 C 9.488281 -13.53125 9.953125 -13.640625 10.546875 -13.640625 C 11.597656 -13.640625 12.328125 -13.316406 12.734375 -12.671875 C 13.148438 -12.023438 13.359375 -11.085938 13.359375 -9.859375 L 13.328125 0 L 10.078125 0 L 10.078125 -9.921875 C 10.078125 -10.796875 9.859375 -11.234375 9.421875 -11.234375 C 9.109375 -11.234375 8.882812 -11.082031 8.75 -10.78125 C 8.625 -10.476562 8.5625 -10.117188 8.5625 -9.703125 L 8.5625 0 L 5.328125 0 L 5.328125 -9.921875 C 5.328125 -10.296875 5.285156 -10.597656 5.203125 -10.828125 C 5.128906 -11.066406 4.960938 -11.1875 4.703125 -11.1875 C 4.367188 -11.1875 4.132812 -11.023438 4 -10.703125 C 3.863281 -10.378906 3.796875 -9.988281 3.796875 -9.53125 L 3.796875 0 L 0.640625 0 Z M 0.640625 -13.5 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(218.54105, 186.962229)"><g><path d="M 3.09375 0.140625 C 2.050781 0.140625 1.335938 -0.203125 0.953125 -0.890625 C 0.566406 -1.585938 0.375 -2.582031 0.375 -3.875 C 0.375 -4.925781 0.507812 -5.734375 0.78125 -6.296875 C 1.0625 -6.867188 1.445312 -7.285156 1.9375 -7.546875 C 2.425781 -7.816406 3.175781 -8.109375 4.1875 -8.421875 L 5.0625 -8.71875 L 5.0625 -10.109375 C 5.0625 -10.460938 4.988281 -10.734375 4.84375 -10.921875 C 4.707031 -11.109375 4.539062 -11.203125 4.34375 -11.203125 C 4.175781 -11.203125 4.023438 -11.125 3.890625 -10.96875 C 3.765625 -10.8125 3.703125 -10.597656 3.703125 -10.328125 L 3.703125 -9.515625 L 0.578125 -9.515625 L 0.578125 -9.953125 C 0.578125 -11.285156 0.882812 -12.234375 1.5 -12.796875 C 2.125 -13.359375 3.132812 -13.640625 4.53125 -13.640625 C 5.65625 -13.640625 6.566406 -13.347656 7.265625 -12.765625 C 7.960938 -12.179688 8.3125 -11.351562 8.3125 -10.28125 L 8.3125 0 L 5.109375 0 L 5.109375 -1.609375 C 4.953125 -1.054688 4.695312 -0.625 4.34375 -0.3125 C 3.988281 -0.0078125 3.570312 0.140625 3.09375 0.140625 Z M 4.375 -2.359375 C 4.613281 -2.359375 4.785156 -2.457031 4.890625 -2.65625 C 4.992188 -2.863281 5.046875 -3.113281 5.046875 -3.40625 L 5.046875 -7.171875 C 4.566406 -6.984375 4.210938 -6.75 3.984375 -6.46875 C 3.765625 -6.1875 3.65625 -5.796875 3.65625 -5.296875 L 3.65625 -3.5625 C 3.65625 -2.757812 3.894531 -2.359375 4.375 -2.359375 Z M 4.375 -2.359375 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(227.075693, 186.962229)"><g><path d="M 3.421875 0.140625 C 2.578125 0.140625 1.992188 -0.0351562 1.671875 -0.390625 C 1.359375 -0.742188 1.203125 -1.316406 1.203125 -2.109375 L 1.203125 -10.53125 L 0.296875 -10.53125 L 0.296875 -12.984375 L 1.203125 -12.984375 L 1.203125 -15.84375 L 4.328125 -15.84375 L 4.328125 -12.984375 L 5.25 -12.984375 L 5.25 -10.53125 L 4.328125 -10.53125 L 4.328125 -2.953125 C 4.328125 -2.710938 4.34375 -2.535156 4.375 -2.421875 C 4.414062 -2.316406 4.519531 -2.265625 4.6875 -2.265625 C 4.8125 -2.265625 4.925781 -2.269531 5.03125 -2.28125 C 5.144531 -2.289062 5.21875 -2.296875 5.25 -2.296875 L 5.25 -0.09375 C 5.070312 -0.0390625 4.804688 0.0078125 4.453125 0.0625 C 4.097656 0.113281 3.753906 0.140625 3.421875 0.140625 Z M 3.421875 0.140625 " /></g></g></g><g fill="#39da64" fill-opacity="1"><g transform="translate(232.329166, 186.962229)"><g><path d="M 4.421875 0.140625 C 3.035156 0.140625 2.039062 -0.238281 1.4375 -1 C 0.832031 -1.757812 0.53125 -2.894531 0.53125 -4.40625 L 0.53125 -9.828125 C 0.53125 -11.066406 0.882812 -12.007812 1.59375 -12.65625 C 2.3125 -13.3125 3.3125 -13.640625 4.59375 -13.640625 C 7.1875 -13.640625 8.484375 -12.367188 8.484375 -9.828125 L 8.484375 -8.84375 C 8.484375 -7.863281 8.46875 -7.066406 8.4375 -6.453125 L 3.765625 -6.453125 L 3.765625 -3.828125 C 3.765625 -3.367188 3.8125 -3.003906 3.90625 -2.734375 C 4.007812 -2.472656 4.21875 -2.34375 4.53125 -2.34375 C 4.78125 -2.34375 4.957031 -2.414062 5.0625 -2.5625 C 5.164062 -2.707031 5.222656 -2.875 5.234375 -3.0625 C 5.253906 -3.257812 5.265625 -3.539062 5.265625 -3.90625 L 5.265625 -5.21875 L 8.484375 -5.21875 L 8.484375 -4.4375 C 8.484375 -2.863281 8.175781 -1.707031 7.5625 -0.96875 C 6.957031 -0.226562 5.910156 0.140625 4.421875 0.140625 Z M 5.265625 -8.0625 L 5.265625 -9.796875 C 5.265625 -10.765625 5.023438 -11.25 4.546875 -11.25 C 4.015625 -11.25 3.75 -10.765625 3.75 -9.796875 L 3.75 -8.0625 Z M 5.265625 -8.0625 " /></g></g></g></svg> */}
              </div>
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
                  <Dropdown.Menu show style={{
                    marginLeft: '175px',
                    width: '405px',
                  }}>
                    {filteredLocations.map((location) => (
                      <Dropdown.Item key={location.locationId} onClick={() => handleLocationSelect(location)}>
                        <p className='mb-1 fw-medium'>{location.locationName}</p>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                )}
              </div>

              <div className='d-flex'>
                <Dropdown onSelect={handleSelect} align="end">
                  <Dropdown.Toggle variant="outline-dark" id="" style={{
                    fontSize: '12px',
                    boxShadow: '0px',
                    height: '38px',
                    border: '1px solid #ccc',
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
                      className="custom-dropdown-item px-0 "
                      onClick={handleSearchDestination}
                    >
                      <p className="m-0 fw-medium">Địa điểm du lịch</p>
                      <p className="m-0 fw-light">Khám phá điểm đến thú vị</p>
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Người địa phương"
                      className="custom-dropdown-item px-0"
                      onClick={handleSearchLocal} // Gọi hàm điều hướng
                    >
                      <p className="m-0">Người đồng hành</p>
                      <p className="m-0 fw-light">Tìm bạn bè cùng khám phá thành phố</p>
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                      eventKey="Khách du lịch"
                      className="custom-dropdown-item px-0"
                      onClick={handleSearchTraveller} // Gọi hàm điều hướng
                    >
                      <p className="m-0">Khách du lịch</p>
                      <p className="m-0 fw-light">Kết nối với bạn bè để trải nghiệm</p>
                    </Dropdown.Item> */}

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
                <Button as={Link} to={RoutePath.CHAT} variant=''>
                <ion-icon name="chatbubble-outline" style={{ color: 'black', fontSize: '20px' }}></ion-icon>
                </Button>

                <Dropdown align="end">
                  <Dropdown.Toggle className="notify_action shadow-none bg-white rounded-5 border-0 d-flex justify-content-center align-items-center position-relative">
                    <ion-icon name="notifications-outline" style={{ color: 'black', fontSize: '20px' }}></ion-icon>
                    {unreadNotificationsCount > 0 && (
                      <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                        {unreadNotificationsCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={`m-0 pt-3 pb-0 dropdown-menu-notify ${showMoreNotifications ? "show-more" : ""}`}>
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
                            onAccept={() => handleAcceptFriendRequest(notification.senderId, notification.notificationId)}
                            onDecline={() => handleRejectFriendRequest(notification.senderId, notification.notificationId)}
                            updateUnreadCount={updateUnreadCount}
                          />
                        </Dropdown.Item>
                      ))}
                    </div>
                    <div className="notification-footer">
                      <div
                        className="d-flex align-items-center justify-content-center gap-1"
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
                height: '38px',
                boxShadow: 'none',
              }} />
              <Dropdown.Toggle variant="" id="" style={{
                borderTopLeftRadius: '0',
                borderBottomLeftRadius: '0',
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
                width: '120px',
                fontSize: '10px',
                height: '38px',
                boxShadow: 'none',
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