import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import axios from 'axios';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Navbar from "../Navbar/Navbar";
import './Stadium.css';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const RootContainer = styled('div')({
  flexGrow: 1,
});

const MenuButton = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Title = styled('div')({
  flexGrow: 1,
  textAlign: 'left',
});

function Stadium() {
  const [expanded, setExpanded] = useState(false);
  const [stadiums, setStadiums] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5033/api/Stadium/GetStadiumList")
        .then(res => res.json())
        .then(
            (result) => {
                setStadiums(result);
            },
            (error) => {
                console.log(error);
            }
        )
}, [])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div>
      <Navbar />
      <div className="stadiumPostContainer">
        {stadiums.map((stadium) => (
          <Card key={stadium.stadiumId} className="stadiumCard" sx={{ margin: '20px', width: '500px', backgroundColor: '#c13c5b' }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="stadium">
                  {stadium.stadiumName[0]}
                </Avatar>
              }
              title={
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {"Stadyum Adı: " + stadium.stadiumName}
                </Typography>
              }
              subheader={
                <div>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    {"Şehir: " + stadium.city}
                  </Typography>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    {"İlçe: " + stadium.district}
                  </Typography>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                    {"Konum: " + stadium.location}
                  </Typography>
                </div>
              }
            />
            
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Stadium;
