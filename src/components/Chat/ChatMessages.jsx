import React, { memo } from 'react';
import RequestCard from '../Profile/FormBuilder/RequestCard';
import { useSelector } from 'react-redux';

const ChatMessages = ({ isSender, isRequest, selectedRequest }) => {
  const requestData = selectedRequest || useSelector(state => state.request.currentRequest);
  const selectedRequestData = useSelector(state => state.request.selectedRequest);

  const chatData = useSelector(state => state.chat.chatContent);
  const chatHeader = useSelector(state => state.chat.chatHeader);



  return (
    <>
      {isRequest ? (
        <div className='chat-sender d-flex gap-2'>
          <img src={chatHeader?.userAvatarUrl} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
          <div>
            <RequestCard request={chatData} />
          </div>
        </div>
      ) : (
        <>
          {isSender ? (
            <div className='chat-sender d-flex gap-2'>
              <img src={chatHeader?.userAvatarUrl} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
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
              <img src={chatHeader?.userAvatarUrl} alt="" width={50} height={50} className='rounded-circle object-fit-cover' />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default memo(ChatMessages);
