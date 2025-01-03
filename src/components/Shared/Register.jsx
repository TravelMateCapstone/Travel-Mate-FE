import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSuccess } from '../../redux/actions/authActions'; // Import loginSuccess action
import '../../assets/css/Shared/Register.css';
import google from '../../assets/images/google.png';
import facebook from '../../assets/images/facebook.png';
import axios from 'axios'; // Import axios
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { decodeToken } from "react-jwt";

const Register = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [fullName, setFullName] = useState('');

  const dispatch = useDispatch(); // Sử dụng dispatch để gọi action

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const response = await axios.post(`https://travelmateapp.azurewebsites.net/api/Auth/register`, {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword, // Add confirmPassword to the payload
        fullName: fullName,
      });

      console.log(username, email, password, confirmPassword, fullName);


      const data = response.data;


      // Nếu Đăng ký thành công, hiển thị thông báo và tự động đăng nhập
      toast.success('Đăng ký thành công!');

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Dispatch loginSuccess để đăng nhập người dùng ngay lập tức
      dispatch(loginSuccess({
        user: {
          username: data.username,
          email: data.email,
          fullName: data.fullName,
        },
        token: data.token, // Giả sử phản hồi trả về token
      }));

      handleClose(); // Đóng modal sau khi Đăng ký và đăng nhập thành công
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setErrorMessage(error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    }
  };

  const handleLoginSuccess = async (response) => {
    try {
      console.log('Google Login Success:', response);
      const googleToken = response.credential;
      const userResponse = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/Auth/google-login`,
        JSON.stringify(googleToken), // Gửi token như chuỗi JSON
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (userResponse.data) {
        const { token } = userResponse.data;
        const claim = decodeToken(token);
        const user = {
          id: claim["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          username: claim["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          role: claim["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          avatarUrl: claim.ImageUser || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw',
          FullName: claim.FullName,
        }
        dispatch(loginSuccess({ user, token }));
       
        if (user.role === 'admin') {
          navigate(RoutePath.ADMIN); 
        } else {
          handleClose();
        }
        handleClose();
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
    toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
  };
  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="register-modal">
      <Modal.Header className="modal-header-custom">
        <Modal.Title className="modal-title-centered fw-semibold">Đăng ký</Modal.Title>
        <Button className="modal-close-btn" onClick={handleClose}>x</Button>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title className="modal-body-title fw-medium">Chào mừng đến với Travel Mate</Modal.Title>
        {errorMessage && <small className="text-danger fw-normal small-text">{errorMessage}</small>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFullName" className="mt-3">
            <Form.Control
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>
          <Form.Group controlId="formUsername" className="mt-3">
            <Form.Control
              type="text"
              placeholder="Têm tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-2">
            <Form.Control
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword" className="mt-2">
            <Form.Control
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control-custom"
              required
            />
          </Form.Group>
          <small className="fw-normal" style={{ fontSize: "12px" }}>
            Vui lòng kiểm tra email và làm theo hướng dẫn để xác minh địa chỉ của bạn
          </small>

          <Button variant="primary" type="submit" className="btn-continue mt-2 w-100 fw-bold">
            Tiếp tục
          </Button>
          <div className="text-center-divider mt-2 mb-2"><span>hoặc</span></div>
          <div className="text-center">
            <GoogleOAuthProvider clientId="641114959725-q7732vhl0ssi5ip4il9uard2qv92aigf.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
              />
            </GoogleOAuthProvider>
            <Button variant="outline-dark" className="mt-3 social-btn">
              <img src={facebook} alt="facebook icon" />
              <span>Đăng nhập bằng Facebook</span>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
