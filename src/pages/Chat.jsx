import React, { memo } from 'react'
import { Col, Container, Row, Tabs, Tab, Dropdown, Button, Form } from 'react-bootstrap'
import createContractLogo from '../assets/images/createContractLogo.png'
import '../assets/css/Chat/Chat.css'
import ChatSidebar from '../components/Chat/ChatSidebar'
import ChatMessages from '../components/Chat/ChatMessages'
import ChatInput from '../components/Chat/ChatInput'
import ChatContract from '../components/Chat/ChatContract'
import ChatHeader from '../components/Chat/ChatHeader'
import { useSelector } from 'react-redux'

const MemoizedChatSidebar = memo(ChatSidebar);
const MemoizedChatHeader = memo(ChatHeader);
const MemoizedChatMessages = memo(ChatMessages);
const MemoizedChatInput = memo(ChatInput);

function Chat() {
  return (
    <Container fluid className=' ' style={{
      padding: '0 140px'
    }}>
      <Row style={{
        
      }}>
       <MemoizedChatSidebar />
        <Col lg={9} className='chat-column px-4'>
          <div className='bg-white pb-3' style={{
            border: '1px solid #e0e0e0',
          }}>
            <MemoizedChatHeader />
            <div className='chatmessage-container overflow-y-auto mx-4'>
              <MemoizedChatMessages isSender={true} />
              <MemoizedChatMessages isSender={false} />
              {/* <MemoizedChatMessages isRequest={true} /> */}
            </div>
            <MemoizedChatInput />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Chat