import React, { useEffect, useState } from 'react';
import { Button, Modal, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../../assets/css/Events/JoinedEventDetail.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import { viewProfile } from '../../redux/actions/profileActions';

function EventJoined() {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const selectedEvent = useSelector(state => state.event.selectedEvent) || JSON.parse(localStorage.getItem('selectedEvent'));
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        if (selectedEvent) {
            const fetchMembers = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/EventControllerWOO/${selectedEvent.id}/Event-With-Profiles-join`);
                    setMembers(response.data.$values.map(item => item.profile));
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách người tham gia:', error);
                }
            };

            const checkIfJoined = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/EventParticipants/check-current-user-joined/${selectedEvent.id}`, {
                        headers: { Authorization: `${token}` }
                    });
                    setIsJoined(response.data);
                } catch (error) {
                    console.error('Lỗi khi kiểm tra tham gia sự kiện:', error);
                }
            };

            fetchMembers();
            checkIfJoined();
        }
    }, [selectedEvent, token]);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleJoinOrLeaveEvent = async () => {
        if (isJoined) {
            // Hủy tham gia sự kiện
            try {
                await axios.delete(
                    `${import.meta.env.VITE_BASE_API_URL}/api/EventParticipants/current-user-out-event/${selectedEvent.id}`,
                    { headers: { Authorization: `${token}` } }
                );
                toast.success("Hủy tham gia sự kiện thành công!");
                setIsJoined(false);
                setMembers(prevMembers => prevMembers.filter(member => member.id !== selectedEvent.currentUserId));
                window.location.reload();
            } catch (error) {
                toast.error("Lỗi khi hủy tham gia sự kiện!");
                console.error('Lỗi khi hủy tham gia sự kiện:', error);
            }
        } else {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_API_URL}/api/EventParticipants/current-user-join-event`,
                    { eventId: selectedEvent.id, joinedAt: new Date().toISOString(), notification: true },
                    { headers: { Authorization: `${token}` } }
                );
                if (response.status === 200) {
                    toast.success("Tham gia sự kiện thành công!");
                    setIsJoined(true);
                    setMembers(prevMembers => [...prevMembers, response.data.profile]);
                }
                window.location.reload();
            } catch (error) {
                toast.error("Lỗi khi tham gia sự kiện!");
                console.error("Error joining event:", error);
            }
        }
    };

    const handleViewProfile = (memberId) => {
        console.log("id", memberId);
        console.log("id", user.id);
        if (parseInt(memberId) === parseInt(user.id)) {
            console.log("idp");
            dispatch(viewProfile(memberId));
            navigate(RoutePath.PROFILE);
        } else {
            console.log("ido");
            dispatch(viewProfile(memberId));
            navigate(RoutePath.OTHERS_PROFILE);
        }
    };

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
                <div>
                    <div className='event-time'>
                        <p>{selectedEvent.startTime}</p>
                    </div>
                    <div className='justify-content-between'>
                        <p className='event-name-inf'>{selectedEvent.title}</p>
                        <div className='event-location-inf'>
                            <i className='bi bi-geo-alt'><ion-icon name="location-outline"></ion-icon>  {selectedEvent.location}</i>
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
                    <div className='event-location-inf d-flex align-items-center'>
                        <div className='icon'>
                            <ion-icon name="people-outline" className="icon-margin"></ion-icon>
                        </div>
                        <div>
                            <i className='text-location'>{members.length} người tham gia</i>
                        </div>
                    </div>
                </div>

                <div className='event-status'>
                    <Button variant="outline-success" onClick={handleJoinOrLeaveEvent} className='form-event-status'>
                        {isJoined ? "Hủy tham gia" : "Tham gia"}
                    </Button>
                </div>
            </div>
            <div className="section-container">
                <div className="section-left my-4">
                    <p className='m-3 title'>Nội dung</p>
                    <p className='left-content m-3'>{selectedEvent.text}</p>
                </div>
                <div className="section-right my-4">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h4 className='m-3 title'>Người tham gia</h4>
                        <a href="#" className='view-all-link m-3' onClick={handleShowModal}>Xem tất cả</a>
                    </div>
                    <div className='members-list m-3'>
                        {members.slice(0, 5).map((member, index) => (
                            <div key={index} className='member-item d-flex align-items-center'>
                                <img
                                    src={member?.imageUser || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                                    className='members-img'
                                    alt={`member-${index}`}
                                />
                                <div className='member-info'>
                                    <p className='member-name'>{member.firstName} {member.lastName}</p>
                                    <p className='member-location'>{member.city || 'Địa điểm không xác định'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal hiển thị danh sách người tham gia */}
            <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title className="modal-title">Danh sách người tham gia</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {members.map((member, index) => (
                        <div key={index} className='member-item d-flex justify-content-between align-items-center member-list-item'>
                            <div className='d-flex align-items-center member-info-container'>
                                <img
                                    src={member?.imageUser || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                                    className='members-img member-img'
                                    alt={`member-${index}`}
                                />
                                <div className='member-info'>
                                    <p className='member-name'>{member.firstName} {member.lastName}</p>
                                    <p className='member-location'>{member.city || 'Địa điểm không xác định'}</p>
                                </div>
                            </div>
                            <Dropdown className="member-dropdown">
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className='dropdown-icon'>
                                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu">
                                    <Dropdown.Item onClick={() => handleViewProfile(member.userId)}>Xem hồ sơ</Dropdown.Item>
                                    <Dropdown.Item href="#">Liên hệ</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    ))}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EventJoined;
