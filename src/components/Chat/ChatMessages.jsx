import React, { memo } from 'react';
import RequestCard from '../Profile/FormBuilder/RequestCard';
import { useSelector } from 'react-redux';

const ChatMessages = ({ isSender, isRequest, selectedRequest }) => {
  const requestData = useSelector(state => state.message.currentMessage) || useSelector(state => state.request.currentRequest);

  const chatData = useSelector(state => state.message.currentMessage);
  console.log('ChatData', chatData);
  

  return (
    <>
      {isRequest ? (
        <div className='chat-sender d-flex gap-2'>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
          <div>
            <RequestCard request={requestData} />
          </div>
        </div>
      ) : (
        <>
          {isSender ? (
            <div className='chat-sender d-flex gap-2'>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRez3lFozeHy6f4R0eoyEaIlM5lunDXiEbICA&s" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
              <div>
                <p className='m-0'>Chào bạn, bạn cần giúp gì không?</p>
                <small>8:00 PM</small>
              </div>
            </div>
          ) : (
            <div className='chat-receiver d-flex justify-content-end gap-2'>
              <div className='d-flex flex-column align-items-end'>
                <p className='m-0'>Chào bạn, bạn cần giúp gì không?</p>
                <small>8:00 PM</small>
              </div>
              <img src="https://avatarfiles.alphacoders.com/264/264762.jpg" alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default memo(ChatMessages);
