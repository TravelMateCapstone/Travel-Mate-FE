import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/Shared/SidebarList.css'; // Đường dẫn đến CSS nếu cần
import RoutePath from '../../routes/RoutePath';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from 'react-query';

function SidebarList({ items }) {
    const location = useLocation();
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);

    const fetchJoinedGroups = async () => {
        const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups?pageNumber=1', {
            headers: { Authorization: `${token}` },
        });
        if (response.data.message === "No joined groups found.") {
            return [];
        } else {
            return response.data.groups.$values;
        }
    };

    const { data: joinedGroups = [], isLoading } = useQuery(['joinedGroups', token], fetchJoinedGroups);

    return (
        <div style={{
            marginBottom: '30px',
        }}>
            {items.map((item, index) => (
                <Link to={item.route} key={index} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div
                        className={`sidebar-item d-flex align-items-center rounded-5 ${item.isActive ? 'active' : ''}`}
                        style={{
                            padding: '7px 45px',
                            transition: 'background-color 0.3s',
                            backgroundColor: item.isActive ? 'transparent' : 'transparent',
                            color: item.isActive ? '#409034ff' : 'black', // Màu chữ khi đang active
                            marginBottom: '15px',
                        }}
                    >
                        <ion-icon name={item.iconName} style={{ fontSize: '30px', marginRight: '10px' }}></ion-icon>
                        <span style={{ fontSize: '16px' }} className='fw-medium'>{item.title}</span>
                    </div>
                </Link>
            ))}
            {(location.pathname === RoutePath.GROUP_DETAILS || location.pathname === RoutePath.GROUP_MY_DETAILS) && (
                <>
                    {/* Danh sách nhóm đã tham gia */}
                    {isLoading ? (
                        <div className="joined-groups mt-4">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="group-card p-3 mb-3 gap-2 w-100 d-flex rounded-3 placeholder-glow">
                                    <div className="placeholder col-3"></div>
                                    <div className="group-info">
                                        <p className='fw-medium mb-1 placeholder col-7'></p>
                                        <p className='m-0 fw-light placeholder col-4'></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="joined-groups mt-4">
                            {joinedGroups.slice(0, 5).map((group) => (
                                <div key={group.groupId} className="group-card p-3 mb-3 gap-2 w-100 d-flex rounded-3">
                                    <img src={group.groupImageUrl} alt={group.groupName} className="group-image object-fit-cover" />
                                    <div className="group-info">
                                        <p className='fw-medium mb-1'>{group.groupName}</p>
                                        <p className='m-0 fw-light'>{group.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

        </div>
    );
}

export default SidebarList;
