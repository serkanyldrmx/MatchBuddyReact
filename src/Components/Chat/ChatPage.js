import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { useLocation } from 'react-router-dom';
import './ChatPage.css';

function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5033/api/Players/GetPlayerList')
      .then(response => response.json())
      .then(data => {
        console.log("User list fetched:", data); // Gelen kullanıcıları kontrol edelim
        setUsers(data);
      })
      .catch(error => console.error('Error fetching user list:', error));
  }, []);

  const handleUserClick = (user) => {
    console.log("Selected user:", user); // Seçilen kullanıcıyı kontrol edelim
    setSelectedUser(user);
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        {users.map(user => (
          <div key={user.playerId} onClick={() => handleUserClick(user)}>
            {user.playerName} {user.playerSurname}
          </div>
        ))}
      </div>
      <div className="chat-window-container">
        {selectedUser ? (
          <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
        ) : (
          <div className="select-user-message">Bir kullanıcı seçin</div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
