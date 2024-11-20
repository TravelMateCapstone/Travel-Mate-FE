import React from 'react';

const ChatHeader = React.memo(({ chatName }) => {
  return (
    <div className="chat-header rounded-top-3 d-flex justify-content-between flex-grow-1">
      <div className="chat-header-info d-flex">
        <img src="https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg" alt="avatar" className="chat-avatar object-fit-cover" />
        <div>
          <p>{chatName}</p>
          <span>Quảng Nam</span>
        </div>
       
      </div>
      <i className='bi bi-info-circle-fill'></i>
    </div>
  );
});

export default ChatHeader;
