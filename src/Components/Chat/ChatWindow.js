import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './ChatWindow.css';

function ChatWindow({ currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]); // Mesajları tutmak için state
  const [newMessage, setNewMessage] = useState(''); // Yeni mesaj state
  const messagesEndRef = useRef(null); // Scroll işlemi için referans
  const [isAutoScroll, setIsAutoScroll] = useState(true); // Otomatik kaydırma kontrolü

  // Mesajları çekme işlemi
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && selectedUser) {
        try {
          const response = await axios.post('http://localhost:5033/api/Message/GetMessageById', {
            sendPlayerId: currentUser.playerId,
            recipientPlayerId: selectedUser.playerId,
          });
          const data = response.data;
          setMessages(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } catch (err) {
          console.error('Mesajlar çekilirken hata oluştu:', err);
        }
      }
    };
    fetchMessages();
  }, [currentUser, selectedUser]);

  // Otomatik kaydırma işlemi
  const scrollToBottom = useCallback(() => {
    if (isAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAutoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mesaj gönderme işlemi
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return; // Boş mesaj gönderimini engelle

    const messageData = {
      matchMessage: newMessage,
      sendingDate: new Date().toISOString(),
      status: 1,
      sendPlayerId: currentUser.playerId,
      recipientPlayerId: selectedUser.playerId,
    };

    try {
      const response = await axios.post('http://localhost:5033/api/Message/MessageSave', messageData);
      setMessages([...messages, response.data]); // Yeni mesajı mesaj listesine ekle
      setNewMessage(''); // Mesaj kutusunu temizle
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };

  // Scroll pozisyonu kontrolü
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsAutoScroll(scrollTop + clientHeight === scrollHeight);
  };

  if (!currentUser || !selectedUser) {
    return <div>Kullanıcı bilgileri eksik. Lütfen tekrar giriş yapınız.</div>;
  }

  return (
    <div className="chat-window">
      <div className="messages" onScroll={handleScroll}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sendPlayerId === currentUser.playerId ? 'current' : 'other'}`}>
            <p>{msg.matchMessage}</p>
            <span>{msg.sendPlayerId === currentUser.playerId ? 'Ben' : `${selectedUser.playerName} ${selectedUser.playerSurname}`}</span>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* En son mesaja kaydırmak için referans */}
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
