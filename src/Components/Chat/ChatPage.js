// src/Components/Chat/ChatPage.js

import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { useLocation } from 'react-router-dom';
import './ChatPage.css';
import Navbar from '../Navbar/Navbar';
import UserList from './UserList';
import GroupMessages from './GroupMessages'; // GroupMessages Bileşenini Dahil Et

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user"))); // Mevcut kullanıcıyı alıyoruz
  }, []);

  useEffect(() => {
    fetch('http://localhost:5033/api/Players/GetPlayerList')
      .then(response => response.json())
      .then(data => {
        console.log("User list fetched:", data);
        setUsers(data);
      })
      .catch(error => console.error('Error fetching user list:', error));
  }, []);

  const handleUserClick = (user) => {
    console.log("Selected user:", user);
    setSelectedUser(user);
  };

  return (
    <div>
      <Navbar />
      <div className="chat-container">
        {/* User List Bileşenini Sol Tarafa Yerleştirelim */}
        <div className="user-list-container">
          <UserList users={users} onSelectUser={handleUserClick} />
        </div>

        <div className="chat-window-container">
          {selectedUser ? (
            <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
          ) : (
            <div className="select-user-message">Bir kullanıcı seçin</div>
          )}
        </div>

        {/* Sağ Kısımda GroupMessages Bileşenini Yerleştirelim */}
        <div className="group-messages-container">
          <GroupMessages currentUser={currentUser} /> {/* Mevcut kullanıcıyı buraya gönderiyoruz */}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
