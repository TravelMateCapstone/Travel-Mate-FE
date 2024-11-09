import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Shared/SidebarList.css'; // Đường dẫn đến CSS nếu cần
import RoutePath from '../../routes/RoutePath';

function SidebarList({ items }) {

    const isActiveGroupJointed = items.route === RoutePath.GROUP_DETAILS;

    return (
        <>
            {items.map((item, index) => (
                <Link to={item.route} key={index} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div
                        className={`sidebar-item d-flex align-items-center rounded-5 ${item.isActive ? 'active' : ''}`}
                        style={{
                            height: '45.39px',
                            width: '300px',
                            padding: '5px 45px',
                            transition: 'background-color 0.3s',
                            backgroundColor: item.isActive ? '#409034' : 'transparent',
                            color: item.isActive ? '#fff' : 'inherit',
                            marginBottom: '10px'
                        }}
                    >
                        <ion-icon name={item.iconName} style={{ fontSize: '30px', marginRight: '10px' }}></ion-icon>
                        <span style={{ fontSize: '16px' }} className='fw-medium'>{item.title}</span>
                    </div>
                </Link>
            ))}
        </>
    );
}

export default SidebarList;
