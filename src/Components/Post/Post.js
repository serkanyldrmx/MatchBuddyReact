import React, { useEffect, useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import "./Post.css";
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import { message } from "antd";
import Container from '@mui/material/Container';
import Comment from "../Comment/Comment";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
}));

function Post(props) {
  const { matchId, matchName, description, userCount, matchDate } = props;
  const [expanded, setExpanded] = useState(false);
  const formattedDate = new Intl.DateTimeFormat('en-US').format(new Date(matchDate));
  const [liked, setLiked] = useState(false);
  const [commentList, setCommentList] = useState([]); // Başlangıçta boş dizi
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const isInitialMount = useRef(true);
  const [player, setPlayer] = useState();

  useEffect(() => {
    setPlayer(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      refreshComments();
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const refreshComments = () => {
    fetch(`http://localhost:5033/api/Match/GetMatchComments?matchId=${matchId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          // Yalnızca dizi verisi alındığında commentList'e aktar
          if (Array.isArray(result)) {
            setCommentList(result);
          } else {
            setCommentList([]); // Dizi olmayan veri geldiğinde boş dizi ata
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      refreshComments();
    }
  }, []);

  const handleSubmit = () => {
    message.success("Maça Katıldınız");
  };

  return (
    <div className="postContainer">
  <Card className="postCard" sx={{ margin: '20px', width: '500px', backgroundColor: '#3cc1b8', padding: '16px' }}>
    <Link to={`/match-details/${matchId}`}>
      <Avatar sx={{ bgcolor: red[500], marginBottom: '16px' }} aria-label="recipe">
        {matchName.charAt(0).toUpperCase()}
      </Avatar>
    </Link>
    <Typography variant="h6" component="div">
      {"Maç Adı: " + matchName}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {"Maç tarihi: " + formattedDate}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {"Katılımcı Sayısı: " + userCount}
    </Typography>
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Button
        variant="contained"
        style={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          marginTop: '15px',
        }}
        onClick={handleSubmit}
      >
        Bu Maça katıl
      </Button>
    </CardContent>
    <CardActions disableSpacing>
      <IconButton onClick={handleLike} aria-label="add to favorites">
        <FavoriteIcon style={liked ? { color: "red" } : null} />
      </IconButton>
      <ExpandMore
        expand={expanded.toString()}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <CommentIcon />
      </ExpandMore>
    </CardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <Container fixed className="container">
        {error ? "Error" :
          isLoaded ? commentList.length > 0 ? commentList.map(comment => (
            <Comment key={comment.id} userId={comment.userId} userName={comment.userName} text={comment.text} />
          )) : "No comments yet" : "Loading..."}
      </Container>
    </Collapse>
  </Card>
</div>

  );
}

export default Post;
