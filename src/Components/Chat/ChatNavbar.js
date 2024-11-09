import React from 'react';
import { Link } from 'react-router-dom';
import './ChatNavbar.css';

function ChatNavbar({ selectedUser }) {
  return (
    <div className="chat-navbar">
      <h2>
        {selectedUser
          ? `${selectedUser.playerName} ${selectedUser.playerSurname}`
          : "Kullanıcı Seçili Değil"}
      </h2>
      {selectedUser && (
        <Link to={`/user/${selectedUser.id}`} className="user-info-button">
          Kişi Bilgisi
        </Link>
      )}
    </div>
  );
}

export default ChatNavbar;
