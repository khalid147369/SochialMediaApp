import React, { useState, useContext, useEffect } from "react";
import TextAreaCBT from "../components/TextAreaCBT";
import Avata from "../components/Avata";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import Post from "../components/Post";
import UseGetAllPosts from "../hooks/UseGetAllPosts";
import { PostsContext } from "../context/PostsContext";
import { UserContext } from "../context/UserContext";
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary component
import useTokenRefresh from "../hooks/useTokenRefresh"; // Ensure this path is correct
import { backendUrl } from "../config";

// ============================================================
const { Header, Content } = Layout;
const Home = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { data = [], loading, error } = UseGetAllPosts();
  const postsContext = useContext(PostsContext);
  const { user } = useContext(UserContext);
  const { posts = [], setPosts } = postsContext;

  const { useTokenRefresh: refreshAuthToken } = useTokenRefresh(); // Call useTokenRefresh hook

  useEffect(() => {
    refreshAuthToken();
  }, []);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]); // Update dependency array to [data]

  useEffect(() => {
    if (posts && posts.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [posts]);

  if (!user) {
    refreshAuthToken();
    return <p>loading...</p>;
  }

  // Function to handle new post submission
  const handleNewPost = async (newPost) => {
    try {
      const addedPost = newPost; // Placeholder
      setPosts((prevPosts) => [addedPost, ...prevPosts]);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  if (!postsContext) {
    return <p>Error: PostsContext is not provided.</p>;
  }

  console.log(data);
  const isAvatarClosed = () => {
    setCollapsed(true);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ErrorBoundary>
      <Layout className="h-fit lg:max-w-5xl mx-auto">
        <Layout className=" ">
          <div className="fixed z-10 right-3 top-3 md:right-5 md:top-6">
            <Avata
              isClicked={isAvatarClosed}
              content={user.userName}
              imageSrc={`${backendUrl}${user.avatar}`}
            />
          </div>
          <Content
            className="bg-slate-200 mx-auto h-fit w-fit flex flex-col items-center gap-10 md:items-center md:w-auto"
            style={{
              margin: "24px 25px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {error && <p>Error: {error.message}</p>}
            {posts &&
              posts.map((post) => (
                <Post
                  key={post.id}
                  PostId={post.id}
                  title={post.title}
                  descreption={post.description}
                  imageName={post.imagePost}
                  avatarSrc={post.avatar}
                  likes={post.likes}
                  createdAt={post.publicatedAt}
                  commentsLenght={post.commentsLenght}
                  loading={loading}
                />
              ))}
          </Content>
          <div className="fixed right-1/2 transform translate-x-1/2 bottom-2">
            <TextAreaCBT onSubmit={handleNewPost} /> {/* Pass handleNewPost to TextAreaCBT */}
          </div>
        </Layout>
      </Layout>
    </ErrorBoundary>
  );
};

export default Home;
