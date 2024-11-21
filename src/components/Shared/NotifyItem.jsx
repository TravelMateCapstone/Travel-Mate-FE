import React, { useCallback } from 'react';
import axios from 'axios';
import '../../assets/css/Shared/NotifyItem.css';
import { toast } from 'react-toastify';
import RoutePath from '../../routes/RoutePath';
import { useNavigate } from 'react-router-dom';

function NotifyItem({ notificationId, typeNotification, senderId, isRequest, avatar, content, name, isRead, onAccept, onDecline }) {

    const navigate = useNavigate();

    const handleNotificationClick = useCallback(async () => {
        if (typeNotification === 2) {
            try {
                const othersUserProfile = await axios.get(`https://travelmateapp.azurewebsites.net/api/Profile/${senderId}`);
                localStorage.setItem('othersProfile', JSON.stringify(othersUserProfile.data));

                const userProfileResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserHome/user/${senderId}`);
                localStorage.setItem('othersHome', JSON.stringify(userProfileResponse.data));

                const userActivitiesResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/user/${senderId}`);
                localStorage.setItem('othersActivity', JSON.stringify(userActivitiesResponse.data));

                const userFriendsResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/Friendship/List-friends/${senderId}`);
                localStorage.setItem('othersListFriend', JSON.stringify(userFriendsResponse.data));

                const othersLocation = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserLocationsWOO/user/${senderId}`);
                localStorage.setItem('othersLocation', JSON.stringify(othersLocation.data));

                const othersUserEducation = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserEducation/user/${senderId}`);
                localStorage.setItem('othersEducation', JSON.stringify(othersUserEducation.data));

                const othersUserLanguages = await axios.get(`https://travelmateapp.azurewebsites.net/api/SpokenLanguages/user/${senderId}`);
                localStorage.setItem('othersLanguages', JSON.stringify(othersUserLanguages.data));

                navigate(RoutePath.OTHERS_PROFILE);
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin hồ sơ!");
                console.error("Error fetching user profile:", error);
            }
        } else if (typeNotification === 3) {
            try {
                const eventResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/EventControllerWOO/${senderId}`);
                const eventData = eventResponse.data;
                const selectedEvent = {
                    id: eventData.eventId,
                    img: eventData.eventImageUrl,
                    startTime: eventData.startAt,
                    endTime: eventData.endAt,
                    title: eventData.eventName,
                    location: eventData.eventLocation,
                    participantCount: eventData.eventParticipants?.$values?.length || 0,
                    text: eventData.description
                };

                localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));

                navigate(RoutePath.EVENT_MANAGEMENT);
            } catch (error) {
                toast.error("Lỗi khi lấy thông tin sự kiện!");
                console.error("Error fetching event details:", error);
            }
        } else if (typeNotification === 1) {
            toast.success("Thông báo này từ hệ thống!");
        }

        if (!isRead) {
            try {
                await axios.post(`https://travelmateapp.azurewebsites.net/api/Notification/current-user-read/${notificationId}`);
                toast.success("Thông báo đã được đánh dấu là đã đọc!");
            } catch (error) {
                console.error("Error marking notification as read:", error);
                toast.error("Có lỗi xảy ra khi đánh dấu thông báo là đã đọc!");
            }
        }
    }, [notificationId, isRead, typeNotification, senderId, navigate]);

    return (
        <>
            {isRequest ? (
                <div className='d-flex align-items-start message-container' onClick={handleNotificationClick} style={{ cursor: 'pointer' }}>
                    <div className='position-relative'>
                        <img
                            src={avatar}
                            alt='avatar'
                            className='rounded-circle img-notify'
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        {/* Hiển thị chấm đỏ nếu chưa đọc */}
                        {!isRead && <div className='unread-indicator'></div>}
                    </div>
                    <div className='d-flex flex-column align-items-start ms-2'>
                        <div className='mess-inf'>
                            <p className='mb-0 text-wrap' style={{ fontSize: '12px' }}>
                                {name && <strong>{name} </strong>} {/* Display name if it exists */}
                                {content}
                            </p>
                            <div className='d-flex justify-content-start align-items-center gap-2 mt-1'>
                                <button className='btn btn-outline-success btn-accept' onClick={(e) => {
                                    e.stopPropagation();
                                    onAccept();
                                }}>Chấp nhận</button>
                                <button className='btn btn-outline-danger btn-decline' onClick={(e) => {
                                    e.stopPropagation();
                                    onDecline();
                                }}>Từ chối</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='d-flex message-container' onClick={handleNotificationClick} style={{ cursor: 'pointer' }}>
                    <div className='position-relative'>
                        <img
                            src={avatar}
                            alt='avatar'
                            className='rounded-circle img-notify'
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        {/* Hiển thị chấm đỏ nếu chưa đọc */}
                        {!isRead && <div className='unread-indicator'></div>}
                    </div>
                    <div className='d-flex align-items-center ms-2'>
                        <div className='mess-inf'>
                            <p className='mb-0 text-wrap' style={{ fontSize: '12px' }}>
                                {name && <strong>{name} </strong>} {/* Display name if it exists */}
                                {content}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NotifyItem;

