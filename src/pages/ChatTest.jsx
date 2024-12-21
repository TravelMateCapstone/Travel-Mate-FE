import React, { useEffect, useState } from "react";
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useSelector } from "react-redux";

const ChatApp = () => {
  const [connection, setConnection] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const tokenWithoutBearer = token.replace(/^Bearer\s+/, '');

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
        console.log("Connected to SignalR Hub");
        setConnection(connect);

        connect.on("getProfileInfo", (user) => {
          console.log("Received profile info:", user);
          setUserInfo(user);
        });

        connect.on("onError", (error) => {
          console.log("Received onError:", error);
        });


        connect.on("receiveChatUsers", (users) => {
          console.log("Received chat users:", users);
          setChatUsers(users);
        });

        connect.on("LoadMessages", (msgs) => {
          console.log("Received messages mới:", msgs);
          setMessages(msgs);
        });

        connect.on("receiveMessage", (msg) => {
          console.log('Received message', msg);
          setMessages((prev) => [...prev, msg]);
          console.log('Messages', messages);
          
        });

        connect.send("GetChatUsers");
      })
      .catch((err) => console.error("Connection failed: ", err));

    return () => {
      connect.stop();
    };
  }, []);

  // useEffect(() => {
  //   if (selectedUser) {
  //     loadMessages(selectedUser);
  //   }
  // }, [messages]);


  const sendMessage = async () => {
    if (connection && selectedUser && message.trim()) {
      try {
        await connection.send("SendPrivate", selectedUser.id, message);
        setMessage("");
        await loadMessages(selectedUser);
      } catch (err) {
        console.error("Error sending message: ", err);
      }
    }
  };

  const loadMessages = async (user) => {
    setSelectedUser(user);
    if (connection) {
      try {
        await connection.send("LoadMessages", userInfo.id, user.id);
      } catch (err) {
        console.error("Error loading messages: ", err);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {userInfo && (
        <div>
          <h2>Welcome, {userInfo.name}</h2>
        </div>
      )}

      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <h3>Users</h3>
          <ul>
            {chatUsers.map((user) => (
              <li key={user.id} onClick={() => loadMessages(user)} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src={user.avatar} alt={user.fullName} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                <div>
                  <div>{user.fullName}</div>
                  <div>{user.city}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Chat</h3>
          {selectedUser && <h4>Chatting with {selectedUser.fullName}</h4>}
          <div style={{ border: "1px solid #ccc", padding: "1rem", height: "300px", overflowY: "scroll" }}>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.senderId === userInfo.id ? "You" : selectedUser.fullName}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
