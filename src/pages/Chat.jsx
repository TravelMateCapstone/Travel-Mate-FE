import React, { useEffect, useState, useRef } from "react";
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const tokenWithoutBearer = token.replace(/^Bearer\s+/, '');
  const messagesEndRef = useRef(null);

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
        setConnection(connect);

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
          setMessages((prev) => [...prev, msg]);
          console.log('Tin nhắn', messages);
          
        });

        connect.send("GetChatUsers");
      })
      .catch((err) => console.error("Kết nối thất bại: ", err));

    return () => {
      connect.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (connection && selectedUser && message.trim()) {
      try {
        await connection.send("SendPrivate", selectedUser.id, message);
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
    <Container fluid style={{
      padding: '0 140px'
    }}>

      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>Người dùng</Card.Header>
            <ListGroup variant="flush">
              {chatUsers.map((user) => (
                <ListGroup.Item key={user.id} onClick={() => loadMessages(user)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img src={user.avatar} alt={user.fullName} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                    <div>
                      <div>{user.fullName}</div>
                      <div>{user.city}</div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              {selectedUser ? `Đang chat với ${selectedUser.fullName}` : "Chat"}
            </Card.Header>
            <Card.Body style={{ height: "300px", overflowY: "scroll" }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: msg.senderId === userInfo.id ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                  {msg.senderId !== userInfo.id && (
                    <img src={selectedUser.avatar} alt={selectedUser.fullName} style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "0.5rem" }} />
                  )}
                  <div>
                    {msg.content}
                  </div>
                 
                </div>
              ))}
              <div ref={messagesEndRef} />
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: "flex", alignItems: "center" }}>
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn của bạn..."
                  style={{ flex: 1, marginRight: "0.5rem" }}
                />
                <Button type="submit">Gửi</Button>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
