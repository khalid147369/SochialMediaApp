import { useState, useEffect, useRef } from "react";
import TextAreaCBT from "../components/TextAreaCBT";
import Avata from "../components/Avata";
import PostsSkeleton from "../components/PostsSkeleton";
import { client, w3cwebsocket as W3CWebSocket } from "websocket";
import { Empty, Layout, theme } from "antd";
import Post from "../components/Post";

import "./Home.css";
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary component
import { backendUrl, backendUrlWs } from "../config";
import Cookies from "universal-cookie"; // Import universal-cookie
import { useDispatch, useSelector } from "react-redux";
import { getallPosts, sendPostAction } from "../features/postsSlice";
import { data, useNavigate } from "react-router-dom";

// ============================================================
const { Content } = Layout;

const Home = () => {
  //webcket==

  //webcket==

  const [collapsed, setCollapsed] = useState(true);
  // const { posts = [], setPosts } = postsContext;
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);



  useEffect(() => {
    dispatch(getallPosts());
  }, [dispatch]);


  useEffect(() => {
    if (posts && posts.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [posts]);

  const isAvatarClosed = () => {
    setCollapsed(true);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // show all posts
  const showPosts = posts.map((post) => (
    <Post
      key={post.id}
      PostId={post.id}
      title={post.title}
      descreption={post.description}
      imageName={post.imagePost}
      avatarSrc={user.avatar}
      likes={post.likes}
      createdAt={post.publicatedAt}
      commentsLenght={post.commentsLenght}
    />
  ));

  return (
    <Layout
      style={
        posts.lenght === 0 ? { height: "100vh" } : { height: "fit-content" }
      }
      className="   lg:max-w-5xl mx-auto p-10 "
    >
      <Layout className=" bg-transparent ">
        <div className="fixed z-10 right-3 top-3 md:right-5 md:top-6 h-fit w-fit ">
          <Avata
            isClicked={isAvatarClosed}
            content={user.userName}
            imageSrc={`${backendUrl}${user.avatar}`}
          />
        </div>
        <Content
          className=" bg-transparent  mx-auto md:mx-0 h-fit w-fit flex flex-col items-center gap-10 md:items-center md:w-auto mb-20"
          style={{
            margin: "24px 25px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {loading ? (
            <PostsSkeleton />
          ) : posts.lenght === 0 ? (
            <Empty
              className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              description={"no favorites to show"}
            />
          ) : (
            showPosts
          )}
        </Content>
        <div className="fixed right-1/2 transform translate-x-1/2 bottom-2 h-2">
          <TextAreaCBT />
        </div>
      </Layout>
    </Layout>
  );
};

export default Home;
