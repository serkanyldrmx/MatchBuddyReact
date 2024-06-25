import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { UserOutlined } from "@ant-design/icons";
import Button from '@mui/material/Button';
import axios from 'axios';
import Navbar from "../Navbar/Navbar";

const TeamsListContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: '20px',
});

const ContentContainer = styled('div')({
  marginTop: '70px',  // Navbar'ın yüksekliği kadar boşluk bırakın
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
});

const Team = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5033/api/Team/GetTeamList")
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <ContentContainer>
        <Button variant="contained" color="primary" component={Link} to="/create-team">
          Takım Oluştur
        </Button>
        <TeamsListContainer>
          {teams.map((team) => (
            <Card key={team.teamId} className="teamCard" sx={{ margin: '20px', width: '300px', backgroundColor: '#3cc1b8' }}>
              <CardHeader
                avatar={
                  <Avatar>
                    <UserOutlined />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {team.teamName}
                  </Typography>
                }
              />
            </Card>
          ))}
        </TeamsListContainer>
      </ContentContainer>
    </div>
  );
}

export default Team;
