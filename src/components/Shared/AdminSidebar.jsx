import React from 'react'
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

function AdminSidebar() {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <Link to={RoutePath.ADMIN} className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink" />
        </div>
        <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
      </Link>
      <hr className="sidebar-divider my-0" />
      <li className="nav-item active">
        <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.ADMIN}>
          <ion-icon name="pie-chart"></ion-icon>
          <span>Thống kê</span>
        </Link>
      </li>
      <hr className="sidebar-divider" />
      <li className="nav-item">
        <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.ADMIN_REPORT}>
          <ion-icon name="mail-open"></ion-icon>
          <span>Quản lí khiếu nại</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.ADMIN_ACCOUNT_LIST}>
          <ion-icon name="accessibility"></ion-icon>
          <span>Quản lí tài khoản</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.ADMIN_TRANSACTION}>
          <ion-icon name="cash"></ion-icon>
          <span>Lịch sử giao dịch</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.ADMIN_TRIP_HISTORY}>
          <ion-icon name="airplane"></ion-icon>
          <span>Lịch sử chuyến đi</span>
        </Link>
      </li>
      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
  )
}

export default AdminSidebar