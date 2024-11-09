import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/Shared/SidebarList.css'; // Đường dẫn đến CSS nếu cần
import RoutePath from '../../routes/RoutePath';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
function SidebarList({ items }) {
    const location = useLocation();
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Gọi API để lấy danh sách nhóm đã tham gia
        const fetchJoinedGroups = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Groups/JoinedGroups?pageNumber=1', {
                    headers: { Authorization: `${token}` },
                });
                setJoinedGroups(response.data.groups.$values);
                setIsLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách nhóm đã tham gia:', error);
            }
        };
        fetchJoinedGroups();
    }, [token]);
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
                            backgroundColor: item.isActive ? '#409034' : 'transparent',
                            color: item.isActive ? '#fff' : 'inherit', // Màu chữ khi đang active
                            marginBottom: '15px',
                        }}
                    >
                        <ion-icon name={item.iconName} style={{ fontSize: '37px', marginRight: '10px' }}></ion-icon>
                        <span style={{ fontSize: '16px' }} className='fw-medium'>{item.title}</span>
                    </div>
                </Link>
            ))}
            {(location.pathname === RoutePath.GROUP_DETAILS || location.pathname === RoutePath.GROUP_MY_DETAILS) && (
                <>
                    {/* Danh sách nhóm đã tham gia */}
                    {isLoading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <div className="joined-groups mt-4">
                            {joinedGroups.slice(0, 5).map((group) => (
                                <div key={group.groupId} className="group-card p-3 mb-2 gap-2 w-100 d-flex rounded">
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
