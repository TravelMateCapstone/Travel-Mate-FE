import React from 'react';
import '../../assets/css/Shared/AdminNavbar.css';

function AdminNavbar() {
    return (
        <div className="admin-navbar mt-2">
            <div className="search-bar-nav d-none d-md-flex ms-lg-5">
                <i className="bi bi-search"></i>
                <input type="text" placeholder="Search" className='' />
            </div>

            <div className="navbar-right">
                <div className="notification">
                    <i className="bi bi-bell-fill"></i>
                    <span className="badge">2</span>
                </div>
                <div className="user-profile">
                    <img
                        src="https://via.placeholder.com/40" 
                        alt="User Profile"
                        className="profile-img"
                    />
                    <div className="user-info">
                        <span className="user-name">Moni Roy</span>
                        <span className="user-role">Admin</span>
                    </div>
                    <i className="bi bi-caret-down-fill"></i>
                </div>
            </div>
        </div>
    );
}

export default AdminNavbar;
