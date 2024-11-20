import React, { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/Shared/SidebarList.css';
import RoutePath from '../../routes/RoutePath';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useQuery } from 'react-query';
import { viewGroup } from '../../redux/actions/groupActions';

const SidebarList = React.memo(({ items }) => {
    const location = useLocation();
    const token = useSelector(state => state.auth.token);
    const userJoinedStatus = useSelector(state => state.group.userJoinedStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchJoinedGroups = useCallback(async () => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/JoinedGroups?pageNumber=1`, {
            headers: { Authorization: `${token}` },
        });
        return response.data.message === "No joined groups found." ? [] : response.data.groups.$values;
    }, [token]);

    const fetchCreatedGroups = useCallback(async () => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/CreatedGroups?pageNumber=1`, {
            headers: { Authorization: `${token}` },
        });
        return response.data.message === "No joined groups found." ? [] : response.data.groups.$values;
    }, [token]);

    const { data: joinedGroups = [], isLoading } = useQuery('joinedGroup', fetchJoinedGroups);
    const { data: createdGroup = [], isLoadingCreated } = useQuery('createdGroups', fetchCreatedGroups);

    const handleViewGroup = (group) => {
        if(userJoinedStatus == 'Owner') {
            dispatch(viewGroup(group, 'Owner'));
        } else if(userJoinedStatus == 'Joined') {
            dispatch(viewGroup(group, 'Joined'));
        }
        navigate(RoutePath.GROUP_DETAILS);
    };

    return (
        <div className="sidebar-list">
            {items.map((item, index) => (
                <Link to={item.route} key={index} className="sidebar-link">
                    <div className={`sidebar-item ${item.isActive ? 'active' : ''}`}>
                        <ion-icon name={item.iconName} style={{ fontSize: '30px', marginRight: '10px' }}></ion-icon>
                        <span className='sidebar-title'>{item.title}</span>
                    </div>
                </Link>
            ))}
            {(location.pathname === RoutePath.GROUP_DETAILS && userJoinedStatus == 'Joined') && (
                <div className="joined-groups mt-4">
                    {isLoading ? (
                        [...Array(5)].map((_, index) => (
                            <div key={index} className="group-card placeholder-glow">
                                <div className="placeholder col-3"></div>
                                <div className="group-info">
                                    <p className='fw-medium mb-1 placeholder col-7'></p>
                                    <p className='m-0 fw-light placeholder col-4'></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        joinedGroups.slice(0, 5).map((group) => (
                            <div key={group.groupId} className="group-card p-2" onClick={() => handleViewGroup(group, 'Joined')}>
                                <img src={group.groupImageUrl} alt={group.groupName} className="group-image object-fit-cover" />
                                <div className="group-info">
                                    <p className='fw-medium mb-1 text-truncate' style={{ maxWidth: '150px' }}>{group.groupName}</p>
                                    <p className='m-0 fw-light'>{group.location}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            {(location.pathname === RoutePath.GROUP_DETAILS && userJoinedStatus == 'Owner') && (
                <div className="created-groups mt-4">
                    {isLoadingCreated ? (
                        [...Array(5)].map((_, index) => (
                            <div key={index} className="group-card placeholder-glow">
                                <div className="placeholder col-3"></div>
                                <div className="group-info">
                                    <p className='fw-medium mb-1 placeholder col-7'></p>
                                    <p className='m-0 fw-light placeholder col-4'></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        createdGroup.slice(0, 5).map((group) => (
                            <div key={group.groupId} className="group-card p-2" onClick={() => handleViewGroup(group)}>
                                <img src={group.groupImageUrl} alt={group.groupName} className="group-image object-fit-cover" />
                                <div className="group-info">
                                    <p className='fw-medium mb-1 text-truncate' style={{ maxWidth: '150px' }}>{group.groupName}</p>
                                    <p className='m-0 fw-light'>{group.location}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
});

export default SidebarList;
