import React, { memo, useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { viewMessage } from '../../redux/actions/messageActions';
import { updateChatHeader, updateChatContent } from '../../redux/actions/chatAction';
import { parseISO, format } from 'date-fns';
const ChatSidebar = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [chats, setChats] = useState([
    {
      formId: 1,
      userName: 'Alice Johnson',
      userAvatarUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSvkfVc3qX1xVVO0Yu5Vi9L_v5aGy_tZon8uORJ9fetFaOTzdxsavRWhNAnZ2-yhcI2l045q1pM0zKrdInDEZQUow',
      questions: { $values: [{ text: 'Hello, how are you?' }] },
      address: '789 Oak St'
    },
    {
      formId: 2,
      userName: 'Bob Brown',
      userAvatarUrl: 'https://example.com/avatar4.jpg',
      questions: { $values: [{ text: 'Can we meet tomorrow?' }] },
      address: '101 Pine St'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // No API calls, using hardcoded data
  }, [token]);

  const handleMessageClick = async (message) => {
    try {
      dispatch(updateChatHeader(message))
      dispatch(updateChatContent(message.formId, token, true))
    } catch (error) {
      console.error('Error fetching request by ID:', error);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Col lg={3} className='border-1 p-4' style={{
      borderColor: '#e0e0e0',
    }}>
      <Form.Control 
        type="text" 
        className='w-100 my-2 rounded-5 search-chat' 
        placeholder='Tìm kiếm...' 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className='mt-2'>
        {filteredChats.map(chat => (
          <div style={{
        
          }} className='message-item-chat-sidebar d-flex gap-2 p-2 mb-2' key={chat.formId} onClick={() => handleMessageClick(chat)}>
            <img src={chat.userAvatarUrl} alt="" width={60} height={60} className='rounded-circle object-fit-cover' />
            <div className='d-flex flex-column'>
              <p className='m-0'>{chat.userName}</p>
              <small className='chat-text'>
                {chat.questions?.$values[0]?.text.length > 32
                  ? `${chat.questions?.$values[0]?.text.substring(0, 32)}...`
                  : chat.questions?.$values[0]?.text}
              </small>
              <small>{chat.address}</small>
            </div>
          </div>
        ))}
      </div>
    </Col>
  );
};

export default memo(ChatSidebar);