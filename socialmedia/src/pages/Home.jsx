import { useState, useEffect, useRef } from "react";
import TextAreaCBT from "../components/TextAreaCBT";
import Avata from "../components/Avata";
import PostsSkeleton from "../components/PostsSkeleton";
import { Button, Empty, Layout, theme } from "antd";
import Post from "../components/Post";

import "./Home.css";
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary component
import { backendUrl, backendUrlWs } from "../config";
import Cookies from "universal-cookie"; // Import universal-cookie
import { useDispatch, useSelector } from "react-redux";
import { getallPosts, getNextallPosts } from "../features/postsSlice";
import { data, useNavigate } from "react-router-dom";
import PopUpBox from "../components/PopUpBox";

// ============================================================
const { Content } = Layout;

const Home = () => {
  //webcket==

  //webcket==

  const [collapsed, setCollapsed] = useState(true);
  // const { posts = [], setPosts } = postsContext;
  const dispatch = useDispatch();
  const { posts, loading,pageNumber } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);

  const scrollRef = useRef(null);
  const [isBottom, setIsBottom] = useState(false);


  const handleScroll = (e) => {
    const element = e.target;
    // Use a threshold to account for fractional pixels
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight <= 5;
    setIsBottom(isAtBottom);
  };

  useEffect(() => {
    dispatch(getallPosts());
  }, [dispatch]);



  const isAvatarClosed = () => {
    setCollapsed(true);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {
    if (isBottom && pageNumber !==-1) {
      dispatch(getNextallPosts(pageNumber +1));
      console.log(` page number : ${pageNumber}`)
    }
  }, [isBottom, dispatch ,pageNumber]);

  if (!posts) {
    return "test"
  }
  // show all posts
  const showPosts = posts.map((post) => (
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
    />
  ));

  return (

    <Layout
      style={
        posts.length === 0 ?  { height: "fit-content"  } :{ height: "100vh" }
      }
      onScroll={handleScroll}
      className="  lg:max-w-5xl md:mx-auto md:p-10   overflow-y-auto "
    >
      <PopUpBox  className="custom-popup-box">
              <TextAreaCBT className="mt-28 md:mt-0  flex gap-2 mx-auto items-center" />

      </PopUpBox>

      <Layout className=" bg-transparent " >
        <div className="fixed z-10 right-3 top-2 md:right-5 md:top-6 h-fit w-fit ">
          <Avata
            isClicked={isAvatarClosed}
            content={user.userName}
            imageSrc={`${backendUrl}${user.avatar}`}
          />
        </div>
        <Content
        
          className=" bg-transparent mx-0 px-0   md:mx-0 h-fit w-full flex flex-col  gap-10 md:items-center md:w-auto mb-20"
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
          ) : posts.length === 0 ? (
            <Empty
              className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              description={"no favorites to show"}
            />
          ) : (
            showPosts
          )}
        </Content>
      </Layout>
    </Layout>
  
  );
};

export default Home;
