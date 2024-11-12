import React from 'react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

function SidebarDashboard() {
    return (
        <ul className="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
            <div
                style={{
                    background: 'transparent',
                }}
                className="sidebar-brand d-flex align-items-center justify-content-center"
            >
                <div className="sidebar-brand-icon">
                    <img src={logo} alt="Logo" />
                </div>
            </div>
            <hr className="sidebar-divider my-0" />
            
            <Link to={RoutePath.ADMIN}>
                <li className="nav-item active">
                    <div className="nav-link">
                        <i className="fas fa-fw fa-tachometer-alt" />
                        <span>Dashboard</span>
                    </div>
                </li>
            </Link>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Features</div>

            <Link to={RoutePath.ADMIN}>
                <li className="nav-item">
                    <div className="nav-link d-flex align-items-center gap-2">
                        <ion-icon name="pie-chart-outline"></ion-icon>
                        <span>Thống kê</span>
                    </div>
                </li>
            </Link>

            <Link to={RoutePath.ADMIN_REPORT}>
                <li className="nav-item">
                    <div className="nav-link d-flex align-items-center gap-2">
                        <ion-icon name="wallet-outline"></ion-icon>
                        <span>Quản lí khiếu nại</span>
                    </div>
                </li>
            </Link>

            <Link to={RoutePath.ADMIN_ACCOUNT_LIST}>
                <li className="nav-item">
                    <div className="nav-link d-flex align-items-center gap-2">
                        <ion-icon name="airplane-outline"></ion-icon>
                        <span>Quản lí tài khoản</span>
                    </div>
                </li>
            </Link>

            <Link to={RoutePath.ADMIN_TRANSACTION}>
                <li className="nav-item">
                    <div className="nav-link d-flex align-items-center gap-2">
                        <ion-icon name="calendar-outline"></ion-icon>
                        <span>Lịch sử giao dịch</span>
                    </div>
                </li>
            </Link>

            <Link to={RoutePath.ADMIN_TRIP_HISTORY}>
                <li className="nav-item">
                    <div className="nav-link d-flex align-items-center gap-2">
                        <ion-icon name="calendar-outline"></ion-icon>
                        <span>Lịch sử chuyến đi</span>
                    </div>
                </li>
            </Link>

            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Examples</div>

            <Link to={RoutePath.pages}>
                <li className="nav-item">
                    <div className="nav-link">
                        <i className="fas fa-fw fa-columns" />
                        <span>Pages</span>
                    </div>
                </li>
            </Link>

            <Link to={RoutePath.charts}>
                <li className="nav-item">
                    <div className="nav-link">
                        <i className="fas fa-fw fa-chart-area" />
                        <span>Charts</span>
                    </div>
                </li>
            </Link>

            <hr className="sidebar-divider" />
            <div className="version" id="version-ruangadmin" />
        </ul>
    );
}

export default SidebarDashboard;
