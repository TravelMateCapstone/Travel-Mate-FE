import React, { useCallback, useState, useMemo } from 'react';
import axios from 'axios';
import '../../assets/css/Shared/NotifyItem.css';
import { toast } from 'react-toastify';
import RoutePath from '../../routes/RoutePath';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { viewProfile } from '../../redux/actions/profileActions';
import { viewGroup } from '../../redux/actions/groupActions';
import adminIcon from '../../assets/icon/admin_icon.png';
import eventIcon from '../../assets/icon/event_icon.png';
import groupIcon from '../../assets/icon/group.png';
import friendIcon from '../../assets/icon/friend.png';
import notifyIcon from '../../assets/icon/notify.png';

function NotifyItem({ notificationId, typeNotification, senderId, isRequest, avatar, content, name, isRead, onAccept, onDecline, updateUnreadCount }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const group = useSelector((state) => state.group);
    const userJoinedStatus = useSelector(state => state.group.userJoinedStatus);

    const iconUrl = useMemo(() => {
        switch (typeNotification) {
            case 1:
                return notifyIcon;
            case 2:
                return friendIcon;
            case 3:
                return eventIcon;
            case 4:
                return groupIcon;
            default:
                return adminIcon;
        }
    }, [typeNotification]);



    const handleNotificationClick = useCallback(async () => {
        if (typeNotification === 2) {
            if (parseInt(senderId) === parseInt(user.id)) {
                dispatch(viewProfile(senderId));
                navigate(RoutePath.PROFILE);
            } else {
                dispatch(viewProfile(senderId));
                navigate(RoutePath.OTHERS_PROFILE);
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
            if (content.includes("Sự kiện")) {
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
                    navigate(RoutePath.EVENT_DETAILS);
                } catch (error) {
                    toast.error("Lỗi khi lấy thông tin sự kiện!");
                    console.error("Error fetching event details:", error);
                }
            }
        } else if (typeNotification === 4) {
            navigate(RoutePath.GROUP_CREATED);
        }

        if (!isRead) {
            try {
                await axios.post(`https://travelmateapp.azurewebsites.net/api/Notification/current-user-read/${notificationId}`);
                // toast.success("Thông báo đã được đánh dấu là đã đọc!");
                updateUnreadCount(); // Update unread count
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
                            src={iconUrl}
                            alt='avatar'
                            className='rounded-circle img-notify'
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        {!isRead && <div className='unread-indicator'></div>}
                    </div>
                    <div className='d-flex flex-column align-items-start ms-2'>
                        <div className='mess-inf'>
                            <p className='mb-0 text-wrap' style={{ fontSize: '12px' }}>
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
                            src={iconUrl}
                            alt='avatar'
                            className='rounded-circle img-notify'
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        {!isRead && <div className='unread-indicator'></div>}
                    </div>
                    <div className='d-flex align-items-center ms-2'>
                        <div className='mess-inf'>
                            <p className='mb-0 text-wrap' style={{ fontSize: '12px' }}>
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