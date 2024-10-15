import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSuccess } from '../../redux/actions/authActions'; // Import loginSuccess action
import '../../assets/css/Auth/Register.css';
import google from '../../assets/images/google.png';
import facebook from '../../assets/images/facebook.png';

const Register = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch(); // Sử dụng dispatch để gọi action

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const response = await fetch('https://travelmateapp.azurewebsites.net/odata/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          fullName: username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      // Nếu đăng ký thành công, hiển thị thông báo và tự động đăng nhập
      toast.success('Đăng ký thành công!');

      // Dispatch loginSuccess để đăng nhập người dùng ngay lập tức
      dispatch(loginSuccess({
        user: {
          username: data.username,
          email: data.email,
          fullName: data.fullName,
        },
        token: data.token, // Giả sử phản hồi trả về token
      }));

      handleClose(); // Đóng modal sau khi đăng ký và đăng nhập thành công
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="register-modal">
      <Modal.Header className="modal-header-custom">
        <Modal.Title className="modal-title-centered fw-semibold">Đăng kí</Modal.Title>
        <Button className="modal-close-btn" onClick={handleClose}>x</Button>
      </Modal.Header>
      <Modal.Body>
        <Modal.Title className="modal-body-title fw-medium">Chào mừng đến với Travel Mate</Modal.Title>
        {errorMessage && <small className="text-danger fw-normal small-text">{errorMessage}</small>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mt-3">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            Chúng tôi sẽ gửi tin nhắn đến email của bạn. Hãy làm theo hướng dẫn.
          </small>

          <Button variant="primary" type="submit" className="btn-continue w-100 mt-3 fw-bold">
            Tiếp tục
          </Button>
          <div className="text-center-divider mt-3"><span>hoặc</span></div>
          <div className="text-center mt-3">
            <Button variant="outline-dark" className="social-btn">
              <img src={google} alt="google icon" />
              <span>Đăng kí bằng Google</span>
            </Button>
            <Button variant="outline-dark" className="social-btn">
              <img src={facebook} alt="facebook icon" />
              <span>Đăng kí bằng Facebook</span>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
