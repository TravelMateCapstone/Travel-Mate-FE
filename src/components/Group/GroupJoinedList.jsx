import React, { Suspense, memo } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedGroup } from '../../redux/actions/groupActions'; // Adjust the import path as necessary
import '../../assets/css/Groups/GroupJoinedList.css';

const GroupJoinedList = memo(() => {
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchGroups = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/Groups/JoinedGroups`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data.groups.$values;
    };

    const { data: groups, isLoading } = useQuery('joinedGroupsList', fetchGroups, {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    const handleGroupClick = (group) => {
        dispatch(setSelectedGroup(group));
        navigate(`/groups/${group.groupId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div style={{ padding: '20px' }}>
            <div className="group-title">Nhóm của bạn</div>

            {groups.map(group => (
                <div key={group.groupId} className="card mb-3 shadow card-group-container" onClick={() => handleGroupClick(group)}>
                    <div className="d-flex gap-2">
                        <img src={group.groupImageUrl} className="card-img" alt={group.groupName} />
                        <div className="card-body">
                            <p className="card-title">{group.groupName}</p>
                            <p className="card-text text-nowrap m-0">{group.location}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

const GroupJoinedListWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <GroupJoinedList />
    </Suspense>
);

export default GroupJoinedListWrapper;
