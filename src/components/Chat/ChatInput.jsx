import React, { memo } from 'react'
import { Button, Form } from 'react-bootstrap'

const ChatInput = () => {
  return (
    <div className='input-chat'>
      <Button variant='' className='d-flex justify-content-center align-items-center'>
        <ion-icon name="image-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
      </Button>
      <Button variant='' className='d-flex justify-content-center align-items-center'>
        <ion-icon name="happy-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
      </Button>
      <div className='d-flex'>
        <Form.Control type="text" className='rounded-start-5 border-end-0 rounded-end-0' placeholder='Nhập tin nhắn...' />
        <Button variant='outline-secondary' className='send-button border-start-0 shadow-none rounded-end-5 rounded-start-0 d-flex justify-content-center align-items-center px-4'>
          <ion-icon name="send-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
        </Button>
      </div>
    </div>
  )
}

export default memo(ChatInput)