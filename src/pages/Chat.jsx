import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Button } from 'react-bootstrap'; // Import các component từ React Bootstrap
import ChatList from '../components/Chat/ChatList';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatInput from '../components/Chat/ChatInput';
import '../assets/css/Chat/Chat.css';
import RequestDetails from '../components/Chat/RequestDetails';
import createContractLogo from '../assets/images/createContractLogo.png'

function Chat() {
  const [activeChat, setActiveChat] = useState(() => {
    return localStorage.getItem('activeChat') ? parseInt(localStorage.getItem('activeChat')) : 0;
  });

  const [activeRequest, setActiveRequest] = useState(() => {
    return localStorage.getItem('activeRequest') ? parseInt(localStorage.getItem('activeRequest')) : 0;
  });

  const [activeTab, setActiveTab] = useState('chat');
  const [selectedRequest, setSelectedRequest] = useState(() => {
    const savedRequest = localStorage.getItem('selectedRequest');
    return savedRequest ? JSON.parse(savedRequest) : null;
  });

  const [selectedChat, setSelectedChat] = useState(() => {
    const savedChat = localStorage.getItem('selectedChat');
    return savedChat ? JSON.parse(savedChat) : null;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const userName = 'Tran Duy Nhon'; // Tên người dùng

  // Thêm ref để cuộn tin nhắn
  const messagesEndRef = useRef(null);

  // Offcanvas state (ẩn/hiện sidebar)
  const [showSidebar, setShowSidebar] = useState(false);

  // Hàm mở/đóng sidebar
  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  // Hàm để cuộn xuống cuối cùng
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Gọi hàm này khi danh sách tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Dữ liệu mẫu cho danh sách chat
  const chats = [
    {
      id: 0,
      name: 'Alice',
      avatar: 'https://via.placeholder.com/50',
      lastMessage: 'Task FE tới đâu rồi nào?',
      timestamp: '24/9/2024',
      messages: [
        { sender: 'Alice', text: 'Task FE tới đâu rồi nào?', time: '8:00 PM' },
        { sender: 'Tran Duy Nhon', text: 'Chưa xong fen ơi', time: '8:05 PM' }
      ]
    },
    {
      id: 1,
      name: 'Tran Hai Dang',
      avatar: 'https://via.placeholder.com/50',
      lastMessage: 'Lịch trình tối nay như thế nào?',
      timestamp: '24/9/2024',
      messages: [
        { sender: 'Tran Hai Dang', text: 'Lịch trình tối nay như thế nào?', time: '8:00 PM' },
        { sender: 'Tran Duy Nhon', text: 'Không biết fen ơi', time: '8:05 PM' }
      ]
    },
  ];

  const requests = [
    {
      id: 0,
      name: 'Alice',
      avatar: 'https://via.placeholder.com/50',
      location: 'Quang Nam, Vietnam',
      job: 'Engineer',
      bio: 'Loves traveling',
      hobbies: ['Reading', 'Hiking', 'Swimming'],
      timestamp: '24/9/2024'
    },
    {
      id: 1,
      name: 'Tran Duy Nhon',
      avatar: 'https://via.placeholder.com/50',
      location: 'Quang Nam, Vietnam',
      job: 'Engineer',
      bio: 'Loves traveling',
      hobbies: ['Reading', 'Hiking', 'Swimming'],
      timestamp: '24/9/2024'
    },
  ];

  const handleChatClick = (chatId) => {
    const selectedChat = chats.find(chat => chat.id === chatId);
    setActiveChat(chatId);
    setSelectedChat(selectedChat);
    handleSidebarClose(); // Đóng sidebar khi chọn chat trên mobile
  };

  const handleRequestClick = (requestId) => {
    const selectedRequest = requests.find((r) => r.id === requestId);
    setSelectedRequest(selectedRequest);
    setActiveRequest(requestId);
    handleSidebarClose(); // Đóng sidebar khi chọn request trên mobile
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem('activeChat', activeChat);
    localStorage.setItem('selectedChat', JSON.stringify(selectedChat));
  }, [activeChat, selectedChat]);

  useEffect(() => {
    localStorage.setItem('activeRequest', activeRequest);
    localStorage.setItem('selectedRequest', JSON.stringify(selectedRequest));
  }, [activeRequest, selectedRequest]);

  const handleSendMessage = (message) => {
    if (selectedChat) {
      const newMessage = {
        sender: userName,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage]
      };

      setSelectedChat(updatedChat);
    }
  };

  // Hàm giả lập nhận tin nhắn sau khoảng thời gian
  useEffect(() => {
    if (selectedChat) {
      const receiveMessage = () => {
        const newMessage = {
          sender: selectedChat.name, // Giả lập tin nhắn đến từ người khác
          text: 'Chat tự động tạo từ ' + selectedChat.name,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedChat = {
          ...selectedChat,
          messages: [...selectedChat.messages, newMessage]
        };

        setSelectedChat(updatedChat);
      };

      const intervalId = setInterval(receiveMessage, 60000);

      // Hủy bỏ interval khi component unmount hoặc khi chat thay đổi
      return () => clearInterval(intervalId);
    }
  }, [selectedChat]);

  const chatHeaderName =
    activeTab === 'chat'
      ? selectedChat?.name
      : selectedRequest
        ? selectedRequest.name
        : '';

  return (
    <div className="chat-container mx-lg-2 gap-lg-4">

      <div className='create-contract d-flex flex-column align-items-center'>
        <h5>Hợp đồng</h5>
        <img src={createContractLogo} alt="" width={180}/>
        <p>Hiện tại chưa có hợp đồng nào</p>
        <p>Hãy tạo hợp đồng để bắt đầu chuyến đi</p>
        <Button variant='success' className='rounded-5'>Tạo hợp đồng</Button>
      </div>

      <div className="chat-main">
        {/* Chat Header có thêm nút Offcanvas */}
        <div className="chat-header">
          <ChatHeader chatName={chatHeaderName} />

          {/* Nút mở sidebar cho mobile trong header */}
          <Button className="d-md-none" onClick={handleSidebarShow}>
            <i className="bi bi-list"></i>
          </Button>
        </div>

        {activeTab === 'chat' ? (
          <>
            <div className="chat-messages">
              {selectedChat?.messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  sender={message.sender}
                  text={message.text}
                  time={message.time}
                  isSentByUser={message.sender === userName}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : selectedRequest ? (
          <div className='p-3'><RequestDetails request={selectedRequest} /></div>
        ) : (
          <div className="no-request-selected">Select a request to view details</div>
        )}
      </div>

      {/* Offcanvas sidebar cho mobile */}
      <Offcanvas show={showSidebar} onHide={handleSidebarClose} className="d-md-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="chat-sidebar">
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="tab-buttons">
              <button
                className={activeTab === 'chat' ? 'active' : ''}
                onClick={() => handleTabClick('chat')}
              >
                Chat
              </button>
              <button
                className={activeTab === 'request' ? 'active' : ''}
                onClick={() => handleTabClick('request')}
              >
                Request
              </button>
            </div>

            {activeTab === 'chat' ? (
              <ChatList
                chats={filteredChats}
                activeChat={activeChat}
                onChatClick={handleChatClick}
              />
            ) : (
              <ChatList
                chats={filteredRequests}
                activeChat={activeRequest}
                onChatClick={handleRequestClick}
              />
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="chat-sidebar d-none d-md-block">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar px-4"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="tab-buttons p-2">
          <button
            className={activeTab === 'chat' ? 'active' : ''}
            onClick={() => handleTabClick('chat')}
          >
            Chat
          </button>
          <button
            className={activeTab === 'request' ? 'active' : ''}
            onClick={() => handleTabClick('request')}
          >
            Request
          </button>
        </div>

        {activeTab === 'chat' ? (
          <ChatList
            chats={filteredChats}
            activeChat={activeChat}
            onChatClick={handleChatClick}
          />
        ) : (
          <ChatList
            chats={filteredRequests}
            activeChat={activeRequest}
            onChatClick={handleRequestClick}
          />
        )}
      </div>

    </div>
  );
}

export default Chat;
