import React, { memo } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { viewProfile } from '../../redux/actions/profileActions'
import { useNavigate } from 'react-router-dom'
import RoutePath from '../../routes/RoutePath'
const ChatHeader = () => {
  const selectedItem = useSelector(state => state.request.currentRequest);
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  
  return (
    <div className='chat-header d-flex justify-content-between mb-2'>
      <div className='d-flex gap-2'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
        <div className='d-flex flex-column'>
          <p className='m-0'>{selectedItem?.userName}</p>
          <small>Gửi lúc {selectedItem?.sendAt}</small>
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