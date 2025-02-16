import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Button, Empty, Layout, theme } from "antd";
import Post from "../components/Post";
import ErrorBoundary from "../components/ErrorBoundary";
import { getNextUserPosts } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import PostsSkeleton from "../components/PostsSkeleton";
import "../App.css";
import Cookies from "universal-cookie";
import Avata from "../components/Avata";
import { backendUrl } from "../config";
function MyPosts({ myPosts, loading, errors, children ,pageNumber ,authorId}) {
  const { Content } = Layout;
  const [isBottom ,setIsBottom]   = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading ,userPostsLoading} = useSelector((state) => state.user);


  const [collapsed, setCollapsed] = useState(true);
const containerRef = useRef()

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleScroll = (e) => {
    const element = e.target;
    // Use a threshold to account for fractional pixels
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight <=10;
    setIsBottom(isAtBottom);
  };

  useEffect(() => {
    if (isBottom && pageNumber !== -1 && !userPostsLoading) {
      dispatch(getNextUserPosts(pageNumber +1)); 

    }

  }, [dispatch , isBottom ,pageNumber ,userPostsLoading ]);



  useEffect(() => {
    if (errors && errors.response && errors.response.status === 401) {
      navigate("/login");
    }
  }, [errors, navigate]);



  const isAvatarClosed = () => {
    setCollapsed(true);
  };


  return (
    <Layout
      style={{ height: "calc(100vh - 64px)"  }}
      className="overflow-y-auto   "
      onScroll={handleScroll}
      ref={containerRef}
    >
      <div className=" mb-1 h-fit">{children}</div>
      <div className="fixed z-10 right-3 top-3 md:right-5 md:top-6 h-fit w-fit ">
        <Avata
          isClicked={isAvatarClosed}
          content={user.userName}
          imageSrc={`${backendUrl}${user.avatar}`}
        />
      </div>
      <Layout className="h-fit backroundgridient ">
        <Content
          className="flex mx-0 px-0 md:mx-0 flex-col items-center  h-fit w-full md:w-auto bg-transparent"
          style={{
            // margin: "24px 25px",
            // padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {loading ? (
            <div
              style={{ height: "calc(100vh - 64px)" }}
              className="  w-screen"
            >
              {/* <PostsSkeleton />
              <PostsSkeleton />
              <PostsSkeleton /> */}
            </div>
          ) : myPosts  && myPosts.length === 0 ? (
            <Empty
              className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              description={"no posts to show"}
            />
          ) : (
            myPosts &&
            myPosts.map((post) => (
              <Post
                key={post.id}
                PostId={post.id}
                title={post.title}
                descreption={post.description}
                imageName={post.imagePost}
                avatarSrc={post.avatar}
                likes={post.likes}
                commentsLenght={post.commentsLenght}
                createdAt={post.publicatedAt}
                postColor={post.postColor}
                authorId={authorId}
              />
            ))
           
          )} <div  className=" w-full mb-52 ">
          <PostsSkeleton  />

          </div>
          
        </Content>
      </Layout>
    </Layout>
  );
}
MyPosts.propTypes = {
  myPosts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object,
  children: PropTypes.node,
};

export default MyPosts;
