import React, { useState, useCallback } from 'react';
import mention from '../../assets/images/mention.png';
import Picker from 'emoji-picker-react';

const ChatInput = React.memo(({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  // Handle sending the message
  const handleSend = useCallback(() => {
    if (message.trim()) {
      onSendMessage(message); // Send the message to the parent component
      setMessage(''); // Clear the input after sending
    }
  }, [message, onSendMessage]);

  // Handle pressing the Enter key
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  // Handle emoji click
  const onEmojiClick = useCallback((emojiData, event) => {
    setMessage(prevMessage => prevMessage + emojiData.emoji); // Thêm emoji vào tin nhắn
    setShowEmojiPicker(false); // Đóng Emoji Picker sau khi chọn
  }, []);

  return (
    <div className="chat-input-container">
    
      <ion-icon name="happy-outline" style={{
          fontSize: '1.5rem',
      }} className="input-icon-left"  onClick={() => setShowEmojiPicker(!showEmojiPicker)}></ion-icon>

      {/* Emoji Picker ở vị trí nổi, không nằm trong ChatInput */}
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <input
        type="text"
        placeholder="Start typing..."
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="chat-input-field"
      />

      <img src={mention} alt="" className='input-icon-right'/>
      <button onClick={handleSend} className="send-btn">
        <i className="bi bi-send"></i>
      </button>
    </div>
  );
});

export default ChatInput;
