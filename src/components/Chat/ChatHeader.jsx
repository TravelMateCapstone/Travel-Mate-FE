import React, { memo } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { viewProfile } from '../../redux/actions/profileActions'
import { useNavigate } from 'react-router-dom'
import RoutePath from '../../routes/RoutePath'
const ChatHeader = () => {
  const selectedItem = useSelector(state => state.request.currentRequest);
  const selectedRequest = useSelector(state => state.request.selectedRequest);
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const chatHeader = useSelector(state => state.chat.chatHeader);
  return (
    <div className='chat-header d-flex justify-content-between mb-2'>
      <div className='d-flex gap-2'>
        <img src={chatHeader?.userAvatarUrl} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
        <div className='d-flex flex-column'>
          <p className='m-0'>{chatHeader?.userName}</p>
          <small>{chatHeader?.address}</small>
        </div>
      </div>
      <Dropdown align={'end'}>
        <Dropdown.Toggle variant="">
          <ion-icon name="ellipsis-vertical-outline"></ion-icon>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => {
            dispatch(viewProfile(selectedItem?.travelerId, token));
            navigation(RoutePath.PROFILE);
          }}>Xem hồ sơ</Dropdown.Item>
          <Dropdown.Item >Báo cáo</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default memo(ChatHeader)