import React, { useCallback } from 'react';
import flying from '../../assets/images/flying.png';

const ChatList = React.memo(({ chats, activeChat, onChatClick }) => {
  const handleChatClick = useCallback((id) => {
    onChatClick(id);
  }, [onChatClick]);

  return (
    <div className="chat-list rounded-top-3">
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={activeChat === chat.id ? 'active' : 'd-flex'}
            onClick={() => handleChatClick(chat.id)}
          >
            <div><img src={chat.avatar} alt={`${chat.name} avatar`} className="chat-avatar" /></div>
            <div className='d-lg-flex align-items-lg-end gap-lg-4 content-chat'>
              <div className="chat-details">
                <div className='d-flex justify-content-between'><span className="chat-name fw-medium">{chat.name}</span>
                  <div className="chat-meta">
                    <span className="chat-timestamp me-2 text-black">{chat.timestamp}</span>
                    <span className="chat-actions"><img src={flying} alt="" style={{width: '15px'}} /></span> 
                  </div>
                </div>
                <span className="chat-last-message fw-light text-black">{chat.lastMessage}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ChatList;
