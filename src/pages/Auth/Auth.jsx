import React, { useState, useCallback } from "react";
import "../../assets/css/Auth.css";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../../redux/actions/authActions";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import RoutePath from "../../routes/RoutePath";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Auth = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUpClick = () => setIsSignUpMode(true);
  const handleSignInClick = () => setIsSignUpMode(false);

  const handleLoginSuccess = async (response) => {
    try {
      const googleToken = response.credential;
      const userResponse = await axios.post(
        `https://travelmateapp.azurewebsites.net/api/Auth/google-login`,
        JSON.stringify(googleToken),
        { headers: { "Content-Type": "application/json" } }
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
          emailaddress: claim["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
        };

        localStorage.setItem('token', token);
        dispatch(loginSuccess({ user, token }));
        toast.success('Đăng nhập thành công!');
        navigate(RoutePath.HOMEPAGE); 
        if (user.role === 'admin') {
          navigate(RoutePath.ADMIN);
        } else {
          setIsSignUpMode(false);
        }
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
    }
  };

  const handleLoginFailure = (error) => {
    toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://travelmateapp.azurewebsites.net/api/Auth/login`, {
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
        emailaddress: claim["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
      };

      localStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
      toast.success('Đăng nhập thành công!', { position: "bottom-right" });
      navigate(RoutePath.HOMEPAGE);
      if (user.role === 'admin') {
        navigate(RoutePath.ADMIN);
      } else {
        setIsSignUpMode(false);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Sai tài khoản hoặc mật khẩu.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const signUpData = {
      username,
      email: signUpEmail,
      password,
      confirmPassword,
      fullName
    };

    try {
      const response = await axios.post(
        "https://travelmateapp.azurewebsites.net/api/Auth/register",
        signUpData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data) {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsSignUpMode(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(RoutePath.LOGIN);
  }, [dispatch, navigate]);

  return (
    <div className={`custom-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="custom-forms-container">
        <div className="custom-signin-signup">
          <form className="custom-auth-form custom-sign-in-form" onSubmit={handleSubmit}>
            <h2 className="custom-title">Đăng nhập</h2>
            {errorMessage && <small className="text-danger fw-normal small-text">{errorMessage}</small>}
            <div className="custom-input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="custom-input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <input type="submit" value="Đăng nhập" className="custom-btn solid" />
            <p className="custom-social-text">Hoặc đăng nhập bằng các nền tảng xã hội</p>
            <div className="custom-social-media">
              <GoogleOAuthProvider clientId="641114959725-q7732vhl0ssi5ip4il9uard2qv92aigf.apps.googleusercontent.com">
                <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} />
              </GoogleOAuthProvider>
            </div>
          </form>

          <form className="custom-auth-form custom-sign-up-form" onSubmit={handleSignUp}>
            <h2 className="custom-title">Đăng ký</h2>
            <div className="custom-input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="custom-input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="custom-input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
            </div>
            <div className="custom-input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="custom-input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <input type="submit" className="custom-btn" value="Đăng ký" />
            <p className="custom-social-text">Hoặc đăng ký bằng các nền tảng xã hội</p>
            <div className="custom-social-media">
              <GoogleOAuthProvider clientId="641114959725-q7732vhl0ssi5ip4il9uard2qv92aigf.apps.googleusercontent.com">
                <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>

      <div className="custom-panels-container">
        <div className="custom-panel custom-left-panel">
          <div className="custom-content">
            <h3>Bạn mới đến?</h3>
            <p>
              Hãy tham gia ngay để trải nghiệm những tính năng tuyệt vời của chúng tôi.
            </p>
            <button className="custom-btn transparent" onClick={handleSignUpClick}>
              Đăng ký
            </button>
          </div>
          <img src="img/log.svg" className="custom-image" alt="" />
        </div>
        <div className="custom-panel custom-right-panel">
          <div className="custom-content">
            <h3>Đã có tài khoản?</h3>
            <p>
              Đăng nhập ngay để tiếp tục hành trình của bạn.
            </p>
            <button className="custom-btn transparent" onClick={handleSignInClick}>
              Đăng nhập
            </button>
          </div>
          <img src="img/register.svg" className="custom-image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
