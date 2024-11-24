import React, { memo, useEffect, useState } from 'react';
import { Col, Form, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { viewRequest } from '../../redux/actions/requestActions';
import { viewMessage } from '../../redux/actions/messageActions';

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [requests, setRequests] = useState([]);
  const [chats, setChats] = useState([]);

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
      setChats(response.data.$values);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const formatDate = (dateTime) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateTime).toLocaleDateString('vi-VN', options);
  };

  useEffect(() => {
    fetchRequest();
    fetchChats();
    console.log(requests);
  }, [token]);

  const handleRequestClick = async (requestId) => {
    try {
      dispatch(viewRequest(requestId, token));
    } catch (error) {
      console.error('Error fetching request by ID:', error);
    }
  };
  const handleMessageClick = async (formId) => {
    try {
      dispatch(viewMessage(formId, token));
    } catch (error) {
      console.error('Error fetching request by ID:', error);
    }
  };

  return (
    <Col lg={2}>
      <Form.Control type="text" className='w-100 my-2 rounded-5 search-chat' placeholder='Tìm kiếm...' />
      <Tabs defaultActiveKey="tin-nhan" id="chat-tabs">
        <Tab eventKey="tin-nhan" title="Tin nhắn">
          <div className='mt-2'>
            {chats.map(chat => (
              <div className='message d-flex gap-2 mb-2' key={chat.id} onClick={() => handleMessageClick(chat.id)}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
                <div className='d-flex flex-column'>
                  <p className='m-0'>Người dùng {chat.travelerId}</p>
                  <small className='chat-text'>
                    {chat.questions.$values[0]?.text.length > 32
                      ? `${chat.questions.$values[0]?.text.substring(0, 32)}...`
                      : chat.questions.$values[0]?.text}
                  </small>
                  <small>{formatDate(chat.startDate)} - {formatDate(chat.endDate)}</small>
                </div>
              </div>
            ))}
          </div>
        </Tab>
        <Tab eventKey="yeu-cau" title="Yêu cầu">
          {requests.map(request => (
            <div className='mt-2' key={request.id} onClick={() => handleRequestClick(request.id)}>
              <div className='message d-flex gap-2 mb-2'>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
                <div className='d-flex flex-column'>
                  <p className='m-0'>
                    {request.travelerId == user.id ? (<>
                      Yêu cầu của bạn
                    </>) : (<>
                      Người dùng {request.travelerId}
                    </>)}
                  </p>
                  <small className='chat-text'>Đã gửi cho bạn 1 yêu cầu</small>
                  <small>{formatDate(request.startDate)} - {formatDate(request.endDate)}</small>
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