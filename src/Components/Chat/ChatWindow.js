import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import './ChatWindow.css';

function ChatWindow({ currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const messageData = {
        matchMessage: newMessage,
        sendingDate: new Date().toISOString(),
        status: 1,
        sendPlayerId: currentUser.playerId,
        recipientPlayerId: selectedUser.playerId,
      };

      try {
        const response = await axios.post("http://localhost:5033/api/Message/GetMessageById", {
          sendPlayerId: currentUser.playerId,
          recipientPlayerId: selectedUser.playerId,
        });
        const data = response.data;
        if (!data || data.length === 0) {
          setMessages([]);
          return;
        }
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser && selectedUser) {
      fetchMessages();
    }
  }, [currentUser, selectedUser, newMessage]);

  const handleSendMessage = async () => {
    const messageData = {
      matchMessage: newMessage,
      sendingDate: new Date().toISOString(),
      status: 1,
      sendPlayerId: currentUser.playerId,
      recipientPlayerId: selectedUser.playerId,
    };

    try {
      const response = await axios.post('http://localhost:5033/api/Message/MessageSave', messageData);
      const data = response.data;
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };

  if (!currentUser || !selectedUser) {
    return (
      <div className="chat-window">
        <Navbar />
        <div className="messages">
          Kullanıcı bilgileri eksik. Lütfen tekrar giriş yapınız.
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <Navbar />
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sendPlayerId === currentUser.playerId ? 'message current' : 'message'}>
            <p>{msg.matchMessage}</p>
            <span>{msg.sendPlayerId === currentUser.playerId ? 'Ben' : selectedUser.name}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <button onClick={handleSendMessage}>Gönder</button>
      </div>
    </div>
  );
}

export default ChatWindow;
