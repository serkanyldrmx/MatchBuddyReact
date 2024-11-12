// src/Components/Chat/ChatPage.js

import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { useLocation } from 'react-router-dom';
import './ChatPage.css';
import Navbar from '../Navbar/Navbar';
import UserList from './UserList';
import GroupMessages from './GroupMessages';

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // Seçilen grup
  const [currentUser, setCurrentUser] = useState(null); // Current user bilgisi

  useEffect(() => {
    // Mevcut kullanıcıyı localStorage'dan al
    setCurrentUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    // Kullanıcı listesi API'den alınır
    fetch('http://localhost:5033/api/Players/GetPlayerList')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user list:', error));
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null); // Grup seçimini temizle
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null); // Kullanıcı seçimini temizle
  };

  return (
    <div className="chat-page">
      {/* Navbar (Opsiyonel) */}
      <Navbar />

      <div className="chat-container">
        {/* Kullanıcı Listesi */}
        <div className="user-list-container">
          <UserList users={users} onSelectUser={handleUserClick} />
        </div>

        {/* ChatWindow - Seçilen kullanıcı veya grup için mesajlar */}
        <div className="chat-window-container">
          {selectedUser ? (
            // Bireysel sohbet
            <ChatWindow currentUser={currentUser} selectedUser={selectedUser} selectedGroup={null} />
          ) : selectedGroup ? (
            // Grup sohbeti
            <ChatWindow currentUser={currentUser} selectedUser={null} selectedGroup={selectedGroup} />
          ) : (
            <div className="select-user-message">Bir kullanıcı veya grup seçin</div>
          )}
        </div>

        {/* Grup Mesajları */}
        <div className="group-messages-container">
          <GroupMessages currentUser={currentUser} onSelectGroup={handleGroupClick} />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
