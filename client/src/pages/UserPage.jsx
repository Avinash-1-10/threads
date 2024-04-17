import React from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import posts from "../data/posts";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      {posts.map((post, index) => (
        <UserPost
          key={index}
          likes={post.likes}
          replies={post.replies}
          postImg={post.postImg}
          postTitle={post.postTitle}
        />
      ))}
    </>
  );
};

export default UserPage;
