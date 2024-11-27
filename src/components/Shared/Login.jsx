import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/actions/authActions";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { decodeToken } from "react-jwt";
import google from "../../assets/images/google.png";
import facebook from "../../assets/images/facebook.png";
import "../../assets/css/Shared/Login.css";
import { useNavigate } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../../assets/css/Shared/Login.css'

const Login = ({ show, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    try {
      console.log('Google Login Success:', response);

      // Lấy token từ response của Google
      const googleToken = response.credential;

      // Gửi yêu cầu POST đến API externallogin để lưu dữ liệu người dùng
      const userResponse = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/Auth/google-login`,
        JSON.stringify(googleToken), // Gửi token như chuỗi JSON
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      

      // Kiểm tra xem API trả về dữ liệu người dùng hay không
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

        // Lưu token vào localStorage
        localStorage.setItem('token', token);

        // Dispatch dữ liệu người dùng vào store
        dispatch(loginSuccess({ user, token }));

        // Thông báo đăng nhập thành công
        toast.success('Đăng nhập thành công!', {
          position: "bottom-right",
        });

        // Kiểm tra role và chuyển hướng nếu là admin
        if (user.role === 'admin') {
          navigate(RoutePath.ADMIN); // Chuyển hướng đến trang admin
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu POST đến API đăng nhập
      const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/Auth/login`, {
        username,
        password,
      });
      const { token } = response.data;
      const claim = decodeToken(token);
      const user = {
        id: claim["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        username: claim["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role: claim["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        avatarUrl: claim.ImageUser || 'https://i.ytimg.com/vi/o2vTHtPuLzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDNfIoZ06P2icz2VCTX_0bZUiewiw',
        FullName: claim.FullName,
      }
      console.log(user);

      // Store token in localStorage
      localStorage.setItem('token', token);

      dispatch(loginSuccess({ user, token }));
      toast.success('Đăng nhập thành công!', {
        position: "bottom-right",
      });
      // Kiểm tra role và chuyển hướng nếu là admin
      if (user.role === 'admin') {
        navigate(RoutePath.ADMIN); // Chuyển hướng đến trang admin
      } else {
        handleClose();
      }
      handleClose();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Sai tài khoản hoặc mật khẩu.");
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header className="modal-header">
          <h5>Đăng nhập</h5>
          <Button className="modal-close-btn" onClick={handleClose}>
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          
          {errorMessage && <small className="text-danger fw-normal small-text">{errorMessage}</small>}
          <Form onSubmit={handleSubmit}>

            <Form.Group controlId="formUsername" className="form-username">
              <Form.Label className="form-label">Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="form-password">
              <Form.Label className="form-label">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="fw-normal small-text" style={{
              width: '420px'
            }}>
           
            </div>

            <button variant="" type="submit" className="btn-continues w-100 mt-0 fw-bold">
              Tiếp tục
            </button>
            <div className="text-center-divider mt-3">
              <span>hoặc</span>
            </div>
            <div className="text-center d-flex flex-column gap-3">
              <GoogleOAuthProvider clientId="641114959725-q7732vhl0ssi5ip4il9uard2qv92aigf.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginFailure}
                />
              </GoogleOAuthProvider>
              <Button variant="outline-dark" className="social-btn">
                <img src={facebook} alt="facebook icon" />
                <span>Đăng nhập bằng Facebook</span>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
