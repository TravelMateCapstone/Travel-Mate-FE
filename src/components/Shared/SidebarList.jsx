import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Shared/SidebarList.css'; // Đường dẫn đến CSS nếu cần

function SidebarList({ iconName, title, route, isActive }) {
    return (
        <Link to={route} style={{ color: 'inherit', textDecoration: 'none' }}>
            <div
                className={`sidebar-item d-flex align-items-center rounded-5 ${isActive ? 'active' : ''}`} 
                style={{
                    padding: '5px 45px',
                    transition: 'background-color 0.3s',
                    backgroundColor: isActive ? '#409034' : 'transparent',
                    color: isActive ? '#fff' : 'inherit', // Màu chữ khi đang active
                }}
            >
                <ion-icon name={iconName} style={{ fontSize: '37px', marginRight: '10px' }}></ion-icon>
                <span style={{
                    fontSize: '16px',
                }} className='fw-medium'>{title}</span>
            </div>
        </Link>
    );
}

export default SidebarList;
