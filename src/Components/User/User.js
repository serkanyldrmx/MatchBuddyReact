import React, { useEffect, useState } from "react";
import { Card, Avatar, List, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./User.css";
import Navbar from "../Navbar/Navbar";
import { useParams } from 'react-router-dom';

const { Meta } = Card;
const { Text } = Typography;

function User() {
  const { userId } = useParams(); // userId'yi al
  const [player, setPlayer] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerById = async () => {
      try {
        const response = await fetch(`http://localhost:5033/api/Players/GetPlayerById?userId=${userId}`);
        if (!response.ok) {
          throw new Error('API isteğinde bir hata oluştu');
        }
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPlayerById();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  if (!player) {
    return <div>Kullanıcı bulunamadı.</div>;
  }

  const labelStyle = { color: "#ffffff", marginRight: '5px', fontWeight: 'bold' };
  const valueStyle = { color: "#ffffff" };

  const userDetails = [
    { label: "Ad", value: player.playerName },
    { label: "Soyad", value: player.playerSurname },
    { label: "Kullanıcı Adı", value: player.userName },
    { label: "E-posta", value: player.email },
    { label: "Telefon Numarası", value: player.phoneNumber },
    { label: "Adres", value: player.address },
    { label: "Boy", value: player.size },
    { label: "Kilo", value: player.weight },
    { label: "Yaş", value: player.age },
    { label: "Maç Bildirimi İzin", value: player.matchNotificationPermission },
    { label: "Kullanıcı Puanı", value: player.userScore },
  ];

  return (
    <div className="user" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: '20px', backgroundColor: "#f0f2f5" }}>
      <Navbar />
      <Card className="card" style={{ width: 340, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0" }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: "20px" }} />
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#ffffff' }}>Kullanıcı Bilgileri</Text>
          <List
            itemLayout="horizontal"
            dataSource={userDetails}
            renderItem={item => (
              <List.Item style={{ marginBottom: "10px" }}>
                <Text style={labelStyle}>{item.label}: </Text>
                <Text style={valueStyle}>{item.value}</Text>
              </List.Item>
            )}
          />
        </div>
      </Card>
    </div>
  );
}

export default User;
