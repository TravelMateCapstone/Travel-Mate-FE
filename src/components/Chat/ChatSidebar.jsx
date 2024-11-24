import React, { memo, useEffect, useState } from 'react';
import { Col, Form, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectRequest, viewRequest } from '../../redux/actions/requestActions';
import { viewMessage } from '../../redux/actions/messageActions';
import { updateChatHeader, updateChatContent } from '../../redux/actions/chatAction';
import { parseISO, format } from 'date-fns';
const ChatSidebar = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [requests, setRequests] = useState([]);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequest = async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Request', {
        headers: {
          Authorization: `${token}`
        }
      });
      setRequests(response.data.$values);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Chats', {
        headers: {
          Authorization: `${token}`
        }
      });
      setChats(response.data?.$values);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchRequest();
    fetchChats();
    console.log(requests);
  }, [token]);

  const handleRequestClick = async (request) => {
    try {
      dispatch(updateChatHeader(request))
      dispatch(updateChatContent(request.formId, token, false))
    } catch (error) {
      console.error('Error fetching request by ID:', error);
    }
  };
  const handleMessageClick = async (message) => {
    try {
      dispatch(updateChatHeader(message))
      dispatch(updateChatContent(message.formId, token, true))
      // dispatch(viewMessage(message.formId, token));
      
    } catch (error) {
      console.error('Error fetching request by ID:', error);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter(request => 
    request.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Col lg={2}>
      <Form.Control 
        type="text" 
        className='w-100 my-2 rounded-5 search-chat' 
        placeholder='Tìm kiếm...' 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Tabs defaultActiveKey="tin-nhan" id="chat-tabs">
        <Tab eventKey="tin-nhan" title="Tin nhắn">
          <div className='mt-2'>
            {filteredChats.map(chat => (
              <div className='message d-flex gap-2 mb-2' key={chat.id} onClick={() => handleMessageClick(chat)}>
                <img src={chat.userAvatarUrl} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
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
        </Tab>
        <Tab eventKey="yeu-cau" title="Yêu cầu">
          {filteredRequests.map(request => (
            <div className='mt-2' key={request.id} onClick={() => handleRequestClick(request)}>
              <div className='message d-flex gap-2 mb-2'>
                <img src={request.userAvatarUrl} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
                <div className='d-flex flex-column'>
                  <p className='m-0'>
                    {request.travelerId == user.id ? (<>
                      Yêu cầu của bạn
                    </>) : (<>
                    {request.userName}
                    </>)}
                  </p>
                  <small className='chat-text'>Đã gửi cho bạn 1 yêu cầu</small>
                </div>
              </div>
            </div>
          ))}
        </Tab>
      </Tabs>
    </Col>
  );
};

export default memo(ChatSidebar);