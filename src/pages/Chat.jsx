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
    <Container fluid className='p-0'>
      <Row>
        <MemoizedChatSidebar />
        <Col lg={10} className='chat-column'>
          <MemoizedChatHeader />
          <div className='chatmessage-container overflow-y-auto'>
            <MemoizedChatMessages isSender={true} />
            <MemoizedChatMessages isSender={false} />
            {/* <MemoizedChatMessages isRequest={true} /> */}
          </div>
          <MemoizedChatInput />
        </Col>
      </Row>
    </Container>
  )
}

export default Chat