import { useState } from "react";
import { useDispatch } from "react-redux";
import "../assets/css/Auth.css";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { decodeToken } from "react-jwt";
import { loginSuccess } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import Routepath from "../routes/RoutePath";
const Auth = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUpClick = () => setIsSignUpMode(true);
  const handleSignInClick = () => setIsSignUpMode(false);

  const handleGoogleLoginSuccess = (response) => {
    const decodedToken = decodeToken(response.credential);
    console.log(response.credential);
    console.log(decodedToken);
    dispatch(loginSuccess(response.credential, decodedToken));
    navigate(Routepath.HOMEPAGE); 
  };
  const handleGoogleLoginError = (error) => {
    console.error("Google Login Error:", error);
  };
  return (
    <div className={`custom-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="custom-forms-container">
        <div className="custom-signin-signup">
          <form className="custom-auth-form custom-sign-in-form">
            <h2 className="custom-title">Đăng nhập</h2>
            <input type="submit" value="Đăng nhập" className="custom-btn solid" />
            <p className="custom-social-text">Hoặc đăng nhập bằng các nền tảng xã hội</p>
            <div className="custom-social-media">
              <GoogleOAuthProvider clientId="641114959725-q7732vhl0ssi5ip4il9uard2qv92aigf.apps.googleusercontent.com">
                <GoogleLogin 
                  size="medium" 
                  shape="pill" 
                  locale="vi" 
                  width={'300px'} 
                  onSuccess={handleGoogleLoginSuccess} 
                  onError={handleGoogleLoginError} 
                />
              </GoogleOAuthProvider>
            </div>
          </form>

          <form className="custom-auth-form custom-sign-up-form">
            <h2 className="custom-title">Đăng ký</h2>
            <input type="submit" className="custom-btn" value="Đăng ký" />
            <p className="custom-social-text">Hoặc đăng ký bằng các nền tảng xã hội</p>
            <div className="custom-social-media">
              <GoogleOAuthProvider clientId="641114959725-q7732vhl0ssi5ip4il9uard2qv92aigf.apps.googleusercontent.com">
                <GoogleLogin 
                  size="medium" 
                  shape="pill" 
                  text="signup_with" 
                  context="signup" 
                  locale="vi" 
                  width={'300px'} 
                  onSuccess={handleGoogleLoginSuccess} 
                  onError={handleGoogleLoginError} 
                />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>

      <div className="custom-panels-container">
        <div className="custom-panel custom-left-panel">
          <div className="custom-content">
            <h3>Bạn mới đến TravelMate?</h3>
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
