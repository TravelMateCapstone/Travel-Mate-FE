import React, { memo, useEffect, useState } from 'react';
import GroupCard from './GroupCard';
import axios from 'axios';
import { useSelector } from 'react-redux';

function ProposeGroup() {
    const [groups, setGroups] = useState([]);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const totalPagesResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/groups?pageNumber=1`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const totalPages = totalPagesResponse.data.totalPages;
                const randomPage = Math.floor(Math.random() * totalPages) + 1;

                const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/groups?pageNumber=${randomPage}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                console.log(response.data);
                
                setGroups(response.data.groups.$values.slice(0, 2)); // Get two random groups
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, [token]);

    return (
        <div className='d-flex flex-column gap-4' style={{ padding: '0 85px' }}>
            <h3>Nhóm đề xuất</h3>
            {groups.map(group => (
                <GroupCard key={group.groupId} group={group} userJoinedStatus="NotJoined" />
            ))}
        </div>
    );
}

export default memo(ProposeGroup);