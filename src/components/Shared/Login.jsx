import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/actions/authActions";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { decodeToken } from "react-jwt"; // Import decodeToken từ react-jwt
import google from "../../assets/images/google.png";
import facebook from "../../assets/images/facebook.png";
import "../../assets/css/Shared/Login.css";

const Login = ({ show, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu POST đến API đăng nhập
      const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/Auth/login`, {
        username,
        password,
      });
      const { token } = response.data;
      // Giải mã token để lấy thông tin người dùng
      const user = decodeToken(token.result);

      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      //localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // Dispatch login success action để cập nhật Redux state
      dispatch(loginSuccess({ user, token }));



      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!', {
        position: "bottom-right",
      });

      // Đóng modal sau khi đăng nhập thành công
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
          <Modal.Title className="modal-title-centered fw-semibold">
            Đăng nhập
          </Modal.Title>
          <Button className="modal-close-btn" onClick={handleClose}>
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Modal.Title className="modal-body-title fw-medium">
            Chào mừng đến với Travel Mate
          </Modal.Title>
          {errorMessage && <small className="text-danger fw-normal small-text">{errorMessage}</small>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="form-username">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="form-password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <small className="fw-normal small-text">
              Vui lòng kiểm tra email và làm theo hướng dẫn để xác minh địa chỉ của bạn
            </small>

            <Button variant="primary" type="submit" className="btn-continue w-100 mt-3 fw-bold">
              Tiếp tục
            </Button>
            <div className="text-center-divider mt-3">
              <span>hoặc</span>
            </div>
            <div className="text-center mt-3">
              <Button variant="outline-dark" className="social-btn">
                <img src={google} alt="google icon" />
                <span>Đăng nhập bằng Google</span>
              </Button>
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
