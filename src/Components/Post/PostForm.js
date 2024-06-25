import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, OutlinedInput, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import axios from 'axios';
import enUS from 'antd/es/locale/en_US';
import "./Post.css"; // Bu yolun doğru olduğundan emin olun

dayjs.extend(buddhistEra);
const defaultValue = dayjs();

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '20px',
  width: '460px',
  backgroundColor: '#6ded6d', // Açık yeşil rengi
  padding: '20px',
  borderRadius: '15px',
}));

const CompactOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  marginBottom: '15px',
  '& .MuiOutlinedInput-input': {
    padding: '10px',
  },
  '& fieldset': {
    borderRadius: '10px',
  },
  width: 'calc(50% - 10px)', // İki inputun yan yana olması için genişliği belirliyoruz
}));

const FullWidthOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  marginBottom: '15px',
  '& .MuiOutlinedInput-input': {
    padding: '10px',
  },
  '& fieldset': {
    borderRadius: '10px',
  },
  width: '100%',
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '100%',
  borderRadius: '10px',
  '& .ant-picker': {
    borderRadius: '10px',
  },
}));

function PostForm() {
  const [matchName, setMatchName] = useState("");
  const [matchDate, setMatchDate] = useState(defaultValue.toDate());
  const [participantCount, setParticipantCount] = useState(8);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const match = {
      matchName,
      matchDate,
      userCount: parseInt(participantCount, 10),
      description,
      isActive: 1,
      stadiumId: 2
    };

    axios.post("http://localhost:5033/api/Match/SaveMatch", match)
    .then((response) => {
      console.log(response);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const onChange = (_, dateStr) => {
    setMatchDate(new Date(dateStr));
  };

  return (
    <div className="postContainer">
      <StyledCard>
        <CardHeader
          title={
            <Box display="flex" justifyContent="space-between">
              <CompactOutlinedInput
                variant="outlined"
                placeholder="Maç Adı: "
                inputProps={{ maxLength: 25 }}
                value={matchName}
                onChange={(e) => setMatchName(e.target.value)}
              />
              <CompactOutlinedInput
                type="number"
                variant="outlined"
                placeholder="Katılacak Oyuncu Sayısı: "
                inputProps={{ min: 8, maxLength: 2 }}
                value={participantCount}
                onChange={(e) => {
                  if (e.target.value >= 8) {
                    setParticipantCount(e.target.value);
                  }
                }}
              />
            </Box>
          }
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '15px' }}>
            Maç Tarihi:
            <StyledDatePicker
              defaultValue={defaultValue}
              showTime
              onChange={onChange}
              locale={enUS}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <FullWidthOutlinedInput
              variant="outlined"
              multiline
              placeholder="Açıklama : "
              inputProps={{ maxLength: 250 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Typography>
        </CardContent>
        <Button
          variant="contained"
          style={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            marginTop: '15px',
          }}
          onClick={handleSubmit}
        >
          Maçı Kaydet
        </Button>
      </StyledCard>
    </div>
  );
}

export default PostForm;
