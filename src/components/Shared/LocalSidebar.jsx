import React from 'react'
import { Link } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';

function LocalSidebar() {
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            {/* Sidebar - Brand */}
            <Link to={RoutePath.LOCAL_STATICTIS} className="sidebar-brand d-flex align-items-center justify-content-center">
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink" />
                </div>
                <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
            </Link>
            {/* Divider */}
            <hr className="sidebar-divider my-0" />
            {/* Nav Item - Dashboard */}
            <li className="nav-item active">
                <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.LOCAL_STATICTIS}>
                    <ion-icon name="pie-chart"></ion-icon>
                    <span>Thống kê</span>
                </Link>
            </li>
            <hr className="sidebar-divider" />
            <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.LOCAL_WALLET_MANAGEMENT}>
                    <ion-icon name="mail-open"></ion-icon>
                    <span>Ví tiền</span>
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.LOCAL_TRIP_HISTORY}>
                    <ion-icon name="accessibility"></ion-icon>
                    <span>Chuyến đi</span>
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.LOCAL_CALENDAR_MANAGEMENT}>
                    <ion-icon name="cash"></ion-icon>
                    <span>Lịch</span>
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-1" to={RoutePath.LOCAL_PLAN_MANAGEMENT}>
                    <ion-icon name="airplane"></ion-icon>
                    <span>Kế hoạch</span>
                </Link>
            </li>
            <hr className="sidebar-divider d-none d-md-block" />
        </ul>
    )
}

export default LocalSidebar