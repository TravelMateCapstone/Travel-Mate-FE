import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../../assets/css/Events/JoinedEventDetail.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

function EventJoined() {
    const [members, setMembers] = useState([]);
    const selectedEvent = useSelector(state => state.event.selectedEvent) || JSON.parse(localStorage.getItem('selectedEvent'));
    console.log("ev id:", selectedEvent.id);
    useEffect(() => {
        if (selectedEvent) {
            const fetchMembers = async () => {
                try {
                    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/EventControllerWOO/${selectedEvent.id}/Event-With-Profiles-join`);
                    setMembers(response.data.$values.map(item => item.profile));
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách người tham gia:', error);
                }
            };
            fetchMembers();
        }
    }, [selectedEvent]);

    if (!selectedEvent) {
        return <div>No event selected</div>;
    }

    return (
        <div className='join-event-detail-container'>
            <img src={selectedEvent.img} alt={selectedEvent.title} style={{
                height: '331px',
                objectFit: 'cover',
                borderRadius: '20px',
                marginBottom: '5px'
            }} />

            <div className='d-flex'>
                <div className='event-time'>
                    <p>{selectedEvent.startTime}</p>
                </div>
                <div className='event-status'>
                    <Form.Select aria-label="Default select example" className='form-event-status'>
                        <option>Đã tham gia</option>
                        <option value="Rời khỏi nhóm">Hủy tham gia</option>
                    </Form.Select>
                </div>
            </div>

            <div className='justify-content-between'>
                <p className='event-name-inf'>{selectedEvent.title}</p>
                <div className='event-location-inf'>
                    <i className='bi bi-geo-alt'></i> {selectedEvent.location}
                </div>
                <div className='d-flex align-items-center'>
                    <div className='event-start-date'>
                        <p className='my-4'>{selectedEvent.startTime}</p>
                    </div>
                    <div className='m-2 event-end-date'>
                        <p className='m-2'>{selectedEvent.endTime}</p>
                    </div>
                </div>
            </div>

            <div>
                <p><ion-icon name="people-outline" className="icon-margin"></ion-icon> {members.length} người tham gia</p>
            </div>

            <div className="section-container">
                <div className="section-left my-4">
                    <p className='m-3 title'>Nội dung</p>
                    <p className='left-content m-3'>{selectedEvent.text}</p>
                </div>
                <div className="section-right my-4">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 className='m-3 title'>Người tham gia</h4>
                        <a href="#" className='view-all-link m-3'>Xem tất cả</a>
                    </div>
                    <div className='members-list m-3'>
                        {members.map((member, index) => (
                            <div key={index} className='member-item d-flex align-items-center'>
                                <img
                                    src={member.imageUser}
                                    className='members-img'
                                    alt={`member-${index}`}
                                />
                                <div className='member-info'>
                                    <p className='member-name'>{member.fullName}</p>
                                    <p className='member-location'>{member.city || 'Địa điểm không xác định'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventJoined;
