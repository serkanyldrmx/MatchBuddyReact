import Post from "../Post/Post";
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import '../Home/Home.scss'; // Home.scss dosyasını import ediyoruz
import Container from '@mui/material/Container';
import Navbar from "../Navbar/Navbar";
import PostForm from "../Post/PostForm";

function Home() {
    const location = useLocation();
    const { user } = location.state || {};
    console.log(user);

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    //const classes = useStyles();

    useEffect(() => {
        fetch("http://localhost:5033/api/Match/GetMatchList")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error!!!</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <Navbar >
                </Navbar>
                <div className="container">
                <Container  maxWidth="sm" style={{margin:'5em'}}> 
                    <PostForm
                            key={2} // Her öğenin benzersiz bir anahtarı olması önemlidir
                            matchName={"deneme"}
                            description={"title"}
                            userCount={5}
                            matchDate={'2024-04-12 18:34:45.1600000'}></PostForm>

                    {postList.map(post => (
                        <Post
                            postId={post.postId}
                            key={post.id} // Her öğenin benzersiz bir anahtarı olması önemlidir
                            matchName={post.matchName}
                            description={post.description}
                            userCount={post.userCount}
                            matchDate={post.matchDate}>
                        </Post>
                    ))}
                </Container>
            </div>
            </div>
            
        );
    }
}
export default Home;