import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/Shared/AdminSidebar.css';
import RoutePath from '../../routes/RoutePath';

function AdminSidebar() {
  const location = useLocation(); 

  return (
    <div className="sidebar">
      <h2 className="d-flex fw-bold mx-4 my-0 mb-2" style={{ fontSize: '32px' }}>
        <div className="text-primary">Travel</div><div>mate</div>
      </h2>
      <ul className="menu">
        <Link to={RoutePath.ADMIN} className={`menu-item ${location.pathname === RoutePath.ADMIN ? 'active' : ''}`}>
          <li>
            <i className="bi bi-bar-chart-fill icon"></i>
            <span className="text">Thống kê</span>
          </li>
        </Link>
        
        <Link to={RoutePath.ADMIN_REPORT} className={`menu-item ${location.pathname === RoutePath.ADMIN_REPORT ? 'active' : ''}`}>
          <li>
            <i className="bi bi-clipboard-fill icon"></i>
            <span className="text">Khiếu nại/ tố cáo</span>
          </li>
        </Link>
        
        <Link to={RoutePath.ADMIN_ACCOUNT_LIST} className={`menu-item ${location.pathname === RoutePath.ADMIN_ACCOUNT_LIST ? 'active' : ''}`}>
          <li>
            <i className="bi bi-person-fill icon"></i>
            <span className="text">Quản lý tài khoản</span>
          </li>
        </Link>
        
        <Link to={RoutePath.ADMIN_WALLET_MANAGEMENT} className={`menu-item ${location.pathname === RoutePath.ADMIN_WALLET_MANAGEMENT ? 'active' : ''}`}>
          <li>
            <i className="bi bi-wallet-fill icon"></i>
            <span className="text">Lịch sử giao dịch</span>
          </li>
        </Link>
        
        <Link to={RoutePath.ADMIN_TRIP_HISTORY} className={`menu-item ${location.pathname === RoutePath.ADMIN_TRIP_HISTORY ? 'active' : ''}`}>
          <li>
            <i className="bi bi-bus-front-fill icon"></i>
            <span className="text">Lịch sử chuyến đi</span>
          </li>
        </Link>
        
        <li className="menu-item">
          <i className="bi bi-box-arrow-right-fill icon"></i>
          <span className="text">Đăng xuất</span>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
