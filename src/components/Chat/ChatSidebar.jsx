import React, { memo } from 'react'
import { Col, Form, Tabs, Tab } from 'react-bootstrap'

const ChatSidebar = () => {
  return (
    <Col lg={2}>
      <Form.Control type="text" className='w-100 my-2 rounded-5 search-chat' placeholder='Tìm kiếm...' />
      <Tabs defaultActiveKey="tin-nhan" id="chat-tabs">
        <Tab eventKey="tin-nhan" title="Tin nhắn">
          <div className='mt-2'>
            <div className='message d-flex gap-2 mb-2'>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
              <div className='d-flex flex-column'>
                <p className='m-0'>Nguyễn Văn A</p>
                <small>Lịch trình tối nay thế nào</small>
                <small>24/09 - 29/09</small>
              </div>
            </div>
            <div className='mt-2'>
              <div className='message d-flex gap-2 mb-2'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
                <div className='d-flex flex-column'>
                  <p className='m-0'>Nguyễn Văn A</p>
                  <small>Lịch trình tối nay thế nào</small>
                  <small>24/09 - 29/09</small>
                </div>
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="yeu-cau" title="Yêu cầu">
          <div className='mt-2'>
            <div className='mt-2'>
              <div className='message d-flex gap-2 mb-2'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
                <div className='d-flex flex-column'>
                  <p className='m-0'>Nguyễn Văn A</p>
                  <small>Lịch trình tối nay thế nào</small>
                  <small>24/09 - 29/09</small>
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <div className='message d-flex gap-2 mb-2'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
                <div className='d-flex flex-column'>
                  <p className='m-0'>Nguyễn Văn A</p>
                  <small>Lịch trình tối nay thế nào</small>
                  <small>24/09 - 29/09</small>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </Col>
  )
}

export default memo(ChatSidebar)