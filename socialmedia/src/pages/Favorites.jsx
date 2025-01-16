import { useState, useContext, useEffect } from 'react';
import TextAreaCBT from "../components/TextAreaCBT";
import Avata from "../components/Avata";
import { Button, Layout, Menu, theme } from "antd";
import Post from "../components/Post";
import { UserContext } from "../context/UserContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { FavoritesContext } from '../context/FavoritesContext'; // Import FavoritesContext
import useTokenRefresh from '../hooks/useTokenRefresh';

function Favorites() {
  const { Content } = Layout;
  const { user } = useContext(UserContext);
  const { favorites, loading, error } = useContext(FavoritesContext); // Use FavoritesContext
  const { useTokenRefresh:refreshToken } = useTokenRefresh(); // Destructure to get the refreshToken function

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!user) {
    refreshToken();
  }
  useEffect(() => {
    if (favorites.length > 0){
      window.scrollTo(0, document.body.scrollHeight);

    }
    },[favorites]);
  
  return (
    <ErrorBoundary>
      <Layout className="h-fit">
        <Layout className="h-fit">
          <Content
            className="flex flex-col items-center gap-10 h-fit w-fit md:w-auto"
            style={{
              margin: "24px 25px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {favorites &&
              favorites.map((post) => (
                <Post
                  key={post.id}
                  PostId={post.id}
                  title={post.title}
                  descreption={post.description}
                  imageName={post.imagePost}
                  avatarSrc={post.avatar}
                  likes={post.likes}
                />
              ))}
          </Content>
        </Layout>
      </Layout>
    </ErrorBoundary>
  );
}

export default Favorites;