import React, { useEffect, useState } from 'react'
import UserPost from '../components/UserPost';
import useShowToast from '../hooks/useShowToast';
import axios from 'axios';

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    try {
      const { data } = await axios.get("/api/v1/post");
      setPosts(data.data);
    } catch (error) {
      showToast("Error", error.response.data.message || error.message);
    }
  };

  useEffect(() => {
    getPosts();
  },[])
  return (
    <div>
      {posts.map((post) => (
        <UserPost key={post._id} post={post} user={post.postByDetails}/>
      ))}
    </div>
  )
}

export default HomePage