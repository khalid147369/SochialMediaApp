import { useState, useEffect, useRef } from "react";
import TextAreaCBT from "../components/TextAreaCBT";
import Avata from "../components/Avata";
import PostsSkeleton from "../components/PostsSkeleton";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Layout,
  theme,
  Typography,
  Row,
  Col,
} from "antd"; // Import Row and Col components
import Post from "../components/Post";
import "../components/Post.css";
import "./Home.css";
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary component
import { backendUrl, backendUrlWs } from "../config";
import Cookies from "universal-cookie"; // Import universal-cookie
import { useDispatch, useSelector } from "react-redux";
import { getallPosts, getNextallPosts } from "../features/postsSlice";
import { data, Navigate, useNavigate } from "react-router-dom";
import PopUpBox from "../components/PopUpBox";
import { EditOutlined } from "@ant-design/icons";
// ============================================================
const { Content } = Layout;

const Home = () => {
  //webcket==

  //webcket==

  const [collapsed, setCollapsed] = useState(false);
  const [show, setShow] = useState(false);
  // const { posts = [], setPosts } = postsContext;
  const dispatch = useDispatch();
  const { posts, loading, pageNumber, nextLogin } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.user);
const navigate = useNavigate();
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
    if (isBottom && pageNumber !== -1) {
      dispatch(getNextallPosts(pageNumber + 1));
      console.log(` page number : ${pageNumber}`);
    }
  }, [isBottom, dispatch, pageNumber]);

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
      postColor={post.postColor}
    />
  ));

  return (
    <Layout
      // style={
      //   posts.length === 0 ? { height: "fit-content" } : { height: "100vh" }
      // }
      style={{ height: "calc(100vh - 64px)" }}
      onScroll={handleScroll}
      className=" py-0 my-0  lg:max-w-5xl md:mx-auto md:p-10   overflow-y-auto   "
    >
      <div className="postBackround h-fit mb-1 py-5">
        <Row className="flex border  justify-center px-4 py-2 rounded-full w-fit gap-8 items-center  mx-auto ">
          <Col>
            <Avatar  src={`${backendUrl}/${user.avatar}`} />
          </Col>
          <Col>
            <p>add post !</p>
          </Col>
          <Col>
            <Button onClick={() => setShow(true)}>
              <EditOutlined />
            </Button>
          </Col>
        </Row>
      </div>

      {show ? (
        <PopUpBox className="custom-popup-box" show={() => setShow(false)}>
          <TextAreaCBT className=" md:mt-0  flex gap-2 mx-auto items-center" />
        </PopUpBox>
      ) : (
        ""
      )}

      <Layout
        className=" bg-transparent py-0 my-0  "
        style={{ marginBottom: "20px" }}
      >
        <div className="fixed  z-10 right-3 top-2 md:right-5 md:top-6 h-fit w-fit ">
          <Avata
            isClicked={isAvatarClosed}
            content={user.userName}
            imageSrc={`${backendUrl}${user.avatar}`}
          />
        </div>
        <Content
          className=" bg-transparent mx-0 px-0 pt-0 mt-0    md:mx-0 h-fit w-full flex flex-col   md:items-center md:w-auto mb-72"
          style={{
            margin: "25px",
            padding: "24px",
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {loading ? (
            <>
              <PostsSkeleton />
              <PostsSkeleton />
            </>
          ) : posts.length === 0 ? (
            <Empty
              className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              description={"no favorites to show"}
            />
          ) : (
            showPosts
          )}
          <PostsSkeleton className={" mb-56"} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
