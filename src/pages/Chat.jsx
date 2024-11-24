import React, { memo } from 'react'
import { Col, Container, Row, Tabs, Tab, Dropdown, Button, Form } from 'react-bootstrap'
import createContractLogo from '../assets/images/createContractLogo.png'
import '../assets/css/Chat/Chat.css'
import ChatSidebar from '../components/Chat/ChatSidebar'
import ChatHeader from '../components/Chat/ChatHeader'
import ChatMessages from '../components/Chat/ChatMessages'
import ChatInput from '../components/Chat/ChatInput'
import ChatContract from '../components/Chat/ChatContract'

const MemoizedChatSidebar = memo(ChatSidebar);
const MemoizedChatHeader = memo(ChatHeader);
const MemoizedChatMessages = memo(ChatMessages);
const MemoizedChatInput = memo(ChatInput);
const MemoizedChatContract = memo(ChatContract);

function Chat() {
  return (
    <Container fluid className='p-0'>
      <Row>
        <MemoizedChatSidebar />
        <Col lg={8} className='chat-column'>
          <MemoizedChatHeader />
          <div className='chatmessage-container overflow-y-auto'>
            {/* <MemoizedChatMessages isSender={true} />
            <MemoizedChatMessages isSender={false} /> */}
            <MemoizedChatMessages isRequest={true} />
          </div>
          <MemoizedChatInput />
        </Col>
        <MemoizedChatContract />
      </Row>
    </Container>
  )
}

export default Chat