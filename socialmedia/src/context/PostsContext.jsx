import React, { createContext, useState, useEffect } from "react";
import UseGetAllPosts from "../hooks/UseGetAllPosts";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const { data, loading, error } = UseGetAllPosts();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  return (
    <PostsContext.Provider value={{ posts, setPosts, loading, error }}>
      {children}
    </PostsContext.Provider>
  );
};
