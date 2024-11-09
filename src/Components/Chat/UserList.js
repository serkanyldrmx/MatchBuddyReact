// src/Components/Chat/UserList.js

import React from 'react';
import { UserOutlined } from '@ant-design/icons';

function UserList({ users, onSelectUser }) {
  return (
    <div className="user-list">
      {/* Arkadaşlarım Başlığı - Tıklanamaz */}
      <div className="friends-title">Arkadaşlarım</div>
      
      {/* Kullanıcıları listeleme */}
      {users.map(user => (
        <div key={user.playerId} onClick={() => onSelectUser(user)}>
          <UserOutlined style={{ color: 'white' }} />
          {user.playerName} {user.playerSurname}
        </div>
      ))}
    </div>
  );
}

export default UserList;
