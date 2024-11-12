import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, Typography, Button, Avatar, Container, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { red, blue } from "@mui/material/colors";
import { message } from "antd";
import Navbar from "../Navbar/Navbar";
import "./MatchDetails.css";

function MatchDetails() {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5033/api/Match/GetMatchById?matchId=${matchId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setMatchInfo(result);
        },
        (error) => {
          setError(error);
        }
      );

    fetch(`http://localhost:5033/api/Match/GetMatchTeamInfo?matchId=${matchId}`)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.length < 2) {
            addTeam(6, matchId);
          } else {
            setMatchDetails(result);
            setIsLoaded(true);
          }
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );

    fetch("http://localhost:5033/api/Team/GetTeamList")
      .then(res => res.json())
      .then(
        (result) => {
          const teamsWithPlayerCount = result.map(team => ({
            ...team,
            playerCount: team.playerName.length
          }));
          setTeams(teamsWithPlayerCount);
        },
        (error) => {
          setError(error);
        }
      );
  }, [matchId]);

  const addTeam = (teamId, matchId) => {
    fetch("http://localhost:5033/api/Match/SaveMatchTeam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ teamId, matchId })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Yeni takım eklendi:", data);
        refreshTeamInfo();
      })
      .catch(error => {
        setError(error);
        setIsLoaded(true);
      });
  };

  const refreshTeamInfo = () => {
    fetch(`http://localhost:5033/api/Match/GetMatchTeamInfo?matchId=${matchId}`)
      .then(res => res.json())
      .then(result => {
        setMatchDetails(result);
        setIsLoaded(true);
      })
      .catch(error => {
        setError(error);
        setIsLoaded(true);
      });
  };

  const handleJoinMatch = () => {
    message.success("Maça Katıldınız");
  };

  const handleTeamSelect = () => {
    if (team1 && team2) {
      saveSelectedTeams(team1, team2);
    } else {
      message.error("Lütfen iki takım seçin!");
    }
  };

  const saveSelectedTeams = (team1Id, team2Id) => {
    const saveTeam1 = fetch("http://localhost:5033/api/Match/SaveMatchTeam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ teamId: team1Id, matchId })
    });

    const saveTeam2 = fetch("http://localhost:5033/api/Match/SaveMatchTeam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ teamId: team2Id, matchId })
    });

    Promise.all([saveTeam1, saveTeam2])
      .then(() => {
        message.success("Takımlar başarıyla eklendi");
        refreshTeamInfo();
      })
      .catch((error) => {
        setError(error);
        message.error("Takımlar eklenirken bir hata oluştu.");
      });
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  const requiredPlayerCount = Math.ceil(matchInfo?.userCount / 2);

  return (
    <Container fixed className="container-detail">
      <Navbar />
      <div className="match-info">
        {error && <Typography variant="body1" color="error">Error: {error.message}</Typography>}
        {isLoaded ? (
          <>
            {matchDetails && (
              <Card className="match-card">
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {matchDetails[0]?.teamName.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={"Maç Adı: " + (matchInfo?.matchName || "Bilinmiyor")}
                  subheader={
                    <div>
                      <div>{"Maç Tarihi: " + (formatDateTime(matchInfo?.matchDate)?.formattedDate || "Bilinmiyor")}</div>
                      <div>{"Maç Saati: " + (formatDateTime(matchInfo?.matchDate)?.formattedTime || "Bilinmiyor")}</div>
                      <div>{"Katılımcı Sayısı: " + (matchInfo?.userCount || 0)}</div>
                    </div>
                  }
                />
                <Grid container spacing={2} className="team-section">
                  {matchDetails.map((team, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card className="team-card">
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: index % 2 === 0 ? red[500] : blue[500] }} aria-label="team">
                              {team.teamName.charAt(0)}
                            </Avatar>
                          }
                          title={team.userName}
                          subheader={`Oyuncu Puanı: ${team.userScore}`}
                        />
                        <CardContent>
                          <Typography variant="body1">
                            {`${team.playerName} ${team.playerSurname} - Takımı: ${team.teamName}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            )}

            {(matchDetails && matchDetails.length < 2) && (
              <div className="team-selection">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="team1-label">Takım 1</InputLabel>
                      <Select
                        labelId="team1-label"
                        id="team1"
                        value={team1}
                        label="Takım 1"
                        onChange={(e) => {
                          const selectedTeam = teams.find(team => team.teamId === e.target.value);
                          if (selectedTeam.playerCount > requiredPlayerCount) {
                            message.error("Bu takım oyuncu sayısının yarısından fazla olduğu için seçilemez!");
                          } else {
                            setTeam1(e.target.value);
                          }
                        }}
                      >
                        {teams.map((team) => (
                          <MenuItem key={team.teamId} value={team.teamId}>
                            {team.teamName} ({team.playerCount} oyuncu)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="team2-label">Takım 2</InputLabel>
                      <Select
                        labelId="team2-label"
                        id="team2"
                        value={team2}
                        label="Takım 2"
                        onChange={(e) => {
                          const selectedTeam = teams.find(team => team.teamId === e.target.value);
                          if (selectedTeam.playerCount > requiredPlayerCount) {
                            message.error("Bu takım oyuncu sayısının yarısından fazla olduğu için seçilemez!");
                          } else {
                            setTeam2(e.target.value);
                          }
                        }}
                      >
                        {teams
                          .filter((team) => team.teamId !== team1)
                          .map((team) => (
                            <MenuItem key={team.teamId} value={team.teamId}>
                              {team.teamName} ({team.playerCount} oyuncu)
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  onClick={handleTeamSelect}
                  style={{
                    backgroundColor: "#DB9A00",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginTop: "1rem",
                    textTransform: "none"
                  }}
                >
                  Takımları Ekle
                </Button>
              </div>
            )}
          </>
        ) : (
          <Typography variant="body1">Yükleniyor...</Typography>
        )}
      </div>
    </Container>
  );
}

export default MatchDetails;
