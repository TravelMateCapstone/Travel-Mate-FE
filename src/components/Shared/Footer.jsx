import React, { memo } from 'react';
import '../../assets/css/Shared/Footer.css';
import foooterApp from '../../assets/images/android_ios.png'
import logo from '../../assets/images/logo.png'
const Footer = () => {
  return (
    <footer className="footer mt-3">
      <div className="footer-container">
        <div className="footer-left">
          <ul className="footer-nav d-md-flex gap-md-5 text-uppercase fw-semibold">
            <li><a href="#about-us">Về chúng tôi</a></li>
            <li><a href="#safety">An toàn</a></li>
            <li><a href="#support">Hỗ trợ</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
          <div className="footer-logo">
            <div>
              <img src={logo} alt="icon" className='logo-footer'/>
              </div>
            <p className='mt-2'>Kết nối du khách và người địa phương để trải nghiệm đa dạng, tạo ra trải nghiệm đáng nhớ.</p>
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-social">
            <span>KẾT NỐI VỚI CHÚNG TÔI</span>
            <ul>
              <li><a href="#facebook"><i className="bi bi-facebook social-icon"></i></a></li>
              <li><a href="#twitter"><i className="bi bi-twitter social-icon"></i></a></li>
              <li><a href="#instagram"><i className="bi bi-instagram social-icon"></i></a></li>
              <li><a href="#youtube"><i className="bi bi-youtube social-icon"></i></a></li>
            </ul>
          </div>
          <div className="footer-app">
            <span>ỨNG DỤNG DI ĐỘNG</span>
            <img src={foooterApp} alt="app" className='app-img'/>
          </div>
        </div>
      </div>

      <div className="footer-bottom d-flex align-items-cente gap-5">
        <p className='p-0 m-0 text-black'>© 2024 TravelMate Team. All Rights Reserved</p>
        <ul className="footer-bottom-nav m-0 p-0">
          <li><a href="#terms" className='term'>Điều khoản</a></li>
          <li className='ms-5'><a href="#privacy" className='privacy'>Bảo mật</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default memo(Footer);