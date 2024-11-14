import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import '../../assets/css/Groups/GroupJoinedList.css';

function GroupJoinedList() {
    const token = useSelector((state) => state.auth.token);

    const fetchGroups = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/JoinedGroups`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data.groups.$values;
    };

    const { data: groups, isLoading } = useQuery('joinedGroupsList', fetchGroups);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '20px 0'
            }}>Nhóm của bạn</div>

            {groups.map(group => (
                <div key={group.groupId} className="card mb-3 shadow card-group-container" style={{
                    padding: '18px',
                    height: '92px',
                    borderRadius: '10px'
                }}>
                    <div className="d-flex gap-2">
                        <img src={group.groupImageUrl} className="card-img" alt={group.groupName} style={{
                            width: '82px',
                            height: '55px',
                            objectFit: 'cover',
                        }} />
                        <div className="card-body m-0 p-0">
                            <p className="card-title" style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                maxWidth: '160px'
                            }}>{group.groupName}</p>
                            <p className="card-text text-nowrap m-0" style={{
                                fontSize: '12px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                maxWidth: '160px'
                            }}>{group.location}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GroupJoinedList;
