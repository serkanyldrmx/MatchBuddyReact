import React, { useState, useEffect } from 'react';
import { CardContent, InputAdornment, OutlinedInput, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { red } from '@mui/material/colors';
import { styled } from '@mui/system';

const StyledCardContent = styled(CardContent)({
  marginBottom: '10px', // Yorumlar arasında boşluk
  padding: '10px', // İçerik etrafında boşluk
  backgroundColor: '#f1f1f1', // Yorum kutusunun arka plan rengi
  borderRadius: '10px', // Yumuşak köşeler
});

function Comment(props) {
  const { text, userId, userName } = props;
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    setPlayer(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <StyledCardContent>
      <OutlinedInput
        disabled
        id="outlined-adornment-amount"
        multiline
        inputProps={{ maxLength: 250 }} // Max karakter uzunluğu
        fullWidth
        value={text}
        startAdornment={
          <InputAdornment position="start">
            <Link to={'/users/' + userId}>
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          </InputAdornment>
        }
        style={{ color: "black", backgroundColor: 'white' }}
      />
    </StyledCardContent>
  );
}

export default Comment;
