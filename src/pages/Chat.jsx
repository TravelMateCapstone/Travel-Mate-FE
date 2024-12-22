import React, { useEffect, useState, useRef } from "react";
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';
import { setChatConnection } from '../redux/actions/chatHubAction';

const Chat = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const tokenWithoutBearer = token.replace(/^Bearer\s+/, '');
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const connection = useSelector((state) => state.chatHub.connection);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://travelmateapp.azurewebsites.net/chatHub", {
        accessTokenFactory: () => tokenWithoutBearer,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();

    connect
      .start()
      .then(() => {
        console.log("Đã kết nối tới SignalR Hub");
        dispatch(setChatConnection(connect));

        connect.on("getProfileInfo", (user) => {
          console.log("Nhận thông tin hồ sơ:", user);
          setUserInfo(user);
        });

        connect.on("onError", (error) => {
          console.log("Nhận lỗi:", error);
        });

        connect.on("receiveChatUsers", (users) => {
          console.log("Nhận người dùng chat:", users);
          setChatUsers(users);
        });

        connect.on("LoadMessages", (msgs) => {
          console.log("Nhận tin nhắn mới:", msgs);
          setMessages(msgs);
        });

        connect.on("receiveMessage", (msg) => {
          console.log('Nhận tin nhắn', msg);
          
          setMessages((prev) => {
            if (msg.senderId === selectedUser.id || msg.receiverId === selectedUser.id) {
              return [...prev, msg];
            }
            return prev;
          });
          console.log('Tin nhắn', messages);
        });

        connect.send("GetChatUsers");
      })
      .catch((err) => console.error("Kết nối thất bại: ", err));

    return () => {
      connect.stop();
    };
  }, [dispatch, tokenWithoutBearer]);

  const sendMessage = async () => {
    if (connection && selectedUser && message.trim()) {
      try {
        const response = await connection.send("SendPrivate", selectedUser.id, message);
        setMessage("");
        await loadMessages(selectedUser);
      } catch (err) {
        console.error("Lỗi khi gửi tin nhắn: ", err);
      }
    }
  };

  const loadMessages = async (user) => {
    setSelectedUser(user);
    if (connection) {
      try {
        await connection.send("LoadMessages", userInfo.id, user.id);
      } catch (err) {
        console.error("Lỗi khi tải tin nhắn: ", err);
      }
    }
  };

  return (
    <Container fluid style={{ padding: '0 140px', height: '80vh' }}>
      <Row style={{ height: '100%' }}>
        <Col md={3} style={{ height: '100%' }}>
          <Card style={{ height: '100%' }}>
            <Card.Header>
              <h4 className="fw-bold text-center">Tin nhắn ({chatUsers.length})</h4>
            </Card.Header>
            <ListGroup variant="flush" style={{ overflowY: 'auto', height: 'calc(100% - 56px)' }}>
              {chatUsers.map((user) => (
                <ListGroup.Item key={user.id} onClick={() => loadMessages(user)} style={{ cursor: "pointer", padding: "10px 25px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img src={user.avatar} alt={user.fullName} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                    <div>
                      <small className="fw-bold">{user.fullName}</small>
                      <p className="m-0">{user.city}</p>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={9} style={{ height: '100%' }}>
          <Card style={{ height: '100%' }}>
            <Card.Header className="bg-white py-3">
              {selectedUser ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src={selectedUser.avatar} alt={selectedUser.fullName} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                  <div>
                    <h6>{selectedUser.fullName}</h6>
                    <small className="m-0">{selectedUser.city}</small>
                  </div>
                </div>
              ) : "Chat"}
            </Card.Header>
            <Card.Body style={{ height: 'calc(100% - 112px)', overflowY: 'scroll' }}>
            {messages.map((msg, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: msg.senderId === userInfo.id ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                  {msg.senderId !== userInfo.id && (
                    <img src={selectedUser.avatar} alt={selectedUser.fullName} style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "0.5rem" }} />
                  )}
                  <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: msg.senderId === userInfo.id ? "#34A853" : "#f1f1f1", color: msg.senderId === userInfo.id ? "#fff" : "#000" }}>
                    {msg.content}
                  </div>
                  {msg.senderId === userInfo.id && (
                    <img src={userInfo.avatar} alt={userInfo.fullName} style={{ width: "30px", height: "30px", borderRadius: "50%", marginLeft: "0.5rem" }} />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </Card.Body>
            <Card.Footer className="bg-white border-0 px-5">
              <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: "flex", alignItems: "center" }}>
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn của bạn..."
                  style={{ flex: 1, marginRight: "0.5rem" }}
                />
                <Button type="submit" style={{
                  backgroundColor: '#34A853',
                  border: 'none',
                  color: 'white',
                  padding: '0.8rem 1rem',
                }} className="d-flex justify-content-center align-items-center"><ion-icon name="send" style={{
                  fontSize: '1.5rem',
                }}></ion-icon></Button>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
