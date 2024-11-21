import React, { memo } from 'react'
import { Dropdown } from 'react-bootstrap'

const ChatHeader = () => {
  
  return (
    <div className='chat-header d-flex justify-content-between mb-2'>
      <div className='d-flex gap-2'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
        <div className='d-flex flex-column'>
          <p className='m-0'>Nguyễn Văn A</p>
          <small>Đang hoạt động</small>
        </div>
      </div>
      <Dropdown align={'end'}>
        <Dropdown.Toggle variant="">
          <ion-icon name="ellipsis-vertical-outline"></ion-icon>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item >Xem hồ sơ</Dropdown.Item>
          <Dropdown.Item >Báo cáo</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default memo(ChatHeader)