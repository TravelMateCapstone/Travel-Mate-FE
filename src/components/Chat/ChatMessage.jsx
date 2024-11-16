import React, { memo } from 'react';
import '../Chat/../../assets/css/Chat/Chat.css';

function ChatMessage({ sender, text, time, isSentByUser }) {
  return (
    <div className={`chat-message ${isSentByUser ? 'sent' : 'received'}`}>
      <div className={`message-content justify-content-start align-items-start gap-lg-2 gap-md-2 ${isSentByUser ? 'flex-lg-row-reverse flex-md-row-reverse' : ''}`}>
        <img 
          src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" 
          style={{width: '40px', height: '40px'}} 
          alt="avatar" 
          className='object-fit-cover rounded-circle'
        />
        <div>
          <p className='p-2 rounded-3 content-message'>{text}</p>
          <span className="message-time">{time}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatMessage);
