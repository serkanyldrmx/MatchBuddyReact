import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import User from './Components/User/User';
import UserUpdate from './Components/User/UserUpdate';
import UserLogin from './Components/UserLogin/UserLogin';
import RegisterForm from './Components/UserLogin/Register';
import Stadium from './Components/Stadium/Stadium';
import Players from './Components/Players/Players';
import Team from './Components/Team/Team';
import CreatTeam from './Components/Team/CreatTeam';
import ChatPage from './Components/Chat/ChatPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/stadium" element={<Stadium />} />
          <Route path="/players" element={<Players />} />
          <Route path="/team" element={<Team />} />
          <Route path="/create-team" element={<CreatTeam />} />
          <Route path="/userUpdate" element={<UserUpdate />} />
          <Route path="/chat" element={<ChatPage />} /> {/* Yeni eklenen sohbet sayfası */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
