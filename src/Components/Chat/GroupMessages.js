import React, { useState, useEffect } from 'react';
import './GroupMessages.css';

function GroupMessages({ currentUser }) {
  const [activeTab, setActiveTab] = useState('group-messages');
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [searchName, setSearchName] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Grup listesini API'den çekmek için yardımcı fonksiyon
  const fetchGroups = () => {
    fetch('http://localhost:5033/api/Groups/GetGroupList')
      .then(response => response.json())
      .then(data => setGroups(data))
      .catch(error => console.error('Error fetching groups:', error));
  };

  useEffect(() => {
    fetchGroups();

    fetch('http://localhost:5033/api/Players/GetPlayerList')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(error => console.error('Error fetching players:', error));
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handlePlayerSelection = (playerId) => {
    setSelectedPlayers(prevSelected => 
      prevSelected.includes(playerId)
        ? prevSelected.filter(id => id !== playerId) 
        : [...prevSelected, playerId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      setErrorMessage("Grup ismi boş olamaz.");
      setSuccessMessage('');
      return;
    }

    if (selectedPlayers.length < 1) {
      setErrorMessage("En az bir kullanıcı seçmelisiniz.");
      setSuccessMessage('');
      return;
    }

    const newGroup = {
      groupName,
      playerList: selectedPlayers,
    };

    fetch('http://localhost:5033/api/Groups/SaveGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    })
      .then(response => {
        if (response.ok) {
          setSuccessMessage("Grup başarıyla oluşturuldu.");
          setErrorMessage('');
          setGroupName('');
          setSelectedPlayers([]);
          fetchGroups(); // Yeni grubu listeye eklemek için grup listesini yeniden yükler
        } else {
          throw new Error("Grup oluşturulamadı.");
        }
      })
      .catch(error => {
        setErrorMessage(error.message || "Bir hata oluştu.");
        setSuccessMessage('');
      });
  };

  return (
    <div className="group-messages-container">
      <div className="group-messages-header">
        <button
          className={`tab-button ${activeTab === 'group-messages' ? 'active' : ''}`}
          onClick={() => handleTabChange('group-messages')}
        >
          Grup Mesajları
        </button>
        <button
          className={`tab-button ${activeTab === 'group-create' ? 'active' : ''}`}
          onClick={() => handleTabChange('group-create')}
        >
          Grup Oluştur
        </button>
      </div>

      <div className="group-messages-content">
        {activeTab === 'group-messages' ? (
          <div className="messages-section active">
            <h3>Grup Mesajları</h3>
            <div className="group-list">
              {groups.length > 0 ? (
                groups.map(group => (
                  <div key={group.groupId} className="group-item">
                    <h4>
                      <i className="fas fa-users group-icon"></i> {group.groupName}
                    </h4>
                    <p>Mesajlar: {group.groupMessages ? group.groupMessages.length : 0}</p>
                    <p>Oyuncular: {group.groupPlayers ? group.groupPlayers.length : 0}</p>
                  </div>
                ))
              ) : (
                <p>Henüz grup bulunmamaktadır.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="group-create-section active">
            <h3>Grup Oluştur</h3>
            <div className="group-create-form">
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}

              <input
                type="text"
                placeholder="Grup Adı"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Arkadaş Arayın"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />

        <div className="player-list">
        <div className="player-list-scroll">
            {players
            .filter(player => 
                player.playerName.toLowerCase().includes(searchName.toLowerCase()) ||
                player.playerSurname.toLowerCase().includes(searchName.toLowerCase())
            )
            .map((player) => (
                <div key={player.playerId} className="player-item">
                <label>
                    <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player.playerId)}
                    onChange={() => handlePlayerSelection(player.playerId)}
                    />
                    {player.playerName} {player.playerSurname}
                </label>
                </div>
            ))}
        </div>
        </div>

              <button onClick={handleCreateGroup}>Grup Oluştur</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupMessages;
