import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './ChatWindow.css';

function ChatWindow({ currentUser, selectedUser, selectedGroup }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Mesajları çekme işlemi
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedUser) {
          const response = await axios.post('http://localhost:5033/api/Message/GetMessageById', {
            sendPlayerId: currentUser.playerId,
            recipientPlayerId: selectedUser.playerId,
          });
          setMessages(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } else if (selectedGroup) {
          const response = await axios.post('http://localhost:5033/api/GroupsMessage/GetGroupMessageById', {
            groupId: selectedGroup.groupId,
            SendPlayerId: currentUser.playerId,
          });
          setMessages(response.data.sort((a, b) => new Date(a.sendingDate) - new Date(b.sendingDate)));
        }
      } catch (err) {
        console.error('Mesajlar çekilirken hata oluştu:', err);
      }
    };
    fetchMessages();
  }, [currentUser, selectedUser, selectedGroup]);

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
    if (newMessage.trim() === '') return;

    let messageData;
    let url;

    if (selectedUser) {
      // Bire bir mesajlaşma için
      messageData = {
        matchMessage: newMessage,
        sendingDate: new Date().toISOString(),
        status: 1,
        sendPlayerId: currentUser.playerId,
        recipientPlayerId: selectedUser.playerId,
      };
      url = 'http://localhost:5033/api/Message/MessageSave';
    } else if (selectedGroup) {
      // Grup mesajlaşması için
      messageData = {
        groupId: selectedGroup.groupId,
        matchMessage: newMessage,
        sendingDate: new Date().toISOString(),
        sendPlayerId: currentUser.playerId,
        status: 0,
      };
      url = 'http://localhost:5033/api/GroupsMessage/SaveGroupMessage';
    }

    try {
      // UI'ya yeni mesajı anında ekleyelim
      const newMsg = {
        ...messageData,
        sendingDate: new Date().toISOString(), // Güncel tarih ekleyelim
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      // Backend'e mesajı gönderelim
      const response = await axios.post(url, messageData);

      // Backend'den gelen veriyi kontrol edelim
      if (response.data && response.data.matchMessage) {
        // Mesaj başarıyla gönderildi, backend'den gelen mesajı ekleyelim
        setMessages((prevMessages) => [...prevMessages, response.data]);
      } else {
        console.error('Backend’den beklenen veri alınamadı', response.data);
      }

      // Mesaj gönderildikten sonra input alanını temizleyelim
      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };

  // Scroll pozisyonu kontrolü
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsAutoScroll(scrollTop + clientHeight === scrollHeight);
  };

  // Kullanıcıya göre mesaj kutucuğu rengini almak için fonksiyon
  // Kullanıcıya göre mesaj kutucuğu rengini almak için fonksiyon
const getMessageBackgroundColor = (sendPlayerId) => {
  console.log(`Message sendPlayerId: ${sendPlayerId}, currentUserId: ${currentUser.playerId}`);

  // ID'nin modül işlemi ile belirli sayıda renge göre döngü yapalım
  const colors = [
    '#9bf854', // Kendi mesajlarımız için yeşil
    '#a6c7f5', // 2. kullanıcı için mavi
    '#f5a6a6', // 3. kullanıcı için kırmızı
    '#c6f5a6', // 4. kullanıcı için açık yeşil
    '#f1c40f', // 5. kullanıcı için sarı
    '#e74c3c', // 6. kullanıcı için kırmızı
    '#8e44ad', // 7. kullanıcı için mor
    '#3498db', // 8. kullanıcı için mavi
    '#2ecc71', // 9. kullanıcı için yeşil
    '#9b59b6', // 10. kullanıcı için mor
  ];

  // Modül işlemi ile ID'yi 10'a böleriz ve kalan değere göre renk seçeriz
  const colorIndex = sendPlayerId % colors.length;

  return colors[colorIndex];
};
  

return (
  <div className="chat-window">
    <div className="messages" onScroll={handleScroll}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sendPlayerId === currentUser.playerId ? 'current' : 'other'}`}
          style={{ backgroundColor: getMessageBackgroundColor(msg.sendPlayerId) }}
        >
          <p>{msg.matchMessage}</p>
          <span>
            {msg.sendPlayerId === currentUser.playerId
              ? 'Ben'
              : selectedUser
              ? `${selectedUser.playerName} ${selectedUser.playerSurname}`
              : `Grup üyesi ${msg.userName}`}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
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
